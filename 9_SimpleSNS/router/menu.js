const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn, reqUrlCheck } = require('./middlewares');
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

router.get('/:id', reqUrlCheck, async (req,res,next)=>{

    const { id } = req.params;

    try {
        const data = await Post.findOne({
            where : { id },
            attributes,
            include : [member, postImg]
        });

        const menus = ['URL COPY'];

        if(req.user){
            if(data.member.id === req.user.id){
                menus.push('MODIFY' , 'DELETE');
                res.json({
                   menus
                });
            } else {
                menus.push('FAVORITE' , 'FOLLOW');
                res.json({
                    menus
                });
            }
        } else {
            res.json({ menus });
        }
        
        
    } catch (error) {
        console.error(error);
        next(error);
    }

});


module.exports = router;