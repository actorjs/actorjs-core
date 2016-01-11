var assert = require('assert');

var actorjs = require("../");
var ActorSystem = actorjs.ActorSystem;

describe('ActorSystem', function () {

    function MyActor() {
        this.receive = function(){};
    }

    it('system.actorOf using Function', function () {
        var system = new ActorSystem('MySystem');
        var actorref = system.actorOf(MyActor);

        assert.ok(actorref);
        assert.equal(typeof system, 'object');
    });

    it('system.actorOf has path', function () {
        var system = new ActorSystem('my-sys');
        var actorref = system.actorOf(MyActor);

        assert.ok(actorref);
        assert.ok(actorref.path);
        assert.equal(actorref.path, "actor://my-sys/_1");
    });

    it('two system actors with paths', function () {
        var system = new ActorSystem('my-sys');
        var actorref1 = system.actorOf(MyActor);
        var actorref2 = system.actorOf(MyActor);

        assert.ok(actorref1);
        assert.ok(actorref1.path);
        assert.equal(actorref1.path, "actor://my-sys/_1");

        assert.ok(actorref2);
        assert.ok(actorref2.path);
        assert.equal(actorref2.path, "actor://my-sys/_2");
    });

    it('system.actorOf with name', function () {
        var system = new ActorSystem('my-sys');
        var actorref = system.actorOf(MyActor, 'actor1');

        assert.ok(actorref);
        assert.ok(actorref.path);
        assert.equal(actorref.path, "actor://my-sys/actor1");
    });

    it('system.actorOf using object', function () {
        var system = new ActorSystem('MySystem');
        var myactor = new MyActor();
        var actorref = system.actorOf(myactor);

        assert.ok(actorref);
        assert.equal(typeof system, 'object');

        assert.ok(myactor.context);
        assert.ok(myactor.context.self);
        assert.ok(myactor.context.self === actorref);
    });

    it('system.actorFor top object', function () {
        var system = new ActorSystem('MySystem');
        var myactor = new MyActor();
        var actorref = system.actorOf(myactor, 'top');

        var result = system.actorFor('top');

        assert.ok(result);
        assert.ok(result === actorref);
    });

    it('system.actorFor top object with root', function () {
        var system = new ActorSystem('MySystem');
        var myactor = new MyActor();
        var actorref = system.actorOf(myactor, 'top');

        var result = system.actorFor('/top');

        assert.ok(result);
        assert.ok(result === actorref);
    });

    it('system.actorFor child object', function () {
        var system = new ActorSystem('MySystem');
        var myactor = new MyActor();
        var actorref = system.actorOf(myactor, 'top');
        var childref = myactor.context.actorOf(MyActor, 'child');

        var result = system.actorFor('/top/child');

        assert.ok(result);
        assert.ok(result === childref);
    });

    it('system.actorFor child object using full path', function () {
        var system = new ActorSystem('MySystem');
        var myactor = new MyActor();
        var actorref = system.actorOf(myactor, 'top');
        var childref = myactor.context.actorOf(MyActor, 'child');

        var result = system.actorFor(childref.path);

        assert.ok(result);
        assert.ok(result === childref);
    });

    it('system.actorFor return null for unknown actor', function () {
        var system = new ActorSystem('MySystem');
        var actorref = system.actorFor('unknown');
        assert.equal(actorref, null);
    });
});


