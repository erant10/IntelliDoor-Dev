/*
* Building model
**/
var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
const config = require('config');


module.exports = {

    // Create building
    create(buildingObj, callback) {
        const DBconfig = config.get('db');
        var connection = new Connection(DBconfig);

        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            const query =  "INSERT IntelliDoorDB.dbo.Buildings (buildingId, address, adminName, adminPassword) " +
                "OUTPUT INSERTED.buildingId VALUES (@buildingName, @address, @adminName, @adminPassword);";
            request = new Request(query, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            // add parameters to the request
            request.addParameter('buildingName', TYPES.NVarChar, buildingObj.buildingId);
            request.addParameter('address', TYPES.NVarChar, buildingObj.address);
            request.addParameter('adminName', TYPES.NVarChar, buildingObj.adminName);
            request.addParameter('adminPassword', TYPES.NVarChar, buildingObj.hashedPassword);

            // perform insertion
            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        console.log("Building id of inserted item is " + column.value);
                    }
                });
            });
            connection.execSql(request);
            console.log("Error: ", err);

        });

    },

    // Get building by ID
    getOne(buildingId, callback) {
        var results = [];
        const DBconfig = config.get('db');
        var connection = new Connection(DBconfig);

        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            const query = "SELECT * FROM IntelliDoorDB.dbo.Buildings WHERE buildingId = @buildingId;";
            request = new Request(query, function (err) {
                if (err) {
                    return callback(err);
                }
                jsonArray = []
                results.forEach(function (columns) {
                    var rowObject ={};
                    columns.forEach(function(column) {
                        rowObject[column.metadata.colName] = column.value;
                    });
                    jsonArray.push(rowObject)
                });
                callback(null, jsonArray);

            });
            // add parameters to the request
            request.addParameter('buildingId', TYPES.NVarChar, buildingId);

            // perform selection
            request.on('row', function (columns) {
                results.push(columns);
            });

            connection.execSql(request);
        });
    }
}