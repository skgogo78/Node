function imgSizeFun(div, that){

    var img = that;
    var selectPostImgDiv = div.querySelector('#selectPostImgDiv');
    var selectPostImg = div.querySelector('#selectPostImg');

    var maxWidth = selectPostImg.offsetWidth * 0.8;
    var width = (img.offsetWidth * (div.offsetHeight/img.offsetHeight)-10);

    selectPostImgDiv.style.width =  ((maxWidth < width)? maxWidth : width) + 'px';

}

function selectPostEvent(div){
    
    xhrConnect('get','/img/post/'+div.querySelector('#selectPost').dataset.id,{
        header : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        status200 : function(res){
            var data = JSON.parse(res);

            var selectPostImg = document.getElementById('selectPostImg');
            selectPostImg.imgs = data;
        }
    })

    var img = div.querySelector('#selectPostImgDiv > img');

    img.addEventListener('load', function(e){
        imgSizeFun(div, e.currentTarget);
    });
    
    
    var selectBtnCloseBtn = div.querySelector('#selectBtnCloseBtn');
    
    selectBtnCloseBtn.addEventListener('mousedown', function(e){

      var selectPostBox = document.getElementById('selectPostBox');
      selectPostBox.remove();

    });

    var selectBtnConToogleBtn = div.querySelector('#selectBtnConToogleBtn');

    function toggleOnEvent(e){
        
        var selectPostRight = div.querySelector('#selectPostRight');
        selectPostRight.style.display = 'block';
        
        var selectPostLeft = div.querySelector('#selectPostLeft');
        selectPostLeft.style.flex = '0 1 80%';

        e.currentTarget.style.transform = '';

        e.currentTarget.addEventListener('mousedown',toggleHideEvent);
        e.currentTarget.removeEventListener('mousedown', toggleOnEvent);
    }

    function toggleHideEvent(e){
        
        var selectPostRight = div.querySelector('#selectPostRight');
        selectPostRight.style.display = 'none';

        var selectPostLeft = div.querySelector('#selectPostLeft');
        selectPostLeft.style.flex = '0 1 100%';

        e.currentTarget.style.transform = 'rotate(180deg)';

        e.currentTarget.addEventListener('mousedown',toggleOnEvent);
        e.currentTarget.removeEventListener('mousedown', toggleHideEvent);

    }
    
    selectBtnConToogleBtn.addEventListener('mousedown', toggleHideEvent);


    function btnEvent(next){
            
        var selectPostImg = document.getElementById('selectPostImg');
        var index = Number(selectPostImg.dataset.index);

        var div = document.getElementById('selectPostBox');

        var img = div.querySelector('#selectPostImgDiv > img');

        var num = next? +1 : -1;

        selectPostImg.dataset.index = index + num;
        img.src = selectPostImg.imgs[index + num].path;
        

        function btnCreate(next){

            var tagId = next? 'selectBtnImgNextBtn' : 'selectBtnImgPrevBtn';

            var btn = document.getElementById(tagId);

            if(!btn){

                var div = elementCreate('div', {

                    id : tagId,
                    classNames : ['btnBack', (next? 'rightBtn2' : 'leftBtn2')],
                    addObjects : [ elementCreate('img', {

                        addAttribute : function(el){
                            el.src = './images/arrows.svg';
                            if(!next) el.style.transform = 'rotate(180deg)';
                        }

                    })]

                });

                var appendTarget = next? 1 : 0;

                var selectPostImgBtnDiv = document.querySelectorAll('.selectPostImgBtnDiv > div:nth-child(2)')[appendTarget];
                if(next) {
                    div.addEventListener('mousedown', function(e){
                        btnEvent();
                    });
                } else {
                    div.addEventListener('mousedown', function(e){
                        btnEvent(true);
                    });
                }

                selectPostImgBtnDiv.appendChild(div);
            }
        }
        
        if(selectPostImg.imgs[Number(selectPostImg.dataset.index)-1]){
            
            btnCreate(true);

        } else {
            
            var btn = document.getElementById('selectBtnImgNextBtn');

            if(btn) btn.remove();
     
        }

        if(selectPostImg.imgs[Number(selectPostImg.dataset.index)+1]){
            
            btnCreate();

        } else {

            var btn = document.getElementById('selectBtnImgPrevBtn');

            if(btn) btn.remove();

        }

        // imgSizeFun(div);
    
    }

    
    var selectBtnImgNextBtn = div.querySelector('#selectBtnImgNextBtn');
    
    if(selectBtnImgNextBtn) {
        selectBtnImgNextBtn.addEventListener('mousedown', function(e){
            btnEvent();
        });
    }

    var selectBtnImgPrevBtn = div.querySelector('#selectBtnImgPrevBtn');
    if(selectBtnImgPrevBtn) {
        selectBtnImgPrevBtn.addEventListener('mousedown', function(e){
            btnEvent(true);
        });
    }

}

function postImgsPreviewEvent(postItem){
    
    var postImgPreviews = postItem.querySelector('.postImgPreviews');
    if(!postImgPreviews) return;

    var postImgPreviewColumns = postImgPreviews.querySelectorAll('.postImgPreviewColumn');
    
    postImgPreviewColumns.forEach(function(postImgPreviewColumn){
        postImgPreviewColumn.addEventListener('mousedown', function(e){
            var imgSelectId = e.currentTarget.dataset.id;
            xhrConnect('get', '/post/'+postItem.dataset.id, {
                requestObject : {
                    'imgSelectId' : imgSelectId
                },
                status200 : function(res){

                    var body = document.querySelector('body');
                    var div = elementCreate('div', { id : 'selectPostBox'});
                    div.innerHTML = res;
                    
                    body.appendChild(div);

                    selectPostEvent(div);

                }
            })
        });
    })
}

