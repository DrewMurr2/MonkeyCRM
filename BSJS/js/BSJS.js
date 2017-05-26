var BSJS = function (name) {
    this.name = name
    var thisBSJS = this
    this.index = 0
    this.newId = function () {
        return 'BSJS' + thisBSJS.index++
    }
    this.functions = {}
    this.objects = []
    this.nav = {
        bar: function (options) {
            if (!options) options = {}
            if (options.title) this.optionalTitle = options.title
            else this.optionalTitle = ''
            var thisBar = this
            this.main = new thisBSJS.tag()
            this.title = new thisBSJS.tag()
            this.body = new thisBSJS.tag()
            this.left = new thisBSJS.tag()
            this.right = new thisBSJS.tag()
            this.create = function () {
                return '\
<nav id="' + this.main.id + '" class="navbar navbar-inverse">\
  <div class="container-fluid">\
    <div class="navbar-header">\
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#' + this.body.id + '">\
        <span class="icon-bar"></span>\
        <span class="icon-bar"></span>\
        <span class="icon-bar"></span>\
      </button>\
      <a  ' + this.title.returnHTMLtag() + ' class="navbar-brand" href="#">' + this.optionalTitle + '</a>\
    </div>\
    <div class="collapse navbar-collapse" ' + this.body.returnHTMLtag() + '>\
        <ul ' + this.left.returnHTMLtag() + ' class="nav navbar-nav">\
        </ul>\
        <ul ' + this.right.returnHTMLtag() + '  class="nav navbar-nav navbar-right">\
        </ul>\
    </div>\
  </div>\
</nav>'
            }
            if (options.addTo) options.addTo.add(this)
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
    this.modal = function (options) {
        var thisModal = this
        if (!options) options = {}
        if (options.title) this.optionalTitle = options.title
        else this.optionalTitle = ''
        this.main = new thisBSJS.tag()
        this.header = new thisBSJS.tag()
        this.body = new thisBSJS.tag()
        this.footer = new thisBSJS.tag()
        this.create = function () {
            return '\
<div id="' + thisModal.main.id + '" class="modal fade" role="dialog">\
  <div class="modal-dialog">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal">&times;</button>\
        <div  ' + thisModal.header.returnHTMLtag() + ' >\
            <h4 class="modal-title">' + thisModal.optionalTitle + '</h4>\
        </div>\
      </div>\
      <div ' + thisModal.body.returnHTMLtag() + ' class="modal-body">\
      </div>\
      <div  ' + thisModal.footer.returnHTMLtag() + ' class="modal-footer">\
      </div>\
    </div>\
  </div>\
</div>'
        }
        this.show = function () {
            thisModal.main.jQ().modal('show')
        }
        this.hide = function () {
            thisModal.main.jQ().modal('hide')
        }
        this.toggle = function () {
            thisModal.main.jQ().modal('toggle')
        }
        if (options.addTo) options.addTo.add(this)
        return this
    }
    this.button = function (options) {
        if (!options) options = {}
        if (options.title) this.optionalTitle = options.title
        else this.optionalTitle = ''
        var thisButton = this
        this.main = new thisBSJS.tag()
        if (options.onClick) this.main.setonClick(options.onClick)
        this.create = function () {
            return '\
<button ' + thisButton.main.returnHTMLtag() + ' type="button" class="btn">' + thisButton.optionalTitle + '</button>'
        }
        if (options.addTo) options.addTo.add(this)
        return this
    }
    this.panel = function (options) {
        var thisPanel = this
        if (!options) options = {}
        if (options.title) this.optionalTitle = options.title
        else this.optionalTitle = ''
        this.main = new thisBSJS.tag()
        this.heading = new thisBSJS.tag()
        this.body = new thisBSJS.tag()
        this.primary = function () {
            thisPanel.main.element().className = 'panel panel-default'
        }
        this.danger = function () {
            thisPanel.main.element().className = 'panel panel-danger'
        }
        this.create = function () {
            return '\
<div ' + thisPanel.main.returnHTMLtag() + ' class="panel panel-default">\
  <div ' + thisPanel.heading.returnHTMLtag() + ' class="panel-heading">' + thisPanel.optionalTitle + '</div>\
  <div ' + thisPanel.body.returnHTMLtag() + ' class="panel-body"></div>\
</div>'
        }
        if (options.addTo) options.addTo.add(this)
        return this
    }
    this.tag = function () {
        var thisTag = this
        this.id = thisBSJS.newId()
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
            thisBSJS.functions[thisTag.id] = fnc
        }
        this.get = function () {
            return thisTag.jQ.html()
        }
        this.add = function (obj) {
            var crt = obj.create()
            if (crt.html) {
                console.log('this.add')
                thisTag.jQ().append(crt.html)
                if (crt.callback) crt.callback()
            } else {
                console.log('No html')
                thisTag.jQ().append(crt)
            }
        }
        this.addAll = function (arr) {
            arr.forEach(function (obj) {
                thisTag.jQ().append(obj.create())
            })
        }
        this.returnHTMLtag = function () {
            return 'id="' + thisTag.id + '" onClick="' + thisBSJS.name + '.functions[' + "'" + thisTag.id + "'" + ']()"'
        }
        this.setonClick(function () { })
        return this
    }
    this.iframe = function (options) {
        if (!options) options = {}
        if (options.source) this.optionalSource = options.source
        else this.optionalSource = ''
        var thisiframe = this
        this.main = new thisBSJS.tag()
        this.name = 'iframe_' + this.main.id
        this.vars = function () { return document.getElementById(thisiframe.main.id).contentWindow }
        this.create = function () {
            return '<iframe id="' + thisiframe.main.id + '" height="100%" width="100%" src="' + thisiframe.optionalSource + '" width name="' + thisiframe.name + '"></iframe>'
        }
        this.setSource = function (src) {
            thisiframe.main.jQ().attr('src', src)
        }
        if (options.addTo) options.addTo.add(this)
        return this
    }
    this.addObject = function (obj) {
        obj.objectIndex = thisBSJS.objects.length
        thisBSJS.objects[obj.objectIndex] = obj
    }
    this.table = function (options) {
        var thisTable = this
        thisTable.itemIndex = 0
        thisBSJS.addObject(this)
        if (!options) options = {}
        if (options.data) this.data = options.data
        else this.data = [{ column1: [0, 1, 2] }, { column2: [3, 4, 5, 9] }, { column3: [6, 7, 8] }]

        this.main = new thisBSJS.tag()
        this.create = function () {
            return '\
<div id="' + thisTable.main.id + '" class="table-responsive">' + thisTable.createInside() + '\
  </div>'
        }

        this.editItem = function (objIndex, itemIndx, colname, rowNum) {
            if (document.getElementById('obj_' + objIndex + '_edit_' + itemIndx).style.display == "none") {
                $(document.getElementById('obj_' + objIndex + '_edit_' + itemIndx)).show()
                $(document.getElementById('obj_' + objIndex + '_td_' + itemIndx)).hide()
                setTimeout(function () {
                    window.onclick = function (event) {
                        if (event.target != document.getElementById('obj_' + objIndex + '_edit_' + itemIndx)) {
                            thisTable.saveItem(colname, rowNum, document.getElementById('obj_' + objIndex + '_edit_' + itemIndx).value)
                        }
                    }
                }, 100)
            }
        }
        this.saveItem = function (colname, rowNum, val) {
            var exampleData = thisTable.returnExampleData(thisTable)
            switch (exampleData) {
                case "{column1: [1,2,3], column2: [3,4,5]}":

                case "[{column1 : [1,2,3]},{column2: [3,4,5]}]":
                    thisTable.data.forEach(function (colN) { if (colN[colname]) colN[colname][rowNum] = val })
                    thisTable.refresh()
                case "[{column1:1,column2:3},{column1:2,column2:4},{column1:3,column2:5}]":

                    console.log(colname, rowNum, val)
            }
            window.onclick = undefined
        }
        this.returnExampleData = function (t) {
            if (jQuery.type(t.data) === "object") return "{column1: [1,2,3], column2: [3,4,5]}" //This is for this structure {column1: [1,2,3], column2: [3,4,5]}
            else if (jQuery.type(t.data[0][Object.keys(t.data[0])[0]]) === "array") return "[{column1 : [1,2,3]},{column2: [3,4,5]}]" //This is for this structure [{column1 : [1,2,3]},{column2: [3,4,5]}] 
            else return "[{column1:1,column2:3},{column1:2,column2:4},{column1:3,column2:5}]" //This is for this structure [{column1:1,column2:3},{column1:2,column2:4},{column1:3,column2:5}]  
        }
        this.createInside = function () {
            var exampleData = thisTable.returnExampleData(thisTable)


            return '\
<table class="table">\
    <thead>\
      <tr>' + function (data) {
                    var addColumn = function (index, name) {
                        return '<th colnum="' + index + '" col="' + name + '">' + name + '</th>'
                    }
                    var str = ''
                    switch (exampleData) {
                        case "{column1: [1,2,3], column2: [3,4,5]}":

                        case "[{column1 : [1,2,3]},{column2: [3,4,5]}]":
                            data.forEach(function (colobj) { str += addColumn(data.indexOf(colobj), Object.keys(colobj)[0]) })
                        case "[{column1:1,column2:3},{column1:2,column2:4},{column1:3,column2:5}]":

                    }
                    return str
                }(thisTable.data) + '\
      </tr>\
    </thead>\
    <tbody>' + function (data) {
                    var addRowItem = function (item, colname, rownum) {
                        if (item !== 0 && !item) item = ''
                        return '<td onClick="' + thisBSJS.name + '.objects[' + thisTable.objectIndex + '].editItem(' + thisTable.objectIndex + ',' + ++thisTable.itemIndex + ",'" + colname + "'," + rownum + ')"><span id="obj_' + thisTable.objectIndex + '_td_' + thisTable.itemIndex + '">' + item + '</span><span><input type="text" style="display:none;position:absolute"  id="obj_' + thisTable.objectIndex + '_edit_' + thisTable.itemIndex + '" value="' + item + '"></span></td>'
                    }
                    var str = ''
                    switch (exampleData) {
                        case "{column1: [1,2,3], column2: [3,4,5]}":

                        case "[{column1 : [1,2,3]},{column2: [3,4,5]}]":
                            var maxRows = 0
                            data.forEach(function (colobj) { if (colobj[Object.keys(colobj)[0]].length > maxRows) maxRows = colobj[Object.keys(colobj)[0]].length })
                            for (i = 0; i < maxRows; i++) {
                                str += '<tr>'
                                data.forEach(function (colobj) { str += addRowItem(colobj[Object.keys(colobj)[0]][i], Object.keys(colobj)[0], i) })
                                str += '</tr>'
                            }

                        case "[{column1:1,column2:3},{column1:2,column2:4},{column1:3,column2:5}]":

                    }

                    return str
                }(thisTable.data) + '\
    </tbody>\
  </table>'
        }
        this.refresh = function () {
            thisTable.main.clear()
            thisTable.main.set(this.createInside())
        }
        if (options.addTo) options.addTo.add(this)
        return this
    }
    this.create = function () {
        thisBSJS.body = new thisBSJS.tag()
        $(document.getElementsByTagName('body')[0]).html('<div id ="' + thisBSJS.body.id + '" style="height: 100%;width: 100%;position: absolute;" ></div>')
    }
    this.create()
    return this
}