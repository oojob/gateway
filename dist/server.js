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
/******/ 	var hotCurrentHash = "fc4af0c53077094f2065";
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
        logger.info('mutation : AUTH');
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
const depthLimit = __webpack_require__(/*! graphql-depth-limit */ "graphql-depth-limit");
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
const apollo_server_cache_redis_1 = __webpack_require__(/*! apollo-server-cache-redis */ "apollo-server-cache-redis");
const redis_1 = __webpack_require__(/*! service/config/redis */ "./src/service/config/redis/index.ts");
const graphql_error_1 = __webpack_require__(/*! service/error/graphql.error */ "./src/service/error/graphql.error.ts");
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
    formatError: graphql_error_1.default(),
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
    tracing: true,
    introspection: "development" !== 'production',
    engine: false,
    validationRules: [depthLimit(10)],
    cacheControl: {
        calculateHttpHeaders: false,
        defaultMaxAge: 60
    },
    cache: new apollo_server_cache_redis_1.RedisCache(Object.assign(Object.assign({}, redis_1.config), { keyPrefix: 'apollo-cache:' }))
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
const sentry_1 = __webpack_require__(/*! service/config/sentry */ "./src/service/config/sentry/index.ts");
const errorHandler = (err, req, res, next) => {
    if (err) {
        console.error(err);
        res.status(500).send('Oops, something went wrong! Our engineers have been alerted and will fix this asap.');
        sentry_1.default.captureException(err);
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
const sentry_1 = __webpack_require__(/*! service/config/sentry */ "./src/service/config/sentry/index.ts");
const cors_1 = __webpack_require__(/*! middlewares/cors */ "./src/middlewares/cors.ts");
const csrf_1 = __webpack_require__(/*! middlewares/csrf */ "./src/middlewares/csrf.ts");
const error_handler_1 = __webpack_require__(/*! middlewares/error-handler */ "./src/middlewares/error-handler.ts");
const security_1 = __webpack_require__(/*! middlewares/security */ "./src/middlewares/security.ts");
const toobusy_1 = __webpack_require__(/*! middlewares/toobusy */ "./src/middlewares/toobusy.ts");
const { ENABLE_CSP = true, ENABLE_NONCE = true } = process.env;
const middlewares = (app) => {
    app.use(sentry_1.default.Handlers.requestHandler());
    app.use(cors_1.default());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(csrf_1.default);
    app.use(sentry_1.default.Handlers.errorHandler());
    app.use(error_handler_1.default);
    security_1.default(app, {
        enableCSP: Boolean(ENABLE_CSP),
        enableNonce: Boolean(ENABLE_NONCE)
    });
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

/***/ "./src/service/config/redis/index.ts":
/*!*******************************************!*\
  !*** ./src/service/config/redis/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __webpack_require__(/*! ioredis */ "ioredis");
const redisConfig = {
    port: process.env.REDIS_CACHE_PORT ? parseInt(process.env.REDIS_CACHE_PORT) : undefined,
    host: process.env.REDIS_CACHE_URL,
    password: process.env.REDIS_CACHE_PASSWORD
};
exports.config =  false ? undefined : undefined;
const redis = new ioredis_1.default(exports.config);
exports.redis = redis;
exports.default = redis;


/***/ }),

/***/ "./src/service/config/sentry/index.ts":
/*!********************************************!*\
  !*** ./src/service/config/sentry/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __webpack_require__(/*! @sentry/node */ "@sentry/node");
const integrations_1 = __webpack_require__(/*! @sentry/integrations */ "@sentry/integrations");
global.__rootdir__ = __dirname || process.cwd();
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new integrations_1.RewriteFrames({
            root: global.__rootdir__
        })
    ],
    serverName: process.env.SENTRY_NAME
});
exports.default = Sentry;


/***/ }),

/***/ "./src/service/error/graphql.error.ts":
/*!********************************************!*\
  !*** ./src/service/error/graphql.error.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const user_error_1 = __webpack_require__(/*! service/error/user.error */ "./src/service/error/user.error.ts");
const graphql_rate_limit_1 = __webpack_require__(/*! graphql-rate-limit */ "graphql-rate-limit");
const sentry_1 = __webpack_require__(/*! service/config/sentry */ "./src/service/config/sentry/index.ts");
const logger_1 = __webpack_require__(/*! logger */ "./src/logger.ts");
const queryRe = /\s*(query|mutation)[^{]*/;
const collectQueries = (query) => {
    if (!query)
        return 'No query';
    return query
        .split('\n')
        .map((line) => {
        const m = line.match(queryRe);
        return m ? m[0].trim() : '';
    })
        .filter((line) => !!line)
        .join('\n');
};
const errorPath = (error) => {
    if (!error.path)
        return '';
    return error.path
        .map((value, index) => {
        if (!index)
            return value;
        return typeof value === 'number' ? `[${value}]` : `.${value}`;
    })
        .join('');
};
const logGraphQLError = (error, req) => {
    logger_1.default.info('---GraphQL Error---');
    logger_1.default.error(error);
    error &&
        error.extensions &&
        error.extensions.exception &&
        logger_1.default.error(error.extensions.exception.stacktrace.join('\n'));
    if (req) {
        logger_1.default.info(collectQueries(req.body.query));
        logger_1.default.info('variables', JSON.stringify(req.body.variables || {}));
    }
    const path = errorPath(error);
    path && logger_1.default.info('path', path);
    logger_1.default.info('-------------------\n');
};
const createGraphQLErrorFormatter = (req) => (error) => {
    logGraphQLError(error, req);
    const err = error.originalError || error;
    const isUserError = err[user_error_1.IsUserError] || err instanceof graphql_rate_limit_1.RateLimitError;
    let sentryId = 'ID only generated in production';
    if (!isUserError || err instanceof graphql_rate_limit_1.RateLimitError) {
        if (false) {}
    }
    return {
        message: isUserError ? error.message : `Internal server error: ${sentryId}`,
        stack: !("development" === 'production')
    };
};
exports.default = createGraphQLErrorFormatter;


/***/ }),

/***/ "./src/service/error/user.error.ts":
/*!*****************************************!*\
  !*** ./src/service/error/user.error.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUserError = Symbol('IsUserError');
class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Error';
        this.message = message;
        this[exports.IsUserError] = true;
        Error.captureStackTrace(this);
    }
}
exports.default = UserError;


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

/***/ "@sentry/integrations":
/*!***************************************!*\
  !*** external "@sentry/integrations" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sentry/integrations");

/***/ }),

/***/ "@sentry/node":
/*!*******************************!*\
  !*** external "@sentry/node" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sentry/node");

/***/ }),

/***/ "apollo-server-cache-redis":
/*!********************************************!*\
  !*** external "apollo-server-cache-redis" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-cache-redis");

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

/***/ "graphql-depth-limit":
/*!**************************************!*\
  !*** external "graphql-depth-limit" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-depth-limit");

/***/ }),

