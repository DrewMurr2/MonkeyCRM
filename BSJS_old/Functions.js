
function ParseJSON(str) {
    var newStr = replaceAll(replaceAll(str, '"{', '{'), '}"', '}')
    return JSON.parse(newStr)
}

function StringJSON(obj) {
    var str = JSON.stringify(obj)
    return replaceAll(str, "&", "AND")
}

function replaceAll(str, find, replace) {
    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function isString(myVar) {
    return (typeof myVar === 'string' || myVar instanceof String) || false
}


function daysBetween(one, another) {
    return Math.round(Math.abs((+one) - (+another)) / 8.64e7);
}
