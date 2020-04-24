function menuExtend(){

    var nav = document.querySelector('nav');

    var profile = elementCreate('div', { classNames : '_extendMenu', id : 'profileRead' });
    profile.innerHTML = '<span>MY INFO</span>';

    var follower = elementCreate('div', { classNames : '_extendMenu', id : 'follower' });
    follower.innerHTML = '<span> FOLLOWER </span>';

    nav.appendChild(profile);
    nav.appendChild(follower);

}

function menuExtendDelete(){

    var _extendMenu = document.querySelectorAll('._extendMenu');
    _extendMenu.forEach(function(menu){
        menu.remove();
    });

}

function userModifyEvent(){
    var userModifyBtn = document.getElementById('userModifyBtn');
    if(userModifyBtn){ 
        userModifyBtn.addEventListener('mousedown', function(e){

        });

        menuExtend();
    }
}

function signOutEvent(){

    var signOutButton = document.getElementById('signOutButton');
    if(signOutButton) signOutButton.addEventListener('mousedown', function(){
        xhrConnect('get', '/auth/signout', {
            header : {
                'Content-Type' : 'application/text; charset=utf-8'
            },
            
            status200 : function(res){
            
                var headerBar = document.getElementById('headerBar');
                headerBar.innerHTML = res;

                signInFormEvent();
                menuExtendDelete();
            }
        });
    });

}


