/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + ".hot/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + ".hot/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "4acd7bf14b1fa1d6acbf";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./src/app.server.ts":
/*!***************************!*\
  !*** ./src/app.server.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const express = __webpack_require__(/*! express */ "express");
const utillity_1 = __webpack_require__(/*! utillity */ "./src/utillity/index.ts");
const logger_1 = __webpack_require__(/*! logger */ "./src/logger.ts");
const middlewares_1 = __webpack_require__(/*! middlewares */ "./src/middlewares/index.ts");
class App {
    constructor() {
        this.applyServer = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.appUtils.applyUtils();
            yield this.applyMiddleware();
        });
        this.applyMiddleware = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            middlewares_1.default(this.app);
        });
        this.app = express();
        this.app.logger = logger_1.default;
        this.appUtils = new utillity_1.default(this.app);
        this.applyServer();
    }
    static bootstrap() {
        return new App();
    }
}
exports.application = new App();
exports.default = exports.application.app;


/***/ }),

/***/ "./src/client/company/schema/schema.graphql":
/*!**************************************************!*\
  !*** ./src/client/company/schema/schema.graphql ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Company implements INode {\n  id: ID!\n  name: String\n  description: String\n  createdBy: ID\n  url: String\n  logo: String\n  location: String\n  founded_year: String\n  noOfEmployees: Range\n  lastActive: Timestamp\n  hiringStatus: Boolean\n  skills: [String]\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\ninput CompanyInput {\n  createdBy: ID!\n  name: String!\n  description: String!\n  url: String\n  logo: String\n  location: String\n  foundedYear: String\n  noOfEmployees: RangeInput\n  hiringStatus: Boolean\n  skills: [String]\n}\n"

/***/ }),

/***/ "./src/client/job/schema/schema.graphql":
/*!**********************************************!*\
  !*** ./src/client/job/schema/schema.graphql ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum CurrentStatus {\n  ACTIVE\n  HOLD\n  EXPIRED\n}\n\nenum JobType {\n  DEFAULT\n  FEATURED\n  PREMIUM\n}\n\ntype Sallary {\n  value: Float!\n  currency: String!\n}\n\ntype Job implements INode {\n  id: ID!\n  name: String!\n  type: JobType!\n  category: [String!]!\n  desc: String!\n  skillsRequired: [String!]!\n  sallary: Range\n  location: String!\n  attachment: [Attachment]\n  status: CurrentStatus\n  views: Int\n  usersApplied: [String!]\n  createdBy: String\n  company: String!\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\ntype JobResultCursor {\n  edges: Edge!\n  pageInfo: PageInfo!\n  totalCount: Int!\n}\n\ninput SallaryInput {\n  value: Float!\n  currency: String!\n}\n\ninput CreateJobInput {\n  name: String!\n  type: JobType!\n  category: [String!]!\n  desc: String!\n  skills_required: [String!]!\n  sallary: RangeInput!\n  sallary_max: SallaryInput!\n  attachment: [AttachmentInput]\n  location: String!\n  status: CurrentStatus!\n  company: String!\n}\n"

/***/ }),

/***/ "./src/client/profile/index.ts":
/*!*************************************!*\
  !*** ./src/client/profile/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __webpack_require__(/*! grpc */ "grpc");
const protorepo_profile_node_1 = __webpack_require__(/*! @oojob/protorepo-profile-node */ "@oojob/protorepo-profile-node");
const { ACCOUNT_SERVICE_URI = 'localhost:3000' } = process.env;
const profileClient = new protorepo_profile_node_1.ProfileServiceClient(ACCOUNT_SERVICE_URI, grpc.credentials.createInsecure());
exports.default = profileClient;


/***/ }),

/***/ "./src/client/profile/resolver/index.ts":
/*!**********************************************!*\
  !*** ./src/client/profile/resolver/index.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const service_pb_1 = __webpack_require__(/*! @oojob/protorepo-profile-node/service_pb */ "@oojob/protorepo-profile-node/service_pb");
const oojob_protobuf_1 = __webpack_require__(/*! @oojob/oojob-protobuf */ "@oojob/oojob-protobuf");
const transformer_1 = __webpack_require__(/*! client/profile/transformer */ "./src/client/profile/transformer/index.ts");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
exports.extractTokenMetadata = (token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const tokenRequest = new service_pb_1.TokenRequest();
    tokenRequest.setToken(token);
    const res = {};
    try {
        const tokenRes = (yield transformer_1.verifyToken(tokenRequest));
        res.verified = tokenRes.getVerified();
        res.accessUuid = tokenRes.getAccessUuid();
        res.accountType = tokenRes.getAccountType();
        res.authorized = tokenRes.getAuthorized();
        res.email = tokenRes.getEmail();
        res.identifier = tokenRes.getIdentifier();
        res.userId = tokenRes.getUserId();
        res.username = tokenRes.getUsername();
    }
    catch (error) {
        res.verified = false;
        res.accessUuid = null;
        res.accountType = null;
        res.authorized = false;
        res.email = null;
        res.exp = null;
        res.identifier = null;
        res.userId = null;
        res.username = null;
    }
    return res;
});
exports.Query = {
    ValidateUsername: (_, { input }, { tracer, logger }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const _tracer = tracer('service-profile');
        logger.info('validating username');
        const span = _tracer.startSpan('client:service-profile:validate-username', {
            parent: _tracer.getCurrentSpan()
        });
        const res = {};
        _tracer.withSpan(span, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const username = input.username;
            const validateUsernameReq = new service_pb_1.ValidateUsernameRequest();
            if (username) {
                validateUsernameReq.setUsername(username);
            }
            try {
                const validateRes = (yield transformer_1.validateUsername(validateUsernameReq));
                res.status = validateRes.getStatus();
                res.code = validateRes.getCode();
                res.error = validateRes.getError();
                span.end();
            }
            catch ({ message, code }) {
                res.status = false;
                res.error = message;
                res.code = code;
                span.end();
            }
        }));
        return res;
    }),
    ValidateEmail: (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const validateEmailReq = new service_pb_1.ValidateEmailRequest();
        const email = input.email;
        if (email) {
            validateEmailReq.setEmail(email);
        }
        const res = {};
        try {
            const validateRes = (yield transformer_1.validateEmail(validateEmailReq));
            res.status = validateRes.getStatus();
            res.code = validateRes.getCode();
            res.error = validateRes.getError();
        }
        catch ({ message, code }) {
            res.status = false;
            res.error = message;
            res.code = code;
        }
        return res;
    }),
    VerifyToken: (_, { input }, { token: accessToken }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let res = {};
        const token = (input && input.token) || accessToken;
        if (token) {
            res = yield exports.extractTokenMetadata(token);
        }
        return res;
    }),
    RefreshToken: (_, { input }, { token: accessToken }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const res = {};
        const tokenRequest = new service_pb_1.TokenRequest();
        const token = (input && input.token) || accessToken;
        if (token) {
            tokenRequest.setToken(token);
        }
        try {
            const tokenResponse = (yield transformer_1.refreshToken(tokenRequest));
            res.access_token = tokenResponse.getAccessToken();
            res.refresh_token = tokenResponse.getRefreshToken();
            res.valid = tokenResponse.getValid();
        }
        catch (error) {
            res.access_token = '';
            res.refresh_token = '';
            res.valid = false;
        }
        return res;
    }),
    ReadProfile: (_, { input }, { accessDetails }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!accessDetails) {
            throw new apollo_server_express_1.AuthenticationError('you must be logged in');
        }
        if (input.id !== accessDetails.userId) {
            throw new Error("you can't access other profile");
        }
        const res = {};
        const readProfileRequest = new service_pb_1.ReadProfileRequest();
        readProfileRequest.setAccountId(input.id);
        try {
            const profileRes = (yield transformer_1.readProfile(readProfileRequest));
            const profileSecurity = {};
            const email = {
                email: (_a = profileRes.getEmail()) === null || _a === void 0 ? void 0 : _a.getEmail(),
                show: (_b = profileRes.getEmail()) === null || _b === void 0 ? void 0 : _b.getShow()
            };
            profileSecurity.verified = (_c = profileRes.getSecurity()) === null || _c === void 0 ? void 0 : _c.getVerified();
            res.username = profileRes.getUsername();
            res.givenName = profileRes.getGivenName();
            res.familyName = profileRes.getFamilyName();
            res.middleName = profileRes.getMiddleName();
            res.email = email;
            res.security = profileSecurity;
        }
        catch (error) {
            throw new Error(error);
        }
        return res;
    })
};
exports.Mutation = {
    Auth: (_, { input }, { tracer, logger }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const _tracer = tracer('service-profile');
        const span = _tracer.startSpan('client:service-profile:auth', {
            parent: _tracer.getCurrentSpan()
        });
        const res = {};
        _tracer.withSpan(span, () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const authRequest = new service_pb_1.AuthRequest();
            if (input === null || input === void 0 ? void 0 : input.username) {
                authRequest.setUsername(input.username);
            }
            if (input === null || input === void 0 ? void 0 : input.password) {
                authRequest.setPassword(input.password);
            }
            try {
                const tokenResponse = (yield transformer_1.auth(authRequest));
                res.access_token = tokenResponse.getAccessToken();
                res.refresh_token = tokenResponse.getRefreshToken();
                res.valid = tokenResponse.getValid();
                span.end();
            }
            catch (error) {
                res.access_token = '';
                res.refresh_token = '';
                res.valid = false;
                span.end();
            }
        }));
        return res;
    }),
    CreateProfile: (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f;
        const middleName = input.middleName ? ` ${input.middleName.trim()}` : '';
        const familyName = input.familyName ? ` ${input.familyName.trim()}` : '';
        const name = `${input.givenName}${middleName}${familyName}`;
        const identifier = new oojob_protobuf_1.Identifier();
        identifier.setName(name.trim());
        const profileSecurity = new service_pb_1.ProfileSecurity();
        if ((_d = input.security) === null || _d === void 0 ? void 0 : _d.password) {
            profileSecurity.setPassword(input.security.password);
        }
        const email = new oojob_protobuf_1.Email();
        if ((_e = input.email) === null || _e === void 0 ? void 0 : _e.email) {
            email.setEmail(input.email.email);
        }
        if ((_f = input.email) === null || _f === void 0 ? void 0 : _f.show) {
            email.setShow(input.email.show);
        }
        const profile = new service_pb_1.Profile();
        if (input === null || input === void 0 ? void 0 : input.gender) {
            profile.setGender(input.gender);
        }
        if (input === null || input === void 0 ? void 0 : input.username) {
            profile.setUsername(input.username);
        }
        profile.setEmail(email);
        profile.setIdentity(identifier);
        profile.setSecurity(profileSecurity);
        const res = (yield transformer_1.createProfile(profile));
        const profileResponse = {
            id: res.getId()
        };
        return profileResponse;
    }),
    Logout: (_, { input }, { token: accessToken }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const res = {};
        const tokenRequest = new service_pb_1.TokenRequest();
        const token = (input && input.token) || accessToken;
        if (token) {
            tokenRequest.setToken(token);
        }
        try {
            const logoutRes = (yield transformer_1.logout(tokenRequest));
            res.status = logoutRes.getStatus();
            res.code = logoutRes.getCode();
            res.error = logoutRes.getError();
        }
        catch ({ message, code }) {
            res.status = false;
            res.error = message;
            res.code = code;
        }
        return res;
    })
};
exports.profileResolvers = {
    Mutation: exports.Mutation,
    Query: exports.Query
};
exports.default = exports.profileResolvers;


/***/ }),

/***/ "./src/client/profile/schema/schema.graphql":
/*!**************************************************!*\
  !*** ./src/client/profile/schema/schema.graphql ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum AccountType {\n  BASE\n  COMPANY\n  FUNDING\n  JOB\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum ProfileOperations {\n  CREATE\n  READ\n  UPDATE\n  DELETE\n  BULK_UPDATE\n}\n\nenum OperationEntity {\n  COMPANY\n  JOB\n  INVESTOR\n}\n\ntype Education {\n  education: String\n  show: Boolean\n}\n\ntype ProfileSecurity {\n  accountType: AccountType\n  verified: Boolean\n}\n\ntype Profile {\n  identity: Identifier\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  email: Email\n  gender: Gender\n  birthdate: Timestamp\n  currentPosition: String\n  education: Education\n  address: Address\n  security: ProfileSecurity\n  metadata: Metadata\n}\n\ntype AuthResponse {\n  access_token: String\n  refresh_token: String\n  valid: Boolean\n}\n\ntype AccessDetailsResponse {\n  authorized: Boolean\n  accessUuid: String\n  userId: String\n  username: String\n  email: String\n  identifier: String\n  accountType: String\n  verified: Boolean\n  exp: String\n}\n\ninput EducationInput {\n  education: String\n  show: Boolean\n}\n\ninput ProfileSecurityInput {\n  password: String\n  accountType: AccountType\n}\n\ninput ProfileInput {\n  identity: IdentifierInput\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  email: EmailInput\n  gender: Gender\n  birthdate: TimestampInput\n  currentPosition: String\n  education: EducationInput\n  address: AddressInput\n  security: ProfileSecurityInput\n}\n\ninput ValidateUsernameInput {\n  username: String\n}\n\ninput ValidateEmailInput {\n  email: String\n}\n\ninput AuthRequestInput {\n  username: String\n  password: String\n}\n\ninput TokenRequest {\n  token: String\n  accessUuid: String\n  userId: String\n}\n\nextend type Query {\n  ValidateUsername(input: ValidateUsernameInput!): DefaultResponse!\n  ValidateEmail(input: ValidateEmailInput!): DefaultResponse!\n  VerifyToken(input: TokenRequest): AccessDetailsResponse!\n  RefreshToken(input: TokenRequest): AuthResponse!\n  ReadProfile(input: IdInput!): Profile!\n}\n\nextend type Mutation {\n  CreateProfile(input: ProfileInput!): Id!\n  Auth(input: AuthRequestInput): AuthResponse!\n  Logout(input: TokenRequest): DefaultResponse!\n}\n"

/***/ }),

/***/ "./src/client/profile/transformer/index.ts":
/*!*************************************************!*\
  !*** ./src/client/profile/transformer/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const profile_1 = __webpack_require__(/*! client/profile */ "./src/client/profile/index.ts");
const util_1 = __webpack_require__(/*! util */ "util");
exports.createProfile = util_1.promisify(profile_1.default.createProfile).bind(profile_1.default);
exports.confirmProfile = util_1.promisify(profile_1.default.confirmProfile).bind(profile_1.default);
exports.readProfile = util_1.promisify(profile_1.default.readProfile).bind(profile_1.default);
exports.updateProfile = util_1.promisify(profile_1.default.updateProfile).bind(profile_1.default);
exports.validateUsername = util_1.promisify(profile_1.default.validateUsername).bind(profile_1.default);
exports.validateEmail = util_1.promisify(profile_1.default.validateEmail).bind(profile_1.default);
exports.auth = util_1.promisify(profile_1.default.auth).bind(profile_1.default);
exports.verifyToken = util_1.promisify(profile_1.default.verifyToken).bind(profile_1.default);
exports.logout = util_1.promisify(profile_1.default.logout).bind(profile_1.default);
exports.refreshToken = util_1.promisify(profile_1.default.refreshToken).bind(profile_1.default);


/***/ }),

/***/ "./src/client/root/resolver/index.ts":
/*!*******************************************!*\
  !*** ./src/client/root/resolver/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Query = {
    dummy: () => 'dodo duck lives here'
};
const Mutation = {
    dummy: () => 'Dodo Duck'
};
const Subscription = {
    dummy: (_, __, { pubsub }) => pubsub.asyncIterator('DODO_DUCK')
};
const rootResolvers = {
    Query,
    Mutation,
    Subscription,
    Result: {
        __resolveType: (node) => {
            if (node.noOfEmployees)
                return 'Company';
            return 'Job';
        }
    },
    INode: {
        __resolveType: (node) => {
            if (node.noOfEmployees)
                return 'Company';
            return 'Company';
        }
    }
};
exports.default = rootResolvers;


/***/ }),

/***/ "./src/client/root/schema/oojob/applicants.graphql":
/*!*********************************************************!*\
  !*** ./src/client/root/schema/oojob/applicants.graphql ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Applicant {\n  applications: [String]!\n  shortlisted: [String]!\n  onhold: [String]!\n  rejected: [String]!\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/cursor.graphql":
/*!*****************************************************!*\
  !*** ./src/client/root/schema/oojob/cursor.graphql ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum Sort {\n  ASC\n  DESC\n}\n\ntype Pagination {\n  page: Int\n  first: Int\n  after: String\n  offset: Int\n  limit: Int\n  sort: Sort\n  previous: String\n  next: String\n  identifier: String\n}\n\ninput PaginationInput {\n  page: Int\n  first: Int\n  after: String\n  offset: Int\n  limit: Int\n  sort: Sort\n  previous: String\n  next: String\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/metadata.graphql":
/*!*******************************************************!*\
  !*** ./src/client/root/schema/oojob/metadata.graphql ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Metadata {\n  created_at: Timestamp\n  updated_at: Timestamp\n  published_date: Timestamp\n  end_date: Timestamp\n  last_active: Timestamp\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/permissions.graphql":
/*!**********************************************************!*\
  !*** ./src/client/root/schema/oojob/permissions.graphql ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum ProfileOperationOptions {\n  CREATE\n  READ\n  UPDATE\n  DELETE\n  BULK_UPDATE\n}\n\ntype MapProfilePermission {\n  key: String\n  profileOperations: [ProfileOperationOptions]\n}\n\ntype PermissionsBase {\n  permissions: MapProfilePermission\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/place.graphql":
/*!****************************************************!*\
  !*** ./src/client/root/schema/oojob/place.graphql ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Rating {\n  author: String\n  bestRating: Int\n  explanation: String\n  value: Int\n  worstRating: Int\n}\n\ntype AggregateRating {\n  itemReviewed: String!\n  ratingCount: Int!\n  reviewCount: Int\n}\n\ntype Review {\n  itemReviewed: String\n  aspect: String\n  body: String\n  rating: String\n}\n\ntype GeoLocation {\n  elevation: Int\n  latitude: Int\n  longitude: Int\n  postalCode: Int\n}\n\ntype Address {\n  country: String!\n  locality: String\n  region: String\n  postalCode: Int\n  street: String\n}\n\ntype Place {\n  address: Address\n  review: Review\n  aggregateRating: AggregateRating\n  branchCode: String\n  geo: GeoLocation\n}\n\ninput AddressInput {\n  country: String\n  locality: String\n  region: String\n  postalCode: Int\n  street: String\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/system.graphql":
/*!*****************************************************!*\
  !*** ./src/client/root/schema/oojob/system.graphql ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Range {\n  min: Int!\n  max: Int!\n}\n\ntype DefaultResponse {\n  status: Boolean\n  error: String\n  code: Int\n}\n\ntype Id {\n  id: ID!\n}\n\nenum EmailStatus {\n  WAITING\n  CONFIRMED\n  BLOCKED\n  EXPIRED\n}\n\ntype Email {\n  email: String\n  status: EmailStatus\n  show: Boolean\n}\n\ntype Attachment {\n  type: String\n  file: String\n  uploadDate: Timestamp\n  url: String\n  user: String\n  folder: String\n}\n\ntype Identifier {\n  identifier: String!\n  name: String\n  alternateName: String\n  type: String\n  additionalType: String\n  description: String\n  disambiguatingDescription: String\n  headline: String\n  slogan: String\n}\n\ninput RangeInput {\n  min: Int!\n  max: Int!\n}\n\ninput IdInput {\n  id: ID!\n}\n\ninput EmailInput {\n  email: String\n  show: Boolean\n}\n\ninput AttachmentInput {\n  type: String\n  file: String\n  user: String\n  folder: String\n}\n\ninput IdentifierInput {\n  name: String\n  alternateName: String\n  type: String\n  additionalType: String\n  description: String\n  disambiguatingDescription: String\n  headline: String\n  slogan: String\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/time.graphql":
/*!***************************************************!*\
  !*** ./src/client/root/schema/oojob/time.graphql ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum DaysOfWeek {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THRUSDAY\n  FRIDAY\n  STAURDAY\n  SUNDAY\n}\n\ntype Timestamp {\n  seconds: String\n  nanos: String\n}\n\ntype Time {\n  opens: Timestamp\n  closes: Timestamp\n  daysOfWeek: DaysOfWeek\n  validFrom: Timestamp\n  validThrough: Timestamp\n}\n\ninput TimestampInput {\n  seconds: String\n  nanos: String\n}\n"

/***/ }),

/***/ "./src/client/root/schema/schema.graphql":
/*!***********************************************!*\
  !*** ./src/client/root/schema/schema.graphql ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "scalar Date\n\ntype Edge {\n  cursor: String!\n  node: [Result!]!\n}\n\ntype PageInfo {\n  endCursor: String!\n  hasNextPage: Boolean!\n}\n\ninterface INode {\n  id: ID!\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\nunion Result = Job | Company\n\ntype Query {\n  dummy: String!\n}\n\ntype Mutation {\n  dummy: String!\n}\n\ntype Subscription {\n  dummy: String!\n}\n\nschema {\n  query: Query\n  mutation: Mutation\n  subscription: Subscription\n}\n"

/***/ }),

/***/ "./src/graphql.server.ts":
/*!*******************************!*\
  !*** ./src/graphql.server.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const applicantsSchema = __webpack_require__(/*! client/root/schema/oojob/applicants.graphql */ "./src/client/root/schema/oojob/applicants.graphql");
