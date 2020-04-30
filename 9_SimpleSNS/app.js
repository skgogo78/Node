const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();


const pageRouter = require('./router/page');
const authRouter = require('./router/auth');
const imgRouter = require('./router/img');
const postRouter = require('./router/post');

const sequelize = require('./models').sequelize;

const passportConfig = require('./passport');

const app = express();

sequelize.sync();

passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);




app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded( { extended : false } ));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true,
        secure : false
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


app.use('/',pageRouter);
app.use('/auth',authRouter);
app.use('/img',imgRouter);
app.use('/post',postRouter);

app.use((req,res,next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).render('error');
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port') + '번 포트 대기중...');
});