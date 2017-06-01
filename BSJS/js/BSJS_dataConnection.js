
BSJS.returnDataConnection = function (options) {
    var tipe = jQuery.type(options)
    if ($.isNumeric(options)) tipe = 'number'
    switch (tipe) {
        case "object":
            return new BSJS.dataConnection(options)

            break;
        case "string":
            var Arrr = BSJS.functions.removeEmpty(BSJS.functions.replaceAll(options, ['[', ']'], '.').split("."))
            var options = {}
            options.prop = Arrr.splice(-1, 1)[0]
            options.obj = BSJS.functions.returnObj(Arrr)
            return new BSJS.dataConnection(options)

            break;
        case "number":
            return BSJS.dataConnections[options]
            break;
    }
}


BSJS.dataConnection = function (options) {
    var dc = this
    dc.index = BSJS.dataConnections.length
    BSJS.dataConnections[BSJS.dataConnections.length] = dc
    dc.obj = options.obj
    dc.prop = options.prop
    dc.twoWay = false
    this.marker = function () {
        return '<<' + (dc.twoWay ? ':' : '') + dc.index + '>>'
    }
    this.prevVal = ''
    this.setPrevVal = function () {
        dc.prevVal = dc.val().toString()
        return true
    }

    this.hasChanged = function () {
        if (dc.prevVal == dc.val()) return false
        else return dc.setPrevVal()
    }

    this.val = function () {
        var vall = 'undefined'
        if (dc && dc.obj && dc.obj[dc.prop]) vall = dc.obj[dc.prop]
        return vall
    }
    return this
}