var ActorUtil = require("./ActorUtil");
var ActorDispatcher = require("./ActorDispatcher");

function ActorSystem(name) {
    var counter = 0;
    this.name = name;
    this.path = "actor://" + name;
    this.children = {};

    this.persistenceProvider = null;

    this.dispatcher = new ActorDispatcher();

    this.nextName = function () {
        counter++;
        return '_' + counter;
    }
};

ActorSystem.prototype.actorOf = function (clss, name) {
    var actorRef = ActorUtil.newActor(clss, this, null, name);
    this.children[name] = actorRef;
    return actorRef;
};

ActorSystem.prototype.actorFor = function (name) {
    if (name.indexOf(':') > 0) {
        var path = ActorUtil.parsePath(name);

        if (path.server) {
            var serverName = path.server + ':' + path.port;
            if (serverName !== this.node.name)
                return this.node.getNode(serverName).getSystem(path.system).actorFor(path.path);
        }

        name = path.path;
    }

    if (name && name[0] === '/')
        name = name.substring(1);

    var position = name.indexOf('/');

    if (position > 0) {
        var rest = name.substring(position + 1);
        name = name.substring(0, position);
        return this.children[name].actor.context.actorFor(rest);
    }
    else
        return this.children[name];
};

ActorSystem.prototype.setPersistenceProvider = function (provider) {
    this.persistenceProvider = provider;
};

module.exports = ActorSystem;