var assert = require('assert');

var actorjs = require("../");
var ActorMessages = actorjs.ActorMessages;

describe('ActorMessages', function () {

    describe('KeyValueMessage', function () {

        it("should return an object with one key value pair", function () {

            var output = ActorMessages.KeyValueMessage("Key", "Value");

            assert.ok(output);

            var key = Object.keys(output)[0];

            assert.equal(key, 'Key');
            assert.equal(output[key], 'Value');


        });

        it("should return an object with null when vaule null", function () {

            var output = ActorMessages.KeyValueMessage("Key", null);

            assert.ok(output);

            var key = Object.keys(output)[0];

            assert.equal(key, 'Key');
            assert.equal(output[key], null);


        });

        it("should return an object with null when value undefined", function () {

            var output = ActorMessages.KeyValueMessage("Key");

            assert.ok(output);

            var key = Object.keys(output)[0];

            assert.equal(key, 'Key');
            assert.equal(output[key], null);


        });
    });
});