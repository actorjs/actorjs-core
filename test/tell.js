var actorjs = require("../");
var ActorSystem = actorjs.ActorSystem;

exports['tell simple message'] = function(test) {
    function done(msg, sender) {
        test.ok(msg, 'foo');
        test.done();
    }
    
    var system = new ActorSystem('MySystem');
    var myactor = new MyActor(done);
    var actorref = system.actorOf(myactor);
    
    test.expect(1);
    
    actorref.tell('foo');    
}

function MyActor(done) {
    this.receive = function (msg) {
        done(msg);
    }
}
