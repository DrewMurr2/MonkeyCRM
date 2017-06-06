
BSJS.returnDataConnection = function (options) {
    var tipe = jQuery.type(options)
    if ($.isNumeric(options.replace(":", ""))) tipe = 'number'
    switch (tipe) {
        case "object":
            return new BSJS.dataConnection(options)

            break;
        case "string":
            var optString = options
            options = optString.includes(':') ? { twoWay: true } : {}
            if (optString.includes('(boolean)')) options.type = 'boolean'
            var Arrr = BSJS.functions.removeEmpty(BSJS.functions.replaceAll(optString, ['[', ']', ':', '(boolean)'], '.').split("."))
            options.prop = Arrr.splice(-1, 1)[0]
            options.obj = BSJS.functions.returnObj(Arrr)
            return new BSJS.dataConnection(options)

            break;
        case "number":
            return BSJS.dataConnections[options.replace(":", "")]
            break;
    }
}


BSJS.dataConnection = function (options) {

    var dc = this
    dc.index = BSJS.dataConnections.length
    BSJS.dataConnections[BSJS.dataConnections.length] = dc
    dc.obj = options.obj
    dc.prop = options.prop
    dc.twoWay = options.twoWay
    dc.type = options.type



    this.marker = function () {
        return '<<' + (dc.twoWay ? ':' : '') + dc.index + '>>'
    }
    this.prevVal = ''

    this.setPrevVal = function () {
        dc.prevVal = dc.val().toString()
        if (dc.onSave) dc.onSave()
        return true
    }

    this.hasChanged = function () {
        if (dc.prevVal == dc.val()) return false
        else return dc.setPrevVal()
    }
    this.edit = function () {
        var valEl = document.getElementById("val_" + dc.index)
        var editEl = document.getElementById("input_" + dc.index)
        $(valEl).hide()
        $(editEl).show()
        setTimeout(function () {
            window.onclick = function (event) {
                if (event.target != editEl) {
                    dc.save()
                }
            }
        }, 100)
    }
    this.save = function () {
        var valEl = document.getElementById("val_" + dc.index)
        var editEl = document.getElementById("input_" + dc.index)
        dc.obj[dc.prop] = editEl.value
        $(valEl).show()
        $(editEl).hide()
        window.onclick = undefined;
    }

    this.set = function (val) {
        dc.obj[dc.prop] = val
    }

    this.evalKey = function (e) {
        if (e.keyCode == 13) {
            dc.save()
            return false;
        }
    }
    this.type = dc.type || 'string'

    this.chooseDate = function () {
        BSJS.functions.replaceElement(document.getElementById('val_' + dc.index), dc.datePicker.create().html)
    }

    if (dc.type == "date") dc.datePicker = new BSJS.datePicker({
        onSave: function (params) {
            dc.set(params.value())
            BSJS.functions.replaceElement(dc.datePicker.main.element(), dc.val())
        }, onHide: function () {
            BSJS.functions.replaceElement(dc.datePicker.main.element(), dc.val())
        }
    })

    this.val = function () {
        var vall = 'undefined'
        if (dc && dc.obj && dc.obj[dc.prop]) vall = dc.obj[dc.prop]
        if (dc.twoWay) switch (dc.type) {
            case 'string':
                return '<span id="val_' + dc.index + '" onClick="BSJS.dataConnections[' + dc.index + '].edit()">' + vall + '</span><span><input type="text" onkeypress="return BSJS.dataConnections[' + dc.index + '].evalKey(event)" style="display:none;position:absolute"  id="input_' + dc.index
                    + '" value="' + vall + '"></span>'
            case 'boolean':
                return '<input id="val_' + dc.index + '" type="checkbox" onClick="BSJS.dataConnections[' + dc.index + '].set(val_' + dc.index + '.checked)" >'
            case 'date':
                return '<span  id="val_' + dc.index + '" onClick="BSJS.dataConnections[' + dc.index + '].chooseDate()">' + vall + '</span>'

        } else {

            return vall
        }
    }



    return this
}