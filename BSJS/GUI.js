BSJS.init()

var navbar = new BSJS.nav.bar({
    title: 'Monkey CRM',
    addTo: BSJS.tags.main,
    left: new BSJS.nav.dropDownGroup({
        title: 'Reports',
        body: [new BSJS.nav.dropDownItem({
            body: 'First',
            onClick: function () { alert('Working') }
        }), new BSJS.nav.dropDownItem({
            body: 'Second',
            onClick: function () { alert('Second Working') }
        })]
    })
})
// var panel = new BSJS.panel({ addTo: BSJS.tags.main })