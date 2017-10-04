var session = require('express-session');
var building = require('../models/building')
var home = require('../models/home')
var resident = require('../models/resident')
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {

    // GET '\admin\:buildingId' - building page
    loadBuilding(req, res, next) {
        // from the building page the admin can add, update or remove a home
        if (req.session.user === 'admin') {
            // the admin is logged in
            building.getOne(req.params.buildingId, function(error, buildingObj){
                if(!error) {
                    building.getEntries(req.params.buildingId, function (error1, entries) {
                        if (!error1) {
                            building.getHomes(req.params.buildingId, function (error2, homes) {
                                if (!error2) {
                                    res.render('admin/admin', {
                                        building: buildingObj[0],
                                        entries: entries,
                                        homes: homes
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.send('unauthorized');
        }

    },

    // POST '\admin\login' - Admin login
    loginAdmin(req, res, next) {
        building.getOne(req.body.building, function(error, results) {
            if(error){
                console.log('There was en Error:' + error);
            }
            if (results.length > 0) {
                buildingObj = results[0];
                bcrypt.compare(req.body.password, buildingObj.adminPassword, function(err, match) {
                    if (buildingObj.adminName === req.body.username) {
                        // the admin is authorized for this building - check password
                        if (match) {
                            // the admin is authorized - Start a session
                            req.session.user = 'admin';
                            req.session.building = req.body.building;
                            res.redirect('/admin/' + req.body.building);
                        } else {
                            // the password doesnt match - return error message with status 401 (unauthorized)
                            res.status(401);
                            res.send(JSON.stringify({message: 'password doesn\'t match'}));
                        }
                    } else {
                        // the admin username doesn't match - return error message with status 401 (unauthorized)
                        res.status(401);
                        res.send(JSON.stringify({message: 'username doesn\'t match building admin'}));
                    }
                });
            } else {
                // there were no buildings named @req.body.building
                res.send(JSON.stringify({message: 'there were no buildings named + ' + req.body.building}));
            }
        });
    },

    // PUT '\newBuilding' - create a building
    createBuilding(req,res,next) {
        // TODO: 1. verify admin session
        bcrypt.hash(req.body.password, saltRounds, function(err, hashed) {
            if(err) {
                res.send('there was an error when trying to hash the password.');
            }
            newBuilding = {
                buildingId: req.body.buildingId,
                address: req.body.address,
                adminName: req.body.adminName,
                hashedPassword: hashed
            }
            building.create(newBuilding, function(error, result) {
                if(error || result.status !== 200) {
                    res.status(result.status);
                    res.send(result.response);
                } else {
                    res.send(JSON.stringify(result));
                }
            });

        });
    },

    // PUT '\admin\newHome' - create Home
    createHome(req,res,next) {
        // TODO: 1. verify admin session
        home.create(req.body, function(error, result) {
            if(error || result.status !== 200) {
                res.status(result.status);
                res.send(result.response);
            } else {
                res.send(JSON.stringify(result));
            }
        });
    },

    // PUT '\admin\:buildingId\:homeId\newResident' - create Resident
    createResident(req, res, next) {
        // TODO: verify admin session
        var residentObj = req.body;
        // encrypt the password before adding the resident
        bcrypt.hash(residentObj.password, saltRounds, function(err, hashed) {
            if (err) {
                res.send('there was an error when trying to hash the password.');
            }
            residentObj.password = hashed;
            resident.create(residentObj, function(error, result) {
                if(error || result.status !== 200) {
                    console.log("an error occured when trying to create the resident.");
                    console.log(error);
                    res.status(result.status);
                    res.send(result.response);
                } else {
                    res.send(JSON.stringify(result));
                }
            });
        });
    }
}