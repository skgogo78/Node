function updateBox(user){

    var body = document.querySelector('body');

    var div = document.createElement('div');
    div.classList.add('userUpdate');

    var field = document.getElementById('userInfo');

    var updateField = field.cloneNode(true);

    div.appendChild(updateField);

    var form = updateField.querySelector('form');

    form.action = form.action+'/'+user.id;

    var closeBtn = document.createElement('input');

    closeBtn.type = 'button';
    closeBtn.value = '닫기';
    closeBtn.style.float = 'right';

    closeBtn.addEventListener('click',function(e){
        var btn = e.currentTarget;
        div.remove();
    });

    updateField.querySelector('form > p:nth-last-child(1)').appendChild(closeBtn);

    var submitBtn = form.querySelector('input[type=submit]');

    submitBtn.value = '수정';

    Array.from(Object.entries(form)).forEach(function(input){
        if(/(input|textarea|select)/.test(input[1].tagName.toLowerCase())&&!/(button|^submit)/.test(input[1].type)){
            
            if(input[1].type==='checkbox' && input[1].value === String(user.married)){
                input[1].checked = true;
                return;
            }
            
            var val;

            if(input[1].name === 'name'){
                val = user.name;
            } else if (input[1].name === 'age'){
                val = user.age;
            } else if (input[1].name === 'comment'){
                val = user.comment;
            }
            input[1].value = val;

        } 
    });

    userAddAndUpdate(form, true);

    body.appendChild(div);
    
}


function selectBox(user){

    var body = document.querySelector('body');
    

    var div = document.createElement('div');
    div.classList.add('userSelect');



    var userInfoField = document.createElement('fieldset');
    userInfoField.style='float:left;';

    var userCommentField = document.createElement('fieldset');
    userCommentField.style='float:left;';

    var legend = document.createElement('legend');
    legend.innerHTML = '유저 정보';

    userInfoField.appendChild(legend);

    legend = document.createElement('legend');
    legend.innerHTML = '유저가 등록한 코멘트';

    userCommentField.appendChild(legend);



    var ul = document.createElement('ul');
    ul.classList.add('userItem');
    
    Object.keys(user).forEach(function(key){

        var li = document.createElement('li');
        li.classList.add(key);

        if(key === 'comment'){

            li.innerHTML = '<p>자기 소개</p><p>'+user[key]+'</p>';
            ul.appendChild(li);
            return;
        }

        var _ul = document.createElement('ul');
        
        var _key = document.createElement('li');

        _key.innerHTML = key.toUpperCase();

        var _val = document.createElement('li');

        _val.innerHTML = user[key];

        _ul.appendChild(_key);
        _ul.appendChild(_val);

        li.appendChild(_ul);
        
        ul.appendChild(li);

    });

    var updateBtn = document.createElement('input');

    updateBtn.type = 'button';
    updateBtn.value = '수정';
    updateBtn.style.float = 'left';

    updateBtn.addEventListener('click', function(e){

        var btn = e.currentTarget;
        btn.parentNode.parentNode.remove();

        updateBox(user);

    });

    var deleteBtn = document.createElement('input');

    deleteBtn.type = 'button';
    deleteBtn.value = '삭제';
    deleteBtn.style.float = 'left';

    deleteBtn.addEventListener('click', function(e){

        var btn = e.currentTarget;
        btn.parentNode.parentNode.remove();
        userDelete(user.id);

    });


    var closeBtn = document.createElement('input');

    closeBtn.type = 'button';
    closeBtn.value = '닫기';
    closeBtn.style.float = 'right';

    closeBtn.addEventListener('click',function(e){
        var btn = e.currentTarget;
        btn.parentNode.parentNode.remove();
    });


    var commentList = document.createElement('ul');
    commentList.id = 'commentList';
    commentList.innerHTML = '<li class="commentListItem"><ul class="commentUl"><li class="commentNo">번호</li><li class="commentName">작성자</li><li class="commentText">내용</li><li class="commentDate">작성일</li></ul></li>'


    userInfoField.appendChild(ul)

    userInfoField.appendChild(closeBtn);
    userInfoField.appendChild(updateBtn);
    userInfoField.appendChild(deleteBtn);

    userCommentField.appendChild(commentList);

    div.appendChild(userInfoField);
    div.appendChild(userCommentField);

    body.appendChild(div);

    var xhr = new XMLHttpRequest();

    xhr.open('get', '/db/commenter/'+user.id);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200 || xhr.status === 304){
                if(xhr.responseText){
                    var data = JSON.parse(xhr.responseText);
                    data.forEach(function(val){
                        commentElementCreate(commentList, val, true);
                    });
                }
            }
        }
    }

    xhr.send();
}