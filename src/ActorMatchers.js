var KeyValueMatcher = function(matcher){

    return function(message){

        if(!Object.keys(message) && Object.keys(message)[0])
            throw new Error("Connot typeMatch: " + message.type);

        var key = Object.keys(message)[0];
        matcher[key](message[key])
    }

};

module.exports = {
    KeyValueMatcher: KeyValueMatcher
};