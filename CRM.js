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
    if (obj && obj.updatedDate) this.updatedDate = obj.updatedDate
    else this.updatedDate = (new Date()).getDate()

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

lead.prototype.save = function(){
    if(this.updatedDate == (new Date()).getDate()) this.updateObj()
    else this.createObj()
}

lead.prototype.refreshPhaseBar = function () {
    for (i = 1; i < this.Phases.length; i++) {
        if (this.Phases[i].start) this.Phases[i - 1].end = this.Phases[i].start
    }
    for (i = 0; i < this.Phases.length; i++) {
        if (!this.Phases[i].start) document.getElementById('progressBar' + this.id + this.Phases[i].name).className = "progress-bar greyback"
        if (this.Phases[i].start && !this.Phases[i].end) document.getElementById('progressBar' + this.id + this.Phases[i].name).className = "progress-bar progress-bar-warning progress-bar-striped active"
        if (this.Phases[i].start && this.Phases[i].end) document.getElementById('progressBar' + this.id + this.Phases[i].name).className = "progress-bar progress-bar-success"
    }
}

function saveALL(){
    leads.forEach(function(lead){
        lead.save()
    })
}

function setPhaseStartDate(id, phase) {
    var dateWrapper
    if (phase) dateWrapper = $(document.getElementById('dateWrapper' + id + phase))
    else dateWrapper = $(document.getElementById('dateWrapper' + id))
    if (dateWrapper.css('display') == 'none') dateWrapper.css('display', 'block')
}

function hideCal(id, phase) {
    var dWrap
    if (phase) dWrap = $(document.getElementById('dateWrapper' + id + phase))
    else dWrap = $(document.getElementById('dateWrapper' + id))
    var t = setTimeout(function () {
        dWrap.css('display', 'none')
    }, 100)
}

function saveDate(id, phase) {
    var thisLead = fromNumber(id)
    if (phase) {
        pickedDate = document.getElementById('datePicker' + id + phase).value
        thisLead.phaseFromName(phase).start = pickedDate
    } else {
        pickedDate = document.getElementById('datePicker' + id).value
        var phazez = thisLead.Phases
        phazez[phazez.length - 1].end = pickedDate
    }
    hideCal(id, phase)
    thisLead.save()
    thisLead.refreshPhaseBar()
}

lead.prototype.updateObj = function () {
    call('http://clientconnectcrm.azurewebsites.net/UpdateObj.php', { id: this.id, obj: StringJSON(this) }, function (obj) {
        console.log(ParseJSON(obj))
    })
}

lead.prototype.createObj = function () {
    call('http://clientconnectcrm.azurewebsites.net/CreateLeadObj.php', { id: this.id, obj: StringJSON(this) }, function (obj) {
        console.log(ParseJSON(obj))
    })
}

lead.prototype.phaseFromName = function (name) {
    for (i = 0; i < this.Phases.length; i++) {
        if (this.Phases[i].name == name) return this.Phases[i]
    }
}

var leadNum = 0

lead.prototype.show = function () {
    var parent = $(document.getElementById('accordion'))

    function createProgressBar(parent) {
        var dividerWidth = 0.3
        var progressBar = '<div class="progress">'
        var percent = (100 - (dividerWidth * (parent.Phases.length + 1))) / parent.Phases.length
        parent.Phases.forEach(function (phase) {
            //Below is the date picker appended to the beginning of each phase
            progressBar +=
                '<div class="progress-bar" role="progressbar" style="width:' + dividerWidth + '%" onClick="setPhaseStartDate(' + parent.id + ",'" + phase.name + "'" + ')">\
                    <div id="dateWrapper' + parent.id + phase.name + '" style="display:none;float:left;position:absolute"><input type="date" style="color:black" id="datePicker' + parent.id + phase.name + '" >\
                         <div style="background-color:grey" onClick="hideCal('+ parent.id + ",'" + phase.name + '\')">cancel</div>\
                         <div style="background-color:grey" onClick="saveDate('+ parent.id + ",'" + phase.name + '\')">save</div>\
                     </div>\
                </div>'
            //Below is the actual portion of the progress bar
            progressBar += '<div class="progress-bar greyback" id="progressBar' + parent.id + phase.name + '"  role="progressbar" style="width:' + percent + '%">' + phase.name + '</div>'
        })
        //Below is the last date picker
        progressBar +=
            '<div class="progress-bar" role="progressbar" style="width:' + dividerWidth + '%" onClick="setPhaseStartDate(' + parent.id + ')">\
                <div id="dateWrapper' + parent.id + '" style="display:none;float:left;position:absolute;right:10px"><input type="date" style="color:black" id="datePicker' + parent.id + '" >\
                    <div style="background-color:grey" onClick="hideCal('+ parent.id + ')">cancel</div>\
                    <div style="background-color:grey" onClick="saveDate('+ parent.id + ')">save</div>\
                </div>\
            </div>'
        //The last div ends the progress bar
        progressBar += '</div>'
        return progressBar
    }



    // //   <h4 class="panel-title">\</h4>\
    var newPanel = '<div class="panel panel-default">\
    <div class="panel-heading">\
       <div class="row">\
            <div class="col-sm-2">\
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse' + ++leadNum + '">' + this.name + '</a>\
            </div>\
            <div class="col-sm-10">\
                    ' + createProgressBar(this) + '\
            </div>\
        </div>\
    </div>\
    <div id="collapse' + leadNum + '" class="panel-collapse collapse">\
      <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,\
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\
      commodo consequat.</div>\;
    </div>\
  </div>'
    parent.append(newPanel)
    this.refreshPhaseBar()
}

function fromNumber(num) {
    for (i = 0; i < leads.length; i++) {
        if (leads[i].id * 1 == num)
            return leads[i]
    }
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
    return JSON.parse(newStr),
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


