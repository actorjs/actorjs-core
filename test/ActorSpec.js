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

    it('this actor in matcher', function (done) {

        var message = actorjs.ActorMessages.KeyValueMessage
        var matcher = actorjs.ActorMatchers.KeyValueMatcher

        function Actor(){

            this.hello = "Hello World!"

            this.receive = matcher({
                test: function(msg){
                    assert.equal("Hello World!", this.hello)
                    done()
                }
            })
        };

        var actorSystem = new ActorSystem("ActorSystem");
        var actorRef = actorSystem.actorOf(Actor, "Actor");

        actorRef.tell(message("test","Test"));


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

    it('should become in a different state when calling "context.become()"', function (done) {

        function MyActor() {

            var state1 = function(msg){
                assert.equal("state1", msg);
                this.context.become(state2);
            }
            var state2 = function(msg){
                assert.equal("state2", msg);
                done();
            }
            this.receive = state1
        };

        var system = new ActorSystem('MySystem');
        var actorref = system.actorOf(MyActor);

        actorref.tell('state1');
        actorref.tell('state2');

    });

});
