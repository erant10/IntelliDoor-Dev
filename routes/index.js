var express = require('express');
var router = express.Router();
var formidable = require('formidable'),
    imgur = require('imgur-node-api');
var home = require('../models/home')

/* GET landing page. */
router.get('/', function(req, res, next) {
  if (req.session.user === 'admin') {
      res.redirect('/admin/'+req.session.building)
  } else if (req.session.user === 'resident') {
      res.redirect('/resident/')
  } else {
      res.render('landing/index', {title: 'IntelliDoor'});
  }
});

/* GET /logout. - end current session */
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});


/* POST /uploadNewImage - create a new face. */
router.post('/uploadNewImage', function(req, res, next) {
    var form = new formidable.IncomingForm();
    var filepath;
    form.parse(req)
        .on('fileBegin', function (name, file){
            file.path = __dirname + '/../public/uploads/' + file.name;
            filepath = file.path;
        })
        .on('end', function () {
            imgur.upload(filepath, function (err, result) {
                res.send(result.data.link);
            });
        });

});


/* POST /update page. */
router.post('/update', function(req, res, next) {
    console.log(req.body);
    console.log(req.body.buildingId);
    console.log(req.body.aptNum);
    console.log(req.body.user);
    home.update(req.body.buildingId, req.body.aptNum, req.body.user, function(error, result) {
        if (error)
            res.send('something went wrong when updating the default resident: ' + error);
        else
            console.log(result);
            res.send(result)

    });
});

module.exports = router;
