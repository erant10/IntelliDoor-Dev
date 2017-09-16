var session = require('express-session');
var building = require('../models/building')
var config = require('config');
var bcrypt = require('bcrypt');

module.exports = {

    // GET '\admin\:buildingId' - building page
    loadBuilding(req, res, next) {
        // from the building page the admin can add, update or remove an apartment
        if (req.session.user === 'admin') {
            // the admin is logged in
            // TODO: get all apartments in the building
            res.render('admin/building', { title: req.params.buildingId });
        } else {
            res.send('unauthorized');
        }

    },

    // GET '\admin\:buildingId\:apartmentId' - apartment page
    loadApartment(req, res, next) {
        // from the apartment page the admin can add, update or remove a resident from this apartment.
        if (req.session.user === 'admin') {
            // the admin is logged in
            // TODO: load the apartment page
            res.send('admin apartment page');
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
    }
}