const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const {reqUrlCheck, isNotLoggedIn, isLoggedIn } = require('./middlewares');
const { Member } = require('../models');


router.get('/',reqUrlCheck, (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    } else {
        res.render('signin');
    }

}, (req,res)=>{
    res.render('profile',req.user.dataValues);

});

router.get('/check', reqUrlCheck, isLoggedIn, (req, res)=>{

    res.send();

});


router.get('/signout',reqUrlCheck, isLoggedIn, (req,res,next)=>{
    
    req.logout();
    res.redirect('/auth'+'?p='+req.query.p);

});

router.post('/signin',reqUrlCheck, isNotLoggedIn, (req,res, next)=>{
    
    passport.authenticate('local', (error, user, info)=>{
        
        if(error){
            console.error(error);
            return next(error);
        }

        if(!user){
            return res.json({
                'status_category' : 'err',
                'status_name' : 'login Error',
                'message' : info.message
            });
        }

        req.login(user, (error)=>{
            
            if(error){
                console.error(error);
                return next(error);
            }

            return res.json({
                'status_category' : 'success',
                'status_name' : 'login Success',
                'message' : req.user
            });

        });

    })(req,res,next);

});


router.get('/signup',reqUrlCheck, isNotLoggedIn, (req,res,next)=>{
    res.render('signup');
});

router.post('/signup', reqUrlCheck, isNotLoggedIn, async (req,res,next)=>{
    
    const { profileImg, email, password, nickname } = req.body;
    
    try {
        
        const emailCheck = await Member.findOne({ where : { email } });
        
        if(emailCheck){
            
            res.json({
                'status_category' : 'fail',
                'status_name' : 'email Duplicate',
                'message' : '중복된 이메일입니다.'
            });

        } else {

            const hash = await bcrypt.hash(password, 12);
            const data = await Member.create({
                profileImg, email, 'password': hash, nickname
            });

            res.json({
                'status_category' : 'success',
                'status_name' : 'signup success',
                'message' : JSON.stringify(data)
            });
        }

    } catch (error) {
        console.error(error);
        next(error);
    }


});

router.get('/signedit', reqUrlCheck, isLoggedIn, (req,res,next)=>{
    
    res.render('signup', {
       ...req.user.dataValues, url : '/auth/signedit', method : 'put' 
    });

});

router.put('/signedit/:id', reqUrlCheck, isLoggedIn, async (req, res, next)=>{

    const { id } = req.params;
    const { profileImg, email, password, nickname } = req.body;
    
    try {

        const hash = await bcrypt.hash(password, 12);
        const data = await Member.update({
            profileImg, email, 'password': hash, nickname
        }, { where : { id }});

        res.json({
            'status_category' : 'success',
            'status_name' : 'signedit success',
            'message' : JSON.stringify({ profileImg, email, nickname })
        });

    } catch (error) {
        console.error(error);
        next(error);
    }

});


module.exports = router;