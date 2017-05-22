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
        }
        else {
            $(".classified").css('display', 'none')
        }
    })
}
var view = 'default'

function sortByClosest() {
    view = 'ClosestToClose'
    var parent = $(document.getElementById('accordion'))
    parent.html('')
    leadsCopy = returnClosestList()
    leadsCopy.forEach(function (l) {
        l.show()
    })
}

function returnClosestList() {
    var leadsCopy = []
    leads.forEach(function (Ld) {
        leadsCopy.push(Ld)
    })
    var arrangedList = []
    for (Phi = leads[0].Phases.length - 1; Phi >= 0; Phi--) {
        for (Ldi = leadsCopy.length - 1; Ldi >= 0; Ldi--) {
            var dateValue
            if (leadsCopy[Ldi]) {
                if (Phi) dateValue = leadsCopy[Ldi].Phases[Phi].end
                else dateValue = leadsCopy[Ldi].Phases[Phi].start
                if (dateValue) {
                    arrangedList.push(leadsCopy[Ldi])
                    leadsCopy[Ldi] = undefined;
                }
            }
        }
    }
    return arrangedList
}
var xpModal

function extraPropertiesModal(leadNum) {
    console.log("IN")
    var ld = fromNumber(leadNum)
    console.log('ld', ld)
    if (!xpModal) xpModal = new BSJS.Modal
    console.log('xpModal', xpModal)
    xpModal.setHeader(ld.name)
    xpModal.setBody(function () {
        var str = ''
        for (var propt in ld.extraProperties) {
            str += '<span onClick="removeExtraProp(' + ld.id + ',' + "'" + propt + "'" + ')">x&#160;</span>' + propt + ': ' + ld.extraProperties[propt] + '<br>';
        }
        str += '\
<div class="form-group">\
  <label for="usr">New Property Name:</label>\
  <input type="text" class="form-control" id="npn">\
</div>\
<div class="form-group">\
  <label for="pwd">New Property Value:</label>\
  <input class="form-control" id="npv">\
</div>\
 <button type="button" class="btn" onClick="newProperty(' + ld.id + ',npn.value,npv.value)">Save</button>'
        return str
    })
    xpModal.show()
}

function removeExtraProp(ldid, p) {
    var ld = fromNumber(ldid)
    delete ld.extraProperties[p]
    extraPropertiesModal(ldid)
    ld.save()
}

function newProperty(ldid, npn, npv) {
    var ld = fromNumber(ldid)
    ld.extraProperties[npn] = npv
    ld.save()
    extraPropertiesModal(ldid)
}

function showAll() {
    view = 'default'
    clearPage()
    leads.forEach(function (leadl) {
        leadl.show()
    })
}

function clearPage() {
    var parent = $(document.getElementById('accordion'))
    parent.html('')
}

function sortByTag(tag) {
    view = tag
    clearPage()
    leads.forEach(function (ld) {
        if (ld.tags[tag]) {
            ld.show()
        }
    })
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
        console.log(data)
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
    view = 'next'
    var parent = $(document.getElementById('accordion'))
    parent.html('')
    var leadsCopy = []
    var containsAllFields = function (Ld) {
        if (Ld && Ld.hiddenProperties && Ld.hiddenProperties.tasks && Ld.hiddenProperties.tasks[0] && Ld.hiddenProperties.tasks[0].date) return true
        else return false
    }
    var eligible = function (Ld) {
        if (!Ld.tags.lost && !Ld.tags['ARC first'] && !Ld.tags.sold) return true
        else return false
    }
    leads.forEach(function (Ld) {
        if (containsAllFields(Ld) && eligible(Ld))
            if (leadsCopy.length == 0) leadsCopy.push(Ld)
            else {
                this.found = false;
                for (ldci = 0; ldci < leadsCopy.length && !this.found; ldci++) {
                    if (Ld.hiddenProperties.tasks[0].date < leadsCopy[ldci].hiddenProperties.tasks[0].date) {
                        leadsCopy.splice(ldci, 0, Ld)
                        this.found = true
                    }
                }
                if (!this.found) leadsCopy.push(Ld)
            }
    })
    leads.forEach(function (Ld) {
        Ld.yellow = 0
        Ld.red = 0
        if (containsAllFields(Ld) && eligible(Ld)) {
            if (Ld.hiddenProperties.tasks[0].date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) Ld.yellow = 1;
            if (Ld.hiddenProperties.tasks[0].date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) Ld.red = 1;
        }
        else if (eligible(Ld)) {
            leadsCopy.unshift(Ld);
            Ld.red = 1
        }
    })
    leadsCopy.forEach(function (lc) {
        lc.show()
        if (lc.red) lc.HTMLElement().className = 'panel panel-danger'
        if (lc.yellow) lc.HTMLElement().className = 'panel panel-warning'
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
    }
    else {
        pickedDate = document.getElementById('datePicker' + id).value
        var phazez = thisLead.Phases
        phazez[phazez.length - 1].end = pickedDate
    }
    hideCal(id, phase)
    thisLead.save()
    thisLead.refreshPhaseBar()
    if (view == 'ClosestToClose') sortByClosest()
}

function removeDate(id, phase) {
    var thisLead = fromNumber(id)
    if (phase) {
        var ind = thisLead.indexOfPhase(phase)
        thisLead.Phases[ind].start = null
        if (ind) thisLead.Phases[ind - 1].end = null
    }
    else {
        var phazez = thisLead.Phases
        phazez[phazez.length - 1].end = null
    }
    hideCal(id, phase)
    thisLead.save()
    thisLead.refreshPhaseBar()
    if (view == 'ClosestToClose') sortByClosest()
}
var leadNum = 0

function fromNumber(num) {
    for (i = 0; i < leads.length; i++) {
        if (leads[i].id * 1 == num) return leads[i]
    }
}

function retrieveObject(company, callback) {
    call('http://clientconnectcrm.azurewebsites.net/leadObj.php', {
        id: company.id
    }, function (obj) {
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