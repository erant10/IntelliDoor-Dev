var session = require('express-session');

module.exports = {

    // GET '\resident\:buildingId\:homeId'
    getHome(req, res, next) {
        // TODO: if a session is already active - redirect to building page, otherwise load landing page
        res.send('resident home page - all residents');
    },

    // GET '\resident\:buildingId\:homeId\:residentId'
    getResident(req, res, next) {
        // TODO: load a resident (faces and guests)
        res.send('resident home page - one resident');
    }
}