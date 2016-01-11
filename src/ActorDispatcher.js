var ActorDispatcher = function () {
    this.actors = [];
};

ActorDispatcher.prototype.attach = function (actor) {
    this.actors.push(actor);
};

ActorDispatcher.prototype.dispatch = function (actor, message, sender) {
    var event = {
        actor: actor,
        message: message,
        sender: sender
    }
    process(event);
};

function process(event) {
    if (event.actor.ready) {

        if (event.sender && event.sender.tell)
            event.actor.sender = event.sender;

        if (event.sender && event.sender.context && event.sender.context.self.tell)
            event.actor.sender = event.sender.context.self;

        event.actor.receive.call(event.actor, event.message);

        event.actor.sender = null;

    } else {
        setTimeout(function () {
            process(event);
        }, 500)
    }
};

module.exports = ActorDispatcher;
