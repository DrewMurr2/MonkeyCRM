BSJS.init()
var navbar = new BSJS.nav.bar({
    title: 'Monkey CRM'
    , addTo: BSJS.tags.main
    , left: [new BSJS.nav.dropDownGroup({
        var: 'Reports'
        , title: 'Reports'
        , body: [new BSJS.nav.dropDownItem({
            body: 'Overview of period'
            , onClick: function () {
                alert('Working')
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Detail of each lead'
            , onClick: function () {
                alert('Second Working')
            }
        })]
    }), new BSJS.nav.dropDownGroup({
        var: 'View'
        , title: 'View'
        , body: [new BSJS.nav.dropDownItem({
            body: 'All'
            , onClick: function () {
                MyObjs.leads.forEach(function (l) {
                    BSJS.main.add(l)
                })
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Closest to finish'
            , onClick: function () {
                alert('Second Working')
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Next follow up'
            , onClick: function () {
                alert('Second Working')
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Installs'
            , onClick: function () {
                alert('Second Working')
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Lost'
            , onClick: function () {
                alert('Second Working')
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Arc First'
            , onClick: function () {
                alert('Second Working')
            }
        }), new BSJS.nav.dropDownItem({
            body: 'Sold'
            , onClick: function () {
                alert('Second Working')
            }
        })]
    })]
})
// API.getLeads(MyObjs.leads, function () {
//     alert('Leads Loaded')
// })
var dp = new BSJS.datePicker({
    onSave: function (params) {
        alert('params picked:' + params.value())
        console.log(d)
    }
})
var newGrid = new BSJS.grid({
    addTo: BSJS.main
    , rows: [{
        columns: [{
            width: 1
            , main: "greek"
        }, 5, 6]
    }, {
        columns: [4, 4, 4]
    }, {
        columns: [10, {
            width: 2
            , main: 'end'
        }]
    }]
})
    //var panel = new BSJS.panel({
    //  addTo: BSJS.tags.main
    //    })