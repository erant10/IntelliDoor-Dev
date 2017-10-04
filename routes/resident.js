var express = require('express');
var router = express.Router();

const ResidentController = require('../controllers/resident_controller');

/* GET /:homeId/:residentId page. */
router.get('/:homeId/:residentId', ResidentController.getResident);


/* POST /login - create a new face. */
router.post('/login', ResidentController.loginResident);

/* POST /:homeId/:residentId/newFace - create a new face. */
router.post('/:buildingId/:homeId/:residentId/newFace', ResidentController.createFace);

/* POST /uploadimage - create a new face. */
router.post('/uploadimage', ResidentController.uploadImage);


/* PUT /:homeId/:residentId/newGuest - create a new guest. */
router.put('/:buildingId/:homeId/:residentId/newGuest', ResidentController.createGuest);

module.exports = router;
