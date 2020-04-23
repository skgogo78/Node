var express = require('express');
var User = require('../schemas/user');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signin', async (req,res,next)=>{
  
  try {
    
    const data = await User.find(req.query, { password : 0 });
    if(data.length === 1){
        delete data[0].password;
        req.session.user = data[0];
        req.session.save(()=>{
          res.json(data[0]);
        });
    } else {
      res.status(401).send();
    }

  } catch (error) {
  
    console.error(error);
    next(error);
  
  }

});

router.post('/signup', async (req,res)=>{
  
  const user = new User(req.body);
  
  try {
    
    const data = await user.save(req.body);
    res.json(data);

  } catch (error) {

    console.error(error);
    res.status(401).send();
  
  }

});

module.exports = router;
