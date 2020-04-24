(function authCheck(){
    xhrConnect('get', '/auth', {
        
        haeder : {
            'Context-Type' : 'application/html; charset=utf-8'
        },

        status200 : function(res){

            var headerBar = document.getElementById('headerBar');
            headerBar.innerHTML = res;

            signInFormEvent();

            userModifyEvent();

            signOutEvent();

        }
    });
})();
