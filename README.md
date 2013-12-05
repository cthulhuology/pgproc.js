pgproc.js
=========

Automagic wrapper for Postgres stored procedures to Node functions

Getting Started
---------------

        pgproc = require('pgproc')
        pgproc('postgresql://localhost:5432/dbname', 'public')
        
        my_stored_procedure('call as if javascript', function(rows) { console.log(rows) })
        
This module creates closures around a Postgres database connection and exports the stored procedures in the specified
schema as javascript functions.  Each closure takes as its first N args the args passed to the stored procedure, with
the (N+1)th argument being a callback to evaluate upon the result of the stored procedure call.

This methodology is borrowed from my Jawas web server project.  This way you create an API for your data in your 
database, and you never write raw SQL in your code.  There is a slight performance hit for the stored procedures in
Postgresql, but that cost is usually far outweighed by the utility.

NB: if you invoke pgproc as above, you will need to restart your app each time you add or remove a stored procedure.
You can always call it again on the same database to rebuild the stored procedure list, and it will just replace
the old functions.


Dave
