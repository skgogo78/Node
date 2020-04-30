exports.reqUrlCheck = (req,res,next)=>{
    const { p } = req.query;
    if(p === 'http://localhost:8001/'){
        next();
    } else {
        const err = new Error('올바르지 못한 방법으로 접근');
        err.status = 403;
        next(err);
    }
};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        const err = new Error('로그인이 필요합니다');
        err.status = 403;
        next(err);
    }
}


exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    } else {
        res.redirect('/');
    }
}