function alertCreate(text){

    var alertDiv = document.createElement('div');

    alertDiv.classList.add('alert');
    alertDiv.innerHTML = text;
    
    var closeBtn = document.createElement('input');
    closeBtn.type = 'button';
    closeBtn.value = '닫기';

    closeBtn.addEventListener('click',function(e){
        var btn = e.currentTarget;
        btn.parentNode.remove();
    });

    alertDiv.appendChild(closeBtn);

    var body = document.querySelector('body');

    body.appendChild(alertDiv);

    window.setTimeout(function(){
        alertDiv.remove();
    },3000);
}





function userDelete(id){

    var xhr = new XMLHttpRequest();

    xhr.open('delete','/db/user/'+id);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === xhr.DONE){
            if(xhr.status === 200){
                if(xhr.responseText){
                    alertCreate('<p>유저가 삭제되었습니다.</p>');
                    var userListItems = document.querySelectorAll('.userListItem');
                    userListItems.forEach(function(item){
                        if(Number(item.dataset.id) === id){
                            item.remove();
                            return;
                        }
                    });
                }
            }
        }
    }

    xhr.send();
}

function userSelect(id){
    var xhr = new XMLHttpRequest();
    xhr.open('get','/db/user/'+id);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === xhr.DONE){
            if(xhr.status === 200 || xhr.status === 304){
                if(xhr.responseText){
                    selectBox(JSON.parse(xhr.responseText));
                }
            }
        }
    }

    xhr.send();
}


function userListAll(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','/db/userall');

    xhr.onreadystatechange = function(){
        if(xhr.readyState === xhr.DONE){
            if(xhr.status === 200){
                if(xhr.responseText){
                    createList(xhr.responseText);
                }
            }
        }
    }

    xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
    xhr.send();
}

function createList(data){

    var userList = document.getElementById('userList');

    userList.innerHTML = '';

    var resObject = JSON.parse(data);


    resObject.forEach(function(user){

        var li = document.createElement('li');
        li.classList.add('userListItem');
        li.dataset.id = user.id;
        li.addEventListener('mousedown', function(e){
            
            var target = e.currentTarget;
            var id = target.dataset.id;

            userSelect(id);

        });

        var _ul = document.createElement('ul');
        _ul.classList.add('userListItemUl');

        var id = document.createElement('li');
        id.classList.add('idLi');
        id.innerHTML=user.id;

        var name = document.createElement('li');
        name.classList.add('nameLi');
        name.innerHTML=user.name;

        var createdAt = document.createElement('li');
        createdAt.classList.add('createdAtLi');
        createdAt.innerHTML = new Date(user.created_at).dateFormat();
        
        _ul.appendChild(id);
        _ul.appendChild(name);
        _ul.appendChild(createdAt);

        li.appendChild(_ul);

        userList.appendChild(li);

    });

}


Date.prototype.dateFormat = function (){
    var year = this.getFullYear();              //yyyy
    var month = (1 + this.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = this.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '년 ' + month + '월 ' + day + '일';
}



window.onload = function(){
    
    userListAll();

}