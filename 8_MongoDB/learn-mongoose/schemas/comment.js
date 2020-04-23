const mongoose = require('mongoose');

// mongoose 객체가 가지고 있는 Schema 객체로 스키마 정의
const { Schema } = mongoose;
// const { Types : { ObjectId } } = Schema; 
const commentSchema = new Schema({

    commenter : {
        type : mongoose.ObjectId,
        required : true,
        // User 스키마의 ObjectId 값을 참조한다는 의미
        ref : 'User'
    },

    comment : {
        type : String,
        required : true
    },

    createAt : {
        type : Date,
        default : Date.now
    }

});

// mongoose에 몽고와 컬레션을 연결해주는 모델 등록
module.exports = mongoose.model('Comment', commentSchema);