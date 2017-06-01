BSJS.timers = {
    refreshDataConnections: setInterval(function () {
        BSJS.objectsWithDataConnection.forEach(function (ob) {
            if (ob.hasChanged()) ob.refresh()
        })
    }, 100)
}
