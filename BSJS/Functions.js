var Functions = {
    orderTasks: function (parent) {
        for (i = 1; i < parent.hiddenProperties.tasks.length; i++) {
            for (j = i; j > 0 && parent.hiddenProperties.tasks[j].date > parent.hiddenProperties.tasks[j - 1].date; j--) {
                parent.hiddenProperties.tasks.splice(j - 1, 2, parent.hiddenProperties.tasks[j], parent.hiddenProperties.tasks[j - 1]);
            }
        }
    }
    , orderNotes: function (parent) {
        for (i = 1; i < parent.hiddenProperties.notes.length; i++) {
            for (j = i; j > 0 && parent.hiddenProperties.notes[j].date > parent.hiddenProperties.notes[j - 1].date; j--) {
                parent.hiddenProperties.notes.splice(j - 1, 2, parent.hiddenProperties.notes[j], parent.hiddenProperties.notes[j - 1]);
            }
        }
    }
}

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
    if (jQuery.type(find) === "string") find = [find]
    find.forEach(function (f) {
        str = str.replace(new RegExp(escapeRegExp(f), 'g'), replace)
    })

    return str;
}

function isString(myVar) {
    return (typeof myVar === 'string' || myVar instanceof String) || false
}

function daysBetween(one, another) {
    return Math.round(Math.abs((+one) - (+another)) / 8.64e7);
}