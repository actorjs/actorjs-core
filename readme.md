ActorJs Core
============

See Actor Model in Wikipedia.

Description
-----------

ActorJs is a basic implementation of an actor model. The implementation is heavily based on the Akka framework.

ActorJs works with nodejs as well in the browser. This makes that it easy integrate client and server.

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
---------------

Actors are defined as functions. The actor only requires a single receive function.

```
var MyActor function () {
    receive: receive(msg){
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

Actors Messages
---------------
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

Actors Matchers
---------------
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
ActorMessages.TypeMessage({
    <String>: function(<Object>){
        // do something
    }
);
```