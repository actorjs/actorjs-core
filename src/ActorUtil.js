var ActorUtil = {

    newActor: function (clss, system, parent, name) {
        var actor;

        if (typeof clss === 'function')
            actor = new clss();
        else
            actor = clss;

        if (!name)
            name = system.nextName();

        var ActorRef = require("./ActorRef");
        var ref = new ActorRef(actor, parent ? parent.path : system.path, name);

        var ActorContext = require("./ActorContext");
        var context = new ActorContext(actor, ref, system, parent);


        actor.context = context;

        actor.persist = function (message, callback) {
            var event = {
                path: ref.path,
                message: message
            };

            if (!system.persistenceProvider)
                throw new Error("Persistence provider not set.");

            system.persistenceProvider.write(event, callback);

            if(!actor.update)
                throw new Error("Update method does not exist on actor.");
            actor.update(message)
        };

        return ref;
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
}

module.exports = ActorUtil;