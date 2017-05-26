var BSJS2 = {
    index: 10000,
    newId: function () {
        return 'BSJS' + BSJS2.index++
    },
    functions: {},
    objects: [],
    nav: {
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
            var thisBar = BSJS2.inherit(this, new BSJS2.element(options))


            return this
        }
        , dropDownGroup: function (options) {
            if (!options) options = {}
            if (options.title) this.optionalTitle = options.title
            else this.optionalTitle = ''
            this.main = new thisBSJS.tag()
            this.title = new thisBSJS.tag()
            this.body = new thisBSJS.tag()
            this.create = function () {
                return '\
        <li  ' + this.main.returnHTMLtag() + ' class="dropdown">\
          <a  ' + this.title.returnHTMLtag() + '  class="dropdown-toggle" data-toggle="dropdown" href="#">' + this.optionalTitle + '<span class="caret"></span></a>\
          <ul  ' + this.body.returnHTMLtag() + ' class="dropdown-menu">\
          </ul>\
        </li>'
            }
            if (options.addTo) options.addTo.add(this)
        }
        , dropDownItem: function (options) {
            this.body = new thisBSJS.tag()
            if (!options) options = {}
            if (options.title) this.optionalTitle = options.title
            else this.optionalTitle = ''
            if (options.onClick) this.body.setonClick(options.onClick)
            this.create = function () {
                return '\
  <li ' + this.body.returnHTMLtag() + '><a href="#">' + this.optionalTitle + '</a></li>'
            }
            if (options.addTo) options.addTo.add(this)
        }
    }
    ,
    panel: function (options) {
        if (!options) options = {}
        options.template = '\
<div {{main.returnHTMLtag}} class="panel panel-default" >\
  <div {{heading.returnHTMLtag}} class="panel-heading">Panel Heading</div>\
    <div {{body.returnHTMLtag}} class="panel-body" ></div >\
    <div {{footer.returnHTMLtag}} class="panel-footer">Panel Footer</div>\
</div >\
'
        var thisPanel = BSJS2.inherit(this, new BSJS2.element(options))

        this.primary = function () {
            thisPanel.tags.main.element().className = 'panel panel-default'
        }
        this.danger = function () {
            thisPanel.tags.main.element().className = 'panel panel-danger'
        }
        return this
    },

    tag: function (options) {
        if (!options) options = {}
        var thisTag = this
        this.id = BSJS2.newId()
        this.element = function () {
            return document.getElementById(thisTag.id)
        }
        this.jQ = function () {
            return $(document.getElementById(thisTag.id))
        }
        this.clear = function () {
            thisTag.jQ().html('')
        }
        this.hide = function () {
            thisTag.jQ().hide()
        }
        this.show = function () {
            thisTag.jQ().show()
        }
        this.set = function (str) {
            thisTag.jQ().html(str)
        }
        this.setonClick = function (fnc) {
            BSJS2.functions[thisTag.id] = fnc
        }
        this.get = function () {
            return thisTag.jQ.html()
        }
        this.render = function () {
            thisTag.addAll(thisTag.contents)
        }
        this.contents = options.contents || []
        this.add = function (obj) {
            var itemindex = thisTag.contents.indexOf(obj);
            if (itemindex > -1) thisTag.contents.splice(itemindex, 1);
            thisTag.contents.push(obj)
            if (thisTag.element()) { //If this tag doesn't exists it just stores the item in the contents array
                var crt = obj.create()
                if (crt.html) {
                    thisTag.jQ().append(crt.html)
                    if (crt.callback) crt.callback()
                } else {
                    thisTag.jQ().append(crt)
                }
            }
        }
        this.addAll = function (arr) {
            arr.forEach(function (obj) {
                thisTag.add(obj)
            })
        }
        this.returnHTMLtag = function () {
            return 'id="' + thisTag.id + '" onClick="' + BSJS2.name + '.functions[' + "'" + thisTag.id + "'" + ']()"'
        }
        this.setonClick(function () { })
        return this
    },

    element: function (options) {

        var thisBSJSelement = this
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
        this.tagsArr.forEach(function (t) { //This actually creates the tag objects
            if (t.unique) {
                var nTag = new BSJS2.tag(options[t[0]]) //create tag
                thisBSJSelement.tags.push(nTag) //push to tags array
                thisBSJSelement.tags[t[0]] = nTag //creates as a property of the tags object
            }
        })
        this.create = function () {
            if (thisBSJSelement.tags.main.element()) thisBSJSelement.tags.main.jQ().remove()
            return {
                html: function () {
                    var htm = thisBSJSelement.template
                    thisBSJSelement.tagsArr.forEach(function (tA) {
                        var thisThing = thisBSJSelement.tags[tA[0]][tA[1]]
                        console.log('thisThing', thisThing)
                        console.log('tA', tA)
                        var replacement = function () { if (jQuery.type(thisThing) === "function") { return thisThing() } else { return thisThing } }()
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
    },

    inherit: function (obj, obj2) {
        for (var propertyName in obj2) {
            obj[propertyName] = obj2[propertyName]
        }
        return obj
    }


}