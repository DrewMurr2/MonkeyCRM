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
        , data: adparams
        , success: function (response) {
            if (callback) callback(response)
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus, errorThrown);
        }
    });
}


function getLeads(callback) {
    var getLeadsCallback = callback
    call('../Leads.php', undefined, function (response) {
        var data = JSON.parse(response)
        console.log(data)
        var counter = 0
        var companies = data.data[0].company
        companies.forEach(function (company) {
            retrieveObject(company, function (objec) {
                counter++
                obj = ParseJSON(objec)
                if (obj.data && obj.data[0] && obj.data[0].obj) leads.push(new lead(company, obj.data[0].obj))
                else leads.push(new lead(company))
                if (counter >= companies.length) getLeadsCallback()
            })
        })
    })
}

function retrieveObject(company, callback) {
    call('http://clientconnectcrm.azurewebsites.net/leadObj.php', {
        id: company.id
    }, function (obj) {
        callback(obj)
    })
}