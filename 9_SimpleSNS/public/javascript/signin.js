function signInFormEvent(){
    var signInForm = document.getElementById('signInForm');

    if(signInForm) signInForm.addEventListener('submit', function(e){

        e.preventDefault();
        e.stopPropagation();
        
        var form = e.currentTarget;

        xhrConnect(form.method, form.action,{
            header : {
                'Content-Type' : 'application/text; charset=utf-8'
            },
            
            status200 : function(res){
            
                var headerBar = document.getElementById('headerBar');
                headerBar.innerHTML = res;

                userModifyEvent();

                signOutEvent();

            
            }, status401 : function(){

                alertBox('정보가 잘못되었습니다.');
            
            }

        });

    });

};