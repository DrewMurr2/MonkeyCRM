var un
var pw
// SHFT ALT F to format
function logInOrOut(usr, pwd) {
    un = usr
    pw = pwd
    call('http://clientconnectcrm.azurewebsites.net/login.php', undefined, function (response) {
        if (response == "Yes") {
            getLeads()
            $(".classified").css('display', 'block')
        } else {
            $(".classified").css('display', 'none')
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
            if (callback) callback(response)
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus, errorThrown);
        }
    });
}

function getLeads() {
    call('Leads.php', undefined, function (response) {
        var data = JSON.parse(response)
        var companies = data.data[0].company
        companies.forEach(function (company) {
            retrieveObject(function (object) {
                leads.push(new lead(company, object))

            })



        })



        companies.forEach(function (company) {
        })
    })
}

var leads = []

function lead(company, obj) {
    this.name = company.name
    this.id = company.id
    if (isString(company.background))
        this.background = company.background

    if (obj.Phases) this.Phases = obj.Phases
    else {

        this.Phases = {}
        this.Phases.list = []
        this.Phases.Cold = new phase({ name: "Cold", targetDuration: 60 })
        this.Phases.list.push(this.Phases.Cold)
        this.Phases.Interested = new phase({ name: "Interested", targetDuration: 14 })
        this.Phases.list.push(this.Phases.Interested)
        this.Phases.Demonstrations = new phase({ name: "Demonstrations", targetDuration: 8 })
        this.Phases.list.push(this.Phases.Demonstrations)
        this.Phases.TermsAndConditions = new phase({ name: "TermsAndConditions", targetDuration: 4 })
        this.Phases.list.push(this.Phases.TermsAndConditions)
        this.Phases.Install = new phase({ name: "Install", targetDuration: 18 })
        this.Phases.list.push(this.Phases.Install)
        this.Phases.Training = new phase({ name: "Training", targetDuration: 6 })
        this.Phases.list.push(this.Phases.Training)
        this.Phases.PaymentConfirmation = new phase({ name: "PaymentConfirmation", targetDuration: 2 })
        this.Phases.list.push(this.Phases.PaymentConfirmation)
    }

    if (obj.Install) this.Phases = obj.Phases
    else {
        this.Install = {}
        this.Install.Phases = {}
        this.Install.Phases.accessToServer = new phase({ name: "accessToServer", targetDuration: 2 })
        this.Install.Phases.installQuestionsAnswered = new phase({ name: "installQuestionsAnswered", targetDuration: 2 })
        this.Install.Phases.configuredFirmSettings = new phase({ name: "configuredFirmSettings", targetDuration: 2 })
        this.Install.Phases.syncNeedles = new phase({ name: "syncNeedles", targetDuration: 2 })
        this.Install.Phases.testProduction = new phase({ name: "testProduction", targetDuration: 2 })
        this.Install.Phases.scheduleTraining = new phase({ name: "scheduleTraining", targetDuration: 2 })
    }

    if(!obj)this.createObj()
    

    function phase(options) {
        this.name = options.name || null,
            this.start = options.start || null,
            this.end = options.end || null,
            this.targetDuration = options.targetDuration || null
    }

}


lead.prototype.createObj = function () {

}

function isString(myVar) {
    return (typeof myVar === 'string' || myVar instanceof String) || false
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
        ,
    }
    , Demos: []
    , Trainings: []
    , Calls: []
    , Emails: []
    ,
}
