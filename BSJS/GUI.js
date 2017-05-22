var bsjs = new BSJS('bsjs')
var MyModal = new bsjs.modal({
    title: 'My First Modal'
    , addTo: bsjs.body
})
var navBar = new bsjs.nav.bar({
    addTo: bsjs.body
    , title: 'Client Connect CRM'
    , logo: 'https://www.google.com/a/cpanel/legalmonkeys.com/images/logo.gif?service=google_default'
})
var reportsDropDown = new bsjs.nav.dropDownGroup({
    addTo: navBar.left
    , title: 'Reports'
})
var reportsDropDown_Overview = new bsjs.nav.dropDownItem({
    addTo: reportsDropDown.body
    , title: 'Overview of period'
    , onClick: MyModal.show
})
var reportsDropDown_Detail = new bsjs.nav.dropDownItem({
    addTo: reportsDropDown.body
    , title: 'Detail of lead engagement'
    , onClick: MyModal.show
})
var reportsDropDown_Payment = new bsjs.nav.dropDownItem({
    addTo: reportsDropDown.body
    , title: 'Payment Report'
    , onClick: MyModal.show
})




var sortDropDown = new bsjs.nav.dropDownGroup({
    addTo: navBar.left
    , title: 'Sort By'
})
var sortDropDown_All = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'All'
    , onClick: function () {
        myDomObjs.leads.clear()
        leads.forEach(function (l) {
            new myDomObjs.lead({
                data: l,
                addTo: bsjs.body
            }
            )
        })
    }
})
var sortDropDown_Closest = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'Closest to finish'
    , onClick: MyModal.show
})
var sortDropDown_Next = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'Next follow up'
    , onClick: MyModal.show
})
var sortDropDown_Installs = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'Installs'
    , onClick: MyModal.show
})
var sortDropDown_Lost = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'Lost'
    , onClick: MyModal.show
})
var sortDropDown_ArcFirst = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'Arc First'
    , onClick: MyModal.show
})
var sortDropDown_Sold = new bsjs.nav.dropDownItem({
    addTo: sortDropDown.body
    , title: 'Sold'
    , onClick: MyModal.show
})

getLeads(function () {
    leads.forEach(function (l) {
        l.domObj = new myDomObjs.lead({ addTo: bsjs.body, data: l })
    })
})







var button = new bsjs.button({
    title: 'My Button'
    , addTo: MyModal.body
    , onClick: function () {
        alert("It is me!")
    }
})
var panel = new bsjs.panel({
    title: 'My Panel'
    , addTo: bsjs.body
})

getLeads()