function postMenuCreate(setting){
    
    var body = document.querySelector('body');

    var menuPop = document.getElementById('menuPop');
    
    if(!menuPop){

        var menuArea = elementCreate('div', { id : 'menuArea' });
        menuArea.addEventListener('mousedown',function(e){

            e.preventDefault();
            e.stopPropagation();
            var menuPop = document.getElementById('menuPop');
            menuPop.remove();

        });

        var menuUl = elementCreate('ul', { id : 'menuUl' });
        
        var menuDiv = elementCreate('div', { id : 'menuDiv', addObjects : menuUl });
        menuDiv.style.top = setting.menuLocTop + 'px';
        menuDiv.style.left = setting.menuLocLeft + 'px';

        menuPop = elementCreate('div', { id : 'menuPop', addObjects : [menuArea, menuDiv] });
        body.appendChild(menuPop);
    }
    
    var menuUl = menuPop.querySelector('#menuUl');
    menuUl.appendChild(elementCreate('li', {
        id : setting.id,
        classNames : 'menuItem',
        addAttribute : function(el){
            el.innerHTML = setting.menuName;
            el.addEventListener('mousedown', setting.event);
        }
    }));

}

function postMenuEvent(node){
    
    var id = node.dataset.id;
    
    var postMenu = node.querySelector('.postMenu');
    
    var setting = {};

    postMenu.addEventListener('mousedown',function(e){
        var main = document.querySelector('main')
        setting['menuLocTop'] = e.currentTarget.offsetTop - main.scrollTop;
        setting['menuLocLeft'] = e.currentTarget.offsetLeft;
        
        xhrConnect('get', '/menu/'+id, {
            header : {
                'Content-type' : 'application/json;charset=utf-8'
            },
            status200 : function(res){

                var data = JSON.parse(res);
                data.menus.forEach(function(menu){

                    
                    setting['menuName'] = menu;
                    setting['id'] = menu.toLowerCase();

                    function menuPopDelete(){
                        var menuPop = document.getElementById('menuPop');
                        menuPop.remove();
                    }

                    if(menu === 'URL COPY'){
                        setting['id'] = 'urlcopy';
                        setting['event'] = function(e){
                            console.log('해당 트윗 긁기');
                            menuPopDelete();
                        }
                    } else if (menu === 'DELETE'){
                        setting['event'] = function(e){

                            xhrConnect('delete', '/post/'+id, {
                                status200 : function(res){
                                    if(res){
                                        console.log(res);
                                        node.remove();
                                    }
                                }
                            });
                            menuPopDelete();
                        }
                    } else if (menu === 'MODIFY'){
                        setting['event'] = function(e){
                            
                            xhrConnect('get', '/post/json/'+id, {
                                header : {
                                    'Content-type' : 'application/json;charset=utf-8'
                                },
                                status200 : function(res){
                                    if(res){
                                        
                                        var data = JSON.parse(res);

                                        modifyAndWriteEvent(e, data);
                                    }
                                }
                            });
                            
                            menuPopDelete();
                        }
                    } else if (menu === 'FOLLOW'){
                        setting['event'] = function(e){
                            console.log('팔로잉');
                            menuPopDelete();
                        }
                    } else if (menu === 'FAVORITE'){
                        setting['event'] = function(e){
                            console.log('즐찾');
                            menuPopDelete();
                        }
                    }

                    postMenuCreate(setting);

                });
            }
        });
    });
    
}

function postLoad(queryString,loc, modify){

    var setting = {

        status200: function(res){
            
            var snsItemList = document.getElementById('snsItemList');
            
            var posts = document.getElementById('posts');
            
            var nodes = HTMLparse(res);

            if(!posts){
            
                posts = elementCreate('ul', { id : 'posts' });

                snsItemList.innerHTML = '';
                snsItemList.appendChild(posts);
            
            }

            if(!queryString && !loc){

                posts.innerHTML = '';

            }

            nodes.forEach(function(node){
                
                if(modify === false || !modify){

                    if(loc === true) posts.insertBefore(node, posts.childNodes[0]);
                    else posts.appendChild(node);

                } else {
                    for(var i = 0 ; i < posts.childNodes.length ; i ++){
                        if(posts.childNodes[i].dataset.id === node.dataset.id){
                            posts.insertBefore(node, posts.childNodes[i]);
                            posts.childNodes[i+1].remove();
                            break;
                        }
                    }
                }
                
                if(modify === true) console.log('엥',node);
                postMenuEvent(node);
                postImgsPreviewEvent(node);

            });

            document.querySelector('#sectionBody').addEventListener('scroll', scrollEvent);
        
        }
    }
    if(queryString){
        setting.requestObject = queryString
    }

    xhrConnect('get','/post/', setting);

}

    
function scrollEvent(e){

    var posts = document.getElementById('posts');        
    
    if(posts){

        var h = e.currentTarget.offsetHeight;
        var sL = e.currentTarget.scrollTop;
        var sH = e.currentTarget.scrollHeight;
        
        var num = (h + Math.floor(sL)) - sH;
        
        if(-10 <= num && num <= 10){
            
            var postItems = document.getElementsByClassName('postItem');
            
            document.querySelector('#sectionBody').removeEventListener('scroll', scrollEvent);
            
            postLoad({
                offset : postItems.length
            });
            
        }
    }

}
