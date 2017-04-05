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
            retrieveObject(company, function (objec) {
                obj = ParseJSON(objec)
                if (obj.data[0].obj) leads.push(new lead(company, obj.data[0].obj))
                else leads.push(new lead(company))
            })
        })
    })
}

var leads = []

function lead(company, obj) {
    this.name = company.name
    this.id = company.id
    if (isString(company.background))
        this.background = company.background

    if (obj && obj.Phases) this.Phases = obj.Phases
    else {


        this.Phases = []
        this.Phases.push(new phase({ name: "Cold", targetDuration: 60 }))
        this.Phases.push(new phase({ name: "Interested", targetDuration: 14 }))
        this.Phases.push(new phase({ name: "Demonstrations", targetDuration: 8 }))
        this.Phases.push(new phase({ name: "TermsAndConditions", targetDuration: 4 }))
        this.Phases.push(new phase({ name: "Install", targetDuration: 18 }))
        this.Phases.push(new phase({ name: "Training", targetDuration: 6 }))
        this.Phases.push(new phase({ name: "PaymentConfirmation", targetDuration: 2 }))
    }

    if (obj && obj.Install) this.Install = obj.Install
    else {
        this.Install = {}
        this.Install.Phases = []
        this.Install.Phases.push(new phase({ name: "accessToServer", targetDuration: 2 }))
        this.Install.Phases.push(new phase({ name: "installQuestionsAnswered", targetDuration: 2 }))
        this.Install.Phases.push(new phase({ name: "configuredFirmSettings", targetDuration: 2 }))
        this.Install.Phases.push(new phase({ name: "syncNeedles", targetDuration: 2 }))
        this.Install.Phases.push(new phase({ name: "testProduction", targetDuration: 2 }))
        this.Install.Phases.push(new phase({ name: "scheduleTraining", targetDuration: 2 }))
    }

    if (!obj) this.createObj()
    this.show()

    function phase(options) {
        this.name = options.name || null,
            this.start = options.start || null,
            this.end = options.end || null,
            this.targetDuration = options.targetDuration || null
    }

}


lead.prototype.createObj = function () {
    console.log(this.name + '     ', StringJSON(this))
    console.log()
    call('http://clientconnectcrm.azurewebsites.net/CreateLeadObj.php', { id: this.id, obj: StringJSON(this) }, function (obj) {
        console.log(ParseJSON(obj))
    })
}

var leadNum = 0

lead.prototype.show = function () {
    var parent = $(document.getElementById('accordion'))

    function createProgressBar(parent) {
        var progressBar = '<div class="progress">'
        var percent = (100-(0.2 * (parent.Phases.length + 1))) / parent.Phases.length
        parent.Phases.forEach(function (phase) {
            progressBar += '<div class="progress-bar progress-bar-warning" role="progressbar" style="width:0.2%"></div>'
            progressBar += '<div class="progress-bar progress-bar-success" role="progressbar" style="width:' + percent + '%">' + phase.name + '</div>'
        })
        progressBar += '<div class="progress-bar progress-bar-warning" role="progressbar" style="width:0.2%"></div>'
        progressBar += '</div>'
        return progressBar
    }
// //   <h4 class="panel-title">\</h4>\
    var newPanel = '<div class="panel panel-default">\
    <div class="panel-heading">\
       <div  style="width:10%;position:relative;overflow:hidden"><a data-toggle="collapse" data-parent="#accordion" href="#collapse' + ++leadNum + '">' + this.name + '</a></div><div  style="width:90%;position:relative;float:right"> \
      ' + createProgressBar(this) + '</div>\
    </div>\
    <div id="collapse' + leadNum + '" class="panel-collapse collapse">\
      <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,\
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\
      commodo consequat.</div>\
    </div>\
  </div>'
    parent.append(newPanel)
}

function retrieveObject(company, callback) {
    call('http://clientconnectcrm.azurewebsites.net/leadObj.php', { id: company.id }, function (obj) {
        callback(obj)
    })
}
function isString(myVar) {
    return (typeof myVar === 'string' || myVar instanceof String) || false
}

function ParseJSON(str) {
    var newStr = replaceAll(replaceAll(str, '"{', '{'), '}"', '}')
    return JSON.parse(newStr)
}

function StringJSON(obj) {
    var str = JSON.stringify(obj)
    return replaceAll(str, "&", "AND")
}
function replaceAll(str, find, replace) {
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


