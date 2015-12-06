var assert = require('assert');

var actorjs = require("../");
var ActorUtil = actorjs.ActorUtil;

describe('ActorUtilPath', function () {

    it('parse path', function () {
        var result = ActorUtil.parsePath('actor://mysys/actor');

        assert.ok(result);
        assert.ok(result.protocol);
        assert.ok(result.system);
        assert.ok(result.path);

        assert.equal(result.protocol, 'actor');
        assert.equal(result.system, 'mysys');
        assert.equal(result.path, '/actor');
    });

    it('parse path with server', function () {
        var result = ActorUtil.parsePath('actor://mysys@localhost/actor');

        assert.ok(result);
        assert.ok(result.protocol);
        assert.ok(result.system);
        assert.ok(result.path);
        assert.ok(result.server);

        assert.equal(result.protocol, 'actor');
        assert.equal(result.system, 'mysys');
        assert.equal(result.path, '/actor');
        assert.equal(result.server, 'localhost');
    });

    it('parse path with server and port', function () {
        var result = ActorUtil.parsePath('actor://mysys@localhost:3000/actor');

        assert.ok(result);
        assert.ok(result.protocol);
        assert.ok(result.system);
        assert.ok(result.path);
        assert.ok(result.server);
        assert.ok(result.port);

        assert.equal(result.protocol, 'actor');
        assert.equal(result.system, 'mysys');
        assert.equal(result.path, '/actor');
        assert.equal(result.server, 'localhost');
        assert.equal(result.port, 3000);
    });

});
