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
    var newStr = BSJS.functions.replaceAll(BSJS.functions.replaceAll(str, '"{', '{'), '}"', '}')
    return JSON.parse(newStr)
}

function StringJSON(obj) {
    var str = JSON.stringify(obj)
    return BSJS.functions.replaceAll(str, "&", "AND")
}



function isString(myVar) {
    return (typeof myVar === 'string' || myVar instanceof String) || false
}

function daysBetween(one, another) {
    return Math.round(Math.abs((+one) - (+another)) / 8.64e7);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


var xmL = '<?xml version="1.0" encoding="UTF-8"?>\
    < entity - mappings\
xmlns = "http://java.sun.com/xml/ns/persistence/orm"\
xmlns: xsi = "http://www.w3.org/2001/XMLSchema-instance"\
xsi: schemaLocation = "http://java.sun.com/xml/ns/persistence/orm http://java.sun.com/xml/ns/persistence/orm_2_0.xsd"\
version = "2.0" >\
    <persistence-unit-metadata>\
        <persistence-unit-defaults>\
            <schema>DBA</schema>\
            <catalog>needles</catalog>\
        </persistence-unit-defaults>\
    </persistence-unit-metadata>\
    <package>com.legalmonkeys.sputnik.data</package>\
    <entity class="NRecord" access="FIELD">\
        <table name="user_tab2_data" />\
        <attribute-override name="cancelled">\
            <column name="Cancel" />\
        </attribute-override>\
        <attribute-override name="cancelledReason">\
            <column name="Reason_Cancelled" />\
        </attribute-override>\
        <attribute-override name="requestedBy">\
            <column name="Ordered_By" />\
        </attribute-override>\
        <attributes>\
            <transient name="orderAffidavit" />\
            <transient name="receivedNoAffidavitDate" />\
            <transient name="receivedAffidavitDate" />\
            <transient name="requestedAffidavitDate" />\
        </attributes>\
    </entity>\
    <entity class="NRecordProvider" access="FIELD">\
        <table name="user_tab2_name" />\
    </entity>\
    <entity class="NCase" access="FIELD">\
        <attribute-override name="updatedDate">\
            <column name="last_modified" />\
        </attribute-override>\
        <attributes>\
            <transient name="firstAlternateCaseManager" />\
        </attributes>\
    </entity>\
    <entity class="NName" access="FIELD">\
        <attribute-override name="updatedDate">\
            <column name="last_modified" />\
        </attribute-override>\
        <attributes>\
            <transient name="race" />\
        </attributes>\
    </entity>\
</entity - mappings >'