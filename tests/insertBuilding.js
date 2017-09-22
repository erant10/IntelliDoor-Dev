var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
var config = require('config');
var bcrypt = require('bcrypt');
const saltRounds = 10;

const BUILDING_ID = "building1",
    ADDRESS = "21 Washington St. NY",
    ADMIN_NAME= "erantoledano",
    ADMIN_PASSWORD = "12345678";


var DBconfig = config.get('DB')

var connection = new Connection(DBconfig);
connection.on('debug', function(eror) { console.log('debug:', eror);});
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log("Connected");

    bcrypt.hash(ADMIN_PASSWORD, saltRounds, function(err, hash) {
        request = new Request("INSERT IntelliDoorDB.dbo.Buildings (buildingId, address, adminName, adminPassword) OUTPUT INSERTED.buildingId VALUES (@buildingName, @address, @adminName, @adminPassword);", function (err) {
            if (err) {
                console.log(err);
            }
        });
        request.addParameter('buildingName', TYPES.NVarChar, BUILDING_ID);
        request.addParameter('address', TYPES.NVarChar, ADDRESS);
        request.addParameter('adminName', TYPES.NVarChar, ADMIN_NAME);
        request.addParameter('adminPassword', TYPES.NVarChar, hash);
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

});
