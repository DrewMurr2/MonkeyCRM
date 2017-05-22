var leads = []
var view



var myDomObjs = {
    leads: {
        list: [],
        clear: function () {
        }
    },
    lead: function (options) {
        var thisLead = this
        if (options && options.data) this.data = options.data
        options.data.dom = this
        this.panel = new bsjs.panel({})
        this.create = function () {
            return {
                html: thisLead.panel.create(), callback: function () {
                    thisLead.title = new bsjs.grid({ addTo: thisLead.panel.heading })
                    thisLead.title.addRows({ columns: [2, 10], rows: 2 })
                    thisLead.title.rows[0].columns[0].main.set(thisLead.data.name)
                    thisLead.title.rows[0].columns[1].main.set(thisLead.data.createProgressBar(thisLead.data))
                    thisLead.title.main.jQ().css('margin-left', '0px')
                    thisLead.title.main.jQ().css('margin-right', '0px')
                }
            }
        }
        if (options.addTo) options.addTo.add(this)
    }
}






function lead(company, obj) {
    this.name = company.name
    this.id = company.id
    this.tags = []
    var thisLead = this
    if (company.tags.tag.name) this.tags.push(company.tags.tag.name)
    else company.tags.tag.forEach(function (t) {
        thisLead.tags.push(t.name)
        if (!thisLead.hiddenProperties) thisLead.hiddenProperties = []
        thisLead.tags[t.name] = 1
    })
    if (isString(company.background)) this.background = company.background
    if (obj && obj.updatedDate) this.updatedDate = obj.updatedDate
    else this.updatedDate = (new Date()).getDate()
    if (obj && obj.Phases) this.Phases = obj.Phases
    else {
        this.Phases = []
        this.Phases.push(new phase({
            name: "Cold"
            , targetDuration: 60
        }))
        this.Phases.push(new phase({
            name: "Interested"
            , targetDuration: 14
        }))
        this.Phases.push(new phase({
            name: "Demonstrations"
            , targetDuration: 8
        }))
        this.Phases.push(new phase({
            name: "TermsAndConditions"
            , targetDuration: 4
        }))
        this.Phases.push(new phase({
            name: "Install"
            , targetDuration: 18
        }))
        this.Phases.push(new phase({
            name: "Training"
            , targetDuration: 6
        }))
        this.Phases.push(new phase({
            name: "PaymentConfirmation"
            , targetDuration: 2
        }))
    }
    if (obj && obj.Install) this.Install = obj.Install
    else {
        this.Install = {}
        this.Install.Phases = []
        this.Install.Phases.push(new phase({
            name: "accessToServer"
            , targetDuration: 2
        }))
        this.Install.Phases.push(new phase({
            name: "installQuestionsAnswered"
            , targetDuration: 2
        }))
        this.Install.Phases.push(new phase({
            name: "configuredFirmSettings"
            , targetDuration: 2
        }))
        this.Install.Phases.push(new phase({
            name: "syncNeedles"
            , targetDuration: 2
        }))
        this.Install.Phases.push(new phase({
            name: "testProduction"
            , targetDuration: 2
        }))
        this.Install.Phases.push(new phase({
            name: "scheduleTraining"
            , targetDuration: 2
        }))
    }
    if (obj && obj.extraProperties) this.extraProperties = obj.extraProperties
    else this.extraProperties = {
        source: ""
    }
    if (!this.hiddenProperties) this.hiddenProperties = []
    if (!obj) this.createObj()
    // this.show()
    this.retrieveNotes()
    this.retrieveTasks()
    console.log(this)

    function phase(options) {
        this.name = options.name || null, this.start = options.start || null, this.end = options.end || null, this.targetDuration = options.targetDuration || null
    }
}
lead.prototype.orderNotes = function () {
    var parent = this
    for (i = 1; i < parent.hiddenProperties.notes.length; i++) {
        for (j = i; j > 0 && parent.hiddenProperties.notes[j].date > parent.hiddenProperties.notes[j - 1].date; j--) {
            parent.hiddenProperties.notes.splice(j - 1, 2, parent.hiddenProperties.notes[j], parent.hiddenProperties.notes[j - 1]);
        }
    }
    parent.showNotes()
}
lead.prototype.showNotes = function () {
    if (this.hiddenProperties && this.hiddenProperties.notes && this.hiddenProperties.notes[0]) {
        $(document.getElementById('notedate' + this.id)).html(new Date(this.hiddenProperties.notes[0].date))
        $(document.getElementById('notebody' + this.id)).html(this.hiddenProperties.notes[0].body)
    }
}
lead.prototype.remove = function () {
    $(document.getElementById(this.id)).remove()
}
lead.prototype.orderTasks = function () {
    var parent = this
    for (i = 1; i < parent.hiddenProperties.tasks.length; i++) {
        for (j = i; j > 0 && parent.hiddenProperties.tasks[j].date > parent.hiddenProperties.tasks[j - 1].date; j--) {
            parent.hiddenProperties.tasks.splice(j - 1, 2, parent.hiddenProperties.tasks[j], parent.hiddenProperties.tasks[j - 1]);
        }
    }
    parent.showTasks()
}
lead.prototype.jQueryElement = function () {
    return $(document.getElementById(this.id))
}
lead.prototype.HTMLElement = function () {
    return document.getElementById(this.id)
}
lead.prototype.showTasks = function () {
    var parent = this
    if (parent.hiddenProperties && parent.hiddenProperties.tasks && parent.hiddenProperties.tasks[0]) {
        $(document.getElementById('taskdate' + parent.id)).html(new Date(parent.hiddenProperties.tasks[0].date))
        $(document.getElementById('taskbody' + parent.id)).html(parent.hiddenProperties.tasks[0].body)
    }
}

