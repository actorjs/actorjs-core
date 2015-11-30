var ActorUtil = require("./ActorUtil");

function ActorSystem(name) {
    var counter = 0;
    this.name = name;
    this.path = "actor://" + name;
    this.children = { };

    this.persistenceProvider = null;

    this.nextName = function () {
        counter++;
        return '_' + counter;
    }
};

ActorSystem.prototype.actorOf = function(clss, name, options) {
    console.log("ActorOf", this)
    var actor = ActorUtil.newActor(clss, this, null, name, options);
    this.children[name] = actor;
    return actor;
};

ActorSystem.prototype.actorFor = function (name) {
    if (name.indexOf(':') > 0) {
        var path = ActorUtil.parsePath(name);

        if (path.server) {
            var servername = path.server + ':' + path.port;
            if (servername !== this.node.name)
                return this.node.getNode(servername).getSystem(path.system).actorFor(path.path);
        }

        name = path.path;
    }

    if (name && name[0] === '/')
        name = name.substring(1);

    var position = name.indexOf('/');

    if (position > 0) {
        var rest = name.substring(position + 1);
        name = name.substring(0, position);
        return this.children[name].context.actorFor(rest);
    }
    else
        return this.children[name];
};

ActorSystem.prototype.setPersistenceProvider = function(provider) {
    console.log("Set Persistence Provider:",provider);
    this.persistenceProvider = provider;

    console.log("Set Persistence Provider:",this.persistenceProvider);
};

module.exports = ActorSystem;