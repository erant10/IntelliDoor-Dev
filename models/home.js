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
        // TODO: check that homeObject.homeId and homeObject.apartment are not already taken
        // TODO: check that homeObject.buildingId exists
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
                        // TODO: remove the home from the face API
                        callback(error, {status: 400, response: results});
                    } else {
                        callback(null, {status: 200, response: results});
                    }
                });
            }

        });
    },

    // Get Home by ID
    getOne(homeId, callback) {
        // TODO: implement selecting an home
    },

    // Get Home by ID
    remove(homeId, callback) {
        // TODO: implement removing an home
    }
}