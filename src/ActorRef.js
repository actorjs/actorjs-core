function ActorRef(actor, parentpath, name) {
    this.actor = actor;
    this.path = parentpath + "/" + name;
    console.log("Path: ", this.path)
}

ActorRef.prototype.tell = function (msg) {
    this.actor.receive(msg);
}

module.exports = ActorRef;
