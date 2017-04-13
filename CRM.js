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

function sortByClosest() {
    var parent = $(document.getElementById('accordion'))

    parent.html('')
    var leadsCopy = []
    leads.forEach(function (Ld) {
        leadsCopy.push(Ld)
    })
    for (Phi = leads[0].Phases.length - 1; Phi >= 0; Phi--) {
        for (Ldi = leadsCopy.length - 1; Ldi >= 0; Ldi--) {
            if (leadsCopy[Ldi] && leadsCopy[Ldi].Phases[Phi].end) {
                leadsCopy[Ldi].show()
                leadsCopy[Ldi] = undefined;
            }
        }
    }
}
function daysBetween(one, another) {
    return Math.round(Math.abs((+one) - (+another)) / 8.64e7);
}

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
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
                if (obj.data && obj.data[0] && obj.data[0].obj) leads.push(new lead(company, obj.data[0].obj))
                else leads.push(new lead(company))
            })
        })
    })
}


function saveALL() {
    leads.forEach(function (lead) {
        lead.save()
    })
}

function sortByNextFollowUp() {
    var parent = $(document.getElementById('accordion'))
    parent.html('')
    var leadsCopy = []
    leads.forEach(function (Ld) {
        if (Ld && Ld.hiddenProperties && Ld.hiddenProperties.tasks && Ld.hiddenProperties.tasks[0] && Ld.hiddenProperties.tasks[0].date)
            if (leadsCopy.length == 0) leadsCopy.push(Ld)
            else {
                this.found = false;
                for (ldci = 0; ldci < leadsCopy.length && !this.found; ldci++) {
                    if (Ld.hiddenProperties.tasks[0].date < leadsCopy[ldci].hiddenProperties.tasks[0].date) {
                        leadsCopy.splice(ldci, 0, Ld)
                        this.found = true
                    }
                }
                if(!this.found)leadsCopy.push(Ld)
            }
    })
    leadsCopy.forEach(function (lc) {
        lc.show()
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

function removeDate(id, phase) {
    var thisLead = fromNumber(id)
    if (phase) {
        var ind = thisLead.indexOfPhase(phase)
        console.log(ind)
        thisLead.Phases[ind].start = null
        if (ind) thisLead.Phases[ind - 1].end = null
    } else {
        var phazez = thisLead.Phases
        phazez[phazez.length - 1].end = null
    }
    hideCal(id, phase)
    thisLead.save()
    thisLead.refreshPhaseBar()
}

var leadNum = 0


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


