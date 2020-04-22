function searchUser(keywordInput){


    if(keywordInput.value){
        var xhr = new XMLHttpRequest();

        xhr.open('get','/db/user/search/'+keywordInput.value);

        xhr.onreadystatechange = function(){
            
            var readyState = xhr.readyState;
            var status = xhr.status;
            var responseText = xhr.responseText;

            if(readyState === xhr.DONE){
                if(status === 200){
                    if(responseText){
                        createList(responseText);
                    }
                }
            }

        }

        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        xhr.send();
    } else {
        userListAll();
    }
}