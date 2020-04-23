const mongoose = require('mongoose');

module.exports = () =>{
    
    const connect = ()=>{
        if( process.env.NODE_ENV !== 'production' ){
            // 개발환경이 아닐 때 몽구스가 생성하는 쿼리문을 확인할 수 있게 하는 몽구스 디버그 옵션
            mongoose.set('debug', true);
        }

        // [몽구스 객체].connect([몽고 접속 url], [결과 콜백 (에러) => {}])
        mongoose.connect('mongodb://root:123123@localhost:27017/admin', {
            dbName : 'nodejs'
        }, (err)=>{
            if(err){
                console.error('몽고 연결 실패');
                console.error(err);
            } else {
                console.log('몽고 연결');
            }
        });

    }

    // 몽고 연결 시도
    connect();

    // 이벤트 리스너
    // [몽구스 객체].connection[연결된 객체].on([이벤트종류], [콜백]); 
    mongoose.connection.on('error', (err)=>{
        console.error('몽고 연결 실패', err);
    });

    mongoose.connection.on('disconnected', ()=>{
        console.error('몽고 연결 끊어짐 재연결 시도');
        connect();
    });

    // 해당 모듈의 함수를 실행 시키면 아래 모듈도 자동으로 연결된다.
    // 이때 아래 모듈은 몽고디비에서 user와 comment 컬렉션을 스키마 형태로 정의해 놓은 모듈이다. 
    require('./user');
    require('./comment');

};