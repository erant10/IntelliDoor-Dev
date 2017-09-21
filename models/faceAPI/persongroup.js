const request = require("request");
const config = require('config');

const faceApiConfig = config.get('faceApi');

// get the api configuration strings from 'config'
const headers = faceApiConfig.headers;
const host = faceApiConfig.host;
const url = host + '/persongroups/';


module.exports = {

    /* Person Group supported methods: getAll, getOne, getPersons, create, remove, train, detect, identify */

    /**
     * Gets all of the person groups that are currently held in the API.
     * @param {function} callback - The callback that handles the response.
     */
    getAll(callback) {
        // Make a GET request to the api url
        var options = {
            method: 'GET',
            url: url,
            headers: headers
        };

        request(options, function (error, response, body) {
            if (error) {
                // return callback with the error object
                return callback(error, { status: response.statusCode , response: body} );
            } else {
                callback(null, { status: response.statusCode , response: body} );
            }
        });
    },

    /**
     * Gets a single person group with a given id.
     * @param {String} personGroupId - The id string of the Person Group.
     * @param {function} callback - The callback that handles the response.
     */
    getOne(personGroupId, callback) {
        // Make the first GET request which returns the person group data
        var options = {
            method: 'GET',
            url: url + '/' + personGroupId,
            headers: headers
        };
        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body });
            } else {
                callback(null, { status: response.statusCode , response: body } );
            }
        });
    },

    /**
     * Returns all Persons in a Person Group
     * @param {String} personGroupId - The id string of the Person Group.
     * @param {function} callback - The callback that handles the response.
     */
    getPersons(personGroupId, callback) {
        var options = {
            method: 'GET',
            url: url + '/' + personGroupId  + "/persons",
            headers: headers
        };
        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body });
            } else {
                callback(null, {
                    status: response.statusCode,
                    response: {
                        id: personGroupId,
                        persons: JSON.parse(body)
                    }
                });
            }
        });

    },

    /**
     * Creates a Person Group
     * @param {Object} personGroupObject - The Person Group object containing the id, name and description.
     * @param {function} callback - The callback that handles the response.
     */
    create(personGroupObject, callback) {
        var options = {
            method: 'PUT',
            url: url + '/' + personGroupObject.homeId,
            headers: headers,
            body: { name: personGroupObject.homeId , userData: personGroupObject.description },
            json: true
        };

        request(options, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                callback(error, { status: response.statusCode , response: body});
            } else {
                callback(null, {
                    status: response.statusCode,
                    response: personGroupObject.homeId + " created successfully"
                });
            }
        });
    },

    /**
     * Removes a Person Group
     * @param {String} personGroupId - The id string of the Person Group to be deleted.
     * @param {function} callback - The callback that handles the response.
     */
    remove(personGroupId, callback) {
        var options = {
            method: 'DELETE',
            url: url + '/' + personGroupId,
            headers: headers
        };

        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body});
            } else {
                callback(null, { status: response.statusCode , response: personGroupId + " deleted successfully" });
            }
        });
    },

    /**
     * Start training a specific Person Group
     * @param {String} personGroupId - The id string of the Person Group to be deleted.
     * @param {function} callback - The callback that handles the response.
     */
    train(personGroupId, callback) {
        var options = {
            method: 'POST',
            url: url + '/' + personGroupId + '/train',
            headers: headers
        };
        request(options, function (error, response, body) {
            if (error) {
                callback(error, { status: response.statusCode , response: body});
            } else {
                callback(null, { status: response.statusCode , response: { success: response.statusCode === 202 }});
            }
        });
    },

    /**
     * Detects all faces in an image, given by a url
     * @param {String} imageUrl - The url of the image in which to detect
     * @param {function} callback - The callback that handles the response.
     */
    detect(imageUrl, callback) {
        var options = {
            method: 'POST',
            url: host + '/detect',
            headers: headers,
            body: {
                url: imageUrl
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) {
                callback(error, body);
            } else if (response.statusCode === 200) {
                // The response is an array of objects, each containing a facesId, faceRectangle and faceLandmarks
                callback(null, body);
            }
        });

    },

    /**
     * identify faces given by faceId's
     * @param {String} faceIds- an array of face ID's returned from the 'detect' method
     * @param {String} personGroupId - the id of the person group in which to search for a face match
     * @param {Number} threshold - Confidence threshold of identification,
     *                 used to judge whether one face belong to one person. The range of confidenceThreshold is [0, 1]
     *                 (default specified by algorithm).
     * @param {function} callback - The callback that handles the response.
     */
    identify(faceId, personGroupId, threshold, callback) {
        var options = {
            method: 'POST',
            url: host + '/identify',
            headers: headers,
            body: {
                personGroupId: personGroupId,
                faceIds: faceId,
                maxNumOfCandidatesReturned: 5, //The range of maxNumOfCandidatesReturned is between 1 and 5.
                confidenceThreshold: threshold
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) {
                callback(error, body);
            } else if (response.statusCode === 200) {
                // The response is an list of objects.
                // For each face id in the query, the response will contain an array of the matching person candidates
                // with a confidence score
                callback(null, body);
            }
        });

    },


}

