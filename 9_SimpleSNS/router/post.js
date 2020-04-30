const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn, reqUrlCheck } = require('./middlewares');
const { Member, Post, PostImg, sequelize, Sequelize : { op } } = require('../models');

const member = {
    model : Member,
    attributes : ['id','nickname', 'profileImg']
}
const postImg = {
    model : PostImg,
    attributes : ['path']
}

router.get('/',reqUrlCheck, async (req,res,next)=>{
    
    const { offset } = req.query

    const attributes = ['id','content','memberId',
        [sequelize.fn('date_format', sequelize.col('createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'],
        [sequelize.fn('date_format', sequelize.col('updatedAt'), '%Y-%m-%d %H:%i:%s'), 'updatedAt'],
        [sequelize.fn('date_format', sequelize.col('deletedAt'), '%Y-%m-%d %H:%i:%s'), 'deletedAt'],
        [sequelize.literal('(select count(*) from comments where postId = post.id)'),'commentCount'],
        [sequelize.literal('(select count(*) from favorite where postId = post.id)'),'favoriteCount']
    ]

    try {

        const list = await Post.findAll({
            attributes,
            include :[member, postImg],
            offset , limit : 10,
            order : [ ['createdAt','DESC'] ]
        });
        res.render('posts', { list });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/',reqUrlCheck, isLoggedIn, async (req,res,next)=>{

    try {

        const data = await Post.create({
            ...req.body, memberId : req.user.id
         });
         console.log(data);

         res.json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;