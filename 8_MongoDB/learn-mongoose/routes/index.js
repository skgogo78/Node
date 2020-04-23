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
  const params = {}
  Object.assign(params, req.session.user, { title : `${req.session.user.name} Welcome` });
  console.log(params);
  res.render('mypage', params);
});

module.exports = router;
