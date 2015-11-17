var Command = function (type, data) {
    return {
        type: type,
        data: data
    }
}

var Event = function (type, data) {
    return {
        type: type,
        data: data
    }
}

module.exports = {
    Command: Command,
    Event: Event
};