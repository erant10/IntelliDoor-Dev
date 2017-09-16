var express = require('express');
var router = express.Router();

const BuildingController = require('../controllers/admin_controller');

/* GET /admin/:buildingId page. */
router.get('/:buildingId', BuildingController.loadBuilding);

/* GET /admin/:buildingId/:apartmentId page. */
router.get('/:buildingId/:apartmentId', BuildingController.loadApartment);


/* POST /admin/:buildingId page. */
router.post('/login', BuildingController.loginAdmin);

module.exports = router;
