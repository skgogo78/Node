const router = require('express').Router();
const multer = require('multer');
const path = require('path');
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




module.exports = router;