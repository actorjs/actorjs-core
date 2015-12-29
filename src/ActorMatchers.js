var KeyValueMatcher = function(matcher){

    return function(message){

        if(!Object.keys(message) && Object.keys(message)[0])
            throw new Error("Cannot typeMatch: " + message.type);

        var key = Object.keys(message)[0];

        if(!matcher[key])
            throw new Error("No object for key: " + key + " in actor: " + this.context.self.path);

        matcher[key].call(this, message[key]);
    }

};

module.exports = {
    KeyValueMatcher: KeyValueMatcher
};