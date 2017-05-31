function importTable(table) {
    console.log(table);
    document.getElementById("test").innerHTML = table;
}

function lkogInOrOut(usr, pwd) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("tabs").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET", "tables.php?usr=" + usr + "&pwd=" + pwd, true);
    xmlhttp.send();
}
var token = '09b1d28b10c0c242bd3a898bd8da72a7'

function highrise() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var JSO = JSON.parse(this.responseText)
            console.log(JSO)
                //document.getElementById("high").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET", "openCases.php?token=" + token);
    xmlhttp.send();
}
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

function returnBackgroundInfoPHPencoded(highRiseClientO) {
    var phpIdEncodingTag = "id=" + highRiseClientO.caseID + "&"
    var phpBackgroundEncodingTag = "backgroundinfo='"
    var htmlStartTag = '<br><span style="font-weight:bold">Monkey Case Object</span><div id="monkeyCase" style="display:none">'
    var htmlEndTag = '</div caseClosed="true">'
    var phpEncodedEndTag = "'"
    var JSONstring = JSON.stringify(highRiseClientO)
    var backGroundInfo = ""
    if (highRiseClientO.VisibleBackgroundInfo) backGroundInfo += highRiseClientO.VisibleBackgroundInfo
    backGroundInfo = phpIdEncodingTag + phpBackgroundEncodingTag + htmlStartTag + JSONstring + htmlEndTag + phpEncodedEndTag
    return backGroundInfo
}

function setBackGroundInfo(highRiseObject) {
    highRiseObject = highRiseClientConnectCaseObj
    $.ajax({
        url: "updateCaseBackground.php?token=" + token
        , type: "post"
        , data: returnBackgroundInfoPHPencoded(highRiseObject)
        , success: function (response) {
            alert(response);
            // you will get response from your php page (what you echo or print)                 
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus, errorThrown);
        }
    });
}

function newCall(date, outcomeIndex, highRisePersonIndex, highRiseNoteIndex) {
    var outcomes = ['Received by desired POC', 'Left voicemail', 'Message with receptionist', 'Opted not to leave message', 'No message option']
    return {
        Call: {
            date: date
            , outcome: outcomeIndex
            , contacts: highRisePersonIndex
            , Note: highRiseNoteIndex
        }
    }
}

function newEmail(date, highRisePersonIndex, highRiseNoteIndex) {
    return {
        Email: {
            date: date
            , contacts: highRisePersonIndex
            , Note: highRiseNoteIndex
        }
    }
}