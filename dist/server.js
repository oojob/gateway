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
/******/ 	var hotCurrentHash = "bfcf1d0365f79e7c4a0a";
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
const service_pb_1 = __webpack_require__(/*! @oojob/protorepo-profile-node/service_pb */ "@oojob/protorepo-profile-node/service_pb");
const oojob_protobuf_1 = __webpack_require__(/*! @oojob/oojob-protobuf */ "@oojob/oojob-protobuf");
const transformer_1 = __webpack_require__(/*! client/profile/transformer */ "./src/client/profile/transformer/index.ts");
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
        console.log(token);
        try {
            const tokenResponse = (yield transformer_1.refreshToken(tokenRequest));
            console.log(tokenResponse);
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
    })
};
exports.Mutation = {
    Auth: (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const authRequest = new service_pb_1.AuthRequest();
        if (input === null || input === void 0 ? void 0 : input.username) {
            authRequest.setUsername(input.username);
        }
        if (input === null || input === void 0 ? void 0 : input.password) {
            authRequest.setPassword(input.password);
        }
        const res = {};
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

module.exports = "enum AccountType {\n  BASE\n  COMPANY\n  FUNDING\n  JOB\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum ProfileOperations {\n  CREATE\n  READ\n  UPDATE\n  DELETE\n  BULK_UPDATE\n}\n\nenum OperationEntity {\n  COMPANY\n  JOB\n  INVESTOR\n}\n\ntype Education {\n  education: String\n  show: Boolean\n}\n\ntype ProfileSecurity {\n  password: String\n  passwordSalt: String\n  passwordHash: String\n  code: String\n  codeType: String\n  accountType: AccountType\n  verified: Boolean\n}\n\ntype Profile {\n  identity: Identifier\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  email: Email\n  gender: Gender\n  birthdate: Timestamp\n  currentPosition: String\n  education: Education\n  address: Address\n  security: ProfileSecurity\n  metadata: Metadata\n}\n\ntype AuthResponse {\n  access_token: String\n  refresh_token: String\n  valid: Boolean\n}\n\ntype AccessDetailsResponse {\n  authorized: Boolean\n  accessUuid: String\n  userId: String\n  username: String\n  email: String\n  identifier: String\n  accountType: String\n  verified: Boolean\n  exp: String\n}\n\ninput EducationInput {\n  education: String\n  show: Boolean\n}\n\ninput ProfileSecurityInput {\n  password: String\n  accountType: AccountType\n}\n\ninput ProfileInput {\n  identity: IdentifierInput\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  email: EmailInput\n  gender: Gender\n  birthdate: TimestampInput\n  currentPosition: String\n  education: EducationInput\n  address: AddressInput\n  security: ProfileSecurityInput\n}\n\ninput ValidateUsernameInput {\n  username: String\n}\n\ninput ValidateEmailInput {\n  email: String\n}\n\ninput AuthRequestInput {\n  username: String\n  password: String\n}\n\ninput TokenRequest {\n  token: String\n  accessUuid: String\n  userId: String\n}\n\nextend type Query {\n  ValidateUsername(input: ValidateUsernameInput!): DefaultResponse!\n  ValidateEmail(input: ValidateEmailInput!): DefaultResponse!\n  VerifyToken(input: TokenRequest): AccessDetailsResponse!\n  RefreshToken(input: TokenRequest): AuthResponse!\n}\n\nextend type Mutation {\n  CreateProfile(input: ProfileInput!): Id!\n  Auth(input: AuthRequestInput): AuthResponse!\n  Logout(input: TokenRequest): DefaultResponse!\n}\n"

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
const tracer_1 = __webpack_require__(/*! tracer */ "./src/tracer.ts");
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
const tracer = tracer_1.default('service:gateway');
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
    context: ({ req, connection }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const tokenData = req.headers.authorization || '';
        const token = tokenData.split(' ')[1];
        const accessDetails = yield resolver_1.extractTokenMetadata(token);
        return {
            req,
            connection,
            pubsub: exports.pubsub,
            tracer,
            accessDetails,
            token
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9jb3JzLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9jc3JmLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9lcnJvci1oYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvbG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvd2luc3Rvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFjZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2NyeXB0by50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L25vcm1hbGl6ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvc2x1Z2lmeS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9hcGlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRlYnVnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZG90ZW52L2NvbmZpZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzLWVuZm9yY2VzLXNzbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JwY1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhlbG1ldFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhvc3QtdmFsaWRhdGlvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhwcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b29idXN5LWpzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidHNsaWJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXVpZFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbnN0b25cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3QjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxxQkFBcUIsZ0JBQWdCO1FBQ3JDO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFD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RTtpQkFDYixPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7UUFDdEIsQ0FBQztRQVZBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztJQUNmLENBQUM7Q0FVRDtBQUVELGtCQUFlLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQnpCLGtEOzs7Ozs7Ozs7OztBQ0FBLDBEOzs7Ozs7Ozs7OztBQ0FBLHFFOzs7Ozs7Ozs7OztBQ0FBLCtDOzs7Ozs7Ozs7OztBQ0FBLDJEOzs7Ozs7Ozs7OztBQ0FBLGdEOzs7Ozs7Ozs7OztBQ0FBLG1EOzs7Ozs7Ozs7OztBQ0FBLGtEOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLGlEOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLDRDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCIuaG90L1wiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCIpO1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHtcbiBcdFx0dHJ5IHtcbiBcdFx0XHR2YXIgdXBkYXRlID0gcmVxdWlyZShcIi4vXCIgKyBcIi5ob3QvXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiYmZjZjFkMDM2NWY3OWU3YzRhMGFcIjtcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdH1cbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcbiBcdFx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0FwcGx5KSB7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRcdFx0XHRpZiAoXG4gXHRcdFx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcyxcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdFx0XHRcdClcbiBcdFx0XHRcdFx0XHQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZCAmJlxuIFx0XHRcdFx0Ly8gcmVtb3ZlZCBzZWxmLWFjY2VwdGVkIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSByZXF1aXJlZFxuIFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdH0pO1xuXG4gXHRcdHZhciBpZHg7XG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuIFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XG4gXHRcdFx0XHRjYihkYXRhKTtcbiBcdFx0XHR9XG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcblxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XG4gXHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIHtcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuIFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG4gXHRcdGZvciAobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuIFx0XHRcdFx0XHRcdGlmIChjYikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGNiKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XG4gXHRcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcbiBcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcbiBcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnIyO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG4gXHRcdGlmIChlcnJvcikge1xuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiBcdFx0fVxuXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHRcIltITVJdIENvbnNpZGVyIHVzaW5nIHRoZSBOYW1lZE1vZHVsZXNQbHVnaW4gZm9yIG1vZHVsZSBuYW1lcy5cIlxuXHRcdFx0KTtcblx0fVxufTtcbiIsInZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID1cblx0XHQobG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJlcnJvclwiKTtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBzdGFjaztcblx0fVxufTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdFxuXHRcdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIiwiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgQXBwVXRpbHMgZnJvbSAndXRpbGxpdHknXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgbWlkZGxld2FlcyBmcm9tICdtaWRkbGV3YXJlcydcblxuY2xhc3MgQXBwIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIGFwcFV0aWxzOiBBcHBVdGlsc1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuYXBwID0gZXhwcmVzcygpXG5cblx0XHR0aGlzLmFwcFV0aWxzID0gbmV3IEFwcFV0aWxzKHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwbHlTZXJ2ZXIoKVxuXHR9XG5cblx0cHVibGljIHN0YXRpYyBib290c3RyYXAoKTogQXBwIHtcblx0XHRyZXR1cm4gbmV3IEFwcCgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5U2VydmVyID0gYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHRoaXMuYXBwVXRpbHMuYXBwbHlVdGlscygpXG5cdFx0YXdhaXQgdGhpcy5hcHBseU1pZGRsZXdhcmUoKVxuXHR9XG5cblx0cHJpdmF0ZSBhcHBseU1pZGRsZXdhcmUgPSBhc3luYyAoKSA9PiB7XG5cdFx0bWlkZGxld2Flcyh0aGlzLmFwcClcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgQXBwKClcbmV4cG9ydCBkZWZhdWx0IGFwcGxpY2F0aW9uLmFwcFxuIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgQ29tcGFueSBpbXBsZW1lbnRzIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIG5hbWU6IFN0cmluZ1xcbiAgZGVzY3JpcHRpb246IFN0cmluZ1xcbiAgY3JlYXRlZEJ5OiBJRFxcbiAgdXJsOiBTdHJpbmdcXG4gIGxvZ286IFN0cmluZ1xcbiAgbG9jYXRpb246IFN0cmluZ1xcbiAgZm91bmRlZF95ZWFyOiBTdHJpbmdcXG4gIG5vT2ZFbXBsb3llZXM6IFJhbmdlXFxuICBsYXN0QWN0aXZlOiBUaW1lc3RhbXBcXG4gIGhpcmluZ1N0YXR1czogQm9vbGVhblxcbiAgc2tpbGxzOiBbU3RyaW5nXVxcbiAgY3JlYXRlZEF0OiBUaW1lc3RhbXAhXFxuICB1cGRhdGVkQXQ6IFRpbWVzdGFtcCFcXG59XFxuXFxuaW5wdXQgQ29tcGFueUlucHV0IHtcXG4gIGNyZWF0ZWRCeTogSUQhXFxuICBuYW1lOiBTdHJpbmchXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nIVxcbiAgdXJsOiBTdHJpbmdcXG4gIGxvZ286IFN0cmluZ1xcbiAgbG9jYXRpb246IFN0cmluZ1xcbiAgZm91bmRlZFllYXI6IFN0cmluZ1xcbiAgbm9PZkVtcGxveWVlczogUmFuZ2VJbnB1dFxcbiAgaGlyaW5nU3RhdHVzOiBCb29sZWFuXFxuICBza2lsbHM6IFtTdHJpbmddXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gQ3VycmVudFN0YXR1cyB7XFxuICBBQ1RJVkVcXG4gIEhPTERcXG4gIEVYUElSRURcXG59XFxuXFxuZW51bSBKb2JUeXBlIHtcXG4gIERFRkFVTFRcXG4gIEZFQVRVUkVEXFxuICBQUkVNSVVNXFxufVxcblxcbnR5cGUgU2FsbGFyeSB7XFxuICB2YWx1ZTogRmxvYXQhXFxuICBjdXJyZW5jeTogU3RyaW5nIVxcbn1cXG5cXG50eXBlIEpvYiBpbXBsZW1lbnRzIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIG5hbWU6IFN0cmluZyFcXG4gIHR5cGU6IEpvYlR5cGUhXFxuICBjYXRlZ29yeTogW1N0cmluZyFdIVxcbiAgZGVzYzogU3RyaW5nIVxcbiAgc2tpbGxzUmVxdWlyZWQ6IFtTdHJpbmchXSFcXG4gIHNhbGxhcnk6IFJhbmdlXFxuICBsb2NhdGlvbjogU3RyaW5nIVxcbiAgYXR0YWNobWVudDogW0F0dGFjaG1lbnRdXFxuICBzdGF0dXM6IEN1cnJlbnRTdGF0dXNcXG4gIHZpZXdzOiBJbnRcXG4gIHVzZXJzQXBwbGllZDogW1N0cmluZyFdXFxuICBjcmVhdGVkQnk6IFN0cmluZ1xcbiAgY29tcGFueTogU3RyaW5nIVxcbiAgY3JlYXRlZEF0OiBUaW1lc3RhbXAhXFxuICB1cGRhdGVkQXQ6IFRpbWVzdGFtcCFcXG59XFxuXFxudHlwZSBKb2JSZXN1bHRDdXJzb3Ige1xcbiAgZWRnZXM6IEVkZ2UhXFxuICBwYWdlSW5mbzogUGFnZUluZm8hXFxuICB0b3RhbENvdW50OiBJbnQhXFxufVxcblxcbmlucHV0IFNhbGxhcnlJbnB1dCB7XFxuICB2YWx1ZTogRmxvYXQhXFxuICBjdXJyZW5jeTogU3RyaW5nIVxcbn1cXG5cXG5pbnB1dCBDcmVhdGVKb2JJbnB1dCB7XFxuICBuYW1lOiBTdHJpbmchXFxuICB0eXBlOiBKb2JUeXBlIVxcbiAgY2F0ZWdvcnk6IFtTdHJpbmchXSFcXG4gIGRlc2M6IFN0cmluZyFcXG4gIHNraWxsc19yZXF1aXJlZDogW1N0cmluZyFdIVxcbiAgc2FsbGFyeTogUmFuZ2VJbnB1dCFcXG4gIHNhbGxhcnlfbWF4OiBTYWxsYXJ5SW5wdXQhXFxuICBhdHRhY2htZW50OiBbQXR0YWNobWVudElucHV0XVxcbiAgbG9jYXRpb246IFN0cmluZyFcXG4gIHN0YXR1czogQ3VycmVudFN0YXR1cyFcXG4gIGNvbXBhbnk6IFN0cmluZyFcXG59XFxuXCIiLCJpbXBvcnQgKiBhcyBncnBjIGZyb20gJ2dycGMnXG5cbmltcG9ydCB7IFByb2ZpbGVTZXJ2aWNlQ2xpZW50IH0gZnJvbSAnQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUnXG5cbmNvbnN0IHsgQUNDT1VOVF9TRVJWSUNFX1VSSSA9ICdsb2NhbGhvc3Q6MzAwMCcgfSA9IHByb2Nlc3MuZW52XG5jb25zdCBwcm9maWxlQ2xpZW50ID0gbmV3IFByb2ZpbGVTZXJ2aWNlQ2xpZW50KEFDQ09VTlRfU0VSVklDRV9VUkksIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcblxuZXhwb3J0IGRlZmF1bHQgcHJvZmlsZUNsaWVudFxuIiwiaW1wb3J0IHtcblx0QWNjZXNzRGV0YWlscyxcblx0QXV0aFJlcXVlc3QsXG5cdEF1dGhSZXNwb25zZSxcblx0UHJvZmlsZSxcblx0UHJvZmlsZVNlY3VyaXR5LFxuXHRUb2tlblJlcXVlc3QsXG5cdFZhbGlkYXRlRW1haWxSZXF1ZXN0LFxuXHRWYWxpZGF0ZVVzZXJuYW1lUmVxdWVzdFxufSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiJ1xuaW1wb3J0IHtcblx0QWNjZXNzRGV0YWlsc1Jlc3BvbnNlIGFzIEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYSxcblx0QXV0aFJlc3BvbnNlIGFzIEF1dGhSZXNwb25zZVNjaGVtYSxcblx0RGVmYXVsdFJlc3BvbnNlIGFzIERlZmF1bHRSZXNwb25zZVNjaGVtYSxcblx0SWQgYXMgSWRTY2hlbWEsXG5cdE11dGF0aW9uUmVzb2x2ZXJzLFxuXHRRdWVyeVJlc29sdmVyc1xufSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcbmltcG9ydCB7IERlZmF1bHRSZXNwb25zZSwgRW1haWwsIElkLCBJZGVudGlmaWVyIH0gZnJvbSAnQG9vam9iL29vam9iLXByb3RvYnVmJ1xuaW1wb3J0IHtcblx0YXV0aCxcblx0Y3JlYXRlUHJvZmlsZSxcblx0bG9nb3V0LFxuXHRyZWZyZXNoVG9rZW4sXG5cdHZhbGlkYXRlRW1haWwsXG5cdHZhbGlkYXRlVXNlcm5hbWUsXG5cdHZlcmlmeVRva2VuXG59IGZyb20gJ2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyJ1xuXG5leHBvcnQgY29uc3QgZXh0cmFjdFRva2VuTWV0YWRhdGEgPSBhc3luYyAodG9rZW46IHN0cmluZyk6IFByb21pc2U8QWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hPiA9PiB7XG5cdGNvbnN0IHRva2VuUmVxdWVzdCA9IG5ldyBUb2tlblJlcXVlc3QoKVxuXG5cdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblxuXHRjb25zdCByZXM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYSA9IHt9XG5cdHRyeSB7XG5cdFx0Y29uc3QgdG9rZW5SZXMgPSAoYXdhaXQgdmVyaWZ5VG9rZW4odG9rZW5SZXF1ZXN0KSkgYXMgQWNjZXNzRGV0YWlsc1xuXHRcdHJlcy52ZXJpZmllZCA9IHRva2VuUmVzLmdldFZlcmlmaWVkKClcblx0XHRyZXMuYWNjZXNzVXVpZCA9IHRva2VuUmVzLmdldEFjY2Vzc1V1aWQoKVxuXHRcdHJlcy5hY2NvdW50VHlwZSA9IHRva2VuUmVzLmdldEFjY291bnRUeXBlKClcblx0XHRyZXMuYXV0aG9yaXplZCA9IHRva2VuUmVzLmdldEF1dGhvcml6ZWQoKVxuXHRcdHJlcy5lbWFpbCA9IHRva2VuUmVzLmdldEVtYWlsKClcblx0XHRyZXMuaWRlbnRpZmllciA9IHRva2VuUmVzLmdldElkZW50aWZpZXIoKVxuXHRcdHJlcy51c2VySWQgPSB0b2tlblJlcy5nZXRVc2VySWQoKVxuXHRcdHJlcy51c2VybmFtZSA9IHRva2VuUmVzLmdldFVzZXJuYW1lKClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXMudmVyaWZpZWQgPSBmYWxzZVxuXHRcdHJlcy5hY2Nlc3NVdWlkID0gbnVsbFxuXHRcdHJlcy5hY2NvdW50VHlwZSA9IG51bGxcblx0XHRyZXMuYXV0aG9yaXplZCA9IGZhbHNlXG5cdFx0cmVzLmVtYWlsID0gbnVsbFxuXHRcdHJlcy5leHAgPSBudWxsXG5cdFx0cmVzLmlkZW50aWZpZXIgPSBudWxsXG5cdFx0cmVzLnVzZXJJZCA9IG51bGxcblx0XHRyZXMudXNlcm5hbWUgPSBudWxsXG5cdH1cblxuXHRyZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBjb25zdCBRdWVyeTogUXVlcnlSZXNvbHZlcnMgPSB7XG5cdFZhbGlkYXRlVXNlcm5hbWU6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdHJhY2VyIH0pID0+IHtcblx0XHRjb25zdCBzcGFuID0gdHJhY2VyLnN0YXJ0U3BhbignY2xpZW50OnNlcnZpY2UtcHJvZmlsZTp2YWxpZGF0ZS11c2VybmFtZScpXG5cblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cblx0XHQvLyB0cmFjZXIud2l0aFNwYW5Bc3luYyhzcGFuLCBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgdXNlcm5hbWUgPSBpbnB1dC51c2VybmFtZVxuXHRcdGNvbnN0IHZhbGlkYXRlVXNlcm5hbWVSZXEgPSBuZXcgVmFsaWRhdGVVc2VybmFtZVJlcXVlc3QoKVxuXHRcdGlmICh1c2VybmFtZSkge1xuXHRcdFx0dmFsaWRhdGVVc2VybmFtZVJlcS5zZXRVc2VybmFtZSh1c2VybmFtZSlcblx0XHR9XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdmFsaWRhdGVSZXMgPSAoYXdhaXQgdmFsaWRhdGVVc2VybmFtZSh2YWxpZGF0ZVVzZXJuYW1lUmVxKSkgYXMgRGVmYXVsdFJlc3BvbnNlXG5cdFx0XHRyZXMuc3RhdHVzID0gdmFsaWRhdGVSZXMuZ2V0U3RhdHVzKClcblx0XHRcdHJlcy5jb2RlID0gdmFsaWRhdGVSZXMuZ2V0Q29kZSgpXG5cdFx0XHRyZXMuZXJyb3IgPSB2YWxpZGF0ZVJlcy5nZXRFcnJvcigpXG5cdFx0XHRzcGFuLmVuZCgpXG5cdFx0fSBjYXRjaCAoeyBtZXNzYWdlLCBjb2RlIH0pIHtcblx0XHRcdHJlcy5zdGF0dXMgPSBmYWxzZVxuXHRcdFx0cmVzLmVycm9yID0gbWVzc2FnZVxuXHRcdFx0cmVzLmNvZGUgPSBjb2RlXG5cdFx0XHRzcGFuLmVuZCgpXG5cdFx0fVxuXHRcdC8vIH0pXG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFZhbGlkYXRlRW1haWw6IGFzeW5jIChfLCB7IGlucHV0IH0pID0+IHtcblx0XHRjb25zdCB2YWxpZGF0ZUVtYWlsUmVxID0gbmV3IFZhbGlkYXRlRW1haWxSZXF1ZXN0KClcblxuXHRcdGNvbnN0IGVtYWlsID0gaW5wdXQuZW1haWxcblx0XHRpZiAoZW1haWwpIHtcblx0XHRcdHZhbGlkYXRlRW1haWxSZXEuc2V0RW1haWwoZW1haWwpXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzOiBEZWZhdWx0UmVzcG9uc2VTY2hlbWEgPSB7fVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB2YWxpZGF0ZVJlcyA9IChhd2FpdCB2YWxpZGF0ZUVtYWlsKHZhbGlkYXRlRW1haWxSZXEpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSB2YWxpZGF0ZVJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0cmVzLmNvZGUgPSB2YWxpZGF0ZVJlcy5nZXRDb2RlKClcblx0XHRcdHJlcy5lcnJvciA9IHZhbGlkYXRlUmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdFZlcmlmeVRva2VuOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IHRva2VuOiBhY2Nlc3NUb2tlbiB9KSA9PiB7XG5cdFx0bGV0IHJlczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlU2NoZW1hID0ge31cblxuXHRcdGNvbnN0IHRva2VuID0gKGlucHV0ICYmIGlucHV0LnRva2VuKSB8fCBhY2Nlc3NUb2tlblxuXHRcdGlmICh0b2tlbikge1xuXHRcdFx0cmVzID0gYXdhaXQgZXh0cmFjdFRva2VuTWV0YWRhdGEodG9rZW4pXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRSZWZyZXNoVG9rZW46IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgdG9rZW46IGFjY2Vzc1Rva2VuIH0pID0+IHtcblx0XHRjb25zdCByZXM6IEF1dGhSZXNwb25zZVNjaGVtYSA9IHt9XG5cblx0XHRjb25zdCB0b2tlblJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KClcblx0XHRjb25zdCB0b2tlbiA9IChpbnB1dCAmJiBpbnB1dC50b2tlbikgfHwgYWNjZXNzVG9rZW5cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdHRva2VuUmVxdWVzdC5zZXRUb2tlbih0b2tlbilcblx0XHR9XG5cdFx0Y29uc29sZS5sb2codG9rZW4pXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdG9rZW5SZXNwb25zZSA9IChhd2FpdCByZWZyZXNoVG9rZW4odG9rZW5SZXF1ZXN0KSkgYXMgQXV0aFJlc3BvbnNlXG5cdFx0XHRjb25zb2xlLmxvZyh0b2tlblJlc3BvbnNlKVxuXHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0QWNjZXNzVG9rZW4oKVxuXHRcdFx0cmVzLnJlZnJlc2hfdG9rZW4gPSB0b2tlblJlc3BvbnNlLmdldFJlZnJlc2hUb2tlbigpXG5cdFx0XHRyZXMudmFsaWQgPSB0b2tlblJlc3BvbnNlLmdldFZhbGlkKClcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9ICcnXG5cdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9ICcnXG5cdFx0XHRyZXMudmFsaWQgPSBmYWxzZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fVxufVxuXG5leHBvcnQgY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRBdXRoOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgYXV0aFJlcXVlc3QgPSBuZXcgQXV0aFJlcXVlc3QoKVxuXHRcdGlmIChpbnB1dD8udXNlcm5hbWUpIHtcblx0XHRcdGF1dGhSZXF1ZXN0LnNldFVzZXJuYW1lKGlucHV0LnVzZXJuYW1lKVxuXHRcdH1cblx0XHRpZiAoaW5wdXQ/LnBhc3N3b3JkKSB7XG5cdFx0XHRhdXRoUmVxdWVzdC5zZXRQYXNzd29yZChpbnB1dC5wYXNzd29yZClcblx0XHR9XG5cblx0XHRjb25zdCByZXM6IEF1dGhSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRva2VuUmVzcG9uc2UgPSAoYXdhaXQgYXV0aChhdXRoUmVxdWVzdCkpIGFzIEF1dGhSZXNwb25zZVxuXHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0QWNjZXNzVG9rZW4oKVxuXHRcdFx0cmVzLnJlZnJlc2hfdG9rZW4gPSB0b2tlblJlc3BvbnNlLmdldFJlZnJlc2hUb2tlbigpXG5cdFx0XHRyZXMudmFsaWQgPSB0b2tlblJlc3BvbnNlLmdldFZhbGlkKClcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9ICcnXG5cdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9ICcnXG5cdFx0XHRyZXMudmFsaWQgPSBmYWxzZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0Q3JlYXRlUHJvZmlsZTogYXN5bmMgKF8sIHsgaW5wdXQgfSkgPT4ge1xuXHRcdGNvbnN0IG1pZGRsZU5hbWUgPSBpbnB1dC5taWRkbGVOYW1lID8gYCAke2lucHV0Lm1pZGRsZU5hbWUudHJpbSgpfWAgOiAnJ1xuXHRcdGNvbnN0IGZhbWlseU5hbWUgPSBpbnB1dC5mYW1pbHlOYW1lID8gYCAke2lucHV0LmZhbWlseU5hbWUudHJpbSgpfWAgOiAnJ1xuXHRcdGNvbnN0IG5hbWUgPSBgJHtpbnB1dC5naXZlbk5hbWV9JHttaWRkbGVOYW1lfSR7ZmFtaWx5TmFtZX1gXG5cdFx0Y29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKClcblx0XHRpZGVudGlmaWVyLnNldE5hbWUobmFtZS50cmltKCkpXG5cdFx0Y29uc3QgcHJvZmlsZVNlY3VyaXR5ID0gbmV3IFByb2ZpbGVTZWN1cml0eSgpXG5cdFx0aWYgKGlucHV0LnNlY3VyaXR5Py5wYXNzd29yZCkge1xuXHRcdFx0cHJvZmlsZVNlY3VyaXR5LnNldFBhc3N3b3JkKGlucHV0LnNlY3VyaXR5LnBhc3N3b3JkKVxuXHRcdH1cblx0XHRjb25zdCBlbWFpbCA9IG5ldyBFbWFpbCgpXG5cdFx0aWYgKGlucHV0LmVtYWlsPy5lbWFpbCkge1xuXHRcdFx0ZW1haWwuc2V0RW1haWwoaW5wdXQuZW1haWwuZW1haWwpXG5cdFx0fVxuXHRcdGlmIChpbnB1dC5lbWFpbD8uc2hvdykge1xuXHRcdFx0ZW1haWwuc2V0U2hvdyhpbnB1dC5lbWFpbC5zaG93KVxuXHRcdH1cblx0XHRjb25zdCBwcm9maWxlID0gbmV3IFByb2ZpbGUoKVxuXHRcdGlmIChpbnB1dD8uZ2VuZGVyKSB7XG5cdFx0XHRwcm9maWxlLnNldEdlbmRlcihpbnB1dC5nZW5kZXIpXG5cdFx0fVxuXHRcdGlmIChpbnB1dD8udXNlcm5hbWUpIHtcblx0XHRcdHByb2ZpbGUuc2V0VXNlcm5hbWUoaW5wdXQudXNlcm5hbWUpXG5cdFx0fVxuXHRcdHByb2ZpbGUuc2V0RW1haWwoZW1haWwpXG5cdFx0cHJvZmlsZS5zZXRJZGVudGl0eShpZGVudGlmaWVyKVxuXHRcdHByb2ZpbGUuc2V0U2VjdXJpdHkocHJvZmlsZVNlY3VyaXR5KVxuXHRcdGNvbnN0IHJlcyA9IChhd2FpdCBjcmVhdGVQcm9maWxlKHByb2ZpbGUpKSBhcyBJZFxuXG5cdFx0Y29uc3QgcHJvZmlsZVJlc3BvbnNlOiBJZFNjaGVtYSA9IHtcblx0XHRcdGlkOiByZXMuZ2V0SWQoKVxuXHRcdH1cblxuXHRcdHJldHVybiBwcm9maWxlUmVzcG9uc2Vcblx0fSxcblx0TG9nb3V0OiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IHRva2VuOiBhY2Nlc3NUb2tlbiB9KSA9PiB7XG5cdFx0Y29uc3QgcmVzOiBEZWZhdWx0UmVzcG9uc2VTY2hlbWEgPSB7fVxuXHRcdGNvbnN0IHRva2VuUmVxdWVzdCA9IG5ldyBUb2tlblJlcXVlc3QoKVxuXG5cdFx0Y29uc3QgdG9rZW4gPSAoaW5wdXQgJiYgaW5wdXQudG9rZW4pIHx8IGFjY2Vzc1Rva2VuXG5cdFx0aWYgKHRva2VuKSB7XG5cdFx0XHR0b2tlblJlcXVlc3Quc2V0VG9rZW4odG9rZW4pXG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGxvZ291dFJlcyA9IChhd2FpdCBsb2dvdXQodG9rZW5SZXF1ZXN0KSkgYXMgRGVmYXVsdFJlc3BvbnNlXG5cdFx0XHRyZXMuc3RhdHVzID0gbG9nb3V0UmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IGxvZ291dFJlcy5nZXRDb2RlKClcblx0XHRcdHJlcy5lcnJvciA9IGxvZ291dFJlcy5nZXRFcnJvcigpXG5cdFx0fSBjYXRjaCAoeyBtZXNzYWdlLCBjb2RlIH0pIHtcblx0XHRcdHJlcy5zdGF0dXMgPSBmYWxzZVxuXHRcdFx0cmVzLmVycm9yID0gbWVzc2FnZVxuXHRcdFx0cmVzLmNvZGUgPSBjb2RlXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBwcm9maWxlUmVzb2x2ZXJzID0ge1xuXHRNdXRhdGlvbixcblx0UXVlcnlcbn1cbmV4cG9ydCBkZWZhdWx0IHByb2ZpbGVSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIEFjY291bnRUeXBlIHtcXG4gIEJBU0VcXG4gIENPTVBBTllcXG4gIEZVTkRJTkdcXG4gIEpPQlxcbn1cXG5cXG5lbnVtIEdlbmRlciB7XFxuICBNQUxFXFxuICBGRU1BTEVcXG4gIE9USEVSXFxufVxcblxcbmVudW0gUHJvZmlsZU9wZXJhdGlvbnMge1xcbiAgQ1JFQVRFXFxuICBSRUFEXFxuICBVUERBVEVcXG4gIERFTEVURVxcbiAgQlVMS19VUERBVEVcXG59XFxuXFxuZW51bSBPcGVyYXRpb25FbnRpdHkge1xcbiAgQ09NUEFOWVxcbiAgSk9CXFxuICBJTlZFU1RPUlxcbn1cXG5cXG50eXBlIEVkdWNhdGlvbiB7XFxuICBlZHVjYXRpb246IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG50eXBlIFByb2ZpbGVTZWN1cml0eSB7XFxuICBwYXNzd29yZDogU3RyaW5nXFxuICBwYXNzd29yZFNhbHQ6IFN0cmluZ1xcbiAgcGFzc3dvcmRIYXNoOiBTdHJpbmdcXG4gIGNvZGU6IFN0cmluZ1xcbiAgY29kZVR5cGU6IFN0cmluZ1xcbiAgYWNjb3VudFR5cGU6IEFjY291bnRUeXBlXFxuICB2ZXJpZmllZDogQm9vbGVhblxcbn1cXG5cXG50eXBlIFByb2ZpbGUge1xcbiAgaWRlbnRpdHk6IElkZW50aWZpZXJcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsXFxuICBnZW5kZXI6IEdlbmRlclxcbiAgYmlydGhkYXRlOiBUaW1lc3RhbXBcXG4gIGN1cnJlbnRQb3NpdGlvbjogU3RyaW5nXFxuICBlZHVjYXRpb246IEVkdWNhdGlvblxcbiAgYWRkcmVzczogQWRkcmVzc1xcbiAgc2VjdXJpdHk6IFByb2ZpbGVTZWN1cml0eVxcbiAgbWV0YWRhdGE6IE1ldGFkYXRhXFxufVxcblxcbnR5cGUgQXV0aFJlc3BvbnNlIHtcXG4gIGFjY2Vzc190b2tlbjogU3RyaW5nXFxuICByZWZyZXNoX3Rva2VuOiBTdHJpbmdcXG4gIHZhbGlkOiBCb29sZWFuXFxufVxcblxcbnR5cGUgQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIHtcXG4gIGF1dGhvcml6ZWQ6IEJvb2xlYW5cXG4gIGFjY2Vzc1V1aWQ6IFN0cmluZ1xcbiAgdXNlcklkOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIGlkZW50aWZpZXI6IFN0cmluZ1xcbiAgYWNjb3VudFR5cGU6IFN0cmluZ1xcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG4gIGV4cDogU3RyaW5nXFxufVxcblxcbmlucHV0IEVkdWNhdGlvbklucHV0IHtcXG4gIGVkdWNhdGlvbjogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbmlucHV0IFByb2ZpbGVTZWN1cml0eUlucHV0IHtcXG4gIHBhc3N3b3JkOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbn1cXG5cXG5pbnB1dCBQcm9maWxlSW5wdXQge1xcbiAgaWRlbnRpdHk6IElkZW50aWZpZXJJbnB1dFxcbiAgZ2l2ZW5OYW1lOiBTdHJpbmdcXG4gIG1pZGRsZU5hbWU6IFN0cmluZ1xcbiAgZmFtaWx5TmFtZTogU3RyaW5nXFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBlbWFpbDogRW1haWxJbnB1dFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wSW5wdXRcXG4gIGN1cnJlbnRQb3NpdGlvbjogU3RyaW5nXFxuICBlZHVjYXRpb246IEVkdWNhdGlvbklucHV0XFxuICBhZGRyZXNzOiBBZGRyZXNzSW5wdXRcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlJbnB1dFxcbn1cXG5cXG5pbnB1dCBWYWxpZGF0ZVVzZXJuYW1lSW5wdXQge1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBWYWxpZGF0ZUVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBBdXRoUmVxdWVzdElucHV0IHtcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIHBhc3N3b3JkOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgVG9rZW5SZXF1ZXN0IHtcXG4gIHRva2VuOiBTdHJpbmdcXG4gIGFjY2Vzc1V1aWQ6IFN0cmluZ1xcbiAgdXNlcklkOiBTdHJpbmdcXG59XFxuXFxuZXh0ZW5kIHR5cGUgUXVlcnkge1xcbiAgVmFsaWRhdGVVc2VybmFtZShpbnB1dDogVmFsaWRhdGVVc2VybmFtZUlucHV0ISk6IERlZmF1bHRSZXNwb25zZSFcXG4gIFZhbGlkYXRlRW1haWwoaW5wdXQ6IFZhbGlkYXRlRW1haWxJbnB1dCEpOiBEZWZhdWx0UmVzcG9uc2UhXFxuICBWZXJpZnlUb2tlbihpbnB1dDogVG9rZW5SZXF1ZXN0KTogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIVxcbiAgUmVmcmVzaFRva2VuKGlucHV0OiBUb2tlblJlcXVlc3QpOiBBdXRoUmVzcG9uc2UhXFxufVxcblxcbmV4dGVuZCB0eXBlIE11dGF0aW9uIHtcXG4gIENyZWF0ZVByb2ZpbGUoaW5wdXQ6IFByb2ZpbGVJbnB1dCEpOiBJZCFcXG4gIEF1dGgoaW5wdXQ6IEF1dGhSZXF1ZXN0SW5wdXQpOiBBdXRoUmVzcG9uc2UhXFxuICBMb2dvdXQoaW5wdXQ6IFRva2VuUmVxdWVzdCk6IERlZmF1bHRSZXNwb25zZSFcXG59XFxuXCIiLCJpbXBvcnQgcHJvZmlsZUNsaWVudCBmcm9tICdjbGllbnQvcHJvZmlsZSdcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuY3JlYXRlUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IGNvbmZpcm1Qcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuY29uZmlybVByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCByZWFkUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnJlYWRQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdXBkYXRlUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnVwZGF0ZVByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJuYW1lID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmFsaWRhdGVVc2VybmFtZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRW1haWwgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52YWxpZGF0ZUVtYWlsKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgYXV0aCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmF1dGgpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB2ZXJpZnlUb2tlbiA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZlcmlmeVRva2VuKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgbG9nb3V0ID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQubG9nb3V0KS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgcmVmcmVzaFRva2VuID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQucmVmcmVzaFRva2VuKS5iaW5kKHByb2ZpbGVDbGllbnQpXG4iLCJpbXBvcnQgeyBNdXRhdGlvblJlc29sdmVycywgUXVlcnlSZXNvbHZlcnMsIFJlc29sdmVycywgU3Vic2NyaXB0aW9uUmVzb2x2ZXJzIH0gZnJvbSAnZ2VuZXJhdGVkL2dyYXBocWwnXG5cbmNvbnN0IFF1ZXJ5OiBRdWVyeVJlc29sdmVycyA9IHtcblx0ZHVtbXk6ICgpID0+ICdkb2RvIGR1Y2sgbGl2ZXMgaGVyZSdcbn1cbmNvbnN0IE11dGF0aW9uOiBNdXRhdGlvblJlc29sdmVycyA9IHtcblx0ZHVtbXk6ICgpID0+ICdEb2RvIER1Y2snXG59XG5jb25zdCBTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblJlc29sdmVycyA9IHtcblx0ZHVtbXk6IChfLCBfXywgeyBwdWJzdWIgfSkgPT4gcHVic3ViLmFzeW5jSXRlcmF0b3IoJ0RPRE9fRFVDSycpXG59XG5cbmNvbnN0IHJvb3RSZXNvbHZlcnM6IFJlc29sdmVycyA9IHtcblx0UXVlcnksXG5cdE11dGF0aW9uLFxuXHRTdWJzY3JpcHRpb24sXG5cdFJlc3VsdDoge1xuXHRcdF9fcmVzb2x2ZVR5cGU6IChub2RlOiBhbnkpID0+IHtcblx0XHRcdGlmIChub2RlLm5vT2ZFbXBsb3llZXMpIHJldHVybiAnQ29tcGFueSdcblxuXHRcdFx0cmV0dXJuICdKb2InXG5cdFx0fVxuXHR9LFxuXHRJTm9kZToge1xuXHRcdF9fcmVzb2x2ZVR5cGU6IChub2RlOiBhbnkpID0+IHtcblx0XHRcdGlmIChub2RlLm5vT2ZFbXBsb3llZXMpIHJldHVybiAnQ29tcGFueSdcblx0XHRcdC8vIGlmIChub2RlLnN0YXJzKSByZXR1cm4gJ1JldmlldydcblxuXHRcdFx0cmV0dXJuICdDb21wYW55J1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCByb290UmVzb2x2ZXJzXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBBcHBsaWNhbnQge1xcbiAgYXBwbGljYXRpb25zOiBbU3RyaW5nXSFcXG4gIHNob3J0bGlzdGVkOiBbU3RyaW5nXSFcXG4gIG9uaG9sZDogW1N0cmluZ10hXFxuICByZWplY3RlZDogW1N0cmluZ10hXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gU29ydCB7XFxuICBBU0NcXG4gIERFU0NcXG59XFxuXFxudHlwZSBQYWdpbmF0aW9uIHtcXG4gIHBhZ2U6IEludFxcbiAgZmlyc3Q6IEludFxcbiAgYWZ0ZXI6IFN0cmluZ1xcbiAgb2Zmc2V0OiBJbnRcXG4gIGxpbWl0OiBJbnRcXG4gIHNvcnQ6IFNvcnRcXG4gIHByZXZpb3VzOiBTdHJpbmdcXG4gIG5leHQ6IFN0cmluZ1xcbiAgaWRlbnRpZmllcjogU3RyaW5nXFxufVxcblxcbmlucHV0IFBhZ2luYXRpb25JbnB1dCB7XFxuICBwYWdlOiBJbnRcXG4gIGZpcnN0OiBJbnRcXG4gIGFmdGVyOiBTdHJpbmdcXG4gIG9mZnNldDogSW50XFxuICBsaW1pdDogSW50XFxuICBzb3J0OiBTb3J0XFxuICBwcmV2aW91czogU3RyaW5nXFxuICBuZXh0OiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBNZXRhZGF0YSB7XFxuICBjcmVhdGVkX2F0OiBUaW1lc3RhbXBcXG4gIHVwZGF0ZWRfYXQ6IFRpbWVzdGFtcFxcbiAgcHVibGlzaGVkX2RhdGU6IFRpbWVzdGFtcFxcbiAgZW5kX2RhdGU6IFRpbWVzdGFtcFxcbiAgbGFzdF9hY3RpdmU6IFRpbWVzdGFtcFxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIFByb2ZpbGVPcGVyYXRpb25PcHRpb25zIHtcXG4gIENSRUFURVxcbiAgUkVBRFxcbiAgVVBEQVRFXFxuICBERUxFVEVcXG4gIEJVTEtfVVBEQVRFXFxufVxcblxcbnR5cGUgTWFwUHJvZmlsZVBlcm1pc3Npb24ge1xcbiAga2V5OiBTdHJpbmdcXG4gIHByb2ZpbGVPcGVyYXRpb25zOiBbUHJvZmlsZU9wZXJhdGlvbk9wdGlvbnNdXFxufVxcblxcbnR5cGUgUGVybWlzc2lvbnNCYXNlIHtcXG4gIHBlcm1pc3Npb25zOiBNYXBQcm9maWxlUGVybWlzc2lvblxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIFJhdGluZyB7XFxuICBhdXRob3I6IFN0cmluZ1xcbiAgYmVzdFJhdGluZzogSW50XFxuICBleHBsYW5hdGlvbjogU3RyaW5nXFxuICB2YWx1ZTogSW50XFxuICB3b3JzdFJhdGluZzogSW50XFxufVxcblxcbnR5cGUgQWdncmVnYXRlUmF0aW5nIHtcXG4gIGl0ZW1SZXZpZXdlZDogU3RyaW5nIVxcbiAgcmF0aW5nQ291bnQ6IEludCFcXG4gIHJldmlld0NvdW50OiBJbnRcXG59XFxuXFxudHlwZSBSZXZpZXcge1xcbiAgaXRlbVJldmlld2VkOiBTdHJpbmdcXG4gIGFzcGVjdDogU3RyaW5nXFxuICBib2R5OiBTdHJpbmdcXG4gIHJhdGluZzogU3RyaW5nXFxufVxcblxcbnR5cGUgR2VvTG9jYXRpb24ge1xcbiAgZWxldmF0aW9uOiBJbnRcXG4gIGxhdGl0dWRlOiBJbnRcXG4gIGxvbmdpdHVkZTogSW50XFxuICBwb3N0YWxDb2RlOiBJbnRcXG59XFxuXFxudHlwZSBBZGRyZXNzIHtcXG4gIGNvdW50cnk6IFN0cmluZyFcXG4gIGxvY2FsaXR5OiBTdHJpbmdcXG4gIHJlZ2lvbjogU3RyaW5nXFxuICBwb3N0YWxDb2RlOiBJbnRcXG4gIHN0cmVldDogU3RyaW5nXFxufVxcblxcbnR5cGUgUGxhY2Uge1xcbiAgYWRkcmVzczogQWRkcmVzc1xcbiAgcmV2aWV3OiBSZXZpZXdcXG4gIGFnZ3JlZ2F0ZVJhdGluZzogQWdncmVnYXRlUmF0aW5nXFxuICBicmFuY2hDb2RlOiBTdHJpbmdcXG4gIGdlbzogR2VvTG9jYXRpb25cXG59XFxuXFxuaW5wdXQgQWRkcmVzc0lucHV0IHtcXG4gIGNvdW50cnk6IFN0cmluZ1xcbiAgbG9jYWxpdHk6IFN0cmluZ1xcbiAgcmVnaW9uOiBTdHJpbmdcXG4gIHBvc3RhbENvZGU6IEludFxcbiAgc3RyZWV0OiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBSYW5nZSB7XFxuICBtaW46IEludCFcXG4gIG1heDogSW50IVxcbn1cXG5cXG50eXBlIERlZmF1bHRSZXNwb25zZSB7XFxuICBzdGF0dXM6IEJvb2xlYW5cXG4gIGVycm9yOiBTdHJpbmdcXG4gIGNvZGU6IEludFxcbn1cXG5cXG50eXBlIElkIHtcXG4gIGlkOiBJRCFcXG59XFxuXFxuZW51bSBFbWFpbFN0YXR1cyB7XFxuICBXQUlUSU5HXFxuICBDT05GSVJNRURcXG4gIEJMT0NLRURcXG4gIEVYUElSRURcXG59XFxuXFxudHlwZSBFbWFpbCB7XFxuICBlbWFpbDogU3RyaW5nXFxuICBzdGF0dXM6IEVtYWlsU3RhdHVzXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbnR5cGUgQXR0YWNobWVudCB7XFxuICB0eXBlOiBTdHJpbmdcXG4gIGZpbGU6IFN0cmluZ1xcbiAgdXBsb2FkRGF0ZTogVGltZXN0YW1wXFxuICB1cmw6IFN0cmluZ1xcbiAgdXNlcjogU3RyaW5nXFxuICBmb2xkZXI6IFN0cmluZ1xcbn1cXG5cXG50eXBlIElkZW50aWZpZXIge1xcbiAgaWRlbnRpZmllcjogU3RyaW5nIVxcbiAgbmFtZTogU3RyaW5nXFxuICBhbHRlcm5hdGVOYW1lOiBTdHJpbmdcXG4gIHR5cGU6IFN0cmluZ1xcbiAgYWRkaXRpb25hbFR5cGU6IFN0cmluZ1xcbiAgZGVzY3JpcHRpb246IFN0cmluZ1xcbiAgZGlzYW1iaWd1YXRpbmdEZXNjcmlwdGlvbjogU3RyaW5nXFxuICBoZWFkbGluZTogU3RyaW5nXFxuICBzbG9nYW46IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBSYW5nZUlucHV0IHtcXG4gIG1pbjogSW50IVxcbiAgbWF4OiBJbnQhXFxufVxcblxcbmlucHV0IElkSW5wdXQge1xcbiAgaWQ6IElEIVxcbn1cXG5cXG5pbnB1dCBFbWFpbElucHV0IHtcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxuaW5wdXQgQXR0YWNobWVudElucHV0IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxuICB1c2VyOiBTdHJpbmdcXG4gIGZvbGRlcjogU3RyaW5nXFxufVxcblxcbmlucHV0IElkZW50aWZpZXJJbnB1dCB7XFxuICBuYW1lOiBTdHJpbmdcXG4gIGFsdGVybmF0ZU5hbWU6IFN0cmluZ1xcbiAgdHlwZTogU3RyaW5nXFxuICBhZGRpdGlvbmFsVHlwZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBkaXNhbWJpZ3VhdGluZ0Rlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGhlYWRsaW5lOiBTdHJpbmdcXG4gIHNsb2dhbjogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gRGF5c09mV2VlayB7XFxuICBNT05EQVlcXG4gIFRVRVNEQVlcXG4gIFdFRE5FU0RBWVxcbiAgVEhSVVNEQVlcXG4gIEZSSURBWVxcbiAgU1RBVVJEQVlcXG4gIFNVTkRBWVxcbn1cXG5cXG50eXBlIFRpbWVzdGFtcCB7XFxuICBzZWNvbmRzOiBTdHJpbmdcXG4gIG5hbm9zOiBTdHJpbmdcXG59XFxuXFxudHlwZSBUaW1lIHtcXG4gIG9wZW5zOiBUaW1lc3RhbXBcXG4gIGNsb3NlczogVGltZXN0YW1wXFxuICBkYXlzT2ZXZWVrOiBEYXlzT2ZXZWVrXFxuICB2YWxpZEZyb206IFRpbWVzdGFtcFxcbiAgdmFsaWRUaHJvdWdoOiBUaW1lc3RhbXBcXG59XFxuXFxuaW5wdXQgVGltZXN0YW1wSW5wdXQge1xcbiAgc2Vjb25kczogU3RyaW5nXFxuICBuYW5vczogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInNjYWxhciBEYXRlXFxuXFxudHlwZSBFZGdlIHtcXG4gIGN1cnNvcjogU3RyaW5nIVxcbiAgbm9kZTogW1Jlc3VsdCFdIVxcbn1cXG5cXG50eXBlIFBhZ2VJbmZvIHtcXG4gIGVuZEN1cnNvcjogU3RyaW5nIVxcbiAgaGFzTmV4dFBhZ2U6IEJvb2xlYW4hXFxufVxcblxcbmludGVyZmFjZSBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG51bmlvbiBSZXN1bHQgPSBKb2IgfCBDb21wYW55XFxuXFxudHlwZSBRdWVyeSB7XFxuICBkdW1teTogU3RyaW5nIVxcbn1cXG5cXG50eXBlIE11dGF0aW9uIHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgU3Vic2NyaXB0aW9uIHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnNjaGVtYSB7XFxuICBxdWVyeTogUXVlcnlcXG4gIG11dGF0aW9uOiBNdXRhdGlvblxcbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25cXG59XFxuXCIiLCJpbXBvcnQgKiBhcyBhcHBsaWNhbnRzU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9hcHBsaWNhbnRzLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBjb21wYW55U2NoZW1hIGZyb20gJ2NsaWVudC9jb21wYW55L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGN1cnNvclNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvY3Vyc29yLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBqb2JTY2hlbWEgZnJvbSAnY2xpZW50L2pvYi9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBtZXRhZGF0YVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHBlcm1pc3Npb25zU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wZXJtaXNzaW9ucy5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcGxhY2VTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3BsYWNlLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwcm9maWxlU2NoZW1hIGZyb20gJ2NsaWVudC9wcm9maWxlL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHJvb3RTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgc3lzdGVtU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9zeXN0ZW0uZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHRpbWVTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3RpbWUuZ3JhcGhxbCdcblxuaW1wb3J0IHsgQXBvbGxvU2VydmVyLCBQdWJTdWIgfSBmcm9tICdhcG9sbG8tc2VydmVyLWV4cHJlc3MnXG5pbXBvcnQgcHJvZmlsZVJlc29sdmVycywgeyBleHRyYWN0VG9rZW5NZXRhZGF0YSB9IGZyb20gJ2NsaWVudC9wcm9maWxlL3Jlc29sdmVyJ1xuXG5pbXBvcnQgeyBBY2Nlc3NEZXRhaWxzIH0gZnJvbSAnQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUvc2VydmljZV9wYidcbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IF90cmFjZXIgZnJvbSAndHJhY2VyJ1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgcm9vdFJlc29sdmVycyBmcm9tICdjbGllbnQvcm9vdC9yZXNvbHZlcidcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gW1xuXHRyb290U2NoZW1hLFxuXHRhcHBsaWNhbnRzU2NoZW1hLFxuXHRjdXJzb3JTY2hlbWEsXG5cdG1ldGFkYXRhU2NoZW1hLFxuXHRwbGFjZVNjaGVtYSxcblx0c3lzdGVtU2NoZW1hLFxuXHRwZXJtaXNzaW9uc1NjaGVtYSxcblx0dGltZVNjaGVtYSxcblx0cHJvZmlsZVNjaGVtYSxcblx0Y29tcGFueVNjaGVtYSxcblx0am9iU2NoZW1hXG5dXG5leHBvcnQgY29uc3QgcmVzb2x2ZXJzID0gbWVyZ2Uoe30sIHJvb3RSZXNvbHZlcnMsIHByb2ZpbGVSZXNvbHZlcnMpXG5jb25zdCB0cmFjZXIgPSBfdHJhY2VyKCdzZXJ2aWNlOmdhdGV3YXknKVxuZXhwb3J0IGludGVyZmFjZSBPb0pvYkNvbnRleHQge1xuXHRyZXE6IFJlcXVlc3Rcblx0cHVic3ViOiBQdWJTdWJcblx0dHJhY2VyOiB0eXBlb2YgdHJhY2VyXG5cdHRva2VuOiBzdHJpbmdcblx0YWNjZXNzRGV0YWlsczogQWNjZXNzRGV0YWlsc1xufVxuY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG5cdHR5cGVEZWZzLFxuXHRyZXNvbHZlcnMsXG5cdGNvbnRleHQ6IGFzeW5jICh7IHJlcSwgY29ubmVjdGlvbiB9KSA9PiB7XG5cdFx0Y29uc3QgdG9rZW5EYXRhID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiB8fCAnJ1xuXHRcdGNvbnN0IHRva2VuID0gdG9rZW5EYXRhLnNwbGl0KCcgJylbMV1cblx0XHRjb25zdCBhY2Nlc3NEZXRhaWxzID0gYXdhaXQgZXh0cmFjdFRva2VuTWV0YWRhdGEodG9rZW4pXG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVxLFxuXHRcdFx0Y29ubmVjdGlvbixcblx0XHRcdHB1YnN1Yixcblx0XHRcdHRyYWNlcixcblx0XHRcdGFjY2Vzc0RldGFpbHMsXG5cdFx0XHR0b2tlblxuXHRcdH1cblx0fSxcblx0dHJhY2luZzogdHJ1ZVxufSlcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyXG4iLCJpbXBvcnQgJ2RvdGVudi9jb25maWcnXG5cbmltcG9ydCB7IGFwcCwgc2VydmVyLCBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIgfSBmcm9tICdvb2pvYi5zZXJ2ZXInXG5pbXBvcnQgeyBmb3JrLCBpc01hc3Rlciwgb24gfSBmcm9tICdjbHVzdGVyJ1xuXG5kZWNsYXJlIGNvbnN0IG1vZHVsZTogYW55XG5cbmNvbnN0IHN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuXHRjb25zdCB7IFBPUlQgfSA9IHByb2Nlc3MuZW52XG5cdGNvbnN0IHBvcnQgPSBQT1JUIHx8ICc4MDgwJ1xuXG5cdHRyeSB7XG5cdFx0YXdhaXQgc3RvcFNlcnZlcigpXG5cdFx0YXdhaXQgc3RhcnRTeW5jU2VydmVyKHBvcnQpXG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignU2VydmVyIEZhaWxlZCB0byBzdGFydCcpXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcilcblx0XHRwcm9jZXNzLmV4aXQoMSlcblx0fVxufVxuXG5pZiAoaXNNYXN0ZXIpIHtcblx0Y29uc3QgbnVtQ1BVcyA9IHJlcXVpcmUoJ29zJykuY3B1cygpLmxlbmd0aFxuXG5cdGNvbnNvbGUubG9nKGBNYXN0ZXIgJHtwcm9jZXNzLnBpZH0gaXMgcnVubmluZ2ApXG5cblx0Ly8gRm9yayB3b3JrZXJzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bUNQVXM7IGkrKykge1xuXHRcdGZvcmsoKVxuXHR9XG5cblx0b24oJ2ZvcmsnLCAod29ya2VyKSA9PiB7XG5cdFx0Y29uc29sZS5sb2coJ3dvcmtlciBpcyBkZWFkOicsIHdvcmtlci5pc0RlYWQoKSlcblx0fSlcblxuXHRvbignZXhpdCcsICh3b3JrZXIpID0+IHtcblx0XHRjb25zb2xlLmxvZygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxufSBlbHNlIHtcblx0LyoqXG5cdCAqIFtpZiBIb3QgTW9kdWxlIGZvciB3ZWJwYWNrXVxuXHQgKiBAcGFyYW0gIHtbdHlwZV19IG1vZHVsZSBbZ2xvYmFsIG1vZHVsZSBub2RlIG9iamVjdF1cblx0ICovXG5cdGxldCBjdXJyZW50QXBwID0gYXBwXG5cdGlmIChtb2R1bGUuaG90KSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoJ2FwcC5zZXJ2ZXInLCAoKSA9PiB7XG5cdFx0XHRzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3JlcXVlc3QnLCBjdXJyZW50QXBwKVxuXHRcdFx0c2VydmVyLm9uKCdyZXF1ZXN0JywgYXBwKVxuXHRcdFx0Y3VycmVudEFwcCA9IGFwcFxuXHRcdH0pXG5cblx0XHQvKipcblx0XHQgKiBOZXh0IGNhbGxiYWNrIGlzIGVzc2VudGlhbDpcblx0XHQgKiBBZnRlciBjb2RlIGNoYW5nZXMgd2VyZSBhY2NlcHRlZCB3ZSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcC5cblx0XHQgKiBzZXJ2ZXIuY2xvc2UoKSBpcyBoZXJlIEV4cHJlc3MuSlMtc3BlY2lmaWMgYW5kIGNhbiBkaWZmZXIgaW4gb3RoZXIgZnJhbWV3b3Jrcy5cblx0XHQgKiBUaGUgaWRlYSBpcyB0aGF0IHlvdSBzaG91bGQgc2h1dCBkb3duIHlvdXIgYXBwIGhlcmUuXG5cdFx0ICogRGF0YS9zdGF0ZSBzYXZpbmcgYmV0d2VlbiBzaHV0ZG93biBhbmQgbmV3IHN0YXJ0IGlzIHBvc3NpYmxlXG5cdFx0ICovXG5cdFx0bW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHNlcnZlci5jbG9zZSgpKVxuXHR9XG5cblx0Ly8gV29ya2VycyBjYW4gc2hhcmUgYW55IFRDUCBjb25uZWN0aW9uXG5cdC8vIEluIHRoaXMgY2FzZSBpdCBpcyBhbiBIVFRQIHNlcnZlclxuXHRzdGFydCgpXG5cblx0Y29uc29sZS5sb2coYFdvcmtlciAke3Byb2Nlc3MucGlkfSBzdGFydGVkYClcbn1cbiIsImltcG9ydCAqIGFzIGNvcnNMaWJyYXJ5IGZyb20gJ2NvcnMnXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBOT1dfVVJMID0gJ2h0dHBzOi8vb29qb2IuaW8nLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHByb2RVcmxzID0gWydodHRwczovL29vam9iLmlvJywgJ2h0dHBzOi8vYWxwaGEub29qb2IuaW8nLCAnaHR0cHM6Ly9iZXRhLm9vam9iLmlvJywgTk9XX1VSTF1cbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBjb3JzT3B0aW9uID0ge1xuXHRvcmlnaW46IGlzUHJvZHVjdGlvbiA/IHByb2RVcmxzLmZpbHRlcihCb29sZWFuKSA6IFsvbG9jYWxob3N0L10sXG5cdG1ldGhvZHM6ICdHRVQsIEhFQUQsIFBVVCwgUEFUQ0gsIFBPU1QsIERFTEVURSwgT1BUSU9OJyxcblx0Y3JlZGVudGlhbHM6IHRydWUsXG5cdGV4cG9zZWRIZWFkZXJzOiBbJ2F1dGhvcml6YXRpb24nXVxufVxuXG5jb25zdCBjb3JzID0gKCkgPT4gY29yc0xpYnJhcnkoY29yc09wdGlvbilcbmV4cG9ydCBkZWZhdWx0IGNvcnNcbiIsImltcG9ydCAqIGFzIGhvc3RWYWxpZGF0aW9uIGZyb20gJ2hvc3QtdmFsaWRhdGlvbidcblxuLy8gTk9URShAbXhzdGJyKTpcbi8vIC0gSG9zdCBoZWFkZXIgb25seSBjb250YWlucyB0aGUgZG9tYWluLCBzbyBzb21ldGhpbmcgbGlrZSAnYnVpbGQtYXBpLWFzZGYxMjMubm93LnNoJyBvciAnb29qb2IuaW8nXG4vLyAtIFJlZmVyZXIgaGVhZGVyIGNvbnRhaW5zIHRoZSBlbnRpcmUgVVJMLCBzbyBzb21ldGhpbmcgbGlrZVxuLy8gJ2h0dHBzOi8vYnVpbGQtYXBpLWFzZGYxMjMubm93LnNoL2ZvcndhcmQnIG9yICdodHRwczovL29vam9iLmlvL2ZvcndhcmQnXG4vLyBUaGF0IG1lYW5zIHdlIGhhdmUgdG8gY2hlY2sgdGhlIEhvc3Qgc2xpZ2h0bHkgZGlmZmVyZW50bHkgZnJvbSB0aGUgUmVmZXJlciB0byBhdm9pZCB0aGluZ3Ncbi8vIGxpa2UgJ215LWRvbWFpbi1vb2pvYi5pbycgdG8gYmUgYWJsZSB0byBoYWNrIG91ciB1c2Vyc1xuXG4vLyBIb3N0cywgd2l0aG91dCBodHRwKHMpOi8vIGFuZCBwYXRoc1xuY29uc3QgeyBOT1dfVVJMID0gJ2h0dHA6Ly9vb2pvYi5pbycgfSA9IHByb2Nlc3MuZW52XG5jb25zdCB0cnVzdGVkSG9zdHMgPSBbXG5cdE5PV19VUkwgJiYgbmV3IFJlZ0V4cChgXiR7Tk9XX1VSTC5yZXBsYWNlKCdodHRwczovLycsICcnKX0kYCksXG5cdC9eb29qb2JcXC5pbyQvLCAvLyBUaGUgRG9tYWluXG5cdC9eLipcXC5vb2pvYlxcLmlvJC8gLy8gQWxsIHN1YmRvbWFpbnNcbl0uZmlsdGVyKEJvb2xlYW4pXG5cbi8vIFJlZmVyZXJzLCB3aXRoIGh0dHAocyk6Ly8gYW5kIHBhdGhzXG5jb25zdCB0cnVzdGVkUmVmZXJlcnMgPSBbXG5cdE5PV19VUkwgJiYgbmV3IFJlZ0V4cChgXiR7Tk9XX1VSTH0oJHxcXC8uKilgKSxcblx0L15odHRwczpcXC9cXC9vb2pvYlxcLmlvKCR8XFwvLiopLywgLy8gVGhlIERvbWFpblxuXHQvXmh0dHBzOlxcL1xcLy4qXFwuc3BlY3RydW1cXC5jaGF0KCR8XFwvLiopLyAvLyBBbGwgc3ViZG9tYWluc1xuXS5maWx0ZXIoQm9vbGVhbilcblxuY29uc3QgY3NyZiA9IGhvc3RWYWxpZGF0aW9uKHtcblx0aG9zdHM6IHRydXN0ZWRIb3N0cyxcblx0cmVmZXJlcnM6IHRydXN0ZWRSZWZlcmVycyxcblx0bW9kZTogJ2VpdGhlcidcbn0pXG5leHBvcnQgZGVmYXVsdCBjc3JmXG4iLCJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycjogRXJyb3IsIHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmIChlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKGVycilcblx0XHRyZXMuc3RhdHVzKDUwMCkuc2VuZCgnT29wcywgc29tZXRoaW5nIHdlbnQgd3JvbmchIE91ciBlbmdpbmVlcnMgaGF2ZSBiZWVuIGFsZXJ0ZWQgYW5kIHdpbGwgZml4IHRoaXMgYXNhcC4nKVxuXHRcdC8vIGNhcHR1cmUgZXJyb3Igd2l0aCBlcnJvciBtZXRyaWNzIGNvbGxlY3RvclxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBuZXh0KClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBlcnJvckhhbmRsZXJcbiIsImltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgKiBhcyBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbidcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgY29ycyBmcm9tICdtaWRkbGV3YXJlcy9jb3JzJ1xuaW1wb3J0IGNzcmYgZnJvbSAnbWlkZGxld2FyZXMvY3NyZidcbmltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnbWlkZGxld2FyZXMvZXJyb3ItaGFuZGxlcidcbmltcG9ydCBsb2dnZXIgZnJvbSAnbWlkZGxld2FyZXMvbG9nZ2VyJ1xuaW1wb3J0IHNlY3VyaXR5IGZyb20gJ21pZGRsZXdhcmVzL3NlY3VyaXR5J1xuaW1wb3J0IHRvb2J1c3kgZnJvbSAnbWlkZGxld2FyZXMvdG9vYnVzeSdcbmltcG9ydCB3aW5zdG9uIGZyb20gJ21pZGRsZXdhcmVzL3dpbnN0b24nXG5cbmNvbnN0IHsgRU5BQkxFX0NTUCA9IHRydWUsIEVOQUJMRV9OT05DRSA9IHRydWUgfSA9IHByb2Nlc3MuZW52XG5cbmNvbnN0IG1pZGRsZXdhcmVzID0gKGFwcDogQXBwbGljYXRpb24pID0+IHtcblx0Ly8gQ09SUyBmb3IgY3Jvc3NzLXRlIGFjY2Vzc1xuXHRhcHAudXNlKGNvcnMoKSlcblxuXHQvLyBqc29uIGVuY29kaW5nIGFuZCBkZWNvZGluZ1xuXHRhcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSlcblx0YXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSlcblxuXHQvLyBzZXQgR1ppcCBvbiBoZWFkZXJzIGZvciByZXF1ZXN0L3Jlc3BvbnNlXG5cdGFwcC51c2UoY29tcHJlc3Npb24oKSlcblxuXHQvLyBhdHRhY2ggbG9nZ2VyIGZvciBhcHBsaWNhdGlvblxuXHRhcHAudXNlKChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRcdHJlcS5sb2dnZXIgPSB3aW5zdG9uXG5cblx0XHRyZXR1cm4gbmV4dCgpXG5cdH0pXG5cblx0YXBwLnVzZShsb2dnZXIpXG5cdGFwcC51c2UoY3NyZilcblx0YXBwLnVzZShlcnJvckhhbmRsZXIpXG5cdHNlY3VyaXR5KGFwcCwgeyBlbmFibGVDU1A6IEJvb2xlYW4oRU5BQkxFX0NTUCksIGVuYWJsZU5vbmNlOiBCb29sZWFuKEVOQUJMRV9OT05DRSkgfSlcblxuXHQvLyBidXNzeSBzZXJ2ZXIgKHdhaXQgZm9yIGl0IHRvIHJlc29sdmUpXG5cdGFwcC51c2UodG9vYnVzeSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaWRkbGV3YXJlc1xuIiwiaW1wb3J0ICogYXMgbW9yZ2FuIGZyb20gJ21vcmdhbidcblxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1ZygnbWlkZGxld2FyZXM6bG9nZ2luZycpXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBsb2dnZXIgPSBtb3JnYW4oJ2NvbWJpbmVkJywge1xuXHRza2lwOiAoXzogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4gaXNQcm9kdWN0aW9uICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCxcblx0c3RyZWFtOiB7XG5cdFx0d3JpdGU6IChtZXNzYWdlOiBzdHJpbmcpID0+IGRlYnVnKG1lc3NhZ2UpXG5cdH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0ICogYXMgaHBwIGZyb20gJ2hwcCdcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgY29udGVudFNlY3VyaXR5UG9saWN5LCBmcmFtZWd1YXJkLCBoc3RzLCBpZU5vT3Blbiwgbm9TbmlmZiwgeHNzRmlsdGVyIH0gZnJvbSAnaGVsbWV0J1xuXG5pbXBvcnQgZXhwcmVzc0VuZm9yY2VzU3NsIGZyb20gJ2V4cHJlc3MtZW5mb3JjZXMtc3NsJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCdcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IHNlY3VyaXR5ID0gKGFwcDogQXBwbGljYXRpb24sIHsgZW5hYmxlTm9uY2UsIGVuYWJsZUNTUCB9OiB7IGVuYWJsZU5vbmNlOiBib29sZWFuOyBlbmFibGVDU1A6IGJvb2xlYW4gfSkgPT4ge1xuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXG5cdC8vIHNlY3VyaXR5IGhlbG1ldCBwYWNrYWdlXG5cdC8vIERvbid0IGV4cG9zZSBhbnkgc29mdHdhcmUgaW5mb3JtYXRpb24gdG8gaGFja2Vycy5cblx0YXBwLmRpc2FibGUoJ3gtcG93ZXJlZC1ieScpXG5cblx0Ly8gRXhwcmVzcyBtaWRkbGV3YXJlIHRvIHByb3RlY3QgYWdhaW5zdCBIVFRQIFBhcmFtZXRlciBQb2xsdXRpb24gYXR0YWNrc1xuXHRhcHAudXNlKGhwcCgpKVxuXG5cdGlmIChpc1Byb2R1Y3Rpb24pIHtcblx0XHRhcHAudXNlKFxuXHRcdFx0aHN0cyh7XG5cdFx0XHRcdC8vIDUgbWlucyBpbiBzZWNvbmRzXG5cdFx0XHRcdC8vIHdlIHdpbGwgc2NhbGUgdGhpcyB1cCBpbmNyZW1lbnRhbGx5IHRvIGVuc3VyZSB3ZSBkb250IGJyZWFrIHRoZVxuXHRcdFx0XHQvLyBhcHAgZm9yIGVuZCB1c2Vyc1xuXHRcdFx0XHQvLyBzZWUgZGVwbG95bWVudCByZWNvbW1lbmRhdGlvbnMgaGVyZSBodHRwczovL2hzdHNwcmVsb2FkLm9yZy8/ZG9tYWluPXNwZWN0cnVtLmNoYXRcblx0XHRcdFx0bWF4QWdlOiAzMDAsXG5cdFx0XHRcdGluY2x1ZGVTdWJEb21haW5zOiB0cnVlLFxuXHRcdFx0XHRwcmVsb2FkOiB0cnVlXG5cdFx0XHR9KVxuXHRcdClcblxuXHRcdGFwcC51c2UoZXhwcmVzc0VuZm9yY2VzU3NsKCkpXG5cdH1cblxuXHQvLyBUaGUgWC1GcmFtZS1PcHRpb25zIGhlYWRlciB0ZWxscyBicm93c2VycyB0byBwcmV2ZW50IHlvdXIgd2VicGFnZSBmcm9tIGJlaW5nIHB1dCBpbiBhbiBpZnJhbWUuXG5cdGFwcC51c2UoZnJhbWVndWFyZCh7IGFjdGlvbjogJ3NhbWVvcmlnaW4nIH0pKVxuXG5cdC8vIENyb3NzLXNpdGUgc2NyaXB0aW5nLCBhYmJyZXZpYXRlZCB0byDigJxYU1PigJ0sIGlzIGEgd2F5IGF0dGFja2VycyBjYW4gdGFrZSBvdmVyIHdlYnBhZ2VzLlxuXHRhcHAudXNlKHhzc0ZpbHRlcigpKVxuXG5cdC8vIFNldHMgdGhlIFgtRG93bmxvYWQtT3B0aW9ucyB0byBwcmV2ZW50IEludGVybmV0IEV4cGxvcmVyIGZyb20gZXhlY3V0aW5nXG5cdC8vIGRvd25sb2FkcyBpbiB5b3VyIHNpdGXigJlzIGNvbnRleHQuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9pZW5vb3Blbi9cblx0YXBwLnVzZShpZU5vT3BlbigpKVxuXG5cdC8vIERvbuKAmXQgU25pZmYgTWltZXR5cGUgbWlkZGxld2FyZSwgbm9TbmlmZiwgaGVscHMgcHJldmVudCBicm93c2VycyBmcm9tIHRyeWluZ1xuXHQvLyB0byBndWVzcyAo4oCcc25pZmbigJ0pIHRoZSBNSU1FIHR5cGUsIHdoaWNoIGNhbiBoYXZlIHNlY3VyaXR5IGltcGxpY2F0aW9ucy4gSXRcblx0Ly8gZG9lcyB0aGlzIGJ5IHNldHRpbmcgdGhlIFgtQ29udGVudC1UeXBlLU9wdGlvbnMgaGVhZGVyIHRvIG5vc25pZmYuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9kb250LXNuaWZmLW1pbWV0eXBlL1xuXHRhcHAudXNlKG5vU25pZmYoKSlcblxuXHRpZiAoZW5hYmxlTm9uY2UpIHtcblx0XHQvLyBBdHRhY2ggYSB1bmlxdWUgXCJub25jZVwiIHRvIGV2ZXJ5IHJlc3BvbnNlLiBUaGlzIGFsbG93cyB1c2UgdG8gZGVjbGFyZVxuXHRcdC8vIGlubGluZSBzY3JpcHRzIGFzIGJlaW5nIHNhZmUgZm9yIGV4ZWN1dGlvbiBhZ2FpbnN0IG91ciBjb250ZW50IHNlY3VyaXR5IHBvbGljeS5cblx0XHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRcdGFwcC51c2UoKHJlcXVlc3Q6IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdFx0XHRyZXNwb25zZS5sb2NhbHMubm9uY2UgPSB1dWlkLnY0KClcblx0XHRcdG5leHQoKVxuXHRcdH0pXG5cdH1cblxuXHQvLyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSAoQ1NQKVxuXHQvLyBJdCBjYW4gYmUgYSBwYWluIHRvIG1hbmFnZSB0aGVzZSwgYnV0IGl0J3MgYSByZWFsbHkgZ3JlYXQgaGFiaXQgdG8gZ2V0IGluIHRvLlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRjb25zdCBjc3BDb25maWcgPSB7XG5cdFx0ZGlyZWN0aXZlczoge1xuXHRcdFx0Ly8gVGhlIGRlZmF1bHQtc3JjIGlzIHRoZSBkZWZhdWx0IHBvbGljeSBmb3IgbG9hZGluZyBjb250ZW50IHN1Y2ggYXNcblx0XHRcdC8vIEphdmFTY3JpcHQsIEltYWdlcywgQ1NTLCBGb250cywgQUpBWCByZXF1ZXN0cywgRnJhbWVzLCBIVE1MNSBNZWRpYS5cblx0XHRcdC8vIEFzIHlvdSBtaWdodCBzdXNwZWN0LCBpcyB1c2VkIGFzIGZhbGxiYWNrIGZvciB1bnNwZWNpZmllZCBkaXJlY3RpdmVzLlxuXHRcdFx0ZGVmYXVsdFNyYzogW1wiJ3NlbGYnXCJdLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2YgSmF2YVNjcmlwdC5cblx0XHRcdHNjcmlwdFNyYzogW1xuXHRcdFx0XHRcIidzZWxmJ1wiLFxuXHRcdFx0XHRcIid1bnNhZmUtZXZhbCdcIixcblx0XHRcdFx0J3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbScsXG5cdFx0XHRcdCdjZG4ucmF2ZW5qcy5jb20nLFxuXHRcdFx0XHQnY2RuLnBvbHlmaWxsLmlvJyxcblx0XHRcdFx0J2Nkbi5hbXBsaXR1ZGUuY29tJyxcblxuXHRcdFx0XHQvLyBOb3RlOiBXZSB3aWxsIGV4ZWN1dGlvbiBvZiBhbnkgaW5saW5lIHNjcmlwdHMgdGhhdCBoYXZlIHRoZSBmb2xsb3dpbmdcblx0XHRcdFx0Ly8gbm9uY2UgaWRlbnRpZmllciBhdHRhY2hlZCB0byB0aGVtLlxuXHRcdFx0XHQvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgZ3VhcmRpbmcgeW91ciBhcHBsaWNhdGlvbiB3aGlsc3QgYWxsb3dpbmcgYW4gaW5saW5lXG5cdFx0XHRcdC8vIHNjcmlwdCB0byBkbyBkYXRhIHN0b3JlIHJlaHlkcmF0aW9uIChyZWR1eC9tb2J4L2Fwb2xsbykgZm9yIGV4YW1wbGUuXG5cdFx0XHRcdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdFx0XHRcdChfOiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpID0+IGAnbm9uY2UtJHtyZXNwb25zZS5sb2NhbHMubm9uY2V9J2Bcblx0XHRcdF0sXG5cblx0XHRcdC8vIERlZmluZXMgdGhlIG9yaWdpbnMgZnJvbSB3aGljaCBpbWFnZXMgY2FuIGJlIGxvYWRlZC5cblx0XHRcdC8vIEBub3RlOiBMZWF2ZSBvcGVuIHRvIGFsbCBpbWFnZXMsIHRvbyBtdWNoIGltYWdlIGNvbWluZyBmcm9tIGRpZmZlcmVudCBzZXJ2ZXJzLlxuXHRcdFx0aW1nU3JjOiBbJ2h0dHBzOicsICdodHRwOicsIFwiJ3NlbGYnXCIsICdkYXRhOicsICdibG9iOiddLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHZhbGlkIHNvdXJjZXMgb2Ygc3R5bGVzaGVldHMuXG5cdFx0XHRzdHlsZVNyYzogW1wiJ3NlbGYnXCIsIFwiJ3Vuc2FmZS1pbmxpbmUnXCJdLFxuXG5cdFx0XHQvLyBBcHBsaWVzIHRvIFhNTEh0dHBSZXF1ZXN0IChBSkFYKSwgV2ViU29ja2V0IG9yIEV2ZW50U291cmNlLlxuXHRcdFx0Ly8gSWYgbm90IGFsbG93ZWQgdGhlIGJyb3dzZXIgZW11bGF0ZXMgYSA0MDAgSFRUUCBzdGF0dXMgY29kZS5cblx0XHRcdGNvbm5lY3RTcmM6IFsnaHR0cHM6JywgJ3dzczonXSxcblxuXHRcdFx0Ly8gbGlzdHMgdGhlIFVSTHMgZm9yIHdvcmtlcnMgYW5kIGVtYmVkZGVkIGZyYW1lIGNvbnRlbnRzLlxuXHRcdFx0Ly8gRm9yIGV4YW1wbGU6IGNoaWxkLXNyYyBodHRwczovL3lvdXR1YmUuY29tIHdvdWxkIGVuYWJsZVxuXHRcdFx0Ly8gZW1iZWRkaW5nIHZpZGVvcyBmcm9tIFlvdVR1YmUgYnV0IG5vdCBmcm9tIG90aGVyIG9yaWdpbnMuXG5cdFx0XHQvLyBAbm90ZTogd2UgYWxsb3cgdXNlcnMgdG8gZW1iZWQgYW55IHBhZ2UgdGhleSB3YW50LlxuXHRcdFx0Y2hpbGRTcmM6IFsnaHR0cHM6JywgJ2h0dHA6J10sXG5cblx0XHRcdC8vIGFsbG93cyBjb250cm9sIG92ZXIgRmxhc2ggYW5kIG90aGVyIHBsdWdpbnMuXG5cdFx0XHRvYmplY3RTcmM6IFtcIidub25lJ1wiXSxcblxuXHRcdFx0Ly8gcmVzdHJpY3RzIHRoZSBvcmlnaW5zIGFsbG93ZWQgdG8gZGVsaXZlciB2aWRlbyBhbmQgYXVkaW8uXG5cdFx0XHRtZWRpYVNyYzogW1wiJ25vbmUnXCJdXG5cdFx0fSxcblxuXHRcdC8vIFNldCB0byB0cnVlIGlmIHlvdSBvbmx5IHdhbnQgYnJvd3NlcnMgdG8gcmVwb3J0IGVycm9ycywgbm90IGJsb2NrIHRoZW0uXG5cdFx0cmVwb3J0T25seTogTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgfHwgQm9vbGVhbihGT1JDRV9ERVYpIHx8IGZhbHNlLFxuXHRcdC8vIE5lY2Vzc2FyeSBiZWNhdXNlIG9mIFplaXQgQ0ROIHVzYWdlXG5cdFx0YnJvd3NlclNuaWZmOiBmYWxzZVxuXHR9XG5cblx0aWYgKGVuYWJsZUNTUCkge1xuXHRcdGFwcC51c2UoY29udGVudFNlY3VyaXR5UG9saWN5KGNzcENvbmZpZykpXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VjdXJpdHlcbiIsImltcG9ydCAqIGFzIHRvb2J1c3kgZnJvbSAndG9vYnVzeS1qcydcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmICghaXNEZXZlbG9wbWVudCAmJiB0b29idXN5KCkpIHtcblx0XHRyZXMuc3RhdHVzQ29kZSA9IDUwM1xuXHRcdHJlcy5zZW5kKCdJdCBsb29rZSBsaWtlIHRoZSBzZXZlciBpcyBidXNzeS4gV2FpdCBmZXcgc2Vjb25kcy4uLicpXG5cdH0gZWxzZSB7XG5cdFx0Ly8gcXVldWUgdXAgdGhlIHJlcXVlc3QgYW5kIHdhaXQgZm9yIGl0IHRvIGNvbXBsZXRlIGluIHRlc3RpbmcgYW5kIGRldmVsb3BtZW50IHBoYXNlXG5cdFx0bmV4dCgpXG5cdH1cbn1cbiIsImltcG9ydCB7IExvZ2dlciwgTG9nZ2VyT3B0aW9ucywgY3JlYXRlTG9nZ2VyLCBmb3JtYXQsIHRyYW5zcG9ydHMgfSBmcm9tICd3aW5zdG9uJ1xuaW1wb3J0IHsgZXhpc3RzU3luYywgbWtkaXJTeW5jIH0gZnJvbSAnZnMnXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuY29uc3QgeyBjb21iaW5lLCB0aW1lc3RhbXAsIHByZXR0eVByaW50IH0gPSBmb3JtYXRcbmNvbnN0IGxvZ0RpcmVjdG9yeSA9IGpvaW4oX19kaXJuYW1lLCAnbG9nJylcbmNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xudHlwZSBJTG9nZ2VyT3B0aW9ucyA9IHsgZmlsZTogTG9nZ2VyT3B0aW9uczsgY29uc29sZTogTG9nZ2VyT3B0aW9ucyB9XG5cbmV4cG9ydCBjb25zdCBsb2dnZXJPcHRpb25zID0ge1xuXHRmaWxlOiB7XG5cdFx0bGV2ZWw6ICdpbmZvJyxcblx0XHRmaWxlbmFtZTogYCR7bG9nRGlyZWN0b3J5fS9sb2dzL2FwcC5sb2dgLFxuXHRcdGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG5cdFx0anNvbjogdHJ1ZSxcblx0XHRtYXhzaXplOiA1MjQyODgwLCAvLyA1TUJcblx0XHRtYXhGaWxlczogNSxcblx0XHRjb2xvcml6ZTogZmFsc2Vcblx0fSxcblx0Y29uc29sZToge1xuXHRcdGxldmVsOiAnZGVidWcnLFxuXHRcdGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG5cdFx0anNvbjogZmFsc2UsXG5cdFx0Y29sb3JpemU6IHRydWVcblx0fVxufVxuY29uc3QgbG9nZ2VyVHJhbnNwb3J0cyA9IFtcblx0bmV3IHRyYW5zcG9ydHMuQ29uc29sZSh7XG5cdFx0Li4ubG9nZ2VyT3B0aW9ucy5jb25zb2xlLFxuXHRcdGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG5cdFx0XHRmb3JtYXQudGltZXN0YW1wKCksXG5cdFx0XHRmb3JtYXQuY29sb3JpemUoeyBhbGw6IHRydWUgfSksXG5cdFx0XHRmb3JtYXQuYWxpZ24oKSxcblx0XHRcdGZvcm1hdC5wcmludGYoKGluZm8pID0+IHtcblx0XHRcdFx0Y29uc3QgeyB0aW1lc3RhbXAsIGxldmVsLCBtZXNzYWdlLCAuLi5hcmdzIH0gPSBpbmZvXG5cblx0XHRcdFx0Ly8gY29uc3QgdHMgPSB0aW1lc3RhbXAuc2xpY2UoMCwgMTkpLnJlcGxhY2UoJ1QnLCAnICcpO1xuXHRcdFx0XHRyZXR1cm4gYCR7dGltZXN0YW1wfSAke2xldmVsfTogJHttZXNzYWdlfSAke09iamVjdC5rZXlzKGFyZ3MpLmxlbmd0aCA/IEpTT04uc3RyaW5naWZ5KGFyZ3MsIG51bGwsIDIpIDogJyd9YFxuXHRcdFx0fSlcblx0XHQpXG5cdH0pXG5dXG5cbmNsYXNzIEFwcExvZ2dlciB7XG5cdHB1YmxpYyBsb2dnZXI6IExvZ2dlclxuXHRwdWJsaWMgbG9nZ2VyT3B0aW9uczogSUxvZ2dlck9wdGlvbnNcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOiBJTG9nZ2VyT3B0aW9ucykge1xuXHRcdGlmICghaXNEZXZlbG9wbWVudCkge1xuXHRcdFx0ZXhpc3RzU3luYyhsb2dEaXJlY3RvcnkpIHx8IG1rZGlyU3luYyhsb2dEaXJlY3RvcnkpXG5cdFx0fVxuXG5cdFx0dGhpcy5sb2dnZXIgPSBjcmVhdGVMb2dnZXIoe1xuXHRcdFx0dHJhbnNwb3J0czogaXNEZXZlbG9wbWVudFxuXHRcdFx0XHQ/IFsuLi5sb2dnZXJUcmFuc3BvcnRzXVxuXHRcdFx0XHQ6IFtcblx0XHRcdFx0XHRcdC4uLmxvZ2dlclRyYW5zcG9ydHMsXG5cdFx0XHRcdFx0XHRuZXcgdHJhbnNwb3J0cy5GaWxlKHtcblx0XHRcdFx0XHRcdFx0Li4ub3B0aW9ucy5maWxlLFxuXHRcdFx0XHRcdFx0XHRmb3JtYXQ6IGNvbWJpbmUodGltZXN0YW1wKCksIHByZXR0eVByaW50KCkpXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHQgIF0sXG5cdFx0XHRleGl0T25FcnJvcjogZmFsc2Vcblx0XHR9KVxuXHR9XG59XG5cbmNvbnN0IHsgbG9nZ2VyIH0gPSBuZXcgQXBwTG9nZ2VyKGxvZ2dlck9wdGlvbnMpXG5leHBvcnQgZGVmYXVsdCBsb2dnZXJcbiIsImltcG9ydCB7IFNlcnZlciwgY3JlYXRlU2VydmVyIH0gZnJvbSAnaHR0cCdcblxuaW1wb3J0IEFwcCBmcm9tICdhcHAuc2VydmVyJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGdyYXBocWxTZXJ2ZXIgZnJvbSAnZ3JhcGhxbC5zZXJ2ZXInXG5pbXBvcnQgeyBub3JtYWxpemVQb3J0IH0gZnJvbSAndXRpbGxpdHkvbm9ybWFsaXplJ1xuXG5jbGFzcyBPb2pvYlNlcnZlciB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cdHB1YmxpYyBzZXJ2ZXI6IFNlcnZlclxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXHRcdGdyYXBocWxTZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHsgYXBwIH0pXG5cdFx0dGhpcy5zZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIoYXBwKVxuXHRcdGdyYXBocWxTZXJ2ZXIuaW5zdGFsbFN1YnNjcmlwdGlvbkhhbmRsZXJzKHRoaXMuc2VydmVyKVxuXHR9XG5cblx0c3RhcnRTeW5jU2VydmVyID0gYXN5bmMgKHBvcnQ6IHN0cmluZykgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBQT1JUID0gbm9ybWFsaXplUG9ydChwb3J0KVxuXHRcdFx0dGhpcy5zZXJ2ZXIubGlzdGVuKFBPUlQsICgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coYHNlcnZlciByZWFkeSBhdCBodHRwOi8vbG9jYWxob3N0OiR7UE9SVH0ke2dyYXBocWxTZXJ2ZXIuZ3JhcGhxbFBhdGh9YClcblx0XHRcdFx0Y29uc29sZS5sb2coYFN1YnNjcmlwdGlvbnMgcmVhZHkgYXQgd3M6Ly9sb2NhbGhvc3Q6JHtQT1JUfSR7Z3JhcGhxbFNlcnZlci5zdWJzY3JpcHRpb25zUGF0aH1gKVxuXHRcdFx0fSlcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0YXdhaXQgdGhpcy5zdG9wU2VydmVyKClcblx0XHR9XG5cdH1cblxuXHRzdG9wU2VydmVyID0gYXN5bmMgKCkgPT4ge1xuXHRcdHByb2Nlc3Mub24oJ1NJR0lOVCcsIGFzeW5jICgpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdDbG9zaW5nIG9vam9iIFN5bmNTZXJ2ZXIgLi4uJylcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5zZXJ2ZXIuY2xvc2UoKVxuXHRcdFx0XHRjb25zb2xlLmxvZygnb29qb2IgU3luY1NlcnZlciBDbG9zZWQnKVxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgQ2xvc2luZyBTeW5jU2VydmVyIFNlcnZlciBDb25uZWN0aW9uJylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcilcblx0XHRcdFx0cHJvY2Vzcy5raWxsKHByb2Nlc3MucGlkKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHsgc3RhcnRTeW5jU2VydmVyLCBzdG9wU2VydmVyLCBzZXJ2ZXIsIGFwcCB9ID0gbmV3IE9vam9iU2VydmVyKEFwcClcbiIsImltcG9ydCB7IEphZWdlckV4cG9ydGVyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItamFlZ2VyJ1xuaW1wb3J0IHsgTm9kZVRyYWNlclByb3ZpZGVyIH0gZnJvbSAnQG9wZW50ZWxlbWV0cnkvbm9kZSdcbmltcG9ydCB7IFNpbXBsZVNwYW5Qcm9jZXNzb3IgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS90cmFjaW5nJ1xuaW1wb3J0IG9wZW50ZWxlbWV0cnkgZnJvbSAnQG9wZW50ZWxlbWV0cnkvYXBpJ1xuXG5jb25zdCB0cmFjZXIgPSAoc2VydmljZU5hbWU6IHN0cmluZykgPT4ge1xuXHRjb25zdCBwcm92aWRlciA9IG5ldyBOb2RlVHJhY2VyUHJvdmlkZXIoe1xuXHRcdHBsdWdpbnM6IHtcblx0XHRcdGdycGM6IHtcblx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0cGF0aDogJ0BvcGVudGVsZW1ldHJ5L3BsdWdpbi1ncnBjJ1xuXHRcdFx0fVxuXHRcdH1cblx0fSlcblxuXHRjb25zdCBleHBvcnRlciA9IG5ldyBKYWVnZXJFeHBvcnRlcih7XG5cdFx0c2VydmljZU5hbWVcblx0fSlcblxuXHRwcm92aWRlci5hZGRTcGFuUHJvY2Vzc29yKG5ldyBTaW1wbGVTcGFuUHJvY2Vzc29yKGV4cG9ydGVyKSlcblx0cHJvdmlkZXIucmVnaXN0ZXIoKVxuXG5cdHJldHVybiBvcGVudGVsZW1ldHJ5LnRyYWNlLmdldFRyYWNlcignc2VydmljZTpnYXRld2F5Jylcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHJhY2VyXG4iLCJpbXBvcnQgeyBjcmVhdGVDaXBoZXIsIGNyZWF0ZURlY2lwaGVyIH0gZnJvbSAnY3J5cHRvJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBDcnlwdG8ge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwcml2YXRlIEVOQ1JZUFRfQUxHT1JJVEhNOiBzdHJpbmdcblx0cHJpdmF0ZSBFTkNSWVBUX1NFQ1JFVDogc3RyaW5nXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdGNvbnN0IHsgRU5DUllQVF9TRUNSRVQgPSAnZG9kb2R1Y2tATjknLCBFTkNSWVBUX0FMR09SSVRITSA9ICdhZXMtMjU2LWN0cicgfSA9IHByb2Nlc3MuZW52XG5cblx0XHR0aGlzLmFwcCA9IGFwcFxuXHRcdHRoaXMuRU5DUllQVF9BTEdPUklUSE0gPSBFTkNSWVBUX0FMR09SSVRITVxuXHRcdHRoaXMuRU5DUllQVF9TRUNSRVQgPSBFTkNSWVBUX1NFQ1JFVFxuXHR9XG5cblx0cHVibGljIGVuY3J5cHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0dGhpcy5hcHAubG9nZ2VyLmluZm8oYEVuY3J5cHQgZm9yICR7dGV4dH1gKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNpcGhlciA9IGNyZWF0ZUNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGNyeXB0ZWQgPSBjaXBoZXIudXBkYXRlKHRleHQsICd1dGY4JywgJ2hleCcpXG5cdFx0XHRjcnlwdGVkICs9IGNpcGhlci5maW5hbCgnaGV4JylcblxuXHRcdFx0cmV0dXJuIGNyeXB0ZWRcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHAubG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpXG5cblx0XHRcdHJldHVybiAnJ1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBkZWNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBEZWNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZWNpcGhlciA9IGNyZWF0ZURlY2lwaGVyKHRoaXMuRU5DUllQVF9BTEdPUklUSE0sIHRoaXMuRU5DUllQVF9TRUNSRVQpXG5cdFx0XHRsZXQgZGVjID0gZGVjaXBoZXIudXBkYXRlKHRleHQsICdoZXgnLCAndXRmOCcpXG5cdFx0XHRkZWMgKz0gZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKVxuXG5cdFx0XHRyZXR1cm4gZGVjXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwQ3J5cHRvXG4iLCJpbXBvcnQgQXBwQ3J5cHRvIGZyb20gJy4vY3J5cHRvJ1xuaW1wb3J0IEFwcFNsdWdpZnkgZnJvbSAnLi9zbHVnaWZ5J1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgSUFwcFV0aWxzIH0gZnJvbSAnLi91dGlsLmludGVyZmFjZSdcblxuY2xhc3MgQXBwVXRpbHMgaW1wbGVtZW50cyBJQXBwVXRpbHMge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXG5cdFx0Ly8gdGhpcy5hcHAubG9nZ2VyLmluZm8oJ0luaXRpYWxpemVkIEFwcFV0aWxzJylcblx0fVxuXG5cdHB1YmxpYyBhcHBseVV0aWxzID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuXHRcdGNvbnN0IHsgZW5jcnlwdCwgZGVjcnlwdCB9ID0gbmV3IEFwcENyeXB0byh0aGlzLmFwcClcblx0XHRjb25zdCB7IHNsdWdpZnkgfSA9IG5ldyBBcHBTbHVnaWZ5KHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwLnV0aWxpdHkgPSB7XG5cdFx0XHRlbmNyeXB0LFxuXHRcdFx0ZGVjcnlwdCxcblx0XHRcdHNsdWdpZnlcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFV0aWxzXG4iLCJjb25zdCBub3JtYWxpemVQb3J0ID0gKHBvcnRWYWx1ZTogc3RyaW5nKTogbnVtYmVyID0+IHtcblx0Y29uc3QgcG9ydCA9IHBhcnNlSW50KHBvcnRWYWx1ZSwgMTApXG5cblx0aWYgKGlzTmFOKHBvcnQpKSB7XG5cdFx0cmV0dXJuIDgwODBcblx0fVxuXG5cdGlmIChwb3J0ID49IDApIHtcblx0XHRyZXR1cm4gcG9ydFxuXHR9XG5cblx0cmV0dXJuIHBvcnRcbn1cblxuZXhwb3J0IHsgbm9ybWFsaXplUG9ydCB9XG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmNsYXNzIEFwcFNsdWdpZnkge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXHR9XG5cblx0cHVibGljIHNsdWdpZnkgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0Ly8gdGhpcy5hcHAubG9nZ2VyLmluZm8oYFNsdWdpZnkgZm9yICR7dGV4dH1gKVxuXG5cdFx0cmV0dXJuIHRleHRcblx0XHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0XHQucmVwbGFjZSgvW15cXHcgXSsvZywgJycpXG5cdFx0XHQucmVwbGFjZSgvICsvZywgJy0nKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFNsdWdpZnlcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9vb2pvYi1wcm90b2J1ZlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L2FwaVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS90cmFjaW5nXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbHVzdGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvbXByZXNzaW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRlYnVnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudi9jb25maWdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLWVuZm9yY2VzLXNzbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncnBjXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhlbG1ldFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJob3N0LXZhbGlkYXRpb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHBwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vcmdhblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRvb2J1c3ktanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHNsaWJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dWlkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndpbnN0b25cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==