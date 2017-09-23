/*
* Person model
**/

var TYPES = require('tedious').TYPES;
const Person = require('./faceAPI/person');
const sqlDB = require('../DB/sqlCRUD');


module.exports = {

    /**
     * Create Resident
     * @param {Object} residentObject
     * @param {function} callback
     */
    create(residentObject, callback) {
        // create a person in the face API
        const personData = {
            name: residentObject.firstName + " " + residentObject.lastName,
            description: residentObject.description
        };
        Person.create(residentObject.homeId, personData, function(error, results) {
            if(error || results.status !== 200) {
                callback(error, {
                    status: results.status,
                    message: "faceAPI wasn't able to create a person",
                    response: results });
            } else {
                const personId = results.response.id;
                const query =
                    "INSERT IntelliDoorDB.dbo.Residents " +
                        "(residentId, firstName, lastName, username, password, " +
                          "email, phoneNumber, homeId, description) " +
                    "OUTPUT INSERTED.residentId " +
                    "VALUES " +
                        "(@residentId, @firstName, @lastName, @username, @password," +
                        " @email, @phoneNumber, @homeId, @description);";

                const params = [
                    { name: 'residentId', type: TYPES.NVarChar, value: personId },
                    { name: 'firstName', type: TYPES.NVarChar, value: residentObject.firstName },
                    { name: 'lastName', type: TYPES.NVarChar, value: residentObject.lastName },
                    { name: 'username', type: TYPES.NVarChar, value: residentObject.username },
                    { name: 'password', type: TYPES.NVarChar, value: residentObject.password },
                    { name: 'email', type: TYPES.NVarChar, value: residentObject.email },
                    { name: 'phoneNumber', type: TYPES.NVarChar, value: residentObject.phoneNumber },
                    { name: 'homeId', type: TYPES.NVarChar, value: residentObject.homeId },
                    { name: 'description', type: TYPES.NVarChar, value: residentObject.description }
                ];

                sqlDB.SqlInsert(query, params, function(error, results) {
                    if(error) {
                        callback(error, {status: 400, response: results});
                        // TODO: remove the person from the faceAPI
                    } else {
                        callback(null, {status: 200, response: results});
                    }
                });
            }

        });

    },

    // Get Resident by ID
    getOne(residentId, callback) {
        // TODO: implement selecting a resident
    }
}