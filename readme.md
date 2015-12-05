ActorJs Core
============

See Actor Model in Wikipedia.

Description
-----------

ActorJs is a basic implementation of an actor model. The implementation is heavily based on the Akka framework.
ActorJs works with nodejs as well in the browser. This makes that it easy integrate client and server.
Javascript is not a multi threaded language and not all advantages of an actor system can leveraged. Although there are advantages of an actor system which can be use full in javascript.

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

Actors are defined as class  or as object. The actor only requires a single receive function.

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

An actor is instanciate by making use of the actorOf function. This function can be called on the system or on an other actor. By using the function on a actor a hierarchy of actors can be created.

```
var system = new ActorSystem('MySystem');
var actorRef = system.actorOf(MyActor);
```

```
var ref = actorRef.actorOf(MyActor);
```

Sender
------
To be able to send back a message to the actor that is sending access to the sending actorRef is required. To provide this actorRef an reference to the actor needs to be provided will sending a message. The following example will end up in a endless loop but to get the idea.

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
Forwarding messages to an other actor can be do in the following way.
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

**Type Message**

Type messages are messages with a type which can be used to match on.

```
ActorMessages.TypeMessage(<String>, <Object>);
```

This produces the following message

```
{
  type: <String>
  data: <Object>
}
```

Matchers
--------
Matchers are introduced to easy match on incoming messages. There are different matchers which can be used.

**Type Matcher**

Type matcher assumes that the message which is send has the following structure.


```
{
  type: <String>
  data: <Object>
}
```

Type Matcher can be used as follow


```
ActorMatcher.TypeMatcher({
    <String>: function(<Object>){
        // do something
    }
);
```