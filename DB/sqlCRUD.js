
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
const config = require('config');
const parsers = require('../helpers/parsers');



module.exports = {

    /**
     *
     * @param query
     * @param params
     * @param callback
     */
    SqlInsert(query, params, callback) {
        var results = [];
        const DBconfig = config.get('db');
        var connection = new Connection(DBconfig);

        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            request = new Request(query, function (error) {
                if (error) {
                    callback(error, null);
                }
                // parse the results to readable format
                jsonArray = parsers.parseSqlOutput(results);

                // call the callback function when done
                callback(null, jsonArray);
            });
            params.forEach(function(param){
                request.addParameter(param.name, param.type, param.value);
            });

            // perform insertion
            request.on('row', function (columns) {
                results.push(columns);
            });

            connection.execSql(request);
        });

    },

    /**
     *
     * @param query
     * @param idParam
     * @param callback
     */
    sqlGet(query, idParam, callback){
        var results = [];
        const DBconfig = config.get('db');
        var connection = new Connection(DBconfig);

        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            request = new Request(query, function (err) {
                if (err) {
                    return callback(err);
                }
                // parse the results to readable format
                jsonArray = parsers.parseSqlOutput(results);

                // call the callback function
                callback(null, jsonArray);

            });
            // add parameters to the request
            request.addParameter(idParam.name, idParam.type, idParam.value);

            // perform selection
            request.on('row', function (columns) {
                results.push(columns);
            });

            connection.execSql(request);
        });

    },
    /**
     *
     * @param query
     * @param idParam
     * @param callback
     */
    sqlUpdate(query, params, callback){
        var results = [];
        const DBconfig = config.get('db');
        var connection = new Connection(DBconfig);

        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            request = new Request(query, function (err) {
                if (err) {
                    return callback(err);
                }
                // parse the results to readable format
                jsonArray = parsers.parseSqlOutput(results);

                // call the callback function
                callback(null, jsonArray);

            });
            params.forEach(function(param){
                request.addParameter(param.name, param.type, param.value);
            });

            // perform selection
            request.on('row', function (columns) {
                results.push(columns);
            });

            connection.execSql(request);
        });

    },

}