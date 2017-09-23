var express = require('express');
var router = express.Router();

const BuildingController = require('../controllers/admin_controller');

/* GET /admin/:buildingId page. */
router.get('/:buildingId', BuildingController.loadBuilding);

/* GET /admin/:buildingId/:homeId page. */
router.get('/:buildingId/:homeId', BuildingController.loadHome);


/* POST /admin/:buildingId page. */
router.post('/login', BuildingController.loginAdmin);


/* PUT /admin/:buildingId/newHome. */
router.put('/:buildingId/newHome', BuildingController.createHome);

/* PUT /admin/newBuilding. not used by the admin.*/
router.put('/newBuilding', BuildingController.createBuilding);

/* PUT /admin/:buildingId/:homeId/newResident. */
router.put('/:buildingId/:homeId/newResident', BuildingController.createResident);


module.exports = router;
