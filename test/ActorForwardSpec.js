var assert = require('assert');

var ActorSystem = require('../src/ActorSystem');

describe('ActorForward', function () {

    it('should be able to forward message to actor', function (callback) {

        function SendActor(forwardActorRef) {
            this.receive = function (message) {
                if (message === "Start"){
                    assert.equal("Start", message)
                    forwardActorRef.tell("Hello World!", this);
                }

                if (message === "Hello Back!") {
                    assert.equal("Hello Back!", message)
                    callback();
                }
            }
        }

        function ForwardActor(replyActorRef) {
            this.receive = function (message) {
                replyActorRef.tell(message, this.sender)
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
        var forwardActorRef = system.actorOf(new ForwardActor(replyActorRef));
        var sendActorRef = system.actorOf(new SendActor(forwardActorRef))

        sendActorRef.tell("Start")

    })

})