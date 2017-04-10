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


    if (obj && obj.extraProperties) this.extraProperties = obj.extraProperties
    else this.extraProperties = {
        source: "",
    }

    this.hiddenProperties = []

    if (!obj) this.createObj()
    this.show()

    function phase(options) {
        this.name = options.name || null,
            this.start = options.start || null,
            this.end = options.end || null,
            this.targetDuration = options.targetDuration || null
    }
    this.retrieveNotes(this.orderNotes)
    this.retrieveTasks(this.orderTasks)
}

lead.prototype.orderNotes = function () {
        var parent = this
        console.log(parent)
    for (i = 1; i < parent.hiddenProperties.notes.length; i++) {
        for (j = i; j > 0 && parent.hiddenProperties.notes[j].date > parent.hiddenProperties.notes[j - 1].date; j--) {
            parent.hiddenProperties.notes.splice(j - 1, 2, parent.hiddenProperties.notes[j], parent.hiddenProperties.notes[j - 1]);
        }
    }
    $(document.getElementById('notedate')).html(new Date(parent.hiddenProperties.notes[0].date))
    $(document.getElementById('notebody')).html(new Date(parent.hiddenProperties.notes[0].body))

}

lead.prototype.orderTasks = function () {
    var parent = this
    for (i = 1; i < parent.hiddenProperties.tasks.length; i++) {
        for (j = i; j > 0 && parent.hiddenProperties.tasks[j].date > parent.hiddenProperties.tasks[j - 1].date; j--) {
            parent.hiddenProperties.tasks.splice(j - 1, 2, parent.hiddenProperties.tasks[j], parent.hiddenProperties.tasks[j - 1]);
        }
    }
    $(document.getElementById('taskdate')).html(new Date(parent.hiddenProperties.tasks[0].date))
    $(document.getElementById('taskbody')).html(new Date(parent.hiddenProperties.tasks[0].body))

}


function note(raw) {
    if (raw.body) this.body = raw.body
    if (raw['created-at']) this.date = new Date(raw['created-at'])
}

function task(raw) {
    if (raw.body) this.body = raw.body
    if (raw['created-at']) this.date = new Date(raw['created-at'])
}

lead.prototype.retrieveNotes = function (callback) {
    var lead = this
    call('notes.php', { id: this.id, obj: StringJSON(this) }, function (obj) {
        var rawNotes = ParseJSON(obj).data[0].note
        lead.hiddenProperties.notes = []
        rawNotes.forEach(function (raw) {
            lead.hiddenProperties.notes.push(new note(raw))
        })
        callback()
    })
}


lead.prototype.retrieveTasks = function (callback) {
    var lead = this
    call('tasks.php', { id: this.id }, function (obj) {
        var taskSets = ParseJSON(obj).data
        lead.hiddenProperties.tasks = []
        taskSets.forEach(function (taskSet) {
            if (taskSet.task['created-at']) lead.hiddenProperties.tasks.push(new task(taskSet))
            else taskSet.task.forEach(function (tasker) {
                lead.hiddenProperties.tasks.push(new task(tasker))
            })
        })
        callback()
    })
}

lead.prototype.save = function () {
    if (this.updatedDate == (new Date()).getDate()) this.updateObj()
    else this.createObj()
}

lead.prototype.refreshPhaseBar = function () {
    for (i = 1; i < this.Phases.length; i++) {
        if (this.Phases[i].start) this.Phases[i - 1].end = this.Phases[i].start
    }
    for (i = 0; i < this.Phases.length; i++) {
        var days = ""
        var bar = document.getElementById('progressBar' + this.id + this.Phases[i].name)
        var par = $(document.getElementById('par' + this.id + this.Phases[i].name))

        if (!this.Phases[i].start) bar.className = "progress-bar greyback"
        if (this.Phases[i].start && !this.Phases[i].end) {
            days = this.Phases[i].targetDuration - daysBetween(new Date(), new Date(this.Phases[i].start))
            if (days < 0) bar.className = "progress-bar progress-bar-danger progress-bar-striped active"
            else bar.className = "progress-bar progress-bar-warning progress-bar-striped active"
        }
        if (this.Phases[i].start && this.Phases[i].end) {
            days = this.Phases[i].targetDuration - daysBetween(new Date(this.Phases[i].end), new Date(this.Phases[i].start))
            bar.className = "progress-bar progress-bar-success"
        }
        if (days) par.html('&#160&#160 ' + days)
        else par.html('')
        if (days < 0) par.css('color', 'red')
        else par.css('color', 'black')
    }
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

lead.prototype.indexOfPhase = function (name) {
    for (i = 0; i < this.Phases.length; i++) {
        if (this.Phases[i].name == name) return i
    }
}


lead.prototype.show = function () {
    var parent = $(document.getElementById('accordion'))

    function createProgressBar(parent) {
        var dividerWidth = 0.3
        var progressBar = '<div class="progress">'
        var percent = (100 - (dividerWidth * (parent.Phases.length + 1))) / parent.Phases.length

        function returnPortion(inside1, inside2, otherProperty) {
            return '<div class="progress-bar" role="progressbar" style="width:' + dividerWidth + '%" onClick="setPhaseStartDate(' + inside1 + ')">\
                    <div id="dateWrapper' + inside2 + '" style="display:none;float:left;position:absolute' + otherProperty + '"><input type="date" style="color:black" id="datePicker' + inside2 + '" >\
                        <div style="background-color:grey" >\
                            <span style="background-color:grey" onClick="hideCal('+ inside1 + ')">cancel</span>\
                            <span style="background-color:grey" onClick="removeDate('+ inside1 + ')">remove</span>\
                            <span  style="background-color:grey" onClick="saveDate('+ inside1 + ')">save</span>\
                        </div >\
                     </div>\
                </div>'
        }
        parent.Phases.forEach(function (phase) {
            //Below is the date picker appended to the beginning of each phase
            progressBar += returnPortion(parent.id + ",'" + phase.name + "'", parent.id + phase.name, '')
            //Below is the actual portion of the progress bar
            progressBar += '<div class="progress-bar greyback" id="progressBar' + parent.id + phase.name + '"  role="progressbar" style="width:' + percent + '%"><span>' + phase.name + '</span><span id=par' + parent.id + phase.name + '></span></div>'
        })
        //Below is the last date picker
        progressBar += returnPortion(parent.id, parent.id, ';right:10px')

        //The last div ends the progress bar
        progressBar += '</div>'
        return progressBar
    }

    function createContent(parent) {
        var content = '<div class="row">\
    <div class="col-sm-2" >\
      <p>Next task:</p>\
    </div>\
    <div class="col-sm-2" >\
      <p id="taskdate' + parent.id + '">date</p>\
    </div>\
    <div class="col-sm-10" >\
      <p id="taskbody' + parent.id + '"></p>\
    </div>\
  </div>\
  <div class="row">\
    <div class="col-sm-2" >\
      <p>Last Note:</p>\
    </div>\
    <div class="col-sm-2" >\
      <p id="notedate' + parent.id + '">date</p>\
    </div>\
    <div class="col-sm-10" >\
      <p id="notebody' + parent.id + '"></p>\
    </div>\
  </div>'
        return content
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
        </div>'
    newPanel += createContent(this)
    newPanel += '</div>\
    <div id="collapse' + leadNum + '" class="panel-collapse collapse">\
      <div class="panel-body">Lorem ipsum dolor sit amet, consectetur adipisicing elit,\
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\
      commodo consequat.</div>\
    </div>\
  </div>'
    parent.append(newPanel)

    this.refreshPhaseBar()
}