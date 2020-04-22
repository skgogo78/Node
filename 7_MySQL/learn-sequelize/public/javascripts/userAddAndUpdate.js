
var userAddForm = document.getElementById('userAddForm');

function userAddAndUpdate(form, update){
    form.addEventListener('submit',function(e){

        e.preventDefault();
        e.stopPropagation();

        var form = e.target;
        
        var params = Array.from(Object.entries(form)).reduce(function(obj, input){
            if(/(input|textarea|select)/.test(input[1].tagName.toLowerCase())&&!/(button|^submit)/.test(input[1].type)){
                
                if(input[1].type==='checkbox' && !input[1].checked){
                    return obj;
                }
                
                var name = input[1].name;
                var value = input[1].value;
                
                obj[name] = value;
            
            } 
            return obj;
        },{});

        var xhr = new XMLHttpRequest();
        
        var method = form.method;

        if(update){
            method = 'put';
        }

        xhr.open(method, form.action);

        xhr.onreadystatechange = function(){
            var readyState = xhr.readyState;
            
            if(readyState === 4){
                if(xhr.status === 200){

                    var resObject = JSON.parse(xhr.responseText);
                    if(method === 'post'){

                        alertCreate('<p>' + resObject.name + '님이 등록되었습니다. </p>');
                        form.name.value = '';
                        form.age.value = '';
                        form.comment.value = '';

                    } else {
                        alertCreate('<p>' + params.name + '님의 정보가 수정되었습니다. </p>');
                        form.parentNode.parentNode.remove();
                    }

                    userListAll();

                } else if (xhr.status === 302){

                    alertCreate('<p>' + params.name + '님 등록이 실패했습니다. </p>');

                }
            }
        }
        
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(JSON.stringify(params));
    });
}


userAddAndUpdate(userAddForm);