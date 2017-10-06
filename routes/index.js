var express = require('express');
var router = express.Router();
var formidable = require('formidable'),
    imgur = require('imgur-node-api');

/* GET landing page. */
router.get('/', function(req, res, next) {
  // TODO: if a session is already active - redirect to user page (admin or resident), otherwise redirect to landing page
  if (req.session.user === 'admin') {
      res.redirect('/admin/'+req.session.building)
  } else if (req.session.user === 'resident') {
      // TODO: redirect to resident page
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


module.exports = router;
