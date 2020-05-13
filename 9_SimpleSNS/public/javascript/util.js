
// nodeSearch


function nodeSearch(node, condition, callback){
                                                
    var searchCheck = condition(node);

    if(searchCheck === true){
        
        callback(node);
    
    } else {

        if(!arguments[3]){
        
            if(!node.nextSibling){

                // console.log('[firstCheckNode]:', Function.prototype.firstCheckNode.data);
                nodeSearch(node.previousSibling, condition, callback, true)
            
            } else {

                nodeSearch(node.nextSibling, condition, callback);

            }

        } else {

            if(node.previousSibling){

                nodeSearch(node.previousSibling, condition, callback, true);
            
            }

        }

    }
     
}


function textNodeChange(node){

    if(node instanceof Text){
        return node;
    } else {
        var data = document.createTextNode(node.textContent);
        node.textContent = '';
        node.appendChild(data);
        return data;
    }

}

function searchString(data, string, callback){

    var array = arguments[3]? arguments[3] : [];
    var index = data.indexOf(string);

    if(index > -1){

        var tmp = data.substring(index+1, data.length+1);
        
        index = index + (arguments[3]? array[array.length-1] + 1 : 0);

        array.push(index);

        searchString(tmp, string, callback, array);
    
    } else {

        callback(array);
    
    }

}


function fileImageCheck(file){

    var types = file.type.split('/');

    if((types[1]==='png' || types[1] ==='jpg'
    || types[1] ==='jpeg' || types[1] ==='gif')
    || types[1] ==='svg' || types[1] ==='bmp'){
        return true;
    } else return false;

}
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
    var progress = '';
    var load = '';

    if(setting){
        async = setting.async? setting.async : true;
        requestObject = setting.requestObject? setting.requestObject : '';  
        header = setting.header? setting.header : '';
        status200 = setting.status200? setting.status200 : '';
        status304 = setting.status304? setting.status304 : '';
        status400 = setting.status400? setting.status400 : '';
        status401 = setting.status401? setting.status401 : '';
        status403 = setting.status403? setting.status403 : '';
        status404 = setting.status404? setting.status404 : '';
        progress = setting.progress? setting.progress : '';
        load = setting.load? setting.load : '';
        
        if(setting.progressBoxCreate === true){

            var body = document.querySelector('body');

            var p = elementCreate('p');
            p.innerHTML = '업로드 중...';
            
            var percent = elementCreate('span', { id : 'percent' });
            var progressBar = elementCreate('progress', { id : 'progressBar' });

            var barDiv = elementCreate('div', { id : 'barDiv', addObjects : [ progressBar, percent ]});
            var progressBox = elementCreate('div', { id : 'progressBox', classNames : 'box', addObjects : [p, barDiv]});
            
            body.appendChild(progressBox);

        }
    }

    var queryString = '?';

    if(method === 'get'){

        if(requestObject){
            
            var keys = Object.keys(requestObject);
            keys.forEach(function(key){
                queryString += key + '=' + requestObject[key] + '&';
            });
        }
    }

    queryString += 'p=' + window.location.href;

    xhr.open(method, url + queryString, async);
    
    if(load) xhr.addEventListener('load',load,false);
    if(progress) xhr.upload.addEventListener('progress', progress,false);

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
    
    if(header){
        var headerKeys = Object.keys(header);

        headerKeys.forEach(function(key){
            if(key.toLocaleLowerCase() === 'content-type'){
                header[key].replace(/\s/gi, "");
            }
            xhr.setRequestHeader(key, header[key]);
        });
    }

    if(method === 'post' || method === 'put' || method === 'patch') {
        
        if(requestObject){
            if(requestObject instanceof FormData){
                xhr.send(requestObject);
            } else {
                xhr.send(JSON.stringify(requestObject));
            }
        } 
        else xhr.send();
    } else xhr.send();

    return xhr;
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

function HTMLparse(string){
    
    var tmpDiv = document.createElement('div');
    
    tmpDiv.id = (function(id){
        var chk = document.getElementById(id);
        if(chk){
            return arguments.callee('_'+id);    
        } else {
            return id
        }
    })('HTMLparse');

    tmpDiv.innerHTML = string;

    return tmpDiv.childNodes;
    
}