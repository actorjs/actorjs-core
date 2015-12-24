var assert = require('assert');

var actorjs = require("../");
var ActorSystem = actorjs.ActorSystem;

describe('ActorContext', function () {

    function MyActor() {
        this.receive = function(){};
    }

    it('context in actor', function () {
        var system = new ActorSystem('MySystem');
        var myactor = new MyActor();
        var ref = system.actorOf(myactor);

        assert.ok(myactor.context);
        assert.ok(myactor.context.self);
        assert.ok(myactor.context.self === ref);
    });

    it('context.actorOf', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor);
        var myactor2 = new MyActor();

        var actorref = myactor.context.actorOf(myactor2);
        assert.ok(actorref);
        assert.ok(myactor2);
        assert.ok(myactor2.context);
        assert.ok(myactor2.context.self);
        assert.ok(myactor2.context.self === actorref);
        assert.ok(myactor2.context.parent);
        assert.ok(myactor2.context.parent === ref);
    });

    it('actor created with context has path', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var myactor2 = new MyActor();

        var actorref = myactor.context.actorOf(myactor2, 'mychild');
        assert.ok(actorref);
        assert.ok(actorref.path);
        assert.equal(actorref.path, 'actor://MySystem/myactor/mychild');
    });

    it('actor has child', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var myactor2 = new MyActor();

        var childref = myactor.context.actorOf(myactor2, 'mychild');
        assert.ok(myactor.context.children);
        assert.ok(myactor.context.children.mychild);
        assert.ok(myactor.context.children.mychild === childref);
    });

    it('actorFor child using full path', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var myactor2 = new MyActor();

        var childref = myactor.context.actorOf(myactor2, 'mychild');
        var result = myactor.context.actorFor(childref.path);
        assert.ok(result);
        assert.ok(result === childref);
    });

    it('actorFor child using absolute path', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var myactor2 = new MyActor();

        var childref = myactor.context.actorOf(myactor2, 'mychild');
        var result = myactor.context.actorFor('/myactor/mychild');
        assert.ok(result);
        assert.ok(result === childref);
    });

    it('actorFor using levels', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var mychild = new MyActor();
        var mygrandchild = new MyActor();

        var childref = myactor.context.actorOf(mychild, 'mychild');
        var grandchildref = mychild.context.actorOf(mygrandchild, 'mygrandchild');

        var result = myactor.context.actorFor('mychild/mygrandchild');
        assert.ok(result);
        assert.ok(result === grandchildref);
    });

    it('actorFor parent', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var myactor2 = new MyActor();

        var childref = myactor.context.actorOf(myactor2, 'mychild');

        var result = myactor2.context.actorFor('..');
        assert.ok(result === ref);
    });

    it('actorFor sibling', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var ref = system.actorOf(myactor, 'myactor');
        var mychild1 = new MyActor();
        var mychild2 = new MyActor();

        var child1ref = myactor.context.actorOf(mychild1, 'mychild1');
        var child2ref = myactor.context.actorOf(mychild2, 'mychild2');

        var result = mychild1.context.actorFor('../mychild2');
        assert.ok(result === child2ref);
        result = mychild2.context.actorFor('../mychild1');
        assert.ok(result === child1ref);
    });

    it('context.forActor', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var actorref = system.actorOf(myactor, 'myactor');
        var myactor2 = new MyActor();
        var childref = myactor.context.actorOf(myactor2, 'mychil');

        var result = myactor.context.actorFor('mychil');
        assert.ok(result);
        assert.ok(result === childref);
    });

    it('context.forActor returns null for unknown actor', function() {
        var system = new ActorSystem('MySystem');

        var myactor = new MyActor();
        var actorref = system.actorOf(myactor, 'myactor');

        var result = myactor.context.actorFor('mychildren');
        assert.equal(result, null);
    });
});


