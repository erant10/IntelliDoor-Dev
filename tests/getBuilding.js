var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;

function getRow(connection, callback) {
    var results = [];

    connection.on('debug', function(eror) { console.log('debug:', eror);});
    connection.on('connect', function (err) {
        // If no error, then good to proceed.
        console.log("Connected");

        request = new Request("SELECT * FROM IntelliDoorDB.dbo.Buildings WHERE buildingId = @buildingName;", function (err) {
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
        request.addParameter('buildingName', TYPES.NVarChar, BUILDING_ID);

        request.on('row', function (rowObject) {
            results.push(rowObject);
        });

        connection.execSql(request);
        console.log("Error: ", err);
    });
}
const BUILDING_ID= "building1";

const DBconfig = {
    userName: "intellidoor",
    password: "IOT1234!@#$",
    server: "intellidoor.database.windows.net",
    options: {
        encrypt: true,
        database: "IntelliDoorDB"
    }
};
var connection = new Connection(DBconfig);

getRow(connection, function(err, json) {
    console.log("results: " + JSON.stringify(json));
});