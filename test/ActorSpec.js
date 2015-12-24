var assert = require('assert');

var actorjs = require("../");
var ActorSystem = actorjs.ActorSystem;

describe('ActorUtilPath', function () {

    it('actor with no receive function', function () {

        var MyActor = {};
        assert.throws(
            function() {
                var system = new ActorSystem('MySystem');
                system.actorOf(MyActor);
            },
            /Actor has no receive function/
        );


    });

    it('tell simple message', function (done) {

        function MyActor(done) {
            this.receive = function (msg) {
                assert.ok(msg)
                done();
            }
        };

        var system = new ActorSystem('MySystem');
        var myactor = new MyActor(done);
        var actorref = system.actorOf(myactor);

        actorref.tell('foo');

    });

});
