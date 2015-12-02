function ActorRef(actor, parentpath, name) {
    this.actor = actor;
    this.path = parentpath + "/" + name;
}

ActorRef.prototype.tell = function (msg) {
    this.actor.receive(msg);
}

module.exports = ActorRef;
