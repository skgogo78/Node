const router = require('express').Router();
const Comment = require('../schemas/comment');

router.get('/', async (req,res,next)=>{

    let params = {};

    if(req.query.keyword || req.query.me){
        params['$and'] = []
        if(req.query.keyword){
            params['$and'].push({comment : { '$regex' : req.query.keyword }});
        }
        if(req.query.me){
            params['$and'].push({commenter : { '$eq' : req.session.user._id }});
        }
    }

    try {
        const data = await Comment.find(params).populate({
            path : 'commenter',
            options : { projection: { password : 0 } }
        });



        res.json(data);

    } catch (error) {
        console.error(error);
        next(createError(error));
    }
    
});

router.post('/', async (req,res)=>{
    
    const params = {};

    Object.assign(params, req.body, { commenter : req.session.user._id });

    const comment = new Comment(params);
    
    try {

        let data = await comment.save();
        data =  await Comment.populate(data, { path : 'commenter' , options : { projection: { password : 0 } } });
        res.json(data); 

    } catch (error) {
        console.error(error);
        next(createError(error));
    }
    
});

router.get('/:_id', async (req,res)=>{
    
    const { _id } = req.params;
    
    try {
        
        const data = await Comment.find({ _id }).populate('commenter', { password : 0 });
        res.json(data[0]);

    } catch (error) {
        console.error(error);
        next(createError(error));
    }

});

router.put('/:_id', async (req,res)=>{
    const { _id } = req.params;
    try {
        const data = await Comment.update({ _id }, req.body);
        res.json({ _id, comment : req.body.comment });

    } catch (error) {
        console.error(error);
        next(createError(error));
    }
});

router.delete('/:_id', async (req,res)=>{
    const { _id } = req.params;
    try {
        const data = await Comment.remove({ _id });
        console.log(data);
        res.json(data);
    } catch (error) {
        console.error(error);
        next(createError(error));
    }
});


module.exports = router;