function note(raw) {
    if (raw.body) this.body = raw.body
    if (raw['created-at']) this.date = new Date(raw['created-at'])
}

function task(raw) {
    if (raw.body) this.body = raw.body
    if (raw['due-at']) this.date = new Date(raw['due-at'])
}
lead.prototype.retrieveNotes = function () {
    var lead = this
    call('notes.php', {
        id: this.id
        , obj: StringJSON(this)
    }, function (obj) {
        var rawNotes = ParseJSON(obj).data[0]
        if (rawNotes.note) {
            rawNotes = rawNotes.note
            lead.hiddenProperties.notes = []
            if (rawNotes) {
                if (rawNotes['created-at']) lead.hiddenProperties.notes.push(new note(rawNotes))
                else rawNotes.forEach(function (raw) {
                    lead.hiddenProperties.notes.push(new note(raw))
                })
                lead.orderNotes()
            }
        }
    })
}
lead.prototype.retrieveTasks = function () {
    var lead = this
    call('tasks.php', {
        id: this.id
    }, function (obj) {
        var taskSets = ParseJSON(obj).data
        lead.hiddenProperties.tasks = []
        if (taskSets) {
            taskSets.forEach(function (taskSet) {
                if (taskSet.task)
                    if (taskSet.task['created-at']) lead.hiddenProperties.tasks.push(new task(taskSet.task))
                    else taskSet.task.forEach(function (tasker) {
                        lead.hiddenProperties.tasks.push(new task(tasker))
                    })
            })
            lead.orderTasks()
        }
    })
}
lead.prototype.save = function () {
    if (this.updatedDate == (new Date()).getDate()) this.updateObj()
    else this.createObj()
}
lead.prototype.refreshPhaseBar = function () {
    var t
    if (view && view == "install") t = this.Install
    else t = this
    for (i = 1; i < t.Phases.length; i++) {
        if (t.Phases[i].start) t.Phases[i - 1].end = t.Phases[i].start
    }
    for (i = 0; i < t.Phases.length; i++) {
        var days = ""
        var bar = document.getElementById('progressBar' + t.id + t.Phases[i].name)
        var par = $(document.getElementById('par' + t.id + t.Phases[i].name))
        if (!t.Phases[i].start) bar.className = "progress-bar greyback"
        if (t.Phases[i].start && !t.Phases[i].end) {
            days = t.Phases[i].targetDuration - daysBetween(new Date(), new Date(t.Phases[i].start))
            if (days < 0) bar.className = "progress-bar progress-bar-danger progress-bar-striped active"
            else bar.className = "progress-bar progress-bar-warning progress-bar-striped active"
        }
        if (t.Phases[i].start && t.Phases[i].end) {
            days = t.Phases[i].targetDuration - daysBetween(new Date(t.Phases[i].end), new Date(t.Phases[i].start))
            bar.className = "progress-bar progress-bar-success"
        }
        if (days) par.html('&#160&#160 ' + days)
        else par.html('')
        if (days < 0) par.css('color', 'red')
        else par.css('color', 'black')
    }
}
lead.prototype.updateObj = function () {
    call('http://clientconnectcrm.azurewebsites.net/UpdateObj.php', {
        id: this.id
        , obj: StringJSON(this)
    }, function (obj) {
        console.log(ParseJSON(obj))
    })
}
lead.prototype.createObj = function () {
    call('http://clientconnectcrm.azurewebsites.net/CreateLeadObj.php', {
        id: this.id
        , obj: StringJSON(this)
    }, function (obj) {
        console.log(ParseJSON(obj))
    })
}
lead.prototype.phaseFromName = function (name) {
    for (i = 0; i < this.Phases.length; i++) {
        if (this.Phases[i].name == name) return this.Phases[i]
    }
    for (i = 0; i < this.Install.Phases.length; i++) {
        if (this.Install.Phases[i].name == name) return this.Install.Phases[i]
    }
}
lead.prototype.indexOfPhase = function (name) {
    for (i = 0; i < this.Phases.length; i++) {
        if (this.Phases[i].name == name) return i
    }
}
lead.prototype.refreshBody = function () {
    this.retrieveNotes()
    this.retrieveTasks()
    if (view == 'next') setTimeout(sortByNextFollowUp, 1000)
}
lead.prototype.createProgressBar = function (parent) {
    if (view == "install") parent = this.Install
    parent.id = this.id
    var dividerWidth = 0.3
    var progressBar = '<div class="progress">'
    var percent = (100 - (dividerWidth * (parent.Phases.length + 1))) / parent.Phases.length

    function returnPortion(inside1, inside2, otherProperty) {
        return '<div class="progress-bar" role="progressbar" style="width:' + dividerWidth + '%" onClick="setPhaseStartDate(' + inside1 + ')">\
                    <div id="dateWrapper' + inside2 + '" style="display:none;float:left;position:absolute' + otherProperty + '"><input type="date" style="color:black" id="datePicker' + inside2 + '" >\
                        <div style="background-color:grey" >\
                            <span style="background-color:grey" onClick="hideCal(' + inside1 + ')">cancel</span>\
                            <span style="background-color:grey" onClick="removeDate(' + inside1 + ')">remove</span>\
                            <span  style="background-color:grey" onClick="saveDate(' + inside1 + ')">save</span>\
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
lead.prototype.show = function () {
    var parent = $(document.getElementById('accordion'))
    //******This is the wrapper for note and task date and body */
    function createContent(parent) {
        var content = '<div class="row">\
  <div class="col-sm-1"  style="overflow:hidden;height:20px">\
      <p>Next task:</p>\
    </div>\
    <div class="col-sm-1"  style="overflow:hidden;height:20px">\
      <p id="taskdate' + parent.id + '"></p>\
    </div>\
    <div class="col-sm-10" style="overflow:hidden;height:20px">\
      <p id="taskbody' + parent.id + '"></p>\
    </div>\
  </div>\
  <div class="row">\
    <div class="col-sm-1"  style="overflow:hidden;height:40px">\
      <p>Last Note:</p>\
    </div>\
    <div class="col-sm-1"  style="overflow:hidden;height:40px">\
      <p id="notedate' + parent.id + '"></p>\
    </div>\
    <div class="col-sm-10" style="overflow:hidden;height:40px">\
      <p id="notebody' + parent.id + '"></p>\
    </div>\
  </div>'
        return content
    }
    // //   <h4 class="panel-title">\</h4>\
    var newPanel = '<div class="panel panel-default" id="' + this.id + '">\
    <div class="panel-heading">\
       <div class="row">\
            <div class="col-sm-2">\
                   <span><a href="https://legalmonkeys.highrisehq.com/companies/' + this.id + '" target="_blank">' + this.name + '</a></span>\
      <span onClick="fromNumber(' + this.id + ').refreshBody()" >&#160;&#160;<img class="gb_6b" src="http://findicons.com/files/icons/1714/dropline_neu/128/view_refresh.png" style="max-width:16px;max-height:16px"></span><span onClick="extraPropertiesModal(' + this.id + ')">&#160;[xtra]</span><span onClick="fromNumber(' + this.id + ').remove()" >&#160;&#160;<img class="gb_6b" src="http://megaicons.net/static/img/icons_sizes/22/119/128/check-icon.png" style="max-width:16px;max-height:16px"></span>\
            </div>\
            <div id="wrapperBar' + this.id + '" class="col-sm-10">\
                    ' + this.createProgressBar(this) + '\
            </div>\
        </div>'
    newPanel += '</div><div class="panel-body">'
    newPanel += createContent(this)
    newPanel += '</div></div>'
    parent.append(newPanel)
    this.showNotes()
    this.showTasks()
    this.refreshPhaseBar()
}
lead.prototype.replaceBar = function (p) {
    var pbar = $(document.getElementById('wrapperBar' + this.id))
    pbar.html(this.createProgressBar(p))
    this.refreshPhaseBar()
}