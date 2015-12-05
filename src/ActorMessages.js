var KeyValueMessage = function (key, value) {
    var message = {}
    message[key] = value
    return message;
};


module.exports = {
    KeyValueMessage: KeyValueMessage
};