function query(db) {
    var modal = $('#QueryModal')
    modal.attr('db', db)
    modal.modal('show')
}
var un
var pw
function logInOrOut(usr, pwd) {
    un = usr
    pw = pwd
    call('http://clientconnectcrm.azurewebsites.net/login.php', undefined,function(response){
        if(response=="Yes"){
            $(".classified").css('display','block')
            PopulateTables()
        }else{
            $(".classified").css('display','none')
        }
    })
}
 function PopulateTables(){
     
 }

function send(mod) {
    checkUNandPW(function () {
        var url
        var additionalData
        var modal = $(mod)
        var db = modal.attr('db')
        var query = modal.find('#query').val()
        if (db == "Drew") url = "http://clientconnectcrm.azurewebsites.net/queryMonkeyDB.php"
        else url = "queryLM.php"
        additionalData = {
            q: query
        }
        call(url, additionalData)
    })
}

function checkUNandPW(successCallback) {
    un = $(document.getElementById('usr'))[0].value
    pw = $(document.getElementById('pwd'))[0].value
    if (un && pw) successCallback()
    else alert('Username and Password Required')
}

function call(url, additional, callback) {
    var adparams = ""
    if (additional) {
        for (var prop in additional) {
            adparams += "&" + prop + "=" + additional[prop];
        }
    }
    $.ajax({
        url: url
        , type: "post"
        , data: "un=" + un + "&pw=" + pw + adparams
        , success: function (response) {
                if(callback)callback(response)
            console.log(response)
            var t = JSON.parse(response)
            console.log(t);
            // you will get response from your php page (what you echo or print)                 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus, errorThrown);
        }
    });
}
//$('#QueryModal').modal('show');
//$('#myModal').modal('hide');