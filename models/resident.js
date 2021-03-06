/*
* Person model
**/

var TYPES = require('tedious').TYPES;
const Person = require('./faceAPI/person');
const sqlDB = require('../DB/sqlCRUD');
const parsers = require('../helpers/parsers');


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
                    } else {
                        callback(null, {status: 200, response: results});
                    }
                });
            }

        });

    },

    // Get Resident by ID
    getOne(userName, callback) {
        const query =
            "SELECT Res.residentId, Res.firstName, Res.lastName, Res.password, " +
                   "Res.phoneNumber, Res.homeId, Homes.homeId, Homes.buildingId" +
            "\nFROM IntelliDoorDB.dbo.Residents Res" +
            "\nINNER JOIN Homes ON Res.homeId=Homes.homeId" +
            "\nWHERE userName = @userName";
        const idParam = {
            name: 'userName',
            type: TYPES.NVarChar,
            value: userName
        };

        sqlDB.sqlGet(query, idParam, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, result);
            }
        });
    },

    getById(residentId, callback) {
        const query = "SELECT *\n" +
            "  FROM Residents R\n" +
            "  JOIN Homes H ON H.homeId = R.homeId\n" +
            "  WHERE R.residentId = @residentId";
        const idParam = {
            name: 'residentId',
            type: TYPES.NVarChar,
            value: residentId
        };

        sqlDB.sqlGet(query, idParam, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, result);
            }
        });
    },

    getFaces(residentId, callback) {
        const query = "SELECT *\n" +
            "  FROM Faces F\n" +
            "  WHERE F.personId= @residentId";
        const idParam = {
            name: 'residentId',
            type: TYPES.NVarChar,
            value: residentId
        };

        sqlDB.sqlGet(query, idParam, function(error, result) {
            if(error) {
                callback(error, result);
            } else {
                callback(null, result);
            }
        });
    },
}