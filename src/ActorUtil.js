var ActorDecorator;
var ActorRef;

var ActorUtil = {

    newActor: function (clss, system, parent, name) {

        var actor;

        if (typeof clss === 'function')
            actor = new clss();
        else
            actor = clss;

        actor.dispatcher = system.dispatcher;
        system.dispatcher.attach(actor);

        if (!actor.receive)
            throw new Error("Actor has no receive function");

        if (!name)
            name = system.nextName();

        var ref = new ActorRef(actor, parent ? parent.path : system.path, name);

        Object.keys(ActorDecorator).forEach(function (key) {
            ActorDecorator[key].call(null, actor, ref, system, parent)
        });

        if (actor.init)
            actor.init();

        // Restore actor from persistence
        ActorUtil.persistenceRestore(actor);

        return ref;

    },

    persistenceRestore: function (actor) {
        // Get messages from persistence
        var system = actor.context.system;
        if (system.persistenceProvider)
            system.persistenceProvider.read(actor.id, function (events) {
                events.forEach(function (event) {
                    actor.update.call(actor, event.message);
                });
                actor.ready = true;
                actor.preStart();
            });
        else{
            actor.ready = true;
            actor.preStart();
        }

    },

    parsePath: function (path) {
        var result = {};
        var position = path.indexOf(':');

        result.protocol = path.substring(0, position);

        var rest = path.substring(position + 3);

        var positionat = rest.indexOf('@');
        position = rest.indexOf('/');

        if (positionat >= 0 && positionat < position) {
            result.system = rest.substring(0, positionat);
            result.server = rest.substring(positionat + 1, position);

            var poscolon = result.server.indexOf(':');

            if (poscolon > 0) {
                result.port = parseInt(result.server.substring(poscolon + 1));
                result.server = result.server.substring(0, poscolon);
            }
        }
        else
            result.system = rest.substring(0, position);

        result.path = rest.substring(position);

        return result;
    }
};

module.exports = ActorUtil;

ActorDecorator = require("./ActorDecorator");
ActorRef = require("./ActorRef");
