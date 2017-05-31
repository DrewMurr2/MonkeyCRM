
BSJS.returnDataConnection = function (options) {
    var tipe = jQuery.type(options)
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
    this.marker = function () {
        return '<<' + dc.index + '>>'
    }
    this.val = function () {
        return dc.obj[dc.prop]
    }
    return this
}