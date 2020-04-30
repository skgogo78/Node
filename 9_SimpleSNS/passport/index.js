const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
const { Member } = require('../models');

module.exports = (passport)=>{

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done)=>{

        try {
            const data = await Member.findOne({
                attributes : [ 'id', 'nickname', 'email', 'profileImg' ],
                where : { id }
            });
            done(null, data);            
        } catch (error) {
            done(error);
        }

    });

    local(passport);
    // kakao(passport);

}