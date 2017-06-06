BSJS.nav = {
    bar: function (options) {
        if (!options) options = {}
        options.template = '\
<nav {{main.returnHTMLtag}} class="navbar navbar-inverse">\
  <div class="container-fluid">\
    <div class="navbar-header">\
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#{{body.id}}">\
        <span class="icon-bar"></span>\
        <span class="icon-bar"></span>\
        <span class="icon-bar"></span>\
      </button>\
      <a  {{title.returnHTMLtag}} class="navbar-brand" href="#"></a>\
    </div>\
    <div class="collapse navbar-collapse" {{body.returnHTMLtag}}>\
        <ul {{left.returnHTMLtag}} class="nav navbar-nav">\
        </ul>\
        <ul {{right.returnHTMLtag}}  class="nav navbar-nav navbar-right">\
        </ul>\
    </div>\
  </div>\
</nav>'
        var thisBar = BSJS.inherit(this, new BSJS.obj(options))
        return this
    }
    , dropDownGroup: function (options) {
        if (!options) options = {}
        options.template = '\
           <li  {{main.returnHTMLtag}} class="dropdown">\
          <a   {{title.returnHTMLtag}} class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="caret"></span></a>\
          <ul  {{body.returnHTMLtag}}  class="dropdown-menu">\
          </ul>\
        </li>\
'
        var thisDropDownGroup = BSJS.inherit(this, new BSJS.obj(options))
        return this
    }
    , dropDownItem: function (options) {
        if (!options) options = {}
        options.template = ' <li {{main.returnHTMLtag}}><a {{body.returnHTMLtag}} href="#"></a></li>'
        var thisDropDownItem = BSJS.inherit(this, new BSJS.obj(options))
        return this
    }
}
BSJS.panel = function (options) {
    if (!options) options = {}
    options.template = '\
<div {{main.returnHTMLtag}} class="panel panel-default" >\
  <div {{heading.returnHTMLtag}} class="panel-heading"></div>\
    <div {{body.returnHTMLtag}} class="panel-body" ></div >\
    <div {{footer.returnHTMLtag}} class="panel-footer"></div>\
</div >\
'
    var thisPanel = BSJS.inherit(this, new BSJS.obj(options))
    this.primary = function () {
        thisPanel.tags.main.element().className = 'panel panel-default'
    }
    this.danger = function () {
        thisPanel.tags.main.element().className = 'panel panel-danger'
    }
    return this
}
BSJS.span = function (options) {
    if (!options || jQuery.type(options) === "string") {
        options = {
            text: options
        }
    }
    else {
        options.text = ''
    }
    options.template = '<span {{main.returnHTMLtag}}>' + options.text + '</span>'
    var thisPanel = BSJS.inherit(this, new BSJS.obj(options))
    return this
}
BSJS.datePicker = function (options) {
    var thisdatePicker = this
    if (!options) options = {}
    this.options = options
    this.options.hideCal = {
        onClick: thisdatePicker.options.onHide || function () {
            thisdatePicker.main.hide()
        }
    }
    this.options.saveDate = {
        onClick: thisdatePicker.options.onSave
        , params: {
            value: function () {
                return thisdatePicker.calendar.element().value
            }
        }
    }
    this.options.template = '\
<div id="{{main.id}}" style="float:left;position:absolute">\
    <input type="date" style="color:black" id="{{calendar.id}}" >\
    <div style="background-color:grey" >\
        <span {{hideCal.returnHTMLtag}} style="background-color:grey" >cancel</span>\
        <span  {{saveDate.returnHTMLtag}} style="background-color:grey;float:right" >save</span>\
    </div >\
</div>'
    var thisdatePicker = BSJS.inherit(this, new BSJS.obj(this.options))
    return this
}

BSJS.progressbar = function (options) { }


BSJS.objectWorker = function (options) {
    this.obj = options.obj
    options.heading = '<h1>' + (options.name ? options.name : 'Object') + '</h1>'
    options.template = '\
<div {{main.returnHTMLtag}} class="panel panel-default" >\
  <div {{heading.returnHTMLtag}} class="panel-heading"></div>\
    <div {{body.returnHTMLtag}} class="panel-body" ></div >\
</div >\
'
    options.body = []

    function decipher(obj) {
        for (var propertyName in obj) {
            var tipe = jQuery.type(obj[propertyName])
            switch (tipe) {
                case 'object':
                    options.body.push(new BSJS.objectWorker({ obj: obj[propertyName], name: propertyName }))
                    break;
                case 'string':
                    options.body.push(new BSJS.stringProperty({ property: obj[propertyName], name: propertyName }))
                    break;
                case 'date':
                    options.body.push(new BSJS.dateProperty({ property: obj[propertyName], name: propertyName }))
                    break;
                case 'array':
                    options.body.push(new BSJS.arrayProperty({ property: obj[propertyName], name: propertyName }))
                    break;
                case 'boolean':
                    options.body.push(new BSJS.booleanProperty({ property: obj[propertyName], name: propertyName }))
                    break;
            }
        }
    } (this.obj)

    var thisObjectWorker = BSJS.inherit(this, new BSJS.obj(options))

    return this

}

BSJS.arrayProperty = function (options) {
    this.arr = options.property
    options.heading = '<h1>' + (options.name ? options.name : 'Array') + '</h1>'
    options.template = '\
<div {{main.returnHTMLtag}} class="panel panel-default" >\
  <div {{heading.returnHTMLtag}} class="panel-heading"></div>\
    <div {{body.returnHTMLtag}} class="panel-body" ></div >\
</div >\
'
    options.body = []


    this.arr.forEach(function (a) {
        var tipe = jQuery.type(a)
        switch (tipe) {
            case 'object':
                options.body.push(new BSJS.objectWorker({ obj: a }))
                break;
            case 'string':
                options.body.push(new BSJS.stringProperty({ property: a }))
                break;
            case 'date':
                options.body.push(new BSJS.dateProperty({ property: a }))
                break;
            case 'array':
                options.body.push(new BSJS.arrayProperty({ property: a }))
                break;
            case 'boolean':
                options.body.push(new BSJS.booleanProperty({ property: a }))
                break;
        }
    })
    var thisObjectWorker = BSJS.inherit(this, new BSJS.obj(options))

    return this
}


BSJS.stringProperty = function (options) {
    this.str = options.property
    options.name = (options.name || 'String')
    options.template = '\
    <span>'+ options.name + ':</span><span {{body.returnHTMLtag}}></span>'
    options.body = new BSJS.dataConnection({ obj: '', prop: '', twoWay: true })

    var thisObjectWorker = BSJS.inherit(this, new BSJS.obj(options))

    return this
}
