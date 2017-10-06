const guest = require('../models/guest');
const face = require('../models/face');
var resident = require('../models/resident');
var bcrypt = require('bcrypt');
var formidable = require('formidable'),
    imgur = require('imgur-node-api'),
    path = require('path');
var fs = require('fs');
imgur.setClientID('e6376674cfd42a7');

module.exports = {

    // GET '/resident/:homeId/:residentId'
    getResident(req, res, next) {
        resident.getById(req.params.residentId, function(error, residentObj) {
            if(error){
                console.log('There was en Error Getting the resident:' + error);
            }
            resident.getFaces(req.params.residentId, function(error1, residentFaces) {
                if(error1){
                    console.log('There was en Error Getting the resident faces:' + error1);
                }
                guest.getResidentGuests(req.params.residentId, function(error2, guestList){
                    res.render('resident/resident', { resident: {info: residentObj[0], faces: residentFaces, guests: guestList} });
                });
            });
        });
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
                    if (match || (req.body.password === residentObj.password)) {
                        // the resident is authorized - Start a session
                        req.session.user = 'user';
                        req.session.username = req.body.username;
                        res.redirect(residentObj.homeId + "/" + residentObj.residentId);
                    } else {
                        // the password doesn't match - return error message with status 401 (unauthorized)
                        res.status(401);
                        res.send(JSON.stringify({message: 'password doesn\'t match'}));
                    }
                });
            } else {
                // username doesn't exist
                res.status(401);
                res.send(JSON.stringify({message: 'sorry, the user ' + req.body.username + 'doesn\'t exist.'}));
            }
        });
    },

    /* PUT /:buildingId/:homeId/:residentId/newGuest - create a new guest. */
    createGuest(req, res, next) {
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
        var form = new formidable.IncomingForm();
        var fd = {};
        var filepath;
        form.parse(req)
            .on('fileBegin', function (name, file){
                file.path = __dirname + '/../public/uploads/' + file.name;
                filepath = file.path;
            })
            .on('field', function (name, field) {
                fd[name] = field;
            })
            .on('end', function () {
                imgur.upload(filepath, function (err, result) {
                    face.create(fd.homeId, fd.personId, result.data.link, fd.isGuest, "", function(error, results) {
                        console.log(JSON.stringify(results));

                        if (!error)
                            res.send(result.data.link);
                        else
                            res.send('an error occured');
                    });

                });
            });

    }

}