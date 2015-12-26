var ActorJsCore = require("./index");

var matcher = ActorJsCore.ActorMatchers.KeyValueMatcher

function actor(){

    this.hallo = "Hello World!";

    this.receive = function(){
        console.log
    };
}

var actorSystem = new ActorJsCore.ActorSystem();
var actorRef = actorSystem.actorOf(actor);

actorRef.tell({test:"Test"});

