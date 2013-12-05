pg = require('pg')

Object.prototype.list = function() {
	return Array.prototype.slice.apply(this,[0])
}

module.exports = function(database,schema) {
	pg.connect(database, function(err, client, done) {
		client.query("select proc.proname::text from pg_proc proc join pg_namespace namesp on proc.pronamespace = namesp.oid where namesp.nspname = '" + schema + "'", function(err, result) {
			if (err) return console.log('Failed to read methods from database ' + database);
			for (var i = 0; i < result.rows.length; ++i ) {
				var fun = result.rows[i].proname;
				global[fun] = function() {
					var args = arguments.list()
					var callback = args.pop()
					var query = "select " + fun + "('" + args.join("','") + "')" 
					client.query(query, function(err, result) {
						if (!err) return callback.apply(global, result.rows)
						console.log(err)
						callback.apply(global,[])
					})
				}
			}
		})
	})
}
