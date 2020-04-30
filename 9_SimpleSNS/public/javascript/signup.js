function signUpEventFun(){
    var signUpCloseBtn = document.getElementById('signUpCloseBtn');
    if(signUpCloseBtn) signUpCloseBtn.addEventListener('mousedown', function(e){
        
        e.preventDefault();
        e.stopPropagation();

        authCheck();
    });

    var signUpImgInput = document.getElementById('signUpImgInput');
    if(signUpImgInput) signUpImgInput.addEventListener('change',function(e){

        var file = e.currentTarget.files[0];
        
        if(!fileImageCheck(file)){

            alertBox('이미지만 올릴 수 있습니다.');
            e.currentTarget.value = '';
            return false;

        } else {

            var data = new FormData();

            data.append('img', file);

            xhrConnect('post','/img/profile',{
                requestObject : data,
                status200 : function(res){
                    var data = JSON.parse(res);
                    var signUpImg = document.getElementById('signUpImg');
                    signUpImg.src = data.url;
                }
            })

        }

    });

    var signUpForm = document.getElementById('signUpForm');
    if(signUpForm) signUpForm.addEventListener('submit', function(e){
        
        e.preventDefault();
        e.stopPropagation();

        var form = e.currentTarget;

        var method = form._method? form._method.value : form.method

        var profileImg = document.getElementById('signUpImg').src;
        var nickname = form.nickname.value;
        var password = form.password.value;
        var _password = form._password.value;
        var email = form.email.value;
        

        if(!nickname || !password || !email || !_password){
            alertBox('정보가 누락되었습니다.');
            return;
        }

        if(password !== _password){
            alertBox('패스워드를 확인해주세요.');
            return;
        }
        
        xhrConnect(method, form.action, {
            header : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            requestObject : {
                'nickname' : nickname,
                'password' : password,
                'email' : email,
                'profileImg' : profileImg
            },
            status200 : function(res){

                if(res){

                    var data = JSON.parse(res);

                    if(data.status_category === 'success'){

                        var data2 = JSON.parse(data.message);
                        authCheck();

                        if(method !== 'put') alertBox(data2.nickname + '님 가입을 환영합니다.');
                        else {
                            menuExtendDelete();
                            alertBox(data2.nickname + '님의 정보가 수정 완료되었습니다.');
                        }
                  
                    } else {

                        alertBox(data.message);
                    }
                }
            }
        });
    
    });
}