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
/******/ 	var hotCurrentHash = "f14bd87e3d8ea2698f29";
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
    ValidateUsername: (_, { input }, { logger }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        logger.info('validating username');
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
        }
        catch ({ message, code }) {
            res.status = false;
            res.error = message;
            res.code = code;
        }
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
    Auth: (_, { input }, { logger }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        logger.info('mutation : AUTH');
        const res = {};
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
        }
        catch (error) {
            res.access_token = '';
            res.refresh_token = '';
            res.valid = false;
        }
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
const index_1 = __webpack_require__(/*! index */ "./src/index.ts");
const resolver_1 = __webpack_require__(/*! client/profile/resolver */ "./src/client/profile/resolver/index.ts");
const apollo_server_cache_redis_1 = __webpack_require__(/*! apollo-server-cache-redis */ "apollo-server-cache-redis");
const redis_1 = __webpack_require__(/*! service/config/redis */ "./src/service/config/redis/index.ts");
const graphql_error_1 = __webpack_require__(/*! service/error/graphql.error */ "./src/service/error/graphql.error.ts");
const logger_1 = __webpack_require__(/*! logger */ "./src/logger.ts");
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
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
            appTracer: index_1.appTracer,
            span: index_1.span,
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
const tracer_1 = __webpack_require__(/*! tracer */ "./src/tracer.ts");
exports.appTracer = tracer_1.default('service:gateway');
exports.span = exports.appTracer.startSpan('grpc:service');
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
const api_1 = __webpack_require__(/*! @opentelemetry/api */ "@opentelemetry/api");
const exporter_jaeger_1 = __webpack_require__(/*! @opentelemetry/exporter-jaeger */ "@opentelemetry/exporter-jaeger");
const metrics_1 = __webpack_require__(/*! @opentelemetry/metrics */ "@opentelemetry/metrics");
const node_1 = __webpack_require__(/*! @opentelemetry/node */ "@opentelemetry/node");
const exporter_prometheus_1 = __webpack_require__(/*! @opentelemetry/exporter-prometheus */ "@opentelemetry/exporter-prometheus");
const tracing_1 = __webpack_require__(/*! @opentelemetry/tracing */ "@opentelemetry/tracing");
const tracer = (serviceName) => {
    const provider = new node_1.NodeTracerProvider({
        plugins: {
            express: {
                enabled: true,
                path: '@opentelemetry/plugin-express'
            },
            grpc: {
                enabled: true,
                path: '@opentelemetry/plugin-grpc'
            },
            http: {
                enabled: true,
                path: '@opentelemetry/plugin-http'
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
    const tracer = api_1.default.trace.getTracer('service:gateway');
    return tracer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NzcmYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2Vycm9yLWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL2NvbmZpZy9yZWRpcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZS9jb25maWcvc2VudHJ5L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9zZXJ2aWNlL2Vycm9yL2dyYXBocWwuZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2UvZXJyb3IvdXNlci5lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhY2VyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9jcnlwdG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9ub3JtYWxpemUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L3NsdWdpZnkudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL29vam9iLXByb3RvYnVmXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvYXBpXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItamFlZ2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItcHJvbWV0aGV1c1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvcGVudGVsZW1ldHJ5L21ldHJpY3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBzZW50cnkvaW50ZWdyYXRpb25zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQHNlbnRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1jYWNoZS1yZWRpc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudi9jb25maWdcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImdyYXBocWwtZGVwdGgtbGltaXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncmFwaHFsLXJhdGUtbGltaXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncnBjXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaGVsbWV0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaG9zdC12YWxpZGF0aW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHBwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImlvcmVkaXNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b29idXN5LWpzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHNsaWJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbnN0b25cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3QjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxxQkFBcUIsZ0JBQWdCO1FBQ3JDO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EscUJBQXFCLGdCQUFnQjtRQUNyQztRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGtCQUFrQiw4QkFBOEI7UUFDaEQ7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLG9CQUFvQiwyQkFBMkI7UUFDL0M7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE9BQU87UUFDUDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0EsbUJBQW1CLGNBQWM7UUFDakM7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLGdCQUFnQixLQUFLO1FBQ3JCO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLFlBQVk7UUFDNUI7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQSxjQUFjLDRCQUE0QjtRQUMxQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7O1FBRUo7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQSxlQUFlLDRCQUE0QjtRQUMzQztRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBLGVBQWUsNEJBQTRCO1FBQzNDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxpQkFBaUIsdUNBQXVDO1FBQ3hEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FB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LEVBQUUsR0FBRyxDQUFDO1FBQ3RCLENBQUM7UUFWQSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7SUFDZixDQUFDO0NBVUQ7QUFFUSxnQ0FBVTtBQUNuQixrQkFBZSxVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJ6QixrRDs7Ozs7Ozs7Ozs7QUNBQSwwRDs7Ozs7Ozs7Ozs7QUNBQSxxRTs7Ozs7Ozs7Ozs7QUNBQSwrQzs7Ozs7Ozs7Ozs7QUNBQSwyRDs7Ozs7Ozs7Ozs7QUNBQSwrRDs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSxnRDs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7Ozs7QUNBQSxpRDs7Ozs7Ozs7Ozs7QUNBQSx5Qzs7Ozs7Ozs7Ozs7QUNBQSxzRDs7Ozs7Ozs7Ozs7QUNBQSxrRDs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxpRDs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxnRDs7Ozs7Ozs7Ozs7QUNBQSwrQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSw0Qzs7Ozs7Ozs7Ozs7QUNBQSxnQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSx1Qzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQyIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwiLmhvdC9cIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7XG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCIuaG90L1wiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XG4gXHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1cGRhdGUpO1xuIFx0fVxuXG4gXHQvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcImYxNGJkODdlM2Q4ZWEyNjk4ZjI5XCI7XG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTtcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRpZiAoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuIFx0XHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG4gXHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuIFx0XHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuIFx0XHRcdFx0XHRcdHJlcXVlc3QgK1xuIFx0XHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdCk7XG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcbiBcdFx0fTtcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xuIFx0XHRcdFx0fSxcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH07XG4gXHRcdH07XG4gXHRcdGZvciAodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJlXCIgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwidFwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRmbi50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0XHRpZiAobW9kZSAmIDEpIHZhbHVlID0gZm4odmFsdWUpO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLnQodmFsdWUsIG1vZGUgJiB+MSk7XG4gXHRcdH07XG4gXHRcdHJldHVybiBmbjtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIGhvdCA9IHtcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxuXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIikge1xuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHR9XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSBcIm1haW5cIjtcbiBcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHR7XG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQgJiZcbiBcdFx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmVcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXG5cdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiXG5cdFx0KTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKVxuXHRcdFx0bG9nKFxuXHRcdFx0XHRcImluZm9cIixcblx0XHRcdFx0XCJbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgTmFtZWRNb2R1bGVzUGx1Z2luIGZvciBtb2R1bGUgbmFtZXMuXCJcblx0XHRcdCk7XG5cdH1cbn07XG4iLCJ2YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG5mdW5jdGlvbiBzaG91bGRMb2cobGV2ZWwpIHtcblx0dmFyIHNob3VsZExvZyA9XG5cdFx0KGxvZ0xldmVsID09PSBcImluZm9cIiAmJiBsZXZlbCA9PT0gXCJpbmZvXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwid2FybmluZ1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImVycm9yXCJdLmluZGV4T2YobG9nTGV2ZWwpID49IDAgJiYgbGV2ZWwgPT09IFwiZXJyb3JcIik7XG5cdHJldHVybiBzaG91bGRMb2c7XG59XG5cbmZ1bmN0aW9uIGxvZ0dyb3VwKGxvZ0ZuKSB7XG5cdHJldHVybiBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdFx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRcdGxvZ0ZuKG1zZyk7XG5cdFx0fVxuXHR9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0aWYgKHNob3VsZExvZyhsZXZlbCkpIHtcblx0XHRpZiAobGV2ZWwgPT09IFwiaW5mb1wiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwid2FybmluZ1wiKSB7XG5cdFx0XHRjb25zb2xlLndhcm4obXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcImVycm9yXCIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IobXNnKTtcblx0XHR9XG5cdH1cbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuLyogZXNsaW50LWVuYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cblxubW9kdWxlLmV4cG9ydHMuZ3JvdXAgPSBsb2dHcm91cChncm91cCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwQ29sbGFwc2VkID0gbG9nR3JvdXAoZ3JvdXBDb2xsYXBzZWQpO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cEVuZCA9IGxvZ0dyb3VwKGdyb3VwRW5kKTtcblxubW9kdWxlLmV4cG9ydHMuc2V0TG9nTGV2ZWwgPSBmdW5jdGlvbihsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxubW9kdWxlLmV4cG9ydHMuZm9ybWF0RXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcblx0dmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcblx0dmFyIHN0YWNrID0gZXJyLnN0YWNrO1xuXHRpZiAoIXN0YWNrKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoc3RhY2suaW5kZXhPZihtZXNzYWdlKSA8IDApIHtcblx0XHRyZXR1cm4gbWVzc2FnZSArIFwiXFxuXCIgKyBzdGFjaztcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gc3RhY2s7XG5cdH1cbn07XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLypnbG9iYWxzIF9fcmVzb3VyY2VRdWVyeSAqL1xuaWYgKG1vZHVsZS5ob3QpIHtcblx0dmFyIGhvdFBvbGxJbnRlcnZhbCA9ICtfX3Jlc291cmNlUXVlcnkuc3Vic3RyKDEpIHx8IDEwICogNjAgKiAxMDAwO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdHZhciBjaGVja0ZvclVwZGF0ZSA9IGZ1bmN0aW9uIGNoZWNrRm9yVXBkYXRlKGZyb21VcGRhdGUpIHtcblx0XHRpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJpZGxlXCIpIHtcblx0XHRcdG1vZHVsZS5ob3Rcblx0XHRcdFx0LmNoZWNrKHRydWUpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0aWYgKCF1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdFx0aWYgKGZyb21VcGRhdGUpIGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGUgYXBwbGllZC5cIik7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2xvZy1hcHBseS1yZXN1bHRcIikodXBkYXRlZE1vZHVsZXMsIHVwZGF0ZWRNb2R1bGVzKTtcblx0XHRcdFx0XHRjaGVja0ZvclVwZGF0ZSh0cnVlKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRcdHZhciBzdGF0dXMgPSBtb2R1bGUuaG90LnN0YXR1cygpO1xuXHRcdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBDYW5ub3QgYXBwbHkgdXBkYXRlLlwiKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBZb3UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiFcIik7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBVcGRhdGUgZmFpbGVkOiBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0c2V0SW50ZXJ2YWwoY2hlY2tGb3JVcGRhdGUsIGhvdFBvbGxJbnRlcnZhbCk7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcblxuaW1wb3J0IEFwcFV0aWxzIGZyb20gJ3V0aWxsaXR5J1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5pbXBvcnQgbWlkZGxld2FlcyBmcm9tICdtaWRkbGV3YXJlcydcblxuY2xhc3MgQXBwIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIGFwcFV0aWxzOiBBcHBVdGlsc1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuYXBwID0gZXhwcmVzcygpXG5cdFx0dGhpcy5hcHAubG9nZ2VyID0gbG9nZ2VyXG5cblx0XHR0aGlzLmFwcFV0aWxzID0gbmV3IEFwcFV0aWxzKHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwbHlTZXJ2ZXIoKVxuXHR9XG5cblx0cHVibGljIHN0YXRpYyBib290c3RyYXAoKTogQXBwIHtcblx0XHRyZXR1cm4gbmV3IEFwcCgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5U2VydmVyID0gYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHRoaXMuYXBwVXRpbHMuYXBwbHlVdGlscygpXG5cdFx0YXdhaXQgdGhpcy5hcHBseU1pZGRsZXdhcmUoKVxuXHR9XG5cblx0cHJpdmF0ZSBhcHBseU1pZGRsZXdhcmUgPSBhc3luYyAoKSA9PiB7XG5cdFx0bWlkZGxld2Flcyh0aGlzLmFwcClcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgQXBwKClcbmV4cG9ydCBkZWZhdWx0IGFwcGxpY2F0aW9uLmFwcFxuIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgQ29tcGFueSBpbXBsZW1lbnRzIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIG5hbWU6IFN0cmluZ1xcbiAgZGVzY3JpcHRpb246IFN0cmluZ1xcbiAgY3JlYXRlZEJ5OiBJRFxcbiAgdXJsOiBTdHJpbmdcXG4gIGxvZ286IFN0cmluZ1xcbiAgbG9jYXRpb246IFN0cmluZ1xcbiAgZm91bmRlZF95ZWFyOiBTdHJpbmdcXG4gIG5vT2ZFbXBsb3llZXM6IFJhbmdlXFxuICBsYXN0QWN0aXZlOiBUaW1lc3RhbXBcXG4gIGhpcmluZ1N0YXR1czogQm9vbGVhblxcbiAgc2tpbGxzOiBbU3RyaW5nXVxcbiAgY3JlYXRlZEF0OiBUaW1lc3RhbXAhXFxuICB1cGRhdGVkQXQ6IFRpbWVzdGFtcCFcXG59XFxuXFxuaW5wdXQgQ29tcGFueUlucHV0IHtcXG4gIGNyZWF0ZWRCeTogSUQhXFxuICBuYW1lOiBTdHJpbmchXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nIVxcbiAgdXJsOiBTdHJpbmdcXG4gIGxvZ286IFN0cmluZ1xcbiAgbG9jYXRpb246IFN0cmluZ1xcbiAgZm91bmRlZFllYXI6IFN0cmluZ1xcbiAgbm9PZkVtcGxveWVlczogUmFuZ2VJbnB1dFxcbiAgaGlyaW5nU3RhdHVzOiBCb29sZWFuXFxuICBza2lsbHM6IFtTdHJpbmddXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gQ3VycmVudFN0YXR1cyB7XFxuICBBQ1RJVkVcXG4gIEhPTERcXG4gIEVYUElSRURcXG59XFxuXFxuZW51bSBKb2JUeXBlIHtcXG4gIERFRkFVTFRcXG4gIEZFQVRVUkVEXFxuICBQUkVNSVVNXFxufVxcblxcbnR5cGUgU2FsbGFyeSB7XFxuICB2YWx1ZTogRmxvYXQhXFxuICBjdXJyZW5jeTogU3RyaW5nIVxcbn1cXG5cXG50eXBlIEpvYiBpbXBsZW1lbnRzIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIG5hbWU6IFN0cmluZyFcXG4gIHR5cGU6IEpvYlR5cGUhXFxuICBjYXRlZ29yeTogW1N0cmluZyFdIVxcbiAgZGVzYzogU3RyaW5nIVxcbiAgc2tpbGxzUmVxdWlyZWQ6IFtTdHJpbmchXSFcXG4gIHNhbGxhcnk6IFJhbmdlXFxuICBsb2NhdGlvbjogU3RyaW5nIVxcbiAgYXR0YWNobWVudDogW0F0dGFjaG1lbnRdXFxuICBzdGF0dXM6IEN1cnJlbnRTdGF0dXNcXG4gIHZpZXdzOiBJbnRcXG4gIHVzZXJzQXBwbGllZDogW1N0cmluZyFdXFxuICBjcmVhdGVkQnk6IFN0cmluZ1xcbiAgY29tcGFueTogU3RyaW5nIVxcbiAgY3JlYXRlZEF0OiBUaW1lc3RhbXAhXFxuICB1cGRhdGVkQXQ6IFRpbWVzdGFtcCFcXG59XFxuXFxudHlwZSBKb2JSZXN1bHRDdXJzb3Ige1xcbiAgZWRnZXM6IEVkZ2UhXFxuICBwYWdlSW5mbzogUGFnZUluZm8hXFxuICB0b3RhbENvdW50OiBJbnQhXFxufVxcblxcbmlucHV0IFNhbGxhcnlJbnB1dCB7XFxuICB2YWx1ZTogRmxvYXQhXFxuICBjdXJyZW5jeTogU3RyaW5nIVxcbn1cXG5cXG5pbnB1dCBDcmVhdGVKb2JJbnB1dCB7XFxuICBuYW1lOiBTdHJpbmchXFxuICB0eXBlOiBKb2JUeXBlIVxcbiAgY2F0ZWdvcnk6IFtTdHJpbmchXSFcXG4gIGRlc2M6IFN0cmluZyFcXG4gIHNraWxsc19yZXF1aXJlZDogW1N0cmluZyFdIVxcbiAgc2FsbGFyeTogUmFuZ2VJbnB1dCFcXG4gIHNhbGxhcnlfbWF4OiBTYWxsYXJ5SW5wdXQhXFxuICBhdHRhY2htZW50OiBbQXR0YWNobWVudElucHV0XVxcbiAgbG9jYXRpb246IFN0cmluZyFcXG4gIHN0YXR1czogQ3VycmVudFN0YXR1cyFcXG4gIGNvbXBhbnk6IFN0cmluZyFcXG59XFxuXCIiLCJpbXBvcnQgKiBhcyBncnBjIGZyb20gJ2dycGMnXG5cbmltcG9ydCB7IFByb2ZpbGVTZXJ2aWNlQ2xpZW50IH0gZnJvbSAnQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUnXG5cbmNvbnN0IHsgQUNDT1VOVF9TRVJWSUNFX1VSSSA9ICdsb2NhbGhvc3Q6MzAwMCcgfSA9IHByb2Nlc3MuZW52XG5jb25zdCBwcm9maWxlQ2xpZW50ID0gbmV3IFByb2ZpbGVTZXJ2aWNlQ2xpZW50KEFDQ09VTlRfU0VSVklDRV9VUkksIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcblxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZUNsaWVudFxuIiwiaW1wb3J0IHtcblx0QWNjZXNzRGV0YWlscyxcblx0QXV0aFJlcXVlc3QsXG5cdEF1dGhSZXNwb25zZSxcblx0UHJvZmlsZSxcblx0UHJvZmlsZVNlY3VyaXR5LFxuXHRSZWFkUHJvZmlsZVJlcXVlc3QsXG5cdFRva2VuUmVxdWVzdCxcblx0VmFsaWRhdGVFbWFpbFJlcXVlc3QsXG5cdFZhbGlkYXRlVXNlcm5hbWVSZXF1ZXN0XG59IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGInXG5pbXBvcnQge1xuXHRBY2Nlc3NEZXRhaWxzUmVzcG9uc2UgYXMgQWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hLFxuXHRBdXRoUmVzcG9uc2UgYXMgQXV0aFJlc3BvbnNlU2NoZW1hLFxuXHREZWZhdWx0UmVzcG9uc2UgYXMgRGVmYXVsdFJlc3BvbnNlU2NoZW1hLFxuXHRJZCBhcyBJZFNjaGVtYSxcblx0TXV0YXRpb25SZXNvbHZlcnMsXG5cdFByb2ZpbGUgYXMgUHJvZmlsZVNjaGVtYSxcblx0UHJvZmlsZVNlY3VyaXR5IGFzIFByb2ZpbGVTZWN1cml0eVNjaGVtYSxcblx0UXVlcnlSZXNvbHZlcnNcbn0gZnJvbSAnZ2VuZXJhdGVkL2dyYXBocWwnXG5pbXBvcnQgeyBEZWZhdWx0UmVzcG9uc2UsIEVtYWlsLCBJZCwgSWRlbnRpZmllciB9IGZyb20gJ0Bvb2pvYi9vb2pvYi1wcm90b2J1ZidcbmltcG9ydCB7XG5cdGF1dGgsXG5cdGNyZWF0ZVByb2ZpbGUsXG5cdGxvZ291dCxcblx0cmVhZFByb2ZpbGUsXG5cdHJlZnJlc2hUb2tlbixcblx0dmFsaWRhdGVFbWFpbCxcblx0dmFsaWRhdGVVc2VybmFtZSxcblx0dmVyaWZ5VG9rZW5cbn0gZnJvbSAnY2xpZW50L3Byb2ZpbGUvdHJhbnNmb3JtZXInXG5cbmltcG9ydCB7IEF1dGhlbnRpY2F0aW9uRXJyb3IgfSBmcm9tICdhcG9sbG8tc2VydmVyLWV4cHJlc3MnXG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VG9rZW5NZXRhZGF0YSA9IGFzeW5jICh0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxBY2Nlc3NEZXRhaWxzUmVzcG9uc2VTY2hlbWE+ID0+IHtcblx0Y29uc3QgdG9rZW5SZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCgpXG5cblx0dG9rZW5SZXF1ZXN0LnNldFRva2VuKHRva2VuKVxuXG5cdGNvbnN0IHJlczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hID0ge31cblx0dHJ5IHtcblx0XHRjb25zdCB0b2tlblJlcyA9IChhd2FpdCB2ZXJpZnlUb2tlbih0b2tlblJlcXVlc3QpKSBhcyBBY2Nlc3NEZXRhaWxzXG5cdFx0cmVzLnZlcmlmaWVkID0gdG9rZW5SZXMuZ2V0VmVyaWZpZWQoKVxuXHRcdHJlcy5hY2Nlc3NVdWlkID0gdG9rZW5SZXMuZ2V0QWNjZXNzVXVpZCgpXG5cdFx0cmVzLmFjY291bnRUeXBlID0gdG9rZW5SZXMuZ2V0QWNjb3VudFR5cGUoKVxuXHRcdHJlcy5hdXRob3JpemVkID0gdG9rZW5SZXMuZ2V0QXV0aG9yaXplZCgpXG5cdFx0cmVzLmVtYWlsID0gdG9rZW5SZXMuZ2V0RW1haWwoKVxuXHRcdHJlcy5pZGVudGlmaWVyID0gdG9rZW5SZXMuZ2V0SWRlbnRpZmllcigpXG5cdFx0cmVzLnVzZXJJZCA9IHRva2VuUmVzLmdldFVzZXJJZCgpXG5cdFx0cmVzLnVzZXJuYW1lID0gdG9rZW5SZXMuZ2V0VXNlcm5hbWUoKVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJlcy52ZXJpZmllZCA9IGZhbHNlXG5cdFx0cmVzLmFjY2Vzc1V1aWQgPSBudWxsXG5cdFx0cmVzLmFjY291bnRUeXBlID0gbnVsbFxuXHRcdHJlcy5hdXRob3JpemVkID0gZmFsc2Vcblx0XHRyZXMuZW1haWwgPSBudWxsXG5cdFx0cmVzLmV4cCA9IG51bGxcblx0XHRyZXMuaWRlbnRpZmllciA9IG51bGxcblx0XHRyZXMudXNlcklkID0gbnVsbFxuXHRcdHJlcy51c2VybmFtZSA9IG51bGxcblx0fVxuXG5cdHJldHVybiByZXNcbn1cblxuZXhwb3J0IGNvbnN0IFF1ZXJ5OiBRdWVyeVJlc29sdmVycyA9IHtcblx0VmFsaWRhdGVVc2VybmFtZTogYXN5bmMgKF8sIHsgaW5wdXQgfSwgeyBsb2dnZXIgfSkgPT4ge1xuXHRcdGxvZ2dlci5pbmZvKCd2YWxpZGF0aW5nIHVzZXJuYW1lJylcblxuXHRcdGNvbnN0IHJlczogRGVmYXVsdFJlc3BvbnNlU2NoZW1hID0ge31cblx0XHRjb25zdCB1c2VybmFtZSA9IGlucHV0LnVzZXJuYW1lXG5cdFx0Y29uc3QgdmFsaWRhdGVVc2VybmFtZVJlcSA9IG5ldyBWYWxpZGF0ZVVzZXJuYW1lUmVxdWVzdCgpXG5cdFx0aWYgKHVzZXJuYW1lKSB7XG5cdFx0XHR2YWxpZGF0ZVVzZXJuYW1lUmVxLnNldFVzZXJuYW1lKHVzZXJuYW1lKVxuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB2YWxpZGF0ZVJlcyA9IChhd2FpdCB2YWxpZGF0ZVVzZXJuYW1lKHZhbGlkYXRlVXNlcm5hbWVSZXEpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSB2YWxpZGF0ZVJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0cmVzLmNvZGUgPSB2YWxpZGF0ZVJlcy5nZXRDb2RlKClcblx0XHRcdHJlcy5lcnJvciA9IHZhbGlkYXRlUmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFZhbGlkYXRlRW1haWw6IGFzeW5jIChfLCB7IGlucHV0IH0pID0+IHtcblx0XHRjb25zdCB2YWxpZGF0ZUVtYWlsUmVxID0gbmV3IFZhbGlkYXRlRW1haWxSZXF1ZXN0KClcblxuXHRcdGNvbnN0IGVtYWlsID0gaW5wdXQuZW1haWxcblx0XHRpZiAoZW1haWwpIHtcblx0XHRcdHZhbGlkYXRlRW1haWxSZXEuc2V0RW1haWwoZW1haWwpXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzOiBEZWZhdWx0UmVzcG9uc2VTY2hlbWEgPSB7fVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB2YWxpZGF0ZVJlcyA9IChhd2FpdCB2YWxpZGF0ZUVtYWlsKHZhbGlkYXRlRW1haWxSZXEpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSB2YWxpZGF0ZVJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0cmVzLmNvZGUgPSB2YWxpZGF0ZVJlcy5nZXRDb2RlKClcblx0XHRcdHJlcy5lcnJvciA9IHZhbGlkYXRlUmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFZlcmlmeVRva2VuOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IHRva2VuOiBhY2Nlc3NUb2tlbiB9KSA9PiB7XG5cdFx0bGV0IHJlczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hID0ge31cblxuXHRcdGNvbnN0IHRva2VuID0gKGlucHV0ICYmIGlucHV0LnRva2VuKSB8fCBhY2Nlc3NUb2tlblxuXHRcdGlmICh0b2tlbikge1xuXHRcdFx0cmVzID0gYXdhaXQgZXh0cmFjdFRva2VuTWV0YWRhdGEodG9rZW4pXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRSZWZyZXNoVG9rZW46IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRjb25zdCByZXM6IEF1dGhSZXNwb25zZVNjaGVtYSA9IHt9XG5cblx0XHRjb25zdCB0b2tlblJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KClcblx0XHRjb25zdCB0b2tlbiA9IChpbnB1dCAmJiBpbnB1dC50b2tlbikgfHwgYWNjZXNzVG9rZW5cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdG9rZW5SZXNwb25zZSA9IChhd2FpdCByZWZyZXNoVG9rZW4odG9rZW5SZXF1ZXN0KSkgYXMgQXV0aFJlc3BvbnNlXG5cdFx0XHRyZXMuYWNjZXNzX3Rva2VuID0gdG9rZW5SZXNwb25zZS5nZXRBY2Nlc3NUb2tlbigpXG5cdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0UmVmcmVzaFRva2VuKClcblx0XHRcdHJlcy52YWxpZCA9IHRva2VuUmVzcG9uc2UuZ2V0VmFsaWQoKVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRyZXMuYWNjZXNzX3Rva2VuID0gJydcblx0XHRcdHJlcy5yZWZyZXNoX3Rva2VuID0gJydcblx0XHRcdHJlcy52YWxpZCA9IGZhbHNlXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRSZWFkUHJvZmlsZTogYXN5bmMgKF8sIHsgaW5wdXQgfSwgeyBhY2Nlc3NEZXRhaWxzIH0pID0+IHtcblx0XHRpZiAoIWFjY2Vzc0RldGFpbHMpIHtcblx0XHRcdHRocm93IG5ldyBBdXRoZW50aWNhdGlvbkVycm9yKCd5b3UgbXVzdCBiZSBsb2dnZWQgaW4nKVxuXHRcdH1cblxuXHRcdGlmIChpbnB1dC5pZCAhPT0gYWNjZXNzRGV0YWlscy51c2VySWQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInlvdSBjYW4ndCBhY2Nlc3Mgb3RoZXIgcHJvZmlsZVwiKVxuXHRcdH1cblxuXHRcdGNvbnN0IHJlczogUHJvZmlsZVNjaGVtYSA9IHt9XG5cdFx0Y29uc3QgcmVhZFByb2ZpbGVSZXF1ZXN0ID0gbmV3IFJlYWRQcm9maWxlUmVxdWVzdCgpXG5cdFx0cmVhZFByb2ZpbGVSZXF1ZXN0LnNldEFjY291bnRJZChpbnB1dC5pZClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBwcm9maWxlUmVzID0gKGF3YWl0IHJlYWRQcm9maWxlKHJlYWRQcm9maWxlUmVxdWVzdCkpIGFzIFByb2ZpbGVcblx0XHRcdGNvbnN0IHByb2ZpbGVTZWN1cml0eTogUHJvZmlsZVNlY3VyaXR5U2NoZW1hID0ge31cblxuXHRcdFx0Y29uc3QgZW1haWwgPSB7XG5cdFx0XHRcdGVtYWlsOiBwcm9maWxlUmVzLmdldEVtYWlsKCk/LmdldEVtYWlsKCksXG5cdFx0XHRcdC8vIHN0YXR1czogcHJvZmlsZVJlcy5nZXRFbWFpbCgpPy5nZXRTdGF0dXMoKSxcblx0XHRcdFx0c2hvdzogcHJvZmlsZVJlcy5nZXRFbWFpbCgpPy5nZXRTaG93KClcblx0XHRcdH1cblxuXHRcdFx0cHJvZmlsZVNlY3VyaXR5LnZlcmlmaWVkID0gcHJvZmlsZVJlcy5nZXRTZWN1cml0eSgpPy5nZXRWZXJpZmllZCgpXG5cblx0XHRcdHJlcy51c2VybmFtZSA9IHByb2ZpbGVSZXMuZ2V0VXNlcm5hbWUoKVxuXHRcdFx0cmVzLmdpdmVuTmFtZSA9IHByb2ZpbGVSZXMuZ2V0R2l2ZW5OYW1lKClcblx0XHRcdHJlcy5mYW1pbHlOYW1lID0gcHJvZmlsZVJlcy5nZXRGYW1pbHlOYW1lKClcblx0XHRcdHJlcy5taWRkbGVOYW1lID0gcHJvZmlsZVJlcy5nZXRNaWRkbGVOYW1lKClcblx0XHRcdHJlcy5lbWFpbCA9IGVtYWlsXG5cdFx0XHRyZXMuc2VjdXJpdHkgPSBwcm9maWxlU2VjdXJpdHlcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGVycm9yKVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fVxufVxuXG5leHBvcnQgY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRBdXRoOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IGxvZ2dlciB9KSA9PiB7XG5cdFx0bG9nZ2VyLmluZm8oJ211dGF0aW9uIDogQVVUSCcpXG5cblx0XHRjb25zdCByZXM6IEF1dGhSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0Y29uc3QgYXV0aFJlcXVlc3QgPSBuZXcgQXV0aFJlcXVlc3QoKVxuXHRcdGlmIChpbnB1dD8udXNlcm5hbWUpIHtcblx0XHRcdGF1dGhSZXF1ZXN0LnNldFVzZXJuYW1lKGlucHV0LnVzZXJuYW1lKVxuXHRcdH1cblx0XHRpZiAoaW5wdXQ/LnBhc3N3b3JkKSB7XG5cdFx0XHRhdXRoUmVxdWVzdC5zZXRQYXNzd29yZChpbnB1dC5wYXNzd29yZClcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdG9rZW5SZXNwb25zZSA9IChhd2FpdCBhdXRoKGF1dGhSZXF1ZXN0KSkgYXMgQXV0aFJlc3BvbnNlXG5cdFx0XHRyZXMuYWNjZXNzX3Rva2VuID0gdG9rZW5SZXNwb25zZS5nZXRBY2Nlc3NUb2tlbigpXG5cdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0UmVmcmVzaFRva2VuKClcblx0XHRcdHJlcy52YWxpZCA9IHRva2VuUmVzcG9uc2UuZ2V0VmFsaWQoKVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRyZXMuYWNjZXNzX3Rva2VuID0gJydcblx0XHRcdHJlcy5yZWZyZXNoX3Rva2VuID0gJydcblx0XHRcdHJlcy52YWxpZCA9IGZhbHNlXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRDcmVhdGVQcm9maWxlOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgbWlkZGxlTmFtZSA9IGlucHV0Lm1pZGRsZU5hbWUgPyBgICR7aW5wdXQubWlkZGxlTmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgZmFtaWx5TmFtZSA9IGlucHV0LmZhbWlseU5hbWUgPyBgICR7aW5wdXQuZmFtaWx5TmFtZS50cmltKCl9YCA6ICcnXG5cdFx0Y29uc3QgbmFtZSA9IGAke2lucHV0LmdpdmVuTmFtZX0ke21pZGRsZU5hbWV9JHtmYW1pbHlOYW1lfWBcblx0XHRjb25zdCBpZGVudGlmaWVyID0gbmV3IElkZW50aWZpZXIoKVxuXHRcdGlkZW50aWZpZXIuc2V0TmFtZShuYW1lLnRyaW0oKSlcblx0XHRjb25zdCBwcm9maWxlU2VjdXJpdHkgPSBuZXcgUHJvZmlsZVNlY3VyaXR5KClcblx0XHRpZiAoaW5wdXQuc2VjdXJpdHk/LnBhc3N3b3JkKSB7XG5cdFx0XHRwcm9maWxlU2VjdXJpdHkuc2V0UGFzc3dvcmQoaW5wdXQuc2VjdXJpdHkucGFzc3dvcmQpXG5cdFx0fVxuXHRcdGNvbnN0IGVtYWlsID0gbmV3IEVtYWlsKClcblx0XHRpZiAoaW5wdXQuZW1haWw/LmVtYWlsKSB7XG5cdFx0XHRlbWFpbC5zZXRFbWFpbChpbnB1dC5lbWFpbC5lbWFpbClcblx0XHR9XG5cdFx0aWYgKGlucHV0LmVtYWlsPy5zaG93KSB7XG5cdFx0XHRlbWFpbC5zZXRTaG93KGlucHV0LmVtYWlsLnNob3cpXG5cdFx0fVxuXHRcdGNvbnN0IHByb2ZpbGUgPSBuZXcgUHJvZmlsZSgpXG5cdFx0aWYgKGlucHV0Py5nZW5kZXIpIHtcblx0XHRcdHByb2ZpbGUuc2V0R2VuZGVyKGlucHV0LmdlbmRlcilcblx0XHR9XG5cdFx0aWYgKGlucHV0Py51c2VybmFtZSkge1xuXHRcdFx0cHJvZmlsZS5zZXRVc2VybmFtZShpbnB1dC51c2VybmFtZSlcblx0XHR9XG5cdFx0cHJvZmlsZS5zZXRFbWFpbChlbWFpbClcblx0XHRwcm9maWxlLnNldElkZW50aXR5KGlkZW50aWZpZXIpXG5cdFx0cHJvZmlsZS5zZXRTZWN1cml0eShwcm9maWxlU2VjdXJpdHkpXG5cdFx0Y29uc3QgcmVzID0gKGF3YWl0IGNyZWF0ZVByb2ZpbGUocHJvZmlsZSkpIGFzIElkXG5cblx0XHRjb25zdCBwcm9maWxlUmVzcG9uc2U6IElkU2NoZW1hID0ge1xuXHRcdFx0aWQ6IHJlcy5nZXRJZCgpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb2ZpbGVSZXNwb25zZVxuXHR9LFxuXHRMb2dvdXQ6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0Y29uc3QgdG9rZW5SZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCgpXG5cblx0XHRjb25zdCB0b2tlbiA9IChpbnB1dCAmJiBpbnB1dC50b2tlbikgfHwgYWNjZXNzVG9rZW5cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgbG9nb3V0UmVzID0gKGF3YWl0IGxvZ291dCh0b2tlblJlcXVlc3QpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSBsb2dvdXRSZXMuZ2V0U3RhdHVzKClcblx0XHRcdHJlcy5jb2RlID0gbG9nb3V0UmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gbG9nb3V0UmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHByb2ZpbGVSZXNvbHZlcnMgPSB7XG5cdE11dGF0aW9uLFxuXHRRdWVyeVxufVxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZVJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gQWNjb3VudFR5cGUge1xcbiAgQkFTRVxcbiAgQ09NUEFOWVxcbiAgRlVORElOR1xcbiAgSk9CXFxufVxcblxcbmVudW0gR2VuZGVyIHtcXG4gIE1BTEVcXG4gIEZFTUFMRVxcbiAgT1RIRVJcXG59XFxuXFxuZW51bSBQcm9maWxlT3BlcmF0aW9ucyB7XFxuICBDUkVBVEVcXG4gIFJFQURcXG4gIFVQREFURVxcbiAgREVMRVRFXFxuICBCVUxLX1VQREFURVxcbn1cXG5cXG5lbnVtIE9wZXJhdGlvbkVudGl0eSB7XFxuICBDT01QQU5ZXFxuICBKT0JcXG4gIElOVkVTVE9SXFxufVxcblxcbnR5cGUgRWR1Y2F0aW9uIHtcXG4gIGVkdWNhdGlvbjogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbnR5cGUgUHJvZmlsZVNlY3VyaXR5IHtcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlIHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVyXFxuICBnaXZlbk5hbWU6IFN0cmluZ1xcbiAgbWlkZGxlTmFtZTogU3RyaW5nXFxuICBmYW1pbHlOYW1lOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIGVtYWlsOiBFbWFpbFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wXFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25cXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlcXG4gIG1ldGFkYXRhOiBNZXRhZGF0YVxcbn1cXG5cXG50eXBlIEF1dGhSZXNwb25zZSB7XFxuICBhY2Nlc3NfdG9rZW46IFN0cmluZ1xcbiAgcmVmcmVzaF90b2tlbjogU3RyaW5nXFxuICB2YWxpZDogQm9vbGVhblxcbn1cXG5cXG50eXBlIEFjY2Vzc0RldGFpbHNSZXNwb25zZSB7XFxuICBhdXRob3JpemVkOiBCb29sZWFuXFxuICBhY2Nlc3NVdWlkOiBTdHJpbmdcXG4gIHVzZXJJZDogU3RyaW5nXFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBlbWFpbDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBTdHJpbmdcXG4gIHZlcmlmaWVkOiBCb29sZWFuXFxuICBleHA6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBFZHVjYXRpb25JbnB1dCB7XFxuICBlZHVjYXRpb246IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBQcm9maWxlU2VjdXJpdHlJbnB1dCB7XFxuICBwYXNzd29yZDogU3RyaW5nXFxuICBhY2NvdW50VHlwZTogQWNjb3VudFR5cGVcXG59XFxuXFxuaW5wdXQgUHJvZmlsZUlucHV0IHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVySW5wdXRcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsSW5wdXRcXG4gIGdlbmRlcjogR2VuZGVyXFxuICBiaXJ0aGRhdGU6IFRpbWVzdGFtcElucHV0XFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25JbnB1dFxcbiAgYWRkcmVzczogQWRkcmVzc0lucHV0XFxuICBzZWN1cml0eTogUHJvZmlsZVNlY3VyaXR5SW5wdXRcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVVc2VybmFtZUlucHV0IHtcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVFbWFpbElucHV0IHtcXG4gIGVtYWlsOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgQXV0aFJlcXVlc3RJbnB1dCB7XFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBwYXNzd29yZDogU3RyaW5nXFxufVxcblxcbmlucHV0IFRva2VuUmVxdWVzdCB7XFxuICB0b2tlbjogU3RyaW5nXFxuICBhY2Nlc3NVdWlkOiBTdHJpbmdcXG4gIHVzZXJJZDogU3RyaW5nXFxufVxcblxcbmV4dGVuZCB0eXBlIFF1ZXJ5IHtcXG4gIFZhbGlkYXRlVXNlcm5hbWUoaW5wdXQ6IFZhbGlkYXRlVXNlcm5hbWVJbnB1dCEpOiBEZWZhdWx0UmVzcG9uc2UhXFxuICBWYWxpZGF0ZUVtYWlsKGlucHV0OiBWYWxpZGF0ZUVtYWlsSW5wdXQhKTogRGVmYXVsdFJlc3BvbnNlIVxcbiAgVmVyaWZ5VG9rZW4oaW5wdXQ6IFRva2VuUmVxdWVzdCk6IEFjY2Vzc0RldGFpbHNSZXNwb25zZSFcXG4gIFJlZnJlc2hUb2tlbihpbnB1dDogVG9rZW5SZXF1ZXN0KTogQXV0aFJlc3BvbnNlIVxcbiAgUmVhZFByb2ZpbGUoaW5wdXQ6IElkSW5wdXQhKTogUHJvZmlsZSFcXG59XFxuXFxuZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xcbiAgQ3JlYXRlUHJvZmlsZShpbnB1dDogUHJvZmlsZUlucHV0ISk6IElkIVxcbiAgQXV0aChpbnB1dDogQXV0aFJlcXVlc3RJbnB1dCk6IEF1dGhSZXNwb25zZSFcXG4gIExvZ291dChpbnB1dDogVG9rZW5SZXF1ZXN0KTogRGVmYXVsdFJlc3BvbnNlIVxcbn1cXG5cIiIsImltcG9ydCBwcm9maWxlQ2xpZW50IGZyb20gJ2NsaWVudC9wcm9maWxlJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jcmVhdGVQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgY29uZmlybVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jb25maXJtUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlYWRQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQucmVhZFByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB1cGRhdGVQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudXBkYXRlUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVXNlcm5hbWUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52YWxpZGF0ZVVzZXJuYW1lKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmFsaWRhdGVFbWFpbCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZhbGlkYXRlRW1haWwpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBhdXRoID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuYXV0aCkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZlcmlmeVRva2VuID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmVyaWZ5VG9rZW4pLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBsb2dvdXQgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5sb2dvdXQpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCByZWZyZXNoVG9rZW4gPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5yZWZyZXNoVG9rZW4pLmJpbmQocHJvZmlsZUNsaWVudClcbiIsImltcG9ydCB7IE11dGF0aW9uUmVzb2x2ZXJzLCBRdWVyeVJlc29sdmVycywgUmVzb2x2ZXJzLCBTdWJzY3JpcHRpb25SZXNvbHZlcnMgfSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcblxuY29uc3QgUXVlcnk6IFF1ZXJ5UmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ2RvZG8gZHVjayBsaXZlcyBoZXJlJ1xufVxuY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ0RvZG8gRHVjaydcbn1cbmNvbnN0IFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKF8sIF9fLCB7IHB1YnN1YiB9KSA9PiBwdWJzdWIuYXN5bmNJdGVyYXRvcignRE9ET19EVUNLJylcbn1cblxuY29uc3Qgcm9vdFJlc29sdmVyczogUmVzb2x2ZXJzID0ge1xuXHRRdWVyeSxcblx0TXV0YXRpb24sXG5cdFN1YnNjcmlwdGlvbixcblx0UmVzdWx0OiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXG5cdFx0XHRyZXR1cm4gJ0pvYidcblx0XHR9XG5cdH0sXG5cdElOb2RlOiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXHRcdFx0Ly8gaWYgKG5vZGUuc3RhcnMpIHJldHVybiAnUmV2aWV3J1xuXG5cdFx0XHRyZXR1cm4gJ0NvbXBhbnknXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIEFwcGxpY2FudCB7XFxuICBhcHBsaWNhdGlvbnM6IFtTdHJpbmddIVxcbiAgc2hvcnRsaXN0ZWQ6IFtTdHJpbmddIVxcbiAgb25ob2xkOiBbU3RyaW5nXSFcXG4gIHJlamVjdGVkOiBbU3RyaW5nXSFcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBTb3J0IHtcXG4gIEFTQ1xcbiAgREVTQ1xcbn1cXG5cXG50eXBlIFBhZ2luYXRpb24ge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUGFnaW5hdGlvbklucHV0IHtcXG4gIHBhZ2U6IEludFxcbiAgZmlyc3Q6IEludFxcbiAgYWZ0ZXI6IFN0cmluZ1xcbiAgb2Zmc2V0OiBJbnRcXG4gIGxpbWl0OiBJbnRcXG4gIHNvcnQ6IFNvcnRcXG4gIHByZXZpb3VzOiBTdHJpbmdcXG4gIG5leHQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIE1ldGFkYXRhIHtcXG4gIGNyZWF0ZWRfYXQ6IFRpbWVzdGFtcFxcbiAgdXBkYXRlZF9hdDogVGltZXN0YW1wXFxuICBwdWJsaXNoZWRfZGF0ZTogVGltZXN0YW1wXFxuICBlbmRfZGF0ZTogVGltZXN0YW1wXFxuICBsYXN0X2FjdGl2ZTogVGltZXN0YW1wXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gUHJvZmlsZU9wZXJhdGlvbk9wdGlvbnMge1xcbiAgQ1JFQVRFXFxuICBSRUFEXFxuICBVUERBVEVcXG4gIERFTEVURVxcbiAgQlVMS19VUERBVEVcXG59XFxuXFxudHlwZSBNYXBQcm9maWxlUGVybWlzc2lvbiB7XFxuICBrZXk6IFN0cmluZ1xcbiAgcHJvZmlsZU9wZXJhdGlvbnM6IFtQcm9maWxlT3BlcmF0aW9uT3B0aW9uc11cXG59XFxuXFxudHlwZSBQZXJtaXNzaW9uc0Jhc2Uge1xcbiAgcGVybWlzc2lvbnM6IE1hcFByb2ZpbGVQZXJtaXNzaW9uXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgUmF0aW5nIHtcXG4gIGF1dGhvcjogU3RyaW5nXFxuICBiZXN0UmF0aW5nOiBJbnRcXG4gIGV4cGxhbmF0aW9uOiBTdHJpbmdcXG4gIHZhbHVlOiBJbnRcXG4gIHdvcnN0UmF0aW5nOiBJbnRcXG59XFxuXFxudHlwZSBBZ2dyZWdhdGVSYXRpbmcge1xcbiAgaXRlbVJldmlld2VkOiBTdHJpbmchXFxuICByYXRpbmdDb3VudDogSW50IVxcbiAgcmV2aWV3Q291bnQ6IEludFxcbn1cXG5cXG50eXBlIFJldmlldyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZ1xcbiAgYXNwZWN0OiBTdHJpbmdcXG4gIGJvZHk6IFN0cmluZ1xcbiAgcmF0aW5nOiBTdHJpbmdcXG59XFxuXFxudHlwZSBHZW9Mb2NhdGlvbiB7XFxuICBlbGV2YXRpb246IEludFxcbiAgbGF0aXR1ZGU6IEludFxcbiAgbG9uZ2l0dWRlOiBJbnRcXG4gIHBvc3RhbENvZGU6IEludFxcbn1cXG5cXG50eXBlIEFkZHJlc3Mge1xcbiAgY291bnRyeTogU3RyaW5nIVxcbiAgbG9jYWxpdHk6IFN0cmluZ1xcbiAgcmVnaW9uOiBTdHJpbmdcXG4gIHBvc3RhbENvZGU6IEludFxcbiAgc3RyZWV0OiBTdHJpbmdcXG59XFxuXFxudHlwZSBQbGFjZSB7XFxuICBhZGRyZXNzOiBBZGRyZXNzXFxuICByZXZpZXc6IFJldmlld1xcbiAgYWdncmVnYXRlUmF0aW5nOiBBZ2dyZWdhdGVSYXRpbmdcXG4gIGJyYW5jaENvZGU6IFN0cmluZ1xcbiAgZ2VvOiBHZW9Mb2NhdGlvblxcbn1cXG5cXG5pbnB1dCBBZGRyZXNzSW5wdXQge1xcbiAgY291bnRyeTogU3RyaW5nXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIFJhbmdlIHtcXG4gIG1pbjogSW50IVxcbiAgbWF4OiBJbnQhXFxufVxcblxcbnR5cGUgRGVmYXVsdFJlc3BvbnNlIHtcXG4gIHN0YXR1czogQm9vbGVhblxcbiAgZXJyb3I6IFN0cmluZ1xcbiAgY29kZTogSW50XFxufVxcblxcbnR5cGUgSWQge1xcbiAgaWQ6IElEIVxcbn1cXG5cXG5lbnVtIEVtYWlsU3RhdHVzIHtcXG4gIFdBSVRJTkdcXG4gIENPTkZJUk1FRFxcbiAgQkxPQ0tFRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG50eXBlIEVtYWlsIHtcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIHN0YXR1czogRW1haWxTdGF0dXNcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBBdHRhY2htZW50IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxuICB1cGxvYWREYXRlOiBUaW1lc3RhbXBcXG4gIHVybDogU3RyaW5nXFxuICB1c2VyOiBTdHJpbmdcXG4gIGZvbGRlcjogU3RyaW5nXFxufVxcblxcbnR5cGUgSWRlbnRpZmllciB7XFxuICBpZGVudGlmaWVyOiBTdHJpbmchXFxuICBuYW1lOiBTdHJpbmdcXG4gIGFsdGVybmF0ZU5hbWU6IFN0cmluZ1xcbiAgdHlwZTogU3RyaW5nXFxuICBhZGRpdGlvbmFsVHlwZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBkaXNhbWJpZ3VhdGluZ0Rlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGhlYWRsaW5lOiBTdHJpbmdcXG4gIHNsb2dhbjogU3RyaW5nXFxufVxcblxcbmlucHV0IFJhbmdlSW5wdXQge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxuaW5wdXQgSWRJbnB1dCB7XFxuICBpZDogSUQhXFxufVxcblxcbmlucHV0IEVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBBdHRhY2htZW50SW5wdXQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG4gIHVzZXI6IFN0cmluZ1xcbiAgZm9sZGVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgSWRlbnRpZmllcklucHV0IHtcXG4gIG5hbWU6IFN0cmluZ1xcbiAgYWx0ZXJuYXRlTmFtZTogU3RyaW5nXFxuICB0eXBlOiBTdHJpbmdcXG4gIGFkZGl0aW9uYWxUeXBlOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGRpc2FtYmlndWF0aW5nRGVzY3JpcHRpb246IFN0cmluZ1xcbiAgaGVhZGxpbmU6IFN0cmluZ1xcbiAgc2xvZ2FuOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBEYXlzT2ZXZWVrIHtcXG4gIE1PTkRBWVxcbiAgVFVFU0RBWVxcbiAgV0VETkVTREFZXFxuICBUSFJVU0RBWVxcbiAgRlJJREFZXFxuICBTVEFVUkRBWVxcbiAgU1VOREFZXFxufVxcblxcbnR5cGUgVGltZXN0YW1wIHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFRpbWUge1xcbiAgb3BlbnM6IFRpbWVzdGFtcFxcbiAgY2xvc2VzOiBUaW1lc3RhbXBcXG4gIGRheXNPZldlZWs6IERheXNPZldlZWtcXG4gIHZhbGlkRnJvbTogVGltZXN0YW1wXFxuICB2YWxpZFRocm91Z2g6IFRpbWVzdGFtcFxcbn1cXG5cXG5pbnB1dCBUaW1lc3RhbXBJbnB1dCB7XFxuICBzZWNvbmRzOiBTdHJpbmdcXG4gIG5hbm9zOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwic2NhbGFyIERhdGVcXG5cXG50eXBlIEVkZ2Uge1xcbiAgY3Vyc29yOiBTdHJpbmchXFxuICBub2RlOiBbUmVzdWx0IV0hXFxufVxcblxcbnR5cGUgUGFnZUluZm8ge1xcbiAgZW5kQ3Vyc29yOiBTdHJpbmchXFxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcXG59XFxuXFxuaW50ZXJmYWNlIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnVuaW9uIFJlc3VsdCA9IEpvYiB8IENvbXBhbnlcXG5cXG50eXBlIFF1ZXJ5IHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgTXV0YXRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBTdWJzY3JpcHRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxuc2NoZW1hIHtcXG4gIHF1ZXJ5OiBRdWVyeVxcbiAgbXV0YXRpb246IE11dGF0aW9uXFxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGFwcGxpY2FudHNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGNvbXBhbnlTY2hlbWEgZnJvbSAnY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY3Vyc29yU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9jdXJzb3IuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGRlcHRoTGltaXQgZnJvbSAnZ3JhcGhxbC1kZXB0aC1saW1pdCdcbmltcG9ydCAqIGFzIGpvYlNjaGVtYSBmcm9tICdjbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIG1ldGFkYXRhU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9tZXRhZGF0YS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcGVybWlzc2lvbnNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwbGFjZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvcGxhY2UuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHByb2ZpbGVTY2hlbWEgZnJvbSAnY2xpZW50L3Byb2ZpbGUvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcm9vdFNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBzeXN0ZW1TY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3N5c3RlbS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgdGltZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvdGltZS5ncmFwaHFsJ1xuXG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIFB1YlN1YiB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcbmltcG9ydCB7IGFwcFRyYWNlciwgc3BhbiB9IGZyb20gJ2luZGV4J1xuaW1wb3J0IHByb2ZpbGVSZXNvbHZlcnMsIHsgZXh0cmFjdFRva2VuTWV0YWRhdGEgfSBmcm9tICdjbGllbnQvcHJvZmlsZS9yZXNvbHZlcidcblxuaW1wb3J0IHsgQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIH0gZnJvbSAnZ2VuZXJhdGVkL2dyYXBocWwnXG5pbXBvcnQgeyBSZWRpc0NhY2hlIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1jYWNoZS1yZWRpcydcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgU3BhbiB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L3RyYWNpbmcnXG5pbXBvcnQgeyBUcmFjZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknXG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICdzZXJ2aWNlL2NvbmZpZy9yZWRpcydcbmltcG9ydCBjcmVhdGVHcmFwaFFMRXJyb3JGb3JtYXR0ZXIgZnJvbSAnc2VydmljZS9lcnJvci9ncmFwaHFsLmVycm9yJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ2xvZGFzaCdcbmltcG9ydCByb290UmVzb2x2ZXJzIGZyb20gJ2NsaWVudC9yb290L3Jlc29sdmVyJ1xuaW1wb3J0IHdpbnN0b24gZnJvbSAnd2luc3RvbidcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gW1xuXHRyb290U2NoZW1hLFxuXHRhcHBsaWNhbnRzU2NoZW1hLFxuXHRjdXJzb3JTY2hlbWEsXG5cdG1ldGFkYXRhU2NoZW1hLFxuXHRwbGFjZVNjaGVtYSxcblx0c3lzdGVtU2NoZW1hLFxuXHRwZXJtaXNzaW9uc1NjaGVtYSxcblx0dGltZVNjaGVtYSxcblx0cHJvZmlsZVNjaGVtYSxcblx0Y29tcGFueVNjaGVtYSxcblx0am9iU2NoZW1hXG5dXG5leHBvcnQgY29uc3QgcmVzb2x2ZXJzID0gbWVyZ2Uoe30sIHJvb3RSZXNvbHZlcnMsIHByb2ZpbGVSZXNvbHZlcnMpXG5leHBvcnQgaW50ZXJmYWNlIE9vSm9iQ29udGV4dCB7XG5cdHJlcTogUmVxdWVzdFxuXHRwdWJzdWI6IFB1YlN1YlxuXHRhcHBUcmFjZXI6IFRyYWNlclxuXHRzcGFuOiBTcGFuXG5cdHRva2VuOiBzdHJpbmdcblx0YWNjZXNzRGV0YWlsczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlXG5cdGxvZ2dlcjogd2luc3Rvbi5Mb2dnZXJcbn1cbmNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuXHR0eXBlRGVmcyxcblx0cmVzb2x2ZXJzLFxuXHRmb3JtYXRFcnJvcjogY3JlYXRlR3JhcGhRTEVycm9yRm9ybWF0dGVyKCksXG5cdGNvbnRleHQ6IGFzeW5jICh7IHJlcSwgY29ubmVjdGlvbiB9KSA9PiB7XG5cdFx0Y29uc3QgdG9rZW5EYXRhID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvblxuXHRcdGxldCB0b2tlbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cdFx0bGV0IGFjY2Vzc0RldGFpbHM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG5cdFx0aWYgKHRva2VuRGF0YSkge1xuXHRcdFx0dG9rZW4gPSB0b2tlbkRhdGEuc3BsaXQoJyAnKVsxXVxuXHRcdH1cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdGFjY2Vzc0RldGFpbHMgPSBhd2FpdCBleHRyYWN0VG9rZW5NZXRhZGF0YSh0b2tlbilcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVxLFxuXHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdHB1YnN1Yixcblx0XHRcdGFwcFRyYWNlcixcblx0XHRcdHNwYW4sXG5cdFx0XHRhY2Nlc3NEZXRhaWxzLFxuXHRcdFx0dG9rZW4sXG5cdFx0XHRsb2dnZXJcblx0XHR9XG5cdH0sXG5cdHRyYWNpbmc6IHRydWUsXG5cdGludHJvc3BlY3Rpb246IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicsXG5cdGVuZ2luZTogZmFsc2UsXG5cdHZhbGlkYXRpb25SdWxlczogW2RlcHRoTGltaXQoMTApXSxcblx0Y2FjaGVDb250cm9sOiB7XG5cdFx0Y2FsY3VsYXRlSHR0cEhlYWRlcnM6IGZhbHNlLFxuXHRcdC8vIENhY2hlIGV2ZXJ5dGhpbmcgZm9yIGF0IGxlYXN0IGEgbWludXRlIHNpbmNlIHdlIG9ubHkgY2FjaGUgcHVibGljIHJlc3BvbnNlc1xuXHRcdGRlZmF1bHRNYXhBZ2U6IDYwXG5cdH0sXG5cdGNhY2hlOiBuZXcgUmVkaXNDYWNoZSh7XG5cdFx0Li4uY29uZmlnLFxuXHRcdGtleVByZWZpeDogJ2Fwb2xsby1jYWNoZTonXG5cdH0pXG59KVxuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXJcbiIsImltcG9ydCAnZG90ZW52L2NvbmZpZydcblxuaW1wb3J0IHsgYXBwLCBzZXJ2ZXIsIHN0YXJ0U3luY1NlcnZlciwgc3RvcFNlcnZlciB9IGZyb20gJ29vam9iLnNlcnZlcidcbmltcG9ydCB7IGZvcmssIGlzTWFzdGVyLCBvbiB9IGZyb20gJ2NsdXN0ZXInXG5cbmltcG9ydCBsb2dnZXIgZnJvbSAnbG9nZ2VyJ1xuaW1wb3J0IHRyYWNlciBmcm9tICd0cmFjZXInXG5cbmRlY2xhcmUgY29uc3QgbW9kdWxlOiBhbnlcblxuZXhwb3J0IGNvbnN0IGFwcFRyYWNlciA9IHRyYWNlcignc2VydmljZTpnYXRld2F5JylcbmV4cG9ydCBjb25zdCBzcGFuID0gYXBwVHJhY2VyLnN0YXJ0U3BhbignZ3JwYzpzZXJ2aWNlJylcblxuY29uc3Qgc3RhcnQgPSBhc3luYyAoKSA9PiB7XG5cdGNvbnN0IHsgUE9SVCB9ID0gcHJvY2Vzcy5lbnZcblx0Y29uc3QgcG9ydCA9IFBPUlQgfHwgJzgwODAnXG5cblx0dHJ5IHtcblx0XHRhd2FpdCBzdG9wU2VydmVyKClcblx0XHRhd2FpdCBzdGFydFN5bmNTZXJ2ZXIocG9ydClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdTZXJ2ZXIgRmFpbGVkIHRvIHN0YXJ0Jylcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdHByb2Nlc3MuZXhpdCgxKVxuXHR9XG59XG5cbmlmIChpc01hc3Rlcikge1xuXHRjb25zdCBudW1DUFVzID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoXG5cblx0bG9nZ2VyLmluZm8oYE1hc3RlciAke3Byb2Nlc3MucGlkfSBpcyBydW5uaW5nYClcblxuXHQvLyBGb3JrIHdvcmtlcnMuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ1BVczsgaSsrKSB7XG5cdFx0Zm9yaygpXG5cdH1cblxuXHRvbignZm9yaycsICh3b3JrZXIpID0+IHtcblx0XHRsb2dnZXIuaW5mbygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxuXG5cdG9uKCdleGl0JywgKHdvcmtlcikgPT4ge1xuXHRcdGxvZ2dlci5pbmZvKCd3b3JrZXIgaXMgZGVhZDonLCB3b3JrZXIuaXNEZWFkKCkpXG5cdH0pXG59IGVsc2Uge1xuXHQvKipcblx0ICogW2lmIEhvdCBNb2R1bGUgZm9yIHdlYnBhY2tdXG5cdCAqIEBwYXJhbSAge1t0eXBlXX0gbW9kdWxlIFtnbG9iYWwgbW9kdWxlIG5vZGUgb2JqZWN0XVxuXHQgKi9cblx0bGV0IGN1cnJlbnRBcHAgPSBhcHBcblx0aWYgKG1vZHVsZS5ob3QpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdCgnb29qb2Iuc2VydmVyJywgKCkgPT4ge1xuXHRcdFx0c2VydmVyLnJlbW92ZUxpc3RlbmVyKCdyZXF1ZXN0JywgY3VycmVudEFwcClcblx0XHRcdHNlcnZlci5vbigncmVxdWVzdCcsIGFwcClcblx0XHRcdGN1cnJlbnRBcHAgPSBhcHBcblx0XHR9KVxuXG5cdFx0LyoqXG5cdFx0ICogTmV4dCBjYWxsYmFjayBpcyBlc3NlbnRpYWw6XG5cdFx0ICogQWZ0ZXIgY29kZSBjaGFuZ2VzIHdlcmUgYWNjZXB0ZWQgd2UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHAuXG5cdFx0ICogc2VydmVyLmNsb3NlKCkgaXMgaGVyZSBFeHByZXNzLkpTLXNwZWNpZmljIGFuZCBjYW4gZGlmZmVyIGluIG90aGVyIGZyYW1ld29ya3MuXG5cdFx0ICogVGhlIGlkZWEgaXMgdGhhdCB5b3Ugc2hvdWxkIHNodXQgZG93biB5b3VyIGFwcCBoZXJlLlxuXHRcdCAqIERhdGEvc3RhdGUgc2F2aW5nIGJldHdlZW4gc2h1dGRvd24gYW5kIG5ldyBzdGFydCBpcyBwb3NzaWJsZVxuXHRcdCAqL1xuXHRcdG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBzZXJ2ZXIuY2xvc2UoKSlcblx0fVxuXG5cdC8vIFdvcmtlcnMgY2FuIHNoYXJlIGFueSBUQ1AgY29ubmVjdGlvblxuXHQvLyBJbiB0aGlzIGNhc2UgaXQgaXMgYW4gSFRUUCBzZXJ2ZXJcblx0c3RhcnQoKVxuXG5cdGxvZ2dlci5pbmZvKGBXb3JrZXIgJHtwcm9jZXNzLnBpZH0gc3RhcnRlZGApXG59XG4iLCJpbXBvcnQgeyBMb2dnZXIsIExvZ2dlck9wdGlvbnMsIGNyZWF0ZUxvZ2dlciwgZm9ybWF0LCB0cmFuc3BvcnRzIH0gZnJvbSAnd2luc3RvbidcbmltcG9ydCB7IGJhc2VuYW1lLCBqb2luIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMsIG1rZGlyU3luYyB9IGZyb20gJ2ZzJ1xuXG5jb25zdCB7IGNvbWJpbmUsIHRpbWVzdGFtcCwgcHJldHR5UHJpbnQgfSA9IGZvcm1hdFxuY29uc3QgbG9nRGlyZWN0b3J5ID0gam9pbihfX2Rpcm5hbWUsICdsb2cnKVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG50eXBlIElMb2dnZXJPcHRpb25zID0geyBmaWxlOiBMb2dnZXJPcHRpb25zOyBjb25zb2xlOiBMb2dnZXJPcHRpb25zIH1cblxuY29uc3QgeyBGSUxFX0xPR19MRVZFTCwgQ09OU09MRV9MT0dfTEVWRUwgfSA9IHByb2Nlc3MuZW52XG5leHBvcnQgY29uc3QgbG9nZ2VyT3B0aW9ucyA9IHtcblx0ZmlsZToge1xuXHRcdGxldmVsOiBGSUxFX0xPR19MRVZFTCB8fCAnaW5mbycsXG5cdFx0ZmlsZW5hbWU6IGAke2xvZ0RpcmVjdG9yeX0vbG9ncy9hcHAubG9nYCxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IHRydWUsXG5cdFx0bWF4c2l6ZTogNTI0Mjg4MCwgLy8gNU1CXG5cdFx0bWF4RmlsZXM6IDUsXG5cdFx0Y29sb3JpemU6IGZhbHNlXG5cdH0sXG5cdGNvbnNvbGU6IHtcblx0XHRsZXZlbDogQ09OU09MRV9MT0dfTEVWRUwgfHwgJ2RlYnVnJyxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IGZhbHNlLFxuXHRcdGNvbG9yaXplOiB0cnVlXG5cdH1cbn1cblxuY29uc3QgbG9nZ2VyVHJhbnNwb3J0cyA9IFtcblx0bmV3IHRyYW5zcG9ydHMuQ29uc29sZSh7XG5cdFx0Li4ubG9nZ2VyT3B0aW9ucy5jb25zb2xlLFxuXHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRmb3JtYXQudGltZXN0YW1wKCksXG5cdFx0XHRmb3JtYXQuY29sb3JpemUoeyBhbGw6IHRydWUgfSksXG5cdFx0XHRmb3JtYXQuYWxpZ24oKSxcblx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IHtcblx0XHRcdFx0Y29uc3QgeyBsZXZlbCwgbWVzc2FnZSwgbGFiZWwgfSA9IGluZm9cblx0XHRcdFx0Ly8gJHtPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPyBKU09OLnN0cmluZ2lmeShhcmdzLCBudWxsLCAyKSA6ICcnfVxuXG5cdFx0XHRcdHJldHVybiBgJHtsZXZlbH0gWyR7bGFiZWx9XTogJHttZXNzYWdlfWBcblx0XHRcdH0pXG5cdFx0KVxuXHR9KVxuXVxuXG5jbGFzcyBBcHBMb2dnZXIge1xuXHRwdWJsaWMgbG9nZ2VyOiBMb2dnZXJcblx0cHVibGljIGxvZ2dlck9wdGlvbnM6IElMb2dnZXJPcHRpb25zXG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogSUxvZ2dlck9wdGlvbnMpIHtcblx0XHRpZiAoIWlzRGV2ZWxvcG1lbnQpIHtcblx0XHRcdGV4aXN0c1N5bmMobG9nRGlyZWN0b3J5KSB8fCBta2RpclN5bmMobG9nRGlyZWN0b3J5KVxuXHRcdH1cblxuXHRcdHRoaXMubG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcblx0XHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRcdGZvcm1hdC5sYWJlbCh7IGxhYmVsOiBiYXNlbmFtZShwcm9jZXNzLm1haW5Nb2R1bGUgPyBwcm9jZXNzLm1haW5Nb2R1bGUuZmlsZW5hbWUgOiAndW5rbm93bi5maWxlJykgfSksXG5cdFx0XHRcdGZvcm1hdC50aW1lc3RhbXAoeyBmb3JtYXQ6ICdZWVlZLU1NLUREIEhIOm1tOnNzJyB9KVxuXHRcdFx0KSxcblx0XHRcdHRyYW5zcG9ydHM6IGlzRGV2ZWxvcG1lbnRcblx0XHRcdFx0PyBbLi4ubG9nZ2VyVHJhbnNwb3J0c11cblx0XHRcdFx0OiBbXG5cdFx0XHRcdFx0XHQuLi5sb2dnZXJUcmFuc3BvcnRzLFxuXHRcdFx0XHRcdFx0bmV3IHRyYW5zcG9ydHMuRmlsZSh7XG5cdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMuZmlsZSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBjb21iaW5lKFxuXHRcdFx0XHRcdFx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IGAke2luZm8udGltZXN0YW1wfSAke2luZm8ubGV2ZWx9IFske2luZm8ubGFiZWx9XTogJHtpbmZvLm1lc3NhZ2V9YClcblx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0ICBdLFxuXHRcdFx0ZXhpdE9uRXJyb3I6IGZhbHNlXG5cdFx0fSlcblx0fVxufVxuXG5jb25zdCB7IGxvZ2dlciB9ID0gbmV3IEFwcExvZ2dlcihsb2dnZXJPcHRpb25zKVxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyXG4iLCJpbXBvcnQgKiBhcyBjb3JzTGlicmFyeSBmcm9tICdjb3JzJ1xuXG5jb25zdCB7IE5PREVfRU5WID0gJ2RldmVsb3BtZW50JywgTk9XX1VSTCA9ICdodHRwczovL29vam9iLmlvJywgRk9SQ0VfREVWID0gZmFsc2UgfSA9IHByb2Nlc3MuZW52XG5jb25zdCBwcm9kVXJscyA9IFsnaHR0cHM6Ly9vb2pvYi5pbycsICdodHRwczovL2FscGhhLm9vam9iLmlvJywgJ2h0dHBzOi8vYmV0YS5vb2pvYi5pbycsIE5PV19VUkxdXG5jb25zdCBpc1Byb2R1Y3Rpb24gPSBOT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICFGT1JDRV9ERVZcblxuY29uc3QgY29yc09wdGlvbiA9IHtcblx0b3JpZ2luOiBpc1Byb2R1Y3Rpb24gPyBwcm9kVXJscy5maWx0ZXIoQm9vbGVhbikgOiBbL2xvY2FsaG9zdC9dLFxuXHRtZXRob2RzOiAnR0VULCBIRUFELCBQVVQsIFBBVENILCBQT1NULCBERUxFVEUsIE9QVElPTicsXG5cdGNyZWRlbnRpYWxzOiB0cnVlLFxuXHRleHBvc2VkSGVhZGVyczogWydhdXRob3JpemF0aW9uJ11cbn1cblxuY29uc3QgY29ycyA9ICgpID0+IGNvcnNMaWJyYXJ5KGNvcnNPcHRpb24pXG5leHBvcnQgZGVmYXVsdCBjb3JzXG4iLCJpbXBvcnQgKiBhcyBob3N0VmFsaWRhdGlvbiBmcm9tICdob3N0LXZhbGlkYXRpb24nXG5cbi8vIE5PVEUoQG14c3Ricik6XG4vLyAtIEhvc3QgaGVhZGVyIG9ubHkgY29udGFpbnMgdGhlIGRvbWFpbiwgc28gc29tZXRoaW5nIGxpa2UgJ2J1aWxkLWFwaS1hc2RmMTIzLm5vdy5zaCcgb3IgJ29vam9iLmlvJ1xuLy8gLSBSZWZlcmVyIGhlYWRlciBjb250YWlucyB0aGUgZW50aXJlIFVSTCwgc28gc29tZXRoaW5nIGxpa2Vcbi8vICdodHRwczovL2J1aWxkLWFwaS1hc2RmMTIzLm5vdy5zaC9mb3J3YXJkJyBvciAnaHR0cHM6Ly9vb2pvYi5pby9mb3J3YXJkJ1xuLy8gVGhhdCBtZWFucyB3ZSBoYXZlIHRvIGNoZWNrIHRoZSBIb3N0IHNsaWdodGx5IGRpZmZlcmVudGx5IGZyb20gdGhlIFJlZmVyZXIgdG8gYXZvaWQgdGhpbmdzXG4vLyBsaWtlICdteS1kb21haW4tb29qb2IuaW8nIHRvIGJlIGFibGUgdG8gaGFjayBvdXIgdXNlcnNcblxuLy8gSG9zdHMsIHdpdGhvdXQgaHR0cChzKTovLyBhbmQgcGF0aHNcbmNvbnN0IHsgTk9XX1VSTCA9ICdodHRwOi8vb29qb2IuaW8nIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgdHJ1c3RlZEhvc3RzID0gW1xuXHROT1dfVVJMICYmIG5ldyBSZWdFeHAoYF4ke05PV19VUkwucmVwbGFjZSgnaHR0cHM6Ly8nLCAnJyl9JGApLFxuXHQvXm9vam9iXFwuaW8kLywgLy8gVGhlIERvbWFpblxuXHQvXi4qXFwub29qb2JcXC5pbyQvIC8vIEFsbCBzdWJkb21haW5zXG5dLmZpbHRlcihCb29sZWFuKVxuXG4vLyBSZWZlcmVycywgd2l0aCBodHRwKHMpOi8vIGFuZCBwYXRoc1xuY29uc3QgdHJ1c3RlZFJlZmVyZXJzID0gW1xuXHROT1dfVVJMICYmIG5ldyBSZWdFeHAoYF4ke05PV19VUkx9KCR8XFwvLiopYCksXG5cdC9eaHR0cHM6XFwvXFwvb29qb2JcXC5pbygkfFxcLy4qKS8sIC8vIFRoZSBEb21haW5cblx0L15odHRwczpcXC9cXC8uKlxcLnNwZWN0cnVtXFwuY2hhdCgkfFxcLy4qKS8gLy8gQWxsIHN1YmRvbWFpbnNcbl0uZmlsdGVyKEJvb2xlYW4pXG5cbmNvbnN0IGNzcmYgPSBob3N0VmFsaWRhdGlvbih7XG5cdGhvc3RzOiB0cnVzdGVkSG9zdHMsXG5cdHJlZmVyZXJzOiB0cnVzdGVkUmVmZXJlcnMsXG5cdG1vZGU6ICdlaXRoZXInXG59KVxuZXhwb3J0IGRlZmF1bHQgY3NyZlxuIiwiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBTZW50cnkgZnJvbSAnc2VydmljZS9jb25maWcvc2VudHJ5J1xuXG5jb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyOiBFcnJvciwgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0aWYgKGVycikge1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyKVxuXHRcdHJlcy5zdGF0dXMoNTAwKS5zZW5kKCdPb3BzLCBzb21ldGhpbmcgd2VudCB3cm9uZyEgT3VyIGVuZ2luZWVycyBoYXZlIGJlZW4gYWxlcnRlZCBhbmQgd2lsbCBmaXggdGhpcyBhc2FwLicpXG5cblx0XHQvLyBjYXB0dXJlIGVycm9yIHdpdGggZXJyb3IgbWV0cmljcyBjb2xsZWN0b3Jcblx0XHRTZW50cnkuY2FwdHVyZUV4Y2VwdGlvbihlcnIpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG5leHQoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVycm9ySGFuZGxlclxuIiwiaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCAqIGFzIGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgU2VudHJ5IGZyb20gJ3NlcnZpY2UvY29uZmlnL3NlbnRyeSdcbmltcG9ydCBjb3JzIGZyb20gJ21pZGRsZXdhcmVzL2NvcnMnXG5pbXBvcnQgY3NyZiBmcm9tICdtaWRkbGV3YXJlcy9jc3JmJ1xuaW1wb3J0IGVycm9ySGFuZGxlciBmcm9tICdtaWRkbGV3YXJlcy9lcnJvci1oYW5kbGVyJ1xuaW1wb3J0IHNlY3VyaXR5IGZyb20gJ21pZGRsZXdhcmVzL3NlY3VyaXR5J1xuaW1wb3J0IHRvb2J1c3kgZnJvbSAnbWlkZGxld2FyZXMvdG9vYnVzeSdcblxuY29uc3QgeyBFTkFCTEVfQ1NQID0gdHJ1ZSwgRU5BQkxFX05PTkNFID0gdHJ1ZSB9ID0gcHJvY2Vzcy5lbnZcblxuY29uc3QgbWlkZGxld2FyZXMgPSAoYXBwOiBBcHBsaWNhdGlvbikgPT4ge1xuXHQvLyBUaGUgcmVxdWVzdCBoYW5kbGVyIG11c3QgYmUgdGhlIGZpcnN0IG1pZGRsZXdhcmUgb24gdGhlIGFwcCBmb3Igc2VudHJ5IHRvIHdvcmsgcHJvcGVybHlcblx0YXBwLnVzZShTZW50cnkuSGFuZGxlcnMucmVxdWVzdEhhbmRsZXIoKSlcblxuXHQvLyBDT1JTIGZvciBjcm9zc3MtdGUgYWNjZXNzXG5cdGFwcC51c2UoY29ycygpKVxuXG5cdC8vIGpzb24gZW5jb2RpbmcgYW5kIGRlY29kaW5nXG5cdGFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuXHRhcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKVxuXG5cdC8vIHNldCBHWmlwIG9uIGhlYWRlcnMgZm9yIHJlcXVlc3QvcmVzcG9uc2Vcblx0YXBwLnVzZShjb21wcmVzc2lvbigpKVxuXG5cdGFwcC51c2UoY3NyZilcblx0Ly8gVGhlIGVycm9yIGhhbmRsZXIgbXVzdCBiZSBiZWZvcmUgYW55IG90aGVyIGVycm9yIG1pZGRsZXdhcmUgYW5kIGFmdGVyIGFsbCBjb250cm9sbGVyc1xuXHRhcHAudXNlKFNlbnRyeS5IYW5kbGVycy5lcnJvckhhbmRsZXIoKSlcblx0YXBwLnVzZShlcnJvckhhbmRsZXIpXG5cblx0c2VjdXJpdHkoYXBwLCB7XG5cdFx0ZW5hYmxlQ1NQOiBCb29sZWFuKEVOQUJMRV9DU1ApLFxuXHRcdGVuYWJsZU5vbmNlOiBCb29sZWFuKEVOQUJMRV9OT05DRSlcblx0fSlcblxuXHQvLyBidXNzeSBzZXJ2ZXIgKHdhaXQgZm9yIGl0IHRvIHJlc29sdmUpXG5cdGFwcC51c2UodG9vYnVzeSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaWRkbGV3YXJlc1xuIiwiaW1wb3J0ICogYXMgaHBwIGZyb20gJ2hwcCdcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgY29udGVudFNlY3VyaXR5UG9saWN5LCBmcmFtZWd1YXJkLCBoc3RzLCBpZU5vT3Blbiwgbm9TbmlmZiwgeHNzRmlsdGVyIH0gZnJvbSAnaGVsbWV0J1xuXG5pbXBvcnQgZXhwcmVzc0VuZm9yY2VzU3NsIGZyb20gJ2V4cHJlc3MtZW5mb3JjZXMtc3NsJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCdcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IHNlY3VyaXR5ID0gKGFwcDogQXBwbGljYXRpb24sIHsgZW5hYmxlTm9uY2UsIGVuYWJsZUNTUCB9OiB7IGVuYWJsZU5vbmNlOiBib29sZWFuOyBlbmFibGVDU1A6IGJvb2xlYW4gfSkgPT4ge1xuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXG5cdC8vIHNlY3VyaXR5IGhlbG1ldCBwYWNrYWdlXG5cdC8vIERvbid0IGV4cG9zZSBhbnkgc29mdHdhcmUgaW5mb3JtYXRpb24gdG8gaGFja2Vycy5cblx0YXBwLmRpc2FibGUoJ3gtcG93ZXJlZC1ieScpXG5cblx0Ly8gRXhwcmVzcyBtaWRkbGV3YXJlIHRvIHByb3RlY3QgYWdhaW5zdCBIVFRQIFBhcmFtZXRlciBQb2xsdXRpb24gYXR0YWNrc1xuXHRhcHAudXNlKGhwcCgpKVxuXG5cdGlmIChpc1Byb2R1Y3Rpb24pIHtcblx0XHRhcHAudXNlKFxuXHRcdFx0aHN0cyh7XG5cdFx0XHRcdC8vIDUgbWlucyBpbiBzZWNvbmRzXG5cdFx0XHRcdC8vIHdlIHdpbGwgc2NhbGUgdGhpcyB1cCBpbmNyZW1lbnRhbGx5IHRvIGVuc3VyZSB3ZSBkb250IGJyZWFrIHRoZVxuXHRcdFx0XHQvLyBhcHAgZm9yIGVuZCB1c2Vyc1xuXHRcdFx0XHQvLyBzZWUgZGVwbG95bWVudCByZWNvbW1lbmRhdGlvbnMgaGVyZSBodHRwczovL2hzdHNwcmVsb2FkLm9yZy8/ZG9tYWluPXNwZWN0cnVtLmNoYXRcblx0XHRcdFx0bWF4QWdlOiAzMDAsXG5cdFx0XHRcdGluY2x1ZGVTdWJEb21haW5zOiB0cnVlLFxuXHRcdFx0XHRwcmVsb2FkOiB0cnVlXG5cdFx0XHR9KVxuXHRcdClcblxuXHRcdGFwcC51c2UoZXhwcmVzc0VuZm9yY2VzU3NsKCkpXG5cdH1cblxuXHQvLyBUaGUgWC1GcmFtZS1PcHRpb25zIGhlYWRlciB0ZWxscyBicm93c2VycyB0byBwcmV2ZW50IHlvdXIgd2VicGFnZSBmcm9tIGJlaW5nIHB1dCBpbiBhbiBpZnJhbWUuXG5cdGFwcC51c2UoZnJhbWVndWFyZCh7IGFjdGlvbjogJ3NhbWVvcmlnaW4nIH0pKVxuXG5cdC8vIENyb3NzLXNpdGUgc2NyaXB0aW5nLCBhYmJyZXZpYXRlZCB0byDigJxYU1PigJ0sIGlzIGEgd2F5IGF0dGFja2VycyBjYW4gdGFrZSBvdmVyIHdlYnBhZ2VzLlxuXHRhcHAudXNlKHhzc0ZpbHRlcigpKVxuXG5cdC8vIFNldHMgdGhlIFgtRG93bmxvYWQtT3B0aW9ucyB0byBwcmV2ZW50IEludGVybmV0IEV4cGxvcmVyIGZyb20gZXhlY3V0aW5nXG5cdC8vIGRvd25sb2FkcyBpbiB5b3VyIHNpdGXigJlzIGNvbnRleHQuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9pZW5vb3Blbi9cblx0YXBwLnVzZShpZU5vT3BlbigpKVxuXG5cdC8vIERvbuKAmXQgU25pZmYgTWltZXR5cGUgbWlkZGxld2FyZSwgbm9TbmlmZiwgaGVscHMgcHJldmVudCBicm93c2VycyBmcm9tIHRyeWluZ1xuXHQvLyB0byBndWVzcyAo4oCcc25pZmbigJ0pIHRoZSBNSU1FIHR5cGUsIHdoaWNoIGNhbiBoYXZlIHNlY3VyaXR5IGltcGxpY2F0aW9ucy4gSXRcblx0Ly8gZG9lcyB0aGlzIGJ5IHNldHRpbmcgdGhlIFgtQ29udGVudC1UeXBlLU9wdGlvbnMgaGVhZGVyIHRvIG5vc25pZmYuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9kb250LXNuaWZmLW1pbWV0eXBlL1xuXHRhcHAudXNlKG5vU25pZmYoKSlcblxuXHRpZiAoZW5hYmxlTm9uY2UpIHtcblx0XHQvLyBBdHRhY2ggYSB1bmlxdWUgXCJub25jZVwiIHRvIGV2ZXJ5IHJlc3BvbnNlLiBUaGlzIGFsbG93cyB1c2UgdG8gZGVjbGFyZVxuXHRcdC8vIGlubGluZSBzY3JpcHRzIGFzIGJlaW5nIHNhZmUgZm9yIGV4ZWN1dGlvbiBhZ2FpbnN0IG91ciBjb250ZW50IHNlY3VyaXR5IHBvbGljeS5cblx0XHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRcdGFwcC51c2UoKHJlcXVlc3Q6IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdFx0XHRyZXNwb25zZS5sb2NhbHMubm9uY2UgPSB1dWlkLnY0KClcblx0XHRcdG5leHQoKVxuXHRcdH0pXG5cdH1cblxuXHQvLyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSAoQ1NQKVxuXHQvLyBJdCBjYW4gYmUgYSBwYWluIHRvIG1hbmFnZSB0aGVzZSwgYnV0IGl0J3MgYSByZWFsbHkgZ3JlYXQgaGFiaXQgdG8gZ2V0IGluIHRvLlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRjb25zdCBjc3BDb25maWcgPSB7XG5cdFx0ZGlyZWN0aXZlczoge1xuXHRcdFx0Ly8gVGhlIGRlZmF1bHQtc3JjIGlzIHRoZSBkZWZhdWx0IHBvbGljeSBmb3IgbG9hZGluZyBjb250ZW50IHN1Y2ggYXNcblx0XHRcdC8vIEphdmFTY3JpcHQsIEltYWdlcywgQ1NTLCBGb250cywgQUpBWCByZXF1ZXN0cywgRnJhbWVzLCBIVE1MNSBNZWRpYS5cblx0XHRcdC8vIEFzIHlvdSBtaWdodCBzdXNwZWN0LCBpcyB1c2VkIGFzIGZhbGxiYWNrIGZvciB1bnNwZWNpZmllZCBkaXJlY3RpdmVzLlxuXHRcdFx0ZGVmYXVsdFNyYzogW1wiJ3NlbGYnXCJdLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2YgSmF2YVNjcmlwdC5cblx0XHRcdHNjcmlwdFNyYzogW1xuXHRcdFx0XHRcIidzZWxmJ1wiLFxuXHRcdFx0XHRcIid1bnNhZmUtZXZhbCdcIixcblx0XHRcdFx0J3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbScsXG5cdFx0XHRcdCdjZG4ucmF2ZW5qcy5jb20nLFxuXHRcdFx0XHQnY2RuLnBvbHlmaWxsLmlvJyxcblx0XHRcdFx0J2Nkbi5hbXBsaXR1ZGUuY29tJyxcblxuXHRcdFx0XHQvLyBOb3RlOiBXZSB3aWxsIGV4ZWN1dGlvbiBvZiBhbnkgaW5saW5lIHNjcmlwdHMgdGhhdCBoYXZlIHRoZSBmb2xsb3dpbmdcblx0XHRcdFx0Ly8gbm9uY2UgaWRlbnRpZmllciBhdHRhY2hlZCB0byB0aGVtLlxuXHRcdFx0XHQvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgZ3VhcmRpbmcgeW91ciBhcHBsaWNhdGlvbiB3aGlsc3QgYWxsb3dpbmcgYW4gaW5saW5lXG5cdFx0XHRcdC8vIHNjcmlwdCB0byBkbyBkYXRhIHN0b3JlIHJlaHlkcmF0aW9uIChyZWR1eC9tb2J4L2Fwb2xsbykgZm9yIGV4YW1wbGUuXG5cdFx0XHRcdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdFx0XHRcdChfOiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IGAnbm9uY2UtJHtyZXNwb25zZS5sb2NhbHMubm9uY2V9J2Bcblx0XHRcdF0sXG5cblx0XHRcdC8vIERlZmluZXMgdGhlIG9yaWdpbnMgZnJvbSB3aGljaCBpbWFnZXMgY2FuIGJlIGxvYWRlZC5cblx0XHRcdC8vIEBub3RlOiBMZWF2ZSBvcGVuIHRvIGFsbCBpbWFnZXMsIHRvbyBtdWNoIGltYWdlIGNvbWluZyBmcm9tIGRpZmZlcmVudCBzZXJ2ZXJzLlxuXHRcdFx0aW1nU3JjOiBbJ2h0dHBzOicsICdodHRwOicsIFwiJ3NlbGYnXCIsICdkYXRhOicsICdibG9iOiddLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2Ygc3R5bGVzaGVldHMuXG5cdFx0XHRzdHlsZVNyYzogW1wiJ3NlbGYnXCIsIFwiJ3Vuc2FmZS1pbmxpbmUnXCJdLFxuXG5cdFx0XHQvLyBBcHBsaWVzIHRvIFhNTEh0dHBSZXF1ZXN0IChBSkFYKSwgV2ViU29ja2V0IG9yIEV2ZW50U291cmNlLlxuXHRcdFx0Ly8gSWYgbm90IGFsbG93ZWQgdGhlIGJyb3dzZXIgZW11bGF0ZXMgYSA0MDAgSFRUUCBzdGF0dXMgY29kZS5cblx0XHRcdGNvbm5lY3RTcmM6IFsnaHR0cHM6JywgJ3dzczonXSxcblxuXHRcdFx0Ly8gbGlzdHMgdGhlIFVSTHMgZm9yIHdvcmtlcnMgYW5kIGVtYmVkZGVkIGZyYW1lIGNvbnRlbnRzLlxuXHRcdFx0Ly8gRm9yIGV4YW1wbGU6IGNoaWxkLXNyYyBodHRwczovL3lvdXR1YmUuY29tIHdvdWxkIGVuYWJsZVxuXHRcdFx0Ly8gZW1iZWRkaW5nIHZpZGVvcyBmcm9tIFlvdVR1YmUgYnV0IG5vdCBmcm9tIG90aGVyIG9yaWdpbnMuXG5cdFx0XHQvLyBAbm90ZTogd2UgYWxsb3cgdXNlcnMgdG8gZW1iZWQgYW55IHBhZ2UgdGhleSB3YW50LlxuXHRcdFx0Y2hpbGRTcmM6IFsnaHR0cHM6JywgJ2h0dHA6J10sXG5cblx0XHRcdC8vIGFsbG93cyBjb250cm9sIG92ZXIgRmxhc2ggYW5kIG90aGVyIHBsdWdpbnMuXG5cdFx0XHRvYmplY3RTcmM6IFtcIidub25lJ1wiXSxcblxuXHRcdFx0Ly8gcmVzdHJpY3RzIHRoZSBvcmlnaW5zIGFsbG93ZWQgdG8gZGVsaXZlciB2aWRlbyBhbmQgYXVkaW8uXG5cdFx0XHRtZWRpYVNyYzogW1wiJ25vbmUnXCJdXG5cdFx0fSxcblxuXHRcdC8vIFNldCB0byB0cnVlIGlmIHlvdSBvbmx5IHdhbnQgYnJvd3NlcnMgdG8gcmVwb3J0IGVycm9ycywgbm90IGJsb2NrIHRoZW0uXG5cdFx0cmVwb3J0T25seTogTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgfHwgQm9vbGVhbihGT1JDRV9ERVYpIHx8IGZhbHNlLFxuXHRcdC8vIE5lY2Vzc2FyeSBiZWNhdXNlIG9mIFplaXQgQ0ROIHVzYWdlXG5cdFx0YnJvd3NlclNuaWZmOiBmYWxzZVxuXHR9XG5cblx0aWYgKGVuYWJsZUNTUCkge1xuXHRcdGFwcC51c2UoY29udGVudFNlY3VyaXR5UG9saWN5KGNzcENvbmZpZykpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VjdXJpdHlcbiIsImltcG9ydCAqIGFzIHRvb2J1c3kgZnJvbSAndG9vYnVzeS1qcydcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmICghaXNEZXZlbG9wbWVudCAmJiB0b29idXN5KCkpIHtcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwM1xuXHRcdHJlcy5zZW5kKCdJdCBsb29rZSBsaWtlIHRoZSBzZXZlciBpcyBidXNzeS4gV2FpdCBmZXcgc2Vjb25kcy4uLicpXG5cdH0gZWxzZSB7XG5cdFx0Ly8gcXVldWUgdXAgdGhlIHJlcXVlc3QgYW5kIHdhaXQgZm9yIGl0IHRvIGNvbXBsZXRlIGluIHRlc3RpbmcgYW5kIGRldmVsb3BtZW50IHBoYXNlXG5cdFx0bmV4dCgpXG5cdH1cbn1cbiIsImltcG9ydCB7IFNlcnZlciwgY3JlYXRlU2VydmVyIH0gZnJvbSAnaHR0cCdcblxuaW1wb3J0IEFwcCBmcm9tICdhcHAuc2VydmVyJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGdyYXBocWxTZXJ2ZXIgZnJvbSAnZ3JhcGhxbC5zZXJ2ZXInXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCB7IG5vcm1hbGl6ZVBvcnQgfSBmcm9tICd1dGlsbGl0eS9ub3JtYWxpemUnXG5cbmNsYXNzIE9vam9iU2VydmVyIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIHNlcnZlcjogU2VydmVyXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0Z3JhcGhxbFNlcnZlci5hcHBseU1pZGRsZXdhcmUoe1xuXHRcdFx0YXBwLFxuXHRcdFx0b25IZWFsdGhDaGVjazogKCkgPT5cblx0XHRcdFx0bmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdC8vIFJlcGxhY2UgdGhlIGB0cnVlYCBpbiB0aGlzIGNvbmRpdGlvbmFsIHdpdGggbW9yZSBzcGVjaWZpYyBjaGVja3MhXG5cdFx0XHRcdFx0aWYgKHBhcnNlSW50KCcyJykgPT09IDIpIHtcblx0XHRcdFx0XHRcdHJlc29sdmUoKVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZWplY3QoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHR9KVxuXHRcdHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKGFwcClcblx0XHRncmFwaHFsU2VydmVyLmluc3RhbGxTdWJzY3JpcHRpb25IYW5kbGVycyh0aGlzLnNlcnZlcilcblx0fVxuXG5cdHN0YXJ0U3luY1NlcnZlciA9IGFzeW5jIChwb3J0OiBzdHJpbmcpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgUE9SVCA9IG5vcm1hbGl6ZVBvcnQocG9ydClcblx0XHRcdHRoaXMuc2VydmVyLmxpc3RlbihQT1JULCAoKSA9PiB7XG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBzZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLmdyYXBocWxQYXRofWApXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBTdWJzY3JpcHRpb25zIHJlYWR5IGF0IHdzOi8vbG9jYWxob3N0OiR7UE9SVH0ke2dyYXBocWxTZXJ2ZXIuc3Vic2NyaXB0aW9uc1BhdGh9YClcblx0XHRcdFx0bG9nZ2VyLmluZm8oYFRyeSB5b3VyIGhlYWx0aCBjaGVjayBhdDogaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9Ly53ZWxsLWtub3duL2Fwb2xsby9zZXJ2ZXItaGVhbHRoYClcblx0XHRcdH0pXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGF3YWl0IHRoaXMuc3RvcFNlcnZlcigpXG5cdFx0fVxuXHR9XG5cblx0c3RvcFNlcnZlciA9IGFzeW5jICgpID0+IHtcblx0XHRwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRsb2dnZXIuaW5mbygnQ2xvc2luZyBvb2pvYiBTeW5jU2VydmVyIC4uLicpXG5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdHRoaXMuc2VydmVyLmNsb3NlKClcblx0XHRcdFx0bG9nZ2VyLmluZm8oJ29vam9iIFN5bmNTZXJ2ZXIgQ2xvc2VkJylcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIENsb3NpbmcgU3luY1NlcnZlciBTZXJ2ZXIgQ29ubmVjdGlvbicpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cdFx0XHRcdHByb2Nlc3Mua2lsbChwcm9jZXNzLnBpZClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCB7IHN0YXJ0U3luY1NlcnZlciwgc3RvcFNlcnZlciwgc2VydmVyLCBhcHAgfSA9IG5ldyBPb2pvYlNlcnZlcihBcHApXG4iLCJpbXBvcnQgUmVkaXMgZnJvbSAnaW9yZWRpcydcblxuY29uc3QgcmVkaXNDb25maWcgPSB7XG5cdHBvcnQ6IHByb2Nlc3MuZW52LlJFRElTX0NBQ0hFX1BPUlQgPyBwYXJzZUludChwcm9jZXNzLmVudi5SRURJU19DQUNIRV9QT1JUKSA6IHVuZGVmaW5lZCxcblx0aG9zdDogcHJvY2Vzcy5lbnYuUkVESVNfQ0FDSEVfVVJMLFxuXHRwYXNzd29yZDogcHJvY2Vzcy5lbnYuUkVESVNfQ0FDSEVfUEFTU1dPUkRcbn1cbmV4cG9ydCBjb25zdCBjb25maWcgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmICFwcm9jZXNzLmVudi5GT1JDRV9ERVYgPyByZWRpc0NvbmZpZyA6IHVuZGVmaW5lZFxuXG5jb25zdCByZWRpcyA9IG5ldyBSZWRpcyhjb25maWcpXG5cbmV4cG9ydCB7IHJlZGlzIH1cbmV4cG9ydCBkZWZhdWx0IHJlZGlzXG4iLCJpbXBvcnQgKiBhcyBTZW50cnkgZnJvbSAnQHNlbnRyeS9ub2RlJ1xuXG5pbXBvcnQgeyBSZXdyaXRlRnJhbWVzIH0gZnJvbSAnQHNlbnRyeS9pbnRlZ3JhdGlvbnMnXG5cbmdsb2JhbC5fX3Jvb3RkaXJfXyA9IF9fZGlybmFtZSB8fCBwcm9jZXNzLmN3ZCgpXG5TZW50cnkuaW5pdCh7XG5cdGRzbjogcHJvY2Vzcy5lbnYuU0VOVFJZX0RTTixcblx0aW50ZWdyYXRpb25zOiBbXG5cdFx0bmV3IFJld3JpdGVGcmFtZXMoe1xuXHRcdFx0cm9vdDogZ2xvYmFsLl9fcm9vdGRpcl9fXG5cdFx0fSlcblx0XSxcblx0c2VydmVyTmFtZTogcHJvY2Vzcy5lbnYuU0VOVFJZX05BTUVcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IFNlbnRyeVxuIiwiaW1wb3J0IHsgR3JhcGhRTEVycm9yIH0gZnJvbSAnZ3JhcGhxbCdcbmltcG9ydCB7IElzVXNlckVycm9yIH0gZnJvbSAnc2VydmljZS9lcnJvci91c2VyLmVycm9yJ1xuaW1wb3J0IHsgUmF0ZUxpbWl0RXJyb3IgfSBmcm9tICdncmFwaHFsLXJhdGUtbGltaXQnXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBTZW50cnkgZnJvbSAnc2VydmljZS9jb25maWcvc2VudHJ5J1xuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5cbmNvbnN0IHF1ZXJ5UmUgPSAvXFxzKihxdWVyeXxtdXRhdGlvbilbXntdKi9cblxuY29uc3QgY29sbGVjdFF1ZXJpZXMgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuXHRpZiAoIXF1ZXJ5KSByZXR1cm4gJ05vIHF1ZXJ5J1xuXG5cdHJldHVybiBxdWVyeVxuXHRcdC5zcGxpdCgnXFxuJylcblx0XHQubWFwKChsaW5lKSA9PiB7XG5cdFx0XHRjb25zdCBtID0gbGluZS5tYXRjaChxdWVyeVJlKVxuXG5cdFx0XHRyZXR1cm4gbSA/IG1bMF0udHJpbSgpIDogJydcblx0XHR9KVxuXHRcdC5maWx0ZXIoKGxpbmUpID0+ICEhbGluZSlcblx0XHQuam9pbignXFxuJylcbn1cblxuY29uc3QgZXJyb3JQYXRoID0gKGVycm9yOiBhbnkpID0+IHtcblx0aWYgKCFlcnJvci5wYXRoKSByZXR1cm4gJydcblxuXHRyZXR1cm4gZXJyb3IucGF0aFxuXHRcdC5tYXAoKHZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcblx0XHRcdGlmICghaW5kZXgpIHJldHVybiB2YWx1ZVxuXG5cdFx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IGBbJHt2YWx1ZX1dYCA6IGAuJHt2YWx1ZX1gXG5cdFx0fSlcblx0XHQuam9pbignJylcbn1cblxuY29uc3QgbG9nR3JhcGhRTEVycm9yID0gKGVycm9yOiBhbnksIHJlcT86IFJlcXVlc3QpID0+IHtcblx0bG9nZ2VyLmluZm8oJy0tLUdyYXBoUUwgRXJyb3ItLS0nKVxuXHRsb2dnZXIuZXJyb3IoZXJyb3IpXG5cdGVycm9yICYmXG5cdFx0ZXJyb3IuZXh0ZW5zaW9ucyAmJlxuXHRcdGVycm9yLmV4dGVuc2lvbnMuZXhjZXB0aW9uICYmXG5cdFx0bG9nZ2VyLmVycm9yKGVycm9yLmV4dGVuc2lvbnMuZXhjZXB0aW9uLnN0YWNrdHJhY2Uuam9pbignXFxuJykpXG5cblx0aWYgKHJlcSkge1xuXHRcdGxvZ2dlci5pbmZvKGNvbGxlY3RRdWVyaWVzKHJlcS5ib2R5LnF1ZXJ5KSlcblx0XHRsb2dnZXIuaW5mbygndmFyaWFibGVzJywgSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkudmFyaWFibGVzIHx8IHt9KSlcblx0fVxuXHRjb25zdCBwYXRoID0gZXJyb3JQYXRoKGVycm9yKVxuXHRwYXRoICYmIGxvZ2dlci5pbmZvKCdwYXRoJywgcGF0aClcblx0bG9nZ2VyLmluZm8oJy0tLS0tLS0tLS0tLS0tLS0tLS1cXG4nKVxufVxuXG5jb25zdCBjcmVhdGVHcmFwaFFMRXJyb3JGb3JtYXR0ZXIgPSAocmVxPzogUmVxdWVzdCkgPT4gKGVycm9yOiBHcmFwaFFMRXJyb3IpID0+IHtcblx0bG9nR3JhcGhRTEVycm9yKGVycm9yLCByZXEpXG5cblx0Y29uc3QgZXJyID0gZXJyb3Iub3JpZ2luYWxFcnJvciB8fCBlcnJvclxuXHRjb25zdCBpc1VzZXJFcnJvciA9IGVycltJc1VzZXJFcnJvcl0gfHwgZXJyIGluc3RhbmNlb2YgUmF0ZUxpbWl0RXJyb3JcblxuXHRsZXQgc2VudHJ5SWQgPSAnSUQgb25seSBnZW5lcmF0ZWQgaW4gcHJvZHVjdGlvbidcblx0aWYgKCFpc1VzZXJFcnJvciB8fCBlcnIgaW5zdGFuY2VvZiBSYXRlTGltaXRFcnJvcikge1xuXHRcdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG5cdFx0XHRzZW50cnlJZCA9IFNlbnRyeS5jYXB0dXJlRXhjZXB0aW9uKGVycm9yKVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bWVzc2FnZTogaXNVc2VyRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogYEludGVybmFsIHNlcnZlciBlcnJvcjogJHtzZW50cnlJZH1gLFxuXHRcdC8vIEhpZGUgdGhlIHN0YWNrIHRyYWNlIGluIHByb2R1Y3Rpb24gbW9kZVxuXHRcdHN0YWNrOiAhKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlR3JhcGhRTEVycm9yRm9ybWF0dGVyXG4iLCJleHBvcnQgY29uc3QgSXNVc2VyRXJyb3IgPSBTeW1ib2woJ0lzVXNlckVycm9yJylcblxuY2xhc3MgVXNlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcblx0XHRzdXBlcihtZXNzYWdlKVxuXHRcdHRoaXMubmFtZSA9ICdFcnJvcidcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG5cdFx0dGhpc1tJc1VzZXJFcnJvcl0gPSB0cnVlXG5cdFx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcylcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyRXJyb3JcbiIsImltcG9ydCBvcGVudGVsZW1ldHJ5LCB7IFRyYWNlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L2FwaSdcblxuaW1wb3J0IHsgSmFlZ2VyRXhwb3J0ZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXInXG5pbXBvcnQgeyBNZXRlclByb3ZpZGVyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvbWV0cmljcydcbmltcG9ydCB7IE5vZGVUcmFjZXJQcm92aWRlciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L25vZGUnXG5pbXBvcnQgeyBQcm9tZXRoZXVzRXhwb3J0ZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1wcm9tZXRoZXVzJ1xuaW1wb3J0IHsgU2ltcGxlU3BhblByb2Nlc3NvciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L3RyYWNpbmcnXG5cbmNvbnN0IHRyYWNlciA9IChzZXJ2aWNlTmFtZTogc3RyaW5nKTogVHJhY2VyID0+IHtcblx0Y29uc3QgcHJvdmlkZXIgPSBuZXcgTm9kZVRyYWNlclByb3ZpZGVyKHtcblx0XHRwbHVnaW5zOiB7XG5cdFx0XHRleHByZXNzOiB7XG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdHBhdGg6ICdAb3BlbnRlbGVtZXRyeS9wbHVnaW4tZXhwcmVzcydcblx0XHRcdH0sXG5cdFx0XHRncnBjOiB7XG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdHBhdGg6ICdAb3BlbnRlbGVtZXRyeS9wbHVnaW4tZ3JwYydcblx0XHRcdH0sXG5cdFx0XHRodHRwOiB7XG5cdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdC8vIFlvdSBtYXkgdXNlIGEgcGFja2FnZSBuYW1lIG9yIGFic29sdXRlIHBhdGggdG8gdGhlIGZpbGUuXG5cdFx0XHRcdHBhdGg6ICdAb3BlbnRlbGVtZXRyeS9wbHVnaW4taHR0cCdcblx0XHRcdFx0Ly8gaHR0cCBwbHVnaW4gb3B0aW9uc1xuXHRcdFx0fVxuXHRcdH1cblx0fSlcblxuXHRjb25zdCBleHBvcnRlciA9IG5ldyBKYWVnZXJFeHBvcnRlcih7XG5cdFx0c2VydmljZU5hbWVcblx0fSlcblxuXHRjb25zdCBtZXRlclByb3ZpZGVyID0gbmV3IE1ldGVyUHJvdmlkZXIoe1xuXHRcdC8vIFRoZSBQcm9tZXRoZXVzIGV4cG9ydGVyIHJ1bnMgYW4gSFRUUCBzZXJ2ZXIgd2hpY2hcblx0XHQvLyB0aGUgUHJvbWV0aGV1cyBiYWNrZW5kIHNjcmFwZXMgdG8gY29sbGVjdCBtZXRyaWNzLlxuXHRcdGV4cG9ydGVyOiBuZXcgUHJvbWV0aGV1c0V4cG9ydGVyKHsgc3RhcnRTZXJ2ZXI6IHRydWUgfSksXG5cdFx0aW50ZXJ2YWw6IDEwMDBcblx0fSlcblxuXHRwcm92aWRlci5hZGRTcGFuUHJvY2Vzc29yKG5ldyBTaW1wbGVTcGFuUHJvY2Vzc29yKGV4cG9ydGVyKSlcblxuXHQvKipcblx0ICogUmVnaXN0ZXJpbmcgdGhlIHByb3ZpZGVyIHdpdGggdGhlIEFQSSBhbGxvd3MgaXQgdG8gYmUgZGlzY292ZXJlZFxuXHQgKiBhbmQgdXNlZCBieSBpbnN0cnVtZW50YXRpb24gbGlicmFyaWVzLiBUaGUgT3BlblRlbGVtZXRyeSBBUEkgcHJvdmlkZXNcblx0ICogbWV0aG9kcyB0byBzZXQgZ2xvYmFsIFNESyBpbXBsZW1lbnRhdGlvbnMsIGJ1dCB0aGUgZGVmYXVsdCBTREsgcHJvdmlkZXNcblx0ICogYSBjb252ZW5pZW5jZSBtZXRob2QgbmFtZWQgYHJlZ2lzdGVyYCB3aGljaCByZWdpc3RlcnMgc2FtZSBkZWZhdWx0c1xuXHQgKiBmb3IgeW91LlxuXHQgKlxuXHQgKiBCeSBkZWZhdWx0IHRoZSBOb2RlVHJhY2VyUHJvdmlkZXIgdXNlcyBUcmFjZSBDb250ZXh0IGZvciBwcm9wYWdhdGlvblxuXHQgKiBhbmQgQXN5bmNIb29rc1Njb3BlTWFuYWdlciBmb3IgY29udGV4dCBtYW5hZ2VtZW50LiBUbyBsZWFybiBhYm91dFxuXHQgKiBjdXN0b21pemluZyB0aGlzIGJlaGF2aW9yLCBzZWUgQVBJIFJlZ2lzdHJhdGlvbiBPcHRpb25zIGJlbG93LlxuXHQgKi9cblx0cHJvdmlkZXIucmVnaXN0ZXIoKVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcmluZyB0aGUgcHJvdmlkZXIgd2l0aCB0aGUgQVBJIGFsbG93cyBpdCB0byBiZSBkaXNjb3ZlcmVkXG5cdCAqIGFuZCB1c2VkIGJ5IGluc3RydW1lbnRhdGlvbiBsaWJyYXJpZXMuXG5cdCAqL1xuXHRvcGVudGVsZW1ldHJ5Lm1ldHJpY3Muc2V0R2xvYmFsTWV0ZXJQcm92aWRlcihtZXRlclByb3ZpZGVyKVxuXHRjb25zdCB0cmFjZXIgPSBvcGVudGVsZW1ldHJ5LnRyYWNlLmdldFRyYWNlcignc2VydmljZTpnYXRld2F5JylcblxuXHRyZXR1cm4gdHJhY2VyXG59XG5cbmV4cG9ydCBkZWZhdWx0IHRyYWNlclxuIiwiaW1wb3J0IHsgY3JlYXRlQ2lwaGVyLCBjcmVhdGVEZWNpcGhlciB9IGZyb20gJ2NyeXB0bydcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY2xhc3MgQXBwQ3J5cHRvIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHJpdmF0ZSBFTkNSWVBUX0FMR09SSVRITTogc3RyaW5nXG5cdHByaXZhdGUgRU5DUllQVF9TRUNSRVQ6IHN0cmluZ1xuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHRjb25zdCB7IEVOQ1JZUFRfU0VDUkVUID0gJ2RvZG9kdWNrQE45JywgRU5DUllQVF9BTEdPUklUSE0gPSAnYWVzLTI1Ni1jdHInIH0gPSBwcm9jZXNzLmVudlxuXG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0XHR0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNID0gRU5DUllQVF9BTEdPUklUSE1cblx0XHR0aGlzLkVOQ1JZUFRfU0VDUkVUID0gRU5DUllQVF9TRUNSRVRcblx0fVxuXG5cdHB1YmxpYyBlbmNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBFbmNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjaXBoZXIgPSBjcmVhdGVDaXBoZXIodGhpcy5FTkNSWVBUX0FMR09SSVRITSwgdGhpcy5FTkNSWVBUX1NFQ1JFVClcblx0XHRcdGxldCBjcnlwdGVkID0gY2lwaGVyLnVwZGF0ZSh0ZXh0LCAndXRmOCcsICdoZXgnKVxuXHRcdFx0Y3J5cHRlZCArPSBjaXBoZXIuZmluYWwoJ2hleCcpXG5cblx0XHRcdHJldHVybiBjcnlwdGVkXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZGVjcnlwdCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHR0aGlzLmFwcC5sb2dnZXIuaW5mbyhgRGVjcnlwdCBmb3IgJHt0ZXh0fWApXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGRlYyA9IGRlY2lwaGVyLnVwZGF0ZSh0ZXh0LCAnaGV4JywgJ3V0ZjgnKVxuXHRcdFx0ZGVjICs9IGRlY2lwaGVyLmZpbmFsKCd1dGY4JylcblxuXHRcdFx0cmV0dXJuIGRlY1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcC5sb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSlcblxuXHRcdFx0cmV0dXJuICcnXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENyeXB0b1xuIiwiaW1wb3J0IEFwcENyeXB0byBmcm9tICcuL2NyeXB0bydcbmltcG9ydCBBcHBTbHVnaWZ5IGZyb20gJy4vc2x1Z2lmeSdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IElBcHBVdGlscyB9IGZyb20gJy4vdXRpbC5pbnRlcmZhY2UnXG5cbmNsYXNzIEFwcFV0aWxzIGltcGxlbWVudHMgSUFwcFV0aWxzIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblxuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKCdJbml0aWFsaXplZCBBcHBVdGlscycpXG5cdH1cblxuXHRwdWJsaWMgYXBwbHlVdGlscyA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcblx0XHRjb25zdCB7IGVuY3J5cHQsIGRlY3J5cHQgfSA9IG5ldyBBcHBDcnlwdG8odGhpcy5hcHApXG5cdFx0Y29uc3QgeyBzbHVnaWZ5IH0gPSBuZXcgQXBwU2x1Z2lmeSh0aGlzLmFwcClcblx0XHR0aGlzLmFwcC51dGlsaXR5ID0ge1xuXHRcdFx0ZW5jcnlwdCxcblx0XHRcdGRlY3J5cHQsXG5cdFx0XHRzbHVnaWZ5XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWVcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBVdGlsc1xuIiwiY29uc3Qgbm9ybWFsaXplUG9ydCA9IChwb3J0VmFsdWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG5cdGNvbnN0IHBvcnQgPSBwYXJzZUludChwb3J0VmFsdWUsIDEwKVxuXG5cdGlmIChpc05hTihwb3J0KSkge1xuXHRcdHJldHVybiA4MDgwXG5cdH1cblxuXHRpZiAocG9ydCA+PSAwKSB7XG5cdFx0cmV0dXJuIHBvcnRcblx0fVxuXG5cdHJldHVybiBwb3J0XG59XG5cbmV4cG9ydCB7IG5vcm1hbGl6ZVBvcnQgfVxuZXhwb3J0IGRlZmF1bHQgbm9ybWFsaXplUG9ydFxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBTbHVnaWZ5IHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0fVxuXG5cdHB1YmxpYyBzbHVnaWZ5ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBTbHVnaWZ5IGZvciAke3RleHR9YClcblxuXHRcdHJldHVybiB0ZXh0XG5cdFx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdFx0LnJlcGxhY2UoL1teXFx3IF0rL2csICcnKVxuXHRcdFx0LnJlcGxhY2UoLyArL2csICctJylcblx0fVxufVxuXG5leHBvcnQgeyBBcHBTbHVnaWZ5IH1cbmV4cG9ydCBkZWZhdWx0IEFwcFNsdWdpZnlcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9vb2pvYi1wcm90b2J1ZlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L2FwaVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItcHJvbWV0aGV1c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9tZXRyaWNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L25vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAc2VudHJ5L2ludGVncmF0aW9uc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAc2VudHJ5L25vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1jYWNoZS1yZWRpc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2x1c3RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21wcmVzc2lvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnYvY29uZmlnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JhcGhxbC1kZXB0aC1saW1pdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLXJhdGUtbGltaXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JwY1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoZWxtZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaG9zdC12YWxpZGF0aW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhwcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImlvcmVkaXNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidG9vYnVzeS1qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0c2xpYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwid2luc3RvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9