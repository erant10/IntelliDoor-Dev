/*
* Home model
**/

var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
const config = require('config');

const PersonGroup = require('faceAPI/persongroup');
const Person = require('faceAPI/person');

module.exports = {

    /**
     * Create A Home
     * @param {Object} homeObject - A home object the should be added to the DB.
     * @param {function} callback - The callback that handles the response.
     */
    create(homeObject, callback) {
        // TODO: check that homeObject.homeId and homeObject.apartment are not already taken
        // TODO: check that homeObject.buildingId exists
        // create a person group to the face API
        PersonGroup.create(homeObject, function(error, results) {
            if(error || results.status !== 200) {
                callback(error, { message: "faceAPI wasn't able to create a person group", faceApiResponse: results } )
            } else {
                // the Person Group was created successfully;
                // Insert the home into the Homes Table
                const DBconfig = config.get('db');
                var connection = new Connection(DBconfig);

                connection.on('connect', function (err) {
                    // If no error, then good to proceed.
                    const query = "INSERT IntelliDoorDB.dbo.Homes " +
                                    "(homeId, description, apartment, buildingId) " +
                                  "OUTPUT INSERTED.homeId VALUES (@homeId, @description, @apartment, @buildingId);";
                    request = new Request(query, function (error) {
                        if (error) {
                            console.log(error);
                        }
                        // parse the results to readable format
                        jsonArray = []
                        results.forEach(function (columns) {
                            var rowObject ={};
                            columns.forEach(function(column) {
                                rowObject[column.metadata.colName] = column.value;
                            });
                            jsonArray.push(rowObject)
                        });
                        // call the callback function
                        callback(null, jsonArray);
                    });

                    // add parameters to the request
                    request.addParameter('homeId', TYPES.NVarChar, homeObject.homeId);
                    request.addParameter('description', TYPES.NVarChar, homeObject.description);
                    request.addParameter('apartment', TYPES.Int, homeObject.apartment);
                    request.addParameter('buildingId', TYPES.NVarChar, homeObject.buildingId);

                    // perform insertion
                    request.on('row', function (columns) {
                        columns.forEach(function (column) {
                            if (column.value === null) {
                                console.log('NULL');
                            } else {
                                console.log("Home id of inserted item is " + column.value);
                            }
                        });
                    });
                    // perform insertion
                    request.on('row', function (columns) {
                        results.push(columns);
                    });

                    connection.execSql(request);

                });

            }

        });
    },

    // Get Home by ID
    getOne(homeId, callback) {
        // TODO: implement selecting an home
    }
}