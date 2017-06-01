BSJS.functions.replaceAll = function (str, find, replace) {
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    if (jQuery.type(find) === "string") find = [find]
    find.forEach(function (f) {
        str = str.replace(new RegExp(escapeRegExp(f), 'g'), replace)
    })

    return str;
}

BSJS.functions.removeEmpty = function (arr) {
    for (i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == '') arr.splice(i, 1)
    }
    return arr
}


BSJS.functions.returnObj = function (dataArr) {
    var newVar = window
    for (i = 0; i < dataArr.length; i++) {
        if (newVar[dataArr[i]]) newVar = newVar[dataArr[i]]
        else {
            return undefined
            i = newVar.length + 10
        }
    }
    return newVar
}

BSJS.functions.replaceElement = function refresh(domEl, html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    var a = domEl.parentNode.replaceChild(template.content.firstChild, domEl);
}

BSJS.functions.htmlToElement = function (html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}
