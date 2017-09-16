var express = require('express');
var router = express.Router();

/* GET landing page. */
router.get('/', function(req, res, next) {
  // TODO: if a session is already active - redirect to user page (admin or resident), otherwise redirect to landing page
  if (req.session.user === 'admin') {
    res.redirect('/admin/'+req.session.building)
  } else {
    res.render('index', {title: 'IntelliDoor'});
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

module.exports = router;
