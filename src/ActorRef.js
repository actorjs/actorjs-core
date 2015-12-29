function ActorRef(actor, parentpath, name) {
    this.actor = actor;
    this.path = parentpath + "/" + name;
}

ActorRef.prototype.tell = function (message, sender) {
    this.actor.dispatcher.dispatch(this.actor, message, sender);
};

module.exports = ActorRef;
