const guest = require('../models/guest')
const face = require('../models/face')
var resident = require('../models/resident')
var bcrypt = require('bcrypt');


module.exports = {

    // GET '/resident/:buildingId/:homeId/:residentId'
    getResident(req, res, next) {
        // TODO: load a resident (faces and guests)
        res.render('resident/resident', {title: 'IntelliDoor'});
    },

    // POST 'resident/login'
    loginResident(req, res, next){
        resident.getOne(req.body.username, function(error, results) {
            if(error){
                console.log('There was en Error:' + error);
            }
            if (results.length > 0) {
                residentObj = results[0];
                console.log(residentObj);
                bcrypt.compare(req.body.password, residentObj.password, function(err, match) {
                    // check password
                    if (match) {
                        // the resident is authorized - Start a session
                        req.session.user = 'user';
                        req.session.username = req.body.username;
                        res.redirect(residentObj.homeId + "/" + req.body.username);
                    } else {
                        // the password doesn't match - return error message with status 401 (unauthorized)
                        res.status(401);
                        res.send(JSON.stringify({message: 'password doesn\'t match'}));
                    }
                });
            } else {
                // username doesn't exist
                res.status(401);
                res.send(JSON.stringify({message: 'sorry, the user + ' + req.body.username + 'doesn\'t exist.'}));
            }
        });
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
    },

    uploadImage(req, res, next) {
        res.send("image uploaded");
    }

}