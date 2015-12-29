var actorjs = actorjs || {}; actorjs["core"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    ActorRef: __webpack_require__(1),
	    ActorContext: __webpack_require__(2),
	    ActorSystem: __webpack_require__(3),
	    ActorUtil: __webpack_require__(4),
	    ActorMessages: __webpack_require__(8),
	    ActorMatchers: __webpack_require__(9),
	    ActorDecorator: __webpack_require__(5)
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	function ActorRef(actor, parentpath, name) {
	    this.actor = actor;
	    this.path = parentpath + "/" + name;
	}

	ActorRef.prototype.tell = function (message, sender) {
	    this.actor.dispatcher.dispatch(this.actor, message, sender);
	};

	module.exports = ActorRef;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var ActorSystem = __webpack_require__(3);


	var ActorContext = function (actor, reference, system, parent) {
	    actor.context = this;
	    actor.self = reference;
	    reference.context = this;
	    this.system = system;
	    this.self = reference;
	    this.parent = parent;
	    this.children = {};
	};

	ActorContext.prototype.actorOf = function (clss, name, options) {
	    var ActorUtil = __webpack_require__(4);
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

	module.exports = ActorContext;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var ActorUtil = __webpack_require__(4);
	var ActorDispatcher = __webpack_require__(6);

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
	        return this.children[name].context.actorFor(rest);
	    }
	    else
	        return this.children[name];
	};

	ActorSystem.prototype.setPersistenceProvider = function (provider) {
	    this.persistenceProvider = provider;
	};

	module.exports = ActorSystem;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var ActorDecorator = __webpack_require__(5);

	var ActorUtil = {

	    newActor: function (clss, system, parent, name) {

	        var actor;

	        if (typeof clss === 'function')
	            actor = new clss();
	        else
	            actor = clss;

	        actor.dispatcher = system.dispatcher;
	        system.dispatcher.attach(actor);

	        if (!actor.receive)
	            throw new Error("Actor has no receive function");

	        if (!name)
	            name = system.nextName();

	        var ActorRef = __webpack_require__(1);
	        var ref = new ActorRef(actor, parent ? parent.path : system.path, name);

	        Object.keys(ActorDecorator).forEach(function (key) {
	            ActorDecorator[key].call(null, actor, ref, system, parent)
	        });

	        if (actor.init)
	            actor.init();

	        // Restore actor from persistence
	        ActorUtil.persistenceRestore(actor, system, ref);

	        return ref;

	    },

	    persistenceRestore: function (actor, system, actorRef) {
	        console.log("Restore", actor.id);
	        // Get messages from persistence
	        if (system.persistenceProvider)
	            system.persistenceProvider.read(actorRef.actor.id, function (events) {
	                events.forEach(function (event) {
	                    actorRef.actor.update.call(actorRef.actor, event.message);
	                });
	                actor.ready = true
	            });
	        else
	            actor.ready = true
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var ActorDecorator = {};

	ActorDecorator.context = function (actor, ref, system, parent) {
	    var ActorContext = __webpack_require__(2);
	    var context = new ActorContext(actor, ref, system, parent);
	    actor.context = context;
	};

	ActorDecorator.persist = function (actor, ref, system, parent) {

	    actor.persist = function (message, callback) {
	        var event = {
	            id: actor.id,
	            message: message
	        };

	        if (!system.persistenceProvider)
	            throw new Error("Persistence provider not set.");

	        if (!actor.id)
	            throw new Error("Actor has no id");

	        if (!actor.update)
	            throw new Error("Actor has no Update method");

	        system.persistenceProvider.write(event, function () {
	            actor.update.call(actor, message);
	            if(callback)
	                callback.call(actor);
	        });

	    };
	};

	ActorDecorator.become = function (actor, ref, system, parent) {
	    actor.become = function (receive) {
	        actor.receive = receive;
	    };
	};

	ActorDecorator.ready = function (actor, ref, system, parent) {
	    actor.ready = false;
	};

	module.exports = ActorDecorator;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var ActorDispatcher = function () {
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

	        if (event.sender && event.sender.context.self.tell)
	            event.actor.sender = event.sender.context.self;
	        else if (event.sender && event.sender.tell)
	            event.actor.sender = event.sender;

	        event.actor.receive.call(event.actor, event.message);

	        event.actor.sender = null;

	    } else {
	        setTimeout(function () {
	            console.log("reprocess...");
	            process(event);
	        }, 500)
	    }
	};

	module.exports = ActorDispatcher;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports) {

	var KeyValueMessage = function (key, value) {
	    var message = {};
	    if (!value) value = null;
	    message[key] = value;
	    return message;
	};


	module.exports = {
	    KeyValueMessage: KeyValueMessage
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	var KeyValueMatcher = function(matcher){

	    return function(message){

	        if(!Object.keys(message) && Object.keys(message)[0])
	            throw new Error("Cannot typeMatch: " + message.type);

	        var key = Object.keys(message)[0];

	        if(!matcher[key])
	            throw new Error("No object for key: " + key + " in actor: " + this.context.self.path);

	        matcher[key].call(this, message[key]);
	    }

	};

	module.exports = {
	    KeyValueMatcher: KeyValueMatcher
	};

/***/ }
/******/ ]);