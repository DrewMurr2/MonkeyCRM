var API = {
    call: function (url, additional, callback) {
        var adparams = ""
        if (additional) {
            for (var prop in additional) {
                adparams += "&" + prop + "=" + additional[prop];
            }
        }
        $.ajax({
            url: url
            , type: "post"
            , data: adparams
            , success: function (response) {
                if (callback) callback(response)
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                //alert(textStatus, errorThrown);
            }
        });
    }
    , getLeads: function (leads, callback) {
        var getLeadsCallback = callback
        API.call('../Leads.php', undefined, function (response) {
            var data = JSON.parse(response)
            var counter = 0
            var companies = data.data[0].company
            companies.forEach(function (company) {
                API.retrieveObject(company, function (objec) {
                    counter++
                    obj = ParseJSON(objec)
                    if (obj.data && obj.data[0] && obj.data[0].obj) leads.push(new MyObjs.lead(company, obj.data[0].obj))
                    else leads.push(new MyObjs.lead(company))
                    if (counter >= companies.length) getLeadsCallback()
                })
            })
        })
    }
    , retrieveObject: function (company, callback) {
        API.call('http://clientconnectcrm.azurewebsites.net/leadObj.php', {
            id: company.id
        }, function (obj) {
            callback(obj)
        })
    }
    , retrieveNotes: function (lead) {
        API.call('../notes.php', {
            id: lead.id
            , obj: StringJSON(lead)
        }, function (obj) {
            var rawNotes = ParseJSON(obj).data[0]
            if (rawNotes.note) {
                rawNotes = rawNotes.note
                lead.hiddenProperties.notes = []
                if (rawNotes) {
                    if (rawNotes['created-at']) lead.hiddenProperties.notes.push(new MyObjs.note(rawNotes))
                    else rawNotes.forEach(function (raw) {
                        lead.hiddenProperties.notes.push(new MyObjs.note(raw))
                    })
                    Functions.orderNotes(lead)
                }
            }
        })
    }
    , retrieveTasks: function (lead) {
        API.call('../tasks.php', {
            id: lead.id
        }, function (obj) {
            var taskSets = ParseJSON(obj).data
            lead.hiddenProperties.tasks = []
            if (taskSets) {
                taskSets.forEach(function (taskSet) {
                    if (taskSet.task)
                        if (taskSet.task['created-at']) lead.hiddenProperties.tasks.push(new MyObjs.task(taskSet.task))
                        else taskSet.task.forEach(function (tasker) {
                            lead.hiddenProperties.tasks.push(new MyObjs.task(tasker))
                        })
                })
                Functions.orderTasks(lead)
            }
        })
    }
    , createObj: function (lead) {
        API.call('http://clientconnectcrm.azurewebsites.net/CreateLeadObj.php', {
            id: lead.id
            , obj: StringJSON(lead)
        }, function (obj) {
            console.log('createObj', ParseJSON(obj))
        })
    }
}