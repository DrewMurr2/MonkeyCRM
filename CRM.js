var un
var pw

function logInOrOut(usr, pwd) {
    un = usr
    pw = pwd
    call('http://clientconnectcrm.azurewebsites.net/login.php', undefined,function(response){
        if(response=="Yes"){
            getLeads()
            $(".classified").css('display','block')
        }else{
            $(".classified").css('display','none')
        }
    })
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

function getLeads(){
call('Leads.php', undefined,function(){


})

}

// function getLeads() {
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var JSO = JSON.parse(this.responseText)
//             console.log(JSO)
//         }
//     };
//     xmlhttp.open("GET", "Leads.php");
//     xmlhttp.send();
// }
var highRiseClientConnectCaseObj = {
    caseID: 1215744
    , VisibleBackgroundInfo: undefined
    , Phases: {
        Cold: undefined
        , First_expressed_interest: undefined
        , First_demo: undefined
        , Signed_Terms_and_Conditions: undefined
        , Began_install: undefined
        , Received_access_to_server: undefined
        , Received_settings_selections_from_firm: undefined
        , Configured_firm_settings: undefined
        , Began_sync: undefined
        , Sync_complete: undefined
        , Test_texting_on_production: undefined
        , First_training: undefined
        , Received_payment_info: undefined
        , Received_first_payment: undefined
    , }
    , Demos: []
    , Trainings: []
    , Calls: []
    , Emails: []
, }
