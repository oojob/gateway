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
/******/ 	var hotCurrentHash = "849d7a71300297ad85f7";
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
const oojob_protobuf_1 = __webpack_require__(/*! @oojob/oojob-protobuf */ "@oojob/oojob-protobuf");
const service_pb_1 = __webpack_require__(/*! @oojob/protorepo-profile-node/service_pb */ "@oojob/protorepo-profile-node/service_pb");
const transformer_1 = __webpack_require__(/*! client/profile/transformer */ "./src/client/profile/transformer/index.ts");
exports.Query = {
    ValidateUsername: (_, { input }, { tracer }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const span = tracer.startSpan('client:service-profile:validate-username');
        const res = {};
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
        return res;
    }),
    ValidateEmail: (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const email = input.email;
        const validateEmailReq = new service_pb_1.ValidateEmailRequest();
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
    })
};
exports.Mutation = {
    CreateProfile: (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const middleName = input.middleName ? ` ${input.middleName.trim()}` : '';
        const familyName = input.familyName ? ` ${input.familyName.trim()}` : '';
        const name = `${input.givenName}${middleName}${familyName}`;
        const identifier = new oojob_protobuf_1.Identifier();
        identifier.setName(name.trim());
        const profileSecurity = new service_pb_1.ProfileSecurity();
        if ((_a = input.security) === null || _a === void 0 ? void 0 : _a.password) {
            profileSecurity.setPassword(input.security.password);
        }
        const email = new oojob_protobuf_1.Email();
        if ((_b = input.email) === null || _b === void 0 ? void 0 : _b.email) {
            email.setEmail(input.email.email);
        }
        if ((_c = input.email) === null || _c === void 0 ? void 0 : _c.show) {
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

module.exports = "enum AccountType {\n  BASE\n  COMPANY\n  FUNDING\n  JOB\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum ProfileOperations {\n  CREATE\n  READ\n  UPDATE\n  DELETE\n  BULK_UPDATE\n}\n\nenum OperationEntity {\n  COMPANY\n  JOB\n  INVESTOR\n}\n\ntype Education {\n  education: String\n  show: Boolean\n}\n\ntype ProfileSecurity {\n  password: String\n  passwordSalt: String\n  passwordHash: String\n  code: String\n  codeType: String\n  accountType: AccountType\n  verified: Boolean\n}\n\ntype Profile {\n  identity: Identifier\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  email: Email\n  gender: Gender\n  birthdate: Timestamp\n  currentPosition: String\n  education: Education\n  address: Address\n  security: ProfileSecurity\n  metadata: Metadata\n}\n\ninput EducationInput {\n  education: String\n  show: Boolean\n}\n\ninput ProfileSecurityInput {\n  password: String\n  accountType: AccountType\n}\n\ninput ProfileInput {\n  identity: IdentifierInput\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  email: EmailInput\n  gender: Gender\n  birthdate: TimestampInput\n  currentPosition: String\n  education: EducationInput\n  address: AddressInput\n  security: ProfileSecurityInput\n}\n\ninput ValidateUsernameInput {\n  username: String\n}\n\ninput ValidateEmailInput {\n  email: String\n}\n\nextend type Query {\n  ValidateUsername(input: ValidateUsernameInput!): DefaultResponse!\n  ValidateEmail(input: ValidateEmailInput!): DefaultResponse!\n}\n\nextend type Mutation {\n  CreateProfile(input: ProfileInput!): Id!\n}\n"

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
const tracer_1 = __webpack_require__(/*! tracer */ "./src/tracer.ts");
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const resolver_1 = __webpack_require__(/*! client/profile/resolver */ "./src/client/profile/resolver/index.ts");
const resolver_2 = __webpack_require__(/*! client/root/resolver */ "./src/client/root/resolver/index.ts");
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
const tracer = tracer_1.default('service:gateway');
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
    context: ({ req, connection }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return ({
            req,
            connection,
            pubsub: exports.pubsub,
            tracer
        });
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
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.fork();
    }
    cluster_1.on('fork', (worker) => {
        console.log('worker is dead:', worker.isDead());
    });
    cluster_1.on('exit', (worker) => {
        console.log('worker is dead:', worker.isDead());
    });
}
else {
    let currentApp = oojob_server_1.app;
    if (true) {
        module.hot.accept(/*! app.server */ "./src/app.server.ts", () => {
            oojob_server_1.server.removeListener('request', currentApp);
            oojob_server_1.server.on('request', oojob_server_1.app);
            currentApp = oojob_server_1.app;
        });
        module.hot.dispose(() => oojob_server_1.server.close());
    }
    start();
    console.log(`Worker ${process.pid} started`);
}


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
const logger_1 = __webpack_require__(/*! middlewares/logger */ "./src/middlewares/logger.ts");
const security_1 = __webpack_require__(/*! middlewares/security */ "./src/middlewares/security.ts");
const toobusy_1 = __webpack_require__(/*! middlewares/toobusy */ "./src/middlewares/toobusy.ts");
const winston_1 = __webpack_require__(/*! middlewares/winston */ "./src/middlewares/winston.ts");
const { ENABLE_CSP = true, ENABLE_NONCE = true } = process.env;
const middlewares = (app) => {
    app.use(cors_1.default());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use((req, res, next) => {
        req.logger = winston_1.default;
        return next();
    });
    app.use(logger_1.default);
    app.use(csrf_1.default);
    app.use(error_handler_1.default);
    security_1.default(app, { enableCSP: Boolean(ENABLE_CSP), enableNonce: Boolean(ENABLE_NONCE) });
    app.use(toobusy_1.default());
};
exports.default = middlewares;


/***/ }),

/***/ "./src/middlewares/logger.ts":
/*!***********************************!*\
  !*** ./src/middlewares/logger.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const morgan = __webpack_require__(/*! morgan */ "morgan");
const debug_1 = __webpack_require__(/*! debug */ "debug");
const debug = debug_1.default('middlewares:logging');
const { NODE_ENV = 'development', FORCE_DEV = false } = process.env;
const isProduction = NODE_ENV === 'production' && !FORCE_DEV;
const logger = morgan('combined', {
    skip: (_, res) => isProduction && res.statusCode >= 200 && res.statusCode < 300,
    stream: {
        write: (message) => debug(message)
    }
});
exports.default = logger;


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

/***/ "./src/middlewares/winston.ts":
/*!************************************!*\
  !*** ./src/middlewares/winston.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const winston_1 = __webpack_require__(/*! winston */ "winston");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const path_1 = __webpack_require__(/*! path */ "path");
