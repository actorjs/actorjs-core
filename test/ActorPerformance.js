var assert = require('assert');

var actorjs = require("../");
var ActorSystem = actorjs.ActorSystem;

describe('ActorPerformance', function () {

    it('300.000 actors', function (done) {

        var system = new ActorSystem('MySystem');

        function MyActor () {
            this.receive = function(msg){
                console.log(msg)
            }
        }

        var refs = {}

        start = Date.now();

        for(var i = 0;i<100000;i++){
            refs[i] =  system.actorOf(MyActor);
        }

        var duration = Date.now() - start;

        assert.ok(duration < 500);

        done();

    });

});
