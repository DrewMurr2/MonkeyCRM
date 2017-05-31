BSJS.grid = function (options) {
    if (!options) options = {}
    options.template = '<div id="{{main.id}}" class="container" style="width:100%"></div>'
    var thisGrid = BSJS.inherit(this, new BSJS.obj(options))
    this.rows = this.main.contents
    this.column = function (options) {
        var thisColumn = this
        if (jQuery.type(options) === "number") {
            thisColumn.options = {
                width: options
            }
        }
        else {
            thisColumn.options = options
        }
        if (!thisColumn.options) thisColumn.options = {}
        if (!thisColumn.options.type) thisColumn.options.type = 'sm'
        thisColumn.options.template = '<div id="{{main.id}}" class="col-' + thisColumn.options.type + '-' + thisColumn.options.width + '"></div>'
        var thisColumn = BSJS.inherit(thisColumn, new BSJS.obj(thisColumn.options))
    }
    this.row = function (options) {
        if (!options) options = {}
        options.template = '<div id="{{main.id}}" class="row"></div>'
        var thisRow = BSJS.inherit(this, new BSJS.obj(options))
        this.columns = this.main.contents
        if (options.columns) {
            options.columns.forEach(function (c) {
                thisRow.main.add(new thisGrid.column(c))
            })
        }
    }
    if (options.rows) {
        options.rows.forEach(function (r) {
            thisGrid.main.add(new thisGrid.row(r))
        })
    }
    return this
}