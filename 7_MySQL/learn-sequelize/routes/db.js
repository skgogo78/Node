const router = require('express').Router();
const { User, Comment, Sequelize : { Op }, Sequelize } = require('../models');



router.get('/user/:id', async (req, res)=>{
    
    const { id } = req.params;
    const data = await User.findOne({
        where : {
            id
        }
    });
    res.send(JSON.stringify(data.dataValues));

});

router.delete('/user/:id', async (req, res)=>{
    
    const { id } = req.params;
    const data = await User.destroy({
        where : {
            id
        }
    });
    res.send(JSON.stringify(data));

});

router.put('/user/:id', async (req, res)=>{
    
    const { id } = req.params;

    const data = await User.update(req.body, {
        where : {
            id
        }
    });

    res.send(JSON.stringify(data));

});

router.get('/userall', async (req,res)=>{

    const data = await User.findAll({});
    res.send(JSON.stringify(data));

});

router.get('/user/search/:keyword', async (req,res)=>{

    const { keyword } = req.params;

    const where = {
        name : { [Op.like] : `%${keyword}%`}
    };

    const data = await User.findAll({
        where
    });
    
    res.send(JSON.stringify(data));

});

router.post('/user',async (req,res,next)=>{

    try {
        const data = await User.create(req.body);
        res.send(JSON.stringify(data.dataValues));
    } catch (error) {
        res.status(302).send(error);
    }
    
});

const commentAttributes = ['id','comment','created_at'];
const userJoinModel = {
    model : User,
    attributes : ['name'],
    required: true
};

async function commentById(req,res){

    const {id} = req.params;

    const data = await Comment.findOne({
        attributes : commentAttributes,
        include : userJoinModel,
        where : {
            id
        }
    })

    res.send(JSON.stringify(data.dataValues));

};


router.get('/comment/:id', commentById);

router.get('/commenter/:commenter' , async(req,res)=>{
    
    const { commenter } = req.params;

    const data = await Comment.findAll({
        attributes : commentAttributes,
        include : userJoinModel,
        where : { commenter }
    });
    res.send(JSON.stringify(data));
});

router.get('/comment', async(req,res)=>{

    try {
        const data = await Comment.findAll({
            attributes : commentAttributes,
            include : userJoinModel
        });
        res.send(JSON.stringify(data)); 
    } catch (error) {
        res.status(302).send(error);
    }
});

router.post('/comment', async(req,res)=>{

    const { name, comment } = req.body;

    try {
        const data = await Comment.create({
            commenter : Sequelize.literal(`(select id from users where name = '${name}')`),
            comment
        });

        req.params.id = data.dataValues.id;

        commentById(req,res);
    
    } catch (error) {
        res.status(302).send(error);
    }

});

router.put('/comment/:id', async(req, res)=>{
    const {id} = req.params;

    try {
        const data = await Comment.update(req.body,{
            where : { id }
        });

        res.send(data);

    } catch (error) {
        res.status(302).send(error);
    }
});

router.delete('/comment/:id', async(req,res)=>{
    const {id} = req.params;
    try {

        const data = await Comment.destroy({
            where : { id }
        });

        res.send(JSON.stringify(data));
    } catch (error) {
        res.status(302).send(error);
    }
});

module.exports = router;