var express = require('express');
var router = express.Router();

const ResidentController = require('../controllers/resident_controller');

/* GET /:buildingId/:homeId/:residentId page. */
router.get('/:buildingId/:homeId/:residentId', ResidentController.getResident);


/* POST /:buildingId/:homeId/:residentId/newFace - create a new face. */
router.post('/login', ResidentController.loginResident);

/* POST /:buildingId/:homeId/:residentId/newFace - create a new face. */
router.post('/:buildingId/:homeId/:residentId/newFace', ResidentController.createFace);


/* PUT /:buildingId/:homeId/:residentId/newGuest - create a new guest. */
router.put('/:buildingId/:homeId/:residentId/newGuest', ResidentController.createGuest);

module.exports = router;
