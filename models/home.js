/*
* Home model
**/

var TYPES = require('tedious').TYPES;
const sqlDB = require('../DB/sqlCRUD');

// require faceAPI methods
const PersonGroup = require('./faceAPI/persongroup');

module.exports = {

    /**
     * Create A Home
     * @param {Object} homeObject - A home object the should be added to the DB.
     * @param {function} callback - The callback that handles the response.
     */
    create(homeObject, callback) {
        // create a person group in the face API
        PersonGroup.create(homeObject, function(error, results) {
            if(error || results.status !== 200) {
                callback(error, { status: results.status, message: "faceAPI wasn't able to create a person group", response: results });
            } else {
                // the Person Group was created successfully - now insert the home into the Homes Table
                const query = "INSERT IntelliDoorDB.dbo.Homes " +
                    "(homeId, description, apartment, buildingId) " +
                    "OUTPUT INSERTED.homeId VALUES (@homeId, @description, @apartment, @buildingId);";

                const params = [
                    {
                        name: 'homeId',
                        type: TYPES.NVarChar,
                        value: homeObject.homeId
                    },
                    {
                        name: 'description',
                        type: TYPES.NVarChar,
                        value: homeObject.description
                    },
                    {
                        name: 'apartment',
                        type: TYPES.Int,
                        value: homeObject.apartment
                    },
                    {
                        name: 'buildingId',
                        type: TYPES.NVarChar,
                        value: homeObject.buildingId
                    }
                ];

                sqlDB.SqlInsert(query, params, function(error, results) {
                    if(error) {
                        callback(error, {status: 400, response: results});
                    } else {
                        callback(null, {status: 200, response: results});
                    }
                });
            }

        });
    },

    // Update default resident
    update(buildingId, homeNum, username, callback) {
        const query = "UPDATE Homes \n" +
            "  SET defaultResident = (SELECT residentId FROM Residents WHERE username = @username) \n" +
            "  WHERE homeId = @homeId";
        const params = [
            {
                name: 'username',
                type: TYPES.NVarChar,
                value: username
            },
            {
                name: 'homeId',
                type: TYPES.NVarChar,
                value: buildingId+"-apt"+homeNum
            }

        ];

        sqlDB.sqlUpdate(query, params, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, result);
            }
        });
    }
}