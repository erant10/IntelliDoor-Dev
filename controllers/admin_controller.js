var session = require('express-session');
var building = require('../models/building')
var home = require('../models/home')
var bcrypt = require('bcrypt');

module.exports = {

    // GET '\admin\:buildingId' - building page
    loadBuilding(req, res, next) {
        // from the building page the admin can add, update or remove a home
        if (req.session.user === 'admin') {
            // the admin is logged in
            // TODO: get all homes in the building
            res.render('admin/building', { title: req.params.buildingId });
        } else {
            res.send('unauthorized');
        }

    },

    // GET '\admin\:buildingId\:homeId' - main page for a specific home
    loadHome(req, res, next) {
        // from the home page the admin can add, update or remove a resident from this home.
        if (req.session.user === 'admin') {
            // the admin is logged in
            // TODO: load the home page
            res.send('admin home page');
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
                buildinfObj = results[0];
                bcrypt.compare(req.body.password, buildinfObj.adminPassword, function(err, match) {
                    if (buildinfObj.adminName === req.body.username) {
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

    // POST '\admin\newHome' - Admin login
    createHome(req,res,next) {
        // TODO: 1. verify admin session
        // TODO: 2. create the home from the input values
        home.create(req.body, function(error, result) {
            if(error || result.status !== 200) {
                res.status(result.status);
                res.send(result.response);
            } else {
                res.send(JSON.stringify(result));
            }
        });
    }
}