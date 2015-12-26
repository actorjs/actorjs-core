var ActorDecorator = {};

ActorDecorator.context = function (actor, ref, system, parent) {
    var ActorContext = require("./ActorContext");
    var context = new ActorContext(actor, ref, system, parent);
    actor.context = context;
};

ActorDecorator.persist = function (actor, ref, system, parent) {
    actor.persist = function (message) {
        var event = {
            path: ref.path,
            message: message
        };

        if (!system.persistenceProvider)
            throw new Error("Persistence provider not set.");

        if (!actor.update)
            throw new Error("Update method does not exist on actor.");

        system.persistenceProvider.write(event, function () {
            actor.update(message)
        });

    };
};

ActorDecorator.become = function (actor, ref, system, parent) {
    actor.become = function (receive) {
        actor.receive = receive;
    };
};

module.exports = ActorDecorator;