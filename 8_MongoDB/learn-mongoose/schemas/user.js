const mongoose = require('mongoose');

// mongoose 객체가 가지고 있는 Schema 객체로 스키마 정의
const { Schema } = mongoose;
const userSchema = new Schema({

    name : {
        type : String,
        // not null
        requeired : true,
        // 유니크
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    age : {
        type : Number,
        required : true
    },

    married : {
        type : Boolean,
        required : true
    },

    // 특별한 옵션이 필요 없다면 필드명과 타입만 명시해주면 된다.
    comment : String,

    createAt : {
        type : Date,
        default : Date.now
    }

});

// mongoose에 몽고와 컬레션을 연결해주는 모델 등록
module.exports = mongoose.model('User', userSchema);