var searchButton = document.getElementById('searchButton');
if(searchButton) searchButton.addEventListener('mousedown', function(e){
    
    var searchInput = document.getElementById('searchInput');
    var keyword = searchInput.value;
    
    if(!keyword){
        alertBox('검색 정보를 입력해주세요.')
    }

});

var writeButton = document.getElementById('writeButton');
if (writeButton) writeButton.addEventListener('mousedown', function(e){

    var body = document.getElementsByTagName('body')[0];

    var writeBox = document.getElementById('writeBox');
    if(writeBox) writeBox.remove();


    // setting = [ [menuName, function, elementSetting], ... ]
    function listCreate(e, setting, listName){

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
        listCreate(e, setting, 'fontJustifyList');
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
                
                l = l+(l-(l*s/100).toFixed(2));


                var colorPreview = document.getElementById('colorPreview');
                
                colorArea.style.backgroundColor = 'hsl('+hue+', 100%, 50%)';
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

        listCreate(e, setting, 'fontList');

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

        listCreate(e, setting, 'fontStyleList');

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

        listCreate(e,setting,'fontSizeList');
    });

    var writeMenu = elementCreate('div', { id : 'writeMenu', addObjects : [ fontMenu, fontSizeMenu, fontStyleMenu, fontColor, fontJustify ] });

    var submitBtn = elementCreate('button');
    submitBtn.innerHTML = '작성';
    submitBtn.addEventListener('mousedown', function(e){
        
        var writeDiv = document.getElementById('writeDiv');

        if(writeDiv && writeDiv.innerHTML){
            xhrConnect('post','/post',{
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                requestObject : {
                    content : writeDiv.innerHTML
                },
                status200 : function(res){

                    console.log(JSON.parse(res));

                    document.getElementById('writeBox').remove();
                    postLoad();            
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
        var target = e.currentTarget.parentNode.parentNode;
        target.remove();
    });

    var writeFoot = elementCreate('div', { id : 'writeFoot', addObjects : [submitBtn, closeBtn]});

    var writeDiv = elementCreate('div', { id : 'writeDiv' });
    writeDiv.contentEditable = true;

    writeDiv.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
            document.execCommand('formatBlock', false, 'p');
        }
    });

    writeDiv.addEventListener('input', function(e){
        fontTagChange();
    });

    var writeBody = elementCreate('div', { id : 'writeBody', addObjects : [writeMenu, writeDiv]});

    var writeHead = elementCreate('div', { id : 'writeHead'});
    writeHead.innerHTML = '<p>글작성</p>';

    writeBox = elementCreate('div', { id : 'writeBox', classNames : 'box', addObjects : [writeHead, writeBody, writeFoot] });

    body.appendChild(writeBox);

});