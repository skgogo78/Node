function commentElementCreate(commentList, val){

    var id = val.id;
    var comment = val.comment;
    var name = val.user.name;
    var date = new Date(val.created_at).dateFormat();

    var commentListItem = document.createElement('li');
    commentListItem.classList.add('commentListItem');
    
    var commentUl = document.createElement('ul');
    commentUl.classList.add('commentUl');
    commentUl.dataset.id = id;

    var commentNo = document.createElement('li');
    commentNo.classList.add('commentNo');
    commentNo.innerHTML = id;

    var commentName = document.createElement('li');
    commentName.classList.add('commentName');
    commentName.innerHTML = name;

    var commentText = document.createElement('li');
    commentText.classList.add('commentText');
    commentText.innerHTML = comment;

    var commentDate = document.createElement('li');
    commentDate.classList.add('commentDate');
    commentDate.innerHTML = date;

    commentUl.appendChild(commentNo);
    commentUl.appendChild(commentName);
    commentUl.appendChild(commentText);
    commentUl.appendChild(commentDate);

    commentListItem.appendChild(commentUl);

    commentList.appendChild(commentListItem);

    if(!arguments[3]){
        commentUl.addEventListener('mousedown',function(e){

            
            var commentAddForm = document.getElementById('commentAddForm');
            
            commentAddForm.querySelector('input[name=name]').value = e.currentTarget.querySelector('.commentName').innerHTML;
            commentAddForm.querySelector('textarea').value = e.currentTarget.querySelector('.commentText').innerHTML;
        
            if(!commentAddForm.querySelector('input[name=update]')){

                var submit = commentAddForm.querySelector('input[type=submit]');
                submit.value = '수정';

                var update = document.createElement('input');
                update.name='update';
                update.type='hidden';
                update.value = e.currentTarget.dataset.id;

                
                var cancel = document.createElement('input');
                cancel.name = 'cancel';
                cancel.type = 'button';
                cancel.value = '취소';

                cancel.addEventListener('mousedown',function(e){
                    
                    var commentAddForm = e.currentTarget.parentNode.parentNode;

                    commentAddForm.querySelector('input[type=hidden]').remove();
                    commentAddForm.querySelector('input[name=delete]').remove();
                    commentAddForm.querySelector('input[type=submit]').value = '등록';
                    commentAddForm.querySelector('input[name=name]').value = '';
                    commentAddForm.querySelector('textarea').value = '';


                    e.target.remove();

                });

                var deleteBtn = document.createElement('input');

                deleteBtn.name='delete';
                deleteBtn.type='button';
                deleteBtn.value='삭제';

                deleteBtn.addEventListener('mousedown', function(e){
                    
                    var commentAddForm = e.currentTarget.parentNode.parentNode;


                    var id = commentAddForm.update.value;

                    var xhr = new XMLHttpRequest();

                    xhr.open('delete', commentAddForm.action + '/' + id);

                    xhr.onreadystatechange = function(){

                        if(xhr.readyState === 4){
                            if(xhr.status === 200){
                                if(xhr.responseText){
                                    var commentUls = document.querySelectorAll('.commentUl');
                                    commentUls.forEach(function(val){
                                        if(Number(val.dataset.id) === Number(id)){
                                            val.parentNode.remove();

                                            commentAddForm.querySelector('input[type=hidden]').remove();
                                            commentAddForm.querySelector('input[name=cancel]').remove();
                                            commentAddForm.querySelector('input[type=submit]').value = '등록';
                                            commentAddForm.querySelector('input[name=name]').value = '';
                                            commentAddForm.querySelector('textarea').value = '';
                                            e.target.remove();

                                            return;
                                        }
                                    });
                                }
                            }
                        }
                    }

                    xhr.send();
                });

                submit.parentNode.appendChild(deleteBtn);
                submit.parentNode.appendChild(cancel);
                commentAddForm.appendChild(update);

            } else {

                commentAddForm.querySelector('input[name=update]').value = e.currentTarget.dataset.id;
        
            }
            
        });
    }

}

function commentUlCreate(data){

    var commentList = document.getElementById('commentList');


    if(data instanceof Array){

        data.forEach(function(val,index){
            commentElementCreate(commentList,val);
        });
        
    } else {
        commentElementCreate(commentList,data);
    }

}

function commentList(){


    var xhr = new XMLHttpRequest();

    xhr.open('get', '/db/comment');

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                if(xhr.responseText){
                    commentUlCreate(JSON.parse(xhr.responseText));
                }
            }
        }
    }

    xhr.send();

}

function commentAddAndUpdate(form){

    form.addEventListener('submit',function(e){
        
        e.preventDefault();
        e.stopPropagation();

        var formData = e.target;
        var name = formData.name;
        var comment = formData.comment;
        var update = formData.update;

        var xhr = new XMLHttpRequest();

        var method = update? 'put' : formData.method;
        var url = update? formData.action + '/' + update.value : formData.action;

        xhr.open(method, url);

        xhr.onreadystatechange = function(){

            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    if(xhr.responseText){

                        if(method === 'put'){

                            var commentUls = document.querySelectorAll('.commentUl');

                            commentUls.forEach(function(val){
                                if(Number(val.dataset.id) === Number(update.value)){

                                    val.querySelector('.commentName').innerHTML = name.value;
                                    val.querySelector('.commentText').innerHTML = comment.value;

                                    formData.update.remove();
                                    formData.querySelector('input[name=cancel]').remove();
                                    formData.querySelector('input[name=delete]').remove();
                                    formData.querySelector('input[type=submit]').value = '등록';

                                    return;
                                }
                            });
                            
                        } else {
                            commentUlCreate(JSON.parse(xhr.responseText));
                        }

                        name.value = '';
                        comment.value = '';
                    }
                } else if (xhr.status === 302){

                    alertCreate('<p>코멘트 등록에 실패했습니다. </p>');

                }
            }

        }

        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(JSON.stringify({ 'name' : name.value, 'comment' : comment.value}));

    });
}

var commentAddForm = document.getElementById('commentAddForm');

commentAddAndUpdate(commentAddForm);

commentList();