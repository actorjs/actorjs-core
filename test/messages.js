var actorjs = require("../");
var ActorMessages = actorjs.ActorMessages;

exports['TypeMessage'] = function(test) {

    var output = ActorMessages.TypeMessage("typeName", {
        hello: "World"
    });

    test.ok(output);

    test.equal(output.type, 'typeName');
    test.equal(output.data.hello, 'World');

    test.done();

};