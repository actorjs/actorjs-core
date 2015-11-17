var actorjs = require("../");
var ActorMessages = actorjs.ActorMessages;

exports['TypeMessage'] = function(test) {

    var output = ActorMessages.TypeMessage("typeName", {
        hello: "World"
    });

    test.ok(output);
    test.equal(output.hello, 'World');

    test.done();

};