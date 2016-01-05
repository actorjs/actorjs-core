var ActorContext = require("./ActorContext");
var ActorDecorator = {};

ActorDecorator.context = function (actor, ref, system, parent) {
    var context = new ActorContext(actor, ref, system, parent);
    actor.context = context;
};

ActorDecorator.persist = function (actor, ref, system, parent) {

    actor.persist = function (message, callback) {
        var event = {
            id: actor.id,
            message: message
        };

        if (!system.persistenceProvider)
            throw new Error("Persistence provider not set.");

        if (!actor.id)
            throw new Error("Actor has no id");

        if (!actor.update)
            throw new Error("Actor has no Update method");

        system.persistenceProvider.write(event, function () {
            actor.update.call(actor, message);
            if (callback)
                callback.call(actor);
        });

    };
};

ActorDecorator.become = function (actor, ref, system, parent) {
    actor.become = function (receive) {
        actor.receive = receive;
    };
};

ActorDecorator.ready = function (actor, ref, system, parent) {
    actor.ready = false;
};

ActorDecorator.startStopRestart = function (actor, ref, system, parent) {
    if (!actor.preStart) actor.preStart = function () {};
    if (!actor.postStop) actor.postStop = function () {};
    if (!actor.preRestart) actor.preRestart = function () {};
    if (!actor.postRestart) actor.postRestart = function () {};
};

module.exports = ActorDecorator;