const { combine, timestamp, prettyPrint } = winston_1.format;
const logDirectory = path_1.join(__dirname, 'log');
const isDevelopment = "development" === 'development';
exports.loggerOptions = {
    file: {
        level: 'info',
        filename: `${logDirectory}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};
const loggerTransports = [
    new winston_1.transports.Console(Object.assign(Object.assign({}, exports.loggerOptions.console), { format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.colorize({ all: true }), winston_1.format.align(), winston_1.format.printf((info) => {
            const { timestamp, level, message } = info, args = tslib_1.__rest(info, ["timestamp", "level", "message"]);
            return `${timestamp} ${level}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
        })) }))
];
class AppLogger {
    constructor(options) {
        if (!isDevelopment) {
            fs_1.existsSync(logDirectory) || fs_1.mkdirSync(logDirectory);
        }
        this.logger = winston_1.createLogger({
            transports: isDevelopment
                ? [...loggerTransports]
                : [
                    ...loggerTransports,
                    new winston_1.transports.File(Object.assign(Object.assign({}, options.file), { format: combine(timestamp(), prettyPrint()) }))
                ],
            exitOnError: false
        });
    }
}
const { logger } = new AppLogger(exports.loggerOptions);
exports.default = logger;


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
const normalize_1 = __webpack_require__(/*! utillity/normalize */ "./src/utillity/normalize.ts");
class OojobServer {
    constructor(app) {
        this.startSyncServer = (port) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PORT = normalize_1.normalizePort(port);
                this.server.listen(PORT, () => {
                    console.log(`server ready at http://localhost:${PORT}${graphql_server_1.default.graphqlPath}`);
                    console.log(`Subscriptions ready at ws://localhost:${PORT}${graphql_server_1.default.subscriptionsPath}`);
                });
            }
            catch (error) {
                yield this.stopServer();
            }
        });
        this.stopServer = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            process.on('SIGINT', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                console.log('Closing oojob SyncServer ...');
                try {
                    this.server.close();
                    console.log('oojob SyncServer Closed');
                }
                catch (error) {
                    console.error('Error Closing SyncServer Server Connection');
                    console.error(error);
                    process.kill(process.pid);
                }
            }));
        });
        this.app = app;
        graphql_server_1.default.applyMiddleware({ app });
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
const node_1 = __webpack_require__(/*! @opentelemetry/node */ "@opentelemetry/node");
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
    provider.addSpanProcessor(new tracing_1.SimpleSpanProcessor(exporter));
    provider.register();
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

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

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

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9jb3JzLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9jc3JmLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9lcnJvci1oYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvbG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvd2luc3Rvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFjZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2NyeXB0by50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L25vcm1hbGl6ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvc2x1Z2lmeS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9hcGlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRlYnVnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZG90ZW52L2NvbmZpZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzLWVuZm9yY2VzLXNzbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JwY1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhlbG1ldFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhvc3QtdmFsaWRhdGlvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhwcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b29idXN5LWpzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHNsaWJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbnN0b25cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3QjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxxQkFBcUIsZ0JBQWdCO1FBQ3JDO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFD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Ozs7Ozs7Ozs7Ozs7O0FDbkJ6QixrRDs7Ozs7Ozs7Ozs7QUNBQSwwRDs7Ozs7Ozs7Ozs7QUNBQSxxRTs7Ozs7Ozs7Ozs7QUNBQSwrQzs7Ozs7Ozs7Ozs7QUNBQSwyRDs7Ozs7Ozs7Ozs7QUNBQSxnRDs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSxrRDs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxpRDs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSw0Qzs7Ozs7Ozs7Ozs7QUNBQSxnQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSx1Qzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQyIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwiLmhvdC9cIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7XG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCIuaG90L1wiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XG4gXHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1cGRhdGUpO1xuIFx0fVxuXG4gXHQvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjg0OWQ3YTcxMzAwMjk3YWQ4NWY3XCI7XG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTtcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRpZiAoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuIFx0XHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG4gXHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuIFx0XHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuIFx0XHRcdFx0XHRcdHJlcXVlc3QgK1xuIFx0XHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdCk7XG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcbiBcdFx0fTtcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xuIFx0XHRcdFx0fSxcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH07XG4gXHRcdH07XG4gXHRcdGZvciAodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJlXCIgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwidFwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRmbi50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0XHRpZiAobW9kZSAmIDEpIHZhbHVlID0gZm4odmFsdWUpO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLnQodmFsdWUsIG1vZGUgJiB+MSk7XG4gXHRcdH07XG4gXHRcdHJldHVybiBmbjtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIGhvdCA9IHtcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxuXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIikge1xuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHR9XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSBcIm1haW5cIjtcbiBcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHR7XG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQgJiZcbiBcdFx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmVcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXG5cdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiXG5cdFx0KTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKVxuXHRcdFx0bG9nKFxuXHRcdFx0XHRcImluZm9cIixcblx0XHRcdFx0XCJbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgTmFtZWRNb2R1bGVzUGx1Z2luIGZvciBtb2R1bGUgbmFtZXMuXCJcblx0XHRcdCk7XG5cdH1cbn07XG4iLCJ2YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdFx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRcdGxvZ0ZuKG1zZyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRpZiAobGV2ZWwgPT09IFwiaW5mb1wiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwid2FybmluZ1wiKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcImVycm9yXCIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuLyogZXNsaW50LWVuYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cblxubW9kdWxlLmV4cG9ydHMuZ3JvdXAgPSBsb2dHcm91cChncm91cCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwQ29sbGFwc2VkID0gbG9nR3JvdXAoZ3JvdXBDb2xsYXBzZWQpO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cEVuZCA9IGxvZ0dyb3VwKGdyb3VwRW5kKTtcblxubW9kdWxlLmV4cG9ydHMuc2V0TG9nTGV2ZWwgPSBmdW5jdGlvbihsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0dmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcblx0dmFyIHN0YWNrID0gZXJyLnN0YWNrO1xuXHRpZiAoIXN0YWNrKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoc3RhY2suaW5kZXhPZihtZXNzYWdlKSA8IDApIHtcblx0XHRyZXR1cm4gbWVzc2FnZSArIFwiXFxuXCIgKyBzdGFjaztcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gc3RhY2s7XG5cdH1cbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICtfX3Jlc291cmNlUXVlcnkuc3Vic3RyKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcblxuaW1wb3J0IEFwcFV0aWxzIGZyb20gJ3V0aWxsaXR5J1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IG1pZGRsZXdhZXMgZnJvbSAnbWlkZGxld2FyZXMnXG5cbmNsYXNzIEFwcCB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cdHB1YmxpYyBhcHBVdGlsczogQXBwVXRpbHNcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLmFwcCA9IGV4cHJlc3MoKVxuXG5cdFx0dGhpcy5hcHBVdGlscyA9IG5ldyBBcHBVdGlscyh0aGlzLmFwcClcblx0XHR0aGlzLmFwcGx5U2VydmVyKClcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgYm9vdHN0cmFwKCk6IEFwcCB7XG5cdFx0cmV0dXJuIG5ldyBBcHAoKVxuXHR9XG5cblx0cHJpdmF0ZSBhcHBseVNlcnZlciA9IGFzeW5jICgpID0+IHtcblx0XHRhd2FpdCB0aGlzLmFwcFV0aWxzLmFwcGx5VXRpbHMoKVxuXHRcdGF3YWl0IHRoaXMuYXBwbHlNaWRkbGV3YXJlKClcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlNaWRkbGV3YXJlID0gYXN5bmMgKCkgPT4ge1xuXHRcdG1pZGRsZXdhZXModGhpcy5hcHApXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwcGxpY2F0aW9uID0gbmV3IEFwcCgpXG5leHBvcnQgZGVmYXVsdCBhcHBsaWNhdGlvbi5hcHBcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIENvbXBhbnkgaW1wbGVtZW50cyBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGNyZWF0ZWRCeTogSURcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRfeWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZVxcbiAgbGFzdEFjdGl2ZTogVGltZXN0YW1wXFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbmlucHV0IENvbXBhbnlJbnB1dCB7XFxuICBjcmVhdGVkQnk6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgZGVzY3JpcHRpb246IFN0cmluZyFcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRZZWFyOiBTdHJpbmdcXG4gIG5vT2ZFbXBsb3llZXM6IFJhbmdlSW5wdXRcXG4gIGhpcmluZ1N0YXR1czogQm9vbGVhblxcbiAgc2tpbGxzOiBbU3RyaW5nXVxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIEN1cnJlbnRTdGF0dXMge1xcbiAgQUNUSVZFXFxuICBIT0xEXFxuICBFWFBJUkVEXFxufVxcblxcbmVudW0gSm9iVHlwZSB7XFxuICBERUZBVUxUXFxuICBGRUFUVVJFRFxcbiAgUFJFTUlVTVxcbn1cXG5cXG50eXBlIFNhbGxhcnkge1xcbiAgdmFsdWU6IEZsb2F0IVxcbiAgY3VycmVuY3k6IFN0cmluZyFcXG59XFxuXFxudHlwZSBKb2IgaW1wbGVtZW50cyBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmchXFxuICB0eXBlOiBKb2JUeXBlIVxcbiAgY2F0ZWdvcnk6IFtTdHJpbmchXSFcXG4gIGRlc2M6IFN0cmluZyFcXG4gIHNraWxsc1JlcXVpcmVkOiBbU3RyaW5nIV0hXFxuICBzYWxsYXJ5OiBSYW5nZVxcbiAgbG9jYXRpb246IFN0cmluZyFcXG4gIGF0dGFjaG1lbnQ6IFtBdHRhY2htZW50XVxcbiAgc3RhdHVzOiBDdXJyZW50U3RhdHVzXFxuICB2aWV3czogSW50XFxuICB1c2Vyc0FwcGxpZWQ6IFtTdHJpbmchXVxcbiAgY3JlYXRlZEJ5OiBTdHJpbmdcXG4gIGNvbXBhbnk6IFN0cmluZyFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnR5cGUgSm9iUmVzdWx0Q3Vyc29yIHtcXG4gIGVkZ2VzOiBFZGdlIVxcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxcbiAgdG90YWxDb3VudDogSW50IVxcbn1cXG5cXG5pbnB1dCBTYWxsYXJ5SW5wdXQge1xcbiAgdmFsdWU6IEZsb2F0IVxcbiAgY3VycmVuY3k6IFN0cmluZyFcXG59XFxuXFxuaW5wdXQgQ3JlYXRlSm9iSW5wdXQge1xcbiAgbmFtZTogU3RyaW5nIVxcbiAgdHlwZTogSm9iVHlwZSFcXG4gIGNhdGVnb3J5OiBbU3RyaW5nIV0hXFxuICBkZXNjOiBTdHJpbmchXFxuICBza2lsbHNfcmVxdWlyZWQ6IFtTdHJpbmchXSFcXG4gIHNhbGxhcnk6IFJhbmdlSW5wdXQhXFxuICBzYWxsYXJ5X21heDogU2FsbGFyeUlucHV0IVxcbiAgYXR0YWNobWVudDogW0F0dGFjaG1lbnRJbnB1dF1cXG4gIGxvY2F0aW9uOiBTdHJpbmchXFxuICBzdGF0dXM6IEN1cnJlbnRTdGF0dXMhXFxuICBjb21wYW55OiBTdHJpbmchXFxufVxcblwiIiwiaW1wb3J0ICogYXMgZ3JwYyBmcm9tICdncnBjJ1xuXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZUNsaWVudCB9IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlJ1xuXG5jb25zdCB7IEFDQ09VTlRfU0VSVklDRV9VUkkgPSAnbG9jYWxob3N0OjMwMDAnIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgcHJvZmlsZUNsaWVudCA9IG5ldyBQcm9maWxlU2VydmljZUNsaWVudChBQ0NPVU5UX1NFUlZJQ0VfVVJJLCBncnBjLmNyZWRlbnRpYWxzLmNyZWF0ZUluc2VjdXJlKCkpXG5cbmV4cG9ydCBkZWZhdWx0IHByb2ZpbGVDbGllbnRcbiIsImltcG9ydCB7IERlZmF1bHRSZXNwb25zZSwgRW1haWwsIElkLCBJZGVudGlmaWVyIH0gZnJvbSAnQG9vam9iL29vam9iLXByb3RvYnVmJ1xuaW1wb3J0IHtcblx0RGVmYXVsdFJlc3BvbnNlIGFzIERlZmF1bHRSZXNwb25zZVNjaGVtYSxcblx0SWQgYXMgSWRTY2hlbWEsXG5cdE11dGF0aW9uUmVzb2x2ZXJzLFxuXHRRdWVyeVJlc29sdmVyc1xufSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcbmltcG9ydCB7XG5cdFByb2ZpbGUsXG5cdFByb2ZpbGVTZWN1cml0eSxcblx0VmFsaWRhdGVFbWFpbFJlcXVlc3QsXG5cdFZhbGlkYXRlVXNlcm5hbWVSZXF1ZXN0XG59IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGInXG5pbXBvcnQgeyBjcmVhdGVQcm9maWxlLCB2YWxpZGF0ZUVtYWlsLCB2YWxpZGF0ZVVzZXJuYW1lIH0gZnJvbSAnY2xpZW50L3Byb2ZpbGUvdHJhbnNmb3JtZXInXG5cbmV4cG9ydCBjb25zdCBRdWVyeTogUXVlcnlSZXNvbHZlcnMgPSB7XG5cdFZhbGlkYXRlVXNlcm5hbWU6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdHJhY2VyIH0pID0+IHtcblx0XHRjb25zdCBzcGFuID0gdHJhY2VyLnN0YXJ0U3BhbignY2xpZW50OnNlcnZpY2UtcHJvZmlsZTp2YWxpZGF0ZS11c2VybmFtZScpXG5cblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0Ly8gdHJhY2VyLndpdGhTcGFuQXN5bmMoc3BhbiwgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHVzZXJuYW1lID0gaW5wdXQudXNlcm5hbWVcblx0XHRjb25zdCB2YWxpZGF0ZVVzZXJuYW1lUmVxID0gbmV3IFZhbGlkYXRlVXNlcm5hbWVSZXF1ZXN0KClcblx0XHRpZiAodXNlcm5hbWUpIHtcblx0XHRcdHZhbGlkYXRlVXNlcm5hbWVSZXEuc2V0VXNlcm5hbWUodXNlcm5hbWUpXG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHZhbGlkYXRlUmVzID0gKGF3YWl0IHZhbGlkYXRlVXNlcm5hbWUodmFsaWRhdGVVc2VybmFtZVJlcSkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IHZhbGlkYXRlUmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gdmFsaWRhdGVSZXMuZ2V0RXJyb3IoKVxuXHRcdFx0c3Bhbi5lbmQoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdFx0c3Bhbi5lbmQoKVxuXHRcdH1cblx0XHQvLyB9KVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRWYWxpZGF0ZUVtYWlsOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgZW1haWwgPSBpbnB1dC5lbWFpbFxuXHRcdGNvbnN0IHZhbGlkYXRlRW1haWxSZXEgPSBuZXcgVmFsaWRhdGVFbWFpbFJlcXVlc3QoKVxuXHRcdGlmIChlbWFpbCkge1xuXHRcdFx0dmFsaWRhdGVFbWFpbFJlcS5zZXRFbWFpbChlbWFpbClcblx0XHR9XG5cblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHZhbGlkYXRlUmVzID0gKGF3YWl0IHZhbGlkYXRlRW1haWwodmFsaWRhdGVFbWFpbFJlcSkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IHZhbGlkYXRlUmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gdmFsaWRhdGVSZXMuZ2V0RXJyb3IoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fVxufVxuXG5leHBvcnQgY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRDcmVhdGVQcm9maWxlOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgbWlkZGxlTmFtZSA9IGlucHV0Lm1pZGRsZU5hbWUgPyBgICR7aW5wdXQubWlkZGxlTmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgZmFtaWx5TmFtZSA9IGlucHV0LmZhbWlseU5hbWUgPyBgICR7aW5wdXQuZmFtaWx5TmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgbmFtZSA9IGAke2lucHV0LmdpdmVuTmFtZX0ke21pZGRsZU5hbWV9JHtmYW1pbHlOYW1lfWBcblx0XHRjb25zdCBpZGVudGlmaWVyID0gbmV3IElkZW50aWZpZXIoKVxuXHRcdGlkZW50aWZpZXIuc2V0TmFtZShuYW1lLnRyaW0oKSlcblx0XHRjb25zdCBwcm9maWxlU2VjdXJpdHkgPSBuZXcgUHJvZmlsZVNlY3VyaXR5KClcblx0XHRpZiAoaW5wdXQuc2VjdXJpdHk/LnBhc3N3b3JkKSB7XG5cdFx0XHRwcm9maWxlU2VjdXJpdHkuc2V0UGFzc3dvcmQoaW5wdXQuc2VjdXJpdHkucGFzc3dvcmQpXG5cdFx0fVxuXHRcdGNvbnN0IGVtYWlsID0gbmV3IEVtYWlsKClcblx0XHRpZiAoaW5wdXQuZW1haWw/LmVtYWlsKSB7XG5cdFx0XHRlbWFpbC5zZXRFbWFpbChpbnB1dC5lbWFpbC5lbWFpbClcblx0XHR9XG5cdFx0aWYgKGlucHV0LmVtYWlsPy5zaG93KSB7XG5cdFx0XHRlbWFpbC5zZXRTaG93KGlucHV0LmVtYWlsLnNob3cpXG5cdFx0fVxuXHRcdGNvbnN0IHByb2ZpbGUgPSBuZXcgUHJvZmlsZSgpXG5cdFx0aWYgKGlucHV0Py5nZW5kZXIpIHtcblx0XHRcdHByb2ZpbGUuc2V0R2VuZGVyKGlucHV0LmdlbmRlcilcblx0XHR9XG5cdFx0aWYgKGlucHV0Py51c2VybmFtZSkge1xuXHRcdFx0cHJvZmlsZS5zZXRVc2VybmFtZShpbnB1dC51c2VybmFtZSlcblx0XHR9XG5cdFx0cHJvZmlsZS5zZXRFbWFpbChlbWFpbClcblx0XHRwcm9maWxlLnNldElkZW50aXR5KGlkZW50aWZpZXIpXG5cdFx0cHJvZmlsZS5zZXRTZWN1cml0eShwcm9maWxlU2VjdXJpdHkpXG5cdFx0Y29uc3QgcmVzID0gKGF3YWl0IGNyZWF0ZVByb2ZpbGUocHJvZmlsZSkpIGFzIElkXG5cblx0XHRjb25zdCBwcm9maWxlUmVzcG9uc2U6IElkU2NoZW1hID0ge1xuXHRcdFx0aWQ6IHJlcy5nZXRJZCgpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb2ZpbGVSZXNwb25zZVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBwcm9maWxlUmVzb2x2ZXJzID0ge1xuXHRNdXRhdGlvbixcblx0UXVlcnlcbn1cbmV4cG9ydCBkZWZhdWx0IHByb2ZpbGVSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIEFjY291bnRUeXBlIHtcXG4gIEJBU0VcXG4gIENPTVBBTllcXG4gIEZVTkRJTkdcXG4gIEpPQlxcbn1cXG5cXG5lbnVtIEdlbmRlciB7XFxuICBNQUxFXFxuICBGRU1BTEVcXG4gIE9USEVSXFxufVxcblxcbmVudW0gUHJvZmlsZU9wZXJhdGlvbnMge1xcbiAgQ1JFQVRFXFxuICBSRUFEXFxuICBVUERBVEVcXG4gIERFTEVURVxcbiAgQlVMS19VUERBVEVcXG59XFxuXFxuZW51bSBPcGVyYXRpb25FbnRpdHkge1xcbiAgQ09NUEFOWVxcbiAgSk9CXFxuICBJTlZFU1RPUlxcbn1cXG5cXG50eXBlIEVkdWNhdGlvbiB7XFxuICBlZHVjYXRpb246IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG50eXBlIFByb2ZpbGVTZWN1cml0eSB7XFxuICBwYXNzd29yZDogU3RyaW5nXFxuICBwYXNzd29yZFNhbHQ6IFN0cmluZ1xcbiAgcGFzc3dvcmRIYXNoOiBTdHJpbmdcXG4gIGNvZGU6IFN0cmluZ1xcbiAgY29kZVR5cGU6IFN0cmluZ1xcbiAgYWNjb3VudFR5cGU6IEFjY291bnRUeXBlXFxuICB2ZXJpZmllZDogQm9vbGVhblxcbn1cXG5cXG50eXBlIFByb2ZpbGUge1xcbiAgaWRlbnRpdHk6IElkZW50aWZpZXJcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsXFxuICBnZW5kZXI6IEdlbmRlclxcbiAgYmlydGhkYXRlOiBUaW1lc3RhbXBcXG4gIGN1cnJlbnRQb3NpdGlvbjogU3RyaW5nXFxuICBlZHVjYXRpb246IEVkdWNhdGlvblxcbiAgYWRkcmVzczogQWRkcmVzc1xcbiAgc2VjdXJpdHk6IFByb2ZpbGVTZWN1cml0eVxcbiAgbWV0YWRhdGE6IE1ldGFkYXRhXFxufVxcblxcbmlucHV0IEVkdWNhdGlvbklucHV0IHtcXG4gIGVkdWNhdGlvbjogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbmlucHV0IFByb2ZpbGVTZWN1cml0eUlucHV0IHtcXG4gIHBhc3N3b3JkOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbn1cXG5cXG5pbnB1dCBQcm9maWxlSW5wdXQge1xcbiAgaWRlbnRpdHk6IElkZW50aWZpZXJJbnB1dFxcbiAgZ2l2ZW5OYW1lOiBTdHJpbmdcXG4gIG1pZGRsZU5hbWU6IFN0cmluZ1xcbiAgZmFtaWx5TmFtZTogU3RyaW5nXFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBlbWFpbDogRW1haWxJbnB1dFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wSW5wdXRcXG4gIGN1cnJlbnRQb3NpdGlvbjogU3RyaW5nXFxuICBlZHVjYXRpb246IEVkdWNhdGlvbklucHV0XFxuICBhZGRyZXNzOiBBZGRyZXNzSW5wdXRcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlJbnB1dFxcbn1cXG5cXG5pbnB1dCBWYWxpZGF0ZVVzZXJuYW1lSW5wdXQge1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBWYWxpZGF0ZUVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbn1cXG5cXG5leHRlbmQgdHlwZSBRdWVyeSB7XFxuICBWYWxpZGF0ZVVzZXJuYW1lKGlucHV0OiBWYWxpZGF0ZVVzZXJuYW1lSW5wdXQhKTogRGVmYXVsdFJlc3BvbnNlIVxcbiAgVmFsaWRhdGVFbWFpbChpbnB1dDogVmFsaWRhdGVFbWFpbElucHV0ISk6IERlZmF1bHRSZXNwb25zZSFcXG59XFxuXFxuZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xcbiAgQ3JlYXRlUHJvZmlsZShpbnB1dDogUHJvZmlsZUlucHV0ISk6IElkIVxcbn1cXG5cIiIsImltcG9ydCBwcm9maWxlQ2xpZW50IGZyb20gJ2NsaWVudC9wcm9maWxlJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jcmVhdGVQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgY29uZmlybVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jb25maXJtUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlYWRQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQucmVhZFByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB1cGRhdGVQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudXBkYXRlUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcm5hbWUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52YWxpZGF0ZVVzZXJuYW1lKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmFsaWRhdGVFbWFpbCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZhbGlkYXRlRW1haWwpLmJpbmQocHJvZmlsZUNsaWVudClcbi8vIGV4cG9ydCBjb25zdCBjaGVjayA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmNoZWNrKS5iaW5kKHByb2ZpbGVDbGllbnQpXG4vLyBleHBvcnQgY29uc3Qgd2F0Y2ggPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC53YXRjaCkuYmluZChwcm9maWxlQ2xpZW50KVxuIiwiaW1wb3J0IHsgTXV0YXRpb25SZXNvbHZlcnMsIFF1ZXJ5UmVzb2x2ZXJzLCBSZXNvbHZlcnMsIFN1YnNjcmlwdGlvblJlc29sdmVycyB9IGZyb20gJ2dlbmVyYXRlZC9ncmFwaHFsJ1xuXG5jb25zdCBRdWVyeTogUXVlcnlSZXNvbHZlcnMgPSB7XG5cdGR1bW15OiAoKSA9PiAnZG9kbyBkdWNrIGxpdmVzIGhlcmUnXG59XG5jb25zdCBNdXRhdGlvbjogTXV0YXRpb25SZXNvbHZlcnMgPSB7XG5cdGR1bW15OiAoKSA9PiAnRG9kbyBEdWNrJ1xufVxuY29uc3QgU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25SZXNvbHZlcnMgPSB7XG5cdGR1bW15OiAoXywgX18sIHsgcHVic3ViIH0pID0+IHB1YnN1Yi5hc3luY0l0ZXJhdG9yKCdET0RPX0RVQ0snKVxufVxuXG5jb25zdCByb290UmVzb2x2ZXJzOiBSZXNvbHZlcnMgPSB7XG5cdFF1ZXJ5LFxuXHRNdXRhdGlvbixcblx0U3Vic2NyaXB0aW9uLFxuXHRSZXN1bHQ6IHtcblx0XHRfX3Jlc29sdmVUeXBlOiAobm9kZTogYW55KSA9PiB7XG5cdFx0XHRpZiAobm9kZS5ub09mRW1wbG95ZWVzKSByZXR1cm4gJ0NvbXBhbnknXG5cblx0XHRcdHJldHVybiAnSm9iJ1xuXHRcdH1cblx0fSxcblx0SU5vZGU6IHtcblx0XHRfX3Jlc29sdmVUeXBlOiAobm9kZTogYW55KSA9PiB7XG5cdFx0XHRpZiAobm9kZS5ub09mRW1wbG95ZWVzKSByZXR1cm4gJ0NvbXBhbnknXG5cdFx0XHQvLyBpZiAobm9kZS5zdGFycykgcmV0dXJuICdSZXZpZXcnXG5cblx0XHRcdHJldHVybiAnQ29tcGFueSdcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcm9vdFJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgQXBwbGljYW50IHtcXG4gIGFwcGxpY2F0aW9uczogW1N0cmluZ10hXFxuICBzaG9ydGxpc3RlZDogW1N0cmluZ10hXFxuICBvbmhvbGQ6IFtTdHJpbmddIVxcbiAgcmVqZWN0ZWQ6IFtTdHJpbmddIVxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIFNvcnQge1xcbiAgQVNDXFxuICBERVNDXFxufVxcblxcbnR5cGUgUGFnaW5hdGlvbiB7XFxuICBwYWdlOiBJbnRcXG4gIGZpcnN0OiBJbnRcXG4gIGFmdGVyOiBTdHJpbmdcXG4gIG9mZnNldDogSW50XFxuICBsaW1pdDogSW50XFxuICBzb3J0OiBTb3J0XFxuICBwcmV2aW91czogU3RyaW5nXFxuICBuZXh0OiBTdHJpbmdcXG4gIGlkZW50aWZpZXI6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBQYWdpbmF0aW9uSW5wdXQge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgTWV0YWRhdGEge1xcbiAgY3JlYXRlZF9hdDogVGltZXN0YW1wXFxuICB1cGRhdGVkX2F0OiBUaW1lc3RhbXBcXG4gIHB1Ymxpc2hlZF9kYXRlOiBUaW1lc3RhbXBcXG4gIGVuZF9kYXRlOiBUaW1lc3RhbXBcXG4gIGxhc3RfYWN0aXZlOiBUaW1lc3RhbXBcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBQcm9maWxlT3BlcmF0aW9uT3B0aW9ucyB7XFxuICBDUkVBVEVcXG4gIFJFQURcXG4gIFVQREFURVxcbiAgREVMRVRFXFxuICBCVUxLX1VQREFURVxcbn1cXG5cXG50eXBlIE1hcFByb2ZpbGVQZXJtaXNzaW9uIHtcXG4gIGtleTogU3RyaW5nXFxuICBwcm9maWxlT3BlcmF0aW9uczogW1Byb2ZpbGVPcGVyYXRpb25PcHRpb25zXVxcbn1cXG5cXG50eXBlIFBlcm1pc3Npb25zQmFzZSB7XFxuICBwZXJtaXNzaW9uczogTWFwUHJvZmlsZVBlcm1pc3Npb25cXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBSYXRpbmcge1xcbiAgYXV0aG9yOiBTdHJpbmdcXG4gIGJlc3RSYXRpbmc6IEludFxcbiAgZXhwbGFuYXRpb246IFN0cmluZ1xcbiAgdmFsdWU6IEludFxcbiAgd29yc3RSYXRpbmc6IEludFxcbn1cXG5cXG50eXBlIEFnZ3JlZ2F0ZVJhdGluZyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZyFcXG4gIHJhdGluZ0NvdW50OiBJbnQhXFxuICByZXZpZXdDb3VudDogSW50XFxufVxcblxcbnR5cGUgUmV2aWV3IHtcXG4gIGl0ZW1SZXZpZXdlZDogU3RyaW5nXFxuICBhc3BlY3Q6IFN0cmluZ1xcbiAgYm9keTogU3RyaW5nXFxuICByYXRpbmc6IFN0cmluZ1xcbn1cXG5cXG50eXBlIEdlb0xvY2F0aW9uIHtcXG4gIGVsZXZhdGlvbjogSW50XFxuICBsYXRpdHVkZTogSW50XFxuICBsb25naXR1ZGU6IEludFxcbiAgcG9zdGFsQ29kZTogSW50XFxufVxcblxcbnR5cGUgQWRkcmVzcyB7XFxuICBjb3VudHJ5OiBTdHJpbmchXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFBsYWNlIHtcXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHJldmlldzogUmV2aWV3XFxuICBhZ2dyZWdhdGVSYXRpbmc6IEFnZ3JlZ2F0ZVJhdGluZ1xcbiAgYnJhbmNoQ29kZTogU3RyaW5nXFxuICBnZW86IEdlb0xvY2F0aW9uXFxufVxcblxcbmlucHV0IEFkZHJlc3NJbnB1dCB7XFxuICBjb3VudHJ5OiBTdHJpbmdcXG4gIGxvY2FsaXR5OiBTdHJpbmdcXG4gIHJlZ2lvbjogU3RyaW5nXFxuICBwb3N0YWxDb2RlOiBJbnRcXG4gIHN0cmVldDogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgUmFuZ2Uge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxudHlwZSBEZWZhdWx0UmVzcG9uc2Uge1xcbiAgc3RhdHVzOiBCb29sZWFuXFxuICBlcnJvcjogU3RyaW5nXFxuICBjb2RlOiBJbnRcXG59XFxuXFxudHlwZSBJZCB7XFxuICBpZDogSUQhXFxufVxcblxcbmVudW0gRW1haWxTdGF0dXMge1xcbiAgV0FJVElOR1xcbiAgQ09ORklSTUVEXFxuICBCTE9DS0VEXFxuICBFWFBJUkVEXFxufVxcblxcbnR5cGUgRW1haWwge1xcbiAgZW1haWw6IFN0cmluZ1xcbiAgc3RhdHVzOiBFbWFpbFN0YXR1c1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG50eXBlIEF0dGFjaG1lbnQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG4gIHVwbG9hZERhdGU6IFRpbWVzdGFtcFxcbiAgdXJsOiBTdHJpbmdcXG4gIHVzZXI6IFN0cmluZ1xcbiAgZm9sZGVyOiBTdHJpbmdcXG59XFxuXFxudHlwZSBJZGVudGlmaWVyIHtcXG4gIGlkZW50aWZpZXI6IFN0cmluZyFcXG4gIG5hbWU6IFN0cmluZ1xcbiAgYWx0ZXJuYXRlTmFtZTogU3RyaW5nXFxuICB0eXBlOiBTdHJpbmdcXG4gIGFkZGl0aW9uYWxUeXBlOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGRpc2FtYmlndWF0aW5nRGVzY3JpcHRpb246IFN0cmluZ1xcbiAgaGVhZGxpbmU6IFN0cmluZ1xcbiAgc2xvZ2FuOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUmFuZ2VJbnB1dCB7XFxuICBtaW46IEludCFcXG4gIG1heDogSW50IVxcbn1cXG5cXG5pbnB1dCBJZElucHV0IHtcXG4gIGlkOiBJRCFcXG59XFxuXFxuaW5wdXQgRW1haWxJbnB1dCB7XFxuICBlbWFpbDogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbmlucHV0IEF0dGFjaG1lbnRJbnB1dCB7XFxuICB0eXBlOiBTdHJpbmdcXG4gIGZpbGU6IFN0cmluZ1xcbiAgdXNlcjogU3RyaW5nXFxuICBmb2xkZXI6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBJZGVudGlmaWVySW5wdXQge1xcbiAgbmFtZTogU3RyaW5nXFxuICBhbHRlcm5hdGVOYW1lOiBTdHJpbmdcXG4gIHR5cGU6IFN0cmluZ1xcbiAgYWRkaXRpb25hbFR5cGU6IFN0cmluZ1xcbiAgZGVzY3JpcHRpb246IFN0cmluZ1xcbiAgZGlzYW1iaWd1YXRpbmdEZXNjcmlwdGlvbjogU3RyaW5nXFxuICBoZWFkbGluZTogU3RyaW5nXFxuICBzbG9nYW46IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIERheXNPZldlZWsge1xcbiAgTU9OREFZXFxuICBUVUVTREFZXFxuICBXRURORVNEQVlcXG4gIFRIUlVTREFZXFxuICBGUklEQVlcXG4gIFNUQVVSREFZXFxuICBTVU5EQVlcXG59XFxuXFxudHlwZSBUaW1lc3RhbXAge1xcbiAgc2Vjb25kczogU3RyaW5nXFxuICBuYW5vczogU3RyaW5nXFxufVxcblxcbnR5cGUgVGltZSB7XFxuICBvcGVuczogVGltZXN0YW1wXFxuICBjbG9zZXM6IFRpbWVzdGFtcFxcbiAgZGF5c09mV2VlazogRGF5c09mV2Vla1xcbiAgdmFsaWRGcm9tOiBUaW1lc3RhbXBcXG4gIHZhbGlkVGhyb3VnaDogVGltZXN0YW1wXFxufVxcblxcbmlucHV0IFRpbWVzdGFtcElucHV0IHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJzY2FsYXIgRGF0ZVxcblxcbnR5cGUgRWRnZSB7XFxuICBjdXJzb3I6IFN0cmluZyFcXG4gIG5vZGU6IFtSZXN1bHQhXSFcXG59XFxuXFxudHlwZSBQYWdlSW5mbyB7XFxuICBlbmRDdXJzb3I6IFN0cmluZyFcXG4gIGhhc05leHRQYWdlOiBCb29sZWFuIVxcbn1cXG5cXG5pbnRlcmZhY2UgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgY3JlYXRlZEF0OiBUaW1lc3RhbXAhXFxuICB1cGRhdGVkQXQ6IFRpbWVzdGFtcCFcXG59XFxuXFxudW5pb24gUmVzdWx0ID0gSm9iIHwgQ29tcGFueVxcblxcbnR5cGUgUXVlcnkge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBNdXRhdGlvbiB7XFxuICBkdW1teTogU3RyaW5nIVxcbn1cXG5cXG50eXBlIFN1YnNjcmlwdGlvbiB7XFxuICBkdW1teTogU3RyaW5nIVxcbn1cXG5cXG5zY2hlbWEge1xcbiAgcXVlcnk6IFF1ZXJ5XFxuICBtdXRhdGlvbjogTXV0YXRpb25cXG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uXFxufVxcblwiIiwiaW1wb3J0ICogYXMgYXBwbGljYW50c1NjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvYXBwbGljYW50cy5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY29tcGFueVNjaGVtYSBmcm9tICdjbGllbnQvY29tcGFueS9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBjdXJzb3JTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgam9iU2NoZW1hIGZyb20gJ2NsaWVudC9qb2Ivc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgbWV0YWRhdGFTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL21ldGFkYXRhLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwZXJtaXNzaW9uc1NjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvcGVybWlzc2lvbnMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHBsYWNlU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcHJvZmlsZVNjaGVtYSBmcm9tICdjbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyByb290U2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHN5c3RlbVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwnXG5pbXBvcnQgKiBhcyB0aW1lU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwnXG5cbmltcG9ydCB7IEFwb2xsb1NlcnZlciwgUHViU3ViIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJ1xuXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBfdHJhY2VyIGZyb20gJ3RyYWNlcidcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHByb2ZpbGVSZXNvbHZlcnMgZnJvbSAnY2xpZW50L3Byb2ZpbGUvcmVzb2x2ZXInXG5pbXBvcnQgcm9vdFJlc29sdmVycyBmcm9tICdjbGllbnQvcm9vdC9yZXNvbHZlcidcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gW1xuXHRyb290U2NoZW1hLFxuXHRhcHBsaWNhbnRzU2NoZW1hLFxuXHRjdXJzb3JTY2hlbWEsXG5cdG1ldGFkYXRhU2NoZW1hLFxuXHRwbGFjZVNjaGVtYSxcblx0c3lzdGVtU2NoZW1hLFxuXHRwZXJtaXNzaW9uc1NjaGVtYSxcblx0dGltZVNjaGVtYSxcblx0cHJvZmlsZVNjaGVtYSxcblx0Y29tcGFueVNjaGVtYSxcblx0am9iU2NoZW1hXG5dXG5leHBvcnQgY29uc3QgcmVzb2x2ZXJzID0gbWVyZ2Uoe30sIHJvb3RSZXNvbHZlcnMsIHByb2ZpbGVSZXNvbHZlcnMpXG5jb25zdCB0cmFjZXIgPSBfdHJhY2VyKCdzZXJ2aWNlOmdhdGV3YXknKVxuZXhwb3J0IGludGVyZmFjZSBPb0pvYkNvbnRleHQge1xuXHRyZXE6IFJlcXVlc3Rcblx0cHVic3ViOiBQdWJTdWJcblx0dHJhY2VyOiB0eXBlb2YgdHJhY2VyXG59XG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcblx0dHlwZURlZnMsXG5cdHJlc29sdmVycyxcblx0Y29udGV4dDogYXN5bmMgKHsgcmVxLCBjb25uZWN0aW9uIH0pID0+ICh7XG5cdFx0cmVxLFxuXHRcdGNvbm5lY3Rpb24sXG5cdFx0cHVic3ViLFxuXHRcdHRyYWNlclxuXHR9KSxcblx0dHJhY2luZzogdHJ1ZVxufSlcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyXG4iLCJpbXBvcnQgJ2RvdGVudi9jb25maWcnXG5cbmltcG9ydCB7IGFwcCwgc2VydmVyLCBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIgfSBmcm9tICdvb2pvYi5zZXJ2ZXInXG5pbXBvcnQgeyBmb3JrLCBpc01hc3Rlciwgb24gfSBmcm9tICdjbHVzdGVyJ1xuXG5kZWNsYXJlIGNvbnN0IG1vZHVsZTogYW55XG5cbmNvbnN0IHN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuXHRjb25zdCB7IFBPUlQgfSA9IHByb2Nlc3MuZW52XG5cdGNvbnN0IHBvcnQgPSBQT1JUIHx8ICc4MDgwJ1xuXG5cdHRyeSB7XG5cdFx0YXdhaXQgc3RvcFNlcnZlcigpXG5cdFx0YXdhaXQgc3RhcnRTeW5jU2VydmVyKHBvcnQpXG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignU2VydmVyIEZhaWxlZCB0byBzdGFydCcpXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcilcblx0XHRwcm9jZXNzLmV4aXQoMSlcblx0fVxufVxuXG5pZiAoaXNNYXN0ZXIpIHtcblx0Y29uc3QgbnVtQ1BVcyA9IHJlcXVpcmUoJ29zJykuY3B1cygpLmxlbmd0aFxuXG5cdGNvbnNvbGUubG9nKGBNYXN0ZXIgJHtwcm9jZXNzLnBpZH0gaXMgcnVubmluZ2ApXG5cblx0Ly8gRm9yayB3b3JrZXJzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bUNQVXM7IGkrKykge1xuXHRcdGZvcmsoKVxuXHR9XG5cblx0b24oJ2ZvcmsnLCAod29ya2VyKSA9PiB7XG5cdFx0Y29uc29sZS5sb2coJ3dvcmtlciBpcyBkZWFkOicsIHdvcmtlci5pc0RlYWQoKSlcblx0fSlcblxuXHRvbignZXhpdCcsICh3b3JrZXIpID0+IHtcblx0XHRjb25zb2xlLmxvZygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxufSBlbHNlIHtcblx0LyoqXG5cdCAqIFtpZiBIb3QgTW9kdWxlIGZvciB3ZWJwYWNrXVxuXHQgKiBAcGFyYW0gIHtbdHlwZV19IG1vZHVsZSBbZ2xvYmFsIG1vZHVsZSBub2RlIG9iamVjdF1cblx0ICovXG5cdGxldCBjdXJyZW50QXBwID0gYXBwXG5cdGlmIChtb2R1bGUuaG90KSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoJ2FwcC5zZXJ2ZXInLCAoKSA9PiB7XG5cdFx0XHRzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3JlcXVlc3QnLCBjdXJyZW50QXBwKVxuXHRcdFx0c2VydmVyLm9uKCdyZXF1ZXN0JywgYXBwKVxuXHRcdFx0Y3VycmVudEFwcCA9IGFwcFxuXHRcdH0pXG5cblx0XHQvKipcblx0XHQgKiBOZXh0IGNhbGxiYWNrIGlzIGVzc2VudGlhbDpcblx0XHQgKiBBZnRlciBjb2RlIGNoYW5nZXMgd2VyZSBhY2NlcHRlZCB3ZSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcC5cblx0XHQgKiBzZXJ2ZXIuY2xvc2UoKSBpcyBoZXJlIEV4cHJlc3MuSlMtc3BlY2lmaWMgYW5kIGNhbiBkaWZmZXIgaW4gb3RoZXIgZnJhbWV3b3Jrcy5cblx0XHQgKiBUaGUgaWRlYSBpcyB0aGF0IHlvdSBzaG91bGQgc2h1dCBkb3duIHlvdXIgYXBwIGhlcmUuXG5cdFx0ICogRGF0YS9zdGF0ZSBzYXZpbmcgYmV0d2VlbiBzaHV0ZG93biBhbmQgbmV3IHN0YXJ0IGlzIHBvc3NpYmxlXG5cdFx0ICovXG5cdFx0bW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHNlcnZlci5jbG9zZSgpKVxuXHR9XG5cblx0Ly8gV29ya2VycyBjYW4gc2hhcmUgYW55IFRDUCBjb25uZWN0aW9uXG5cdC8vIEluIHRoaXMgY2FzZSBpdCBpcyBhbiBIVFRQIHNlcnZlclxuXHRzdGFydCgpXG5cblx0Y29uc29sZS5sb2coYFdvcmtlciAke3Byb2Nlc3MucGlkfSBzdGFydGVkYClcbn1cbiIsImltcG9ydCAqIGFzIGNvcnNMaWJyYXJ5IGZyb20gJ2NvcnMnXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBOT1dfVVJMID0gJ2h0dHBzOi8vb29qb2IuaW8nLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHByb2RVcmxzID0gWydodHRwczovL29vam9iLmlvJywgJ2h0dHBzOi8vYWxwaGEub29qb2IuaW8nLCAnaHR0cHM6Ly9iZXRhLm9vam9iLmlvJywgTk9XX1VSTF1cbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBjb3JzT3B0aW9uID0ge1xuXHRvcmlnaW46IGlzUHJvZHVjdGlvbiA/IHByb2RVcmxzLmZpbHRlcihCb29sZWFuKSA6IFsvbG9jYWxob3N0L10sXG5cdG1ldGhvZHM6ICdHRVQsIEhFQUQsIFBVVCwgUEFUQ0gsIFBPU1QsIERFTEVURSwgT1BUSU9OJyxcblx0Y3JlZGVudGlhbHM6IHRydWUsXG5cdGV4cG9zZWRIZWFkZXJzOiBbJ2F1dGhvcml6YXRpb24nXVxufVxuXG5jb25zdCBjb3JzID0gKCkgPT4gY29yc0xpYnJhcnkoY29yc09wdGlvbilcbmV4cG9ydCBkZWZhdWx0IGNvcnNcbiIsImltcG9ydCAqIGFzIGhvc3RWYWxpZGF0aW9uIGZyb20gJ2hvc3QtdmFsaWRhdGlvbidcblxuLy8gTk9URShAbXhzdGJyKTpcbi8vIC0gSG9zdCBoZWFkZXIgb25seSBjb250YWlucyB0aGUgZG9tYWluLCBzbyBzb21ldGhpbmcgbGlrZSAnYnVpbGQtYXBpLWFzZGYxMjMubm93LnNoJyBvciAnb29qb2IuaW8nXG4vLyAtIFJlZmVyZXIgaGVhZGVyIGNvbnRhaW5zIHRoZSBlbnRpcmUgVVJMLCBzbyBzb21ldGhpbmcgbGlrZVxuLy8gJ2h0dHBzOi8vYnVpbGQtYXBpLWFzZGYxMjMubm93LnNoL2ZvcndhcmQnIG9yICdodHRwczovL29vam9iLmlvL2ZvcndhcmQnXG4vLyBUaGF0IG1lYW5zIHdlIGhhdmUgdG8gY2hlY2sgdGhlIEhvc3Qgc2xpZ2h0bHkgZGlmZmVyZW50bHkgZnJvbSB0aGUgUmVmZXJlciB0byBhdm9pZCB0aGluZ3Ncbi8vIGxpa2UgJ215LWRvbWFpbi1vb2pvYi5pbycgdG8gYmUgYWJsZSB0byBoYWNrIG91ciB1c2Vyc1xuXG4vLyBIb3N0cywgd2l0aG91dCBodHRwKHMpOi8vIGFuZCBwYXRoc1xuY29uc3QgeyBOT1dfVVJMID0gJ2h0dHA6Ly9vb2pvYi5pbycgfSA9IHByb2Nlc3MuZW52XG5jb25zdCB0cnVzdGVkSG9zdHMgPSBbXG5cdE5PV19VUkwgJiYgbmV3IFJlZ0V4cChgXiR7Tk9XX1VSTC5yZXBsYWNlKCdodHRwczovLycsICcnKX0kYCksXG5cdC9eb29qb2JcXC5pbyQvLCAvLyBUaGUgRG9tYWluXG5cdC9eLipcXC5vb2pvYlxcLmlvJC8gLy8gQWxsIHN1YmRvbWFpbnNcbl0uZmlsdGVyKEJvb2xlYW4pXG5cbi8vIFJlZmVyZXJzLCB3aXRoIGh0dHAocyk6Ly8gYW5kIHBhdGhzXG5jb25zdCB0cnVzdGVkUmVmZXJlcnMgPSBbXG5cdE5PV19VUkwgJiYgbmV3IFJlZ0V4cChgXiR7Tk9XX1VSTH0oJHxcXC8uKilgKSxcblx0L15odHRwczpcXC9cXC9vb2pvYlxcLmlvKCR8XFwvLiopLywgLy8gVGhlIERvbWFpblxuXHQvXmh0dHBzOlxcL1xcLy4qXFwuc3BlY3RydW1cXC5jaGF0KCR8XFwvLiopLyAvLyBBbGwgc3ViZG9tYWluc1xuXS5maWx0ZXIoQm9vbGVhbilcblxuY29uc3QgY3NyZiA9IGhvc3RWYWxpZGF0aW9uKHtcblx0aG9zdHM6IHRydXN0ZWRIb3N0cyxcblx0cmVmZXJlcnM6IHRydXN0ZWRSZWZlcmVycyxcblx0bW9kZTogJ2VpdGhlcidcbn0pXG5leHBvcnQgZGVmYXVsdCBjc3JmXG4iLCJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycjogRXJyb3IsIHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmIChlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKGVycilcblx0XHRyZXMuc3RhdHVzKDUwMCkuc2VuZCgnT29wcywgc29tZXRoaW5nIHdlbnQgd3JvbmchIE91ciBlbmdpbmVlcnMgaGF2ZSBiZWVuIGFsZXJ0ZWQgYW5kIHdpbGwgZml4IHRoaXMgYXNhcC4nKVxuXHRcdC8vIGNhcHR1cmUgZXJyb3Igd2l0aCBlcnJvciBtZXRyaWNzIGNvbGxlY3RvclxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBuZXh0KClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBlcnJvckhhbmRsZXJcbiIsImltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgKiBhcyBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbidcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgY29ycyBmcm9tICdtaWRkbGV3YXJlcy9jb3JzJ1xuaW1wb3J0IGNzcmYgZnJvbSAnbWlkZGxld2FyZXMvY3NyZidcbmltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnbWlkZGxld2FyZXMvZXJyb3ItaGFuZGxlcidcbmltcG9ydCBsb2dnZXIgZnJvbSAnbWlkZGxld2FyZXMvbG9nZ2VyJ1xuaW1wb3J0IHNlY3VyaXR5IGZyb20gJ21pZGRsZXdhcmVzL3NlY3VyaXR5J1xuaW1wb3J0IHRvb2J1c3kgZnJvbSAnbWlkZGxld2FyZXMvdG9vYnVzeSdcbmltcG9ydCB3aW5zdG9uIGZyb20gJ21pZGRsZXdhcmVzL3dpbnN0b24nXG5cbmNvbnN0IHsgRU5BQkxFX0NTUCA9IHRydWUsIEVOQUJMRV9OT05DRSA9IHRydWUgfSA9IHByb2Nlc3MuZW52XG5cbmNvbnN0IG1pZGRsZXdhcmVzID0gKGFwcDogQXBwbGljYXRpb24pID0+IHtcblx0Ly8gQ09SUyBmb3IgY3Jvc3NzLXRlIGFjY2Vzc1xuXHRhcHAudXNlKGNvcnMoKSlcblxuXHQvLyBqc29uIGVuY29kaW5nIGFuZCBkZWNvZGluZ1xuXHRhcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSlcblx0YXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSlcblxuXHQvLyBzZXQgR1ppcCBvbiBoZWFkZXJzIGZvciByZXF1ZXN0L3Jlc3BvbnNlXG5cdGFwcC51c2UoY29tcHJlc3Npb24oKSlcblxuXHQvLyBhdHRhY2ggbG9nZ2VyIGZvciBhcHBsaWNhdGlvblxuXHRhcHAudXNlKChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRcdHJlcS5sb2dnZXIgPSB3aW5zdG9uXG5cblx0XHRyZXR1cm4gbmV4dCgpXG5cdH0pXG5cblx0YXBwLnVzZShsb2dnZXIpXG5cdGFwcC51c2UoY3NyZilcblx0YXBwLnVzZShlcnJvckhhbmRsZXIpXG5cdHNlY3VyaXR5KGFwcCwgeyBlbmFibGVDU1A6IEJvb2xlYW4oRU5BQkxFX0NTUCksIGVuYWJsZU5vbmNlOiBCb29sZWFuKEVOQUJMRV9OT05DRSkgfSlcblxuXHQvLyBidXNzeSBzZXJ2ZXIgKHdhaXQgZm9yIGl0IHRvIHJlc29sdmUpXG5cdGFwcC51c2UodG9vYnVzeSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaWRkbGV3YXJlc1xuIiwiaW1wb3J0ICogYXMgbW9yZ2FuIGZyb20gJ21vcmdhbidcblxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1ZygnbWlkZGxld2FyZXM6bG9nZ2luZycpXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBsb2dnZXIgPSBtb3JnYW4oJ2NvbWJpbmVkJywge1xuXHRza2lwOiAoXzogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4gaXNQcm9kdWN0aW9uICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCxcblx0c3RyZWFtOiB7XG5cdFx0d3JpdGU6IChtZXNzYWdlOiBzdHJpbmcpID0+IGRlYnVnKG1lc3NhZ2UpXG5cdH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0ICogYXMgaHBwIGZyb20gJ2hwcCdcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgY29udGVudFNlY3VyaXR5UG9saWN5LCBmcmFtZWd1YXJkLCBoc3RzLCBpZU5vT3Blbiwgbm9TbmlmZiwgeHNzRmlsdGVyIH0gZnJvbSAnaGVsbWV0J1xuXG5pbXBvcnQgZXhwcmVzc0VuZm9yY2VzU3NsIGZyb20gJ2V4cHJlc3MtZW5mb3JjZXMtc3NsJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCdcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IHNlY3VyaXR5ID0gKGFwcDogQXBwbGljYXRpb24sIHsgZW5hYmxlTm9uY2UsIGVuYWJsZUNTUCB9OiB7IGVuYWJsZU5vbmNlOiBib29sZWFuOyBlbmFibGVDU1A6IGJvb2xlYW4gfSkgPT4ge1xuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXHRcblx0Ly8gc2VjdXJpdHkgaGVsbWV0IHBhY2thZ2Vcblx0Ly8gRG9uJ3QgZXhwb3NlIGFueSBzb2Z0d2FyZSBpbmZvcm1hdGlvbiB0byBoYWNrZXJzLlxuXHRhcHAuZGlzYWJsZSgneC1wb3dlcmVkLWJ5JylcblxuXHQvLyBFeHByZXNzIG1pZGRsZXdhcmUgdG8gcHJvdGVjdCBhZ2FpbnN0IEhUVFAgUGFyYW1ldGVyIFBvbGx1dGlvbiBhdHRhY2tzXG5cdGFwcC51c2UoaHBwKCkpXG5cblx0aWYgKGlzUHJvZHVjdGlvbikge1xuXHRcdGFwcC51c2UoXG5cdFx0XHRoc3RzKHtcblx0XHRcdFx0Ly8gNSBtaW5zIGluIHNlY29uZHNcblx0XHRcdFx0Ly8gd2Ugd2lsbCBzY2FsZSB0aGlzIHVwIGluY3JlbWVudGFsbHkgdG8gZW5zdXJlIHdlIGRvbnQgYnJlYWsgdGhlXG5cdFx0XHRcdC8vIGFwcCBmb3IgZW5kIHVzZXJzXG5cdFx0XHRcdC8vIHNlZSBkZXBsb3ltZW50IHJlY29tbWVuZGF0aW9ucyBoZXJlIGh0dHBzOi8vaHN0c3ByZWxvYWQub3JnLz9kb21haW49c3BlY3RydW0uY2hhdFxuXHRcdFx0XHRtYXhBZ2U6IDMwMCxcblx0XHRcdFx0aW5jbHVkZVN1YkRvbWFpbnM6IHRydWUsXG5cdFx0XHRcdHByZWxvYWQ6IHRydWVcblx0XHRcdH0pXG5cdFx0KVxuXG5cdFx0YXBwLnVzZShleHByZXNzRW5mb3JjZXNTc2woKSlcblx0fVxuXG5cdC8vIFRoZSBYLUZyYW1lLU9wdGlvbnMgaGVhZGVyIHRlbGxzIGJyb3dzZXJzIHRvIHByZXZlbnQgeW91ciB3ZWJwYWdlIGZyb20gYmVpbmcgcHV0IGluIGFuIGlmcmFtZS5cblx0YXBwLnVzZShmcmFtZWd1YXJkKHsgYWN0aW9uOiAnc2FtZW9yaWdpbicgfSkpXG5cblx0Ly8gQ3Jvc3Mtc2l0ZSBzY3JpcHRpbmcsIGFiYnJldmlhdGVkIHRvIOKAnFhTU+KAnSwgaXMgYSB3YXkgYXR0YWNrZXJzIGNhbiB0YWtlIG92ZXIgd2VicGFnZXMuXG5cdGFwcC51c2UoeHNzRmlsdGVyKCkpXG5cblx0Ly8gU2V0cyB0aGUgWC1Eb3dubG9hZC1PcHRpb25zIHRvIHByZXZlbnQgSW50ZXJuZXQgRXhwbG9yZXIgZnJvbSBleGVjdXRpbmdcblx0Ly8gZG93bmxvYWRzIGluIHlvdXIgc2l0ZeKAmXMgY29udGV4dC5cblx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2llbm9vcGVuL1xuXHRhcHAudXNlKGllTm9PcGVuKCkpXG5cblx0Ly8gRG9u4oCZdCBTbmlmZiBNaW1ldHlwZSBtaWRkbGV3YXJlLCBub1NuaWZmLCBoZWxwcyBwcmV2ZW50IGJyb3dzZXJzIGZyb20gdHJ5aW5nXG5cdC8vIHRvIGd1ZXNzICjigJxzbmlmZuKAnSkgdGhlIE1JTUUgdHlwZSwgd2hpY2ggY2FuIGhhdmUgc2VjdXJpdHkgaW1wbGljYXRpb25zLiBJdFxuXHQvLyBkb2VzIHRoaXMgYnkgc2V0dGluZyB0aGUgWC1Db250ZW50LVR5cGUtT3B0aW9ucyBoZWFkZXIgdG8gbm9zbmlmZi5cblx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2RvbnQtc25pZmYtbWltZXR5cGUvXG5cdGFwcC51c2Uobm9TbmlmZigpKVxuXG5cdGlmIChlbmFibGVOb25jZSkge1xuXHRcdC8vIEF0dGFjaCBhIHVuaXF1ZSBcIm5vbmNlXCIgdG8gZXZlcnkgcmVzcG9uc2UuIFRoaXMgYWxsb3dzIHVzZSB0byBkZWNsYXJlXG5cdFx0Ly8gaW5saW5lIHNjcmlwdHMgYXMgYmVpbmcgc2FmZSBmb3IgZXhlY3V0aW9uIGFnYWluc3Qgb3VyIGNvbnRlbnQgc2VjdXJpdHkgcG9saWN5LlxuXHRcdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdFx0YXBwLnVzZSgocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0XHRcdHJlc3BvbnNlLmxvY2Fscy5ub25jZSA9IHV1aWQudjQoKVxuXHRcdFx0bmV4dCgpXG5cdFx0fSlcblx0fVxuXG5cdC8vIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IChDU1ApXG5cdC8vIEl0IGNhbiBiZSBhIHBhaW4gdG8gbWFuYWdlIHRoZXNlLCBidXQgaXQncyBhIHJlYWxseSBncmVhdCBoYWJpdCB0byBnZXQgaW4gdG8uXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdGNvbnN0IGNzcENvbmZpZyA9IHtcblx0XHRkaXJlY3RpdmVzOiB7XG5cdFx0XHQvLyBUaGUgZGVmYXVsdC1zcmMgaXMgdGhlIGRlZmF1bHQgcG9saWN5IGZvciBsb2FkaW5nIGNvbnRlbnQgc3VjaCBhc1xuXHRcdFx0Ly8gSmF2YVNjcmlwdCwgSW1hZ2VzLCBDU1MsIEZvbnRzLCBBSkFYIHJlcXVlc3RzLCBGcmFtZXMsIEhUTUw1IE1lZGlhLlxuXHRcdFx0Ly8gQXMgeW91IG1pZ2h0IHN1c3BlY3QsIGlzIHVzZWQgYXMgZmFsbGJhY2sgZm9yIHVuc3BlY2lmaWVkIGRpcmVjdGl2ZXMuXG5cdFx0XHRkZWZhdWx0U3JjOiBbXCInc2VsZidcIl0sXG5cblx0XHRcdC8vIERlZmluZXMgdmFsaWQgc291cmNlcyBvZiBKYXZhU2NyaXB0LlxuXHRcdFx0c2NyaXB0U3JjOiBbXG5cdFx0XHRcdFwiJ3NlbGYnXCIsXG5cdFx0XHRcdFwiJ3Vuc2FmZS1ldmFsJ1wiLFxuXHRcdFx0XHQnd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tJyxcblx0XHRcdFx0J2Nkbi5yYXZlbmpzLmNvbScsXG5cdFx0XHRcdCdjZG4ucG9seWZpbGwuaW8nLFxuXHRcdFx0XHQnY2RuLmFtcGxpdHVkZS5jb20nLFxuXG5cdFx0XHRcdC8vIE5vdGU6IFdlIHdpbGwgZXhlY3V0aW9uIG9mIGFueSBpbmxpbmUgc2NyaXB0cyB0aGF0IGhhdmUgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvLyBub25jZSBpZGVudGlmaWVyIGF0dGFjaGVkIHRvIHRoZW0uXG5cdFx0XHRcdC8vIFRoaXMgaXMgdXNlZnVsIGZvciBndWFyZGluZyB5b3VyIGFwcGxpY2F0aW9uIHdoaWxzdCBhbGxvd2luZyBhbiBpbmxpbmVcblx0XHRcdFx0Ly8gc2NyaXB0IHRvIGRvIGRhdGEgc3RvcmUgcmVoeWRyYXRpb24gKHJlZHV4L21vYngvYXBvbGxvKSBmb3IgZXhhbXBsZS5cblx0XHRcdFx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2NzcC9cblx0XHRcdFx0KF86IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gYCdub25jZS0ke3Jlc3BvbnNlLmxvY2Fscy5ub25jZX0nYFxuXHRcdFx0XSxcblxuXHRcdFx0Ly8gRGVmaW5lcyB0aGUgb3JpZ2lucyBmcm9tIHdoaWNoIGltYWdlcyBjYW4gYmUgbG9hZGVkLlxuXHRcdFx0Ly8gQG5vdGU6IExlYXZlIG9wZW4gdG8gYWxsIGltYWdlcywgdG9vIG11Y2ggaW1hZ2UgY29taW5nIGZyb20gZGlmZmVyZW50IHNlcnZlcnMuXG5cdFx0XHRpbWdTcmM6IFsnaHR0cHM6JywgJ2h0dHA6JywgXCInc2VsZidcIiwgJ2RhdGE6JywgJ2Jsb2I6J10sXG5cblx0XHRcdC8vIERlZmluZXMgdmFsaWQgc291cmNlcyBvZiBzdHlsZXNoZWV0cy5cblx0XHRcdHN0eWxlU3JjOiBbXCInc2VsZidcIiwgXCIndW5zYWZlLWlubGluZSdcIl0sXG5cblx0XHRcdC8vIEFwcGxpZXMgdG8gWE1MSHR0cFJlcXVlc3QgKEFKQVgpLCBXZWJTb2NrZXQgb3IgRXZlbnRTb3VyY2UuXG5cdFx0XHQvLyBJZiBub3QgYWxsb3dlZCB0aGUgYnJvd3NlciBlbXVsYXRlcyBhIDQwMCBIVFRQIHN0YXR1cyBjb2RlLlxuXHRcdFx0Y29ubmVjdFNyYzogWydodHRwczonLCAnd3NzOiddLFxuXG5cdFx0XHQvLyBsaXN0cyB0aGUgVVJMcyBmb3Igd29ya2VycyBhbmQgZW1iZWRkZWQgZnJhbWUgY29udGVudHMuXG5cdFx0XHQvLyBGb3IgZXhhbXBsZTogY2hpbGQtc3JjIGh0dHBzOi8veW91dHViZS5jb20gd291bGQgZW5hYmxlXG5cdFx0XHQvLyBlbWJlZGRpbmcgdmlkZW9zIGZyb20gWW91VHViZSBidXQgbm90IGZyb20gb3RoZXIgb3JpZ2lucy5cblx0XHRcdC8vIEBub3RlOiB3ZSBhbGxvdyB1c2VycyB0byBlbWJlZCBhbnkgcGFnZSB0aGV5IHdhbnQuXG5cdFx0XHRjaGlsZFNyYzogWydodHRwczonLCAnaHR0cDonXSxcblxuXHRcdFx0Ly8gYWxsb3dzIGNvbnRyb2wgb3ZlciBGbGFzaCBhbmQgb3RoZXIgcGx1Z2lucy5cblx0XHRcdG9iamVjdFNyYzogW1wiJ25vbmUnXCJdLFxuXG5cdFx0XHQvLyByZXN0cmljdHMgdGhlIG9yaWdpbnMgYWxsb3dlZCB0byBkZWxpdmVyIHZpZGVvIGFuZCBhdWRpby5cblx0XHRcdG1lZGlhU3JjOiBbXCInbm9uZSdcIl1cblx0XHR9LFxuXG5cdFx0Ly8gU2V0IHRvIHRydWUgaWYgeW91IG9ubHkgd2FudCBicm93c2VycyB0byByZXBvcnQgZXJyb3JzLCBub3QgYmxvY2sgdGhlbS5cblx0XHRyZXBvcnRPbmx5OiBOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fCBCb29sZWFuKEZPUkNFX0RFVikgfHwgZmFsc2UsXG5cdFx0Ly8gTmVjZXNzYXJ5IGJlY2F1c2Ugb2YgWmVpdCBDRE4gdXNhZ2Vcblx0XHRicm93c2VyU25pZmY6IGZhbHNlXG5cdH1cblxuXHRpZiAoZW5hYmxlQ1NQKSB7XG5cdFx0YXBwLnVzZShjb250ZW50U2VjdXJpdHlQb2xpY3koY3NwQ29uZmlnKSlcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZWN1cml0eVxuIiwiaW1wb3J0ICogYXMgdG9vYnVzeSBmcm9tICd0b29idXN5LWpzJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5cbmNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0aWYgKCFpc0RldmVsb3BtZW50ICYmIHRvb2J1c3koKSkge1xuXHRcdHJlcy5zdGF0dXNDb2RlID0gNTAzXG5cdFx0cmVzLnNlbmQoJ0l0IGxvb2tlIGxpa2UgdGhlIHNldmVyIGlzIGJ1c3N5LiBXYWl0IGZldyBzZWNvbmRzLi4uJylcblx0fSBlbHNlIHtcblx0XHQvLyBxdWV1ZSB1cCB0aGUgcmVxdWVzdCBhbmQgd2FpdCBmb3IgaXQgdG8gY29tcGxldGUgaW4gdGVzdGluZyBhbmQgZGV2ZWxvcG1lbnQgcGhhc2Vcblx0XHRuZXh0KClcblx0fVxufVxuIiwiaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJPcHRpb25zLCBjcmVhdGVMb2dnZXIsIGZvcm1hdCwgdHJhbnNwb3J0cyB9IGZyb20gJ3dpbnN0b24nXG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdmcydcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuXG5jb25zdCB7IGNvbWJpbmUsIHRpbWVzdGFtcCwgcHJldHR5UHJpbnQgfSA9IGZvcm1hdFxuY29uc3QgbG9nRGlyZWN0b3J5ID0gam9pbihfX2Rpcm5hbWUsICdsb2cnKVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG50eXBlIElMb2dnZXJPcHRpb25zID0geyBmaWxlOiBMb2dnZXJPcHRpb25zOyBjb25zb2xlOiBMb2dnZXJPcHRpb25zIH1cblxuZXhwb3J0IGNvbnN0IGxvZ2dlck9wdGlvbnMgPSB7XG5cdGZpbGU6IHtcblx0XHRsZXZlbDogJ2luZm8nLFxuXHRcdGZpbGVuYW1lOiBgJHtsb2dEaXJlY3Rvcnl9L2xvZ3MvYXBwLmxvZ2AsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiB0cnVlLFxuXHRcdG1heHNpemU6IDUyNDI4ODAsIC8vIDVNQlxuXHRcdG1heEZpbGVzOiA1LFxuXHRcdGNvbG9yaXplOiBmYWxzZVxuXHR9LFxuXHRjb25zb2xlOiB7XG5cdFx0bGV2ZWw6ICdkZWJ1ZycsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiBmYWxzZSxcblx0XHRjb2xvcml6ZTogdHJ1ZVxuXHR9XG59XG5jb25zdCBsb2dnZXJUcmFuc3BvcnRzID0gW1xuXHRuZXcgdHJhbnNwb3J0cy5Db25zb2xlKHtcblx0XHQuLi5sb2dnZXJPcHRpb25zLmNvbnNvbGUsXG5cdFx0Zm9ybWF0OiBmb3JtYXQuY29tYmluZShcblx0XHRcdGZvcm1hdC50aW1lc3RhbXAoKSxcblx0XHRcdGZvcm1hdC5jb2xvcml6ZSh7IGFsbDogdHJ1ZSB9KSxcblx0XHRcdGZvcm1hdC5hbGlnbigpLFxuXHRcdFx0Zm9ybWF0LnByaW50ZigoaW5mbykgPT4ge1xuXHRcdFx0XHRjb25zdCB7IHRpbWVzdGFtcCwgbGV2ZWwsIG1lc3NhZ2UsIC4uLmFyZ3MgfSA9IGluZm9cblxuXHRcdFx0XHQvLyBjb25zdCB0cyA9IHRpbWVzdGFtcC5zbGljZSgwLCAxOSkucmVwbGFjZSgnVCcsICcgJyk7XG5cdFx0XHRcdHJldHVybiBgJHt0aW1lc3RhbXB9ICR7bGV2ZWx9OiAke21lc3NhZ2V9ICR7T2JqZWN0LmtleXMoYXJncykubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoYXJncywgbnVsbCwgMikgOiAnJ31gXG5cdFx0XHR9KVxuXHRcdClcblx0fSlcbl1cblxuY2xhc3MgQXBwTG9nZ2VyIHtcblx0cHVibGljIGxvZ2dlcjogTG9nZ2VyXG5cdHB1YmxpYyBsb2dnZXJPcHRpb25zOiBJTG9nZ2VyT3B0aW9uc1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IElMb2dnZXJPcHRpb25zKSB7XG5cdFx0aWYgKCFpc0RldmVsb3BtZW50KSB7XG5cdFx0XHRleGlzdHNTeW5jKGxvZ0RpcmVjdG9yeSkgfHwgbWtkaXJTeW5jKGxvZ0RpcmVjdG9yeSlcblx0XHR9XG5cblx0XHR0aGlzLmxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XG5cdFx0XHR0cmFuc3BvcnRzOiBpc0RldmVsb3BtZW50XG5cdFx0XHRcdD8gWy4uLmxvZ2dlclRyYW5zcG9ydHNdXG5cdFx0XHRcdDogW1xuXHRcdFx0XHRcdFx0Li4ubG9nZ2VyVHJhbnNwb3J0cyxcblx0XHRcdFx0XHRcdG5ldyB0cmFuc3BvcnRzLkZpbGUoe1xuXHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLmZpbGUsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogY29tYmluZSh0aW1lc3RhbXAoKSwgcHJldHR5UHJpbnQoKSlcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdCAgXSxcblx0XHRcdGV4aXRPbkVycm9yOiBmYWxzZVxuXHRcdH0pXG5cdH1cbn1cblxuY29uc3QgeyBsb2dnZXIgfSA9IG5ldyBBcHBMb2dnZXIobG9nZ2VyT3B0aW9ucylcbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0IHsgU2VydmVyLCBjcmVhdGVTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuXG5pbXBvcnQgQXBwIGZyb20gJ2FwcC5zZXJ2ZXInXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgZ3JhcGhxbFNlcnZlciBmcm9tICdncmFwaHFsLnNlcnZlcidcbmltcG9ydCB7IG5vcm1hbGl6ZVBvcnQgfSBmcm9tICd1dGlsbGl0eS9ub3JtYWxpemUnXG5cbmNsYXNzIE9vam9iU2VydmVyIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIHNlcnZlcjogU2VydmVyXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0Z3JhcGhxbFNlcnZlci5hcHBseU1pZGRsZXdhcmUoeyBhcHAgfSlcblx0XHR0aGlzLnNlcnZlciA9IGNyZWF0ZVNlcnZlcihhcHApXG5cdFx0Z3JhcGhxbFNlcnZlci5pbnN0YWxsU3Vic2NyaXB0aW9uSGFuZGxlcnModGhpcy5zZXJ2ZXIpXG5cdH1cblxuXHRzdGFydFN5bmNTZXJ2ZXIgPSBhc3luYyAocG9ydDogc3RyaW5nKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFBPUlQgPSBub3JtYWxpemVQb3J0KHBvcnQpXG5cdFx0XHR0aGlzLnNlcnZlci5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgc2VydmVyIHJlYWR5IGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtQT1JUfSR7Z3JhcGhxbFNlcnZlci5ncmFwaHFsUGF0aH1gKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhgU3Vic2NyaXB0aW9ucyByZWFkeSBhdCB3czovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLnN1YnNjcmlwdGlvbnNQYXRofWApXG5cdFx0XHR9KVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRhd2FpdCB0aGlzLnN0b3BTZXJ2ZXIoKVxuXHRcdH1cblx0fVxuXG5cdHN0b3BTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0cHJvY2Vzcy5vbignU0lHSU5UJywgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Nsb3Npbmcgb29qb2IgU3luY1NlcnZlciAuLi4nKVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0aGlzLnNlcnZlci5jbG9zZSgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdvb2pvYiBTeW5jU2VydmVyIENsb3NlZCcpXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBDbG9zaW5nIFN5bmNTZXJ2ZXIgU2VydmVyIENvbm5lY3Rpb24nKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdFx0XHRwcm9jZXNzLmtpbGwocHJvY2Vzcy5waWQpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG5leHBvcnQgY29uc3QgeyBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIsIHNlcnZlciwgYXBwIH0gPSBuZXcgT29qb2JTZXJ2ZXIoQXBwKVxuIiwiaW1wb3J0IHsgSmFlZ2VyRXhwb3J0ZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXInXG5pbXBvcnQgeyBOb2RlVHJhY2VyUHJvdmlkZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9ub2RlJ1xuaW1wb3J0IHsgU2ltcGxlU3BhblByb2Nlc3NvciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L3RyYWNpbmcnXG5pbXBvcnQgb3BlbnRlbGVtZXRyeSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknXG5cbmNvbnN0IHRyYWNlciA9IChzZXJ2aWNlTmFtZTogc3RyaW5nKSA9PiB7XG5cdGNvbnN0IHByb3ZpZGVyID0gbmV3IE5vZGVUcmFjZXJQcm92aWRlcih7XG5cdFx0cGx1Z2luczoge1xuXHRcdFx0Z3JwYzoge1xuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRwYXRoOiAnQG9wZW50ZWxlbWV0cnkvcGx1Z2luLWdycGMnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxuXG5cdGNvbnN0IGV4cG9ydGVyID0gbmV3IEphZWdlckV4cG9ydGVyKHtcblx0XHRzZXJ2aWNlTmFtZVxuXHR9KVxuXG5cdHByb3ZpZGVyLmFkZFNwYW5Qcm9jZXNzb3IobmV3IFNpbXBsZVNwYW5Qcm9jZXNzb3IoZXhwb3J0ZXIpKVxuXHRwcm92aWRlci5yZWdpc3RlcigpXG5cblx0cmV0dXJuIG9wZW50ZWxlbWV0cnkudHJhY2UuZ2V0VHJhY2VyKCdzZXJ2aWNlOmdhdGV3YXknKVxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFjZXJcbiIsImltcG9ydCB7IGNyZWF0ZUNpcGhlciwgY3JlYXRlRGVjaXBoZXIgfSBmcm9tICdjcnlwdG8nXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmNsYXNzIEFwcENyeXB0byB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cdHByaXZhdGUgRU5DUllQVF9BTEdPUklUSE06IHN0cmluZ1xuXHRwcml2YXRlIEVOQ1JZUFRfU0VDUkVUOiBzdHJpbmdcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0Y29uc3QgeyBFTkNSWVBUX1NFQ1JFVCA9ICdkb2RvZHVja0BOOScsIEVOQ1JZUFRfQUxHT1JJVEhNID0gJ2Flcy0yNTYtY3RyJyB9ID0gcHJvY2Vzcy5lbnZcblxuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0dGhpcy5FTkNSWVBUX0FMR09SSVRITSA9IEVOQ1JZUFRfQUxHT1JJVEhNXG5cdFx0dGhpcy5FTkNSWVBUX1NFQ1JFVCA9IEVOQ1JZUFRfU0VDUkVUXG5cdH1cblxuXHRwdWJsaWMgZW5jcnlwdCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHR0aGlzLmFwcC5sb2dnZXIuaW5mbyhgRW5jcnlwdCBmb3IgJHt0ZXh0fWApXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY2lwaGVyID0gY3JlYXRlQ2lwaGVyKHRoaXMuRU5DUllQVF9BTEdPUklUSE0sIHRoaXMuRU5DUllQVF9TRUNSRVQpXG5cdFx0XHRsZXQgY3J5cHRlZCA9IGNpcGhlci51cGRhdGUodGV4dCwgJ3V0ZjgnLCAnaGV4Jylcblx0XHRcdGNyeXB0ZWQgKz0gY2lwaGVyLmZpbmFsKCdoZXgnKVxuXG5cdFx0XHRyZXR1cm4gY3J5cHRlZFxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcC5sb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSlcblxuXHRcdFx0cmV0dXJuICcnXG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGRlY3J5cHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0dGhpcy5hcHAubG9nZ2VyLmluZm8oYERlY3J5cHQgZm9yICR7dGV4dH1gKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGRlY2lwaGVyID0gY3JlYXRlRGVjaXBoZXIodGhpcy5FTkNSWVBUX0FMR09SSVRITSwgdGhpcy5FTkNSWVBUX1NFQ1JFVClcblx0XHRcdGxldCBkZWMgPSBkZWNpcGhlci51cGRhdGUodGV4dCwgJ2hleCcsICd1dGY4Jylcblx0XHRcdGRlYyArPSBkZWNpcGhlci5maW5hbCgndXRmOCcpXG5cblx0XHRcdHJldHVybiBkZWNcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHAubG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpXG5cblx0XHRcdHJldHVybiAnJ1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBDcnlwdG9cbiIsImltcG9ydCBBcHBDcnlwdG8gZnJvbSAnLi9jcnlwdG8nXG5pbXBvcnQgQXBwU2x1Z2lmeSBmcm9tICcuL3NsdWdpZnknXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgeyBJQXBwVXRpbHMgfSBmcm9tICcuL3V0aWwuaW50ZXJmYWNlJ1xuXG5jbGFzcyBBcHBVdGlscyBpbXBsZW1lbnRzIElBcHBVdGlscyB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cblx0XHQvLyB0aGlzLmFwcC5sb2dnZXIuaW5mbygnSW5pdGlhbGl6ZWQgQXBwVXRpbHMnKVxuXHR9XG5cblx0cHVibGljIGFwcGx5VXRpbHMgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG5cdFx0Y29uc3QgeyBlbmNyeXB0LCBkZWNyeXB0IH0gPSBuZXcgQXBwQ3J5cHRvKHRoaXMuYXBwKVxuXHRcdGNvbnN0IHsgc2x1Z2lmeSB9ID0gbmV3IEFwcFNsdWdpZnkodGhpcy5hcHApXG5cdFx0dGhpcy5hcHAudXRpbGl0eSA9IHtcblx0XHRcdGVuY3J5cHQsXG5cdFx0XHRkZWNyeXB0LFxuXHRcdFx0c2x1Z2lmeVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwVXRpbHNcbiIsImNvbnN0IG5vcm1hbGl6ZVBvcnQgPSAocG9ydFZhbHVlOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuXHRjb25zdCBwb3J0ID0gcGFyc2VJbnQocG9ydFZhbHVlLCAxMClcblxuXHRpZiAoaXNOYU4ocG9ydCkpIHtcblx0XHRyZXR1cm4gODA4MFxuXHR9XG5cblx0aWYgKHBvcnQgPj0gMCkge1xuXHRcdHJldHVybiBwb3J0XG5cdH1cblxuXHRyZXR1cm4gcG9ydFxufVxuXG5leHBvcnQgeyBub3JtYWxpemVQb3J0IH1cbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY2xhc3MgQXBwU2x1Z2lmeSB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdH1cblxuXHRwdWJsaWMgc2x1Z2lmeSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHQvLyB0aGlzLmFwcC5sb2dnZXIuaW5mbyhgU2x1Z2lmeSBmb3IgJHt0ZXh0fWApXG5cblx0XHRyZXR1cm4gdGV4dFxuXHRcdFx0LnRvTG93ZXJDYXNlKClcblx0XHRcdC5yZXBsYWNlKC9bXlxcdyBdKy9nLCAnJylcblx0XHRcdC5yZXBsYWNlKC8gKy9nLCAnLScpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwU2x1Z2lmeVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL29vam9iLXByb3RvYnVmXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvYXBpXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L2V4cG9ydGVyLWphZWdlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9ub2RlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L3RyYWNpbmdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNsdXN0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tcHJlc3Npb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGVidWdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52L2NvbmZpZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3MtZW5mb3JjZXMtc3NsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdycGNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGVsbWV0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhvc3QtdmFsaWRhdGlvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJocHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9yZ2FuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidG9vYnVzeS1qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0c2xpYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwid2luc3RvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9