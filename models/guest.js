/*
* Person model
**/

var TYPES = require('tedious').TYPES;
const Person = require('./faceAPI/person');
const sqlDB = require('../DB/sqlCRUD');


module.exports = {

    /**
     * Create Guest
     * @param {Object} guestObject
     * @param {function} callback
     */
    create(guestObject, callback) {
        // create a person in the face API
        const personData = {
            name: guestObject.firstName + " " + guestObject.lastName,
            description: guestObject.description
        };
        Person.create(guestObject.homeId, personData, function(error, results) {
            if(error || results.status !== 200) {
                callback(error, {
                    status: results.status,
                    message: "faceAPI wasn't able to create a person",
                    response: results });
            } else {
                // insert the guest to the Guests table in the DB
                const personId = results.response.id;
                const query =
                    "INSERT IntelliDoorDB.dbo.Guests " +
                    "(guestId, guestOf, firstName, lastName, phoneNumber, description) " +
                    "OUTPUT INSERTED.guestId " +
                    "VALUES " +
                    "(@guestId, @guestOf, @firstName, @lastName, @phoneNumber, @description);";

                const params = [
                    { name: 'guestId', type: TYPES.NVarChar, value: personId },
                    { name: 'guestOf', type: TYPES.NVarChar, value: guestObject.guestOf },
                    { name: 'firstName', type: TYPES.NVarChar, value: guestObject.firstName },
                    { name: 'lastName', type: TYPES.NVarChar, value: guestObject.lastName },
                    { name: 'phoneNumber', type: TYPES.NVarChar, value: guestObject.phoneNumber },
                    { name: 'description', type: TYPES.NVarChar, value: guestObject.description },
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

    }
}