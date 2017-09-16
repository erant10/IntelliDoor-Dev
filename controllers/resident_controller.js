var session = require('express-session');

module.exports = {

    // GET '\resident\:buildingId\:apartmentId'
    getApartment(req, res, next) {
        // TODO: if a session is already active - redirect to building page, otherwise load landing page
        res.send('resident apartment page - all residents');
    },

    // GET '\resident\:buildingId\:apartmentId\:residentId'
    getResident(req, res, next) {
        // TODO: load a resident (faces and guests)
        res.send('resident apartment page - one resident');
    }
}