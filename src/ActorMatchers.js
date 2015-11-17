var TypeMatcher = function(receive){

    return function(message){
        if(!receive[message.type]) throw new Error("Connot typeMatch: " + message.type);
        receive[message.type](message.data)
    }

};

module.exports = {
    TypeMatcher: TypeMatcher
};