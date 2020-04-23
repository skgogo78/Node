var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if(!req.session.user){
    res.render('index', { title : 'Welcome' });
  } else {
    next();
  }
  
}, (req,res)=>{
  res.render('mypage', { title : req.session.user.name + ' Welcome' });
});

module.exports = router;
