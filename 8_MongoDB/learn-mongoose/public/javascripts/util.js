
function checkBoxOnlyOne(checkboxs, hidden){

    checkboxs.forEach(function(box){

        box.addEventListener('change', function(e){

            e.preventDefault();
            e.stopPropagation();

            var target = e.currentTarget;
            
            checkboxs.forEach(function(box){
                if(box !== target){
                    if(box.checked){
                        box.checked = false;
                        return;
                    }
                }
            });

            hidden.value = target.value;

        });
    });
}

function xhrConnect(method, url, setting){
    
    if(!method || !url){
        console.error('method:arguments[0] or url:arguments[1] missing');
        return;
    }

    var method = method.toLowerCase();

    var xhr = new XMLHttpRequest();
    
    var async = '';
    var header = '';
    var requestObject = '';
    var status200 = '';
    var status304 = '';
    var status400 = '';
    var status401 = '';
    var status403 = '';
    var status404 = '';

    if(setting){
        async = setting.async? setting.async : true;
        requestObject = setting.requestObject? setting.requestObject : '';  
        header = setting.header? setting.header : { 'Content-Type' : 'charset=utf-8' };
        status200 = setting.status200? setting.status200 : '';
        status304 = setting.status304? setting.status304 : '';
        status400 = setting.status400? setting.status400 : '';
        status401 = setting.status401? setting.status401 : '';
        status403 = setting.status403? setting.status403 : '';
        status404 = setting.status404? setting.status404 : '';
    }

    var queryString = '';

    if(method === 'get'){
        if(requestObject){
            queryString = '?';
            var keys = Object.keys(requestObject);
            keys.forEach(function(key){
                queryString += key + '=' + requestObject[key] + '&';
            });
        }
    }

    xhr.open(method, url + queryString, async);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                if(status200) status200(xhr.responseText);
            } else if (xhr.status === 304){
                if(status304) status304(xhr.responseText);
            } else if (xhr.status === 400){
                if(status400) status400(xhr.responseText);
            } else if (xhr.status === 401){
                if(status401) status401(xhr.responseText);
            } else if (xhr.status === 403){
                if(status403) status403(xhr.responseText);
            } else if (xhr.status === 404){
                if(status404) status404(xhr.responseText);
            }
        }
    }
    
    var headerKeys = Object.keys(header);

    headerKeys.forEach(function(key){
        xhr.setRequestHeader(key, header[key]);
    });
    if(method === 'post') {
        
        if(requestObject){
            console.log(requestObject);    
            xhr.send(JSON.stringify(requestObject));
        } 
        else xhr.send();
    } else xhr.send();
}



function elementCreate(tagName, setting){

    if(!tagName){
        console.error('생성할 Element의 명칭을 지정해주세요.')
        return;
    }

    var el = document.createElement(tagName);
    
    if(!setting){
        
        return el;

    } else {
        
        if(setting.classNames){

            var classNames = setting.classNames;
            
            if(classNames instanceof Array){
                classNames.forEach(function(className){
                    el.classList.add(className);
                });
            } else {
                el.classList.add(classNames);
            }
        }

        setting.id? el.id = setting.id : el.id = '';
    
        setting.addAttribute? setting.addAttribute(el) : ''; 

        if(setting.addObjects){
            
            var addObjects = setting.addObjects;
            
            if(addObjects instanceof Array){
                addObjects.forEach(function(obj){
                    el.appendChild(obj);
                });
            } else {
                el.appendChild(addObjects);
            }

        }
        
        return el;
    
    }

}

function alertBox(text){
    
    var body = document.getElementsByTagName('body')[0];

    var alertBox = document.getElementById('alertBox');
    alertBox? alertBox.remove() : '';


    var content = elementCreate('p', { id : 'alertContent' });
    content.innerHTML = text;
    

    var closeBtn = elementCreate('button', { id : 'alertCloseBtn' })

    closeBtn.innerHTML = '닫기';
    closeBtn.addEventListener('mousedown', function(e){
        var target = e.currentTarget.parentNode;
        target.remove();
    });

    alertBox = elementCreate('div', { id : 'alertBox', classNames : 'box', addObjects : [content, closeBtn] });

    body.appendChild(alertBox);


    return alertBox;

}