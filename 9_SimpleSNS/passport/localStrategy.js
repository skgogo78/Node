const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { Member } = require('../models');


module.exports = (passport) =>{

    passport.use(new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password'

    }, async (email, password, done)=>{

        try {

            const chk = await Member.findOne({
                where : { email }
            });

            if(chk){

                const res = await bcrypt.compare(password, chk.password);

                if(res){

                    done(null, chk);

                } else {

                    done(null, false, { message : '정보가 일치하지 않습니다.' });

                }

            } else {

                done(null, false, { message : '정보가 일치하지 않습니다.' });

            }
            
        } catch (error) {
            
        }
    }));
}