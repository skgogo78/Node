var loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e){

    e.preventDefault();
    e.stopPropagation();

    var form = e.currentTarget;
    var name = form.name.value;
    var password = form.password.value;

    if(!name || !password){
        alertBox('누락된 정보가 있습니다.');
    }

    var requestObject = {
        'name' : name,
        'password' : password
    }

    xhrConnect(form.method, form.action, {
        'header' : { 'content-type' : 'application/json; charset=utf-8;'},
        'requestObject' : requestObject,
        'status200' : function(res){
            location.reload();
        },
        'status401' : function(res){
            alertBox( '정보가 올바르지 않습니다.');
        }
    });

});

function signUpAndModify(e){

    e.preventDefault();
    e.stopPropagation();

    var form = e.currentTarget;

    var name = form.name.value;
    var password = form.password.value;
    var married = form.married.value;
    var age = form.age.value;
    var comment = form.comment.value;
    var method = form._method? form._method.value : form.method; 

    if(!name || !password || !married || !age || !comment){
        alertBox('정보가 누락되었습니다.');
        return;
    }

    var requestObject = {
        'name' : name,
        'password' : password,
        'married' : married,
        'age' : age,
        'comment' : comment
    };

    xhrConnect(method, form.action, {
        'header' : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        'requestObject' : requestObject,
        'status200' : function(res){
            var data = JSON.parse(res);
            alertBox(data.name + '님 가입을 축하합니다.');
            form.parentNode.remove();
        },
        'status401' : function(res){
            alert('중복된 아이디가 있습니다.');
        }
    });
}

var signup = document.getElementById('signup');

signup.addEventListener('click',function(e){

    var body = document.getElementsByTagName('body')[0];

    var name = elementCreate('input');
    name.type = 'text';
    name.name = 'name';
    name.placeholder = '이름';
    
    var password = elementCreate('input');
    password.type = 'password';
    password.name = 'password';
    password.placeholder = '비밀번호';
    
    var age = elementCreate('input');
    age.type = 'number';
    age.name = 'age';
    age.placeholder = '나이';
    
    var married_0 = elementCreate('input');
    married_0.type = 'checkbox';
    married_0.name = 'married_0';
    married_0.value = true;

    var married_0_p = elementCreate('p',
    { 
        addAttribute : function(el){ el.innerHTML = '기혼 : '},
        addObjects : married_0 
    });

    var married_1 = elementCreate('input');
    married_1.type = 'checkbox';
    married_1.name = 'married_1';
    married_1.value = false;

    var married_1_p = elementCreate('p',
    { 
        addAttribute : function(el){ el.innerHTML = '미혼 : '},
        addObjects : married_1 
    });

    var married = elementCreate('input');
    married.name = 'married'
    married.type = 'hidden';

    checkBoxOnlyOne([married_0, married_1], married);

    var marriedField = elementCreate('fieldset', {
        addAttribute : function(el){
            el.style.padding = '5px'; 
            el.style.margin = '5px';
            el.style.width = 'auto';
            el.style.borderRadius = '5px';
            el.innerHTML = '<legend>결혼 정보</legend>'
        },
        addObjects : [married_0_p, married_1_p, married]
    });

    var comment = elementCreate('textarea');
    comment.name = 'comment';
    comment.placeholder = '자기를 소개해주세요.';

    var fieldset = elementCreate('fieldset',
    { 
        id : 'signUpField',
        addAttribute : function(el){
            el.innerHTML = '<legend>회원 가입</legend>' 
        },
        addObjects : [name, password, age, marriedField, comment],
    })

    var submitBtn = elementCreate('input', { id : 'signUpSubmitBtn' });
    submitBtn.value = '가입';
    submitBtn.type = 'submit';
    submitBtn.style.float = 'left';

    var closeBtn = elementCreate('button', { id : 'signUpCloseBtn' });
    closeBtn.style.float = 'right';
    closeBtn.innerHTML = '닫기';
    closeBtn.addEventListener('mousedown', function(e){
        var target = e.currentTarget.parentNode;
        target.remove();
    });

    var form = elementCreate('form',
    {
        id : 'signUpForm',
        addObjects : [fieldset,submitBtn, closeBtn]
    });
    form.action = '/users/signup';
    form.method = 'post';

    form.addEventListener('submit', signUpAndModify);

    var box = elementCreate('div', { id : 'signUpBox', classNames : 'box', addObjects : [ form ] });

    body.appendChild(box);

});