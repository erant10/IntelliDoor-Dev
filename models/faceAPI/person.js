const request = require("request");
const config = require('config');

const faceApiConfig = config.get('faceApi');

// get the api configuration strings from 'config'
const headers = faceApiConfig.headers
const host = faceApiConfig.host;
const url = host + '/persongroups/';

module.exports = {

    /* Person supported methods: getOne, create, remove, addFace */

    /**
     * Get a specific Person in a Person Group
     * @param {String} PersonGroupId- The id of the Person Group in which to get the person from
     * @param {String} personId - The id of the person
     * @param {function} callback - The callback that handles the response.
     */
    getOne(PersonGroupId, personId, callback) {
        var options = {
            method: 'GET',
            url: url + '/' + PersonGroupId + "/persons/" + personId,
            headers: headers
        };
        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body} );
            } else {
                // A successful call returns the person's information inside 'body'.
                callback(null, { status: response.statusCode , response: body} );
            }
        });
    },

    /**
     * Creates a person
     * @param {String} PersonGroupId- The id of the Person Group in which to create the person
     * @param {Object} person - An object with the persons name and description
     * @param {function} callback - The callback that handles the response.
     */
    create(PersonGroupId, person, callback) {
        var options = {
            method: 'POST',
            url: url + '/' + PersonGroupId + "/persons" ,
            headers: headers,
            body: { name: person.name , userData: person.description },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body} );
            } else {
                // A successful call returns the person's information inside 'body'.
                callback(null, {
                    status: response.statusCode,
                    response: {
                        id: body.personId,
                        name: person.name ,
                        userData: person.description
                    }
                });
            }
        });
    },

    /**
     * Removes a person
     * @param {String} PersonGroupId- The id of the Person Group from which to remove the person
     * @param {String} personId - The id of the Person to remove
     * @param {function} callback - The callback that handles the response.
     */
    remove(PersonGroupId, personId, callback) {
        var options = {
            method: 'DELETE',
            url: url + '/' + PersonGroupId + "/persons/" + personId ,
            headers: headers,
        };

        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body});
            } else {
                // A successful call returns the person's information inside 'body'.
                callback(null, { status: response.statusCode , response: body});
            }
        });
    },

    /**
     * Adds a face to a person
     * @param {String} PersonGroupId- The id of the Person Group in which to get the person from
     * @param {String} personId - The id of the Person to remove
     * @param {String} faceUrl - the url an image containing the face of this person
     * @param {function} callback - The callback that handles the response.
     *
     * This method only supports images with a single face in them.
     * if there are more face then the largest face will be used.
     *
     */
    addFace(PersonGroupId, personId, faceUrl, callback) {
        var options = {
            method: 'POST',
            // to support images with multiple face, the targetFace must be added as a parameter to the request url
            // in the format of "targetFace=left,top,width,height". E.g. "targetFace=10,10,100,100"
            url: url + '/' + PersonGroupId + "/persons/" + personId + "/persistedFaces",
            headers: headers,
            body: { url: faceUrl },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) {
                callback(error, body);
            } else {
                // A successful call returns the persistedFaceId inside 'body'.
                callback(null, { status: response.statusCode , response: body} );
            }
        });
    }

}

