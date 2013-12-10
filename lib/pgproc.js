pg = require('pg')

Object.prototype.list = function() {
	return Array.prototype.slice.apply(this,[0])
}

module.exports = function(database,schema) {
	pg.connect(database, function(err, client, done) {
		client.query("create or replace function help() returns json as $$ declare _json json; begin select into _json array_to_json(array_agg(array_to_json(array_prepend(proname::text, proargnames::text[])))) as methods from pg_proc proc join pg_namespace namesp on proc.pronamespace = namesp.oid where namesp.nspname = '" + schema + "'; return _json; end $$ language plpgsql;", function(err,result) {
			if (err) return console.log('Failed to create help method',err)
		});
		client.query("select proc.proname::text from pg_proc proc join pg_namespace namesp on proc.pronamespace = namesp.oid where namesp.nspname = '" + schema + "'", function(err, result) {
			if (err) return console.log('Failed to read methods from database ' + database);
			for (var i = 0; i < result.rows.length; ++i ) {
				(function(fun) {
					global[fun] = function() {
						var args = arguments.list()
						var callback = args.pop()
						var query = "select " + fun + "(" ;
						for (var i = 0; i < args.length; ++i) query += "$" + (i+1)
						query += ")"
						client.query(query, args, function(err, result) {
							if (!err) return callback.apply(global, result.rows)
							console.log(err)
							callback.apply(global,[])
						})
					}
				})(result.rows[i].proname)
			}
		})
	})
}
