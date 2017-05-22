function overView(st, en) {
    st = new Date(Date.now())
    st.setDate(18)
    console.log(st)
    en = new Date(Date.now())
    en.setDate(21)
    console.log(en)
    var JQbody = $(document.getElementById('accordion'))
    JQbody.html('')

    function countPhases(PhaseCollection, t) {
        var OV = this
        OV.Phases = []
        PhaseCollection[0].Phases.forEach(function (phase) {
            var newPhase = new phaseCounter(phase.name)
            this.Phases[phase.name] = newPhase
            this.Phases.push(newPhase)
        })

        function phaseCounter(name) {
            this.phaseName = name
            this.phaseCount = 0
        }
        PhaseCollection.forEach(function (lead) {
            lead.Phases.forEach(function (p) {
                if (lead.name == "Gutierrez Injury Law") console.log(p, t)
                if (new Date(p.start) <= t && new Date(p.end) > t) OV.Phases[p.name].phaseCount++
            })
        })
        console.log(OV.Phases)
        return OV.Phases
    }

    function displayPhaseCount(title, collection) {
        JQbody.append('<br><br>' + title + '<br><br>')
        collection.forEach(function (p) {
            JQbody.append(p.phaseName + ":" + p.phaseCount + "<br>")
        })
    }
    displayPhaseCount("Start of Period:", countPhases(leads, st))
    displayPhaseCount("End of Period:", countPhases(leads, en))
}

function detailLead(stDate, endDate) {
    stDate = new Date('4-1-17')
    endDate = new Date('5-5-17')
    var JQbody = $(document.getElementById('accordion'))
    JQbody.html('')
    var leadslist = returnClosestList()
    JQbody.append('<br> Number of Leads: ' + leadslist.length)
    leadslist.forEach(function (ld) {
        JQbody.append('<br><br><b><u> ' + ld.name + '</b></u><br>Overview:')
        ld.Phases.forEach(function (ph) {
            if (new Date(ph.start) <= stDate && new Date(ph.end) > stDate) {
                JQbody.append('<br> &#160;&#160;&#160;BOM: ' + ph.name)
            }
            if (new Date(ph.end) > endDate && new Date(ph.start) <= endDate) {
                JQbody.append('<br> &#160;&#160;&#160;EOM: ' + ph.name)
            }
        })
        JQbody.append('<br><br>Notes:')
        if (ld.hiddenProperties && ld.hiddenProperties.notes) ld.hiddenProperties.notes.forEach(function (n) {
            if (n.date >= stDate && n.date <= endDate) {
                JQbody.append('<br>&#160;&#160;&#160;Date: ' + n.date)
                JQbody.append('<br>&#160;&#160;&#160;Note: ' + n.body)
            }
        })
        JQbody.append('<br><br>Tasks:')
        if (ld.hiddenProperties && ld.hiddenProperties.tasks) ld.hiddenProperties.tasks.forEach(function (n) {
            if (n.date >= stDate && n.date <= endDate) {
                JQbody.append('<br>&#160;&#160;&#160;Date: ' + n.date)
                JQbody.append('<br>&#160;&#160;&#160;Task: ' + n.body)
            }
        })
    })
    copyToClipboard(JQbody.text())
}