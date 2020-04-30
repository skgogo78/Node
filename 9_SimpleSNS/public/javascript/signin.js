function signInFormEvent(){
    var signInForm = document.getElementById('signInForm');

    if(signInForm) signInForm.addEventListener('submit', function(e){

        e.preventDefault();
        e.stopPropagation();
        
        var form = e.currentTarget;

        xhrConnect(form.method, form.action,{
            header : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            requestObject : {
                'password' : form.password.value,
                'email' : form.email.value,
            },
            status200 : function(res){
            
                var data = JSON.parse(res);
                
                if(data.status_category === 'success'){
                    authCheck();
                } else {
                    alertBox(data.message);
                }
            
            }, status401 : function(){

                alertBox('정보가 잘못되었습니다.');
            
            }

        });

    });

    var signUpButton = document.getElementById('signUpButton');
    if(signUpButton) signUpButton.addEventListener('mousedown', function(e){
        e.preventDefault();
        e.stopPropagation();

        xhrConnect('get','/auth/signup', {
            status200 : function(res){
                
                var headerBar = document.getElementById('headerBar');
                headerBar.innerHTML = res;
                signUpEventFun();
            }
        });

    });

};