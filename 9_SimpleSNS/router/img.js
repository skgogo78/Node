const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { PostImg } = require('../models');
const fs = require('fs');
const { isNotLoggedIn, reqUrlCheck } = require('./middlewares');



const upload = (targetPath)=>multer({
    storage : multer.diskStorage({
        destination(req, file, callback){
            callback(null, targetPath);
        },
        filename(req, file, callback){
            const ext = path.extname(file.originalname);
            callback(null, path.basename(file.originalname, ext) + '_' + Date.now() + ext);
        },
        onError(err, next){
            console.error(err);
            next();
        }

    }),
    limits : {
        fileSize : 5 * 1024 * 1024
    }
});


router.post('/profile', upload('uploads/profileimgs/').single('img'), (req,res,next)=>{
    res.json({ url : `/profileimgs/${req.file.filename}`});
});

router.get('/post/:postId', async (req,res,next)=>{
    const { postId } = req.params;

    try {
        const data = await PostImg.findAll({
            where : { postId }
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/post', upload('uploads/postimgs/').array('file',100), (req,res,next)=>{
    
    console.log(req.files);
    const urls = [];

    req.files.forEach(file=>{
        urls.push( `/postimgs/${file.filename}`);
    });
    
    res.json({ urls });
});



module.exports = router;