/***/ "graphql-rate-limit":
/*!*************************************!*\
  !*** external "graphql-rate-limit" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("graphql-rate-limit");

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

/***/ "ioredis":
/*!**************************!*\
  !*** external "ioredis" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ioredis");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NzcmYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2Vycm9yLWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL2NvbmZpZy9yZWRpcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZS9jb25maWcvc2VudHJ5L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL2Vycm9yL2dyYXBocWwuZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2UvZXJyb3IvdXNlci5lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhY2VyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9jcnlwdG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9ub3JtYWxpemUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L3NsdWdpZnkudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL29vam9iLXByb3RvYnVmXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvYXBpXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItamFlZ2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItcHJvbWV0aGV1c1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvcGVudGVsZW1ldHJ5L21ldHJpY3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBzZW50cnkvaW50ZWdyYXRpb25zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQHNlbnRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1jYWNoZS1yZWRpc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudi9jb25maWdcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImdyYXBocWwtZGVwdGgtbGltaXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncmFwaHFsLXJhdGUtbGltaXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncnBjXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaGVsbWV0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaG9zdC12YWxpZGF0aW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHBwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImlvcmVkaXNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b29idXN5LWpzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHNsaWJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbnN0b25cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FB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LGdCQUFnQixLQUFLO1FBQ3JCO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLFlBQVk7UUFDNUI7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQSxjQUFjLDRCQUE0QjtRQUMxQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7O1FBRUo7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQSxlQUFlLDRCQUE0QjtRQUMzQztRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBLGVBQWUsNEJBQTRCO1FBQzNDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxpQkFBaUIsdUNBQXVDO1FBQ3hEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FB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OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCIuaG90L1wiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCIpO1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHtcbiBcdFx0dHJ5IHtcbiBcdFx0XHR2YXIgdXBkYXRlID0gcmVxdWlyZShcIi4vXCIgKyBcIi5ob3QvXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiZmM0YWYwYzUzMDc3MDk0ZjIwNjVcIjtcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdH1cbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcbiBcdFx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0FwcGx5KSB7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRcdFx0XHRpZiAoXG4gXHRcdFx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcyxcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdFx0XHRcdClcbiBcdFx0XHRcdFx0XHQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZCAmJlxuIFx0XHRcdFx0Ly8gcmVtb3ZlZCBzZWxmLWFjY2VwdGVkIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSByZXF1aXJlZFxuIFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdH0pO1xuXG4gXHRcdHZhciBpZHg7XG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuIFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XG4gXHRcdFx0XHRjYihkYXRhKTtcbiBcdFx0XHR9XG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcblxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XG4gXHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIHtcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuIFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG4gXHRcdGZvciAobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuIFx0XHRcdFx0XHRcdGlmIChjYikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGNiKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XG4gXHRcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcbiBcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcbiBcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnIyO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG4gXHRcdGlmIChlcnJvcikge1xuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiBcdFx0fVxuXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHRcIltITVJdIENvbnNpZGVyIHVzaW5nIHRoZSBOYW1lZE1vZHVsZXNQbHVnaW4gZm9yIG1vZHVsZSBuYW1lcy5cIlxuXHRcdFx0KTtcblx0fVxufTtcbiIsInZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID1cblx0XHQobG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJlcnJvclwiKTtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBzdGFjaztcblx0fVxufTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdFxuXHRcdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIiwiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgQXBwVXRpbHMgZnJvbSAndXRpbGxpdHknXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCBtaWRkbGV3YWVzIGZyb20gJ21pZGRsZXdhcmVzJ1xuXG5jbGFzcyBBcHAge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwdWJsaWMgYXBwVXRpbHM6IEFwcFV0aWxzXG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5hcHAgPSBleHByZXNzKClcblx0XHR0aGlzLmFwcC5sb2dnZXIgPSBsb2dnZXJcblxuXHRcdHRoaXMuYXBwVXRpbHMgPSBuZXcgQXBwVXRpbHModGhpcy5hcHApXG5cdFx0dGhpcy5hcHBseVNlcnZlcigpXG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGJvb3RzdHJhcCgpOiBBcHAge1xuXHRcdHJldHVybiBuZXcgQXBwKClcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgdGhpcy5hcHBVdGlscy5hcHBseVV0aWxzKClcblx0XHRhd2FpdCB0aGlzLmFwcGx5TWlkZGxld2FyZSgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5TWlkZGxld2FyZSA9IGFzeW5jICgpID0+IHtcblx0XHRtaWRkbGV3YWVzKHRoaXMuYXBwKVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBBcHAoKVxuZXhwb3J0IGRlZmF1bHQgYXBwbGljYXRpb24uYXBwXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBDb21wYW55IGltcGxlbWVudHMgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgbmFtZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBjcmVhdGVkQnk6IElEXFxuICB1cmw6IFN0cmluZ1xcbiAgbG9nbzogU3RyaW5nXFxuICBsb2NhdGlvbjogU3RyaW5nXFxuICBmb3VuZGVkX3llYXI6IFN0cmluZ1xcbiAgbm9PZkVtcGxveWVlczogUmFuZ2VcXG4gIGxhc3RBY3RpdmU6IFRpbWVzdGFtcFxcbiAgaGlyaW5nU3RhdHVzOiBCb29sZWFuXFxuICBza2lsbHM6IFtTdHJpbmddXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG5pbnB1dCBDb21wYW55SW5wdXQge1xcbiAgY3JlYXRlZEJ5OiBJRCFcXG4gIG5hbWU6IFN0cmluZyFcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmchXFxuICB1cmw6IFN0cmluZ1xcbiAgbG9nbzogU3RyaW5nXFxuICBsb2NhdGlvbjogU3RyaW5nXFxuICBmb3VuZGVkWWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZUlucHV0XFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBDdXJyZW50U3RhdHVzIHtcXG4gIEFDVElWRVxcbiAgSE9MRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG5lbnVtIEpvYlR5cGUge1xcbiAgREVGQVVMVFxcbiAgRkVBVFVSRURcXG4gIFBSRU1JVU1cXG59XFxuXFxudHlwZSBTYWxsYXJ5IHtcXG4gIHZhbHVlOiBGbG9hdCFcXG4gIGN1cnJlbmN5OiBTdHJpbmchXFxufVxcblxcbnR5cGUgSm9iIGltcGxlbWVudHMgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgdHlwZTogSm9iVHlwZSFcXG4gIGNhdGVnb3J5OiBbU3RyaW5nIV0hXFxuICBkZXNjOiBTdHJpbmchXFxuICBza2lsbHNSZXF1aXJlZDogW1N0cmluZyFdIVxcbiAgc2FsbGFyeTogUmFuZ2VcXG4gIGxvY2F0aW9uOiBTdHJpbmchXFxuICBhdHRhY2htZW50OiBbQXR0YWNobWVudF1cXG4gIHN0YXR1czogQ3VycmVudFN0YXR1c1xcbiAgdmlld3M6IEludFxcbiAgdXNlcnNBcHBsaWVkOiBbU3RyaW5nIV1cXG4gIGNyZWF0ZWRCeTogU3RyaW5nXFxuICBjb21wYW55OiBTdHJpbmchXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG50eXBlIEpvYlJlc3VsdEN1cnNvciB7XFxuICBlZGdlczogRWRnZSFcXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcXG4gIHRvdGFsQ291bnQ6IEludCFcXG59XFxuXFxuaW5wdXQgU2FsbGFyeUlucHV0IHtcXG4gIHZhbHVlOiBGbG9hdCFcXG4gIGN1cnJlbmN5OiBTdHJpbmchXFxufVxcblxcbmlucHV0IENyZWF0ZUpvYklucHV0IHtcXG4gIG5hbWU6IFN0cmluZyFcXG4gIHR5cGU6IEpvYlR5cGUhXFxuICBjYXRlZ29yeTogW1N0cmluZyFdIVxcbiAgZGVzYzogU3RyaW5nIVxcbiAgc2tpbGxzX3JlcXVpcmVkOiBbU3RyaW5nIV0hXFxuICBzYWxsYXJ5OiBSYW5nZUlucHV0IVxcbiAgc2FsbGFyeV9tYXg6IFNhbGxhcnlJbnB1dCFcXG4gIGF0dGFjaG1lbnQ6IFtBdHRhY2htZW50SW5wdXRdXFxuICBsb2NhdGlvbjogU3RyaW5nIVxcbiAgc3RhdHVzOiBDdXJyZW50U3RhdHVzIVxcbiAgY29tcGFueTogU3RyaW5nIVxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGdycGMgZnJvbSAnZ3JwYydcblxuaW1wb3J0IHsgUHJvZmlsZVNlcnZpY2VDbGllbnQgfSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZSdcblxuY29uc3QgeyBBQ0NPVU5UX1NFUlZJQ0VfVVJJID0gJ2xvY2FsaG9zdDozMDAwJyB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHByb2ZpbGVDbGllbnQgPSBuZXcgUHJvZmlsZVNlcnZpY2VDbGllbnQoQUNDT1VOVF9TRVJWSUNFX1VSSSwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuXG5leHBvcnQgZGVmYXVsdCBwcm9maWxlQ2xpZW50XG4iLCJpbXBvcnQge1xuXHRBY2Nlc3NEZXRhaWxzLFxuXHRBdXRoUmVxdWVzdCxcblx0QXV0aFJlc3BvbnNlLFxuXHRQcm9maWxlLFxuXHRQcm9maWxlU2VjdXJpdHksXG5cdFJlYWRQcm9maWxlUmVxdWVzdCxcblx0VG9rZW5SZXF1ZXN0LFxuXHRWYWxpZGF0ZUVtYWlsUmVxdWVzdCxcblx0VmFsaWRhdGVVc2VybmFtZVJlcXVlc3Rcbn0gZnJvbSAnQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUvc2VydmljZV9wYidcbmltcG9ydCB7XG5cdEFjY2Vzc0RldGFpbHNSZXNwb25zZSBhcyBBY2Nlc3NEZXRhaWxzUmVzcG9uc2VTY2hlbWEsXG5cdEF1dGhSZXNwb25zZSBhcyBBdXRoUmVzcG9uc2VTY2hlbWEsXG5cdERlZmF1bHRSZXNwb25zZSBhcyBEZWZhdWx0UmVzcG9uc2VTY2hlbWEsXG5cdElkIGFzIElkU2NoZW1hLFxuXHRNdXRhdGlvblJlc29sdmVycyxcblx0UHJvZmlsZSBhcyBQcm9maWxlU2NoZW1hLFxuXHRQcm9maWxlU2VjdXJpdHkgYXMgUHJvZmlsZVNlY3VyaXR5U2NoZW1hLFxuXHRRdWVyeVJlc29sdmVyc1xufSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcbmltcG9ydCB7IERlZmF1bHRSZXNwb25zZSwgRW1haWwsIElkLCBJZGVudGlmaWVyIH0gZnJvbSAnQG9vam9iL29vam9iLXByb3RvYnVmJ1xuaW1wb3J0IHtcblx0YXV0aCxcblx0Y3JlYXRlUHJvZmlsZSxcblx0bG9nb3V0LFxuXHRyZWFkUHJvZmlsZSxcblx0cmVmcmVzaFRva2VuLFxuXHR2YWxpZGF0ZUVtYWlsLFxuXHR2YWxpZGF0ZVVzZXJuYW1lLFxuXHR2ZXJpZnlUb2tlblxufSBmcm9tICdjbGllbnQvcHJvZmlsZS90cmFuc2Zvcm1lcidcblxuaW1wb3J0IHsgQXV0aGVudGljYXRpb25FcnJvciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcbmltcG9ydCBVc2VyRXJyb3IgZnJvbSAnc2VydmljZS9lcnJvci91c2VyLmVycm9yJ1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFRva2VuTWV0YWRhdGEgPSBhc3luYyAodG9rZW46IHN0cmluZyk6IFByb21pc2U8QWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hPiA9PiB7XG5cdGNvbnN0IHRva2VuUmVxdWVzdCA9IG5ldyBUb2tlblJlcXVlc3QoKVxuXG5cdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblxuXHRjb25zdCByZXM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYSA9IHt9XG5cdHRyeSB7XG5cdFx0Y29uc3QgdG9rZW5SZXMgPSAoYXdhaXQgdmVyaWZ5VG9rZW4odG9rZW5SZXF1ZXN0KSkgYXMgQWNjZXNzRGV0YWlsc1xuXHRcdHJlcy52ZXJpZmllZCA9IHRva2VuUmVzLmdldFZlcmlmaWVkKClcblx0XHRyZXMuYWNjZXNzVXVpZCA9IHRva2VuUmVzLmdldEFjY2Vzc1V1aWQoKVxuXHRcdHJlcy5hY2NvdW50VHlwZSA9IHRva2VuUmVzLmdldEFjY291bnRUeXBlKClcblx0XHRyZXMuYXV0aG9yaXplZCA9IHRva2VuUmVzLmdldEF1dGhvcml6ZWQoKVxuXHRcdHJlcy5lbWFpbCA9IHRva2VuUmVzLmdldEVtYWlsKClcblx0XHRyZXMuaWRlbnRpZmllciA9IHRva2VuUmVzLmdldElkZW50aWZpZXIoKVxuXHRcdHJlcy51c2VySWQgPSB0b2tlblJlcy5nZXRVc2VySWQoKVxuXHRcdHJlcy51c2VybmFtZSA9IHRva2VuUmVzLmdldFVzZXJuYW1lKClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXMudmVyaWZpZWQgPSBmYWxzZVxuXHRcdHJlcy5hY2Nlc3NVdWlkID0gbnVsbFxuXHRcdHJlcy5hY2NvdW50VHlwZSA9IG51bGxcblx0XHRyZXMuYXV0aG9yaXplZCA9IGZhbHNlXG5cdFx0cmVzLmVtYWlsID0gbnVsbFxuXHRcdHJlcy5leHAgPSBudWxsXG5cdFx0cmVzLmlkZW50aWZpZXIgPSBudWxsXG5cdFx0cmVzLnVzZXJJZCA9IG51bGxcblx0XHRyZXMudXNlcm5hbWUgPSBudWxsXG5cdH1cblxuXHRyZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBjb25zdCBRdWVyeTogUXVlcnlSZXNvbHZlcnMgPSB7XG5cdFZhbGlkYXRlVXNlcm5hbWU6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdHJhY2VyLCBsb2dnZXIgfSkgPT4ge1xuXHRcdGNvbnN0IF90cmFjZXIgPSB0cmFjZXIoJ3NlcnZpY2UtcHJvZmlsZScpXG5cdFx0bG9nZ2VyLmluZm8oJ3ZhbGlkYXRpbmcgdXNlcm5hbWUnKVxuXG5cdFx0Y29uc3Qgc3BhbiA9IF90cmFjZXIuc3RhcnRTcGFuKCdjbGllbnQ6c2VydmljZS1wcm9maWxlOnZhbGlkYXRlLXVzZXJuYW1lJywge1xuXHRcdFx0cGFyZW50OiBfdHJhY2VyLmdldEN1cnJlbnRTcGFuKClcblx0XHR9KVxuXHRcdGNvbnN0IHJlczogRGVmYXVsdFJlc3BvbnNlU2NoZW1hID0ge31cblxuXHRcdF90cmFjZXIud2l0aFNwYW4oc3BhbiwgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgdXNlcm5hbWUgPSBpbnB1dC51c2VybmFtZVxuXHRcdFx0Y29uc3QgdmFsaWRhdGVVc2VybmFtZVJlcSA9IG5ldyBWYWxpZGF0ZVVzZXJuYW1lUmVxdWVzdCgpXG5cdFx0XHRpZiAodXNlcm5hbWUpIHtcblx0XHRcdFx0dmFsaWRhdGVVc2VybmFtZVJlcS5zZXRVc2VybmFtZSh1c2VybmFtZSlcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgdmFsaWRhdGVSZXMgPSAoYXdhaXQgdmFsaWRhdGVVc2VybmFtZSh2YWxpZGF0ZVVzZXJuYW1lUmVxKSkgYXMgRGVmYXVsdFJlc3BvbnNlXG5cdFx0XHRcdHJlcy5zdGF0dXMgPSB2YWxpZGF0ZVJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0XHRyZXMuZXJyb3IgPSB2YWxpZGF0ZVJlcy5nZXRFcnJvcigpXG5cdFx0XHRcdHNwYW4uZW5kKClcblx0XHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRcdHJlcy5zdGF0dXMgPSBmYWxzZVxuXHRcdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdFx0XHRzcGFuLmVuZCgpXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0VmFsaWRhdGVFbWFpbDogYXN5bmMgKF8sIHsgaW5wdXQgfSkgPT4ge1xuXHRcdGNvbnN0IHZhbGlkYXRlRW1haWxSZXEgPSBuZXcgVmFsaWRhdGVFbWFpbFJlcXVlc3QoKVxuXG5cdFx0Y29uc3QgZW1haWwgPSBpbnB1dC5lbWFpbFxuXHRcdGlmIChlbWFpbCkge1xuXHRcdFx0dmFsaWRhdGVFbWFpbFJlcS5zZXRFbWFpbChlbWFpbClcblx0XHR9XG5cblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHZhbGlkYXRlUmVzID0gKGF3YWl0IHZhbGlkYXRlRW1haWwodmFsaWRhdGVFbWFpbFJlcSkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IHZhbGlkYXRlUmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gdmFsaWRhdGVSZXMuZ2V0RXJyb3IoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0VmVyaWZ5VG9rZW46IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRsZXQgcmVzOiBBY2Nlc3NEZXRhaWxzUmVzcG9uc2VTY2hlbWEgPSB7fVxuXG5cdFx0Y29uc3QgdG9rZW4gPSAoaW5wdXQgJiYgaW5wdXQudG9rZW4pIHx8IGFjY2Vzc1Rva2VuXG5cdFx0aWYgKHRva2VuKSB7XG5cdFx0XHRyZXMgPSBhd2FpdCBleHRyYWN0VG9rZW5NZXRhZGF0YSh0b2tlbilcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFJlZnJlc2hUb2tlbjogYXN5bmMgKF8sIHsgaW5wdXQgfSwgeyB0b2tlbjogYWNjZXNzVG9rZW4gfSkgPT4ge1xuXHRcdGNvbnN0IHJlczogQXV0aFJlc3BvbnNlU2NoZW1hID0ge31cblxuXHRcdGNvbnN0IHRva2VuUmVxdWVzdCA9IG5ldyBUb2tlblJlcXVlc3QoKVxuXHRcdGNvbnN0IHRva2VuID0gKGlucHV0ICYmIGlucHV0LnRva2VuKSB8fCBhY2Nlc3NUb2tlblxuXHRcdGlmICh0b2tlbikge1xuXHRcdFx0dG9rZW5SZXF1ZXN0LnNldFRva2VuKHRva2VuKVxuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB0b2tlblJlc3BvbnNlID0gKGF3YWl0IHJlZnJlc2hUb2tlbih0b2tlblJlcXVlc3QpKSBhcyBBdXRoUmVzcG9uc2Vcblx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSB0b2tlblJlc3BvbnNlLmdldEFjY2Vzc1Rva2VuKClcblx0XHRcdHJlcy5yZWZyZXNoX3Rva2VuID0gdG9rZW5SZXNwb25zZS5nZXRSZWZyZXNoVG9rZW4oKVxuXHRcdFx0cmVzLnZhbGlkID0gdG9rZW5SZXNwb25zZS5nZXRWYWxpZCgpXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSAnJ1xuXHRcdFx0cmVzLnJlZnJlc2hfdG9rZW4gPSAnJ1xuXHRcdFx0cmVzLnZhbGlkID0gZmFsc2Vcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFJlYWRQcm9maWxlOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IGFjY2Vzc0RldGFpbHMgfSkgPT4ge1xuXHRcdGlmICghYWNjZXNzRGV0YWlscykge1xuXHRcdFx0dGhyb3cgbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoJ3lvdSBtdXN0IGJlIGxvZ2dlZCBpbicpXG5cdFx0fVxuXG5cdFx0aWYgKGlucHV0LmlkICE9PSBhY2Nlc3NEZXRhaWxzLnVzZXJJZCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwieW91IGNhbid0IGFjY2VzcyBvdGhlciBwcm9maWxlXCIpXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzOiBQcm9maWxlU2NoZW1hID0ge31cblx0XHRjb25zdCByZWFkUHJvZmlsZVJlcXVlc3QgPSBuZXcgUmVhZFByb2ZpbGVSZXF1ZXN0KClcblx0XHRyZWFkUHJvZmlsZVJlcXVlc3Quc2V0QWNjb3VudElkKGlucHV0LmlkKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHByb2ZpbGVSZXMgPSAoYXdhaXQgcmVhZFByb2ZpbGUocmVhZFByb2ZpbGVSZXF1ZXN0KSkgYXMgUHJvZmlsZVxuXHRcdFx0Y29uc3QgcHJvZmlsZVNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlTY2hlbWEgPSB7fVxuXG5cdFx0XHRjb25zdCBlbWFpbCA9IHtcblx0XHRcdFx0ZW1haWw6IHByb2ZpbGVSZXMuZ2V0RW1haWwoKT8uZ2V0RW1haWwoKSxcblx0XHRcdFx0Ly8gc3RhdHVzOiBwcm9maWxlUmVzLmdldEVtYWlsKCk/LmdldFN0YXR1cygpLFxuXHRcdFx0XHRzaG93OiBwcm9maWxlUmVzLmdldEVtYWlsKCk/LmdldFNob3coKVxuXHRcdFx0fVxuXG5cdFx0XHRwcm9maWxlU2VjdXJpdHkudmVyaWZpZWQgPSBwcm9maWxlUmVzLmdldFNlY3VyaXR5KCk/LmdldFZlcmlmaWVkKClcblxuXHRcdFx0cmVzLnVzZXJuYW1lID0gcHJvZmlsZVJlcy5nZXRVc2VybmFtZSgpXG5cdFx0XHRyZXMuZ2l2ZW5OYW1lID0gcHJvZmlsZVJlcy5nZXRHaXZlbk5hbWUoKVxuXHRcdFx0cmVzLmZhbWlseU5hbWUgPSBwcm9maWxlUmVzLmdldEZhbWlseU5hbWUoKVxuXHRcdFx0cmVzLm1pZGRsZU5hbWUgPSBwcm9maWxlUmVzLmdldE1pZGRsZU5hbWUoKVxuXHRcdFx0cmVzLmVtYWlsID0gZW1haWxcblx0XHRcdHJlcy5zZWN1cml0eSA9IHByb2ZpbGVTZWN1cml0eVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBNdXRhdGlvbjogTXV0YXRpb25SZXNvbHZlcnMgPSB7XG5cdEF1dGg6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdHJhY2VyLCBsb2dnZXIgfSkgPT4ge1xuXHRcdGxvZ2dlci5pbmZvKCdtdXRhdGlvbiA6IEFVVEgnKVxuXHRcdGNvbnN0IF90cmFjZXIgPSB0cmFjZXIoJ3NlcnZpY2UtcHJvZmlsZScpXG5cblx0XHRjb25zdCBzcGFuID0gX3RyYWNlci5zdGFydFNwYW4oJ2NsaWVudDpzZXJ2aWNlLXByb2ZpbGU6YXV0aCcsIHtcblx0XHRcdHBhcmVudDogX3RyYWNlci5nZXRDdXJyZW50U3BhbigpXG5cdFx0fSlcblx0XHRjb25zdCByZXM6IEF1dGhSZXNwb25zZVNjaGVtYSA9IHt9XG5cblx0XHRfdHJhY2VyLndpdGhTcGFuKHNwYW4sIGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnN0IGF1dGhSZXF1ZXN0ID0gbmV3IEF1dGhSZXF1ZXN0KClcblx0XHRcdGlmIChpbnB1dD8udXNlcm5hbWUpIHtcblx0XHRcdFx0YXV0aFJlcXVlc3Quc2V0VXNlcm5hbWUoaW5wdXQudXNlcm5hbWUpXG5cdFx0XHR9XG5cdFx0XHRpZiAoaW5wdXQ/LnBhc3N3b3JkKSB7XG5cdFx0XHRcdGF1dGhSZXF1ZXN0LnNldFBhc3N3b3JkKGlucHV0LnBhc3N3b3JkKVxuXHRcdFx0fVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCB0b2tlblJlc3BvbnNlID0gKGF3YWl0IGF1dGgoYXV0aFJlcXVlc3QpKSBhcyBBdXRoUmVzcG9uc2Vcblx0XHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0QWNjZXNzVG9rZW4oKVxuXHRcdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0UmVmcmVzaFRva2VuKClcblx0XHRcdFx0cmVzLnZhbGlkID0gdG9rZW5SZXNwb25zZS5nZXRWYWxpZCgpXG5cdFx0XHRcdHNwYW4uZW5kKClcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSAnJ1xuXHRcdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9ICcnXG5cdFx0XHRcdHJlcy52YWxpZCA9IGZhbHNlXG5cdFx0XHRcdHNwYW4uZW5kKClcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRDcmVhdGVQcm9maWxlOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgbWlkZGxlTmFtZSA9IGlucHV0Lm1pZGRsZU5hbWUgPyBgICR7aW5wdXQubWlkZGxlTmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgZmFtaWx5TmFtZSA9IGlucHV0LmZhbWlseU5hbWUgPyBgICR7aW5wdXQuZmFtaWx5TmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgbmFtZSA9IGAke2lucHV0LmdpdmVuTmFtZX0ke21pZGRsZU5hbWV9JHtmYW1pbHlOYW1lfWBcblx0XHRjb25zdCBpZGVudGlmaWVyID0gbmV3IElkZW50aWZpZXIoKVxuXHRcdGlkZW50aWZpZXIuc2V0TmFtZShuYW1lLnRyaW0oKSlcblx0XHRjb25zdCBwcm9maWxlU2VjdXJpdHkgPSBuZXcgUHJvZmlsZVNlY3VyaXR5KClcblx0XHRpZiAoaW5wdXQuc2VjdXJpdHk/LnBhc3N3b3JkKSB7XG5cdFx0XHRwcm9maWxlU2VjdXJpdHkuc2V0UGFzc3dvcmQoaW5wdXQuc2VjdXJpdHkucGFzc3dvcmQpXG5cdFx0fVxuXHRcdGNvbnN0IGVtYWlsID0gbmV3IEVtYWlsKClcblx0XHRpZiAoaW5wdXQuZW1haWw/LmVtYWlsKSB7XG5cdFx0XHRlbWFpbC5zZXRFbWFpbChpbnB1dC5lbWFpbC5lbWFpbClcblx0XHR9XG5cdFx0aWYgKGlucHV0LmVtYWlsPy5zaG93KSB7XG5cdFx0XHRlbWFpbC5zZXRTaG93KGlucHV0LmVtYWlsLnNob3cpXG5cdFx0fVxuXHRcdGNvbnN0IHByb2ZpbGUgPSBuZXcgUHJvZmlsZSgpXG5cdFx0aWYgKGlucHV0Py5nZW5kZXIpIHtcblx0XHRcdHByb2ZpbGUuc2V0R2VuZGVyKGlucHV0LmdlbmRlcilcblx0XHR9XG5cdFx0aWYgKGlucHV0Py51c2VybmFtZSkge1xuXHRcdFx0cHJvZmlsZS5zZXRVc2VybmFtZShpbnB1dC51c2VybmFtZSlcblx0XHR9XG5cdFx0cHJvZmlsZS5zZXRFbWFpbChlbWFpbClcblx0XHRwcm9maWxlLnNldElkZW50aXR5KGlkZW50aWZpZXIpXG5cdFx0cHJvZmlsZS5zZXRTZWN1cml0eShwcm9maWxlU2VjdXJpdHkpXG5cdFx0Y29uc3QgcmVzID0gKGF3YWl0IGNyZWF0ZVByb2ZpbGUocHJvZmlsZSkpIGFzIElkXG5cblx0XHRjb25zdCBwcm9maWxlUmVzcG9uc2U6IElkU2NoZW1hID0ge1xuXHRcdFx0aWQ6IHJlcy5nZXRJZCgpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb2ZpbGVSZXNwb25zZVxuXHR9LFxuXHRMb2dvdXQ6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0Y29uc3QgdG9rZW5SZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCgpXG5cblx0XHRjb25zdCB0b2tlbiA9IChpbnB1dCAmJiBpbnB1dC50b2tlbikgfHwgYWNjZXNzVG9rZW5cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgbG9nb3V0UmVzID0gKGF3YWl0IGxvZ291dCh0b2tlblJlcXVlc3QpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSBsb2dvdXRSZXMuZ2V0U3RhdHVzKClcblx0XHRcdHJlcy5jb2RlID0gbG9nb3V0UmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gbG9nb3V0UmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHByb2ZpbGVSZXNvbHZlcnMgPSB7XG5cdE11dGF0aW9uLFxuXHRRdWVyeVxufVxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZVJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gQWNjb3VudFR5cGUge1xcbiAgQkFTRVxcbiAgQ09NUEFOWVxcbiAgRlVORElOR1xcbiAgSk9CXFxufVxcblxcbmVudW0gR2VuZGVyIHtcXG4gIE1BTEVcXG4gIEZFTUFMRVxcbiAgT1RIRVJcXG59XFxuXFxuZW51bSBQcm9maWxlT3BlcmF0aW9ucyB7XFxuICBDUkVBVEVcXG4gIFJFQURcXG4gIFVQREFURVxcbiAgREVMRVRFXFxuICBCVUxLX1VQREFURVxcbn1cXG5cXG5lbnVtIE9wZXJhdGlvbkVudGl0eSB7XFxuICBDT01QQU5ZXFxuICBKT0JcXG4gIElOVkVTVE9SXFxufVxcblxcbnR5cGUgRWR1Y2F0aW9uIHtcXG4gIGVkdWNhdGlvbjogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbnR5cGUgUHJvZmlsZVNlY3VyaXR5IHtcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlIHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVyXFxuICBnaXZlbk5hbWU6IFN0cmluZ1xcbiAgbWlkZGxlTmFtZTogU3RyaW5nXFxuICBmYW1pbHlOYW1lOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIGVtYWlsOiBFbWFpbFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wXFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25cXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlcXG4gIG1ldGFkYXRhOiBNZXRhZGF0YVxcbn1cXG5cXG50eXBlIEF1dGhSZXNwb25zZSB7XFxuICBhY2Nlc3NfdG9rZW46IFN0cmluZ1xcbiAgcmVmcmVzaF90b2tlbjogU3RyaW5nXFxuICB2YWxpZDogQm9vbGVhblxcbn1cXG5cXG50eXBlIEFjY2Vzc0RldGFpbHNSZXNwb25zZSB7XFxuICBhdXRob3JpemVkOiBCb29sZWFuXFxuICBhY2Nlc3NVdWlkOiBTdHJpbmdcXG4gIHVzZXJJZDogU3RyaW5nXFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBlbWFpbDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBTdHJpbmdcXG4gIHZlcmlmaWVkOiBCb29sZWFuXFxuICBleHA6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBFZHVjYXRpb25JbnB1dCB7XFxuICBlZHVjYXRpb246IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBQcm9maWxlU2VjdXJpdHlJbnB1dCB7XFxuICBwYXNzd29yZDogU3RyaW5nXFxuICBhY2NvdW50VHlwZTogQWNjb3VudFR5cGVcXG59XFxuXFxuaW5wdXQgUHJvZmlsZUlucHV0IHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVySW5wdXRcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsSW5wdXRcXG4gIGdlbmRlcjogR2VuZGVyXFxuICBiaXJ0aGRhdGU6IFRpbWVzdGFtcElucHV0XFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25JbnB1dFxcbiAgYWRkcmVzczogQWRkcmVzc0lucHV0XFxuICBzZWN1cml0eTogUHJvZmlsZVNlY3VyaXR5SW5wdXRcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVVc2VybmFtZUlucHV0IHtcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVFbWFpbElucHV0IHtcXG4gIGVtYWlsOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgQXV0aFJlcXVlc3RJbnB1dCB7XFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBwYXNzd29yZDogU3RyaW5nXFxufVxcblxcbmlucHV0IFRva2VuUmVxdWVzdCB7XFxuICB0b2tlbjogU3RyaW5nXFxuICBhY2Nlc3NVdWlkOiBTdHJpbmdcXG4gIHVzZXJJZDogU3RyaW5nXFxufVxcblxcbmV4dGVuZCB0eXBlIFF1ZXJ5IHtcXG4gIFZhbGlkYXRlVXNlcm5hbWUoaW5wdXQ6IFZhbGlkYXRlVXNlcm5hbWVJbnB1dCEpOiBEZWZhdWx0UmVzcG9uc2UhXFxuICBWYWxpZGF0ZUVtYWlsKGlucHV0OiBWYWxpZGF0ZUVtYWlsSW5wdXQhKTogRGVmYXVsdFJlc3BvbnNlIVxcbiAgVmVyaWZ5VG9rZW4oaW5wdXQ6IFRva2VuUmVxdWVzdCk6IEFjY2Vzc0RldGFpbHNSZXNwb25zZSFcXG4gIFJlZnJlc2hUb2tlbihpbnB1dDogVG9rZW5SZXF1ZXN0KTogQXV0aFJlc3BvbnNlIVxcbiAgUmVhZFByb2ZpbGUoaW5wdXQ6IElkSW5wdXQhKTogUHJvZmlsZSFcXG59XFxuXFxuZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xcbiAgQ3JlYXRlUHJvZmlsZShpbnB1dDogUHJvZmlsZUlucHV0ISk6IElkIVxcbiAgQXV0aChpbnB1dDogQXV0aFJlcXVlc3RJbnB1dCk6IEF1dGhSZXNwb25zZSFcXG4gIExvZ291dChpbnB1dDogVG9rZW5SZXF1ZXN0KTogRGVmYXVsdFJlc3BvbnNlIVxcbn1cXG5cIiIsImltcG9ydCBwcm9maWxlQ2xpZW50IGZyb20gJ2NsaWVudC9wcm9maWxlJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jcmVhdGVQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgY29uZmlybVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jb25maXJtUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlYWRQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQucmVhZFByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB1cGRhdGVQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudXBkYXRlUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcm5hbWUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52YWxpZGF0ZVVzZXJuYW1lKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmFsaWRhdGVFbWFpbCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZhbGlkYXRlRW1haWwpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBhdXRoID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuYXV0aCkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZlcmlmeVRva2VuID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmVyaWZ5VG9rZW4pLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBsb2dvdXQgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5sb2dvdXQpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCByZWZyZXNoVG9rZW4gPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5yZWZyZXNoVG9rZW4pLmJpbmQocHJvZmlsZUNsaWVudClcbiIsImltcG9ydCB7IE11dGF0aW9uUmVzb2x2ZXJzLCBRdWVyeVJlc29sdmVycywgUmVzb2x2ZXJzLCBTdWJzY3JpcHRpb25SZXNvbHZlcnMgfSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcblxuY29uc3QgUXVlcnk6IFF1ZXJ5UmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ2RvZG8gZHVjayBsaXZlcyBoZXJlJ1xufVxuY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ0RvZG8gRHVjaydcbn1cbmNvbnN0IFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKF8sIF9fLCB7IHB1YnN1YiB9KSA9PiBwdWJzdWIuYXN5bmNJdGVyYXRvcignRE9ET19EVUNLJylcbn1cblxuY29uc3Qgcm9vdFJlc29sdmVyczogUmVzb2x2ZXJzID0ge1xuXHRRdWVyeSxcblx0TXV0YXRpb24sXG5cdFN1YnNjcmlwdGlvbixcblx0UmVzdWx0OiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXG5cdFx0XHRyZXR1cm4gJ0pvYidcblx0XHR9XG5cdH0sXG5cdElOb2RlOiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXHRcdFx0Ly8gaWYgKG5vZGUuc3RhcnMpIHJldHVybiAnUmV2aWV3J1xuXG5cdFx0XHRyZXR1cm4gJ0NvbXBhbnknXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIEFwcGxpY2FudCB7XFxuICBhcHBsaWNhdGlvbnM6IFtTdHJpbmddIVxcbiAgc2hvcnRsaXN0ZWQ6IFtTdHJpbmddIVxcbiAgb25ob2xkOiBbU3RyaW5nXSFcXG4gIHJlamVjdGVkOiBbU3RyaW5nXSFcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBTb3J0IHtcXG4gIEFTQ1xcbiAgREVTQ1xcbn1cXG5cXG50eXBlIFBhZ2luYXRpb24ge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUGFnaW5hdGlvbklucHV0IHtcXG4gIHBhZ2U6IEludFxcbiAgZmlyc3Q6IEludFxcbiAgYWZ0ZXI6IFN0cmluZ1xcbiAgb2Zmc2V0OiBJbnRcXG4gIGxpbWl0OiBJbnRcXG4gIHNvcnQ6IFNvcnRcXG4gIHByZXZpb3VzOiBTdHJpbmdcXG4gIG5leHQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIE1ldGFkYXRhIHtcXG4gIGNyZWF0ZWRfYXQ6IFRpbWVzdGFtcFxcbiAgdXBkYXRlZF9hdDogVGltZXN0YW1wXFxuICBwdWJsaXNoZWRfZGF0ZTogVGltZXN0YW1wXFxuICBlbmRfZGF0ZTogVGltZXN0YW1wXFxuICBsYXN0X2FjdGl2ZTogVGltZXN0YW1wXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gUHJvZmlsZU9wZXJhdGlvbk9wdGlvbnMge1xcbiAgQ1JFQVRFXFxuICBSRUFEXFxuICBVUERBVEVcXG4gIERFTEVURVxcbiAgQlVMS19VUERBVEVcXG59XFxuXFxudHlwZSBNYXBQcm9maWxlUGVybWlzc2lvbiB7XFxuICBrZXk6IFN0cmluZ1xcbiAgcHJvZmlsZU9wZXJhdGlvbnM6IFtQcm9maWxlT3BlcmF0aW9uT3B0aW9uc11cXG59XFxuXFxudHlwZSBQZXJtaXNzaW9uc0Jhc2Uge1xcbiAgcGVybWlzc2lvbnM6IE1hcFByb2ZpbGVQZXJtaXNzaW9uXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgUmF0aW5nIHtcXG4gIGF1dGhvcjogU3RyaW5nXFxuICBiZXN0UmF0aW5nOiBJbnRcXG4gIGV4cGxhbmF0aW9uOiBTdHJpbmdcXG4gIHZhbHVlOiBJbnRcXG4gIHdvcnN0UmF0aW5nOiBJbnRcXG59XFxuXFxudHlwZSBBZ2dyZWdhdGVSYXRpbmcge1xcbiAgaXRlbVJldmlld2VkOiBTdHJpbmchXFxuICByYXRpbmdDb3VudDogSW50IVxcbiAgcmV2aWV3Q291bnQ6IEludFxcbn1cXG5cXG50eXBlIFJldmlldyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZ1xcbiAgYXNwZWN0OiBTdHJpbmdcXG4gIGJvZHk6IFN0cmluZ1xcbiAgcmF0aW5nOiBTdHJpbmdcXG59XFxuXFxudHlwZSBHZW9Mb2NhdGlvbiB7XFxuICBlbGV2YXRpb246IEludFxcbiAgbGF0aXR1ZGU6IEludFxcbiAgbG9uZ2l0dWRlOiBJbnRcXG4gIHBvc3RhbENvZGU6IEludFxcbn1cXG5cXG50eXBlIEFkZHJlc3Mge1xcbiAgY291bnRyeTogU3RyaW5nIVxcbiAgbG9jYWxpdHk6IFN0cmluZ1xcbiAgcmVnaW9uOiBTdHJpbmdcXG4gIHBvc3RhbENvZGU6IEludFxcbiAgc3RyZWV0OiBTdHJpbmdcXG59XFxuXFxudHlwZSBQbGFjZSB7XFxuICBhZGRyZXNzOiBBZGRyZXNzXFxuICByZXZpZXc6IFJldmlld1xcbiAgYWdncmVnYXRlUmF0aW5nOiBBZ2dyZWdhdGVSYXRpbmdcXG4gIGJyYW5jaENvZGU6IFN0cmluZ1xcbiAgZ2VvOiBHZW9Mb2NhdGlvblxcbn1cXG5cXG5pbnB1dCBBZGRyZXNzSW5wdXQge1xcbiAgY291bnRyeTogU3RyaW5nXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIFJhbmdlIHtcXG4gIG1pbjogSW50IVxcbiAgbWF4OiBJbnQhXFxufVxcblxcbnR5cGUgRGVmYXVsdFJlc3BvbnNlIHtcXG4gIHN0YXR1czogQm9vbGVhblxcbiAgZXJyb3I6IFN0cmluZ1xcbiAgY29kZTogSW50XFxufVxcblxcbnR5cGUgSWQge1xcbiAgaWQ6IElEIVxcbn1cXG5cXG5lbnVtIEVtYWlsU3RhdHVzIHtcXG4gIFdBSVRJTkdcXG4gIENPTkZJUk1FRFxcbiAgQkxPQ0tFRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG50eXBlIEVtYWlsIHtcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIHN0YXR1czogRW1haWxTdGF0dXNcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBBdHRhY2htZW50IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxuICB1cGxvYWREYXRlOiBUaW1lc3RhbXBcXG4gIHVybDogU3RyaW5nXFxuICB1c2VyOiBTdHJpbmdcXG4gIGZvbGRlcjogU3RyaW5nXFxufVxcblxcbnR5cGUgSWRlbnRpZmllciB7XFxuICBpZGVudGlmaWVyOiBTdHJpbmchXFxuICBuYW1lOiBTdHJpbmdcXG4gIGFsdGVybmF0ZU5hbWU6IFN0cmluZ1xcbiAgdHlwZTogU3RyaW5nXFxuICBhZGRpdGlvbmFsVHlwZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBkaXNhbWJpZ3VhdGluZ0Rlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGhlYWRsaW5lOiBTdHJpbmdcXG4gIHNsb2dhbjogU3RyaW5nXFxufVxcblxcbmlucHV0IFJhbmdlSW5wdXQge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxuaW5wdXQgSWRJbnB1dCB7XFxuICBpZDogSUQhXFxufVxcblxcbmlucHV0IEVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBBdHRhY2htZW50SW5wdXQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG4gIHVzZXI6IFN0cmluZ1xcbiAgZm9sZGVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgSWRlbnRpZmllcklucHV0IHtcXG4gIG5hbWU6IFN0cmluZ1xcbiAgYWx0ZXJuYXRlTmFtZTogU3RyaW5nXFxuICB0eXBlOiBTdHJpbmdcXG4gIGFkZGl0aW9uYWxUeXBlOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGRpc2FtYmlndWF0aW5nRGVzY3JpcHRpb246IFN0cmluZ1xcbiAgaGVhZGxpbmU6IFN0cmluZ1xcbiAgc2xvZ2FuOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBEYXlzT2ZXZWVrIHtcXG4gIE1PTkRBWVxcbiAgVFVFU0RBWVxcbiAgV0VETkVTREFZXFxuICBUSFJVU0RBWVxcbiAgRlJJREFZXFxuICBTVEFVUkRBWVxcbiAgU1VOREFZXFxufVxcblxcbnR5cGUgVGltZXN0YW1wIHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFRpbWUge1xcbiAgb3BlbnM6IFRpbWVzdGFtcFxcbiAgY2xvc2VzOiBUaW1lc3RhbXBcXG4gIGRheXNPZldlZWs6IERheXNPZldlZWtcXG4gIHZhbGlkRnJvbTogVGltZXN0YW1wXFxuICB2YWxpZFRocm91Z2g6IFRpbWVzdGFtcFxcbn1cXG5cXG5pbnB1dCBUaW1lc3RhbXBJbnB1dCB7XFxuICBzZWNvbmRzOiBTdHJpbmdcXG4gIG5hbm9zOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwic2NhbGFyIERhdGVcXG5cXG50eXBlIEVkZ2Uge1xcbiAgY3Vyc29yOiBTdHJpbmchXFxuICBub2RlOiBbUmVzdWx0IV0hXFxufVxcblxcbnR5cGUgUGFnZUluZm8ge1xcbiAgZW5kQ3Vyc29yOiBTdHJpbmchXFxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcXG59XFxuXFxuaW50ZXJmYWNlIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnVuaW9uIFJlc3VsdCA9IEpvYiB8IENvbXBhbnlcXG5cXG50eXBlIFF1ZXJ5IHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgTXV0YXRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBTdWJzY3JpcHRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxuc2NoZW1hIHtcXG4gIHF1ZXJ5OiBRdWVyeVxcbiAgbXV0YXRpb246IE11dGF0aW9uXFxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGFwcGxpY2FudHNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGNvbXBhbnlTY2hlbWEgZnJvbSAnY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY3Vyc29yU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9jdXJzb3IuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGRlcHRoTGltaXQgZnJvbSAnZ3JhcGhxbC1kZXB0aC1saW1pdCdcbmltcG9ydCAqIGFzIGpvYlNjaGVtYSBmcm9tICdjbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIG1ldGFkYXRhU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9tZXRhZGF0YS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcGVybWlzc2lvbnNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwbGFjZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvcGxhY2UuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHByb2ZpbGVTY2hlbWEgZnJvbSAnY2xpZW50L3Byb2ZpbGUvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcm9vdFNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBzeXN0ZW1TY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3N5c3RlbS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgdGltZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvdGltZS5ncmFwaHFsJ1xuXG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIFB1YlN1YiB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcbmltcG9ydCBwcm9maWxlUmVzb2x2ZXJzLCB7IGV4dHJhY3RUb2tlbk1ldGFkYXRhIH0gZnJvbSAnY2xpZW50L3Byb2ZpbGUvcmVzb2x2ZXInXG5cbmltcG9ydCB7IEFjY2Vzc0RldGFpbHNSZXNwb25zZSB9IGZyb20gJ2dlbmVyYXRlZC9ncmFwaHFsJ1xuaW1wb3J0IHsgUmVkaXNDYWNoZSB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItY2FjaGUtcmVkaXMnXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ3NlcnZpY2UvY29uZmlnL3JlZGlzJ1xuaW1wb3J0IGNyZWF0ZUdyYXBoUUxFcnJvckZvcm1hdHRlciBmcm9tICdzZXJ2aWNlL2Vycm9yL2dyYXBocWwuZXJyb3InXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHJvb3RSZXNvbHZlcnMgZnJvbSAnY2xpZW50L3Jvb3QvcmVzb2x2ZXInXG5pbXBvcnQgdHJhY2VyIGZyb20gJ3RyYWNlcidcbmltcG9ydCB3aW5zdG9uIGZyb20gJ3dpbnN0b24nXG5cbmV4cG9ydCBjb25zdCBwdWJzdWIgPSBuZXcgUHViU3ViKClcbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IFtcblx0cm9vdFNjaGVtYSxcblx0YXBwbGljYW50c1NjaGVtYSxcblx0Y3Vyc29yU2NoZW1hLFxuXHRtZXRhZGF0YVNjaGVtYSxcblx0cGxhY2VTY2hlbWEsXG5cdHN5c3RlbVNjaGVtYSxcblx0cGVybWlzc2lvbnNTY2hlbWEsXG5cdHRpbWVTY2hlbWEsXG5cdHByb2ZpbGVTY2hlbWEsXG5cdGNvbXBhbnlTY2hlbWEsXG5cdGpvYlNjaGVtYVxuXVxuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IG1lcmdlKHt9LCByb290UmVzb2x2ZXJzLCBwcm9maWxlUmVzb2x2ZXJzKVxuZXhwb3J0IGludGVyZmFjZSBPb0pvYkNvbnRleHQge1xuXHRyZXE6IFJlcXVlc3Rcblx0cHVic3ViOiBQdWJTdWJcblx0dHJhY2VyOiB0eXBlb2YgdHJhY2VyXG5cdHRva2VuOiBzdHJpbmdcblx0YWNjZXNzRGV0YWlsczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlXG5cdGxvZ2dlcjogd2luc3Rvbi5Mb2dnZXJcbn1cbmNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuXHR0eXBlRGVmcyxcblx0cmVzb2x2ZXJzLFxuXHRmb3JtYXRFcnJvcjogY3JlYXRlR3JhcGhRTEVycm9yRm9ybWF0dGVyKCksXG5cdGNvbnRleHQ6IGFzeW5jICh7IHJlcSwgY29ubmVjdGlvbiB9KSA9PiB7XG5cdFx0Y29uc3QgdG9rZW5EYXRhID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvblxuXHRcdGxldCB0b2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cdFx0bGV0IGFjY2Vzc0RldGFpbHM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG5cdFx0aWYgKHRva2VuRGF0YSkge1xuXHRcdFx0dG9rZW4gPSB0b2tlbkRhdGEuc3BsaXQoJyAnKVsxXVxuXHRcdH1cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdGFjY2Vzc0RldGFpbHMgPSBhd2FpdCBleHRyYWN0VG9rZW5NZXRhZGF0YSh0b2tlbilcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVxLFxuXHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdHB1YnN1Yixcblx0XHRcdHRyYWNlcixcblx0XHRcdGFjY2Vzc0RldGFpbHMsXG5cdFx0XHR0b2tlbixcblx0XHRcdGxvZ2dlclxuXHRcdH1cblx0fSxcblx0dHJhY2luZzogdHJ1ZSxcblx0aW50cm9zcGVjdGlvbjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyxcblx0ZW5naW5lOiBmYWxzZSxcblx0dmFsaWRhdGlvblJ1bGVzOiBbZGVwdGhMaW1pdCgxMCldLFxuXHRjYWNoZUNvbnRyb2w6IHtcblx0XHRjYWxjdWxhdGVIdHRwSGVhZGVyczogZmFsc2UsXG5cdFx0Ly8gQ2FjaGUgZXZlcnl0aGluZyBmb3IgYXQgbGVhc3QgYSBtaW51dGUgc2luY2Ugd2Ugb25seSBjYWNoZSBwdWJsaWMgcmVzcG9uc2VzXG5cdFx0ZGVmYXVsdE1heEFnZTogNjBcblx0fSxcblx0Y2FjaGU6IG5ldyBSZWRpc0NhY2hlKHtcblx0XHQuLi5jb25maWcsXG5cdFx0a2V5UHJlZml4OiAnYXBvbGxvLWNhY2hlOidcblx0fSlcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZlclxuIiwiaW1wb3J0ICdkb3RlbnYvY29uZmlnJ1xuXG5pbXBvcnQgeyBhcHAsIHNlcnZlciwgc3RhcnRTeW5jU2VydmVyLCBzdG9wU2VydmVyIH0gZnJvbSAnb29qb2Iuc2VydmVyJ1xuaW1wb3J0IHsgZm9yaywgaXNNYXN0ZXIsIG9uIH0gZnJvbSAnY2x1c3RlcidcblxuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5cbmRlY2xhcmUgY29uc3QgbW9kdWxlOiBhbnlcblxuY29uc3Qgc3RhcnQgPSBhc3luYyAoKSA9PiB7XG5cdGNvbnN0IHsgUE9SVCB9ID0gcHJvY2Vzcy5lbnZcblx0Y29uc3QgcG9ydCA9IFBPUlQgfHwgJzgwODAnXG5cblx0dHJ5IHtcblx0XHRhd2FpdCBzdG9wU2VydmVyKClcblx0XHRhd2FpdCBzdGFydFN5bmNTZXJ2ZXIocG9ydClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdTZXJ2ZXIgRmFpbGVkIHRvIHN0YXJ0Jylcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdHByb2Nlc3MuZXhpdCgxKVxuXHR9XG59XG5cbmlmIChpc01hc3Rlcikge1xuXHRjb25zdCBudW1DUFVzID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoXG5cblx0bG9nZ2VyLmluZm8oYE1hc3RlciAke3Byb2Nlc3MucGlkfSBpcyBydW5uaW5nYClcblxuXHQvLyBGb3JrIHdvcmtlcnMuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ1BVczsgaSsrKSB7XG5cdFx0Zm9yaygpXG5cdH1cblxuXHRvbignZm9yaycsICh3b3JrZXIpID0+IHtcblx0XHRsb2dnZXIuaW5mbygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxuXG5cdG9uKCdleGl0JywgKHdvcmtlcikgPT4ge1xuXHRcdGxvZ2dlci5pbmZvKCd3b3JrZXIgaXMgZGVhZDonLCB3b3JrZXIuaXNEZWFkKCkpXG5cdH0pXG59IGVsc2Uge1xuXHQvKipcblx0ICogW2lmIEhvdCBNb2R1bGUgZm9yIHdlYnBhY2tdXG5cdCAqIEBwYXJhbSAge1t0eXBlXX0gbW9kdWxlIFtnbG9iYWwgbW9kdWxlIG5vZGUgb2JqZWN0XVxuXHQgKi9cblx0bGV0IGN1cnJlbnRBcHAgPSBhcHBcblx0aWYgKG1vZHVsZS5ob3QpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdCgnb29qb2Iuc2VydmVyJywgKCkgPT4ge1xuXHRcdFx0c2VydmVyLnJlbW92ZUxpc3RlbmVyKCdyZXF1ZXN0JywgY3VycmVudEFwcClcblx0XHRcdHNlcnZlci5vbigncmVxdWVzdCcsIGFwcClcblx0XHRcdGN1cnJlbnRBcHAgPSBhcHBcblx0XHR9KVxuXG5cdFx0LyoqXG5cdFx0ICogTmV4dCBjYWxsYmFjayBpcyBlc3NlbnRpYWw6XG5cdFx0ICogQWZ0ZXIgY29kZSBjaGFuZ2VzIHdlcmUgYWNjZXB0ZWQgd2UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHAuXG5cdFx0ICogc2VydmVyLmNsb3NlKCkgaXMgaGVyZSBFeHByZXNzLkpTLXNwZWNpZmljIGFuZCBjYW4gZGlmZmVyIGluIG90aGVyIGZyYW1ld29ya3MuXG5cdFx0ICogVGhlIGlkZWEgaXMgdGhhdCB5b3Ugc2hvdWxkIHNodXQgZG93biB5b3VyIGFwcCBoZXJlLlxuXHRcdCAqIERhdGEvc3RhdGUgc2F2aW5nIGJldHdlZW4gc2h1dGRvd24gYW5kIG5ldyBzdGFydCBpcyBwb3NzaWJsZVxuXHRcdCAqL1xuXHRcdG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBzZXJ2ZXIuY2xvc2UoKSlcblx0fVxuXG5cdC8vIFdvcmtlcnMgY2FuIHNoYXJlIGFueSBUQ1AgY29ubmVjdGlvblxuXHQvLyBJbiB0aGlzIGNhc2UgaXQgaXMgYW4gSFRUUCBzZXJ2ZXJcblx0c3RhcnQoKVxuXG5cdGxvZ2dlci5pbmZvKGBXb3JrZXIgJHtwcm9jZXNzLnBpZH0gc3RhcnRlZGApXG59XG4iLCJpbXBvcnQgeyBMb2dnZXIsIExvZ2dlck9wdGlvbnMsIGNyZWF0ZUxvZ2dlciwgZm9ybWF0LCB0cmFuc3BvcnRzIH0gZnJvbSAnd2luc3RvbidcbmltcG9ydCB7IGJhc2VuYW1lLCBqb2luIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMsIG1rZGlyU3luYyB9IGZyb20gJ2ZzJ1xuXG5jb25zdCB7IGNvbWJpbmUsIHRpbWVzdGFtcCwgcHJldHR5UHJpbnQgfSA9IGZvcm1hdFxuY29uc3QgbG9nRGlyZWN0b3J5ID0gam9pbihfX2Rpcm5hbWUsICdsb2cnKVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG50eXBlIElMb2dnZXJPcHRpb25zID0geyBmaWxlOiBMb2dnZXJPcHRpb25zOyBjb25zb2xlOiBMb2dnZXJPcHRpb25zIH1cblxuY29uc3QgeyBGSUxFX0xPR19MRVZFTCwgQ09OU09MRV9MT0dfTEVWRUwgfSA9IHByb2Nlc3MuZW52XG5leHBvcnQgY29uc3QgbG9nZ2VyT3B0aW9ucyA9IHtcblx0ZmlsZToge1xuXHRcdGxldmVsOiBGSUxFX0xPR19MRVZFTCB8fCAnaW5mbycsXG5cdFx0ZmlsZW5hbWU6IGAke2xvZ0RpcmVjdG9yeX0vbG9ncy9hcHAubG9nYCxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IHRydWUsXG5cdFx0bWF4c2l6ZTogNTI0Mjg4MCwgLy8gNU1CXG5cdFx0bWF4RmlsZXM6IDUsXG5cdFx0Y29sb3JpemU6IGZhbHNlXG5cdH0sXG5cdGNvbnNvbGU6IHtcblx0XHRsZXZlbDogQ09OU09MRV9MT0dfTEVWRUwgfHwgJ2RlYnVnJyxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IGZhbHNlLFxuXHRcdGNvbG9yaXplOiB0cnVlXG5cdH1cbn1cblxuY29uc3QgbG9nZ2VyVHJhbnNwb3J0cyA9IFtcblx0bmV3IHRyYW5zcG9ydHMuQ29uc29sZSh7XG5cdFx0Li4ubG9nZ2VyT3B0aW9ucy5jb25zb2xlLFxuXHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRmb3JtYXQudGltZXN0YW1wKCksXG5cdFx0XHRmb3JtYXQuY29sb3JpemUoeyBhbGw6IHRydWUgfSksXG5cdFx0XHRmb3JtYXQuYWxpZ24oKSxcblx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IHtcblx0XHRcdFx0Y29uc3QgeyBsZXZlbCwgbWVzc2FnZSwgbGFiZWwgfSA9IGluZm9cblx0XHRcdFx0Ly8gJHtPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPyBKU09OLnN0cmluZ2lmeShhcmdzLCBudWxsLCAyKSA6ICcnfVxuXG5cdFx0XHRcdHJldHVybiBgJHtsZXZlbH0gWyR7bGFiZWx9XTogJHttZXNzYWdlfWBcblx0XHRcdH0pXG5cdFx0KVxuXHR9KVxuXVxuXG5jbGFzcyBBcHBMb2dnZXIge1xuXHRwdWJsaWMgbG9nZ2VyOiBMb2dnZXJcblx0cHVibGljIGxvZ2dlck9wdGlvbnM6IElMb2dnZXJPcHRpb25zXG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogSUxvZ2dlck9wdGlvbnMpIHtcblx0XHRpZiAoIWlzRGV2ZWxvcG1lbnQpIHtcblx0XHRcdGV4aXN0c1N5bmMobG9nRGlyZWN0b3J5KSB8fCBta2RpclN5bmMobG9nRGlyZWN0b3J5KVxuXHRcdH1cblxuXHRcdHRoaXMubG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcblx0XHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRcdGZvcm1hdC5sYWJlbCh7IGxhYmVsOiBiYXNlbmFtZShwcm9jZXNzLm1haW5Nb2R1bGUgPyBwcm9jZXNzLm1haW5Nb2R1bGUuZmlsZW5hbWUgOiAndW5rbm93bi5maWxlJykgfSksXG5cdFx0XHRcdGZvcm1hdC50aW1lc3RhbXAoeyBmb3JtYXQ6ICdZWVlZLU1NLUREIEhIOm1tOnNzJyB9KVxuXHRcdFx0KSxcblx0XHRcdHRyYW5zcG9ydHM6IGlzRGV2ZWxvcG1lbnRcblx0XHRcdFx0PyBbLi4ubG9nZ2VyVHJhbnNwb3J0c11cblx0XHRcdFx0OiBbXG5cdFx0XHRcdFx0XHQuLi5sb2dnZXJUcmFuc3BvcnRzLFxuXHRcdFx0XHRcdFx0bmV3IHRyYW5zcG9ydHMuRmlsZSh7XG5cdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMuZmlsZSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBjb21iaW5lKFxuXHRcdFx0XHRcdFx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IGAke2luZm8udGltZXN0YW1wfSAke2luZm8ubGV2ZWx9IFske2luZm8ubGFiZWx9XTogJHtpbmZvLm1lc3NhZ2V9YClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0ICBdLFxuXHRcdFx0ZXhpdE9uRXJyb3I6IGZhbHNlXG5cdFx0fSlcblx0fVxufVxuXG5jb25zdCB7IGxvZ2dlciB9ID0gbmV3IEFwcExvZ2dlcihsb2dnZXJPcHRpb25zKVxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyXG4iLCJpbXBvcnQgKiBhcyBjb3JzTGlicmFyeSBmcm9tICdjb3JzJ1xuXG5jb25zdCB7IE5PREVfRU5WID0gJ2RldmVsb3BtZW50JywgTk9XX1VSTCA9ICdodHRwczovL29vam9iLmlvJywgRk9SQ0VfREVWID0gZmFsc2UgfSA9IHByb2Nlc3MuZW52XG5jb25zdCBwcm9kVXJscyA9IFsnaHR0cHM6Ly9vb2pvYi5pbycsICdodHRwczovL2FscGhhLm9vam9iLmlvJywgJ2h0dHBzOi8vYmV0YS5vb2pvYi5pbycsIE5PV19VUkxdXG5jb25zdCBpc1Byb2R1Y3Rpb24gPSBOT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICFGT1JDRV9ERVZcblxuY29uc3QgY29yc09wdGlvbiA9IHtcblx0b3JpZ2luOiBpc1Byb2R1Y3Rpb24gPyBwcm9kVXJscy5maWx0ZXIoQm9vbGVhbikgOiBbL2xvY2FsaG9zdC9dLFxuXHRtZXRob2RzOiAnR0VULCBIRUFELCBQVVQsIFBBVENILCBQT1NULCBERUxFVEUsIE9QVElPTicsXG5cdGNyZWRlbnRpYWxzOiB0cnVlLFxuXHRleHBvc2VkSGVhZGVyczogWydhdXRob3JpemF0aW9uJ11cbn1cblxuY29uc3QgY29ycyA9ICgpID0+IGNvcnNMaWJyYXJ5KGNvcnNPcHRpb24pXG5leHBvcnQgZGVmYXVsdCBjb3JzXG4iLCJpbXBvcnQgKiBhcyBob3N0VmFsaWRhdGlvbiBmcm9tICdob3N0LXZhbGlkYXRpb24nXG5cbi8vIE5PVEUoQG14c3Ricik6XG4vLyAtIEhvc3QgaGVhZGVyIG9ubHkgY29udGFpbnMgdGhlIGRvbWFpbiwgc28gc29tZXRoaW5nIGxpa2UgJ2J1aWxkLWFwaS1hc2RmMTIzLm5vdy5zaCcgb3IgJ29vam9iLmlvJ1xuLy8gLSBSZWZlcmVyIGhlYWRlciBjb250YWlucyB0aGUgZW50aXJlIFVSTCwgc28gc29tZXRoaW5nIGxpa2Vcbi8vICdodHRwczovL2J1aWxkLWFwaS1hc2RmMTIzLm5vdy5zaC9mb3J3YXJkJyBvciAnaHR0cHM6Ly9vb2pvYi5pby9mb3J3YXJkJ1xuLy8gVGhhdCBtZWFucyB3ZSBoYXZlIHRvIGNoZWNrIHRoZSBIb3N0IHNsaWdodGx5IGRpZmZlcmVudGx5IGZyb20gdGhlIFJlZmVyZXIgdG8gYXZvaWQgdGhpbmdzXG4vLyBsaWtlICdteS1kb21haW4tb29qb2IuaW8nIHRvIGJlIGFibGUgdG8gaGFjayBvdXIgdXNlcnNcblxuLy8gSG9zdHMsIHdpdGhvdXQgaHR0cChzKTovLyBhbmQgcGF0aHNcbmNvbnN0IHsgTk9XX1VSTCA9ICdodHRwOi8vb29qb2IuaW8nIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgdHJ1c3RlZEhvc3RzID0gW1xuXHROT1dfVVJMICYmIG5ldyBSZWdFeHAoYF4ke05PV19VUkwucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJyl9JGApLFxuXHQvXm9vam9iXFwuaW8kLywgLy8gVGhlIERvbWFpblxuXHQvXi4qXFwub29qb2JcXC5pbyQvIC8vIEFsbCBzdWJkb21haW5zXG5dLmZpbHRlcihCb29sZWFuKVxuXG4vLyBSZWZlcmVycywgd2l0aCBodHRwKHMpOi8vIGFuZCBwYXRoc1xuY29uc3QgdHJ1c3RlZFJlZmVyZXJzID0gW1xuXHROT1dfVVJMICYmIG5ldyBSZWdFeHAoYF4ke05PV19VUkx9KCR8XFwvLiopYCksXG5cdC9eaHR0cHM6XFwvXFwvb29qb2JcXC5pbygkfFxcLy4qKS8sIC8vIFRoZSBEb21haW5cblx0L15odHRwczpcXC9cXC8uKlxcLnNwZWN0cnVtXFwuY2hhdCgkfFxcLy4qKS8gLy8gQWxsIHN1YmRvbWFpbnNcbl0uZmlsdGVyKEJvb2xlYW4pXG5cbmNvbnN0IGNzcmYgPSBob3N0VmFsaWRhdGlvbih7XG5cdGhvc3RzOiB0cnVzdGVkSG9zdHMsXG5cdHJlZmVyZXJzOiB0cnVzdGVkUmVmZXJlcnMsXG5cdG1vZGU6ICdlaXRoZXInXG59KVxuZXhwb3J0IGRlZmF1bHQgY3NyZlxuIiwiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBTZW50cnkgZnJvbSAnc2VydmljZS9jb25maWcvc2VudHJ5J1xuXG5jb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyOiBFcnJvciwgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0aWYgKGVycikge1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyKVxuXHRcdHJlcy5zdGF0dXMoNTAwKS5zZW5kKCdPb3BzLCBzb21ldGhpbmcgd2VudCB3cm9uZyEgT3VyIGVuZ2luZWVycyBoYXZlIGJlZW4gYWxlcnRlZCBhbmQgd2lsbCBmaXggdGhpcyBhc2FwLicpXG5cblx0XHQvLyBjYXB0dXJlIGVycm9yIHdpdGggZXJyb3IgbWV0cmljcyBjb2xsZWN0b3Jcblx0XHRTZW50cnkuY2FwdHVyZUV4Y2VwdGlvbihlcnIpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG5leHQoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVycm9ySGFuZGxlclxuIiwiaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCAqIGFzIGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgU2VudHJ5IGZyb20gJ3NlcnZpY2UvY29uZmlnL3NlbnRyeSdcbmltcG9ydCBjb3JzIGZyb20gJ21pZGRsZXdhcmVzL2NvcnMnXG5pbXBvcnQgY3NyZiBmcm9tICdtaWRkbGV3YXJlcy9jc3JmJ1xuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICdtaWRkbGV3YXJlcy9lcnJvci1oYW5kbGVyJ1xuaW1wb3J0IHNlY3VyaXR5IGZyb20gJ21pZGRsZXdhcmVzL3NlY3VyaXR5J1xuaW1wb3J0IHRvb2J1c3kgZnJvbSAnbWlkZGxld2FyZXMvdG9vYnVzeSdcblxuY29uc3QgeyBFTkFCTEVfQ1NQID0gdHJ1ZSwgRU5BQkxFX05PTkNFID0gdHJ1ZSB9ID0gcHJvY2Vzcy5lbnZcblxuY29uc3QgbWlkZGxld2FyZXMgPSAoYXBwOiBBcHBsaWNhdGlvbikgPT4ge1xuXHQvLyBUaGUgcmVxdWVzdCBoYW5kbGVyIG11c3QgYmUgdGhlIGZpcnN0IG1pZGRsZXdhcmUgb24gdGhlIGFwcCBmb3Igc2VudHJ5IHRvIHdvcmsgcHJvcGVybHlcblx0YXBwLnVzZShTZW50cnkuSGFuZGxlcnMucmVxdWVzdEhhbmRsZXIoKSlcblxuXHQvLyBDT1JTIGZvciBjcm9zc3MtdGUgYWNjZXNzXG5cdGFwcC51c2UoY29ycygpKVxuXG5cdC8vIGpzb24gZW5jb2RpbmcgYW5kIGRlY29kaW5nXG5cdGFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuXHRhcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKVxuXG5cdC8vIHNldCBHWmlwIG9uIGhlYWRlcnMgZm9yIHJlcXVlc3QvcmVzcG9uc2Vcblx0YXBwLnVzZShjb21wcmVzc2lvbigpKVxuXG5cdGFwcC51c2UoY3NyZilcblx0Ly8gVGhlIGVycm9yIGhhbmRsZXIgbXVzdCBiZSBiZWZvcmUgYW55IG90aGVyIGVycm9yIG1pZGRsZXdhcmUgYW5kIGFmdGVyIGFsbCBjb250cm9sbGVyc1xuXHRhcHAudXNlKFNlbnRyeS5IYW5kbGVycy5lcnJvckhhbmRsZXIoKSlcblx0YXBwLnVzZShlcnJvckhhbmRsZXIpXG5cblx0c2VjdXJpdHkoYXBwLCB7XG5cdFx0ZW5hYmxlQ1NQOiBCb29sZWFuKEVOQUJMRV9DU1ApLFxuXHRcdGVuYWJsZU5vbmNlOiBCb29sZWFuKEVOQUJMRV9OT05DRSlcblx0fSlcblxuXHQvLyBidXNzeSBzZXJ2ZXIgKHdhaXQgZm9yIGl0IHRvIHJlc29sdmUpXG5cdGFwcC51c2UodG9vYnVzeSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaWRkbGV3YXJlc1xuIiwiaW1wb3J0ICogYXMgaHBwIGZyb20gJ2hwcCdcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgY29udGVudFNlY3VyaXR5UG9saWN5LCBmcmFtZWd1YXJkLCBoc3RzLCBpZU5vT3Blbiwgbm9TbmlmZiwgeHNzRmlsdGVyIH0gZnJvbSAnaGVsbWV0J1xuXG5pbXBvcnQgZXhwcmVzc0VuZm9yY2VzU3NsIGZyb20gJ2V4cHJlc3MtZW5mb3JjZXMtc3NsJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCdcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IHNlY3VyaXR5ID0gKGFwcDogQXBwbGljYXRpb24sIHsgZW5hYmxlTm9uY2UsIGVuYWJsZUNTUCB9OiB7IGVuYWJsZU5vbmNlOiBib29sZWFuOyBlbmFibGVDU1A6IGJvb2xlYW4gfSkgPT4ge1xuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXG5cdC8vIHNlY3VyaXR5IGhlbG1ldCBwYWNrYWdlXG5cdC8vIERvbid0IGV4cG9zZSBhbnkgc29mdHdhcmUgaW5mb3JtYXRpb24gdG8gaGFja2Vycy5cblx0YXBwLmRpc2FibGUoJ3gtcG93ZXJlZC1ieScpXG5cblx0Ly8gRXhwcmVzcyBtaWRkbGV3YXJlIHRvIHByb3RlY3QgYWdhaW5zdCBIVFRQIFBhcmFtZXRlciBQb2xsdXRpb24gYXR0YWNrc1xuXHRhcHAudXNlKGhwcCgpKVxuXG5cdGlmIChpc1Byb2R1Y3Rpb24pIHtcblx0XHRhcHAudXNlKFxuXHRcdFx0aHN0cyh7XG5cdFx0XHRcdC8vIDUgbWlucyBpbiBzZWNvbmRzXG5cdFx0XHRcdC8vIHdlIHdpbGwgc2NhbGUgdGhpcyB1cCBpbmNyZW1lbnRhbGx5IHRvIGVuc3VyZSB3ZSBkb250IGJyZWFrIHRoZVxuXHRcdFx0XHQvLyBhcHAgZm9yIGVuZCB1c2Vyc1xuXHRcdFx0XHQvLyBzZWUgZGVwbG95bWVudCByZWNvbW1lbmRhdGlvbnMgaGVyZSBodHRwczovL2hzdHNwcmVsb2FkLm9yZy8/ZG9tYWluPXNwZWN0cnVtLmNoYXRcblx0XHRcdFx0bWF4QWdlOiAzMDAsXG5cdFx0XHRcdGluY2x1ZGVTdWJEb21haW5zOiB0cnVlLFxuXHRcdFx0XHRwcmVsb2FkOiB0cnVlXG5cdFx0XHR9KVxuXHRcdClcblxuXHRcdGFwcC51c2UoZXhwcmVzc0VuZm9yY2VzU3NsKCkpXG5cdH1cblxuXHQvLyBUaGUgWC1GcmFtZS1PcHRpb25zIGhlYWRlciB0ZWxscyBicm93c2VycyB0byBwcmV2ZW50IHlvdXIgd2VicGFnZSBmcm9tIGJlaW5nIHB1dCBpbiBhbiBpZnJhbWUuXG5cdGFwcC51c2UoZnJhbWVndWFyZCh7IGFjdGlvbjogJ3NhbWVvcmlnaW4nIH0pKVxuXG5cdC8vIENyb3NzLXNpdGUgc2NyaXB0aW5nLCBhYmJyZXZpYXRlZCB0byDigJxYU1PigJ0sIGlzIGEgd2F5IGF0dGFja2VycyBjYW4gdGFrZSBvdmVyIHdlYnBhZ2VzLlxuXHRhcHAudXNlKHhzc0ZpbHRlcigpKVxuXG5cdC8vIFNldHMgdGhlIFgtRG93bmxvYWQtT3B0aW9ucyB0byBwcmV2ZW50IEludGVybmV0IEV4cGxvcmVyIGZyb20gZXhlY3V0aW5nXG5cdC8vIGRvd25sb2FkcyBpbiB5b3VyIHNpdGXigJlzIGNvbnRleHQuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9pZW5vb3Blbi9cblx0YXBwLnVzZShpZU5vT3BlbigpKVxuXG5cdC8vIERvbuKAmXQgU25pZmYgTWltZXR5cGUgbWlkZGxld2FyZSwgbm9TbmlmZiwgaGVscHMgcHJldmVudCBicm93c2VycyBmcm9tIHRyeWluZ1xuXHQvLyB0byBndWVzcyAo4oCcc25pZmbigJ0pIHRoZSBNSU1FIHR5cGUsIHdoaWNoIGNhbiBoYXZlIHNlY3VyaXR5IGltcGxpY2F0aW9ucy4gSXRcblx0Ly8gZG9lcyB0aGlzIGJ5IHNldHRpbmcgdGhlIFgtQ29udGVudC1UeXBlLU9wdGlvbnMgaGVhZGVyIHRvIG5vc25pZmYuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9kb250LXNuaWZmLW1pbWV0eXBlL1xuXHRhcHAudXNlKG5vU25pZmYoKSlcblxuXHRpZiAoZW5hYmxlTm9uY2UpIHtcblx0XHQvLyBBdHRhY2ggYSB1bmlxdWUgXCJub25jZVwiIHRvIGV2ZXJ5IHJlc3BvbnNlLiBUaGlzIGFsbG93cyB1c2UgdG8gZGVjbGFyZVxuXHRcdC8vIGlubGluZSBzY3JpcHRzIGFzIGJlaW5nIHNhZmUgZm9yIGV4ZWN1dGlvbiBhZ2FpbnN0IG91ciBjb250ZW50IHNlY3VyaXR5IHBvbGljeS5cblx0XHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRcdGFwcC51c2UoKHJlcXVlc3Q6IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdFx0XHRyZXNwb25zZS5sb2NhbHMubm9uY2UgPSB1dWlkLnY0KClcblx0XHRcdG5leHQoKVxuXHRcdH0pXG5cdH1cblxuXHQvLyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSAoQ1NQKVxuXHQvLyBJdCBjYW4gYmUgYSBwYWluIHRvIG1hbmFnZSB0aGVzZSwgYnV0IGl0J3MgYSByZWFsbHkgZ3JlYXQgaGFiaXQgdG8gZ2V0IGluIHRvLlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRjb25zdCBjc3BDb25maWcgPSB7XG5cdFx0ZGlyZWN0aXZlczoge1xuXHRcdFx0Ly8gVGhlIGRlZmF1bHQtc3JjIGlzIHRoZSBkZWZhdWx0IHBvbGljeSBmb3IgbG9hZGluZyBjb250ZW50IHN1Y2ggYXNcblx0XHRcdC8vIEphdmFTY3JpcHQsIEltYWdlcywgQ1NTLCBGb250cywgQUpBWCByZXF1ZXN0cywgRnJhbWVzLCBIVE1MNSBNZWRpYS5cblx0XHRcdC8vIEFzIHlvdSBtaWdodCBzdXNwZWN0LCBpcyB1c2VkIGFzIGZhbGxiYWNrIGZvciB1bnNwZWNpZmllZCBkaXJlY3RpdmVzLlxuXHRcdFx0ZGVmYXVsdFNyYzogW1wiJ3NlbGYnXCJdLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2YgSmF2YVNjcmlwdC5cblx0XHRcdHNjcmlwdFNyYzogW1xuXHRcdFx0XHRcIidzZWxmJ1wiLFxuXHRcdFx0XHRcIid1bnNhZmUtZXZhbCdcIixcblx0XHRcdFx0J3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbScsXG5cdFx0XHRcdCdjZG4ucmF2ZW5qcy5jb20nLFxuXHRcdFx0XHQnY2RuLnBvbHlmaWxsLmlvJyxcblx0XHRcdFx0J2Nkbi5hbXBsaXR1ZGUuY29tJyxcblxuXHRcdFx0XHQvLyBOb3RlOiBXZSB3aWxsIGV4ZWN1dGlvbiBvZiBhbnkgaW5saW5lIHNjcmlwdHMgdGhhdCBoYXZlIHRoZSBmb2xsb3dpbmdcblx0XHRcdFx0Ly8gbm9uY2UgaWRlbnRpZmllciBhdHRhY2hlZCB0byB0aGVtLlxuXHRcdFx0XHQvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgZ3VhcmRpbmcgeW91ciBhcHBsaWNhdGlvbiB3aGlsc3QgYWxsb3dpbmcgYW4gaW5saW5lXG5cdFx0XHRcdC8vIHNjcmlwdCB0byBkbyBkYXRhIHN0b3JlIHJlaHlkcmF0aW9uIChyZWR1eC9tb2J4L2Fwb2xsbykgZm9yIGV4YW1wbGUuXG5cdFx0XHRcdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdFx0XHRcdChfOiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IGAnbm9uY2UtJHtyZXNwb25zZS5sb2NhbHMubm9uY2V9J2Bcblx0XHRcdF0sXG5cblx0XHRcdC8vIERlZmluZXMgdGhlIG9yaWdpbnMgZnJvbSB3aGljaCBpbWFnZXMgY2FuIGJlIGxvYWRlZC5cblx0XHRcdC8vIEBub3RlOiBMZWF2ZSBvcGVuIHRvIGFsbCBpbWFnZXMsIHRvbyBtdWNoIGltYWdlIGNvbWluZyBmcm9tIGRpZmZlcmVudCBzZXJ2ZXJzLlxuXHRcdFx0aW1nU3JjOiBbJ2h0dHBzOicsICdodHRwOicsIFwiJ3NlbGYnXCIsICdkYXRhOicsICdibG9iOiddLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2Ygc3R5bGVzaGVldHMuXG5cdFx0XHRzdHlsZVNyYzogW1wiJ3NlbGYnXCIsIFwiJ3Vuc2FmZS1pbmxpbmUnXCJdLFxuXG5cdFx0XHQvLyBBcHBsaWVzIHRvIFhNTEh0dHBSZXF1ZXN0IChBSkFYKSwgV2ViU29ja2V0IG9yIEV2ZW50U291cmNlLlxuXHRcdFx0Ly8gSWYgbm90IGFsbG93ZWQgdGhlIGJyb3dzZXIgZW11bGF0ZXMgYSA0MDAgSFRUUCBzdGF0dXMgY29kZS5cblx0XHRcdGNvbm5lY3RTcmM6IFsnaHR0cHM6JywgJ3dzczonXSxcblxuXHRcdFx0Ly8gbGlzdHMgdGhlIFVSTHMgZm9yIHdvcmtlcnMgYW5kIGVtYmVkZGVkIGZyYW1lIGNvbnRlbnRzLlxuXHRcdFx0Ly8gRm9yIGV4YW1wbGU6IGNoaWxkLXNyYyBodHRwczovL3lvdXR1YmUuY29tIHdvdWxkIGVuYWJsZVxuXHRcdFx0Ly8gZW1iZWRkaW5nIHZpZGVvcyBmcm9tIFlvdVR1YmUgYnV0IG5vdCBmcm9tIG90aGVyIG9yaWdpbnMuXG5cdFx0XHQvLyBAbm90ZTogd2UgYWxsb3cgdXNlcnMgdG8gZW1iZWQgYW55IHBhZ2UgdGhleSB3YW50LlxuXHRcdFx0Y2hpbGRTcmM6IFsnaHR0cHM6JywgJ2h0dHA6J10sXG5cblx0XHRcdC8vIGFsbG93cyBjb250cm9sIG92ZXIgRmxhc2ggYW5kIG90aGVyIHBsdWdpbnMuXG5cdFx0XHRvYmplY3RTcmM6IFtcIidub25lJ1wiXSxcblxuXHRcdFx0Ly8gcmVzdHJpY3RzIHRoZSBvcmlnaW5zIGFsbG93ZWQgdG8gZGVsaXZlciB2aWRlbyBhbmQgYXVkaW8uXG5cdFx0XHRtZWRpYVNyYzogW1wiJ25vbmUnXCJdXG5cdFx0fSxcblxuXHRcdC8vIFNldCB0byB0cnVlIGlmIHlvdSBvbmx5IHdhbnQgYnJvd3NlcnMgdG8gcmVwb3J0IGVycm9ycywgbm90IGJsb2NrIHRoZW0uXG5cdFx0cmVwb3J0T25seTogTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgfHwgQm9vbGVhbihGT1JDRV9ERVYpIHx8IGZhbHNlLFxuXHRcdC8vIE5lY2Vzc2FyeSBiZWNhdXNlIG9mIFplaXQgQ0ROIHVzYWdlXG5cdFx0YnJvd3NlclNuaWZmOiBmYWxzZVxuXHR9XG5cblx0aWYgKGVuYWJsZUNTUCkge1xuXHRcdGFwcC51c2UoY29udGVudFNlY3VyaXR5UG9saWN5KGNzcENvbmZpZykpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VjdXJpdHlcbiIsImltcG9ydCAqIGFzIHRvb2J1c3kgZnJvbSAndG9vYnVzeS1qcydcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmICghaXNEZXZlbG9wbWVudCAmJiB0b29idXN5KCkpIHtcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwM1xuXHRcdHJlcy5zZW5kKCdJdCBsb29rZSBsaWtlIHRoZSBzZXZlciBpcyBidXNzeS4gV2FpdCBmZXcgc2Vjb25kcy4uLicpXG5cdH0gZWxzZSB7XG5cdFx0Ly8gcXVldWUgdXAgdGhlIHJlcXVlc3QgYW5kIHdhaXQgZm9yIGl0IHRvIGNvbXBsZXRlIGluIHRlc3RpbmcgYW5kIGRldmVsb3BtZW50IHBoYXNlXG5cdFx0bmV4dCgpXG5cdH1cbn1cbiIsImltcG9ydCB7IFNlcnZlciwgY3JlYXRlU2VydmVyIH0gZnJvbSAnaHR0cCdcblxuaW1wb3J0IEFwcCBmcm9tICdhcHAuc2VydmVyJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGdyYXBocWxTZXJ2ZXIgZnJvbSAnZ3JhcGhxbC5zZXJ2ZXInXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCB7IG5vcm1hbGl6ZVBvcnQgfSBmcm9tICd1dGlsbGl0eS9ub3JtYWxpemUnXG5cbmNsYXNzIE9vam9iU2VydmVyIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIHNlcnZlcjogU2VydmVyXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0Z3JhcGhxbFNlcnZlci5hcHBseU1pZGRsZXdhcmUoe1xuXHRcdFx0YXBwLFxuXHRcdFx0b25IZWFsdGhDaGVjazogKCkgPT5cblx0XHRcdFx0bmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdC8vIFJlcGxhY2UgdGhlIGB0cnVlYCBpbiB0aGlzIGNvbmRpdGlvbmFsIHdpdGggbW9yZSBzcGVjaWZpYyBjaGVja3MhXG5cdFx0XHRcdFx0aWYgKHBhcnNlSW50KCcyJykgPT09IDIpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKGFwcClcblx0XHRncmFwaHFsU2VydmVyLmluc3RhbGxTdWJzY3JpcHRpb25IYW5kbGVycyh0aGlzLnNlcnZlcilcblx0fVxuXG5cdHN0YXJ0U3luY1NlcnZlciA9IGFzeW5jIChwb3J0OiBzdHJpbmcpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgUE9SVCA9IG5vcm1hbGl6ZVBvcnQocG9ydClcblx0XHRcdHRoaXMuc2VydmVyLmxpc3RlbihQT1JULCAoKSA9PiB7XG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBzZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLmdyYXBocWxQYXRofWApXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBTdWJzY3JpcHRpb25zIHJlYWR5IGF0IHdzOi8vbG9jYWxob3N0OiR7UE9SVH0ke2dyYXBocWxTZXJ2ZXIuc3Vic2NyaXB0aW9uc1BhdGh9YClcblx0XHRcdFx0bG9nZ2VyLmluZm8oYFRyeSB5b3VyIGhlYWx0aCBjaGVjayBhdDogaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9Ly53ZWxsLWtub3duL2Fwb2xsby9zZXJ2ZXItaGVhbHRoYClcblx0XHRcdH0pXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGF3YWl0IHRoaXMuc3RvcFNlcnZlcigpXG5cdFx0fVxuXHR9XG5cblx0c3RvcFNlcnZlciA9IGFzeW5jICgpID0+IHtcblx0XHRwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRsb2dnZXIuaW5mbygnQ2xvc2luZyBvb2pvYiBTeW5jU2VydmVyIC4uLicpXG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRoaXMuc2VydmVyLmNsb3NlKClcblx0XHRcdFx0bG9nZ2VyLmluZm8oJ29vam9iIFN5bmNTZXJ2ZXIgQ2xvc2VkJylcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIENsb3NpbmcgU3luY1NlcnZlciBTZXJ2ZXIgQ29ubmVjdGlvbicpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cdFx0XHRcdHByb2Nlc3Mua2lsbChwcm9jZXNzLnBpZClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB7IHN0YXJ0U3luY1NlcnZlciwgc3RvcFNlcnZlciwgc2VydmVyLCBhcHAgfSA9IG5ldyBPb2pvYlNlcnZlcihBcHApXG4iLCJpbXBvcnQgUmVkaXMgZnJvbSAnaW9yZWRpcydcblxuY29uc3QgcmVkaXNDb25maWcgPSB7XG5cdHBvcnQ6IHByb2Nlc3MuZW52LlJFRElTX0NBQ0hFX1BPUlQgPyBwYXJzZUludChwcm9jZXNzLmVudi5SRURJU19DQUNIRV9QT1JUKSA6IHVuZGVmaW5lZCxcblx0aG9zdDogcHJvY2Vzcy5lbnYuUkVESVNfQ0FDSEVfVVJMLFxuXHRwYXNzd29yZDogcHJvY2Vzcy5lbnYuUkVESVNfQ0FDSEVfUEFTU1dPUkRcbn1cbmV4cG9ydCBjb25zdCBjb25maWcgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICFwcm9jZXNzLmVudi5GT1JDRV9ERVYgPyByZWRpc0NvbmZpZyA6IHVuZGVmaW5lZFxuXG5jb25zdCByZWRpcyA9IG5ldyBSZWRpcyhjb25maWcpXG5cbmV4cG9ydCB7IHJlZGlzIH1cbmV4cG9ydCBkZWZhdWx0IHJlZGlzXG4iLCJpbXBvcnQgKiBhcyBTZW50cnkgZnJvbSAnQHNlbnRyeS9ub2RlJ1xuXG5pbXBvcnQgeyBSZXdyaXRlRnJhbWVzIH0gZnJvbSAnQHNlbnRyeS9pbnRlZ3JhdGlvbnMnXG5cbmdsb2JhbC5fX3Jvb3RkaXJfXyA9IF9fZGlybmFtZSB8fCBwcm9jZXNzLmN3ZCgpXG5TZW50cnkuaW5pdCh7XG5cdGRzbjogcHJvY2Vzcy5lbnYuU0VOVFJZX0RTTixcblx0aW50ZWdyYXRpb25zOiBbXG5cdFx0bmV3IFJld3JpdGVGcmFtZXMoe1xuXHRcdFx0cm9vdDogZ2xvYmFsLl9fcm9vdGRpcl9fXG5cdFx0fSlcblx0XSxcblx0c2VydmVyTmFtZTogcHJvY2Vzcy5lbnYuU0VOVFJZX05BTUVcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IFNlbnRyeVxuIiwiaW1wb3J0IHsgR3JhcGhRTEVycm9yIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7IElzVXNlckVycm9yIH0gZnJvbSAnc2VydmljZS9lcnJvci91c2VyLmVycm9yJ1xuaW1wb3J0IHsgUmF0ZUxpbWl0RXJyb3IgfSBmcm9tICdncmFwaHFsLXJhdGUtbGltaXQnXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBTZW50cnkgZnJvbSAnc2VydmljZS9jb25maWcvc2VudHJ5J1xuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5cbmNvbnN0IHF1ZXJ5UmUgPSAvXFxzKihxdWVyeXxtdXRhdGlvbilbXntdKi9cblxuY29uc3QgY29sbGVjdFF1ZXJpZXMgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuXHRpZiAoIXF1ZXJ5KSByZXR1cm4gJ05vIHF1ZXJ5J1xuXG5cdHJldHVybiBxdWVyeVxuXHRcdC5zcGxpdCgnXFxuJylcblx0XHQubWFwKChsaW5lKSA9PiB7XG5cdFx0XHRjb25zdCBtID0gbGluZS5tYXRjaChxdWVyeVJlKVxuXG5cdFx0XHRyZXR1cm4gbSA/IG1bMF0udHJpbSgpIDogJydcblx0XHR9KVxuXHRcdC5maWx0ZXIoKGxpbmUpID0+ICEhbGluZSlcblx0XHQuam9pbignXFxuJylcbn1cblxuY29uc3QgZXJyb3JQYXRoID0gKGVycm9yOiBhbnkpID0+IHtcblx0aWYgKCFlcnJvci5wYXRoKSByZXR1cm4gJydcblxuXHRyZXR1cm4gZXJyb3IucGF0aFxuXHRcdC5tYXAoKHZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGlmICghaW5kZXgpIHJldHVybiB2YWx1ZVxuXG5cdFx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IGBbJHt2YWx1ZX1dYCA6IGAuJHt2YWx1ZX1gXG5cdFx0fSlcblx0XHQuam9pbignJylcbn1cblxuY29uc3QgbG9nR3JhcGhRTEVycm9yID0gKGVycm9yOiBhbnksIHJlcT86IFJlcXVlc3QpID0+IHtcblx0bG9nZ2VyLmluZm8oJy0tLUdyYXBoUUwgRXJyb3ItLS0nKVxuXHRsb2dnZXIuZXJyb3IoZXJyb3IpXG5cdGVycm9yICYmXG5cdFx0ZXJyb3IuZXh0ZW5zaW9ucyAmJlxuXHRcdGVycm9yLmV4dGVuc2lvbnMuZXhjZXB0aW9uICYmXG5cdFx0bG9nZ2VyLmVycm9yKGVycm9yLmV4dGVuc2lvbnMuZXhjZXB0aW9uLnN0YWNrdHJhY2Uuam9pbignXFxuJykpXG5cblx0aWYgKHJlcSkge1xuXHRcdGxvZ2dlci5pbmZvKGNvbGxlY3RRdWVyaWVzKHJlcS5ib2R5LnF1ZXJ5KSlcblx0XHRsb2dnZXIuaW5mbygndmFyaWFibGVzJywgSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkudmFyaWFibGVzIHx8IHt9KSlcblx0fVxuXHRjb25zdCBwYXRoID0gZXJyb3JQYXRoKGVycm9yKVxuXHRwYXRoICYmIGxvZ2dlci5pbmZvKCdwYXRoJywgcGF0aClcblx0bG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS1cXG4nKVxufVxuXG5jb25zdCBjcmVhdGVHcmFwaFFMRXJyb3JGb3JtYXR0ZXIgPSAocmVxPzogUmVxdWVzdCkgPT4gKGVycm9yOiBHcmFwaFFMRXJyb3IpID0+IHtcblx0bG9nR3JhcGhRTEVycm9yKGVycm9yLCByZXEpXG5cblx0Y29uc3QgZXJyID0gZXJyb3Iub3JpZ2luYWxFcnJvciB8fCBlcnJvclxuXHRjb25zdCBpc1VzZXJFcnJvciA9IGVycltJc1VzZXJFcnJvcl0gfHwgZXJyIGluc3RhbmNlb2YgUmF0ZUxpbWl0RXJyb3JcblxuXHRsZXQgc2VudHJ5SWQgPSAnSUQgb25seSBnZW5lcmF0ZWQgaW4gcHJvZHVjdGlvbidcblx0aWYgKCFpc1VzZXJFcnJvciB8fCBlcnIgaW5zdGFuY2VvZiBSYXRlTGltaXRFcnJvcikge1xuXHRcdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdFx0XHRzZW50cnlJZCA9IFNlbnRyeS5jYXB0dXJlRXhjZXB0aW9uKGVycm9yKVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bWVzc2FnZTogaXNVc2VyRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogYEludGVybmFsIHNlcnZlciBlcnJvcjogJHtzZW50cnlJZH1gLFxuXHRcdC8vIEhpZGUgdGhlIHN0YWNrIHRyYWNlIGluIHByb2R1Y3Rpb24gbW9kZVxuXHRcdHN0YWNrOiAhKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlR3JhcGhRTEVycm9yRm9ybWF0dGVyXG4iLCJleHBvcnQgY29uc3QgSXNVc2VyRXJyb3IgPSBTeW1ib2woJ0lzVXNlckVycm9yJylcblxuY2xhc3MgVXNlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcblx0XHRzdXBlcihtZXNzYWdlKVxuXHRcdHRoaXMubmFtZSA9ICdFcnJvcidcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG5cdFx0dGhpc1tJc1VzZXJFcnJvcl0gPSB0cnVlXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcylcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyRXJyb3JcbiIsImltcG9ydCB7IEphZWdlckV4cG9ydGVyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItamFlZ2VyJ1xuaW1wb3J0IHsgTWV0ZXJQcm92aWRlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L21ldHJpY3MnXG5pbXBvcnQgeyBOb2RlVHJhY2VyUHJvdmlkZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9ub2RlJ1xuaW1wb3J0IHsgUHJvbWV0aGV1c0V4cG9ydGVyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItcHJvbWV0aGV1cydcbmltcG9ydCB7IFNpbXBsZVNwYW5Qcm9jZXNzb3IgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS90cmFjaW5nJ1xuaW1wb3J0IG9wZW50ZWxlbWV0cnkgZnJvbSAnQG9wZW50ZWxlbWV0cnkvYXBpJ1xuXG5jb25zdCB0cmFjZXIgPSAoc2VydmljZU5hbWU6IHN0cmluZykgPT4ge1xuXHRjb25zdCBwcm92aWRlciA9IG5ldyBOb2RlVHJhY2VyUHJvdmlkZXIoe1xuXHRcdHBsdWdpbnM6IHtcblx0XHRcdGdycGM6IHtcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0cGF0aDogJ0BvcGVudGVsZW1ldHJ5L3BsdWdpbi1ncnBjJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSlcblxuXHRjb25zdCBleHBvcnRlciA9IG5ldyBKYWVnZXJFeHBvcnRlcih7XG5cdFx0c2VydmljZU5hbWVcblx0fSlcblxuXHRjb25zdCBtZXRlclByb3ZpZGVyID0gbmV3IE1ldGVyUHJvdmlkZXIoe1xuXHRcdC8vIFRoZSBQcm9tZXRoZXVzIGV4cG9ydGVyIHJ1bnMgYW4gSFRUUCBzZXJ2ZXIgd2hpY2hcblx0XHQvLyB0aGUgUHJvbWV0aGV1cyBiYWNrZW5kIHNjcmFwZXMgdG8gY29sbGVjdCBtZXRyaWNzLlxuXHRcdGV4cG9ydGVyOiBuZXcgUHJvbWV0aGV1c0V4cG9ydGVyKHsgc3RhcnRTZXJ2ZXI6IHRydWUgfSksXG5cdFx0aW50ZXJ2YWw6IDEwMDBcblx0fSlcblxuXHRwcm92aWRlci5hZGRTcGFuUHJvY2Vzc29yKG5ldyBTaW1wbGVTcGFuUHJvY2Vzc29yKGV4cG9ydGVyKSlcblxuXHQvKipcblx0ICogUmVnaXN0ZXJpbmcgdGhlIHByb3ZpZGVyIHdpdGggdGhlIEFQSSBhbGxvd3MgaXQgdG8gYmUgZGlzY292ZXJlZFxuXHQgKiBhbmQgdXNlZCBieSBpbnN0cnVtZW50YXRpb24gbGlicmFyaWVzLiBUaGUgT3BlblRlbGVtZXRyeSBBUEkgcHJvdmlkZXNcblx0ICogbWV0aG9kcyB0byBzZXQgZ2xvYmFsIFNESyBpbXBsZW1lbnRhdGlvbnMsIGJ1dCB0aGUgZGVmYXVsdCBTREsgcHJvdmlkZXNcblx0ICogYSBjb252ZW5pZW5jZSBtZXRob2QgbmFtZWQgYHJlZ2lzdGVyYCB3aGljaCByZWdpc3RlcnMgc2FtZSBkZWZhdWx0c1xuXHQgKiBmb3IgeW91LlxuXHQgKlxuXHQgKiBCeSBkZWZhdWx0IHRoZSBOb2RlVHJhY2VyUHJvdmlkZXIgdXNlcyBUcmFjZSBDb250ZXh0IGZvciBwcm9wYWdhdGlvblxuXHQgKiBhbmQgQXN5bmNIb29rc1Njb3BlTWFuYWdlciBmb3IgY29udGV4dCBtYW5hZ2VtZW50LiBUbyBsZWFybiBhYm91dFxuXHQgKiBjdXN0b21pemluZyB0aGlzIGJlaGF2aW9yLCBzZWUgQVBJIFJlZ2lzdHJhdGlvbiBPcHRpb25zIGJlbG93LlxuXHQgKi9cblx0cHJvdmlkZXIucmVnaXN0ZXIoKVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcmluZyB0aGUgcHJvdmlkZXIgd2l0aCB0aGUgQVBJIGFsbG93cyBpdCB0byBiZSBkaXNjb3ZlcmVkXG5cdCAqIGFuZCB1c2VkIGJ5IGluc3RydW1lbnRhdGlvbiBsaWJyYXJpZXMuXG5cdCAqL1xuXHRvcGVudGVsZW1ldHJ5Lm1ldHJpY3Muc2V0R2xvYmFsTWV0ZXJQcm92aWRlcihtZXRlclByb3ZpZGVyKVxuXG5cdHJldHVybiBvcGVudGVsZW1ldHJ5LnRyYWNlLmdldFRyYWNlcignc2VydmljZTpnYXRld2F5Jylcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhY2VyXG4iLCJpbXBvcnQgeyBjcmVhdGVDaXBoZXIsIGNyZWF0ZURlY2lwaGVyIH0gZnJvbSAnY3J5cHRvJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBDcnlwdG8ge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwcml2YXRlIEVOQ1JZUFRfQUxHT1JJVEhNOiBzdHJpbmdcblx0cHJpdmF0ZSBFTkNSWVBUX1NFQ1JFVDogc3RyaW5nXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdGNvbnN0IHsgRU5DUllQVF9TRUNSRVQgPSAnZG9kb2R1Y2tATjknLCBFTkNSWVBUX0FMR09SSVRITSA9ICdhZXMtMjU2LWN0cicgfSA9IHByb2Nlc3MuZW52XG5cblx0XHR0aGlzLmFwcCA9IGFwcFxuXHRcdHRoaXMuRU5DUllQVF9BTEdPUklUSE0gPSBFTkNSWVBUX0FMR09SSVRITVxuXHRcdHRoaXMuRU5DUllQVF9TRUNSRVQgPSBFTkNSWVBUX1NFQ1JFVFxuXHR9XG5cblx0cHVibGljIGVuY3J5cHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0dGhpcy5hcHAubG9nZ2VyLmluZm8oYEVuY3J5cHQgZm9yICR7dGV4dH1gKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNpcGhlciA9IGNyZWF0ZUNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGNyeXB0ZWQgPSBjaXBoZXIudXBkYXRlKHRleHQsICd1dGY4JywgJ2hleCcpXG5cdFx0XHRjcnlwdGVkICs9IGNpcGhlci5maW5hbCgnaGV4JylcblxuXHRcdFx0cmV0dXJuIGNyeXB0ZWRcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHAubG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpXG5cblx0XHRcdHJldHVybiAnJ1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBkZWNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBEZWNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZWNpcGhlciA9IGNyZWF0ZURlY2lwaGVyKHRoaXMuRU5DUllQVF9BTEdPUklUSE0sIHRoaXMuRU5DUllQVF9TRUNSRVQpXG5cdFx0XHRsZXQgZGVjID0gZGVjaXBoZXIudXBkYXRlKHRleHQsICdoZXgnLCAndXRmOCcpXG5cdFx0XHRkZWMgKz0gZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKVxuXG5cdFx0XHRyZXR1cm4gZGVjXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwQ3J5cHRvXG4iLCJpbXBvcnQgQXBwQ3J5cHRvIGZyb20gJy4vY3J5cHRvJ1xuaW1wb3J0IEFwcFNsdWdpZnkgZnJvbSAnLi9zbHVnaWZ5J1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgSUFwcFV0aWxzIH0gZnJvbSAnLi91dGlsLmludGVyZmFjZSdcblxuY2xhc3MgQXBwVXRpbHMgaW1wbGVtZW50cyBJQXBwVXRpbHMge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXG5cdFx0Ly8gdGhpcy5hcHAubG9nZ2VyLmluZm8oJ0luaXRpYWxpemVkIEFwcFV0aWxzJylcblx0fVxuXG5cdHB1YmxpYyBhcHBseVV0aWxzID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuXHRcdGNvbnN0IHsgZW5jcnlwdCwgZGVjcnlwdCB9ID0gbmV3IEFwcENyeXB0byh0aGlzLmFwcClcblx0XHRjb25zdCB7IHNsdWdpZnkgfSA9IG5ldyBBcHBTbHVnaWZ5KHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwLnV0aWxpdHkgPSB7XG5cdFx0XHRlbmNyeXB0LFxuXHRcdFx0ZGVjcnlwdCxcblx0XHRcdHNsdWdpZnlcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFV0aWxzXG4iLCJjb25zdCBub3JtYWxpemVQb3J0ID0gKHBvcnRWYWx1ZTogc3RyaW5nKTogbnVtYmVyID0+IHtcblx0Y29uc3QgcG9ydCA9IHBhcnNlSW50KHBvcnRWYWx1ZSwgMTApXG5cblx0aWYgKGlzTmFOKHBvcnQpKSB7XG5cdFx0cmV0dXJuIDgwODBcblx0fVxuXG5cdGlmIChwb3J0ID49IDApIHtcblx0XHRyZXR1cm4gcG9ydFxuXHR9XG5cblx0cmV0dXJuIHBvcnRcbn1cblxuZXhwb3J0IHsgbm9ybWFsaXplUG9ydCB9XG5leHBvcnQgZGVmYXVsdCBub3JtYWxpemVQb3J0XG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmNsYXNzIEFwcFNsdWdpZnkge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXHR9XG5cblx0cHVibGljIHNsdWdpZnkgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0Ly8gdGhpcy5hcHAubG9nZ2VyLmluZm8oYFNsdWdpZnkgZm9yICR7dGV4dH1gKVxuXG5cdFx0cmV0dXJuIHRleHRcblx0XHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0XHQucmVwbGFjZSgvW15cXHcgXSsvZywgJycpXG5cdFx0XHQucmVwbGFjZSgvICsvZywgJy0nKVxuXHR9XG59XG5cbmV4cG9ydCB7IEFwcFNsdWdpZnkgfVxuZXhwb3J0IGRlZmF1bHQgQXBwU2x1Z2lmeVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL29vam9iLXByb3RvYnVmXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvYXBpXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L2V4cG9ydGVyLWphZWdlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1wcm9tZXRoZXVzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L21ldHJpY3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS90cmFjaW5nXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBzZW50cnkvaW50ZWdyYXRpb25zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBzZW50cnkvbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWNhY2hlLXJlZGlzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbHVzdGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvbXByZXNzaW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudi9jb25maWdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWVuZm9yY2VzLXNzbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLWRlcHRoLWxpbWl0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtcmF0ZS1saW1pdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncnBjXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhlbG1ldFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJob3N0LXZhbGlkYXRpb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHBwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaW9yZWRpc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0b29idXN5LWpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRzbGliXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ3aW5zdG9uXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=