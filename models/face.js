/*
* Person model
**/

var TYPES = require('tedious').TYPES;
const Person = require('./faceAPI/person');
const sqlDB = require('../DB/sqlCRUD');


module.exports = {

    /**
     * Create a face for a Person (resident or guest).
     * @param {String} homeId
     * @param {String} personId
     * @param {String} faceUrl
     * @param {function} callback
     */
    create(homeId, personId, faceUrl, isGuest, description, callback) {
        console.log("homeId: " + homeId + "\npersonId: " + personId + "\nurl: " + faceUrl + "\nisGuest: " + isGuest + "\ndesc: " + description)
        Person.addFace(homeId, personId, faceUrl, function(error, results) {
            if(error || results.status !== 200) {
                callback(error, {
                    status: results.status,
                    message: "faceAPI wasn't able to create a person face",
                    response: results });
            } else {
                // insert the face to the Faces table in the DB
                const faceId = results.response.persistedFaceId;
                const query =
                    "INSERT IntelliDoorDB.dbo.Faces " +
                    "(faceId, personId, url, isGuest, description) " +
                    "OUTPUT INSERTED.faceId " +
                    "VALUES " +
                    "(@faceId, @personId, @url, @isGuest, @description);";

                const params = [
                    { name: 'faceId', type: TYPES.NVarChar, value: faceId },
                    { name: 'personId', type: TYPES.NVarChar, value: personId },
                    { name: 'url', type: TYPES.NVarChar, value: faceUrl },
                    { name: 'isGuest', type: TYPES.Bit, value: isGuest },
                    { name: 'description', type: TYPES.NVarChar, value: description },
                ];

                sqlDB.SqlInsert(query, params, function(error, results) {
                    if(error) {
                        callback(error, {status: 400, response: results});
                        // TODO: remove the face from the faceAPI
                    } else {
                        callback(null, {status: 200, response: results});
                    }
                });
            }

        });

    }

}