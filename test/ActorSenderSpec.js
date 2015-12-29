var assert = require('assert');

var ActorSystem = require('../src/ActorSystem');

var ActorMatchers = require('../src/ActorMatchers');
var ActorMessages = require('../src/ActorMessages');

describe('ActorSender', function () {

    it('should be able to send back message to sender', function (callback) {

        function SendActor(replyActorRef) {
            this.receive = function (message) {
                if (message === "Start") {
                    assert.equal("Start", message)
                    replyActorRef.tell("Hello World!", this);
                }

                if (message === "Hello Back!") {
                    assert.equal("Hello Back!", message)
                    callback();
                }
            }
        }

        function ReplyActor() {
            this.receive = function (message) {
                assert.equal("Hello World!", message)
                this.sender.tell("Hello Back!")
            }
        }

        var system = new ActorSystem('my-sys');

        var replyActorRef = system.actorOf(new ReplyActor());
        var sendActorRef = system.actorOf(new SendActor(replyActorRef))

        sendActorRef.tell("Start")

    });

    it('should be able to send back message to sender with matcher', function (callback) {

        function SendActor(replyActorRef) {
            this.receive = ActorMatchers.KeyValueMatcher({
                start: function (msg) {
                    replyActorRef.tell(ActorMessages.KeyValueMessage("send", msg),this)
                },
                reply: function (msg) {
                    assert.equal("Hello World!", msg)
                    callback()
                }
            });
        };

        function ReplyActor() {
            this.receive = ActorMatchers.KeyValueMatcher({
                send: function (msg) {
                    this.sender.tell(ActorMessages.KeyValueMessage("reply", msg),this)
                }
            });
        };

        var system = new ActorSystem('my-sys');

        var replyActorRef = system.actorOf(new ReplyActor());
        var sendActorRef = system.actorOf(new SendActor(replyActorRef))

        sendActorRef.tell(ActorMessages.KeyValueMessage("start", "Hello World!"))

    });

});