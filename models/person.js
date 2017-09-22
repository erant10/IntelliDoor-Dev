/*
* Person model
**/

var TYPES = require('tedious').TYPES;
const Person = require('./faceAPI/person');
const sqlDB = require('../DB/sqlCRUD');


module.exports = {

    /**
     * Create Person
     * @param {Object} personObject
     * @param {function} callback
     */
    create(personObject, callback) {
        // create a person in the face API
        const personData = {
            name: personObject.firstName + " " + personObject.lastName,
            description: personObject.description
        };
        Person.create(personObject.homeId, personData, function(error, results) {
            if(error || results.status !== 200) {
                callback(error, {
                    status: results.status,
                    message: "faceAPI wasn't able to create a person",
                    response: results });
            } else {
                const personId = results.response.id;
                // TODO: the Person was created successfully - now insert the person into the Person Table
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
                    { name: 'firstName', type: TYPES.NVarChar, value: personObject.firstName },
                    { name: 'lastName', type: TYPES.NVarChar, value: personObject.lastName },
                    { name: 'username', type: TYPES.NVarChar, value: personObject.username },
                    { name: 'password', type: TYPES.NVarChar, value: personObject.password },
                    { name: 'email', type: TYPES.NVarChar, value: personObject.email },
                    { name: 'phoneNumber', type: TYPES.NVarChar, value: personObject.phoneNumber },
                    { name: 'homeId', type: TYPES.NVarChar, value: personObject.homeId },
                    { name: 'description', type: TYPES.NVarChar, value: personObject.description }
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

    // Get Person by ID
    getOne(personId, callback) {
        // TODO: implement selecting a person
    }
}