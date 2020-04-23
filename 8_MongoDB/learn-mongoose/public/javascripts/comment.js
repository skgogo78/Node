var commentInsertBtn = document.getElementById('commentInsertBtn');

function commentInsertAndUpdate(e){

    e.preventDefault();
    e.stopPropagation();

    var form = e.currentTarget;
    var _id = form._id? '/' + form._id.value : '';
    var comment = form.comment.value;

    if(!comment){
        alertBox('작성 내용이 없습니다!');
        return;
    }

    var method = form._method? form._method.value : form.method;

    xhrConnect(method, form.action + _id, {
        header : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        requestObject : { 'comment' : comment },
        status200 : function(res){
            if(method === 'post'){
                alertBox('작성 완료되었습니다.');
                var data = JSON.parse(res);
                commentCreate(data);
            } else {
                alertBox('수정 완료되었습니다.');
                var data = JSON.parse(res);
                var comments = document.querySelectorAll('ul#commentListUl > li');
                comments.forEach(function(o){
                    if(o.dataset._id === data._id){
                        console.log('으악');
                        o.querySelector('ul.commentItem > li:nth-child(2)').innerHTML = data.comment;
                        return;
                    }
                });
            }
            form.parentNode.remove();
        }
    });
}



var commentListUl = document.getElementById('commentListUl');

function commentBox(e){

    var check = e.currentTarget;

    function boxCreate(oldObject){
        var body = document.getElementsByTagName('body')[0];

        var commentBox = document.getElementById('commentBox');
        if(commentBox) commentBox.remove();

        var comment = elementCreate('textarea');
        comment.id = 'comment'
        comment.name = 'comment';
        if(oldObject) comment.value = oldObject.comment;

        var fieldObject = [comment]; 

        if(oldObject){
            var _id = elementCreate('input');
            _id.type = 'hidden';
            _id.name = '_id';
            _id.value = oldObject._id;

            var method = elementCreate('input');
            method.type = 'hidden';
            method.name = '_method';
            method.value = 'put';

            fieldObject.push(_id);
            fieldObject.push(method);
        }

        var field = elementCreate('fieldset', { 
            id : 'commentInsertField',
            addAttribute : function(el){
                el.innerHTML = '<legend>코멘트 등록</legend>'
            },
            addObjects : fieldObject
        });

        if(oldObject){
            var deleteBtn = elementCreate('button');
            deleteBtn.innerHTML = '삭제';
            deleteBtn.style.float = 'left';
            deleteBtn.addEventListener('click', function(e){
                
                e.preventDefault();
                e.stopPropagation();

                xhrConnect('delete', '/comments/'+oldObject._id, {
                    status200 : function(res){
                        alertBox('삭제에 성공했습니다.');
                        document.querySelectorAll('ul#commentListUl > li').forEach(function(li){
                            if(li.dataset._id === oldObject._id){
                                li.remove();
                                return;
                            }
                        });
                        deleteBtn.parentNode.parentNode.remove();
                    }
                });
            });
        }

        var submitBtn = elementCreate('input');
        submitBtn.type='submit';
        submitBtn.style.float = 'left';
        submitBtn.value= oldObject? '수정' : '등록';

        var closeBtn = elementCreate('button');
        closeBtn.innerHTML = '닫기';
        closeBtn.style.float = 'right';
        closeBtn.addEventListener('click', function(e){
            var target = e.currentTarget.parentNode.parentNode;
            target.remove();
        });

        var form = elementCreate('form', {
            id : 'commentInsertForm',
            addObjects : [field,  closeBtn, submitBtn, deleteBtn]
        });
        form.action = '/comments';
        form.method = 'post';
        form.addEventListener('submit', commentInsertAndUpdate);

        commentBox = elementCreate('div', {
            id : 'commentBox',
            classNames : 'box',
            addObjects : [form]
        });

        body.appendChild(commentBox);
    }

    if(check.tagName === 'LI'){
        xhrConnect('get', '/comments/'+check.dataset._id, {
            async : false,
            status200 : function(res){
                var data = JSON.parse(res);
                boxCreate(data);
            }
        });
    } else {

        boxCreate();

    }

}

function commentCreate(data){

    var _commenter = elementCreate('li');
    _commenter.innerHTML = data.commenter.name;

    var _comment = elementCreate('li');
    _comment.innerHTML = data.comment;

    var _createAt = elementCreate('li');
    _createAt.innerHTML = data.createAt;

    var _ul = elementCreate('ul', {
        classNames : 'commentItem',
        addObjects : [_commenter,_comment,_createAt]
    });
    

    var li = elementCreate('li');
    li.dataset._id = data._id;
    li.appendChild(_ul);
    li.addEventListener('mousedown', commentBox);

    commentListUl.appendChild(li);

}

function commentFind(obj){
    xhrConnect('get', '/comments', {
        requestObject : (obj? obj : null),
        status200 : function(res){
            var data = JSON.parse(res);
            commentListUl.querySelectorAll('ul#commentListUl > li').forEach(function(li,index){
                if(index != 0){
                    li.remove();
                }
            });
            if(data instanceof Array){
                data.forEach(function(doc){
                    commentCreate(doc);
                });
            }
        }
    });
}

if(commentInsertBtn) commentInsertBtn.addEventListener('mousedown', commentBox);

var myComment = document.getElementById('myComment');

myComment.addEventListener('mousedown',function(e){
    var keyword = document.getElementById('searchKeyword').value;
    commentFind({ me : 'my', 'keyword' : keyword });
});

var serachBtn = document.getElementById('serachBtn');

serachBtn.addEventListener('mousedown',function(e){
    var keyword = document.getElementById('searchKeyword').value;
    commentFind({ 'keyword' : keyword });
});

var commentListRead = document.getElementById('commentListRead');

commentListRead.addEventListener('mousedown', function(e){
    commentFind();
});

commentFind();