var express = require('express');
var router = express.Router();

const ResidentController = require('../controllers/resident_controller');

/* GET /:buildingId/:homeId page. */
router.get('/:buildingId/:homeId', ResidentController.getHome);

/* GET /:buildingId/:homeId/:residentId page. */
router.get('/:buildingId/:homeId/:residentId', ResidentController.getResident);

module.exports = router;
