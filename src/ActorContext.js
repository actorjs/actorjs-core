var ActorSystem = require("./ActorSystem");
var ActorUtil = require("./ActorUtil");

var ActorContext = function (actor, reference, system, parent) {
    actor.context = this;
    actor.self = reference;
    reference.context = this;
    this.system = system;
    this.self = reference;
    this.parent = parent;
    this.children = { };
};

ActorContext.prototype.actorOf = function(clss, name, options) {
    var child = ActorUtil.newActor(clss, this.system, this.self, name, options);
    this.children[name] = child;

    // Restore actor from persistence
    ActorUtil.persistenceRestore(this.system, child);

    return child;
};

ActorContext.prototype.actorFor = function(name) {
    if (name[0] === '/')
        return this.system.actorFor(name);

    if (name === '..')
        return this.parent;

    if (name.substring(0, 3) === '../')
        return this.parent.context.actorFor(name.substring(3));

    if (name.indexOf(':') > 0)
        return this.system.actorFor(name);

    var position = name.indexOf('/');

    if (position > 0) {
        var rest = name.substring(position + 1);
        name = name.substring(0, position);
        return this.children[name].context.actorFor(rest);
    }

    else
        return this.children[name];
};

module.exports = ActorContext;
