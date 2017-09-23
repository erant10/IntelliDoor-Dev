const guest = require('../models/guest')
const face = require('../models/face')

module.exports = {

    // GET '/resident/:buildingId/:homeId'
    getHome(req, res, next) {
        // TODO: if a session is already active - redirect to building page, otherwise load landing page
        res.send('resident home page - all residents');
    },

    // GET '/resident/:buildingId/:homeId/:residentId'
    getResident(req, res, next) {
        // TODO: load a resident (faces and guests)
        res.send('resident home page - one resident');
    },

    /* PUT /:buildingId/:homeId/:residentId/newGuest - create a new guest. */
    createGuest(req, res, next) {
        // TODO: verify resident session and get cookie values
        var guestObj = req.body;
        guest.create(guestObj, function(error, result) {
            if(error || result.status !== 200) {
                console.log("an error occured when trying to create the guest.");
                console.log(error);
                res.status(result.status);
                res.send(result.response);
            } else {
                res.send(JSON.stringify(result));
            }
        });
    },

    /* POST /:buildingId/:homeId/:residentId/newFace - create a new face. */
    createFace(req, res, next) {
        // TODO: verify resident session and get cookie values
        var faceObj = req.body;
        face.create(faceObj.homeId, faceObj.personId, faceObj.url, faceObj.isGuest, faceObj.description,
            function(error, result) {
                if(error || result.status !== 200) {
                    console.log("an error occured when trying to create the face.");
                    console.log(error);
                    res.status(result.status);
                    res.send(result.response);
                } else {
                    res.send(JSON.stringify(result));
                }
            }
        );
    }

}