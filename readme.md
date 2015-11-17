ActorJs Core
============

See Actor Model in Wikipedia.

Description
-----------

ActorJs is a basic implementation of an actor model. The implementation is heavily based on the implementation of Akka. Most classes and methods are named the same.

ActorJs works with nodejs as well in the browser. This makes that it easy integrates client and server.

Installation
------------
Install it
```
npm i actorjs-core

```
Use it
```
var actorjs = require('actor-core');

```

Actors
---------------

Actors are defined a functions. The actor only requires a single receive

```
var MyActor function () {
    receive: receive(msg){
        console.log(msg)
    }
}

var system = new ActorSystem('MySystem');
var ref = system.actorOf(MyActor);
```

Actors Messages
---------------
Messages are helper classes to generate commands easyer there are different messages helpers to generat comands which are understood by the matchers.

**Type Message**
Type messages are understood by the type matcher. Type message can be used in the following way.

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
Matchers are introduced to be better able to match on incoming commands. There are different matchers which can be used.

**Type Matcher**
Type matcher assumes that the messages which are send have the following structure

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