var MyObjs = {
    leads: []
    , lead: function (company, obj) {
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
        if (!obj) API.createObj(this)
        API.retrieveNotes(this)
        API.retrieveTasks(this)
        console.log(this)

        function phase(options) {
            this.name = options.name || null, this.start = options.start || null, this.end = options.end || null, this.targetDuration = options.targetDuration || null
        }
        var thisLead = BSJS.inherit(this, new BSJS.panel({
            heading: new BSJS.grid({
                rows: [{
                    columns: [{
                        width: 2
                        , main: thisLead.name + '2'
                    }, 8, {
                        width: 2
                        , main: function () {
                            if (thisLead.hiddenProperties.notes && thisLead.hiddenProperties.notes[0]) {
                                return thisLead.hiddenProperties.notes[0]
                            }
                            else return thisLead.name
                        }()
                    }]
                }]
            })
            , body: this.name
            , footer: this.name
        }))
    }
    , note: function (raw) {
        if (raw.body) this.body = raw.body
        if (raw['created-at']) this.date = new Date(raw['created-at'])
    }
    , task: function (raw) {
        if (raw.body) this.body = raw.body
        if (raw['due-at']) this.date = new Date(raw['due-at'])
    }
}