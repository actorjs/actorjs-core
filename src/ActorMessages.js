var KeyValueMessage = function (key, value) {
    var message = {};
    if (!value) value = null;
    message[key] = value;
    return message;
};


module.exports = {
    KeyValueMessage: KeyValueMessage
};