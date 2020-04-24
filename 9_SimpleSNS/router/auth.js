const router = require('express').Router();


router.get('/', (req,res,next)=>{
    
    if(req.session.user){
        next();
    } else {
        res.render('signin');
    }

}, (req,res)=>{

    res.render('profile',req.session.user);

});


router.get('/signout', (req,res)=>{
    if(req.session.user){
        delete req.session.user;
    }

    res.redirect('/auth');

});

router.post('/signin', (req,res)=>{
    
    req.session.user={
        id : 'skgogo78',
        email : 'skgogo13@gmail.com'
    };
    
    res.redirect('/auth');

});

module.exports = router;