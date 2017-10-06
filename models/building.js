/*
* Building model
**/

var TYPES = require('tedious').TYPES;
const sqlDB = require('../DB/sqlCRUD');
const parsers = require('../helpers/parsers');

module.exports = {

    /**
     * Create a building.
     * @param {Object} buildingObj
     * @param {function} callback
     */
    create(buildingObj, callback) {
        const query =  "INSERT IntelliDoorDB.dbo.Buildings (buildingId, address, adminName, adminPassword) " +
            "OUTPUT INSERTED.buildingId VALUES (@buildingName, @address, @adminName, @adminPassword);";

        const params = [
                {
                    name: 'buildingName',
                    type: TYPES.NVarChar,
                    value: buildingObj.buildingId
                },
                {
                    name: 'address',
                    type: TYPES.NVarChar,
                    value: buildingObj.address
                },
                {
                    name: 'adminName',
                    type: TYPES.NVarChar,
                    value: buildingObj.adminName
                },
                {
                    name: 'adminPassword',
                    type: TYPES.NVarChar,
                    value: buildingObj.hashedPassword
                }
        ];

        sqlDB.SqlInsert(query, params, function(error, results) {
            if (error) {
                callback(error, {status: 400, response: results});
            } else {
                callback(null, {status: 200, response: results});
            }
        });

    },

    /**
     * Get building by ID
     * @param buildingId
     * @param callback
     */
    getOne(buildingId, callback) {
        const query = "SELECT * FROM IntelliDoorDB.dbo.Buildings WHERE buildingId = @buildingId;";
        const idParam = {
            name: 'buildingId',
            type: TYPES.NVarChar,
            value: buildingId
        };

        sqlDB.sqlGet(query, idParam, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, result);
            }
        });
    },

    getEntries(buildingId, callback) {
        const query = "SELECT E.personId, E.time, E.recognised, E.faceUrl, E.authorized ,E.homeId AS homeEntered, R.firstName, R.lastName\n" +
            "  FROM Entries E\n" +
            "  JOIN Residents R ON E.homeId = R.homeId\n" +
            "  JOIN Homes H ON E.homeId = H.homeId\n" +
            "  JOIN Buildings B ON H.buildingId = B.buildingId\n" +
            "  WHERE B.buildingId = @buildingId;";
        const idParam = {
            name: 'buildingId',
            type: TYPES.NVarChar,
            value: buildingId
        };

        sqlDB.sqlGet(query, idParam, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, result);
            }
        });

    },

    getHomes(buildingId, callback) {
        const query = "SELECT H.homeId, H.apartment, H.defaultResident, H.description, R.residentId, R.userName, R.password, R.firstName, R.lastName, R.phoneNumber, R.description, R.email\n" +
            "  FROM Homes H\n" +
            "  LEFT JOIN Residents R ON H.homeId = R.homeId\n" +
            "  WHERE H.buildingId = 'building1'"
        const idParam = {
            name: 'buildingId',
            type: TYPES.NVarChar,
            value: buildingId
        };
        sqlDB.sqlGet(query, idParam, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, parsers.groupBy(result, 'homeId'));
            }
        });
    }
}