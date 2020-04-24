var seachButton = document.getElementById('seachButton');
if(seachButton) seachButton.addEventListener('mousedown', function(e){
    
    var searchInput = document.getElementById('searchInput');
    var keyword = searchInput.value;
    
    if(!keyword){
        alertBox('검색 정보를 입력해주세요.')
    }

});