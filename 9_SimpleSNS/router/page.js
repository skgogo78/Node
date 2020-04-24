const router = require('express').Router();

router.get('/', (req,res)=>{

    res.render('content',{
        title : 'SIMPLE SNS'
    });

});





module.exports = router;