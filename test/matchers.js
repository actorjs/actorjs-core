var actorjs = require("../");
var ActorMatchers = actorjs.ActorMatchers;

exports['TypeMatcher'] = function(test) {

    var output = null;

    var receive = {
        typeName: function(data){
            output = data;
        }
    };

    var message = {
        type: "typeName",
        data: {
            hello: "World"
        }
    };

    ActorMatchers.TypeMatcher(receive)(message)

    test.ok(output);
    test.equal(output.hello, 'World');
    test.done();

};