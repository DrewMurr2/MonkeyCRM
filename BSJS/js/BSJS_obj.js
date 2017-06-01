BSJS.obj = function (options) {
    var thisBSJSelement = this
    if (options.var) window[options.var] = this
    this.tags = []
    this.template = options.template
    this.tagsArr = function (str) {
        var arr = [];
        var uniqueArr = [];
        str.replace(/{{([^}]*)}}/g, function (m) {
            var tgr = m.substring(2, m.length - 2).split(".")
            if (uniqueArr.indexOf(tgr[0]) == -1) {
                tgr.unique = 1
                uniqueArr.push(tgr[0])
            }
            arr.push(tgr)
        });
        return arr;
    }(options.template)


    if (options.onClick) { //If the element is passed an onclick event it passes it to the first tag in the template
        if (!options[this.tagsArr[0][0]]) options[this.tagsArr[0][0]] = {}
        options[this.tagsArr[0][0]].onClick = options.onClick
    }
    this.tagsArr.forEach(function (t) { //This actually creates the tag objects
        if (t.unique) {
            var nTag = new BSJS.tag(options[t[0]]) //create tag
            thisBSJSelement.tags.push(nTag) //push to tags array
            thisBSJSelement.tags[t[0]] = nTag //creates as a property of the tags object
            thisBSJSelement[t[0]] = nTag //creates as a property of the object to make shorter code
        }
    })


    this.updateDataConnectionsArr = function () {
        var arr = [];
        thisBSJSelement.template.replace(/<<([^}]*)>>/g, function (m) {
            var dc = BSJS.returnDataConnection(m.substring(2, m.length - 2))
            thisBSJSelement.template = BSJS.functions.replaceAll(thisBSJSelement.template, m, dc.marker())
            if (arr.indexOf(dc) == -1) arr.push(dc)
        });
        if (arr.length > 0 && BSJS.objectsWithDataConnection.indexOf(thisBSJSelement) == -1) BSJS.objectsWithDataConnection.push(thisBSJSelement)
        return arr;
    }

    this.dataConnectionsArr = this.updateDataConnectionsArr()

    this.hasChanged = function () {
        var changed = false
        thisBSJSelement.dataConnectionsArr.forEach(function (dca) {
            if (dca.hasChanged()) changed = true
        })
        return changed
    }

    this.refresh = function () {
        if (thisBSJSelement.main.element()) {
            var crt = thisBSJSelement.returnCreateObj()
            BSJS.functions.replaceElement(thisBSJSelement.main.element(), crt.html)
            crt.callback()
        }
    }


    this.create = function () {
        if (thisBSJSelement.tags.main.element()) thisBSJSelement.tags.main.jQ().remove()
        return thisBSJSelement.returnCreateObj()
    }




    this.returnCreateObj = function () {
        thisBSJSelement.dataConnectionsArr = thisBSJSelement.updateDataConnectionsArr()
        return {
            html: function () {
                var htm = thisBSJSelement.template
                thisBSJSelement.dataConnectionsArr.forEach(function (dcr) {
                    htm = BSJS.functions.replaceAll(htm, dcr.marker(), dcr.val())
                })
                thisBSJSelement.tagsArr.forEach(function (tA) {
                    var thisThing = thisBSJSelement.tags[tA[0]][tA[1]]
                    var replacement = function () {
                        if (jQuery.type(thisThing) === "function") {
                            return thisThing()
                        }
                        else {
                            return thisThing
                        }
                    }()
                    htm = htm.replace('{{' + tA.join('.') + '}}', replacement)
                })
                return htm
            }()
            , callback: function () {
                thisBSJSelement.tags.forEach(function (tg) {
                    tg.render()
                })
            }
        }
    }

    if (options.addTo) options.addTo.add(this)
    return this
}