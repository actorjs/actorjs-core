ActorJs Core
============

See Actor Model in Wikipedia.

Description
-----------

ActorJs is a basic implementation of an actor model. The implementation is heavily based on the [Akka](http://akka.io/). 

ActorJs works with nodejs as well in the browser. This makes that it easy integrate client and server.

Javascript is single threaded language. So why does it make sens to write an actor model in this language. Things like thread polling are not applicable for this language. Although there are advantages of an actor system which can be use full in javascript.

To make your application vertical and horizontal scalable actor model can be very useful. By making use of remoting different of instances of the application can pass messages.

[Event sourcing](http://martinfowler.com/eaaDev/EventSourcing.html) is another advantage which can be leveraged from the actor model. By persisting events and replay them to get back the state.  

Installation
------------
Install it
```
npm i actorjs-core
```

Use it in nodejs
```
var actorJsCore = require('actor-core');
```

Use it in web
```
var actorJsCore =  actorjs.core
```

Actors
------

Actors are defined as class or object. The actor only requires a single receive function.

Actor as class
```
MyActor function () {
    this.receive = function(msg){
        console.log(msg)
    }
}
```

Actor as function
```
var MyActor = {
    receive: function(msg){
        console.log(msg)
    }
}
```

An actor is instantiate by making use of the actorOf function. This function can be called on the system or on an other actor. By using the function on a actor hierarchy of actors can be created.

```
var system = new ActorSystem('MySystem');
var actorRef = system.actorOf(MyActor);
```

```
var ref = actorRef.actorOf(MyActor);
```

Sender
------
Sender gives the ability to reply a message to the sending actor. To be able to send back a message to the actor a reference is needed to the sending actorRef. To provide this actorRef an reference to the actor needs to be provided will sending a message. This is done by passing it to the second argument of the tell function. The following example will end up in a endless loop but to get the idea.

```
function SendActor(actorRef) {
    this.receive = function (message) {
        actorRef.tell("Hello World!", this);
    }
}

function ActorReply() {
    this.receive = function (message) {
        this.sender.tell("Hello Back!")
    }
}

var actorReplyRef = system.actorOf(new ActorReply());
var actorSendRef = system.actorOf(new ActorSend(actorReplyRef))
```

Forward
-------
Forwarding messages sends a message to the next actor but keeps the original sender. This is done by giving te sender as the second argument of the tell function. Example also end up in endless loop.

```
function SendActor(forwardActorRef) {
    this.receive = function (message) {
        forwardActorRef.tell("Hello World!", this);
    }
}

function ForwardActor(replyActorRef) {
    this.receive = function (message) {
        replyActorRef.tell(message, this.sender)
    }
}

function ReplyActor() {
    this.sender.tell("Hello Back!")
}

var system = new ActorSystem('my-sys');

var replyActorRef = system.actorOf(new ReplyActor());
var forwardActorRef = system.actorOf(new ForwardActor(replyActorRef));
var sendActorRef = system.actorOf(new SendActor(forwardActorRef))
```

Messages
--------

Messages are helper classes to generate messages in a predefined way. These messages are understood by the corresponding matchers.

**Key Value Message**

Key Value Messages are messages which hold one object with one key value pair. The KeyValueMacher is able to match on the these messages. 
```
ActorMessages.KeyValueMessage(<key>, <value>);
```

This produces the following message
```
{ <key>: <value> }
```

Matchers
--------
Matchers are introduced to easy match on incoming messages. There are different matchers which can be used.

**Key Value Matcher**

Key Value Matcher assumes that the message which is send has the following structure.

```
{ <key>: <value> }
```

Key Value Matcher can be used as follow
```
ActorMatcher.KeyValueMatcher({
    <key>: function(<value>){
        // do something wtith <value>
    }
);
```