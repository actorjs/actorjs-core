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
	    ActorMessages: __webpack_require__(5),
	    ActorMatchers: __webpack_require__(6)
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	function ActorRef(actor, parentpath, name) {
	    this.actor = actor;
	    this.path = parentpath + "/" + name;
	    console.log("Path: ", this.path)
	}

	ActorRef.prototype.tell = function (msg) {
	    this.actor.receive(msg);
	}

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
	    this.children = { };
	};

	ActorContext.prototype.actorOf = function(clss, name, options) {
	    var ActorUtil = __webpack_require__(4);
	    var child = ActorUtil.newActor(clss, this.system, this.self, name, options);
	    this.children[name] = child;
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var ActorUtil = __webpack_require__(4);

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var ActorUtil = {

	    newActor: function (clss, system, parent, name) {
	        var actor;

	        if (typeof clss === 'function')
	            actor = new clss();
	        else
	            actor = clss;

	        if (!name)
	            name = system.nextName();

	        var ActorRef = __webpack_require__(1);
	        var ref = new ActorRef(actor, parent ? parent.path : system.path, name);

	        var ActorContext = __webpack_require__(2);
	        var context = new ActorContext(actor, ref, system, parent);


	        actor.context = context;

	        actor.persist = function(message, callback){
	            var event = {
	                path: ref.path,
	                message: message
	            };
	            system.persistenceProvider.write(event, callback);
	            actor.update(message)
	        };

	        return ref;
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
/***/ function(module, exports) {

	var TypeMessage = function (type, data) {
	    return {
	        type: type,
	        data: data
	    }
	}


	module.exports = {
	    TypeMessage: TypeMessage
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	var TypeMatcher = function(receive){

	    return function(message){
	        if(!receive[message.type]) throw new Error("Connot typeMatch: " + message.type);
	        receive[message.type](message.data)
	    }

	};

	module.exports = {
	    TypeMatcher: TypeMatcher
	};

/***/ }
/******/ ]);