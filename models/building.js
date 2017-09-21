/*
* Building model
**/

var TYPES = require('tedious').TYPES;
const sqlDB = require('../DB/sqlCRUD');

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
            if(error) {
                callback(error, results);
            } else {
                callback(null, results);
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
    }
}