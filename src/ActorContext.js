var ActorSystem = require("./ActorSystem");
var ActorUtil = require("./ActorUtil");

var ActorContext = function (actor, ref, system, parent) {
    ref.context = this;
    this.actor = actor;
    this.system = system;
    this.self = ref;
    this.parent = parent;
    this.children = {};
};

ActorContext.prototype.actorOf = function(clss, name, options) {
    var child = ActorUtil.newActor(clss, this.system, this.self, name, options);
    this.children[name] = child;
    return child;
};

ActorContext.prototype.actorFor = function (name) {

    if (name[0] === '/')
        return this.system.actorFor(name);

    if (name === '..')
        return this.parent;

    if (name.substring(0, 3) === '../')
    //console.log(this.parent)
        return this.parent.context.actorFor(name.substring(3));

    if (name.indexOf(':') > 0)
        return this.system.actorFor(name);

    var position = name.indexOf('/');

    if (position > 0) {
        var rest = name.substring(position + 1);
        name = name.substring(0, position);
        return this.children[name].context.actorFor(rest);
    } else
        return this.children[name];
};

ActorContext.prototype.become = function(receive) {
    this.actor.receive = receive
};

module.exports = ActorContext;
