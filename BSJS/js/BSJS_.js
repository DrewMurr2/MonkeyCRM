var BSJS = {
    index: 10000,
    newId: function () {
        return 'BSJS' + BSJS.index++
    },
    functions: {},
    objects: [],

    inherit: function (obj, obj2) {
        for (var propertyName in obj2) {
            obj[propertyName] = obj2[propertyName]
        }
        return obj
    },
    init: function () {
        options = { template: '<div {{main.returnHTMLtag}} style="height: 100%;width: 100%;position: absolute;" ></div>' }
        BSJS.inherit(BSJS, new BSJS.obj(options))
        $(document.getElementsByTagName('body')[0]).html(BSJS.create().html)
    }

}  