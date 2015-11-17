var actorjs = require("../");
var ActorSystem = actorjs.ActorSystem;

exports['create system'] = function(test) {
    var system = new ActorSystem('MySystem');
    
    test.ok(system);
    test.equal(typeof system, 'object');
    test.done();
}
