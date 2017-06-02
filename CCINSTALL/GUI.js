BSJS.init()

var options = {
    FirmName: 'My Firm',
    FirmID: '',
    Password: '',
    UseBothCaseManager: 'false',
    FirstCaseManager: 1,
    SecondCaseManager: 2,
    SputnikVersion: "3.51.0",
    FilesToDownLoad: {
        legal_firm_properties: true,
        sputnik_l4j_ini: true,
        orm_needles: true,
        sputnik: true,
        log4j: true,
        sql_asa11: true,
        DBeaver: false,
        Notepad_PlusPlus: false,
        JavaJDK: false
    }
}

var panel = new BSJS.panel({
    addTo: BSJS.main,
    heading: '<h1>Client Connect Install Wizard</h1>',
    body: new BSJS.grid({
        rows: [{
            columns: [1, {
                width: 2
                , main: 'Firm Name:'
            }, {
                    width: 2
                    , main: '<<:options.FirmName>>'
                }, 2, {
                    width: 2
                    , main: 'Firm ID:'
                }, {
                    width: 2
                    , main: '<<:options.FirmID>>'
                }, 1]
        },
        {
            columns: [1, {
                width: 2
                , main: 'Password:'
            }, {
                    width: 2
                    , main: '<<:options.Password>>'
                }, 2, {
                    width: 2
                    , main: 'Notify both case managers:'
                }, {
                    width: 2
                    , main: new BSJS.dataConnection({ obj: options, prop: 'UseBothCaseManager', twoWay: true, type: 'boolean' }).marker()
                }, 1]
        },
        {
            columns: [1, {
                width: 2
                , main: 'First Case Manager:'
            }, {
                    width: 2
                    , main: '<<:options.FirstCaseManager>>'
                }, 2, {
                    width: 2
                    , main: 'Second Case Manager:'
                }, {
                    width: 2
                    , main: '<<:options.SecondCaseManager>>'
                }, 1]
        },
        {
            columns: [1, {
                width: 2
                , main: 'Sputnik Version'
            }, {
                    width: 2
                    , main: '<<:options.SputnikVersion>>'
                }, 7]
        }
        ]
    }),
    footing: 'button'
})




