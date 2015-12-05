var assert = require('assert');

var actorjs = require("../");
var ActorMatchers = actorjs.ActorMatchers;

describe('ActorMatchers', function () {

    describe('KeyValueMatcher', function () {

        it("should match on a object with one key value pair", function (callback) {

            var output = null;

            var matcher = {
                key: function (data) {
                    assert.ok(data);
                    assert.equal(data, 'value');
                    callback();
                }
            };

            var message = {
                key: "value"
            };

            ActorMatchers.KeyValueMatcher(matcher)(message);



        });
    });
});