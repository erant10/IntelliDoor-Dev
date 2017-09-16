var express = require('express');
var router = express.Router();

const ResidentController = require('../controllers/resident_controller');

/* GET /:buildingId/:apartmentId page. */
router.get('/:buildingId/:apartmentId', ResidentController.getApartment);

/* GET /:buildingId/:apartmentId/:residentId page. */
router.get('/:buildingId/:apartmentId/:residentId', ResidentController.getResident);

module.exports = router;
