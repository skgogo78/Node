function authCheck(){
    xhrConnect('get', '/auth', {
        
        haeder : {
            'Content-Type' : 'application/html;charset=utf-8'
        },

        status200 : function(res){

            var headerBar = document.getElementById('headerBar');
            headerBar.innerHTML = res;

            signInFormEvent();

            userModifyEvent();

            signOutEvent();

        }
    });
}

function postLoad(keyword){
    var setting = {
        status200: function(res){
            var snsItemList = document.getElementById('snsItemList');
            snsItemList.innerHTML = res;
        }
    }
    if(keyword){
        setting.requestObject = { keyword }
    }

    xhrConnect('get','/post/', setting);
}

authCheck();
