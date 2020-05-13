const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn, reqUrlCheck, isPostAuthCheck } = require('./middlewares');
const { Member, Post, PostImg, sequelize, Sequelize : { op } } = require('../models');

const member = {
    model : Member,
    attributes : ['id','nickname', 'profileImg']
}
const postImg = {
    model : PostImg,
    attributes : ['id', 'path']
}

const attributes = ['id','content','memberId',
        [sequelize.fn('date_format', sequelize.col('post.createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'],
        [sequelize.fn('date_format', sequelize.col('post.updatedAt'), '%Y-%m-%d %H:%i:%s'), 'updatedAt'],
        [sequelize.fn('date_format', sequelize.col('post.deletedAt'), '%Y-%m-%d %H:%i:%s'), 'deletedAt'],
        [sequelize.literal('(select count(*) from comments where postId = post.id)'),'commentCount'],
        [sequelize.literal('(select count(*) from favorite where postId = post.id)'),'favoriteCount']
]

router.get('/',reqUrlCheck, async (req,res,next)=>{
    
    let { offset } = req.query;
    offset = offset? Number(offset) : 0;

    let where = {};

    const querys = Object.keys(req.query);

    querys.forEach(k=>{
        if(k.split('_')[0] === 'where'){
            const fieldAndRow = req.query[k].split('_');
            where[fieldAndRow[1]] = fieldAndRow[0];
        }
    });

    const { user } = req.user? req.user : '';

    try {

        const list = await Post.findAll({
            attributes,
            include :[member, postImg],
            where,
            offset,
            limit : 10,
            order : [ ['createdAt','DESC'],[{ model : PostImg }, 'id', 'DESC'] ]
        });
        res.render('posts', { list, user });

    } catch (error) {

        console.error(error);
        next(error);

    }

});

router.get('/:id',reqUrlCheck, async (req,res,next)=>{

    const { id } =  req.params;
    const { imgSelectId } = req.query;

    const { user } = req.user? req.user : '';

    try {
        const data = await Post.findOne({
            where : { id },
            attributes,
            include : [member, postImg]
        });

        res.render('selectPostImg', {
            data : data.dataValues, imgSelectId, user
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
    
});

router.get('/json/:id',reqUrlCheck, isLoggedIn, isPostAuthCheck, async (req,res,next)=>{

    const { id } =  req.params;

    try {
        const data = await Post.findOne({
            where : { id },
            attributes,
            include : [member, postImg]
        });

        res.json(data.dataValues);

    } catch (error) {
        console.error(error);
        next(error);
    }
    
});



router.post('/',reqUrlCheck, isLoggedIn, async (req,res,next)=>{

    const { content, postImg } = req.body;
    
    try {

        const data = await Post.create({
            memberId : req.user.id, content
        });

        if(postImg) postImg.forEach(async path=>{
            if(path) PostImg.create({
                postId : data.dataValues.id,
                path
            });
        });

        res.json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }

});


router.put('/:id', reqUrlCheck, isLoggedIn, isPostAuthCheck, async (req,res,next)=>{
    const { id } = req.params;
    const { content, postImg } = req.body;

    try {
        let data = await Post.update({ content },{ where : { id } });
        if(data > 0){
            if(postImg.length > 0){
                
                const oldImgList = await PostImg.findAll({ where : { postId : id } });
                
                postImg.forEach(async path=>{

                    if(path){
                        let chk = false;

                        for(img of oldImgList){
                            if(img.dataValues.path === path){
                                chk = true;
                                return;
                            }
                        }

                        if(!chk){
                            await PostImg.create({
                                postId : id,
                                path
                            });
                        }
                    }

                });

                oldImgList.forEach( async img => {

                    let chk = false;
                    
                    for(path of postImg){
                        if(img.dataValues.path === path){
                            chk = true;
                            return;
                        }
                    }

                    if(!chk){
                        await PostImg.destroy({
                            where : { id : img.dataValues.id }
                        });
                    }

                });

            }
        }

        res.json({ id });

    } catch (error) {
        
        console.error(error);
        next(error);

    }
    
});

router.delete('/:id', reqUrlCheck, isLoggedIn, isPostAuthCheck, async (req,res,next)=>{

    const { id } = req.params;

    try {
        
        const data = await Post.destroy({
            where : { id }
        });

        console.log(data);
        
        res.json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;