const companySchema = __webpack_require__(/*! client/company/schema/schema.graphql */ "./src/client/company/schema/schema.graphql");
const cursorSchema = __webpack_require__(/*! client/root/schema/oojob/cursor.graphql */ "./src/client/root/schema/oojob/cursor.graphql");
const jobSchema = __webpack_require__(/*! client/job/schema/schema.graphql */ "./src/client/job/schema/schema.graphql");
const metadataSchema = __webpack_require__(/*! client/root/schema/oojob/metadata.graphql */ "./src/client/root/schema/oojob/metadata.graphql");
const permissionsSchema = __webpack_require__(/*! client/root/schema/oojob/permissions.graphql */ "./src/client/root/schema/oojob/permissions.graphql");
const placeSchema = __webpack_require__(/*! client/root/schema/oojob/place.graphql */ "./src/client/root/schema/oojob/place.graphql");
const profileSchema = __webpack_require__(/*! client/profile/schema/schema.graphql */ "./src/client/profile/schema/schema.graphql");
const rootSchema = __webpack_require__(/*! client/root/schema/schema.graphql */ "./src/client/root/schema/schema.graphql");
const systemSchema = __webpack_require__(/*! client/root/schema/oojob/system.graphql */ "./src/client/root/schema/oojob/system.graphql");
const timeSchema = __webpack_require__(/*! client/root/schema/oojob/time.graphql */ "./src/client/root/schema/oojob/time.graphql");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const resolver_1 = __webpack_require__(/*! client/profile/resolver */ "./src/client/profile/resolver/index.ts");
const logger_1 = __webpack_require__(/*! logger */ "./src/logger.ts");
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const resolver_2 = __webpack_require__(/*! client/root/resolver */ "./src/client/root/resolver/index.ts");
const tracer_1 = __webpack_require__(/*! tracer */ "./src/tracer.ts");
exports.pubsub = new apollo_server_express_1.PubSub();
exports.typeDefs = [
    rootSchema,
    applicantsSchema,
    cursorSchema,
    metadataSchema,
    placeSchema,
    systemSchema,
    permissionsSchema,
    timeSchema,
    profileSchema,
    companySchema,
    jobSchema
];
exports.resolvers = lodash_1.merge({}, resolver_2.default, resolver_1.default);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
    context: ({ req, connection }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const tokenData = req.headers.authorization;
        let token = undefined;
        let accessDetails = undefined;
        if (tokenData) {
            token = tokenData.split(' ')[1];
        }
        if (token) {
            accessDetails = yield resolver_1.extractTokenMetadata(token);
        }
        return {
            req,
            connection,
            pubsub: exports.pubsub,
            tracer: tracer_1.default,
            accessDetails,
            token,
            logger: logger_1.default
        };
    }),
    tracing: true
});
exports.default = server;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
__webpack_require__(/*! dotenv/config */ "dotenv/config");
const oojob_server_1 = __webpack_require__(/*! oojob.server */ "./src/oojob.server.ts");
const cluster_1 = __webpack_require__(/*! cluster */ "cluster");
const logger_1 = __webpack_require__(/*! logger */ "./src/logger.ts");
const start = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { PORT } = process.env;
    const port = PORT || '8080';
    try {
        yield oojob_server_1.stopServer();
        yield oojob_server_1.startSyncServer(port);
    }
    catch (error) {
        console.error('Server Failed to start');
        console.error(error);
        process.exit(1);
    }
});
if (cluster_1.isMaster) {
    const numCPUs = __webpack_require__(/*! os */ "os").cpus().length;
    logger_1.default.info(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.fork();
    }
    cluster_1.on('fork', (worker) => {
        logger_1.default.info('worker is dead:', worker.isDead());
    });
    cluster_1.on('exit', (worker) => {
        logger_1.default.info('worker is dead:', worker.isDead());
    });
}
else {
    let currentApp = oojob_server_1.app;
    if (true) {
        module.hot.accept(/*! oojob.server */ "./src/oojob.server.ts", () => {
            oojob_server_1.server.removeListener('request', currentApp);
            oojob_server_1.server.on('request', oojob_server_1.app);
            currentApp = oojob_server_1.app;
        });
        module.hot.dispose(() => oojob_server_1.server.close());
    }
    start();
    logger_1.default.info(`Worker ${process.pid} started`);
}


/***/ }),

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __webpack_require__(/*! winston */ "winston");
const path_1 = __webpack_require__(/*! path */ "path");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const { combine, timestamp, prettyPrint } = winston_1.format;
const logDirectory = path_1.join(__dirname, 'log');
const isDevelopment = "development" === 'development';
const { FILE_LOG_LEVEL, CONSOLE_LOG_LEVEL } = process.env;
exports.loggerOptions = {
    file: {
        level: FILE_LOG_LEVEL || 'info',
        filename: `${logDirectory}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: CONSOLE_LOG_LEVEL || 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};
const loggerTransports = [
    new winston_1.transports.Console(Object.assign(Object.assign({}, exports.loggerOptions.console), { format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.colorize({ all: true }), winston_1.format.align(), winston_1.format.printf((info) => {
            const { level, message, label } = info;
            return `${level} [${label}]: ${message}`;
        })) }))
];
class AppLogger {
    constructor(options) {
        if (!isDevelopment) {
            fs_1.existsSync(logDirectory) || fs_1.mkdirSync(logDirectory);
        }
        this.logger = winston_1.createLogger({
            format: winston_1.format.combine(winston_1.format.label({ label: path_1.basename(process.mainModule ? process.mainModule.filename : 'unknown.file') }), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
            transports: isDevelopment
                ? [...loggerTransports]
                : [
                    ...loggerTransports,
                    new winston_1.transports.File(Object.assign(Object.assign({}, options.file), { format: combine(winston_1.format.printf((info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)) }))
                ],
            exitOnError: false
        });
    }
}
const { logger } = new AppLogger(exports.loggerOptions);
exports.default = logger;


/***/ }),

/***/ "./src/middlewares/cors.ts":
/*!*********************************!*\
  !*** ./src/middlewares/cors.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const corsLibrary = __webpack_require__(/*! cors */ "cors");
const { NODE_ENV = 'development', NOW_URL = 'https://oojob.io', FORCE_DEV = false } = process.env;
const prodUrls = ['https://oojob.io', 'https://alpha.oojob.io', 'https://beta.oojob.io', NOW_URL];
const isProduction = NODE_ENV === 'production' && !FORCE_DEV;
const corsOption = {
    origin: isProduction ? prodUrls.filter(Boolean) : [/localhost/],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
    credentials: true,
    exposedHeaders: ['authorization']
};
const cors = () => corsLibrary(corsOption);
exports.default = cors;


/***/ }),

/***/ "./src/middlewares/csrf.ts":
/*!*********************************!*\
  !*** ./src/middlewares/csrf.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hostValidation = __webpack_require__(/*! host-validation */ "host-validation");
const { NOW_URL = 'http://oojob.io' } = process.env;
const trustedHosts = [
    NOW_URL && new RegExp(`^${NOW_URL.replace('https://', '')}$`),
    /^oojob\.io$/,
    /^.*\.oojob\.io$/
].filter(Boolean);
const trustedReferers = [
    NOW_URL && new RegExp(`^${NOW_URL}($|\/.*)`),
    /^https:\/\/oojob\.io($|\/.*)/,
    /^https:\/\/.*\.spectrum\.chat($|\/.*)/
].filter(Boolean);
const csrf = hostValidation({
    hosts: trustedHosts,
    referers: trustedReferers,
    mode: 'either'
});
exports.default = csrf;


/***/ }),

/***/ "./src/middlewares/error-handler.ts":
/*!******************************************!*\
  !*** ./src/middlewares/error-handler.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (err) {
        console.error(err);
        res.status(500).send('Oops, something went wrong! Our engineers have been alerted and will fix this asap.');
    }
    else {
        return next();
    }
};
exports.default = errorHandler;


/***/ }),

/***/ "./src/middlewares/index.ts":
/*!**********************************!*\
  !*** ./src/middlewares/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const compression = __webpack_require__(/*! compression */ "compression");
const cors_1 = __webpack_require__(/*! middlewares/cors */ "./src/middlewares/cors.ts");
const csrf_1 = __webpack_require__(/*! middlewares/csrf */ "./src/middlewares/csrf.ts");
const error_handler_1 = __webpack_require__(/*! middlewares/error-handler */ "./src/middlewares/error-handler.ts");
const security_1 = __webpack_require__(/*! middlewares/security */ "./src/middlewares/security.ts");
const toobusy_1 = __webpack_require__(/*! middlewares/toobusy */ "./src/middlewares/toobusy.ts");
const { ENABLE_CSP = true, ENABLE_NONCE = true } = process.env;
const middlewares = (app) => {
    app.use(cors_1.default());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(csrf_1.default);
    app.use(error_handler_1.default);
    security_1.default(app, { enableCSP: Boolean(ENABLE_CSP), enableNonce: Boolean(ENABLE_NONCE) });
    app.use(toobusy_1.default());
};
exports.default = middlewares;


/***/ }),

/***/ "./src/middlewares/security.ts":
/*!*************************************!*\
  !*** ./src/middlewares/security.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const hpp = __webpack_require__(/*! hpp */ "hpp");
const helmet_1 = __webpack_require__(/*! helmet */ "helmet");
const express_enforces_ssl_1 = __webpack_require__(/*! express-enforces-ssl */ "express-enforces-ssl");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const { NODE_ENV = 'development', FORCE_DEV = false } = process.env;
const isProduction = NODE_ENV === 'production' && !FORCE_DEV;
const security = (app, { enableNonce, enableCSP }) => {
    app.set('trust proxy', true);
    app.set('x-powered-by', false);
    app.disable('x-powered-by');
    app.use(hpp());
    if (isProduction) {
        app.use(helmet_1.hsts({
            maxAge: 300,
            includeSubDomains: true,
            preload: true
        }));
        app.use(express_enforces_ssl_1.default());
    }
    app.use(helmet_1.frameguard({ action: 'sameorigin' }));
    app.use(helmet_1.xssFilter());
    app.use(helmet_1.ieNoOpen());
    app.use(helmet_1.noSniff());
    if (enableNonce) {
        app.use((request, response, next) => {
            response.locals.nonce = uuid_1.default.v4();
            next();
        });
    }
    const cspConfig = {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-eval'",
                'www.google-analytics.com',
                'cdn.ravenjs.com',
                'cdn.polyfill.io',
                'cdn.amplitude.com',
                (_, response) => `'nonce-${response.locals.nonce}'`
            ],
            imgSrc: ['https:', 'http:', "'self'", 'data:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ['https:', 'wss:'],
            childSrc: ['https:', 'http:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'none'"]
        },
        reportOnly: NODE_ENV === 'development' || Boolean(FORCE_DEV) || false,
        browserSniff: false
    };
    if (enableCSP) {
        app.use(helmet_1.contentSecurityPolicy(cspConfig));
    }
};
exports.default = security;


/***/ }),

/***/ "./src/middlewares/toobusy.ts":
/*!************************************!*\
  !*** ./src/middlewares/toobusy.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const toobusy = __webpack_require__(/*! toobusy-js */ "toobusy-js");
const isDevelopment = "development" === 'development';
exports.default = () => (req, res, next) => {
    if (!isDevelopment && toobusy()) {
        res.statusCode = 503;
        res.send('It looke like the sever is bussy. Wait few seconds...');
    }
    else {
        next();
    }
};


/***/ }),

/***/ "./src/oojob.server.ts":
/*!*****************************!*\
  !*** ./src/oojob.server.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const http_1 = __webpack_require__(/*! http */ "http");
const app_server_1 = __webpack_require__(/*! app.server */ "./src/app.server.ts");
const graphql_server_1 = __webpack_require__(/*! graphql.server */ "./src/graphql.server.ts");
const logger_1 = __webpack_require__(/*! logger */ "./src/logger.ts");
const normalize_1 = __webpack_require__(/*! utillity/normalize */ "./src/utillity/normalize.ts");
class OojobServer {
    constructor(app) {
        this.startSyncServer = (port) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PORT = normalize_1.normalizePort(port);
                this.server.listen(PORT, () => {
                    logger_1.default.info(`server ready at http://localhost:${PORT}${graphql_server_1.default.graphqlPath}`);
                    logger_1.default.info(`Subscriptions ready at ws://localhost:${PORT}${graphql_server_1.default.subscriptionsPath}`);
                    logger_1.default.info(`Try your health check at: http://localhost:${PORT}/.well-known/apollo/server-health`);
                });
            }
            catch (error) {
                yield this.stopServer();
            }
        });
        this.stopServer = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            process.on('SIGINT', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                logger_1.default.info('Closing oojob SyncServer ...');
                try {
                    this.server.close();
                    logger_1.default.info('oojob SyncServer Closed');
                }
                catch (error) {
                    console.error('Error Closing SyncServer Server Connection');
                    console.error(error);
                    process.kill(process.pid);
                }
            }));
        });
        this.app = app;
        graphql_server_1.default.applyMiddleware({
            app,
            onHealthCheck: () => new Promise((resolve, reject) => {
                if (parseInt('2') === 2) {
                    resolve();
                }
                else {
                    reject();
                }
            })
        });
        this.server = http_1.createServer(app);
        graphql_server_1.default.installSubscriptionHandlers(this.server);
    }
}
_a = new OojobServer(app_server_1.default), exports.startSyncServer = _a.startSyncServer, exports.stopServer = _a.stopServer, exports.server = _a.server, exports.app = _a.app;


/***/ }),

/***/ "./src/tracer.ts":
/*!***********************!*\
  !*** ./src/tracer.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const exporter_jaeger_1 = __webpack_require__(/*! @opentelemetry/exporter-jaeger */ "@opentelemetry/exporter-jaeger");
const metrics_1 = __webpack_require__(/*! @opentelemetry/metrics */ "@opentelemetry/metrics");
const node_1 = __webpack_require__(/*! @opentelemetry/node */ "@opentelemetry/node");
const exporter_prometheus_1 = __webpack_require__(/*! @opentelemetry/exporter-prometheus */ "@opentelemetry/exporter-prometheus");
const tracing_1 = __webpack_require__(/*! @opentelemetry/tracing */ "@opentelemetry/tracing");
const api_1 = __webpack_require__(/*! @opentelemetry/api */ "@opentelemetry/api");
const tracer = (serviceName) => {
    const provider = new node_1.NodeTracerProvider({
        plugins: {
            grpc: {
                enabled: true,
                path: '@opentelemetry/plugin-grpc'
            }
        }
    });
    const exporter = new exporter_jaeger_1.JaegerExporter({
        serviceName
    });
    const meterProvider = new metrics_1.MeterProvider({
        exporter: new exporter_prometheus_1.PrometheusExporter({ startServer: true }),
        interval: 1000
    });
    provider.addSpanProcessor(new tracing_1.SimpleSpanProcessor(exporter));
    provider.register();
    api_1.default.metrics.setGlobalMeterProvider(meterProvider);
    return api_1.default.trace.getTracer('service:gateway');
};
exports.default = tracer;


/***/ }),

/***/ "./src/utillity/crypto.ts":
/*!********************************!*\
  !*** ./src/utillity/crypto.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
class AppCrypto {
    constructor(app) {
        this.encrypt = (text) => {
            this.app.logger.info(`Encrypt for ${text}`);
            try {
                const cipher = crypto_1.createCipher(this.ENCRYPT_ALGORITHM, this.ENCRYPT_SECRET);
                let crypted = cipher.update(text, 'utf8', 'hex');
                crypted += cipher.final('hex');
                return crypted;
            }
            catch (error) {
                this.app.logger.error(error.message);
                return '';
            }
        };
        this.decrypt = (text) => {
            this.app.logger.info(`Decrypt for ${text}`);
            try {
                const decipher = crypto_1.createDecipher(this.ENCRYPT_ALGORITHM, this.ENCRYPT_SECRET);
                let dec = decipher.update(text, 'hex', 'utf8');
                dec += decipher.final('utf8');
                return dec;
            }
            catch (error) {
                this.app.logger.error(error.message);
                return '';
            }
        };
        const { ENCRYPT_SECRET = 'dododuck@N9', ENCRYPT_ALGORITHM = 'aes-256-ctr' } = process.env;
        this.app = app;
        this.ENCRYPT_ALGORITHM = ENCRYPT_ALGORITHM;
        this.ENCRYPT_SECRET = ENCRYPT_SECRET;
    }
}
exports.default = AppCrypto;


/***/ }),

/***/ "./src/utillity/index.ts":
/*!*******************************!*\
  !*** ./src/utillity/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const crypto_1 = __webpack_require__(/*! ./crypto */ "./src/utillity/crypto.ts");
const slugify_1 = __webpack_require__(/*! ./slugify */ "./src/utillity/slugify.ts");
class AppUtils {
    constructor(app) {
        this.applyUtils = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { encrypt, decrypt } = new crypto_1.default(this.app);
            const { slugify } = new slugify_1.default(this.app);
            this.app.utility = {
                encrypt,
                decrypt,
                slugify
            };
            return true;
        });
        this.app = app;
    }
}
exports.default = AppUtils;


/***/ }),

/***/ "./src/utillity/normalize.ts":
/*!***********************************!*\
  !*** ./src/utillity/normalize.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const normalizePort = (portValue) => {
    const port = parseInt(portValue, 10);
    if (isNaN(port)) {
        return 8080;
    }
    if (port >= 0) {
        return port;
    }
    return port;
};
exports.normalizePort = normalizePort;
exports.default = normalizePort;


/***/ }),

/***/ "./src/utillity/slugify.ts":
/*!*********************************!*\
  !*** ./src/utillity/slugify.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AppSlugify {
    constructor(app) {
        this.slugify = (text) => {
            return text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        };
        this.app = app;
    }
}
exports.AppSlugify = AppSlugify;
exports.default = AppSlugify;


/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi webpack/hot/poll?1000 ./src/index.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
module.exports = __webpack_require__(/*! ./src/index.ts */"./src/index.ts");


/***/ }),

/***/ "@oojob/oojob-protobuf":
/*!****************************************!*\
  !*** external "@oojob/oojob-protobuf" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@oojob/oojob-protobuf");

/***/ }),

/***/ "@oojob/protorepo-profile-node":
/*!************************************************!*\
  !*** external "@oojob/protorepo-profile-node" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@oojob/protorepo-profile-node");

/***/ }),

/***/ "@oojob/protorepo-profile-node/service_pb":
/*!***********************************************************!*\
  !*** external "@oojob/protorepo-profile-node/service_pb" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@oojob/protorepo-profile-node/service_pb");

/***/ }),

/***/ "@opentelemetry/api":
/*!*************************************!*\
  !*** external "@opentelemetry/api" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@opentelemetry/api");

/***/ }),

/***/ "@opentelemetry/exporter-jaeger":
/*!*************************************************!*\
  !*** external "@opentelemetry/exporter-jaeger" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@opentelemetry/exporter-jaeger");

/***/ }),

/***/ "@opentelemetry/exporter-prometheus":
/*!*****************************************************!*\
  !*** external "@opentelemetry/exporter-prometheus" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@opentelemetry/exporter-prometheus");

/***/ }),

/***/ "@opentelemetry/metrics":
/*!*****************************************!*\
  !*** external "@opentelemetry/metrics" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@opentelemetry/metrics");

/***/ }),

/***/ "@opentelemetry/node":
/*!**************************************!*\
  !*** external "@opentelemetry/node" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@opentelemetry/node");

/***/ }),

/***/ "@opentelemetry/tracing":
/*!*****************************************!*\
  !*** external "@opentelemetry/tracing" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@opentelemetry/tracing");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cluster");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv/config");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-enforces-ssl":
/*!***************************************!*\
  !*** external "express-enforces-ssl" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-enforces-ssl");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "grpc":
/*!***********************!*\
  !*** external "grpc" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("grpc");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),

/***/ "host-validation":
/*!**********************************!*\
  !*** external "host-validation" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("host-validation");

/***/ }),

