var assert = require('assert');

var ActorSystem = require('../src/ActorSystem');

describe('ActorSender', function () {

    it('should be able to send back message to sender', function (callback) {

        function SendActor(replyActorRef) {
            this.receive = function (message) {
                if (message === "Start"){
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

    })

})