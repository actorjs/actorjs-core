function ActorRef(actor, parentpath, name) {
    this.actor = actor;
    this.path = parentpath + "/" + name;
}

ActorRef.prototype.tell = function (msg, sender) {


    this.actor.sender = {
        tell: function(msg){
            if(sender.context)
                sender.context.self.tell(msg)
            else
                sender.tell(msg)
        }
    };

    this.actor.receive(msg);
    this.actor.sender = null;
};

module.exports = ActorRef;
