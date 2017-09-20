var express = require('express');
var router = express.Router();

const BuildingController = require('../controllers/admin_controller');

/* GET /admin/:buildingId page. */
router.get('/:buildingId', BuildingController.loadBuilding);

/* GET /admin/:buildingId/:homeId page. */
router.get('/:buildingId/:homeId', BuildingController.loadHome);


/* POST /admin/:buildingId page. */
router.post('/login', BuildingController.loginAdmin);

module.exports = router;
