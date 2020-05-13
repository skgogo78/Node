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


authCheck();


var searchButton = document.getElementById('searchButton');
if(searchButton) searchButton.addEventListener('mousedown', function(e){
    
    var searchInput = document.getElementById('searchInput');
    var keyword = searchInput.value;
    
    if(!keyword){
        alertBox('검색 정보를 입력해주세요.')
    }

});

function modifyAndWriteEvent(e, modifyObject){

    var body = document.getElementsByTagName('body')[0];

    var writeBox = document.getElementById('writeBox');
    if(writeBox) writeBox.remove();


    // 
    // setting = [ [menuName, function, elementSetting], ... ]
    function menuListCreate(e, setting, listName){

        var fontList = document.getElementById(listName);
        if(!fontList) {
            var writeUtilBox = document.getElementById('writeUtilBox');
            if(writeUtilBox) writeUtilBox.remove();

            var array = [];

            setting.forEach(function(val){

                var menu = elementCreate('li', val[2]);
                menu.innerHTML = val[0];
                menu.addEventListener('mousedown', val[1]);

                array.push(menu);
            });

            var list = elementCreate('ul', { id : listName, addObjects : array });
            var writeUtilBox = elementCreate('div', { id : 'writeUtilBox', classNames : 'box', addObjects: [list]});
            
            var y = e.currentTarget.offsetHeight + e.currentTarget.offsetTop;
            var x = e.currentTarget.offsetLeft;

            writeUtilBox.style.top = y + 'px';
            writeUtilBox.style.left = x + 'px';

            e.currentTarget.parentNode.parentNode.appendChild(writeUtilBox);
        } else {

            fontList.parentNode.remove();
            
        }
    }

    var fontJustify = elementCreate('span', { id : 'fontJustify' });
    fontJustify.innerHTML = 'JUSTIFY';
    fontJustify.addEventListener('mousedown', function(e){

        e.preventDefault();
        e.stopPropagation();

        var setting = [
            ['왼쪽 정렬', function(e){
                document.execCommand('justifyLeft');
                e.currentTarget.parentNode.parentNode.remove();
            }],
            ['중앙 정렬', function(e){
                document.execCommand('justifyCenter');
                e.currentTarget.parentNode.parentNode.remove();
            }],
            ['오른쪽 정렬', function(e){
                document.execCommand('justifyRight');
                e.currentTarget.parentNode.parentNode.remove();
            }],
            ['양쪽 정렬', function(e){
                document.execCommand('justifyFull');
                e.currentTarget.parentNode.parentNode.remove();
            }]
        ]
        menuListCreate(e, setting, 'fontJustifyList');
    });

    var fontColor = elementCreate('span', { id : 'fontColor' });
    fontColor.innerHTML = 'COLOR';

    fontColor.addEventListener('mousedown', function(e){

        e.preventDefault();
        e.stopPropagation();

        var colorBox = document.getElementById('colorBox');
        if(colorBox) colorBox.remove();
        else {

            var writeUtilBox = document.getElementById('writeUtilBox');
            if(writeUtilBox) writeUtilBox.remove();

            var colorPreview = elementCreate('span', { id :'colorPreview' });

            function colorPick(){

                var colorHueRange = document.getElementById('colorHueRange');
                var colorPicker = document.getElementById('colorPicker');
                var colorArea = document.getElementById('colorArea');

                var hue = colorHueRange.value;
                var s = ((colorPicker.offsetLeft + 5)/colorArea.offsetWidth).toFixed(2)*100;
                var l = Number(50 - ((colorPicker.offsetTop + 5)/colorArea.offsetHeight).toFixed(2)*50);
                
                l = l + ( l - ( l * s / 100 ).toFixed(2));


                var colorPreview = document.getElementById('colorPreview');
                
                colorArea.style.backgroundColor = 'hsl(' + hue + ', 100%, 50%)';
                colorPreview.style.backgroundColor = 'hsl(' + hue + ', ' + s + '%, ' + l + '%)';
                
            }

            var colorHueRange = elementCreate('input', { id : 'colorHueRange' });
            colorHueRange.type = 'range';
            colorHueRange.min = 0;
            colorHueRange.max = 359;
            colorHueRange.value = 0;
            colorHueRange.addEventListener('input',function(e){
                colorPick();
            });

            var colorHeader = elementCreate('div', { id : 'colorHeader', addObjects : [colorPreview, colorHueRange] });
            
            var colorArea = elementCreate('div', { id : 'colorArea' });
            
            function mousemove(e){

                e.preventDefault();
                e.stopPropagation();

                var x = e.offsetX;
                var y = e.offsetY;

                var colorPicker = document.getElementById('colorPicker');

                colorPicker.style.top = y - 5 +'px';
                colorPicker.style.left = x - 5 + 'px';

                colorPick();
            }
            
            function mouseupandout(e){

                e.preventDefault();
                e.stopPropagation();

                var moveArea = e.currentTarget;

                moveArea.removeEventListener('mouseout', mouseupandout);
                moveArea.removeEventListener('mouseup', mouseupandout);
                moveArea.removeEventListener('mousemove', mousemove);
            }

            function mousedown(e){

                e.preventDefault();
                e.stopPropagation();

                var x = e.offsetX;
                var y = e.offsetY;

                var colorPicker = document.getElementById('colorPicker');

                colorPicker.style.top = y - 5 +'px';
                colorPicker.style.left = x - 5 + 'px';

                colorPick();

                var moveArea = e.currentTarget;

                moveArea.addEventListener('mouseup', mouseupandout);
                moveArea.addEventListener('mouseout', mouseupandout);
                moveArea.addEventListener('mousemove', mousemove);

            }

            var moveArea = colorArea.cloneNode();
            moveArea.id = 'colorAreaClone';
            
            moveArea.addEventListener('mousedown', mousedown);
            
            
            
            var colorPicker = elementCreate('span', { id : 'colorPicker' });
            
            var colorBody = elementCreate('div', { id : 'colorBody', addObjects : [colorArea, colorPicker, moveArea] });

            var submitBtn = elementCreate('button');
            submitBtn.innerHTML = '적용';
            submitBtn.addEventListener('mousedown', function(e){

                e.preventDefault();
                e.stopPropagation();

                var color = document.getElementById('colorPreview').style.backgroundColor;
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('foreColor', false, color);

                e.currentTarget.parentNode.parentNode.parentNode.remove();
            });

            var closeBtn = elementCreate('button');
            closeBtn.innerHTML = '닫기';
            closeBtn.addEventListener('mousedown', function(e){
                e.currentTarget.parentNode.parentNode.parentNode.remove();
            }) ;

            var colorFoot = elementCreate('div', { id : 'colorFoot', addObjects : [submitBtn, closeBtn]});

            var colorBox = elementCreate('div', { id : 'colorBox', addObjects : [colorHeader, colorBody, colorFoot] });

            var writeUtilBox = elementCreate('div', { id : 'writeUtilBox', classNames : 'box', addObjects: [colorBox]});

            var y = e.currentTarget.offsetHeight + e.currentTarget.offsetTop;
            var x = e.currentTarget.offsetLeft;

            writeUtilBox.style.top = y + 'px';
            writeUtilBox.style.left = x + 'px';

            e.currentTarget.parentNode.parentNode.appendChild(writeUtilBox);
        }
    });

    var fontMenu = elementCreate('span', { id : 'fontMenu' });
    fontMenu.innerHTML = 'FONT';
    
    fontMenu.addEventListener('mousedown', function(e){

        e.preventDefault();
        e.stopPropagation();

        var setting = [
            ['나토 산스 KR',
            function(e){
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontName', false, 'Noto Sans KR');
                e.currentTarget.parentNode.parentNode.remove();
                
            },
            { id : 'NotoSansKR' }],

            ['선플라워',
            function(e){
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontName', false, 'Sunflower');
                e.currentTarget.parentNode.parentNode.remove();
                
            },
            { id : 'Sunflower' }],

            ['도현',
            function(e){
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontName', false, 'Do Hyeon');
                e.currentTarget.parentNode.parentNode.remove();
                
            },
            { id : 'DoHyeon' }],

            ['나눔 펜 스크립트',
            function(e){
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontName', false, 'Nanum Pen Script');
                e.currentTarget.parentNode.parentNode.remove();
                
            },
            { id : 'NanumPenScript' }],
            
            ['나눔 명조',
            function(e){
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontName', false, 'Nanum Myeongjo');
                e.currentTarget.parentNode.parentNode.remove();
                
            },
            { id : 'NanumMyeongjo' }],

            ['나눔 고딕',
            function(e){
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontName', false, 'Nanum Gothic');
                e.currentTarget.parentNode.parentNode.remove();
                
            },
            { id : 'NanumGothic' }],
            
        ];

        menuListCreate(e, setting, 'fontList');

    });

    var fontStyleMenu = elementCreate('span', { id : 'fontStyleMenu' });
    fontStyleMenu.innerHTML = 'STYLE';

    fontStyleMenu.addEventListener('mousedown',function(e){

        e.preventDefault();
        e.stopPropagation();

        var setting = [
            ['기울기' , function(e){
                document.execCommand('italic');
                e.currentTarget.parentNode.parentNode.remove();
            }, { id : 'fontOblique' }],

            ['굵게' , function(e){
                document.execCommand('bold');
                e.currentTarget.parentNode.parentNode.remove();
            }, { id : 'fontOblique' }],
        ]

        menuListCreate(e, setting, 'fontStyleList');

    });

    var fontSizeMenu = elementCreate('span', { id : 'fontSizeMenu' });
    fontSizeMenu.innerHTML = 'SIZE';

    function fontTagChange(){
        var fonts = document.querySelectorAll('font');
        
        if(fonts.length > 0){
            var fontSizeMenu = document.getElementById('fontSizeMenu');
            var size = fontSizeMenu.dataset.tmpSize;

            fonts.forEach(function(font){
                var text = font.innerHTML;
                var span = document.createElement('span');

                span.style.fontSize = size  + 'pt';
                span.innerHTML = text;
    
                font.parentNode.insertBefore(span, font);
                font.remove();
            });

            delete fontSizeMenu.dataset.tmpSize;
        }
        
    }

    function sizeFun(size){
        
        var fontSizeMenu = document.getElementById('fontSizeMenu');
        fontSizeMenu.dataset.tmpSize = size;

        document.execCommand('styleWithCSS', false, false);
        document.execCommand('fontSize', false, 1);

    }

    fontSizeMenu.addEventListener('mousedown', function(e){
        e.preventDefault();
        e.stopPropagation();
        

        var setting = [
            ['가나다라마바', function(e){
                
                e.preventDefault();
                e.stopPropagation();
                
                sizeFun(8);
                e.currentTarget.parentNode.parentNode.remove();
            }, { addAttribute : function(el){
                el.style.fontSize = '8pt';
            }}],
            ['가나다라마바', function(e){

                e.preventDefault();
                e.stopPropagation();
                
                sizeFun(10);
                e.currentTarget.parentNode.parentNode.remove();
            }, { addAttribute : function(el){
                el.style.fontSize = '10pt';
            }}],
            ['가나다라마바', function(e){

                e.preventDefault();
                e.stopPropagation();
                
                sizeFun(14);
                e.currentTarget.parentNode.parentNode.remove();
            }, { addAttribute : function(el){
                el.style.fontSize = '14pt';
            }}],
            ['가나다라마바', function(e){

                e.preventDefault();
                e.stopPropagation();
                
                sizeFun(18);
                e.currentTarget.parentNode.parentNode.remove();
            }, { addAttribute : function(el){
                el.style.fontSize = '18pt';
            }}],
            ['가나다라마바', function(e){

                e.preventDefault();
                e.stopPropagation();

                sizeFun(24);
                e.currentTarget.parentNode.parentNode.remove();
            }, { addAttribute : function(el){
                el.style.fontSize = '24pt';
            }}]
        ]

        menuListCreate(e,setting,'fontSizeList');
    });

    function imgSrcAndEventFun(imgs, url, pText){
        if(url){
            for(var i = 0; i < imgs.length ; i++){
                if(!imgs[i].src){

                    imgs[i].src = url;
                    imgs[i].classList.add('imgHover');

                    var div = imgs[i].parentNode;
                    div.getElementsByTagName('p')[0].remove();

                    var imgDeleteBtn = elementCreate('span', { classNames : 'imgDeleteBtn' });
                    imgDeleteBtn.innerHTML = '삭제';

                    imgDeleteBtn.addEventListener('mousedown', function(e){
                        
                        var target = e.currentTarget.parentNode.getElementsByTagName('img')[0];
                        target.remove();

                        var p = elementCreate('p');
                        p.innerHTML = pText;
                        
                        e.currentTarget.parentNode.appendChild(elementCreate('img'));
                        e.currentTarget.parentNode.appendChild(p);
                        
                        var area = e.currentTarget.parentNode.parentNode;
                        if(area.urls){
                            for(var i = 0 ; i < area.urls.length ; i++){
                                if(area.urls[i] === url){
                                    area.urls[i] = '';
                                    return;
                                }
                            }
                        }

                        e.currentTarget.remove();

                    });

                    div.appendChild(imgDeleteBtn);

                    return;
                }
            }
        }
    }


    var imagesUpload = elementCreate('span', { id : 'imagesUpload' });
    imagesUpload.innerHTML = 'IMAGES';

    imagesUpload.addEventListener('mousedown', function(e){
        
        // e.currentTarget.style.pointerEvents = 'none';
        
        imagesBox = document.getElementById('imagesBox');

        if(imagesBox) imagesBox.remove();

        var body = document.querySelector('body');
        
        var imagePreviews = [];
        
        for(var i = 0 ; i < 100 ; i ++){

            var p  = elementCreate('p');
            p.innerHTML = '이미지를 드래그 해주세요.';

            var img = elementCreate('img');
            var imgDiv = elementCreate('div', { addObjects : [img, p] });

            imagePreviews.push(elementCreate('div', { classNames : 'imagePreview',
                addObjects : imgDiv
            }));
        
        }

        var imagesArea = elementCreate('div' ,{ id : 'imagesArea', addObjects : imagePreviews });
        
        imagesArea.addEventListener('dragover',function(e){
            
            e.preventDefault();
            e.stopPropagation();

            e.currentTarget.classList.add('areaSelect');

        });

       
        function fileUploadFun(files){

            var form = new FormData();
            var fileCount = files.length;

            if(fileCount > 100){
                alertBox('이미지는 100장 이상 업로드 불가능합니다.');
            }
            for(var i = 0 ; i < fileCount ; i ++){
                form.append('file', files[i]);
                if(!fileImageCheck(files[i])){

                    alertBox('이미지만 올릴 수 있습니다.');
                    return false;
        
                }
            }

            xhrConnect('post','/img/post', {
                requestObject : form,
                status200 : function(res){
                    var urls = JSON.parse(res).urls;
                    var imgs = document.querySelectorAll('.imagePreview > div > img');
                    var pText = document.querySelector('.imagePreview > div > p');

                    urls.forEach(function(url){
                        imgSrcAndEventFun(imgs, url, pText.innerHTML);
                    });

                },
                progressBoxCreate : true,
                progress : function(e){
                    
                    var _per = e.loaded / e.total * 100;
                    
                    var bar = document.getElementById('progressBar');
                    bar.value = Math.round(_per);

                    var per = document.getElementById('percent');
                    per.innerHTML = Math.round(_per) + '%';
                
                },
                load : function(e){
                    var progressBox = document.getElementById('progressBox');
                    progressBox.remove();
                }
            });

            return true;
        }

        imagesArea.addEventListener('drop', function(e){
            e.preventDefault();
            e.stopPropagation();

            
            var files = e.dataTransfer.files;
            
            fileUploadFun(files);

            e.currentTarget.classList.remove('areaSelect');

        });

        ['dragenter','dragleave'].forEach(function(event){
            imagesArea.addEventListener(event, function(e){
                e.preventDefault();
                e.stopPropagation();
                
                e.currentTarget.classList.remove('areaSelect');
            });
        });

        var localSpan = elementCreate('span');
        localSpan.innerHTML = '로컬에서 업로드';

        var fileInputSpan =  elementCreate('span', { classNames : 'fileInputSpan' });
        fileInputSpan.innerHTML = 'FILE UPLOAD';
        
        var fileInput = elementCreate('input', { classNames : 'fileInput' });
        fileInput.type = 'file';
        fileInput.multiple ='true';
        fileInput.addEventListener('change',function(e){
            
            var files = e.currentTarget.files;

            fileUploadFun(files);

        });

        var fileButton = elementCreate('div', { classNames : 'fileButton', addObjects : [fileInputSpan, fileInput]});
        var localUploadDiv = elementCreate('div', { id : 'localUploadDiv', addObjects : [localSpan, fileButton] });
        
        var urlSpan = elementCreate('span');
        urlSpan.innerHTML = '외부 경로에서 지정';
        
        var urlInput = elementCreate('input', { id : 'urlInput' });
        urlInput.type = 'text';
        urlInput.placeholder = ',으로 URL 구분';
        
        var urlSubmit = elementCreate('button');
        urlSubmit.innerHTML = '등록';
        urlSubmit.addEventListener('mousedown',function(e){
            
            var urlInput = e.currentTarget.parentNode.querySelector('#urlInput');
            var urls = urlInput.value.split(',');
            
            var imgs = document.querySelectorAll('.imagePreview > div > img');
            var pText = document.querySelector('.imagePreview > div > p');
            urls.forEach(function(url){
                imgSrcAndEventFun(imgs, url.trim(), pText.innerHTML) ;
            });

        });
        
        var urlForm = elementCreate('div', { id : 'urlForm', addObjects : [urlInput, urlSubmit]});

        var urlUploadDiv = elementCreate('div', { id : 'urlUploadDiv', addObjects : [urlSpan, urlForm] });


        var closeBtn = elementCreate('button');
        closeBtn.innerHTML = '닫기';
        closeBtn.addEventListener('mousedown',function(e){
            var imagesBox = document.getElementById('imagesBox');
            imagesBox.remove();
        });

        var submitBtn = elementCreate('button');
        submitBtn.innerHTML = '적용';
        submitBtn.addEventListener('mousedown', function(e){
            
            var imgs = document.querySelectorAll('#imagesBox .imgHover');
            
            var imgSelectPreview = document.getElementById('imgSelectPreview');
            imgSelectPreview.urls = [];
            
            imgs.forEach(function(img){
                imgSelectPreview.urls.push(img.src);
            });

            var cleanTargets = document.querySelectorAll('#imgSelectPreview .imgHover');
            if(cleanTargets){
                cleanTargets.forEach(function(img){
                    
                    var div = img.parentNode;

                    div.innerHTML = '';
                    div.appendChild(elementCreate('img'));
                    
                    var p = elementCreate('p');
                    
                    p.innerHTML = '이미지가 없습니다.';
                    
                    div.appendChild(p);
                });
            }

            var insertTargets = document.querySelectorAll('#imgSelectPreview > div > img');
            
            insertTargets.forEach(function(img, index){
                
                img.dataset.index = index;
                if(imgSelectPreview.urls[index]){
                    imgSrcAndEventFun(insertTargets, imgSelectPreview.urls[index], '이미지가 없습니다.');
                }

            });
            

            var imagesBox = document.getElementById('imagesBox');
            
            imagesBox.remove();

        });

        var etcDiv = elementCreate('div', { id : 'etcDiv', addObjects : [submitBtn, closeBtn] });

        var imagesMenu = elementCreate('div', { id : 'imagesMenu', addObjects : [ localUploadDiv, urlUploadDiv, etcDiv ] });
        
        imagesBox = elementCreate('div', { id : 'imagesBox' , classNames : 'box', addObjects : [imagesArea, imagesMenu] });

        body.appendChild(imagesBox);


        // 만약 이미 선택한 이미지가 있다면 아래 실행
        var imgSelectPreview = document.getElementById('imgSelectPreview');
        console.dir(imgSelectPreview);
        if(imgSelectPreview.urls){

            imgSelectPreview.urls.forEach(function(url){
                console.log(url);
                var imgs = document.querySelectorAll('.imagePreview > div > img');
                var pText = document.querySelector('.imagePreview > div > p');
                imgSrcAndEventFun(imgs, url, pText.innerHTML);
            });

        }

    });

    var writeMenu = elementCreate('div', { id : 'writeMenu', addObjects : [ fontMenu, fontSizeMenu, fontStyleMenu, fontColor, fontJustify, imagesUpload ] });


    var imgSelectPreview = elementCreate('div', { 
        id : 'imgSelectPreview',
        addObjects : (function(){

            function nextEvent(e){
                
                var imgSelectPreview = document.getElementById('imgSelectPreview');
                var imgs = imgSelectPreview.querySelectorAll('img');
                
                if(imgSelectPreview.urls){

                    var lastReadIndex = Number(imgs[imgs.length-1].dataset.index);

                    if(imgSelectPreview.urls[lastReadIndex+1]){
                        imgs.forEach(function(img){
                           
                            var nowIndex = Number(img.dataset.index);

                            img.src = imgSelectPreview.urls[ nowIndex+1];
                            img.dataset.index = nowIndex+1;
                       
                        });
                    } else {
                        alertBox('더 이상의 이미지가 없습니다.');
                    }
                } else {
                    alertBox('이미지가 없습니다.');
                }

            }

            function prevEvent(e){

                var imgSelectPreview = document.getElementById('imgSelectPreview');
                var imgs = imgSelectPreview.querySelectorAll('img');
                
                if(imgSelectPreview.urls){
                    
                    var firstReadIndex = Number(imgs[0].dataset.index);

                    if(imgSelectPreview.urls[firstReadIndex-1]){
                        imgs.forEach(function(img){
                            
                            var nowIndex = Number(img.dataset.index);

                            img.src = imgSelectPreview.urls[nowIndex-1];
                            img.dataset.index = nowIndex-1;
                        
                        });
                    } else {
                        alertBox('더 이상의 이미지가 없습니다.');
                    }
                } else {
                    alertBox('이미지가 없습니다.');
                }

            }

            var array = [];

            for(var i = 0; i < 7 ; i++){
                if(i === 0 || i === 6){
                    var imgNextPrevBtn = elementCreate('div', {id : 'imgNextPrevBtn', classNames : (i===0)?'prevBtn' : 'nextBtn'});
                    if(i === 0){
                        imgNextPrevBtn.addEventListener('mousedown',prevEvent);
                    } else {
                        imgNextPrevBtn.addEventListener('mousedown',nextEvent);
                    }
                    array.push(elementCreate('div', {
                        addObjects : imgNextPrevBtn
                    }));
                } else {
                    array.push(elementCreate('div', { 
                        addObjects : [ elementCreate('img', {
                        }), elementCreate('p', { addAttribute : function(el){
                            el.innerHTML = '이미지가 없습니다.';
                        }})]
                    }));
                }
            }
            return array;
        })(),
    });

    // 수정일 경우 이미지 불러오기 
    if(modifyObject) {
                
        imgSelectPreview.urls = modifyObject.postImgs? (function(){ 
            
            var array = []; 

            modifyObject.postImgs.forEach(function(o){ 
                array.push(o.path); 
            });

            var insertTargets = imgSelectPreview.querySelectorAll('div > img');
            
            insertTargets.forEach(function(img, index){
                img.dataset.index = index;
                if(array[index]){
                    imgSrcAndEventFun(insertTargets, array[index], '이미지가 없습니다.');
                }

            });
            
            return array;
        })() : [];

    }



    var submitBtn = elementCreate('button');

    submitBtn.innerHTML = modifyObject? '수정' : '작성';
    submitBtn.addEventListener('mousedown', function(e){
        
        var writeDiv = document.getElementById('writeDiv');
        var imgSelectPreview = document.getElementById('imgSelectPreview');
        
        if(writeDiv && writeDiv.innerHTML){
            xhrConnect((modifyObject? 'put' : 'post'),'/post' + (modifyObject? '/' + modifyObject.id : ''),{
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                requestObject : {
                    content : writeDiv.innerHTML,
                    postImg : imgSelectPreview.urls
                },
                status200 : function(res){

                    var data = JSON.parse(res);
                    
                    document.getElementById('writeBox').remove();
                    
                    postLoad({ where_0 :  data.id + '_id' }, true, (modifyObject? true : false));            
                
                },
                status403 : function(res){
                    if(res){
                        alertBox('로그인 후 시도하세요.');
                    }
                }
            });
        } else {
            alertBox('내용을 입력해주세요.');
        }

    });

    var closeBtn = elementCreate('button');

    closeBtn.innerHTML = '닫기';
    closeBtn.addEventListener('mousedown', function(e){
        var target = document.getElementById('writeBox');
        target.remove();
    });

    var buttonDiv = elementCreate('div', { id : 'buttonDiv', addObjects : [ submitBtn, closeBtn ]});

    var writeFoot = elementCreate('div', { id : 'writeFoot', addObjects : [imgSelectPreview, buttonDiv]});

    var writeDiv = elementCreate('div', { id : 'writeDiv' });
    writeDiv.contentEditable = true;
    

    // 수정일 경우 글 내용 삽입
    if(modifyObject) writeDiv.innerHTML = modifyObject.content;

    writeDiv.addEventListener('keypress', function(e){
        
        if(e.keyCode === 13){
            document.execCommand('formatBlock', false, 'p');
        }

    });

    // 글 작성 박스 input 이벤트
    writeDiv.addEventListener('input', function(e){

        e.currentTarget.normalize();

        // font tag => span으로 변경
        fontTagChange();
        
        // 해쉬 태그 작성 감지
        hashtagCreate(e);

        hashtagCheck(e);

    });


    // 해쉬 태그 감지 수정 함수
    function hashtagCheck(e){
        var hashtags = e.currentTarget.querySelectorAll('.hashtag');
            
        if(hashtags){

            hashtags.forEach(function(tag){

                var data = tag.textContent;
                
                var tmp;

                // if(data.indexOf('#') !== 0){

                //     tmp = document.createTextNode(data.substring(0, data.length));

                //     tag.parentNode.insertBefore(tmp, tag);

                //     tag.remove();

                //     return;

                // }


                if(tag.previousSibling){

                    var prevString = tag.previousSibling.textContent.substring(tag.previousSibling.textContent.length-1);
                    
                    if(prevString !== ' ' && prevString !== '\u00a0' && prevString){

                        console.log('해시태그 해제')

                        tmp = document.createTextNode(data.substring(0, data.length));

                        tag.parentNode.insertBefore(tmp, tag);

                        tag.remove();

                        return;

                    }

                }

                if(tag.nextSibling){

                    var nextString = tag.nextSibling.textContent.substring(0,1);

                    if(nextString !== ' ' && nextString !== '\u00a0' && nextString){

                        console.log('해시태그 결합');

                        var n0 = tag.nextSibling.textContent.indexOf(' ') > -1 ? tag.nextSibling.textContent.indexOf(' ') : '';
                        var n1 = tag.nextSibling.textContent.indexOf('\u00a0') > -1 ? tag.nextSibling.textContent.indexOf('\u00a0') : '';
                        var n2 = tag.nextSibling.textContent.length;
                        
                        var num = (n0? (n1? (n0 < n1? n0 : n1) : n0) : (n1? n1 : n2));

                        tmp = document.createTextNode(tag.nextSibling.textContent.substring(0, num));

                        tag.nextSibling.textContent = tag.nextSibling.textContent.substring(num);


                        tag.appendChild(tmp);

                        tag.normalize();

                    }

                }


                var arrTmp;


                function splitCheck(arr, tag){

                    var selection = document.getSelection();

                    arr.forEach(function(text){

                        if(text.indexOf('#') === -1){

                            console.log('해시태그 해제');

                            var nodeText = document.createTextNode('\u00a0' + text);
                            tag.parentNode.insertBefore(nodeText, tag.nextSibling);

                        } else {

                            tag.textContent = text;

                        }

                    });

                    var range = new Range();

                    range.setStart(tag.nextSibling, 1);
                    range.setEnd(tag.nextSibling, 1);
                    
                    selection.removeAllRanges();
                    selection.addRange(range);

                }

                if(data.indexOf('\u00a0') > -1){

                    console.log('해시태그 공란 체크');
                    arrTmp = data.split('\u00a0');
                    splitCheck(arrTmp, tag);

                } else if (data.indexOf(' ') > -1){

                    console.log('해시태그 공란 체크');
                    arrTmp = data.split(' ');
                    splitCheck(arrTmp, tag);

                }

                

            });

        }
    }

    // 해쉬 태그 생성 함수
    function hashtagCreate(e){

        var sel = document.getSelection();

        var baseNode = sel.baseNode;

        var oldRange = sel.getRangeAt(0);

        if(e.inputType === 'insertParagraph'){
            
            var hashtag;
            
            if(baseNode instanceof Text){

                hashtag = baseNode.parentNode;

            } else {

                hashtag = baseNode;

            }

            if(hashtag.classList.contains('hashtag')){

                if(!hashtag.textContent){
                    
                    var range = new Range();
                    
                    var p = hashtag.parentNode;
                    
                    range.selectNode(p);
                    
                    range.setStart(p, 0);
                    range.setEnd(p, 0);

                    p.innerHTML = '<br/>';

                    sel.removeAllRanges();
                    sel.addRange(range);

                } 

            }

        }

        if(e.inputType === 'insertText' || e.inputType === 'insertCompositionText' || e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {

            if(e.data === ' ' || !e.data || e.data === '#'){

                var node = baseNode;
    
                if(!node.parentNode.classList.contains('hashtag')){
                    

                    var val;

                    if(node instanceof Text){
                        val = node.data;
                    } else {
                        val = node.textContent;
                    }

                    if(val) searchString(val, '#', function(sharps){
                     
                        var cursor = elementCreate('span', { id : 'cursor' } );
                        oldRange.insertNode(cursor);


                        if(sharps.length > 0){
    
                            sharps.forEach(function(pos){
                                
                                var data = val;
                                var prevText = data.substring(pos - 1, pos);
                                var nextText = data.substring(pos + 1, pos+2);
                                
                                var nextPosStart = pos + 1;
                                var nextPosEnd = pos + 2;
                                
                                while(true){
                                    
                                    if(!nextText.trim()){
                                        break;
                                    }
    
                                    nextPosStart++;
                                    nextPosEnd++;
                                    nextText = data.substring(nextPosStart, nextPosEnd);
                                    
                                };
    
                                
                                if((!prevText.trim()) && (!nextText.trim())){

                                    var text = data.substring(pos, nextPosStart);

                                    console.log('[text] :', text);

                                    if(text.length > 1){

                                        var range = new Range();

                                        console.log('[target] :', node.textContent);

                                        if(node.textContent !== text){

                                            // start

                                            nodeSearch(node, function(node){
                                                
                                                console.log('[startCon] :', node);

                                                if(node.textContent.indexOf('#') > -1){

                                                    return true;

                                                } else {

                                                    return false;

                                                }

                                            }, function(node){

                                                var startNum = node.textContent.indexOf('#');
                                                var startNode = node;

                                                console.log('[startNum] :', startNum);
                                                console.log(startNode.textContent.substring(startNum));
                                                
                                                // end

                                                nodeSearch(startNode, function(node){

                                                    console.log('[endCon] :', node);

                                                    var textContent; 

                                                    if(node.textContent.indexOf('#') > -1){

                                                        textContent = node.textContent.substring(node.textContent.indexOf('#'));

                                                    } else {
                                                        
                                                        textContent = node.textContent;

                                                    }

                                                    console.log('[data] :', textContent);

                                                    if(textContent.indexOf('\u00a0') > -1){

                                                        return true;

                                                    } else if(!node.nextSibling || !node.previousSibling){
                                                        
                                                        return true;
                                                        
                                                    } else {

                                                        return false;

                                                    }

                                                }, function(node){
                                                    
                                                    var endNum;
                                                    var endNode = node;

                                                    if(endNode.textContent.indexOf('\u00a0') > -1){
                                                        
                                                        endNum = endNode.textContent.indexOf('\u00a0');
                                                        console.log(endNum);
                                                        if(endNode === startNode){
                                                            if(endNum < startNum){
                                                                var tmpNum = endNode.textContent.substring(startNum).indexOf('\u00a0');
                                                                endNum += tmpNum + 1;
                                                            }
                                                        }
                                                        
                                                    } else {

                                                        endNum = endNode.length;

                                                    }

                                                    console.log('[endNum] :', endNum);

                                                    range.setStart(startNode, startNum);
                                                    range.setEnd(endNode, endNum);

                                                    sel.removeAllRanges();
                                                    sel.addRange(range);

                                                    var hashtag = elementCreate('span', { classNames : 'hashtag' });
                
                                                    range.surroundContents(hashtag);

                                                    
                                                });

                                            });
                                            
                                        } else {

                                            range.setStart(node, node.data.indexOf('#'));
                                            range.setEnd(node, node.data.length);


                                            sel.removeAllRanges();
                                            sel.addRange(range);

                                            var hashtag = elementCreate('span', { classNames : 'hashtag' });
        
                                            range.surroundContents(hashtag);
                                            
                                        }

                                    }

                                }
    
                            });

                        }

                        var ran = new Range();
                        ran.selectNode(cursor);
    
                        sel.removeAllRanges();
                        sel.addRange(ran);
    
                        cursor.remove();


                    });

                    
                } else {
                    
                }

            }

        }

    }

    var writeBody = elementCreate('div', { id : 'writeBody', addObjects : [writeMenu, writeDiv]});

    var writeHead = elementCreate('div', { id : 'writeHead'});
    writeHead.innerHTML = '<p>TWEET</p>';

    writeBox = elementCreate('div', { id : 'writeBox', classNames : ['box', 'bgBox'], addObjects : [writeHead, writeBody, writeFoot] });
    
    body.appendChild(writeBox);

}

var writeButton = document.getElementById('writeButton');
if (writeButton){ 
    
    writeButton.addEventListener('mousedown', function(e){
        
        xhrConnect('get','/auth/check',{
            status200 : function(){

                modifyAndWriteEvent(e);
            
            },
            status403 : function(res){
                alertBox('로그인이 필요합니다.');
            }
        })
    
    });
}
