var BSJS = {
    Parent: {
        ElementID: "accordion"
        , HTMLelmnt: function () {
            return document.getElementById(BSJS.Parent.ElementID)
        }
        , JQElement: function () {
            return $(BSJS.Parent.HTMLelmnt())
        }
    }
    , BSID: 0
    , nextObjectID: function () {
        return 'BootStrapObj' + BSJS.BSID++
    }
    , Modal: function (options) {
        if (!options) options = {}
        this.ElementID = BSJS.nextObjectID()
        this.HTMLelmnt = function () {
            return document.getElementById(Mdl.ElementID)
        }
        this.JQElement = function () {
            return $(Mdl.HTMLelmnt())
        }
        this.Parent = options.Parent || BSJS.Parent
        this.HeaderID = BSJS.nextObjectID()
        this.FooterID = BSJS.nextObjectID()
        this.BodyID = BSJS.nextObjectID()
        this.Body = options.Body || "Body"
        this.Header = options.Header || "Modal"
        this.Footer = options.Footer || ""
        var Mdl = this
        this.create = function () {
            Mdl.JQElement().remove()
            Mdl.Parent.JQElement().append('<div class="modal fade" id="' + Mdl.ElementID + '" role="dialog">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal">&times;</button>\
                        <h4 id="' + Mdl.HeaderID + '" class="modal-title">' + Mdl.Header + '</h4> </div>\
                    <div id="' + Mdl.BodyID + '" class="modal-body">\
                        ' + Mdl.Body + '\
                    </div>\
                    <div id="' + Mdl.FooterID + '" class="modal-footer">\
                        ' + Mdl.Footer + '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                    </div>\
                </div>\
            </div>')
        }
        this.create()
        this.setHeader = function (head) {
            this.Header = head
            $(document.getElementById(this.HeaderID)).html(head)
        }
        this.setBody = function (bod) {
            this.Body = bod
            $(document.getElementById(this.BodyID)).html(bod)
        }
        this.setFooter = function (ft) {
            this.Footer = ft
            $(document.getElementById(this.FooterID)).html(ft)
        }
        this.show = function () {
            this.JQElement().modal()
        }
    }
}