/***/ "hpp":
/*!**********************!*\
  !*** external "hpp" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("hpp");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "toobusy-js":
/*!*****************************!*\
  !*** external "toobusy-js" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("toobusy-js");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NzcmYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2Vycm9yLWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFjZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2NyeXB0by50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L25vcm1hbGl6ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvc2x1Z2lmeS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9hcGlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1wcm9tZXRoZXVzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvbWV0cmljc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvcGVudGVsZW1ldHJ5L25vZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS90cmFjaW5nXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjbHVzdGVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29tcHJlc3Npb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZG90ZW52L2NvbmZpZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzLWVuZm9yY2VzLXNzbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JwY1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhlbG1ldFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhvc3QtdmFsaWRhdGlvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhwcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b29idXN5LWpzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHNsaWJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbnN0b25cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3QjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxxQkFBcUIsZ0JBQWdCO1FBQ3JDO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EscUJBQXFCLGdCQUFnQjtRQUNyQztRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGtCQUFrQiw4QkFBOEI7UUFDaEQ7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLG9CQUFvQiwyQkFBMkI7UUFDL0M7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE9BQU87UUFDUDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0EsbUJBQW1CLGNBQWM7UUFDakM7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLGdCQUFnQixLQUFLO1FBQ3JCO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLFlBQVk7UUFDNUI7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQSxjQUFjLDRCQUE0QjtRQUMxQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7O1FBRUo7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQSxlQUFlLDRCQUE0QjtRQUMzQztRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBLGVBQWUsNEJBQTRCO1FBQzNDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxpQkFBaUIsdUNBQXVDO1FBQ3hEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsaUJBQWlCLHVDQUF1QztRQUN4RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGlCQUFpQixzQkFBc0I7UUFDdkM7UUFDQTtRQUNBO1FBQ0EsUUFBUTtRQUNSO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLFVBQVU7UUFDVjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxjQUFjLHdDQUF3QztRQUN0RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLE9BQU87UUFDUDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxTQUFTO1FBQ1Q7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxRQUFRO1FBQ1I7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxlQUFlO1FBQ2Y7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQSxzQ0FBc0MsdUJBQXVCOzs7UUFHN0Q7UUFDQTs7Ozs7Ozs7Ozs7O0FDOXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRixXQUFXLG1CQUFPLENBQUMsZ0RBQU87O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMzQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFVO0FBQ2Q7QUFDQSxXQUFXLG1CQUFPLENBQUMsZ0RBQU87O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssbUJBQU8sQ0FBQywwRUFBb0I7QUFDakM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxNQUFNLEVBRU47Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcENELDhEQUFrQztBQUVsQyxrRkFBK0I7QUFFL0Isc0VBQTJCO0FBQzNCLDJGQUFvQztBQUVwQyxNQUFNLEdBQUc7SUFJUjtRQVlRLGdCQUFXLEdBQUcsR0FBUyxFQUFFO1lBQ2hDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDaEMsTUFBTSxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQzdCLENBQUM7UUFFTyxvQkFBZSxHQUFHLEdBQVMsRUFBRTtZQUNwQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDckIsQ0FBQztRQWxCQSxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sRUFBRTtRQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxnQkFBTTtRQUV4QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEVBQUU7SUFDbkIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxTQUFTO1FBQ3RCLE9BQU8sSUFBSSxHQUFHLEVBQUU7SUFDakIsQ0FBQztDQVVEO0FBRVksbUJBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUNwQyxrQkFBZSxtQkFBVyxDQUFDLEdBQUc7Ozs7Ozs7Ozs7OztBQ2xDOUIsaURBQWlELGlTQUFpUyx3QkFBd0Isa05BQWtOLEc7Ozs7Ozs7Ozs7O0FDQTVqQixzQ0FBc0MsZ0NBQWdDLGtCQUFrQixxQ0FBcUMsa0JBQWtCLHlDQUF5QywrQkFBK0Isd1ZBQXdWLDBCQUEwQiw4REFBOEQsd0JBQXdCLHlDQUF5QywwQkFBMEIsd1FBQXdRLEc7Ozs7Ozs7Ozs7Ozs7O0FDQTErQixxREFBNEI7QUFFNUIsMkhBQW9FO0FBRXBFLE1BQU0sRUFBRSxtQkFBbUIsR0FBRyxnQkFBZ0IsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHO0FBQzlELE1BQU0sYUFBYSxHQUFHLElBQUksNkNBQW9CLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUV0RyxrQkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7O0FDUDVCLHFJQVVpRDtBQVdqRCxtR0FBOEU7QUFDOUUseUhBU21DO0FBRW5DLDBHQUEyRDtBQUU5Qyw0QkFBb0IsR0FBRyxDQUFPLEtBQWEsRUFBd0MsRUFBRTtJQUNqRyxNQUFNLFlBQVksR0FBRyxJQUFJLHlCQUFZLEVBQUU7SUFFdkMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFFNUIsTUFBTSxHQUFHLEdBQWdDLEVBQUU7SUFDM0MsSUFBSTtRQUNILE1BQU0sUUFBUSxHQUFHLENBQUMsTUFBTSx5QkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFrQjtRQUNuRSxHQUFHLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDckMsR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3pDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUMzQyxHQUFHLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDekMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQy9CLEdBQUcsQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN6QyxHQUFHLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDakMsR0FBRyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFO0tBQ3JDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZixHQUFHLENBQUMsUUFBUSxHQUFHLEtBQUs7UUFDcEIsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJO1FBQ3JCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSTtRQUN0QixHQUFHLENBQUMsVUFBVSxHQUFHLEtBQUs7UUFDdEIsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJO1FBQ2hCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSTtRQUNkLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSTtRQUNyQixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUk7UUFDakIsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJO0tBQ25CO0lBRUQsT0FBTyxHQUFHO0FBQ1gsQ0FBQztBQUVZLGFBQUssR0FBbUI7SUFDcEMsZ0JBQWdCLEVBQUUsQ0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO1FBQzVELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1FBRWxDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsMENBQTBDLEVBQUU7WUFDMUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7U0FDaEMsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUEwQixFQUFFO1FBRXJDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQVMsRUFBRTtZQUNqQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUTtZQUMvQixNQUFNLG1CQUFtQixHQUFHLElBQUksb0NBQXVCLEVBQUU7WUFDekQsSUFBSSxRQUFRLEVBQUU7Z0JBQ2IsbUJBQW1CLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQzthQUN6QztZQUVELElBQUk7Z0JBQ0gsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFNLDhCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQW9CO2dCQUNwRixHQUFHLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3BDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRTtnQkFDaEMsR0FBRyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFO2dCQUNsQyxJQUFJLENBQUMsR0FBRyxFQUFFO2FBQ1Y7WUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUMzQixHQUFHLENBQUMsTUFBTSxHQUFHLEtBQUs7Z0JBQ2xCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTztnQkFDbkIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJO2dCQUNmLElBQUksQ0FBQyxHQUFHLEVBQUU7YUFDVjtRQUNGLENBQUMsRUFBQztRQUVGLE9BQU8sR0FBRztJQUNYLENBQUM7SUFDRCxhQUFhLEVBQUUsQ0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxpQ0FBb0IsRUFBRTtRQUVuRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSztRQUN6QixJQUFJLEtBQUssRUFBRTtZQUNWLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDaEM7UUFFRCxNQUFNLEdBQUcsR0FBMEIsRUFBRTtRQUNyQyxJQUFJO1lBQ0gsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFNLDJCQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBb0I7WUFDOUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQ3BDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUNoQyxHQUFHLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUU7U0FDbEM7UUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSztZQUNsQixHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU87WUFDbkIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJO1NBQ2Y7UUFFRCxPQUFPLEdBQUc7SUFDWCxDQUFDO0lBQ0QsV0FBVyxFQUFFLENBQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtRQUMzRCxJQUFJLEdBQUcsR0FBZ0MsRUFBRTtRQUV6QyxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksV0FBVztRQUNuRCxJQUFJLEtBQUssRUFBRTtZQUNWLEdBQUcsR0FBRyxNQUFNLDRCQUFvQixDQUFDLEtBQUssQ0FBQztTQUN2QztRQUVELE9BQU8sR0FBRztJQUNYLENBQUM7SUFDRCxZQUFZLEVBQUUsQ0FBTyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO1FBQzVELE1BQU0sR0FBRyxHQUF1QixFQUFFO1FBRWxDLE1BQU0sWUFBWSxHQUFHLElBQUkseUJBQVksRUFBRTtRQUN2QyxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksV0FBVztRQUNuRCxJQUFJLEtBQUssRUFBRTtZQUNWLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1NBQzVCO1FBRUQsSUFBSTtZQUNILE1BQU0sYUFBYSxHQUFHLENBQUMsTUFBTSwwQkFBWSxDQUFDLFlBQVksQ0FBQyxDQUFpQjtZQUN4RSxHQUFHLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxjQUFjLEVBQUU7WUFDakQsR0FBRyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUMsZUFBZSxFQUFFO1lBQ25ELEdBQUcsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRTtTQUNwQztRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2YsR0FBRyxDQUFDLFlBQVksR0FBRyxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRTtZQUN0QixHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUs7U0FDakI7UUFFRCxPQUFPLEdBQUc7SUFDWCxDQUFDO0lBQ0QsV0FBVyxFQUFFLENBQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFOztRQUN0RCxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ25CLE1BQU0sSUFBSSwyQ0FBbUIsQ0FBQyx1QkFBdUIsQ0FBQztTQUN0RDtRQUVELElBQUksS0FBSyxDQUFDLEVBQUUsS0FBSyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUM7U0FDakQ7UUFFRCxNQUFNLEdBQUcsR0FBa0IsRUFBRTtRQUM3QixNQUFNLGtCQUFrQixHQUFHLElBQUksK0JBQWtCLEVBQUU7UUFDbkQsa0JBQWtCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFFekMsSUFBSTtZQUNILE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBTSx5QkFBVyxDQUFDLGtCQUFrQixDQUFDLENBQVk7WUFDckUsTUFBTSxlQUFlLEdBQTBCLEVBQUU7WUFFakQsTUFBTSxLQUFLLEdBQUc7Z0JBQ2IsS0FBSyxRQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsMENBQUUsUUFBUSxFQUFFO2dCQUV4QyxJQUFJLFFBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSwwQ0FBRSxPQUFPLEVBQUU7YUFDdEM7WUFFRCxlQUFlLENBQUMsUUFBUSxTQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsMENBQUUsV0FBVyxFQUFFO1lBRWxFLEdBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRTtZQUN2QyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxZQUFZLEVBQUU7WUFDekMsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsYUFBYSxFQUFFO1lBQzNDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLGFBQWEsRUFBRTtZQUMzQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUs7WUFDakIsR0FBRyxDQUFDLFFBQVEsR0FBRyxlQUFlO1NBQzlCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQztTQUN0QjtRQUVELE9BQU8sR0FBRztJQUNYLENBQUM7Q0FDRDtBQUVZLGdCQUFRLEdBQXNCO0lBQzFDLElBQUksRUFBRSxDQUFPLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7UUFDaEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBRXpDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLEVBQUU7WUFDN0QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUU7U0FDaEMsQ0FBQztRQUNGLE1BQU0sR0FBRyxHQUF1QixFQUFFO1FBRWxDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQVMsRUFBRTtZQUNqQyxNQUFNLFdBQVcsR0FBRyxJQUFJLHdCQUFXLEVBQUU7WUFDckMsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBUSxFQUFFO2dCQUNwQixXQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7YUFDdkM7WUFDRCxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLEVBQUU7Z0JBQ3BCLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQzthQUN2QztZQUVELElBQUk7Z0JBQ0gsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFNLGtCQUFJLENBQUMsV0FBVyxDQUFDLENBQWlCO2dCQUMvRCxHQUFHLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2pELEdBQUcsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDLGVBQWUsRUFBRTtnQkFDbkQsR0FBRyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxFQUFFO2FBQ1Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZixHQUFHLENBQUMsWUFBWSxHQUFHLEVBQUU7Z0JBQ3JCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRTtnQkFDdEIsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLO2dCQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO2FBQ1Y7UUFDRixDQUFDLEVBQUM7UUFFRixPQUFPLEdBQUc7SUFDWCxDQUFDO0lBQ0QsYUFBYSxFQUFFLENBQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTs7UUFDckMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDeEUsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDeEUsTUFBTSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxVQUFVLEVBQUU7UUFDM0QsTUFBTSxVQUFVLEdBQUcsSUFBSSwyQkFBVSxFQUFFO1FBQ25DLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE1BQU0sZUFBZSxHQUFHLElBQUksNEJBQWUsRUFBRTtRQUM3QyxVQUFJLEtBQUssQ0FBQyxRQUFRLDBDQUFFLFFBQVEsRUFBRTtZQUM3QixlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQ3BEO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxzQkFBSyxFQUFFO1FBQ3pCLFVBQUksS0FBSyxDQUFDLEtBQUssMENBQUUsS0FBSyxFQUFFO1lBQ3ZCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7U0FDakM7UUFDRCxVQUFJLEtBQUssQ0FBQyxLQUFLLDBDQUFFLElBQUksRUFBRTtZQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQy9CO1FBQ0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxvQkFBTyxFQUFFO1FBQzdCLElBQUksS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE1BQU0sRUFBRTtZQUNsQixPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDL0I7UUFDRCxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLEVBQUU7WUFDcEIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQ25DO1FBQ0QsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7UUFDL0IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUM7UUFDcEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLDJCQUFhLENBQUMsT0FBTyxDQUFDLENBQU87UUFFaEQsTUFBTSxlQUFlLEdBQWE7WUFDakMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUU7U0FDZjtRQUVELE9BQU8sZUFBZTtJQUN2QixDQUFDO0lBQ0QsTUFBTSxFQUFFLENBQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtRQUN0RCxNQUFNLEdBQUcsR0FBMEIsRUFBRTtRQUNyQyxNQUFNLFlBQVksR0FBRyxJQUFJLHlCQUFZLEVBQUU7UUFFdkMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLFdBQVc7UUFDbkQsSUFBSSxLQUFLLEVBQUU7WUFDVixZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztTQUM1QjtRQUVELElBQUk7WUFDSCxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sb0JBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBb0I7WUFDakUsR0FBRyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ2xDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUM5QixHQUFHLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUU7U0FDaEM7UUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSztZQUNsQixHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU87WUFDbkIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJO1NBQ2Y7UUFFRCxPQUFPLEdBQUc7SUFDWCxDQUFDO0NBQ0Q7QUFFWSx3QkFBZ0IsR0FBRztJQUMvQixRQUFRLEVBQVIsZ0JBQVE7SUFDUixLQUFLLEVBQUwsYUFBSztDQUNMO0FBQ0Qsa0JBQWUsd0JBQWdCOzs7Ozs7Ozs7Ozs7QUNqUy9CLG9DQUFvQyx3Q0FBd0MsaUJBQWlCLDhCQUE4Qiw0QkFBNEIsd0RBQXdELDBCQUEwQixpQ0FBaUMsb0JBQW9CLHlDQUF5QywwQkFBMEIsb0RBQW9ELGtCQUFrQixvU0FBb1MsdUJBQXVCLHNFQUFzRSxnQ0FBZ0Msd0xBQXdMLDBCQUEwQix5Q0FBeUMsZ0NBQWdDLG1EQUFtRCx3QkFBd0IsNFNBQTRTLGlDQUFpQyx1QkFBdUIsOEJBQThCLG9CQUFvQiw0QkFBNEIsMkNBQTJDLHdCQUF3Qiw0REFBNEQsdUJBQXVCLGlTQUFpUywwQkFBMEIsZ0pBQWdKLEc7Ozs7Ozs7Ozs7Ozs7O0FDQWpzRSw2RkFBMEM7QUFDMUMsdURBQWdDO0FBRW5CLHFCQUFhLEdBQUcsZ0JBQVMsQ0FBQyxpQkFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBYSxDQUFDO0FBQzFFLHNCQUFjLEdBQUcsZ0JBQVMsQ0FBQyxpQkFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBYSxDQUFDO0FBQzVFLG1CQUFXLEdBQUcsZ0JBQVMsQ0FBQyxpQkFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBYSxDQUFDO0FBQ3RFLHFCQUFhLEdBQUcsZ0JBQVMsQ0FBQyxpQkFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBYSxDQUFDO0FBQzFFLHdCQUFnQixHQUFHLGdCQUFTLENBQUMsaUJBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBYSxDQUFDO0FBQ2hGLHFCQUFhLEdBQUcsZ0JBQVMsQ0FBQyxpQkFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBYSxDQUFDO0FBQzFFLFlBQUksR0FBRyxnQkFBUyxDQUFDLGlCQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFhLENBQUM7QUFDeEQsbUJBQVcsR0FBRyxnQkFBUyxDQUFDLGlCQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFhLENBQUM7QUFDdEUsY0FBTSxHQUFHLGdCQUFTLENBQUMsaUJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWEsQ0FBQztBQUM1RCxvQkFBWSxHQUFHLGdCQUFTLENBQUMsaUJBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDVnJGLE1BQU0sS0FBSyxHQUFtQjtJQUM3QixLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsc0JBQXNCO0NBQ25DO0FBQ0QsTUFBTSxRQUFRLEdBQXNCO0lBQ25DLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXO0NBQ3hCO0FBQ0QsTUFBTSxZQUFZLEdBQTBCO0lBQzNDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7Q0FDL0Q7QUFFRCxNQUFNLGFBQWEsR0FBYztJQUNoQyxLQUFLO0lBQ0wsUUFBUTtJQUNSLFlBQVk7SUFDWixNQUFNLEVBQUU7UUFDUCxhQUFhLEVBQUUsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUM1QixJQUFJLElBQUksQ0FBQyxhQUFhO2dCQUFFLE9BQU8sU0FBUztZQUV4QyxPQUFPLEtBQUs7UUFDYixDQUFDO0tBQ0Q7SUFDRCxLQUFLLEVBQUU7UUFDTixhQUFhLEVBQUUsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUM1QixJQUFJLElBQUksQ0FBQyxhQUFhO2dCQUFFLE9BQU8sU0FBUztZQUd4QyxPQUFPLFNBQVM7UUFDakIsQ0FBQztLQUNEO0NBQ0Q7QUFFRCxrQkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7QUNqQzVCLGtDQUFrQyxvR0FBb0csRzs7Ozs7Ozs7Ozs7QUNBdEksNkJBQTZCLGtCQUFrQixxQkFBcUIsb0pBQW9KLDJCQUEyQiw4SEFBOEgsRzs7Ozs7Ozs7Ozs7QUNBalgsaUNBQWlDLG1JQUFtSSxHOzs7Ozs7Ozs7OztBQ0FwSyxnREFBZ0Qsd0RBQXdELCtCQUErQixrRUFBa0UsMEJBQTBCLHdDQUF3QyxHOzs7Ozs7Ozs7OztBQ0EzUSwrQkFBK0IsaUdBQWlHLDBCQUEwQixxRUFBcUUsaUJBQWlCLCtFQUErRSxzQkFBc0IsMkVBQTJFLGtCQUFrQixrR0FBa0csZ0JBQWdCLHVIQUF1SCx3QkFBd0IsaUdBQWlHLEc7Ozs7Ozs7Ozs7O0FDQXB4Qiw4QkFBOEIsNkJBQTZCLDBCQUEwQixvREFBb0QsYUFBYSxjQUFjLHNCQUFzQixpREFBaUQsZ0JBQWdCLDREQUE0RCxxQkFBcUIsNkdBQTZHLHFCQUFxQiwrTUFBK00sc0JBQXNCLDZCQUE2QixtQkFBbUIsY0FBYyxzQkFBc0IscUNBQXFDLDJCQUEyQixxRUFBcUUsMkJBQTJCLHdMQUF3TCxHOzs7Ozs7Ozs7OztBQ0EvbEMsbUNBQW1DLGlGQUFpRixvQkFBb0IsdUNBQXVDLGVBQWUseUhBQXlILDBCQUEwQix1Q0FBdUMsRzs7Ozs7Ozs7Ozs7QUNBeFgsNENBQTRDLDBDQUEwQyxtQkFBbUIsa0RBQWtELHFCQUFxQixnRUFBZ0UsZ0RBQWdELHFCQUFxQixtQkFBbUIscUJBQXFCLHVCQUF1QixxQkFBcUIsWUFBWSx1RUFBdUUsRzs7Ozs7Ozs7Ozs7Ozs7O0FDQTVkLHFKQUErRTtBQUMvRSxvSUFBcUU7QUFDckUseUlBQXVFO0FBQ3ZFLHdIQUE2RDtBQUM3RCwrSUFBMkU7QUFDM0Usd0pBQWlGO0FBQ2pGLHNJQUFxRTtBQUNyRSxvSUFBcUU7QUFDckUsMkhBQStEO0FBQy9ELHlJQUF1RTtBQUN2RSxtSUFBbUU7QUFFbkUsMEdBQTREO0FBQzVELGdIQUFnRjtBQUloRixzRUFBMkI7QUFDM0IsNkRBQThCO0FBQzlCLDBHQUFnRDtBQUNoRCxzRUFBMkI7QUFHZCxjQUFNLEdBQUcsSUFBSSw4QkFBTSxFQUFFO0FBQ3JCLGdCQUFRLEdBQUc7SUFDdkIsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixZQUFZO0lBQ1osY0FBYztJQUNkLFdBQVc7SUFDWCxZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLFVBQVU7SUFDVixhQUFhO0lBQ2IsYUFBYTtJQUNiLFNBQVM7Q0FDVDtBQUNZLGlCQUFTLEdBQUcsY0FBSyxDQUFDLEVBQUUsRUFBRSxrQkFBYSxFQUFFLGtCQUFnQixDQUFDO0FBU25FLE1BQU0sTUFBTSxHQUFHLElBQUksb0NBQVksQ0FBQztJQUMvQixRQUFRLEVBQVIsZ0JBQVE7SUFDUixTQUFTLEVBQVQsaUJBQVM7SUFDVCxPQUFPLEVBQUUsQ0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYTtRQUMzQyxJQUFJLEtBQUssR0FBdUIsU0FBUztRQUN6QyxJQUFJLGFBQWEsR0FBc0MsU0FBUztRQUVoRSxJQUFJLFNBQVMsRUFBRTtZQUNkLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQjtRQUNELElBQUksS0FBSyxFQUFFO1lBQ1YsYUFBYSxHQUFHLE1BQU0sK0JBQW9CLENBQUMsS0FBSyxDQUFDO1NBQ2pEO1FBRUQsT0FBTztZQUNOLEdBQUc7WUFDSCxVQUFVO1lBQ1YsTUFBTSxFQUFOLGNBQU07WUFDTixNQUFNLEVBQU4sZ0JBQU07WUFDTixhQUFhO1lBQ2IsS0FBSztZQUNMLE1BQU0sRUFBTixnQkFBTTtTQUNOO0lBQ0YsQ0FBQztJQUNELE9BQU8sRUFBRSxJQUFJO0NBQ2IsQ0FBQztBQUVGLGtCQUFlLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRXJCLDBEQUFzQjtBQUV0Qix3RkFBdUU7QUFDdkUsZ0VBQTRDO0FBRTVDLHNFQUEyQjtBQUkzQixNQUFNLEtBQUssR0FBRyxHQUFTLEVBQUU7SUFDeEIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHO0lBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxNQUFNO0lBRTNCLElBQUk7UUFDSCxNQUFNLHlCQUFVLEVBQUU7UUFDbEIsTUFBTSw4QkFBZSxDQUFDLElBQUksQ0FBQztLQUMzQjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztRQUN2QyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNmO0FBQ0YsQ0FBQztBQUVELElBQUksa0JBQVEsRUFBRTtJQUNiLE1BQU0sT0FBTyxHQUFHLG1CQUFPLENBQUMsY0FBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTTtJQUUzQyxnQkFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLE9BQU8sQ0FBQyxHQUFHLGFBQWEsQ0FBQztJQUcvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pDLGNBQUksRUFBRTtLQUNOO0lBRUQsWUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBQ3JCLGdCQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoRCxDQUFDLENBQUM7SUFFRixZQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDckIsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hELENBQUMsQ0FBQztDQUNGO0tBQU07SUFLTixJQUFJLFVBQVUsR0FBRyxrQkFBRztJQUNwQixJQUFJLElBQVUsRUFBRTtRQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLDJDQUFjLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLHFCQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7WUFDNUMscUJBQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLGtCQUFHLENBQUM7WUFDekIsVUFBVSxHQUFHLGtCQUFHO1FBQ2pCLENBQUMsQ0FBQztRQVNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDeEM7SUFJRCxLQUFLLEVBQUU7SUFFUCxnQkFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQztDQUM1Qzs7Ozs7Ozs7Ozs7Ozs7O0FDcEVELGdFQUFpRjtBQUNqRix1REFBcUM7QUFDckMsaURBQTBDO0FBRTFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxHQUFHLGdCQUFNO0FBQ2xELE1BQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO0FBQzNDLE1BQU0sYUFBYSxHQUFHLGFBQW9CLEtBQUssYUFBYTtBQUc1RCxNQUFNLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUc7QUFDNUMscUJBQWEsR0FBRztJQUM1QixJQUFJLEVBQUU7UUFDTCxLQUFLLEVBQUUsY0FBYyxJQUFJLE1BQU07UUFDL0IsUUFBUSxFQUFFLEdBQUcsWUFBWSxlQUFlO1FBQ3hDLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsT0FBTztRQUNoQixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxLQUFLO0tBQ2Y7SUFDRCxPQUFPLEVBQUU7UUFDUixLQUFLLEVBQUUsaUJBQWlCLElBQUksT0FBTztRQUNuQyxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLElBQUksRUFBRSxLQUFLO1FBQ1gsUUFBUSxFQUFFLElBQUk7S0FDZDtDQUNEO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRztJQUN4QixJQUFJLG9CQUFVLENBQUMsT0FBTyxpQ0FDbEIscUJBQWEsQ0FBQyxPQUFPLEtBQ3hCLE1BQU0sRUFBRSxnQkFBTSxDQUFDLE9BQU8sQ0FDckIsZ0JBQU0sQ0FBQyxTQUFTLEVBQUUsRUFDbEIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFDOUIsZ0JBQU0sQ0FBQyxLQUFLLEVBQUUsRUFDZCxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3RCLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUk7WUFHdEMsT0FBTyxHQUFHLEtBQUssS0FBSyxLQUFLLE1BQU0sT0FBTyxFQUFFO1FBQ3pDLENBQUMsQ0FBQyxDQUNGLElBQ0E7Q0FDRjtBQUVELE1BQU0sU0FBUztJQUlkLFlBQVksT0FBdUI7UUFDbEMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNuQixlQUFVLENBQUMsWUFBWSxDQUFDLElBQUksY0FBUyxDQUFDLFlBQVksQ0FBQztTQUNuRDtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsc0JBQVksQ0FBQztZQUMxQixNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxPQUFPLENBQ3JCLGdCQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxFQUNwRyxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQ25EO1lBQ0QsVUFBVSxFQUFFLGFBQWE7Z0JBQ3hCLENBQUMsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQztvQkFDQSxHQUFHLGdCQUFnQjtvQkFDbkIsSUFBSSxvQkFBVSxDQUFDLElBQUksaUNBQ2YsT0FBTyxDQUFDLElBQUksS0FDZixNQUFNLEVBQUUsT0FBTyxDQUNkLGdCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUMzRixJQUNBO2lCQUNEO1lBQ0osV0FBVyxFQUFFLEtBQUs7U0FDbEIsQ0FBQztJQUNILENBQUM7Q0FDRDtBQUVELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxxQkFBYSxDQUFDO0FBQy9DLGtCQUFlLE1BQU07Ozs7Ozs7Ozs7Ozs7OztBQzVFckIsNERBQW1DO0FBRW5DLE1BQU0sRUFBRSxRQUFRLEdBQUcsYUFBYSxFQUFFLE9BQU8sR0FBRyxrQkFBa0IsRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUc7QUFDakcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx3QkFBd0IsRUFBRSx1QkFBdUIsRUFBRSxPQUFPLENBQUM7QUFDakcsTUFBTSxZQUFZLEdBQUcsUUFBUSxLQUFLLFlBQVksSUFBSSxDQUFDLFNBQVM7QUFFNUQsTUFBTSxVQUFVLEdBQUc7SUFDbEIsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFDL0QsT0FBTyxFQUFFLDZDQUE2QztJQUN0RCxXQUFXLEVBQUUsSUFBSTtJQUNqQixjQUFjLEVBQUUsQ0FBQyxlQUFlLENBQUM7Q0FDakM7QUFFRCxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO0FBQzFDLGtCQUFlLElBQUk7Ozs7Ozs7Ozs7Ozs7OztBQ2RuQixxRkFBaUQ7QUFVakQsTUFBTSxFQUFFLE9BQU8sR0FBRyxpQkFBaUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHO0FBQ25ELE1BQU0sWUFBWSxHQUFHO0lBQ3BCLE9BQU8sSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDN0QsYUFBYTtJQUNiLGlCQUFpQjtDQUNqQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFHakIsTUFBTSxlQUFlLEdBQUc7SUFDdkIsT0FBTyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksT0FBTyxVQUFVLENBQUM7SUFDNUMsOEJBQThCO0lBQzlCLHVDQUF1QztDQUN2QyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFFakIsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDO0lBQzNCLEtBQUssRUFBRSxZQUFZO0lBQ25CLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLElBQUksRUFBRSxRQUFRO0NBQ2QsQ0FBQztBQUNGLGtCQUFlLElBQUk7Ozs7Ozs7Ozs7Ozs7OztBQzNCbkIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFVLEVBQUUsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDcEYsSUFBSSxHQUFHLEVBQUU7UUFDUixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxxRkFBcUYsQ0FBQztLQUUzRztTQUFNO1FBQ04sT0FBTyxJQUFJLEVBQUU7S0FDYjtBQUNGLENBQUM7QUFFRCxrQkFBZSxZQUFZOzs7Ozs7Ozs7Ozs7Ozs7QUNaM0IseUVBQXlDO0FBQ3pDLDBFQUEwQztBQUcxQyx3RkFBbUM7QUFDbkMsd0ZBQW1DO0FBQ25DLG1IQUFvRDtBQUNwRCxvR0FBMkM7QUFDM0MsaUdBQXlDO0FBRXpDLE1BQU0sRUFBRSxVQUFVLEdBQUcsSUFBSSxFQUFFLFlBQVksR0FBRyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRztBQUU5RCxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQWdCLEVBQUUsRUFBRTtJQUV4QyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQUksRUFBRSxDQUFDO0lBR2YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFHMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUV0QixHQUFHLENBQUMsR0FBRyxDQUFDLGNBQUksQ0FBQztJQUNiLEdBQUcsQ0FBQyxHQUFHLENBQUMsdUJBQVksQ0FBQztJQUNyQixrQkFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO0lBR3JGLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sRUFBRSxDQUFDO0FBQ25CLENBQUM7QUFFRCxrQkFBZSxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7QUMvQjFCLGtEQUEwQjtBQUcxQiw2REFBOEY7QUFFOUYsdUdBQXFEO0FBQ3JELHVEQUF1QjtBQUV2QixNQUFNLEVBQUUsUUFBUSxHQUFHLGFBQWEsRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUc7QUFDbkUsTUFBTSxZQUFZLEdBQUcsUUFBUSxLQUFLLFlBQVksSUFBSSxDQUFDLFNBQVM7QUFFNUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFnQixFQUFFLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBZ0QsRUFBRSxFQUFFO0lBRS9HLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQztJQUc1QixHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUM7SUFJOUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFHM0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVkLElBQUksWUFBWSxFQUFFO1FBQ2pCLEdBQUcsQ0FBQyxHQUFHLENBQ04sYUFBSSxDQUFDO1lBS0osTUFBTSxFQUFFLEdBQUc7WUFDWCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJO1NBQ2IsQ0FBQyxDQUNGO1FBRUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyw4QkFBa0IsRUFBRSxDQUFDO0tBQzdCO0lBR0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFHN0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBUyxFQUFFLENBQUM7SUFLcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBUSxFQUFFLENBQUM7SUFNbkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBTyxFQUFFLENBQUM7SUFFbEIsSUFBSSxXQUFXLEVBQUU7UUFJaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQWdCLEVBQUUsUUFBa0IsRUFBRSxJQUFrQixFQUFFLEVBQUU7WUFDcEUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsY0FBSSxDQUFDLEVBQUUsRUFBRTtZQUNqQyxJQUFJLEVBQUU7UUFDUCxDQUFDLENBQUM7S0FDRjtJQUtELE1BQU0sU0FBUyxHQUFHO1FBQ2pCLFVBQVUsRUFBRTtZQUlYLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUd0QixTQUFTLEVBQUU7Z0JBQ1YsUUFBUTtnQkFDUixlQUFlO2dCQUNmLDBCQUEwQjtnQkFDMUIsaUJBQWlCO2dCQUNqQixpQkFBaUI7Z0JBQ2pCLG1CQUFtQjtnQkFPbkIsQ0FBQyxDQUFVLEVBQUUsUUFBa0IsRUFBRSxFQUFFLENBQUMsVUFBVSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRzthQUN0RTtZQUlELE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7WUFHdkQsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDO1lBSXZDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7WUFNOUIsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztZQUc3QixTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFHckIsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQ3BCO1FBR0QsVUFBVSxFQUFFLFFBQVEsS0FBSyxhQUFhLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUs7UUFFckUsWUFBWSxFQUFFLEtBQUs7S0FDbkI7SUFFRCxJQUFJLFNBQVMsRUFBRTtRQUNkLEdBQUcsQ0FBQyxHQUFHLENBQUMsOEJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDekM7QUFDRixDQUFDO0FBRUQsa0JBQWUsUUFBUTs7Ozs7Ozs7Ozs7Ozs7O0FDbEl2QixvRUFBcUM7QUFHckMsTUFBTSxhQUFhLEdBQUcsYUFBb0IsS0FBSyxhQUFhO0FBRTVELGtCQUFlLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDeEUsSUFBSSxDQUFDLGFBQWEsSUFBSSxPQUFPLEVBQUUsRUFBRTtRQUNoQyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUc7UUFDcEIsR0FBRyxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQztLQUNqRTtTQUFNO1FBRU4sSUFBSSxFQUFFO0tBQ047QUFDRixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2JELHVEQUEyQztBQUUzQyxrRkFBNEI7QUFFNUIsOEZBQTBDO0FBQzFDLHNFQUEyQjtBQUMzQixpR0FBa0Q7QUFFbEQsTUFBTSxXQUFXO0lBSWhCLFlBQVksR0FBZ0I7UUFrQjVCLG9CQUFlLEdBQUcsQ0FBTyxJQUFZLEVBQUUsRUFBRTtZQUN4QyxJQUFJO2dCQUNILE1BQU0sSUFBSSxHQUFHLHlCQUFhLENBQUMsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO29CQUM3QixnQkFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsSUFBSSxHQUFHLHdCQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25GLGdCQUFNLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxJQUFJLEdBQUcsd0JBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO29CQUM5RixnQkFBTSxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsSUFBSSxtQ0FBbUMsQ0FBQztnQkFDbkcsQ0FBQyxDQUFDO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZixNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUU7YUFDdkI7UUFDRixDQUFDO1FBRUQsZUFBVSxHQUFHLEdBQVMsRUFBRTtZQUN2QixPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFTLEVBQUU7Z0JBQy9CLGdCQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDO2dCQUUzQyxJQUFJO29CQUNILElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUNuQixnQkFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztpQkFDdEM7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQztvQkFDM0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztpQkFDekI7WUFDRixDQUFDLEVBQUM7UUFDSCxDQUFDO1FBM0NBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztRQUNkLHdCQUFhLENBQUMsZUFBZSxDQUFDO1lBQzdCLEdBQUc7WUFDSCxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQ25CLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUUvQixJQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3hCLE9BQU8sRUFBRTtpQkFDVDtxQkFBTTtvQkFDTixNQUFNLEVBQUU7aUJBQ1I7WUFDRixDQUFDLENBQUM7U0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxtQkFBWSxDQUFDLEdBQUcsQ0FBQztRQUMvQix3QkFBYSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkQsQ0FBQztDQTZCRDtBQUVZLDBDQUFtRTs7Ozs7Ozs7Ozs7Ozs7O0FDM0RoRixzSEFBK0Q7QUFDL0QsOEZBQXNEO0FBQ3RELHFGQUF3RDtBQUN4RCxrSUFBdUU7QUFDdkUsOEZBQTREO0FBQzVELGtGQUE4QztBQUU5QyxNQUFNLE1BQU0sR0FBRyxDQUFDLFdBQW1CLEVBQUUsRUFBRTtJQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLHlCQUFrQixDQUFDO1FBQ3ZDLE9BQU8sRUFBRTtZQUNSLElBQUksRUFBRTtnQkFDTCxPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsNEJBQTRCO2FBQ2xDO1NBQ0Q7S0FDRCxDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxnQ0FBYyxDQUFDO1FBQ25DLFdBQVc7S0FDWCxDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQUcsSUFBSSx1QkFBYSxDQUFDO1FBR3ZDLFFBQVEsRUFBRSxJQUFJLHdDQUFrQixDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3ZELFFBQVEsRUFBRSxJQUFJO0tBQ2QsQ0FBQztJQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLDZCQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBYTVELFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFNbkIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUM7SUFFM0QsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztBQUN4RCxDQUFDO0FBRUQsa0JBQWUsTUFBTTs7Ozs7Ozs7Ozs7Ozs7O0FDcERyQiw2REFBcUQ7QUFHckQsTUFBTSxTQUFTO0lBS2QsWUFBWSxHQUFnQjtRQVFyQixZQUFPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQztZQUUzQyxJQUFJO2dCQUNILE1BQU0sTUFBTSxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQ3hFLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUM7Z0JBQ2hELE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFFOUIsT0FBTyxPQUFPO2FBQ2Q7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFFcEMsT0FBTyxFQUFFO2FBQ1Q7UUFDRixDQUFDO1FBRU0sWUFBTyxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7WUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7WUFFM0MsSUFBSTtnQkFDSCxNQUFNLFFBQVEsR0FBRyx1QkFBYyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUM1RSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO2dCQUM5QyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBRTdCLE9BQU8sR0FBRzthQUNWO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBRXBDLE9BQU8sRUFBRTthQUNUO1FBQ0YsQ0FBQztRQXJDQSxNQUFNLEVBQUUsY0FBYyxHQUFHLGFBQWEsRUFBRSxpQkFBaUIsR0FBRyxhQUFhLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRztRQUV6RixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7UUFDZCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYztJQUNyQyxDQUFDO0NBaUNEO0FBRUQsa0JBQWUsU0FBUzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEeEIsaUZBQWdDO0FBQ2hDLG9GQUFrQztBQUlsQyxNQUFNLFFBQVE7SUFHYixZQUFZLEdBQWdCO1FBTXJCLGVBQVUsR0FBRyxHQUEyQixFQUFFO1lBQ2hELE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxnQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDcEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksaUJBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHO2dCQUNsQixPQUFPO2dCQUNQLE9BQU87Z0JBQ1AsT0FBTzthQUNQO1lBRUQsT0FBTyxJQUFJO1FBQ1osQ0FBQztRQWZBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztJQUdmLENBQUM7Q0FhRDtBQUVELGtCQUFlLFFBQVE7Ozs7Ozs7Ozs7Ozs7OztBQzNCdkIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFpQixFQUFVLEVBQUU7SUFDbkQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7SUFFcEMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsT0FBTyxJQUFJO0tBQ1g7SUFFRCxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7UUFDZCxPQUFPLElBQUk7S0FDWDtJQUVELE9BQU8sSUFBSTtBQUNaLENBQUM7QUFFUSxzQ0FBYTtBQUN0QixrQkFBZSxhQUFhOzs7Ozs7Ozs7Ozs7Ozs7QUNiNUIsTUFBTSxVQUFVO0lBR2YsWUFBWSxHQUFnQjtRQUlyQixZQUFPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUdqQyxPQUFPLElBQUk7aUJBQ1QsV0FBVyxFQUFFO2lCQUNiLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO2lCQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztRQUN0QixDQUFDO1FBVkEsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO0lBQ2YsQ0FBQztDQVVEO0FBRVEsZ0NBQVU7QUFDbkIsa0JBQWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCekIsa0Q7Ozs7Ozs7Ozs7O0FDQUEsMEQ7Ozs7Ozs7Ozs7O0FDQUEscUU7Ozs7Ozs7Ozs7O0FDQUEsK0M7Ozs7Ozs7Ozs7O0FDQUEsMkQ7Ozs7Ozs7Ozs7O0FDQUEsK0Q7Ozs7Ozs7Ozs7O0FDQUEsbUQ7Ozs7Ozs7Ozs7O0FDQUEsZ0Q7Ozs7Ozs7Ozs7O0FDQUEsbUQ7Ozs7Ozs7Ozs7O0FDQUEsa0Q7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsaUQ7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsNEM7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsdUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsb0MiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vXCIgKyBcIi5ob3QvXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIik7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rLmlkLCBjaHVuay5tb2R1bGVzKTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkge1xuIFx0XHR0cnkge1xuIFx0XHRcdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIFwiLmhvdC9cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpO1xuIFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcbiBcdH1cblxuIFx0Ly9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI0YWNkN2JmMTRiMWZhMWQ2YWNiZlwiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0e1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkICYmXG4gXHRcdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG4gXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdFwiW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIE5hbWVkTW9kdWxlc1BsdWdpbiBmb3IgbW9kdWxlIG5hbWVzLlwiXG5cdFx0XHQpO1xuXHR9XG59O1xuIiwidmFyIGxvZ0xldmVsID0gXCJpbmZvXCI7XG5cbmZ1bmN0aW9uIGR1bW15KCkge31cblxuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cbnZhciBncm91cCA9IGNvbnNvbGUuZ3JvdXAgfHwgZHVtbXk7XG52YXIgZ3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIHx8IGR1bW15O1xudmFyIGdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZCB8fCBkdW1teTtcbi8qIGVzbGludC1lbmFibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcblx0bG9nTGV2ZWwgPSBsZXZlbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdHZhciBtZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cdHZhciBzdGFjayA9IGVyci5zdGFjaztcblx0aWYgKCFzdGFjaykge1xuXHRcdHJldHVybiBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPCAwKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2UgKyBcIlxcblwiICsgc3RhY2s7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0YWNrO1xuXHR9XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbih1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdGlmICghdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRcdGlmIChmcm9tVXBkYXRlKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlIGFwcGxpZWQuXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0XHR2YXIgc3RhdHVzID0gbW9kdWxlLmhvdC5zdGF0dXMoKTtcblx0XHRcdFx0XHRpZiAoW1wiYWJvcnRcIiwgXCJmYWlsXCJdLmluZGV4T2Yoc3RhdHVzKSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS5cIik7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdHNldEludGVydmFsKGNoZWNrRm9yVXBkYXRlLCBob3RQb2xsSW50ZXJ2YWwpO1xufSBlbHNlIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG4iLCJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBBcHBVdGlscyBmcm9tICd1dGlsbGl0eSdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBsb2dnZXIgZnJvbSAnbG9nZ2VyJ1xuaW1wb3J0IG1pZGRsZXdhZXMgZnJvbSAnbWlkZGxld2FyZXMnXG5cbmNsYXNzIEFwcCB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cdHB1YmxpYyBhcHBVdGlsczogQXBwVXRpbHNcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmFwcCA9IGV4cHJlc3MoKVxuXHRcdHRoaXMuYXBwLmxvZ2dlciA9IGxvZ2dlclxuXG5cdFx0dGhpcy5hcHBVdGlscyA9IG5ldyBBcHBVdGlscyh0aGlzLmFwcClcblx0XHR0aGlzLmFwcGx5U2VydmVyKClcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgYm9vdHN0cmFwKCk6IEFwcCB7XG5cdFx0cmV0dXJuIG5ldyBBcHAoKVxuXHR9XG5cblx0cHJpdmF0ZSBhcHBseVNlcnZlciA9IGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB0aGlzLmFwcFV0aWxzLmFwcGx5VXRpbHMoKVxuXHRcdGF3YWl0IHRoaXMuYXBwbHlNaWRkbGV3YXJlKClcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlNaWRkbGV3YXJlID0gYXN5bmMgKCkgPT4ge1xuXHRcdG1pZGRsZXdhZXModGhpcy5hcHApXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwcGxpY2F0aW9uID0gbmV3IEFwcCgpXG5leHBvcnQgZGVmYXVsdCBhcHBsaWNhdGlvbi5hcHBcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIENvbXBhbnkgaW1wbGVtZW50cyBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGNyZWF0ZWRCeTogSURcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRfeWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZVxcbiAgbGFzdEFjdGl2ZTogVGltZXN0YW1wXFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbmlucHV0IENvbXBhbnlJbnB1dCB7XFxuICBjcmVhdGVkQnk6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgZGVzY3JpcHRpb246IFN0cmluZyFcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRZZWFyOiBTdHJpbmdcXG4gIG5vT2ZFbXBsb3llZXM6IFJhbmdlSW5wdXRcXG4gIGhpcmluZ1N0YXR1czogQm9vbGVhblxcbiAgc2tpbGxzOiBbU3RyaW5nXVxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIEN1cnJlbnRTdGF0dXMge1xcbiAgQUNUSVZFXFxuICBIT0xEXFxuICBFWFBJUkVEXFxufVxcblxcbmVudW0gSm9iVHlwZSB7XFxuICBERUZBVUxUXFxuICBGRUFUVVJFRFxcbiAgUFJFTUlVTVxcbn1cXG5cXG50eXBlIFNhbGxhcnkge1xcbiAgdmFsdWU6IEZsb2F0IVxcbiAgY3VycmVuY3k6IFN0cmluZyFcXG59XFxuXFxudHlwZSBKb2IgaW1wbGVtZW50cyBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmchXFxuICB0eXBlOiBKb2JUeXBlIVxcbiAgY2F0ZWdvcnk6IFtTdHJpbmchXSFcXG4gIGRlc2M6IFN0cmluZyFcXG4gIHNraWxsc1JlcXVpcmVkOiBbU3RyaW5nIV0hXFxuICBzYWxsYXJ5OiBSYW5nZVxcbiAgbG9jYXRpb246IFN0cmluZyFcXG4gIGF0dGFjaG1lbnQ6IFtBdHRhY2htZW50XVxcbiAgc3RhdHVzOiBDdXJyZW50U3RhdHVzXFxuICB2aWV3czogSW50XFxuICB1c2Vyc0FwcGxpZWQ6IFtTdHJpbmchXVxcbiAgY3JlYXRlZEJ5OiBTdHJpbmdcXG4gIGNvbXBhbnk6IFN0cmluZyFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnR5cGUgSm9iUmVzdWx0Q3Vyc29yIHtcXG4gIGVkZ2VzOiBFZGdlIVxcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxcbiAgdG90YWxDb3VudDogSW50IVxcbn1cXG5cXG5pbnB1dCBTYWxsYXJ5SW5wdXQge1xcbiAgdmFsdWU6IEZsb2F0IVxcbiAgY3VycmVuY3k6IFN0cmluZyFcXG59XFxuXFxuaW5wdXQgQ3JlYXRlSm9iSW5wdXQge1xcbiAgbmFtZTogU3RyaW5nIVxcbiAgdHlwZTogSm9iVHlwZSFcXG4gIGNhdGVnb3J5OiBbU3RyaW5nIV0hXFxuICBkZXNjOiBTdHJpbmchXFxuICBza2lsbHNfcmVxdWlyZWQ6IFtTdHJpbmchXSFcXG4gIHNhbGxhcnk6IFJhbmdlSW5wdXQhXFxuICBzYWxsYXJ5X21heDogU2FsbGFyeUlucHV0IVxcbiAgYXR0YWNobWVudDogW0F0dGFjaG1lbnRJbnB1dF1cXG4gIGxvY2F0aW9uOiBTdHJpbmchXFxuICBzdGF0dXM6IEN1cnJlbnRTdGF0dXMhXFxuICBjb21wYW55OiBTdHJpbmchXFxufVxcblwiIiwiaW1wb3J0ICogYXMgZ3JwYyBmcm9tICdncnBjJ1xuXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZUNsaWVudCB9IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlJ1xuXG5jb25zdCB7IEFDQ09VTlRfU0VSVklDRV9VUkkgPSAnbG9jYWxob3N0OjMwMDAnIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgcHJvZmlsZUNsaWVudCA9IG5ldyBQcm9maWxlU2VydmljZUNsaWVudChBQ0NPVU5UX1NFUlZJQ0VfVVJJLCBncnBjLmNyZWRlbnRpYWxzLmNyZWF0ZUluc2VjdXJlKCkpXG5cbmV4cG9ydCBkZWZhdWx0IHByb2ZpbGVDbGllbnRcbiIsImltcG9ydCB7XG5cdEFjY2Vzc0RldGFpbHMsXG5cdEF1dGhSZXF1ZXN0LFxuXHRBdXRoUmVzcG9uc2UsXG5cdFByb2ZpbGUsXG5cdFByb2ZpbGVTZWN1cml0eSxcblx0UmVhZFByb2ZpbGVSZXF1ZXN0LFxuXHRUb2tlblJlcXVlc3QsXG5cdFZhbGlkYXRlRW1haWxSZXF1ZXN0LFxuXHRWYWxpZGF0ZVVzZXJuYW1lUmVxdWVzdFxufSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiJ1xuaW1wb3J0IHtcblx0QWNjZXNzRGV0YWlsc1Jlc3BvbnNlIGFzIEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYSxcblx0QXV0aFJlc3BvbnNlIGFzIEF1dGhSZXNwb25zZVNjaGVtYSxcblx0RGVmYXVsdFJlc3BvbnNlIGFzIERlZmF1bHRSZXNwb25zZVNjaGVtYSxcblx0SWQgYXMgSWRTY2hlbWEsXG5cdE11dGF0aW9uUmVzb2x2ZXJzLFxuXHRQcm9maWxlIGFzIFByb2ZpbGVTY2hlbWEsXG5cdFByb2ZpbGVTZWN1cml0eSBhcyBQcm9maWxlU2VjdXJpdHlTY2hlbWEsXG5cdFF1ZXJ5UmVzb2x2ZXJzXG59IGZyb20gJ2dlbmVyYXRlZC9ncmFwaHFsJ1xuaW1wb3J0IHsgRGVmYXVsdFJlc3BvbnNlLCBFbWFpbCwgSWQsIElkZW50aWZpZXIgfSBmcm9tICdAb29qb2Ivb29qb2ItcHJvdG9idWYnXG5pbXBvcnQge1xuXHRhdXRoLFxuXHRjcmVhdGVQcm9maWxlLFxuXHRsb2dvdXQsXG5cdHJlYWRQcm9maWxlLFxuXHRyZWZyZXNoVG9rZW4sXG5cdHZhbGlkYXRlRW1haWwsXG5cdHZhbGlkYXRlVXNlcm5hbWUsXG5cdHZlcmlmeVRva2VuXG59IGZyb20gJ2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyJ1xuXG5pbXBvcnQgeyBBdXRoZW50aWNhdGlvbkVycm9yIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJ1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFRva2VuTWV0YWRhdGEgPSBhc3luYyAodG9rZW46IHN0cmluZyk6IFByb21pc2U8QWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hPiA9PiB7XG5cdGNvbnN0IHRva2VuUmVxdWVzdCA9IG5ldyBUb2tlblJlcXVlc3QoKVxuXG5cdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblxuXHRjb25zdCByZXM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYSA9IHt9XG5cdHRyeSB7XG5cdFx0Y29uc3QgdG9rZW5SZXMgPSAoYXdhaXQgdmVyaWZ5VG9rZW4odG9rZW5SZXF1ZXN0KSkgYXMgQWNjZXNzRGV0YWlsc1xuXHRcdHJlcy52ZXJpZmllZCA9IHRva2VuUmVzLmdldFZlcmlmaWVkKClcblx0XHRyZXMuYWNjZXNzVXVpZCA9IHRva2VuUmVzLmdldEFjY2Vzc1V1aWQoKVxuXHRcdHJlcy5hY2NvdW50VHlwZSA9IHRva2VuUmVzLmdldEFjY291bnRUeXBlKClcblx0XHRyZXMuYXV0aG9yaXplZCA9IHRva2VuUmVzLmdldEF1dGhvcml6ZWQoKVxuXHRcdHJlcy5lbWFpbCA9IHRva2VuUmVzLmdldEVtYWlsKClcblx0XHRyZXMuaWRlbnRpZmllciA9IHRva2VuUmVzLmdldElkZW50aWZpZXIoKVxuXHRcdHJlcy51c2VySWQgPSB0b2tlblJlcy5nZXRVc2VySWQoKVxuXHRcdHJlcy51c2VybmFtZSA9IHRva2VuUmVzLmdldFVzZXJuYW1lKClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXMudmVyaWZpZWQgPSBmYWxzZVxuXHRcdHJlcy5hY2Nlc3NVdWlkID0gbnVsbFxuXHRcdHJlcy5hY2NvdW50VHlwZSA9IG51bGxcblx0XHRyZXMuYXV0aG9yaXplZCA9IGZhbHNlXG5cdFx0cmVzLmVtYWlsID0gbnVsbFxuXHRcdHJlcy5leHAgPSBudWxsXG5cdFx0cmVzLmlkZW50aWZpZXIgPSBudWxsXG5cdFx0cmVzLnVzZXJJZCA9IG51bGxcblx0XHRyZXMudXNlcm5hbWUgPSBudWxsXG5cdH1cblxuXHRyZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBjb25zdCBRdWVyeTogUXVlcnlSZXNvbHZlcnMgPSB7XG5cdFZhbGlkYXRlVXNlcm5hbWU6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdHJhY2VyLCBsb2dnZXIgfSkgPT4ge1xuXHRcdGNvbnN0IF90cmFjZXIgPSB0cmFjZXIoJ3NlcnZpY2UtcHJvZmlsZScpXG5cdFx0bG9nZ2VyLmluZm8oJ3ZhbGlkYXRpbmcgdXNlcm5hbWUnKVxuXG5cdFx0Y29uc3Qgc3BhbiA9IF90cmFjZXIuc3RhcnRTcGFuKCdjbGllbnQ6c2VydmljZS1wcm9maWxlOnZhbGlkYXRlLXVzZXJuYW1lJywge1xuXHRcdFx0cGFyZW50OiBfdHJhY2VyLmdldEN1cnJlbnRTcGFuKClcblx0XHR9KVxuXHRcdGNvbnN0IHJlczogRGVmYXVsdFJlc3BvbnNlU2NoZW1hID0ge31cblxuXHRcdF90cmFjZXIud2l0aFNwYW4oc3BhbiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSBpbnB1dC51c2VybmFtZVxuXHRcdFx0Y29uc3QgdmFsaWRhdGVVc2VybmFtZVJlcSA9IG5ldyBWYWxpZGF0ZVVzZXJuYW1lUmVxdWVzdCgpXG5cdFx0XHRpZiAodXNlcm5hbWUpIHtcblx0XHRcdFx0dmFsaWRhdGVVc2VybmFtZVJlcS5zZXRVc2VybmFtZSh1c2VybmFtZSlcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgdmFsaWRhdGVSZXMgPSAoYXdhaXQgdmFsaWRhdGVVc2VybmFtZSh2YWxpZGF0ZVVzZXJuYW1lUmVxKSkgYXMgRGVmYXVsdFJlc3BvbnNlXG5cdFx0XHRcdHJlcy5zdGF0dXMgPSB2YWxpZGF0ZVJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0XHRyZXMuZXJyb3IgPSB2YWxpZGF0ZVJlcy5nZXRFcnJvcigpXG5cdFx0XHRcdHNwYW4uZW5kKClcblx0XHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRcdHJlcy5zdGF0dXMgPSBmYWxzZVxuXHRcdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdFx0XHRzcGFuLmVuZCgpXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0VmFsaWRhdGVFbWFpbDogYXN5bmMgKF8sIHsgaW5wdXQgfSkgPT4ge1xuXHRcdGNvbnN0IHZhbGlkYXRlRW1haWxSZXEgPSBuZXcgVmFsaWRhdGVFbWFpbFJlcXVlc3QoKVxuXG5cdFx0Y29uc3QgZW1haWwgPSBpbnB1dC5lbWFpbFxuXHRcdGlmIChlbWFpbCkge1xuXHRcdFx0dmFsaWRhdGVFbWFpbFJlcS5zZXRFbWFpbChlbWFpbClcblx0XHR9XG5cblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHZhbGlkYXRlUmVzID0gKGF3YWl0IHZhbGlkYXRlRW1haWwodmFsaWRhdGVFbWFpbFJlcSkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IHZhbGlkYXRlUmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gdmFsaWRhdGVSZXMuZ2V0RXJyb3IoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0VmVyaWZ5VG9rZW46IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRsZXQgcmVzOiBBY2Nlc3NEZXRhaWxzUmVzcG9uc2VTY2hlbWEgPSB7fVxuXG5cdFx0Y29uc3QgdG9rZW4gPSAoaW5wdXQgJiYgaW5wdXQudG9rZW4pIHx8IGFjY2Vzc1Rva2VuXG5cdFx0aWYgKHRva2VuKSB7XG5cdFx0XHRyZXMgPSBhd2FpdCBleHRyYWN0VG9rZW5NZXRhZGF0YSh0b2tlbilcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFJlZnJlc2hUb2tlbjogYXN5bmMgKF8sIHsgaW5wdXQgfSwgeyB0b2tlbjogYWNjZXNzVG9rZW4gfSkgPT4ge1xuXHRcdGNvbnN0IHJlczogQXV0aFJlc3BvbnNlU2NoZW1hID0ge31cblxuXHRcdGNvbnN0IHRva2VuUmVxdWVzdCA9IG5ldyBUb2tlblJlcXVlc3QoKVxuXHRcdGNvbnN0IHRva2VuID0gKGlucHV0ICYmIGlucHV0LnRva2VuKSB8fCBhY2Nlc3NUb2tlblxuXHRcdGlmICh0b2tlbikge1xuXHRcdFx0dG9rZW5SZXF1ZXN0LnNldFRva2VuKHRva2VuKVxuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB0b2tlblJlc3BvbnNlID0gKGF3YWl0IHJlZnJlc2hUb2tlbih0b2tlblJlcXVlc3QpKSBhcyBBdXRoUmVzcG9uc2Vcblx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSB0b2tlblJlc3BvbnNlLmdldEFjY2Vzc1Rva2VuKClcblx0XHRcdHJlcy5yZWZyZXNoX3Rva2VuID0gdG9rZW5SZXNwb25zZS5nZXRSZWZyZXNoVG9rZW4oKVxuXHRcdFx0cmVzLnZhbGlkID0gdG9rZW5SZXNwb25zZS5nZXRWYWxpZCgpXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSAnJ1xuXHRcdFx0cmVzLnJlZnJlc2hfdG9rZW4gPSAnJ1xuXHRcdFx0cmVzLnZhbGlkID0gZmFsc2Vcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFJlYWRQcm9maWxlOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IGFjY2Vzc0RldGFpbHMgfSkgPT4ge1xuXHRcdGlmICghYWNjZXNzRGV0YWlscykge1xuXHRcdFx0dGhyb3cgbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoJ3lvdSBtdXN0IGJlIGxvZ2dlZCBpbicpXG5cdFx0fVxuXG5cdFx0aWYgKGlucHV0LmlkICE9PSBhY2Nlc3NEZXRhaWxzLnVzZXJJZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieW91IGNhbid0IGFjY2VzcyBvdGhlciBwcm9maWxlXCIpXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzOiBQcm9maWxlU2NoZW1hID0ge31cblx0XHRjb25zdCByZWFkUHJvZmlsZVJlcXVlc3QgPSBuZXcgUmVhZFByb2ZpbGVSZXF1ZXN0KClcblx0XHRyZWFkUHJvZmlsZVJlcXVlc3Quc2V0QWNjb3VudElkKGlucHV0LmlkKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHByb2ZpbGVSZXMgPSAoYXdhaXQgcmVhZFByb2ZpbGUocmVhZFByb2ZpbGVSZXF1ZXN0KSkgYXMgUHJvZmlsZVxuXHRcdFx0Y29uc3QgcHJvZmlsZVNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlTY2hlbWEgPSB7fVxuXG5cdFx0XHRjb25zdCBlbWFpbCA9IHtcblx0XHRcdFx0ZW1haWw6IHByb2ZpbGVSZXMuZ2V0RW1haWwoKT8uZ2V0RW1haWwoKSxcblx0XHRcdFx0Ly8gc3RhdHVzOiBwcm9maWxlUmVzLmdldEVtYWlsKCk/LmdldFN0YXR1cygpLFxuXHRcdFx0XHRzaG93OiBwcm9maWxlUmVzLmdldEVtYWlsKCk/LmdldFNob3coKVxuXHRcdFx0fVxuXG5cdFx0XHRwcm9maWxlU2VjdXJpdHkudmVyaWZpZWQgPSBwcm9maWxlUmVzLmdldFNlY3VyaXR5KCk/LmdldFZlcmlmaWVkKClcblxuXHRcdFx0cmVzLnVzZXJuYW1lID0gcHJvZmlsZVJlcy5nZXRVc2VybmFtZSgpXG5cdFx0XHRyZXMuZ2l2ZW5OYW1lID0gcHJvZmlsZVJlcy5nZXRHaXZlbk5hbWUoKVxuXHRcdFx0cmVzLmZhbWlseU5hbWUgPSBwcm9maWxlUmVzLmdldEZhbWlseU5hbWUoKVxuXHRcdFx0cmVzLm1pZGRsZU5hbWUgPSBwcm9maWxlUmVzLmdldE1pZGRsZU5hbWUoKVxuXHRcdFx0cmVzLmVtYWlsID0gZW1haWxcblx0XHRcdHJlcy5zZWN1cml0eSA9IHByb2ZpbGVTZWN1cml0eVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBNdXRhdGlvbjogTXV0YXRpb25SZXNvbHZlcnMgPSB7XG5cdEF1dGg6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdHJhY2VyLCBsb2dnZXIgfSkgPT4ge1xuXHRcdGNvbnN0IF90cmFjZXIgPSB0cmFjZXIoJ3NlcnZpY2UtcHJvZmlsZScpXG5cblx0XHRjb25zdCBzcGFuID0gX3RyYWNlci5zdGFydFNwYW4oJ2NsaWVudDpzZXJ2aWNlLXByb2ZpbGU6YXV0aCcsIHtcblx0XHRcdHBhcmVudDogX3RyYWNlci5nZXRDdXJyZW50U3BhbigpXG5cdFx0fSlcblx0XHRjb25zdCByZXM6IEF1dGhSZXNwb25zZVNjaGVtYSA9IHt9XG5cblx0XHRfdHJhY2VyLndpdGhTcGFuKHNwYW4sIGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGF1dGhSZXF1ZXN0ID0gbmV3IEF1dGhSZXF1ZXN0KClcblx0XHRcdGlmIChpbnB1dD8udXNlcm5hbWUpIHtcblx0XHRcdFx0YXV0aFJlcXVlc3Quc2V0VXNlcm5hbWUoaW5wdXQudXNlcm5hbWUpXG5cdFx0XHR9XG5cdFx0XHRpZiAoaW5wdXQ/LnBhc3N3b3JkKSB7XG5cdFx0XHRcdGF1dGhSZXF1ZXN0LnNldFBhc3N3b3JkKGlucHV0LnBhc3N3b3JkKVxuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCB0b2tlblJlc3BvbnNlID0gKGF3YWl0IGF1dGgoYXV0aFJlcXVlc3QpKSBhcyBBdXRoUmVzcG9uc2Vcblx0XHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0QWNjZXNzVG9rZW4oKVxuXHRcdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0UmVmcmVzaFRva2VuKClcblx0XHRcdFx0cmVzLnZhbGlkID0gdG9rZW5SZXNwb25zZS5nZXRWYWxpZCgpXG5cdFx0XHRcdHNwYW4uZW5kKClcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSAnJ1xuXHRcdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9ICcnXG5cdFx0XHRcdHJlcy52YWxpZCA9IGZhbHNlXG5cdFx0XHRcdHNwYW4uZW5kKClcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRDcmVhdGVQcm9maWxlOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgbWlkZGxlTmFtZSA9IGlucHV0Lm1pZGRsZU5hbWUgPyBgICR7aW5wdXQubWlkZGxlTmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgZmFtaWx5TmFtZSA9IGlucHV0LmZhbWlseU5hbWUgPyBgICR7aW5wdXQuZmFtaWx5TmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgbmFtZSA9IGAke2lucHV0LmdpdmVuTmFtZX0ke21pZGRsZU5hbWV9JHtmYW1pbHlOYW1lfWBcblx0XHRjb25zdCBpZGVudGlmaWVyID0gbmV3IElkZW50aWZpZXIoKVxuXHRcdGlkZW50aWZpZXIuc2V0TmFtZShuYW1lLnRyaW0oKSlcblx0XHRjb25zdCBwcm9maWxlU2VjdXJpdHkgPSBuZXcgUHJvZmlsZVNlY3VyaXR5KClcblx0XHRpZiAoaW5wdXQuc2VjdXJpdHk/LnBhc3N3b3JkKSB7XG5cdFx0XHRwcm9maWxlU2VjdXJpdHkuc2V0UGFzc3dvcmQoaW5wdXQuc2VjdXJpdHkucGFzc3dvcmQpXG5cdFx0fVxuXHRcdGNvbnN0IGVtYWlsID0gbmV3IEVtYWlsKClcblx0XHRpZiAoaW5wdXQuZW1haWw/LmVtYWlsKSB7XG5cdFx0XHRlbWFpbC5zZXRFbWFpbChpbnB1dC5lbWFpbC5lbWFpbClcblx0XHR9XG5cdFx0aWYgKGlucHV0LmVtYWlsPy5zaG93KSB7XG5cdFx0XHRlbWFpbC5zZXRTaG93KGlucHV0LmVtYWlsLnNob3cpXG5cdFx0fVxuXHRcdGNvbnN0IHByb2ZpbGUgPSBuZXcgUHJvZmlsZSgpXG5cdFx0aWYgKGlucHV0Py5nZW5kZXIpIHtcblx0XHRcdHByb2ZpbGUuc2V0R2VuZGVyKGlucHV0LmdlbmRlcilcblx0XHR9XG5cdFx0aWYgKGlucHV0Py51c2VybmFtZSkge1xuXHRcdFx0cHJvZmlsZS5zZXRVc2VybmFtZShpbnB1dC51c2VybmFtZSlcblx0XHR9XG5cdFx0cHJvZmlsZS5zZXRFbWFpbChlbWFpbClcblx0XHRwcm9maWxlLnNldElkZW50aXR5KGlkZW50aWZpZXIpXG5cdFx0cHJvZmlsZS5zZXRTZWN1cml0eShwcm9maWxlU2VjdXJpdHkpXG5cdFx0Y29uc3QgcmVzID0gKGF3YWl0IGNyZWF0ZVByb2ZpbGUocHJvZmlsZSkpIGFzIElkXG5cblx0XHRjb25zdCBwcm9maWxlUmVzcG9uc2U6IElkU2NoZW1hID0ge1xuXHRcdFx0aWQ6IHJlcy5nZXRJZCgpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb2ZpbGVSZXNwb25zZVxuXHR9LFxuXHRMb2dvdXQ6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0Y29uc3QgdG9rZW5SZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCgpXG5cblx0XHRjb25zdCB0b2tlbiA9IChpbnB1dCAmJiBpbnB1dC50b2tlbikgfHwgYWNjZXNzVG9rZW5cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgbG9nb3V0UmVzID0gKGF3YWl0IGxvZ291dCh0b2tlblJlcXVlc3QpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSBsb2dvdXRSZXMuZ2V0U3RhdHVzKClcblx0XHRcdHJlcy5jb2RlID0gbG9nb3V0UmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gbG9nb3V0UmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHByb2ZpbGVSZXNvbHZlcnMgPSB7XG5cdE11dGF0aW9uLFxuXHRRdWVyeVxufVxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZVJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gQWNjb3VudFR5cGUge1xcbiAgQkFTRVxcbiAgQ09NUEFOWVxcbiAgRlVORElOR1xcbiAgSk9CXFxufVxcblxcbmVudW0gR2VuZGVyIHtcXG4gIE1BTEVcXG4gIEZFTUFMRVxcbiAgT1RIRVJcXG59XFxuXFxuZW51bSBQcm9maWxlT3BlcmF0aW9ucyB7XFxuICBDUkVBVEVcXG4gIFJFQURcXG4gIFVQREFURVxcbiAgREVMRVRFXFxuICBCVUxLX1VQREFURVxcbn1cXG5cXG5lbnVtIE9wZXJhdGlvbkVudGl0eSB7XFxuICBDT01QQU5ZXFxuICBKT0JcXG4gIElOVkVTVE9SXFxufVxcblxcbnR5cGUgRWR1Y2F0aW9uIHtcXG4gIGVkdWNhdGlvbjogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbnR5cGUgUHJvZmlsZVNlY3VyaXR5IHtcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlIHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVyXFxuICBnaXZlbk5hbWU6IFN0cmluZ1xcbiAgbWlkZGxlTmFtZTogU3RyaW5nXFxuICBmYW1pbHlOYW1lOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIGVtYWlsOiBFbWFpbFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wXFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25cXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlcXG4gIG1ldGFkYXRhOiBNZXRhZGF0YVxcbn1cXG5cXG50eXBlIEF1dGhSZXNwb25zZSB7XFxuICBhY2Nlc3NfdG9rZW46IFN0cmluZ1xcbiAgcmVmcmVzaF90b2tlbjogU3RyaW5nXFxuICB2YWxpZDogQm9vbGVhblxcbn1cXG5cXG50eXBlIEFjY2Vzc0RldGFpbHNSZXNwb25zZSB7XFxuICBhdXRob3JpemVkOiBCb29sZWFuXFxuICBhY2Nlc3NVdWlkOiBTdHJpbmdcXG4gIHVzZXJJZDogU3RyaW5nXFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBlbWFpbDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBTdHJpbmdcXG4gIHZlcmlmaWVkOiBCb29sZWFuXFxuICBleHA6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBFZHVjYXRpb25JbnB1dCB7XFxuICBlZHVjYXRpb246IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBQcm9maWxlU2VjdXJpdHlJbnB1dCB7XFxuICBwYXNzd29yZDogU3RyaW5nXFxuICBhY2NvdW50VHlwZTogQWNjb3VudFR5cGVcXG59XFxuXFxuaW5wdXQgUHJvZmlsZUlucHV0IHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVySW5wdXRcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsSW5wdXRcXG4gIGdlbmRlcjogR2VuZGVyXFxuICBiaXJ0aGRhdGU6IFRpbWVzdGFtcElucHV0XFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25JbnB1dFxcbiAgYWRkcmVzczogQWRkcmVzc0lucHV0XFxuICBzZWN1cml0eTogUHJvZmlsZVNlY3VyaXR5SW5wdXRcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVVc2VybmFtZUlucHV0IHtcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVFbWFpbElucHV0IHtcXG4gIGVtYWlsOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgQXV0aFJlcXVlc3RJbnB1dCB7XFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBwYXNzd29yZDogU3RyaW5nXFxufVxcblxcbmlucHV0IFRva2VuUmVxdWVzdCB7XFxuICB0b2tlbjogU3RyaW5nXFxuICBhY2Nlc3NVdWlkOiBTdHJpbmdcXG4gIHVzZXJJZDogU3RyaW5nXFxufVxcblxcbmV4dGVuZCB0eXBlIFF1ZXJ5IHtcXG4gIFZhbGlkYXRlVXNlcm5hbWUoaW5wdXQ6IFZhbGlkYXRlVXNlcm5hbWVJbnB1dCEpOiBEZWZhdWx0UmVzcG9uc2UhXFxuICBWYWxpZGF0ZUVtYWlsKGlucHV0OiBWYWxpZGF0ZUVtYWlsSW5wdXQhKTogRGVmYXVsdFJlc3BvbnNlIVxcbiAgVmVyaWZ5VG9rZW4oaW5wdXQ6IFRva2VuUmVxdWVzdCk6IEFjY2Vzc0RldGFpbHNSZXNwb25zZSFcXG4gIFJlZnJlc2hUb2tlbihpbnB1dDogVG9rZW5SZXF1ZXN0KTogQXV0aFJlc3BvbnNlIVxcbiAgUmVhZFByb2ZpbGUoaW5wdXQ6IElkSW5wdXQhKTogUHJvZmlsZSFcXG59XFxuXFxuZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xcbiAgQ3JlYXRlUHJvZmlsZShpbnB1dDogUHJvZmlsZUlucHV0ISk6IElkIVxcbiAgQXV0aChpbnB1dDogQXV0aFJlcXVlc3RJbnB1dCk6IEF1dGhSZXNwb25zZSFcXG4gIExvZ291dChpbnB1dDogVG9rZW5SZXF1ZXN0KTogRGVmYXVsdFJlc3BvbnNlIVxcbn1cXG5cIiIsImltcG9ydCBwcm9maWxlQ2xpZW50IGZyb20gJ2NsaWVudC9wcm9maWxlJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jcmVhdGVQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgY29uZmlybVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jb25maXJtUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlYWRQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQucmVhZFByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB1cGRhdGVQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudXBkYXRlUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcm5hbWUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52YWxpZGF0ZVVzZXJuYW1lKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmFsaWRhdGVFbWFpbCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZhbGlkYXRlRW1haWwpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBhdXRoID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuYXV0aCkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZlcmlmeVRva2VuID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmVyaWZ5VG9rZW4pLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBsb2dvdXQgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5sb2dvdXQpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCByZWZyZXNoVG9rZW4gPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5yZWZyZXNoVG9rZW4pLmJpbmQocHJvZmlsZUNsaWVudClcbiIsImltcG9ydCB7IE11dGF0aW9uUmVzb2x2ZXJzLCBRdWVyeVJlc29sdmVycywgUmVzb2x2ZXJzLCBTdWJzY3JpcHRpb25SZXNvbHZlcnMgfSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcblxuY29uc3QgUXVlcnk6IFF1ZXJ5UmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ2RvZG8gZHVjayBsaXZlcyBoZXJlJ1xufVxuY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ0RvZG8gRHVjaydcbn1cbmNvbnN0IFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKF8sIF9fLCB7IHB1YnN1YiB9KSA9PiBwdWJzdWIuYXN5bmNJdGVyYXRvcignRE9ET19EVUNLJylcbn1cblxuY29uc3Qgcm9vdFJlc29sdmVyczogUmVzb2x2ZXJzID0ge1xuXHRRdWVyeSxcblx0TXV0YXRpb24sXG5cdFN1YnNjcmlwdGlvbixcblx0UmVzdWx0OiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXG5cdFx0XHRyZXR1cm4gJ0pvYidcblx0XHR9XG5cdH0sXG5cdElOb2RlOiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXHRcdFx0Ly8gaWYgKG5vZGUuc3RhcnMpIHJldHVybiAnUmV2aWV3J1xuXG5cdFx0XHRyZXR1cm4gJ0NvbXBhbnknXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIEFwcGxpY2FudCB7XFxuICBhcHBsaWNhdGlvbnM6IFtTdHJpbmddIVxcbiAgc2hvcnRsaXN0ZWQ6IFtTdHJpbmddIVxcbiAgb25ob2xkOiBbU3RyaW5nXSFcXG4gIHJlamVjdGVkOiBbU3RyaW5nXSFcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBTb3J0IHtcXG4gIEFTQ1xcbiAgREVTQ1xcbn1cXG5cXG50eXBlIFBhZ2luYXRpb24ge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUGFnaW5hdGlvbklucHV0IHtcXG4gIHBhZ2U6IEludFxcbiAgZmlyc3Q6IEludFxcbiAgYWZ0ZXI6IFN0cmluZ1xcbiAgb2Zmc2V0OiBJbnRcXG4gIGxpbWl0OiBJbnRcXG4gIHNvcnQ6IFNvcnRcXG4gIHByZXZpb3VzOiBTdHJpbmdcXG4gIG5leHQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIE1ldGFkYXRhIHtcXG4gIGNyZWF0ZWRfYXQ6IFRpbWVzdGFtcFxcbiAgdXBkYXRlZF9hdDogVGltZXN0YW1wXFxuICBwdWJsaXNoZWRfZGF0ZTogVGltZXN0YW1wXFxuICBlbmRfZGF0ZTogVGltZXN0YW1wXFxuICBsYXN0X2FjdGl2ZTogVGltZXN0YW1wXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gUHJvZmlsZU9wZXJhdGlvbk9wdGlvbnMge1xcbiAgQ1JFQVRFXFxuICBSRUFEXFxuICBVUERBVEVcXG4gIERFTEVURVxcbiAgQlVMS19VUERBVEVcXG59XFxuXFxudHlwZSBNYXBQcm9maWxlUGVybWlzc2lvbiB7XFxuICBrZXk6IFN0cmluZ1xcbiAgcHJvZmlsZU9wZXJhdGlvbnM6IFtQcm9maWxlT3BlcmF0aW9uT3B0aW9uc11cXG59XFxuXFxudHlwZSBQZXJtaXNzaW9uc0Jhc2Uge1xcbiAgcGVybWlzc2lvbnM6IE1hcFByb2ZpbGVQZXJtaXNzaW9uXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgUmF0aW5nIHtcXG4gIGF1dGhvcjogU3RyaW5nXFxuICBiZXN0UmF0aW5nOiBJbnRcXG4gIGV4cGxhbmF0aW9uOiBTdHJpbmdcXG4gIHZhbHVlOiBJbnRcXG4gIHdvcnN0UmF0aW5nOiBJbnRcXG59XFxuXFxudHlwZSBBZ2dyZWdhdGVSYXRpbmcge1xcbiAgaXRlbVJldmlld2VkOiBTdHJpbmchXFxuICByYXRpbmdDb3VudDogSW50IVxcbiAgcmV2aWV3Q291bnQ6IEludFxcbn1cXG5cXG50eXBlIFJldmlldyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZ1xcbiAgYXNwZWN0OiBTdHJpbmdcXG4gIGJvZHk6IFN0cmluZ1xcbiAgcmF0aW5nOiBTdHJpbmdcXG59XFxuXFxudHlwZSBHZW9Mb2NhdGlvbiB7XFxuICBlbGV2YXRpb246IEludFxcbiAgbGF0aXR1ZGU6IEludFxcbiAgbG9uZ2l0dWRlOiBJbnRcXG4gIHBvc3RhbENvZGU6IEludFxcbn1cXG5cXG50eXBlIEFkZHJlc3Mge1xcbiAgY291bnRyeTogU3RyaW5nIVxcbiAgbG9jYWxpdHk6IFN0cmluZ1xcbiAgcmVnaW9uOiBTdHJpbmdcXG4gIHBvc3RhbENvZGU6IEludFxcbiAgc3RyZWV0OiBTdHJpbmdcXG59XFxuXFxudHlwZSBQbGFjZSB7XFxuICBhZGRyZXNzOiBBZGRyZXNzXFxuICByZXZpZXc6IFJldmlld1xcbiAgYWdncmVnYXRlUmF0aW5nOiBBZ2dyZWdhdGVSYXRpbmdcXG4gIGJyYW5jaENvZGU6IFN0cmluZ1xcbiAgZ2VvOiBHZW9Mb2NhdGlvblxcbn1cXG5cXG5pbnB1dCBBZGRyZXNzSW5wdXQge1xcbiAgY291bnRyeTogU3RyaW5nXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIFJhbmdlIHtcXG4gIG1pbjogSW50IVxcbiAgbWF4OiBJbnQhXFxufVxcblxcbnR5cGUgRGVmYXVsdFJlc3BvbnNlIHtcXG4gIHN0YXR1czogQm9vbGVhblxcbiAgZXJyb3I6IFN0cmluZ1xcbiAgY29kZTogSW50XFxufVxcblxcbnR5cGUgSWQge1xcbiAgaWQ6IElEIVxcbn1cXG5cXG5lbnVtIEVtYWlsU3RhdHVzIHtcXG4gIFdBSVRJTkdcXG4gIENPTkZJUk1FRFxcbiAgQkxPQ0tFRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG50eXBlIEVtYWlsIHtcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIHN0YXR1czogRW1haWxTdGF0dXNcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBBdHRhY2htZW50IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxuICB1cGxvYWREYXRlOiBUaW1lc3RhbXBcXG4gIHVybDogU3RyaW5nXFxuICB1c2VyOiBTdHJpbmdcXG4gIGZvbGRlcjogU3RyaW5nXFxufVxcblxcbnR5cGUgSWRlbnRpZmllciB7XFxuICBpZGVudGlmaWVyOiBTdHJpbmchXFxuICBuYW1lOiBTdHJpbmdcXG4gIGFsdGVybmF0ZU5hbWU6IFN0cmluZ1xcbiAgdHlwZTogU3RyaW5nXFxuICBhZGRpdGlvbmFsVHlwZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBkaXNhbWJpZ3VhdGluZ0Rlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGhlYWRsaW5lOiBTdHJpbmdcXG4gIHNsb2dhbjogU3RyaW5nXFxufVxcblxcbmlucHV0IFJhbmdlSW5wdXQge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxuaW5wdXQgSWRJbnB1dCB7XFxuICBpZDogSUQhXFxufVxcblxcbmlucHV0IEVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBBdHRhY2htZW50SW5wdXQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG4gIHVzZXI6IFN0cmluZ1xcbiAgZm9sZGVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgSWRlbnRpZmllcklucHV0IHtcXG4gIG5hbWU6IFN0cmluZ1xcbiAgYWx0ZXJuYXRlTmFtZTogU3RyaW5nXFxuICB0eXBlOiBTdHJpbmdcXG4gIGFkZGl0aW9uYWxUeXBlOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGRpc2FtYmlndWF0aW5nRGVzY3JpcHRpb246IFN0cmluZ1xcbiAgaGVhZGxpbmU6IFN0cmluZ1xcbiAgc2xvZ2FuOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBEYXlzT2ZXZWVrIHtcXG4gIE1PTkRBWVxcbiAgVFVFU0RBWVxcbiAgV0VETkVTREFZXFxuICBUSFJVU0RBWVxcbiAgRlJJREFZXFxuICBTVEFVUkRBWVxcbiAgU1VOREFZXFxufVxcblxcbnR5cGUgVGltZXN0YW1wIHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFRpbWUge1xcbiAgb3BlbnM6IFRpbWVzdGFtcFxcbiAgY2xvc2VzOiBUaW1lc3RhbXBcXG4gIGRheXNPZldlZWs6IERheXNPZldlZWtcXG4gIHZhbGlkRnJvbTogVGltZXN0YW1wXFxuICB2YWxpZFRocm91Z2g6IFRpbWVzdGFtcFxcbn1cXG5cXG5pbnB1dCBUaW1lc3RhbXBJbnB1dCB7XFxuICBzZWNvbmRzOiBTdHJpbmdcXG4gIG5hbm9zOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwic2NhbGFyIERhdGVcXG5cXG50eXBlIEVkZ2Uge1xcbiAgY3Vyc29yOiBTdHJpbmchXFxuICBub2RlOiBbUmVzdWx0IV0hXFxufVxcblxcbnR5cGUgUGFnZUluZm8ge1xcbiAgZW5kQ3Vyc29yOiBTdHJpbmchXFxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcXG59XFxuXFxuaW50ZXJmYWNlIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnVuaW9uIFJlc3VsdCA9IEpvYiB8IENvbXBhbnlcXG5cXG50eXBlIFF1ZXJ5IHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgTXV0YXRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBTdWJzY3JpcHRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxuc2NoZW1hIHtcXG4gIHF1ZXJ5OiBRdWVyeVxcbiAgbXV0YXRpb246IE11dGF0aW9uXFxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGFwcGxpY2FudHNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGNvbXBhbnlTY2hlbWEgZnJvbSAnY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY3Vyc29yU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9jdXJzb3IuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGpvYlNjaGVtYSBmcm9tICdjbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIG1ldGFkYXRhU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9tZXRhZGF0YS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcGVybWlzc2lvbnNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwbGFjZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvcGxhY2UuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHByb2ZpbGVTY2hlbWEgZnJvbSAnY2xpZW50L3Byb2ZpbGUvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcm9vdFNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBzeXN0ZW1TY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3N5c3RlbS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgdGltZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvdGltZS5ncmFwaHFsJ1xuXG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIFB1YlN1YiB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcbmltcG9ydCBwcm9maWxlUmVzb2x2ZXJzLCB7IGV4dHJhY3RUb2tlbk1ldGFkYXRhIH0gZnJvbSAnY2xpZW50L3Byb2ZpbGUvcmVzb2x2ZXInXG5cbmltcG9ydCB7IEFjY2Vzc0RldGFpbHNSZXNwb25zZSB9IGZyb20gJ2dlbmVyYXRlZC9ncmFwaHFsJ1xuaW1wb3J0IHsgUmVxdWVzdCB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHJvb3RSZXNvbHZlcnMgZnJvbSAnY2xpZW50L3Jvb3QvcmVzb2x2ZXInXG5pbXBvcnQgdHJhY2VyIGZyb20gJ3RyYWNlcidcbmltcG9ydCB3aW5zdG9uIGZyb20gJ3dpbnN0b24nXG5cbmV4cG9ydCBjb25zdCBwdWJzdWIgPSBuZXcgUHViU3ViKClcbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IFtcblx0cm9vdFNjaGVtYSxcblx0YXBwbGljYW50c1NjaGVtYSxcblx0Y3Vyc29yU2NoZW1hLFxuXHRtZXRhZGF0YVNjaGVtYSxcblx0cGxhY2VTY2hlbWEsXG5cdHN5c3RlbVNjaGVtYSxcblx0cGVybWlzc2lvbnNTY2hlbWEsXG5cdHRpbWVTY2hlbWEsXG5cdHByb2ZpbGVTY2hlbWEsXG5cdGNvbXBhbnlTY2hlbWEsXG5cdGpvYlNjaGVtYVxuXVxuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IG1lcmdlKHt9LCByb290UmVzb2x2ZXJzLCBwcm9maWxlUmVzb2x2ZXJzKVxuZXhwb3J0IGludGVyZmFjZSBPb0pvYkNvbnRleHQge1xuXHRyZXE6IFJlcXVlc3Rcblx0cHVic3ViOiBQdWJTdWJcblx0dHJhY2VyOiB0eXBlb2YgdHJhY2VyXG5cdHRva2VuOiBzdHJpbmdcblx0YWNjZXNzRGV0YWlsczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlXG5cdGxvZ2dlcjogd2luc3Rvbi5Mb2dnZXJcbn1cbmNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuXHR0eXBlRGVmcyxcblx0cmVzb2x2ZXJzLFxuXHRjb250ZXh0OiBhc3luYyAoeyByZXEsIGNvbm5lY3Rpb24gfSkgPT4ge1xuXHRcdGNvbnN0IHRva2VuRGF0YSA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb25cblx0XHRsZXQgdG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXHRcdGxldCBhY2Nlc3NEZXRhaWxzOiBBY2Nlc3NEZXRhaWxzUmVzcG9uc2UgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuXHRcdGlmICh0b2tlbkRhdGEpIHtcblx0XHRcdHRva2VuID0gdG9rZW5EYXRhLnNwbGl0KCcgJylbMV1cblx0XHR9XG5cdFx0aWYgKHRva2VuKSB7XG5cdFx0XHRhY2Nlc3NEZXRhaWxzID0gYXdhaXQgZXh0cmFjdFRva2VuTWV0YWRhdGEodG9rZW4pXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlcSxcblx0XHRcdGNvbm5lY3Rpb24sXG5cdFx0XHRwdWJzdWIsXG5cdFx0XHR0cmFjZXIsXG5cdFx0XHRhY2Nlc3NEZXRhaWxzLFxuXHRcdFx0dG9rZW4sXG5cdFx0XHRsb2dnZXJcblx0XHR9XG5cdH0sXG5cdHRyYWNpbmc6IHRydWVcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZlclxuIiwiaW1wb3J0ICdkb3RlbnYvY29uZmlnJ1xuXG5pbXBvcnQgeyBhcHAsIHNlcnZlciwgc3RhcnRTeW5jU2VydmVyLCBzdG9wU2VydmVyIH0gZnJvbSAnb29qb2Iuc2VydmVyJ1xuaW1wb3J0IHsgZm9yaywgaXNNYXN0ZXIsIG9uIH0gZnJvbSAnY2x1c3RlcidcblxuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5cbmRlY2xhcmUgY29uc3QgbW9kdWxlOiBhbnlcblxuY29uc3Qgc3RhcnQgPSBhc3luYyAoKSA9PiB7XG5cdGNvbnN0IHsgUE9SVCB9ID0gcHJvY2Vzcy5lbnZcblx0Y29uc3QgcG9ydCA9IFBPUlQgfHwgJzgwODAnXG5cblx0dHJ5IHtcblx0XHRhd2FpdCBzdG9wU2VydmVyKClcblx0XHRhd2FpdCBzdGFydFN5bmNTZXJ2ZXIocG9ydClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdTZXJ2ZXIgRmFpbGVkIHRvIHN0YXJ0Jylcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdHByb2Nlc3MuZXhpdCgxKVxuXHR9XG59XG5cbmlmIChpc01hc3Rlcikge1xuXHRjb25zdCBudW1DUFVzID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoXG5cblx0bG9nZ2VyLmluZm8oYE1hc3RlciAke3Byb2Nlc3MucGlkfSBpcyBydW5uaW5nYClcblxuXHQvLyBGb3JrIHdvcmtlcnMuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ1BVczsgaSsrKSB7XG5cdFx0Zm9yaygpXG5cdH1cblxuXHRvbignZm9yaycsICh3b3JrZXIpID0+IHtcblx0XHRsb2dnZXIuaW5mbygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxuXG5cdG9uKCdleGl0JywgKHdvcmtlcikgPT4ge1xuXHRcdGxvZ2dlci5pbmZvKCd3b3JrZXIgaXMgZGVhZDonLCB3b3JrZXIuaXNEZWFkKCkpXG5cdH0pXG59IGVsc2Uge1xuXHQvKipcblx0ICogW2lmIEhvdCBNb2R1bGUgZm9yIHdlYnBhY2tdXG5cdCAqIEBwYXJhbSAge1t0eXBlXX0gbW9kdWxlIFtnbG9iYWwgbW9kdWxlIG5vZGUgb2JqZWN0XVxuXHQgKi9cblx0bGV0IGN1cnJlbnRBcHAgPSBhcHBcblx0aWYgKG1vZHVsZS5ob3QpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdCgnb29qb2Iuc2VydmVyJywgKCkgPT4ge1xuXHRcdFx0c2VydmVyLnJlbW92ZUxpc3RlbmVyKCdyZXF1ZXN0JywgY3VycmVudEFwcClcblx0XHRcdHNlcnZlci5vbigncmVxdWVzdCcsIGFwcClcblx0XHRcdGN1cnJlbnRBcHAgPSBhcHBcblx0XHR9KVxuXG5cdFx0LyoqXG5cdFx0ICogTmV4dCBjYWxsYmFjayBpcyBlc3NlbnRpYWw6XG5cdFx0ICogQWZ0ZXIgY29kZSBjaGFuZ2VzIHdlcmUgYWNjZXB0ZWQgd2UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHAuXG5cdFx0ICogc2VydmVyLmNsb3NlKCkgaXMgaGVyZSBFeHByZXNzLkpTLXNwZWNpZmljIGFuZCBjYW4gZGlmZmVyIGluIG90aGVyIGZyYW1ld29ya3MuXG5cdFx0ICogVGhlIGlkZWEgaXMgdGhhdCB5b3Ugc2hvdWxkIHNodXQgZG93biB5b3VyIGFwcCBoZXJlLlxuXHRcdCAqIERhdGEvc3RhdGUgc2F2aW5nIGJldHdlZW4gc2h1dGRvd24gYW5kIG5ldyBzdGFydCBpcyBwb3NzaWJsZVxuXHRcdCAqL1xuXHRcdG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBzZXJ2ZXIuY2xvc2UoKSlcblx0fVxuXG5cdC8vIFdvcmtlcnMgY2FuIHNoYXJlIGFueSBUQ1AgY29ubmVjdGlvblxuXHQvLyBJbiB0aGlzIGNhc2UgaXQgaXMgYW4gSFRUUCBzZXJ2ZXJcblx0c3RhcnQoKVxuXG5cdGxvZ2dlci5pbmZvKGBXb3JrZXIgJHtwcm9jZXNzLnBpZH0gc3RhcnRlZGApXG59XG4iLCJpbXBvcnQgeyBMb2dnZXIsIExvZ2dlck9wdGlvbnMsIGNyZWF0ZUxvZ2dlciwgZm9ybWF0LCB0cmFuc3BvcnRzIH0gZnJvbSAnd2luc3RvbidcbmltcG9ydCB7IGJhc2VuYW1lLCBqb2luIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMsIG1rZGlyU3luYyB9IGZyb20gJ2ZzJ1xuXG5jb25zdCB7IGNvbWJpbmUsIHRpbWVzdGFtcCwgcHJldHR5UHJpbnQgfSA9IGZvcm1hdFxuY29uc3QgbG9nRGlyZWN0b3J5ID0gam9pbihfX2Rpcm5hbWUsICdsb2cnKVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG50eXBlIElMb2dnZXJPcHRpb25zID0geyBmaWxlOiBMb2dnZXJPcHRpb25zOyBjb25zb2xlOiBMb2dnZXJPcHRpb25zIH1cblxuY29uc3QgeyBGSUxFX0xPR19MRVZFTCwgQ09OU09MRV9MT0dfTEVWRUwgfSA9IHByb2Nlc3MuZW52XG5leHBvcnQgY29uc3QgbG9nZ2VyT3B0aW9ucyA9IHtcblx0ZmlsZToge1xuXHRcdGxldmVsOiBGSUxFX0xPR19MRVZFTCB8fCAnaW5mbycsXG5cdFx0ZmlsZW5hbWU6IGAke2xvZ0RpcmVjdG9yeX0vbG9ncy9hcHAubG9nYCxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IHRydWUsXG5cdFx0bWF4c2l6ZTogNTI0Mjg4MCwgLy8gNU1CXG5cdFx0bWF4RmlsZXM6IDUsXG5cdFx0Y29sb3JpemU6IGZhbHNlXG5cdH0sXG5cdGNvbnNvbGU6IHtcblx0XHRsZXZlbDogQ09OU09MRV9MT0dfTEVWRUwgfHwgJ2RlYnVnJyxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IGZhbHNlLFxuXHRcdGNvbG9yaXplOiB0cnVlXG5cdH1cbn1cblxuY29uc3QgbG9nZ2VyVHJhbnNwb3J0cyA9IFtcblx0bmV3IHRyYW5zcG9ydHMuQ29uc29sZSh7XG5cdFx0Li4ubG9nZ2VyT3B0aW9ucy5jb25zb2xlLFxuXHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRmb3JtYXQudGltZXN0YW1wKCksXG5cdFx0XHRmb3JtYXQuY29sb3JpemUoeyBhbGw6IHRydWUgfSksXG5cdFx0XHRmb3JtYXQuYWxpZ24oKSxcblx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IHtcblx0XHRcdFx0Y29uc3QgeyBsZXZlbCwgbWVzc2FnZSwgbGFiZWwgfSA9IGluZm9cblx0XHRcdFx0Ly8gJHtPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPyBKU09OLnN0cmluZ2lmeShhcmdzLCBudWxsLCAyKSA6ICcnfVxuXG5cdFx0XHRcdHJldHVybiBgJHtsZXZlbH0gWyR7bGFiZWx9XTogJHttZXNzYWdlfWBcblx0XHRcdH0pXG5cdFx0KVxuXHR9KVxuXVxuXG5jbGFzcyBBcHBMb2dnZXIge1xuXHRwdWJsaWMgbG9nZ2VyOiBMb2dnZXJcblx0cHVibGljIGxvZ2dlck9wdGlvbnM6IElMb2dnZXJPcHRpb25zXG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogSUxvZ2dlck9wdGlvbnMpIHtcblx0XHRpZiAoIWlzRGV2ZWxvcG1lbnQpIHtcblx0XHRcdGV4aXN0c1N5bmMobG9nRGlyZWN0b3J5KSB8fCBta2RpclN5bmMobG9nRGlyZWN0b3J5KVxuXHRcdH1cblxuXHRcdHRoaXMubG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcblx0XHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRcdGZvcm1hdC5sYWJlbCh7IGxhYmVsOiBiYXNlbmFtZShwcm9jZXNzLm1haW5Nb2R1bGUgPyBwcm9jZXNzLm1haW5Nb2R1bGUuZmlsZW5hbWUgOiAndW5rbm93bi5maWxlJykgfSksXG5cdFx0XHRcdGZvcm1hdC50aW1lc3RhbXAoeyBmb3JtYXQ6ICdZWVlZLU1NLUREIEhIOm1tOnNzJyB9KVxuXHRcdFx0KSxcblx0XHRcdHRyYW5zcG9ydHM6IGlzRGV2ZWxvcG1lbnRcblx0XHRcdFx0PyBbLi4ubG9nZ2VyVHJhbnNwb3J0c11cblx0XHRcdFx0OiBbXG5cdFx0XHRcdFx0XHQuLi5sb2dnZXJUcmFuc3BvcnRzLFxuXHRcdFx0XHRcdFx0bmV3IHRyYW5zcG9ydHMuRmlsZSh7XG5cdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMuZmlsZSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBjb21iaW5lKFxuXHRcdFx0XHRcdFx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IGAke2luZm8udGltZXN0YW1wfSAke2luZm8ubGV2ZWx9IFske2luZm8ubGFiZWx9XTogJHtpbmZvLm1lc3NhZ2V9YClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0ICBdLFxuXHRcdFx0ZXhpdE9uRXJyb3I6IGZhbHNlXG5cdFx0fSlcblx0fVxufVxuXG5jb25zdCB7IGxvZ2dlciB9ID0gbmV3IEFwcExvZ2dlcihsb2dnZXJPcHRpb25zKVxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyXG4iLCJpbXBvcnQgKiBhcyBjb3JzTGlicmFyeSBmcm9tICdjb3JzJ1xuXG5jb25zdCB7IE5PREVfRU5WID0gJ2RldmVsb3BtZW50JywgTk9XX1VSTCA9ICdodHRwczovL29vam9iLmlvJywgRk9SQ0VfREVWID0gZmFsc2UgfSA9IHByb2Nlc3MuZW52XG5jb25zdCBwcm9kVXJscyA9IFsnaHR0cHM6Ly9vb2pvYi5pbycsICdodHRwczovL2FscGhhLm9vam9iLmlvJywgJ2h0dHBzOi8vYmV0YS5vb2pvYi5pbycsIE5PV19VUkxdXG5jb25zdCBpc1Byb2R1Y3Rpb24gPSBOT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICFGT1JDRV9ERVZcblxuY29uc3QgY29yc09wdGlvbiA9IHtcblx0b3JpZ2luOiBpc1Byb2R1Y3Rpb24gPyBwcm9kVXJscy5maWx0ZXIoQm9vbGVhbikgOiBbL2xvY2FsaG9zdC9dLFxuXHRtZXRob2RzOiAnR0VULCBIRUFELCBQVVQsIFBBVENILCBQT1NULCBERUxFVEUsIE9QVElPTicsXG5cdGNyZWRlbnRpYWxzOiB0cnVlLFxuXHRleHBvc2VkSGVhZGVyczogWydhdXRob3JpemF0aW9uJ11cbn1cblxuY29uc3QgY29ycyA9ICgpID0+IGNvcnNMaWJyYXJ5KGNvcnNPcHRpb24pXG5leHBvcnQgZGVmYXVsdCBjb3JzXG4iLCJpbXBvcnQgKiBhcyBob3N0VmFsaWRhdGlvbiBmcm9tICdob3N0LXZhbGlkYXRpb24nXG5cbi8vIE5PVEUoQG14c3Ricik6XG4vLyAtIEhvc3QgaGVhZGVyIG9ubHkgY29udGFpbnMgdGhlIGRvbWFpbiwgc28gc29tZXRoaW5nIGxpa2UgJ2J1aWxkLWFwaS1hc2RmMTIzLm5vdy5zaCcgb3IgJ29vam9iLmlvJ1xuLy8gLSBSZWZlcmVyIGhlYWRlciBjb250YWlucyB0aGUgZW50aXJlIFVSTCwgc28gc29tZXRoaW5nIGxpa2Vcbi8vICdodHRwczovL2J1aWxkLWFwaS1hc2RmMTIzLm5vdy5zaC9mb3J3YXJkJyBvciAnaHR0cHM6Ly9vb2pvYi5pby9mb3J3YXJkJ1xuLy8gVGhhdCBtZWFucyB3ZSBoYXZlIHRvIGNoZWNrIHRoZSBIb3N0IHNsaWdodGx5IGRpZmZlcmVudGx5IGZyb20gdGhlIFJlZmVyZXIgdG8gYXZvaWQgdGhpbmdzXG4vLyBsaWtlICdteS1kb21haW4tb29qb2IuaW8nIHRvIGJlIGFibGUgdG8gaGFjayBvdXIgdXNlcnNcblxuLy8gSG9zdHMsIHdpdGhvdXQgaHR0cChzKTovLyBhbmQgcGF0aHNcbmNvbnN0IHsgTk9XX1VSTCA9ICdodHRwOi8vb29qb2IuaW8nIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgdHJ1c3RlZEhvc3RzID0gW1xuXHROT1dfVVJMICYmIG5ldyBSZWdFeHAoYF4ke05PV19VUkwucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJyl9JGApLFxuXHQvXm9vam9iXFwuaW8kLywgLy8gVGhlIERvbWFpblxuXHQvXi4qXFwub29qb2JcXC5pbyQvIC8vIEFsbCBzdWJkb21haW5zXG5dLmZpbHRlcihCb29sZWFuKVxuXG4vLyBSZWZlcmVycywgd2l0aCBodHRwKHMpOi8vIGFuZCBwYXRoc1xuY29uc3QgdHJ1c3RlZFJlZmVyZXJzID0gW1xuXHROT1dfVVJMICYmIG5ldyBSZWdFeHAoYF4ke05PV19VUkx9KCR8XFwvLiopYCksXG5cdC9eaHR0cHM6XFwvXFwvb29qb2JcXC5pbygkfFxcLy4qKS8sIC8vIFRoZSBEb21haW5cblx0L15odHRwczpcXC9cXC8uKlxcLnNwZWN0cnVtXFwuY2hhdCgkfFxcLy4qKS8gLy8gQWxsIHN1YmRvbWFpbnNcbl0uZmlsdGVyKEJvb2xlYW4pXG5cbmNvbnN0IGNzcmYgPSBob3N0VmFsaWRhdGlvbih7XG5cdGhvc3RzOiB0cnVzdGVkSG9zdHMsXG5cdHJlZmVyZXJzOiB0cnVzdGVkUmVmZXJlcnMsXG5cdG1vZGU6ICdlaXRoZXInXG59KVxuZXhwb3J0IGRlZmF1bHQgY3NyZlxuIiwiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5cbmNvbnN0IGVycm9ySGFuZGxlciA9IChlcnI6IEVycm9yLCByZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRpZiAoZXJyKSB7XG5cdFx0Y29uc29sZS5lcnJvcihlcnIpXG5cdFx0cmVzLnN0YXR1cyg1MDApLnNlbmQoJ09vcHMsIHNvbWV0aGluZyB3ZW50IHdyb25nISBPdXIgZW5naW5lZXJzIGhhdmUgYmVlbiBhbGVydGVkIGFuZCB3aWxsIGZpeCB0aGlzIGFzYXAuJylcblx0XHQvLyBjYXB0dXJlIGVycm9yIHdpdGggZXJyb3IgbWV0cmljcyBjb2xsZWN0b3Jcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbmV4dCgpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZXJyb3JIYW5kbGVyXG4iLCJpbXBvcnQgKiBhcyBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJ1xuaW1wb3J0ICogYXMgY29tcHJlc3Npb24gZnJvbSAnY29tcHJlc3Npb24nXG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBjb3JzIGZyb20gJ21pZGRsZXdhcmVzL2NvcnMnXG5pbXBvcnQgY3NyZiBmcm9tICdtaWRkbGV3YXJlcy9jc3JmJ1xuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICdtaWRkbGV3YXJlcy9lcnJvci1oYW5kbGVyJ1xuaW1wb3J0IHNlY3VyaXR5IGZyb20gJ21pZGRsZXdhcmVzL3NlY3VyaXR5J1xuaW1wb3J0IHRvb2J1c3kgZnJvbSAnbWlkZGxld2FyZXMvdG9vYnVzeSdcblxuY29uc3QgeyBFTkFCTEVfQ1NQID0gdHJ1ZSwgRU5BQkxFX05PTkNFID0gdHJ1ZSB9ID0gcHJvY2Vzcy5lbnZcblxuY29uc3QgbWlkZGxld2FyZXMgPSAoYXBwOiBBcHBsaWNhdGlvbikgPT4ge1xuXHQvLyBDT1JTIGZvciBjcm9zc3MtdGUgYWNjZXNzXG5cdGFwcC51c2UoY29ycygpKVxuXG5cdC8vIGpzb24gZW5jb2RpbmcgYW5kIGRlY29kaW5nXG5cdGFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuXHRhcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKVxuXG5cdC8vIHNldCBHWmlwIG9uIGhlYWRlcnMgZm9yIHJlcXVlc3QvcmVzcG9uc2Vcblx0YXBwLnVzZShjb21wcmVzc2lvbigpKVxuXG5cdGFwcC51c2UoY3NyZilcblx0YXBwLnVzZShlcnJvckhhbmRsZXIpXG5cdHNlY3VyaXR5KGFwcCwgeyBlbmFibGVDU1A6IEJvb2xlYW4oRU5BQkxFX0NTUCksIGVuYWJsZU5vbmNlOiBCb29sZWFuKEVOQUJMRV9OT05DRSkgfSlcblxuXHQvLyBidXNzeSBzZXJ2ZXIgKHdhaXQgZm9yIGl0IHRvIHJlc29sdmUpXG5cdGFwcC51c2UodG9vYnVzeSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaWRkbGV3YXJlc1xuIiwiaW1wb3J0ICogYXMgaHBwIGZyb20gJ2hwcCdcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgY29udGVudFNlY3VyaXR5UG9saWN5LCBmcmFtZWd1YXJkLCBoc3RzLCBpZU5vT3Blbiwgbm9TbmlmZiwgeHNzRmlsdGVyIH0gZnJvbSAnaGVsbWV0J1xuXG5pbXBvcnQgZXhwcmVzc0VuZm9yY2VzU3NsIGZyb20gJ2V4cHJlc3MtZW5mb3JjZXMtc3NsJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCdcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IHNlY3VyaXR5ID0gKGFwcDogQXBwbGljYXRpb24sIHsgZW5hYmxlTm9uY2UsIGVuYWJsZUNTUCB9OiB7IGVuYWJsZU5vbmNlOiBib29sZWFuOyBlbmFibGVDU1A6IGJvb2xlYW4gfSkgPT4ge1xuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXG5cdC8vIHNlY3VyaXR5IGhlbG1ldCBwYWNrYWdlXG5cdC8vIERvbid0IGV4cG9zZSBhbnkgc29mdHdhcmUgaW5mb3JtYXRpb24gdG8gaGFja2Vycy5cblx0YXBwLmRpc2FibGUoJ3gtcG93ZXJlZC1ieScpXG5cblx0Ly8gRXhwcmVzcyBtaWRkbGV3YXJlIHRvIHByb3RlY3QgYWdhaW5zdCBIVFRQIFBhcmFtZXRlciBQb2xsdXRpb24gYXR0YWNrc1xuXHRhcHAudXNlKGhwcCgpKVxuXG5cdGlmIChpc1Byb2R1Y3Rpb24pIHtcblx0XHRhcHAudXNlKFxuXHRcdFx0aHN0cyh7XG5cdFx0XHRcdC8vIDUgbWlucyBpbiBzZWNvbmRzXG5cdFx0XHRcdC8vIHdlIHdpbGwgc2NhbGUgdGhpcyB1cCBpbmNyZW1lbnRhbGx5IHRvIGVuc3VyZSB3ZSBkb250IGJyZWFrIHRoZVxuXHRcdFx0XHQvLyBhcHAgZm9yIGVuZCB1c2Vyc1xuXHRcdFx0XHQvLyBzZWUgZGVwbG95bWVudCByZWNvbW1lbmRhdGlvbnMgaGVyZSBodHRwczovL2hzdHNwcmVsb2FkLm9yZy8/ZG9tYWluPXNwZWN0cnVtLmNoYXRcblx0XHRcdFx0bWF4QWdlOiAzMDAsXG5cdFx0XHRcdGluY2x1ZGVTdWJEb21haW5zOiB0cnVlLFxuXHRcdFx0XHRwcmVsb2FkOiB0cnVlXG5cdFx0XHR9KVxuXHRcdClcblxuXHRcdGFwcC51c2UoZXhwcmVzc0VuZm9yY2VzU3NsKCkpXG5cdH1cblxuXHQvLyBUaGUgWC1GcmFtZS1PcHRpb25zIGhlYWRlciB0ZWxscyBicm93c2VycyB0byBwcmV2ZW50IHlvdXIgd2VicGFnZSBmcm9tIGJlaW5nIHB1dCBpbiBhbiBpZnJhbWUuXG5cdGFwcC51c2UoZnJhbWVndWFyZCh7IGFjdGlvbjogJ3NhbWVvcmlnaW4nIH0pKVxuXG5cdC8vIENyb3NzLXNpdGUgc2NyaXB0aW5nLCBhYmJyZXZpYXRlZCB0byDigJxYU1PigJ0sIGlzIGEgd2F5IGF0dGFja2VycyBjYW4gdGFrZSBvdmVyIHdlYnBhZ2VzLlxuXHRhcHAudXNlKHhzc0ZpbHRlcigpKVxuXG5cdC8vIFNldHMgdGhlIFgtRG93bmxvYWQtT3B0aW9ucyB0byBwcmV2ZW50IEludGVybmV0IEV4cGxvcmVyIGZyb20gZXhlY3V0aW5nXG5cdC8vIGRvd25sb2FkcyBpbiB5b3VyIHNpdGXigJlzIGNvbnRleHQuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9pZW5vb3Blbi9cblx0YXBwLnVzZShpZU5vT3BlbigpKVxuXG5cdC8vIERvbuKAmXQgU25pZmYgTWltZXR5cGUgbWlkZGxld2FyZSwgbm9TbmlmZiwgaGVscHMgcHJldmVudCBicm93c2VycyBmcm9tIHRyeWluZ1xuXHQvLyB0byBndWVzcyAo4oCcc25pZmbigJ0pIHRoZSBNSU1FIHR5cGUsIHdoaWNoIGNhbiBoYXZlIHNlY3VyaXR5IGltcGxpY2F0aW9ucy4gSXRcblx0Ly8gZG9lcyB0aGlzIGJ5IHNldHRpbmcgdGhlIFgtQ29udGVudC1UeXBlLU9wdGlvbnMgaGVhZGVyIHRvIG5vc25pZmYuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9kb250LXNuaWZmLW1pbWV0eXBlL1xuXHRhcHAudXNlKG5vU25pZmYoKSlcblxuXHRpZiAoZW5hYmxlTm9uY2UpIHtcblx0XHQvLyBBdHRhY2ggYSB1bmlxdWUgXCJub25jZVwiIHRvIGV2ZXJ5IHJlc3BvbnNlLiBUaGlzIGFsbG93cyB1c2UgdG8gZGVjbGFyZVxuXHRcdC8vIGlubGluZSBzY3JpcHRzIGFzIGJlaW5nIHNhZmUgZm9yIGV4ZWN1dGlvbiBhZ2FpbnN0IG91ciBjb250ZW50IHNlY3VyaXR5IHBvbGljeS5cblx0XHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRcdGFwcC51c2UoKHJlcXVlc3Q6IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdFx0XHRyZXNwb25zZS5sb2NhbHMubm9uY2UgPSB1dWlkLnY0KClcblx0XHRcdG5leHQoKVxuXHRcdH0pXG5cdH1cblxuXHQvLyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSAoQ1NQKVxuXHQvLyBJdCBjYW4gYmUgYSBwYWluIHRvIG1hbmFnZSB0aGVzZSwgYnV0IGl0J3MgYSByZWFsbHkgZ3JlYXQgaGFiaXQgdG8gZ2V0IGluIHRvLlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRjb25zdCBjc3BDb25maWcgPSB7XG5cdFx0ZGlyZWN0aXZlczoge1xuXHRcdFx0Ly8gVGhlIGRlZmF1bHQtc3JjIGlzIHRoZSBkZWZhdWx0IHBvbGljeSBmb3IgbG9hZGluZyBjb250ZW50IHN1Y2ggYXNcblx0XHRcdC8vIEphdmFTY3JpcHQsIEltYWdlcywgQ1NTLCBGb250cywgQUpBWCByZXF1ZXN0cywgRnJhbWVzLCBIVE1MNSBNZWRpYS5cblx0XHRcdC8vIEFzIHlvdSBtaWdodCBzdXNwZWN0LCBpcyB1c2VkIGFzIGZhbGxiYWNrIGZvciB1bnNwZWNpZmllZCBkaXJlY3RpdmVzLlxuXHRcdFx0ZGVmYXVsdFNyYzogW1wiJ3NlbGYnXCJdLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2YgSmF2YVNjcmlwdC5cblx0XHRcdHNjcmlwdFNyYzogW1xuXHRcdFx0XHRcIidzZWxmJ1wiLFxuXHRcdFx0XHRcIid1bnNhZmUtZXZhbCdcIixcblx0XHRcdFx0J3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbScsXG5cdFx0XHRcdCdjZG4ucmF2ZW5qcy5jb20nLFxuXHRcdFx0XHQnY2RuLnBvbHlmaWxsLmlvJyxcblx0XHRcdFx0J2Nkbi5hbXBsaXR1ZGUuY29tJyxcblxuXHRcdFx0XHQvLyBOb3RlOiBXZSB3aWxsIGV4ZWN1dGlvbiBvZiBhbnkgaW5saW5lIHNjcmlwdHMgdGhhdCBoYXZlIHRoZSBmb2xsb3dpbmdcblx0XHRcdFx0Ly8gbm9uY2UgaWRlbnRpZmllciBhdHRhY2hlZCB0byB0aGVtLlxuXHRcdFx0XHQvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgZ3VhcmRpbmcgeW91ciBhcHBsaWNhdGlvbiB3aGlsc3QgYWxsb3dpbmcgYW4gaW5saW5lXG5cdFx0XHRcdC8vIHNjcmlwdCB0byBkbyBkYXRhIHN0b3JlIHJlaHlkcmF0aW9uIChyZWR1eC9tb2J4L2Fwb2xsbykgZm9yIGV4YW1wbGUuXG5cdFx0XHRcdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdFx0XHRcdChfOiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IGAnbm9uY2UtJHtyZXNwb25zZS5sb2NhbHMubm9uY2V9J2Bcblx0XHRcdF0sXG5cblx0XHRcdC8vIERlZmluZXMgdGhlIG9yaWdpbnMgZnJvbSB3aGljaCBpbWFnZXMgY2FuIGJlIGxvYWRlZC5cblx0XHRcdC8vIEBub3RlOiBMZWF2ZSBvcGVuIHRvIGFsbCBpbWFnZXMsIHRvbyBtdWNoIGltYWdlIGNvbWluZyBmcm9tIGRpZmZlcmVudCBzZXJ2ZXJzLlxuXHRcdFx0aW1nU3JjOiBbJ2h0dHBzOicsICdodHRwOicsIFwiJ3NlbGYnXCIsICdkYXRhOicsICdibG9iOiddLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2Ygc3R5bGVzaGVldHMuXG5cdFx0XHRzdHlsZVNyYzogW1wiJ3NlbGYnXCIsIFwiJ3Vuc2FmZS1pbmxpbmUnXCJdLFxuXG5cdFx0XHQvLyBBcHBsaWVzIHRvIFhNTEh0dHBSZXF1ZXN0IChBSkFYKSwgV2ViU29ja2V0IG9yIEV2ZW50U291cmNlLlxuXHRcdFx0Ly8gSWYgbm90IGFsbG93ZWQgdGhlIGJyb3dzZXIgZW11bGF0ZXMgYSA0MDAgSFRUUCBzdGF0dXMgY29kZS5cblx0XHRcdGNvbm5lY3RTcmM6IFsnaHR0cHM6JywgJ3dzczonXSxcblxuXHRcdFx0Ly8gbGlzdHMgdGhlIFVSTHMgZm9yIHdvcmtlcnMgYW5kIGVtYmVkZGVkIGZyYW1lIGNvbnRlbnRzLlxuXHRcdFx0Ly8gRm9yIGV4YW1wbGU6IGNoaWxkLXNyYyBodHRwczovL3lvdXR1YmUuY29tIHdvdWxkIGVuYWJsZVxuXHRcdFx0Ly8gZW1iZWRkaW5nIHZpZGVvcyBmcm9tIFlvdVR1YmUgYnV0IG5vdCBmcm9tIG90aGVyIG9yaWdpbnMuXG5cdFx0XHQvLyBAbm90ZTogd2UgYWxsb3cgdXNlcnMgdG8gZW1iZWQgYW55IHBhZ2UgdGhleSB3YW50LlxuXHRcdFx0Y2hpbGRTcmM6IFsnaHR0cHM6JywgJ2h0dHA6J10sXG5cblx0XHRcdC8vIGFsbG93cyBjb250cm9sIG92ZXIgRmxhc2ggYW5kIG90aGVyIHBsdWdpbnMuXG5cdFx0XHRvYmplY3RTcmM6IFtcIidub25lJ1wiXSxcblxuXHRcdFx0Ly8gcmVzdHJpY3RzIHRoZSBvcmlnaW5zIGFsbG93ZWQgdG8gZGVsaXZlciB2aWRlbyBhbmQgYXVkaW8uXG5cdFx0XHRtZWRpYVNyYzogW1wiJ25vbmUnXCJdXG5cdFx0fSxcblxuXHRcdC8vIFNldCB0byB0cnVlIGlmIHlvdSBvbmx5IHdhbnQgYnJvd3NlcnMgdG8gcmVwb3J0IGVycm9ycywgbm90IGJsb2NrIHRoZW0uXG5cdFx0cmVwb3J0T25seTogTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgfHwgQm9vbGVhbihGT1JDRV9ERVYpIHx8IGZhbHNlLFxuXHRcdC8vIE5lY2Vzc2FyeSBiZWNhdXNlIG9mIFplaXQgQ0ROIHVzYWdlXG5cdFx0YnJvd3NlclNuaWZmOiBmYWxzZVxuXHR9XG5cblx0aWYgKGVuYWJsZUNTUCkge1xuXHRcdGFwcC51c2UoY29udGVudFNlY3VyaXR5UG9saWN5KGNzcENvbmZpZykpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VjdXJpdHlcbiIsImltcG9ydCAqIGFzIHRvb2J1c3kgZnJvbSAndG9vYnVzeS1qcydcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmICghaXNEZXZlbG9wbWVudCAmJiB0b29idXN5KCkpIHtcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwM1xuXHRcdHJlcy5zZW5kKCdJdCBsb29rZSBsaWtlIHRoZSBzZXZlciBpcyBidXNzeS4gV2FpdCBmZXcgc2Vjb25kcy4uLicpXG5cdH0gZWxzZSB7XG5cdFx0Ly8gcXVldWUgdXAgdGhlIHJlcXVlc3QgYW5kIHdhaXQgZm9yIGl0IHRvIGNvbXBsZXRlIGluIHRlc3RpbmcgYW5kIGRldmVsb3BtZW50IHBoYXNlXG5cdFx0bmV4dCgpXG5cdH1cbn1cbiIsImltcG9ydCB7IFNlcnZlciwgY3JlYXRlU2VydmVyIH0gZnJvbSAnaHR0cCdcblxuaW1wb3J0IEFwcCBmcm9tICdhcHAuc2VydmVyJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGdyYXBocWxTZXJ2ZXIgZnJvbSAnZ3JhcGhxbC5zZXJ2ZXInXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCB7IG5vcm1hbGl6ZVBvcnQgfSBmcm9tICd1dGlsbGl0eS9ub3JtYWxpemUnXG5cbmNsYXNzIE9vam9iU2VydmVyIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIHNlcnZlcjogU2VydmVyXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0Z3JhcGhxbFNlcnZlci5hcHBseU1pZGRsZXdhcmUoe1xuXHRcdFx0YXBwLFxuXHRcdFx0b25IZWFsdGhDaGVjazogKCkgPT5cblx0XHRcdFx0bmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdC8vIFJlcGxhY2UgdGhlIGB0cnVlYCBpbiB0aGlzIGNvbmRpdGlvbmFsIHdpdGggbW9yZSBzcGVjaWZpYyBjaGVja3MhXG5cdFx0XHRcdFx0aWYgKHBhcnNlSW50KCcyJykgPT09IDIpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKGFwcClcblx0XHRncmFwaHFsU2VydmVyLmluc3RhbGxTdWJzY3JpcHRpb25IYW5kbGVycyh0aGlzLnNlcnZlcilcblx0fVxuXG5cdHN0YXJ0U3luY1NlcnZlciA9IGFzeW5jIChwb3J0OiBzdHJpbmcpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgUE9SVCA9IG5vcm1hbGl6ZVBvcnQocG9ydClcblx0XHRcdHRoaXMuc2VydmVyLmxpc3RlbihQT1JULCAoKSA9PiB7XG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBzZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLmdyYXBocWxQYXRofWApXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBTdWJzY3JpcHRpb25zIHJlYWR5IGF0IHdzOi8vbG9jYWxob3N0OiR7UE9SVH0ke2dyYXBocWxTZXJ2ZXIuc3Vic2NyaXB0aW9uc1BhdGh9YClcblx0XHRcdFx0bG9nZ2VyLmluZm8oYFRyeSB5b3VyIGhlYWx0aCBjaGVjayBhdDogaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9Ly53ZWxsLWtub3duL2Fwb2xsby9zZXJ2ZXItaGVhbHRoYClcblx0XHRcdH0pXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGF3YWl0IHRoaXMuc3RvcFNlcnZlcigpXG5cdFx0fVxuXHR9XG5cblx0c3RvcFNlcnZlciA9IGFzeW5jICgpID0+IHtcblx0XHRwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRsb2dnZXIuaW5mbygnQ2xvc2luZyBvb2pvYiBTeW5jU2VydmVyIC4uLicpXG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRoaXMuc2VydmVyLmNsb3NlKClcblx0XHRcdFx0bG9nZ2VyLmluZm8oJ29vam9iIFN5bmNTZXJ2ZXIgQ2xvc2VkJylcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIENsb3NpbmcgU3luY1NlcnZlciBTZXJ2ZXIgQ29ubmVjdGlvbicpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cdFx0XHRcdHByb2Nlc3Mua2lsbChwcm9jZXNzLnBpZClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB7IHN0YXJ0U3luY1NlcnZlciwgc3RvcFNlcnZlciwgc2VydmVyLCBhcHAgfSA9IG5ldyBPb2pvYlNlcnZlcihBcHApXG4iLCJpbXBvcnQgeyBKYWVnZXJFeHBvcnRlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2V4cG9ydGVyLWphZWdlcidcbmltcG9ydCB7IE1ldGVyUHJvdmlkZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9tZXRyaWNzJ1xuaW1wb3J0IHsgTm9kZVRyYWNlclByb3ZpZGVyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvbm9kZSdcbmltcG9ydCB7IFByb21ldGhldXNFeHBvcnRlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2V4cG9ydGVyLXByb21ldGhldXMnXG5pbXBvcnQgeyBTaW1wbGVTcGFuUHJvY2Vzc29yIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvdHJhY2luZydcbmltcG9ydCBvcGVudGVsZW1ldHJ5IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSdcblxuY29uc3QgdHJhY2VyID0gKHNlcnZpY2VOYW1lOiBzdHJpbmcpID0+IHtcblx0Y29uc3QgcHJvdmlkZXIgPSBuZXcgTm9kZVRyYWNlclByb3ZpZGVyKHtcblx0XHRwbHVnaW5zOiB7XG5cdFx0XHRncnBjOiB7XG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdHBhdGg6ICdAb3BlbnRlbGVtZXRyeS9wbHVnaW4tZ3JwYydcblx0XHRcdH1cblx0XHR9XG5cdH0pXG5cblx0Y29uc3QgZXhwb3J0ZXIgPSBuZXcgSmFlZ2VyRXhwb3J0ZXIoe1xuXHRcdHNlcnZpY2VOYW1lXG5cdH0pXG5cblx0Y29uc3QgbWV0ZXJQcm92aWRlciA9IG5ldyBNZXRlclByb3ZpZGVyKHtcblx0XHQvLyBUaGUgUHJvbWV0aGV1cyBleHBvcnRlciBydW5zIGFuIEhUVFAgc2VydmVyIHdoaWNoXG5cdFx0Ly8gdGhlIFByb21ldGhldXMgYmFja2VuZCBzY3JhcGVzIHRvIGNvbGxlY3QgbWV0cmljcy5cblx0XHRleHBvcnRlcjogbmV3IFByb21ldGhldXNFeHBvcnRlcih7IHN0YXJ0U2VydmVyOiB0cnVlIH0pLFxuXHRcdGludGVydmFsOiAxMDAwXG5cdH0pXG5cblx0cHJvdmlkZXIuYWRkU3BhblByb2Nlc3NvcihuZXcgU2ltcGxlU3BhblByb2Nlc3NvcihleHBvcnRlcikpXG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyaW5nIHRoZSBwcm92aWRlciB3aXRoIHRoZSBBUEkgYWxsb3dzIGl0IHRvIGJlIGRpc2NvdmVyZWRcblx0ICogYW5kIHVzZWQgYnkgaW5zdHJ1bWVudGF0aW9uIGxpYnJhcmllcy4gVGhlIE9wZW5UZWxlbWV0cnkgQVBJIHByb3ZpZGVzXG5cdCAqIG1ldGhvZHMgdG8gc2V0IGdsb2JhbCBTREsgaW1wbGVtZW50YXRpb25zLCBidXQgdGhlIGRlZmF1bHQgU0RLIHByb3ZpZGVzXG5cdCAqIGEgY29udmVuaWVuY2UgbWV0aG9kIG5hbWVkIGByZWdpc3RlcmAgd2hpY2ggcmVnaXN0ZXJzIHNhbWUgZGVmYXVsdHNcblx0ICogZm9yIHlvdS5cblx0ICpcblx0ICogQnkgZGVmYXVsdCB0aGUgTm9kZVRyYWNlclByb3ZpZGVyIHVzZXMgVHJhY2UgQ29udGV4dCBmb3IgcHJvcGFnYXRpb25cblx0ICogYW5kIEFzeW5jSG9va3NTY29wZU1hbmFnZXIgZm9yIGNvbnRleHQgbWFuYWdlbWVudC4gVG8gbGVhcm4gYWJvdXRcblx0ICogY3VzdG9taXppbmcgdGhpcyBiZWhhdmlvciwgc2VlIEFQSSBSZWdpc3RyYXRpb24gT3B0aW9ucyBiZWxvdy5cblx0ICovXG5cdHByb3ZpZGVyLnJlZ2lzdGVyKClcblxuXHQvKipcblx0ICogUmVnaXN0ZXJpbmcgdGhlIHByb3ZpZGVyIHdpdGggdGhlIEFQSSBhbGxvd3MgaXQgdG8gYmUgZGlzY292ZXJlZFxuXHQgKiBhbmQgdXNlZCBieSBpbnN0cnVtZW50YXRpb24gbGlicmFyaWVzLlxuXHQgKi9cblx0b3BlbnRlbGVtZXRyeS5tZXRyaWNzLnNldEdsb2JhbE1ldGVyUHJvdmlkZXIobWV0ZXJQcm92aWRlcilcblxuXHRyZXR1cm4gb3BlbnRlbGVtZXRyeS50cmFjZS5nZXRUcmFjZXIoJ3NlcnZpY2U6Z2F0ZXdheScpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYWNlclxuIiwiaW1wb3J0IHsgY3JlYXRlQ2lwaGVyLCBjcmVhdGVEZWNpcGhlciB9IGZyb20gJ2NyeXB0bydcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY2xhc3MgQXBwQ3J5cHRvIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHJpdmF0ZSBFTkNSWVBUX0FMR09SSVRITTogc3RyaW5nXG5cdHByaXZhdGUgRU5DUllQVF9TRUNSRVQ6IHN0cmluZ1xuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHRjb25zdCB7IEVOQ1JZUFRfU0VDUkVUID0gJ2RvZG9kdWNrQE45JywgRU5DUllQVF9BTEdPUklUSE0gPSAnYWVzLTI1Ni1jdHInIH0gPSBwcm9jZXNzLmVudlxuXG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0XHR0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNID0gRU5DUllQVF9BTEdPUklUSE1cblx0XHR0aGlzLkVOQ1JZUFRfU0VDUkVUID0gRU5DUllQVF9TRUNSRVRcblx0fVxuXG5cdHB1YmxpYyBlbmNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBFbmNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjaXBoZXIgPSBjcmVhdGVDaXBoZXIodGhpcy5FTkNSWVBUX0FMR09SSVRITSwgdGhpcy5FTkNSWVBUX1NFQ1JFVClcblx0XHRcdGxldCBjcnlwdGVkID0gY2lwaGVyLnVwZGF0ZSh0ZXh0LCAndXRmOCcsICdoZXgnKVxuXHRcdFx0Y3J5cHRlZCArPSBjaXBoZXIuZmluYWwoJ2hleCcpXG5cblx0XHRcdHJldHVybiBjcnlwdGVkXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZGVjcnlwdCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHR0aGlzLmFwcC5sb2dnZXIuaW5mbyhgRGVjcnlwdCBmb3IgJHt0ZXh0fWApXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGRlYyA9IGRlY2lwaGVyLnVwZGF0ZSh0ZXh0LCAnaGV4JywgJ3V0ZjgnKVxuXHRcdFx0ZGVjICs9IGRlY2lwaGVyLmZpbmFsKCd1dGY4JylcblxuXHRcdFx0cmV0dXJuIGRlY1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcC5sb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSlcblxuXHRcdFx0cmV0dXJuICcnXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENyeXB0b1xuIiwiaW1wb3J0IEFwcENyeXB0byBmcm9tICcuL2NyeXB0bydcbmltcG9ydCBBcHBTbHVnaWZ5IGZyb20gJy4vc2x1Z2lmeSdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IElBcHBVdGlscyB9IGZyb20gJy4vdXRpbC5pbnRlcmZhY2UnXG5cbmNsYXNzIEFwcFV0aWxzIGltcGxlbWVudHMgSUFwcFV0aWxzIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblxuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKCdJbml0aWFsaXplZCBBcHBVdGlscycpXG5cdH1cblxuXHRwdWJsaWMgYXBwbHlVdGlscyA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcblx0XHRjb25zdCB7IGVuY3J5cHQsIGRlY3J5cHQgfSA9IG5ldyBBcHBDcnlwdG8odGhpcy5hcHApXG5cdFx0Y29uc3QgeyBzbHVnaWZ5IH0gPSBuZXcgQXBwU2x1Z2lmeSh0aGlzLmFwcClcblx0XHR0aGlzLmFwcC51dGlsaXR5ID0ge1xuXHRcdFx0ZW5jcnlwdCxcblx0XHRcdGRlY3J5cHQsXG5cdFx0XHRzbHVnaWZ5XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWVcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBVdGlsc1xuIiwiY29uc3Qgbm9ybWFsaXplUG9ydCA9IChwb3J0VmFsdWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG5cdGNvbnN0IHBvcnQgPSBwYXJzZUludChwb3J0VmFsdWUsIDEwKVxuXG5cdGlmIChpc05hTihwb3J0KSkge1xuXHRcdHJldHVybiA4MDgwXG5cdH1cblxuXHRpZiAocG9ydCA+PSAwKSB7XG5cdFx0cmV0dXJuIHBvcnRcblx0fVxuXG5cdHJldHVybiBwb3J0XG59XG5cbmV4cG9ydCB7IG5vcm1hbGl6ZVBvcnQgfVxuZXhwb3J0IGRlZmF1bHQgbm9ybWFsaXplUG9ydFxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBTbHVnaWZ5IHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0fVxuXG5cdHB1YmxpYyBzbHVnaWZ5ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBTbHVnaWZ5IGZvciAke3RleHR9YClcblxuXHRcdHJldHVybiB0ZXh0XG5cdFx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdFx0LnJlcGxhY2UoL1teXFx3IF0rL2csICcnKVxuXHRcdFx0LnJlcGxhY2UoLyArL2csICctJylcblx0fVxufVxuXG5leHBvcnQgeyBBcHBTbHVnaWZ5IH1cbmV4cG9ydCBkZWZhdWx0IEFwcFNsdWdpZnlcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9vb2pvYi1wcm90b2J1ZlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L2FwaVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItcHJvbWV0aGV1c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9tZXRyaWNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L25vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2x1c3RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21wcmVzc2lvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnYvY29uZmlnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JwY1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoZWxtZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaG9zdC12YWxpZGF0aW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhwcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRvb2J1c3ktanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHNsaWJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dWlkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndpbnN0b25cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==