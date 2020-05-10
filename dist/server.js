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
/******/ 	var hotCurrentHash = "28c8c7afd1c328d8983c";
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

/***/ "./src/client/company/index.ts":
/*!*************************************!*\
  !*** ./src/client/company/index.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __webpack_require__(/*! grpc */ "grpc");
const protorepo_company_node_1 = __webpack_require__(/*! @oojob/protorepo-company-node */ "@oojob/protorepo-company-node");
const companyClient = new protorepo_company_node_1.CompanyServiceClient('localhost:3000', grpc.credentials.createInsecure());
exports.default = companyClient;


/***/ }),

/***/ "./src/client/company/resolver/index.ts":
/*!**********************************************!*\
  !*** ./src/client/company/resolver/index.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const service_pb_1 = __webpack_require__(/*! @oojob/protorepo-company-node/service_pb */ "@oojob/protorepo-company-node/service_pb");
const transformer_1 = __webpack_require__(/*! ../transformer */ "./src/client/company/transformer/index.ts");
const COMPANY_CREATED = 'COMPANY_CREATED';
const ReadCompany = (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const id = new service_pb_1.Id();
    id.setId(input);
    const company = (yield transformer_1.readCompany(id));
    return company.toObject(true);
});
const ReadCompanies = (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const pagination = new service_pb_1.Pagination();
    pagination.setLimit(input.limit);
    pagination.setSkip(input.skip);
    try {
        const response = (yield transformer_1.readAllCompanies(pagination));
        const _companies = response.getCompaniesList();
        const companies = _companies.map((company) => company.toObject(true));
        return companies;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.Query = {
    ReadCompany,
    ReadCompanies
};
const CreateCompany = (_, { input }, { pubsub }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const companyInput = new service_pb_1.Company();
    companyInput.setCreatedBy(input.createdBy);
    companyInput.setName(input.name);
    companyInput.setDescription(input.description);
    companyInput.setUrl(input.url);
    companyInput.setLogo(input.logo);
    companyInput.setLocation(input.location);
    companyInput.setFoundedYear(input.foundedYear);
    const range = new service_pb_1.Range();
    range.setMin(input.noOfEmployees.min);
    range.setMax(input.noOfEmployees.max);
    companyInput.setNoOfEmployees(range);
    companyInput.setHiringStatus(input.hiringStatus);
    companyInput.setSkillsList(input.skills);
    try {
        const response = (yield transformer_1.createCompany(companyInput));
        const company = response.toObject();
        pubsub.publish(COMPANY_CREATED, { companyCreated: company });
        return company;
    }
    catch (error) {
        throw new Error(error);
    }
});
const UpdateCompany = () => { };
const DeleteCompany = () => { };
exports.Mutation = {
    CreateCompany,
    UpdateCompany,
    DeleteCompany
};
const CompanyCreated = {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(COMPANY_CREATED)
};
exports.Subscription = {
    CompanyCreated
};
exports.companyResolvers = {
    Query: exports.Query,
    Mutation: exports.Mutation,
    Subscription: exports.Subscription
};
exports.default = exports.companyResolvers;


/***/ }),

/***/ "./src/client/company/schema/schema.graphql":
/*!**************************************************!*\
  !*** ./src/client/company/schema/schema.graphql ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Company implements INode {\n  id: ID!\n  name: String\n  description: String\n  createdBy: ID\n  url: String\n  logo: String\n  location: String\n  founded_year: String\n  noOfEmployees: Range\n  lastActive: Timestamp\n  hiringStatus: Boolean\n  skills: [String]\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\ninput CompanyInput {\n  createdBy: ID!\n  name: String!\n  description: String!\n  url: String\n  logo: String\n  location: String\n  foundedYear: String\n  noOfEmployees: RangeInput\n  hiringStatus: Boolean\n  skills: [String]\n}\n\nextend type Query {\n  ReadCompanies(input: PaginationInput): [Company]!\n  ReadMyCompanies(input: ID!): [Company]!\n  ReadCompany(input: ID): Company\n}\n\nextend type Mutation {\n  CreateCompany(input: CompanyInput!): Id!\n  UpdateCompany(input: CompanyInput!): Id!\n  DeleteCompany(input: ID!): Id!\n}\n\nextend type Subscription {\n  CompanyCreated: Id!\n}\n"

/***/ }),

/***/ "./src/client/company/transformer/index.ts":
/*!*************************************************!*\
  !*** ./src/client/company/transformer/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __webpack_require__(/*! ../ */ "./src/client/company/index.ts");
const util_1 = __webpack_require__(/*! util */ "util");
exports.readCompany = util_1.promisify(__1.default.readCompany).bind(__1.default);
exports.readCompanies = util_1.promisify(__1.default.readCompanies).bind(__1.default);
exports.readAllCompanies = util_1.promisify(__1.default.readAllCompanies).bind(__1.default);
exports.createCompany = util_1.promisify(__1.default.createCompany).bind(__1.default);
exports.updateCompany = util_1.promisify(__1.default.updateCompany).bind(__1.default);
exports.deleteCompany = util_1.promisify(__1.default.deleteCompany).bind(__1.default);


/***/ }),

/***/ "./src/client/job/resolver/index.ts":
/*!******************************************!*\
  !*** ./src/client/job/resolver/index.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ReadJobs = () => { };
const ReadJob = () => { };
const ReadMyJobs = () => { };
exports.Query = {
    ReadJob,
    ReadJobs,
    ReadMyJobs
};
const CreateJob = () => { };
const UpdateJob = () => { };
const DeleteJob = () => { };
exports.Mutation = {
    CreateJob,
    UpdateJob,
    DeleteJob
};
exports.jobResolvers = {
    Query: exports.Query,
    Mutation: exports.Mutation
};
exports.default = exports.jobResolvers;


/***/ }),

/***/ "./src/client/job/schema/schema.graphql":
/*!**********************************************!*\
  !*** ./src/client/job/schema/schema.graphql ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum CurrentStatus {\n  ACTIVE\n  HOLD\n  EXPIRED\n}\n\nenum JobType {\n  DEFAULT\n  FEATURED\n  PREMIUM\n}\n\ntype Sallary {\n  value: Float!\n  currency: String!\n}\n\ntype Job implements INode {\n  id: ID!\n  name: String!\n  type: JobType!\n  category: [String!]!\n  desc: String!\n  skillsRequired: [String!]!\n  sallary: Range\n  location: String!\n  attachment: [Attachment]\n  status: CurrentStatus\n  views: Int\n  usersApplied: [String!]\n  createdBy: String\n  company: String!\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\ntype JobResultCursor {\n  edges: Edge!\n  pageInfo: PageInfo!\n  totalCount: Int!\n}\n\ninput SallaryInput {\n  value: Float!\n  currency: String!\n}\n\ninput CreateJobInput {\n  name: String!\n  type: JobType!\n  category: [String!]!\n  desc: String!\n  skills_required: [String!]!\n  sallary: RangeInput!\n  sallary_max: SallaryInput!\n  attachment: [AttachmentInput]\n  location: String!\n  status: CurrentStatus!\n  company: String!\n}\n\nextend type Query {\n  ReadJobs(input: PaginationInput): [Job]!\n  ReadJob(input: ID!): Job\n  ReadMyJobs(input: ID!): [Job]!\n}\n\nextend type Mutation {\n  CreateJob(input: CreateJobInput!): Id!\n  UpdateJob(input: CreateJobInput!): Id!\n  DeleteJob(input: ID!): Id!\n}\n"

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
const profileClient = new protorepo_profile_node_1.ProfileServiceClient('localhost:3000', grpc.credentials.createInsecure());
exports.default = profileClient;


/***/ }),

/***/ "./src/client/profile/schema/schema.graphql":
/*!**************************************************!*\
  !*** ./src/client/profile/schema/schema.graphql ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum AccountType {\n  BASE\n  COMPANY\n  FUNDING\n  JOB\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum ProfileOperations {\n  CREATE\n  READ\n  UPDATE\n  DELETE\n  BULK_UPDATE\n}\n\nenum OperationEntity {\n  COMPANY\n  JOB\n  INVESTOR\n}\n\ntype Education {\n  education: String\n  show: Boolean\n}\n\ntype ProfileSecurity {\n  password: String\n  passwordSalt: String\n  passwordHash: String\n  code: String\n  codeType: String\n  accountType: AccountType\n  verified: Boolean\n}\n\ntype Profile {\n  identity: Identifier\n  givenName: String\n  middleName: String\n  familyName: String\n  username: String\n  Email: String\n  gender: Gender\n  birthdate: Timestamp\n  currentPosition: String\n  education: Education\n  address: Address\n  security: ProfileSecurity\n  metadata: Metadata\n}\n"

/***/ }),

/***/ "./src/client/profile/transformer/index.ts":
/*!*************************************************!*\
  !*** ./src/client/profile/transformer/index.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __webpack_require__(/*! ../ */ "./src/client/profile/index.ts");
const util_1 = __webpack_require__(/*! util */ "util");
exports.createProfile = util_1.promisify(__1.default.createProfile).bind(__1.default);
exports.confirmProfile = util_1.promisify(__1.default.confirmProfile).bind(__1.default);
exports.readProfile = util_1.promisify(__1.default.readProfile).bind(__1.default);
exports.updateProfile = util_1.promisify(__1.default.updateProfile).bind(__1.default);
exports.validateUsername = util_1.promisify(__1.default.validateUsername).bind(__1.default);
exports.validateEmail = util_1.promisify(__1.default.validateEmail).bind(__1.default);
exports.check = util_1.promisify(__1.default.check).bind(__1.default);
exports.watch = util_1.promisify(__1.default.watch).bind(__1.default);


/***/ }),

/***/ "./src/client/root/resolver/index.ts":
/*!*******************************************!*\
  !*** ./src/client/root/resolver/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const oojob_protobuf_1 = __webpack_require__(/*! @oojob/oojob-protobuf */ "@oojob/oojob-protobuf");
const service_pb_1 = __webpack_require__(/*! @oojob/protorepo-profile-node/service_pb */ "@oojob/protorepo-profile-node/service_pb");
const transformer_1 = __webpack_require__(/*! ../../profile/transformer */ "./src/client/profile/transformer/index.ts");
const rootResolvers = {
    Query: {
        dummy: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            try {
                const profile = new service_pb_1.Profile();
                const identifier = new oojob_protobuf_1.Identifier();
                identifier.setName('dodo duck');
                identifier.setIdentifier('UTF1234:)(()');
                identifier.setAlternateName('dodo duck alternate name');
                profile.setIdentity(identifier);
                const res = yield transformer_1.createProfile(profile);
                console.log(res);
            }
            catch (error) {
                console.log(error);
            }
            return 'dodo duck lives here';
        })
    },
    Mutation: {
        dummy: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return 'Dodo Duck';
        })
    },
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
            if (node.stars)
                return 'Review';
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

/***/ "./src/client/root/schema/oojob/place.graphql":
/*!****************************************************!*\
  !*** ./src/client/root/schema/oojob/place.graphql ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Rating {\n  author: String\n  bestRating: Int\n  explanation: String\n  value: Int\n  worstRating: Int\n}\n\ntype AggregateRating {\n  itemReviewed: String!\n  ratingCount: Int!\n  reviewCount: Int\n}\n\ntype Review {\n  itemReviewed: String\n  aspect: String\n  body: String\n  rating: String\n}\n\ntype GeoLocation {\n  elevation: Int\n  latitude: Int\n  longitude: Int\n  postalCode: Int\n}\n\ntype Address {\n  country: String!\n  locality: String\n  region: String\n  postalCode: Int\n  street: String\n}\n\ntype Place {\n  address: Address\n  review: Review\n  aggregateRating: AggregateRating\n  branchCode: String\n  geo: GeoLocation\n}\n\ntype AddressInput {\n  country: String\n  locality: String\n  region: String\n  postalCode: Int\n  street: String\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/system.graphql":
/*!*****************************************************!*\
  !*** ./src/client/root/schema/oojob/system.graphql ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Range {\n  min: Int!\n  max: Int!\n}\n\ntype Id {\n  id: ID!\n}\n\nenum EmailStatus {\n  WAITING\n  CONFIRMED\n  BLOCKED\n  EXPIRED\n}\n\ntype Email {\n  email: String\n  status: EmailStatus\n  show: Boolean\n}\n\ntype Attachment {\n  type: String\n  file: String\n  uploadDate: Timestamp\n  url: String\n  user: String\n  folder: String\n}\n\ntype Identifier {\n  identifier: String!\n  name: String\n  alternateName: String\n  type: String\n  additionalType: String\n  description: String\n  disambiguatingDescription: String\n  headline: String\n  slogan: String\n}\n\ninput RangeInput {\n  min: Int!\n  max: Int!\n}\n\ninput IdInput {\n  id: ID!\n}\n\ninput EmailInput {\n  email: String\n  show: Boolean\n}\n\ninput AttachmentInput {\n  type: String\n  file: String\n  user: String\n  folder: String\n}\n\ninput IdentifierInput {\n  name: String\n  alternateName: String\n  type: String\n  additionalType: String\n  description: String\n  disambiguatingDescription: String\n  headline: String\n  slogan: String\n}\n"

/***/ }),

/***/ "./src/client/root/schema/oojob/time.graphql":
/*!***************************************************!*\
  !*** ./src/client/root/schema/oojob/time.graphql ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "enum DaysOfWeek {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THRUSDAY\n  FRIDAY\n  STAURDAY\n  SUNDAY\n}\n\ntype Time {\n  opens: Timestamp\n  closes: Timestamp\n  daysOfWeek: DaysOfWeek\n  validFrom: Timestamp\n  validThrough: Timestamp\n}\n"

/***/ }),

/***/ "./src/client/root/schema/schema.graphql":
/*!***********************************************!*\
  !*** ./src/client/root/schema/schema.graphql ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "scalar Date\n\ntype Timestamp {\n  seconds: String\n  nanos: String\n}\n\ntype Edge {\n  cursor: String!\n  node: [Result!]!\n}\n\ntype PageInfo {\n  endCursor: String!\n  hasNextPage: Boolean!\n}\n\ninterface INode {\n  id: ID!\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\nunion Result = Job | Company\n\ntype Query {\n  dummy: String!\n}\n\ntype Mutation {\n  dummy: String!\n}\n\ntype Subscription {\n  dummy: String!\n}\n\nschema {\n  query: Query\n  mutation: Mutation\n  subscription: Subscription\n}\n"

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
const placeSchema = __webpack_require__(/*! client/root/schema/oojob/place.graphql */ "./src/client/root/schema/oojob/place.graphql");
const profileSchema = __webpack_require__(/*! client/profile/schema/schema.graphql */ "./src/client/profile/schema/schema.graphql");
const rootSchema = __webpack_require__(/*! client/root/schema/schema.graphql */ "./src/client/root/schema/schema.graphql");
const systemSchema = __webpack_require__(/*! client/root/schema/oojob/system.graphql */ "./src/client/root/schema/oojob/system.graphql");
const timeSchema = __webpack_require__(/*! client/root/schema/oojob/time.graphql */ "./src/client/root/schema/oojob/time.graphql");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const resolver_1 = __webpack_require__(/*! client/company/resolver */ "./src/client/company/resolver/index.ts");
const resolver_2 = __webpack_require__(/*! client/job/resolver */ "./src/client/job/resolver/index.ts");
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const resolver_3 = __webpack_require__(/*! client/root/resolver */ "./src/client/root/resolver/index.ts");
exports.pubsub = new apollo_server_express_1.PubSub();
exports.typeDefs = [
    rootSchema,
    applicantsSchema,
    cursorSchema,
    metadataSchema,
    placeSchema,
    systemSchema,
    timeSchema,
    companySchema,
    jobSchema,
    profileSchema
];
exports.resolvers = lodash_1.merge({}, resolver_3.default, resolver_1.default, resolver_2.default);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
    context: ({ req, connection }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return ({
            req,
            connection,
            pubsub: exports.pubsub
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
const http_1 = __webpack_require__(/*! http */ "http");
const cluster_1 = __webpack_require__(/*! cluster */ "cluster");
const app_server_1 = __webpack_require__(/*! app.server */ "./src/app.server.ts");
const graphql_server_1 = __webpack_require__(/*! graphql.server */ "./src/graphql.server.ts");
const normalize_1 = __webpack_require__(/*! utillity/normalize */ "./src/utillity/normalize.ts");
class SyncServer {
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
                console.log('Closing Stayology SyncServer ...');
                try {
                    this.server.close();
                    console.log('Stayology SyncServer Closed');
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
const { startSyncServer, stopServer, app, server } = new SyncServer(app_server_1.default);
const start = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { PORT } = process.env;
    const port = PORT || '8080';
    try {
        yield stopServer();
        yield startSyncServer(port);
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
    let currentApp = app;
    if (true) {
        module.hot.accept(/*! app.server */ "./src/app.server.ts", () => {
            server.removeListener('request', currentApp);
            server.on('request', app);
            currentApp = app;
        });
        module.hot.dispose(() => server.close());
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
const corsOption = {
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
    credentials: true,
    exposedHeaders: ['authorization']
};
const cors = () => corsLibrary(corsOption);
exports.default = cors;


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
const helmet = __webpack_require__(/*! helmet */ "helmet");
const hpp = __webpack_require__(/*! hpp */ "hpp");
const cors_1 = __webpack_require__(/*! ./cors */ "./src/middlewares/cors.ts");
const logger_1 = __webpack_require__(/*! ./logger */ "./src/middlewares/logger.ts");
const winston_1 = __webpack_require__(/*! ./winston */ "./src/middlewares/winston.ts");
const middlewares = (app) => {
    app.use(cors_1.default());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.set('trust proxy', true);
    app.set('x-powered-by', false);
    app.use(compression());
    app.use((req, _, next) => {
        logger_1.default(winston_1.default);
        req.logger = winston_1.default;
        return next();
    });
    app.disable('x-powered-by');
    app.use(hpp());
    app.use(helmet.frameguard({ action: 'sameorigin' }));
    app.use(helmet.xssFilter());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
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
const logger = (logger) => morgan('combined', {
    skip: (_, res) => res.statusCode >= 200 && res.statusCode < 300,
    stream: {
        write: (message, meta) => logger.info(message, meta)
    }
});
exports.default = logger;


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
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ "@oojob/protorepo-company-node":
/*!************************************************!*\
  !*** external "@oojob/protorepo-company-node" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@oojob/protorepo-company-node");

/***/ }),

/***/ "@oojob/protorepo-company-node/service_pb":
/*!***********************************************************!*\
  !*** external "@oojob/protorepo-company-node/service_pb" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@oojob/protorepo-company-node/service_pb");

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

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9jb21wYW55L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvY29tcGFueS9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvY29tcGFueS90cmFuc2Zvcm1lci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2pvYi9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2pvYi9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3BsYWNlLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9zeXN0ZW0uZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3RpbWUuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9ncmFwaHFsLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL3dpbnN0b24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2NyeXB0by50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L25vcm1hbGl6ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvc2x1Z2lmeS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLWNvbXBhbnktbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tY29tcGFueS1ub2RlL3NlcnZpY2VfcGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJib2R5LXBhcnNlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNsdXN0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb21wcmVzc2lvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkb3RlbnYvY29uZmlnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZ3JwY1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhlbG1ldFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImhwcFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJvc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0c2xpYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV0aWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ3aW5zdG9uXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7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QzVCO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0EsY0FBYyw0QkFBNEI7UUFDMUM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJOztRQUVKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTs7UUFFQTtRQUNBO1FBQ0EsZUFBZSw0QkFBNEI7UUFDM0M7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQSxlQUFlLDRCQUE0QjtRQUMzQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsaUJBQWlCLHVDQUF1QztRQUN4RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFD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QUNaLENBQUM7QUFFUSxzQ0FBYTs7Ozs7Ozs7Ozs7Ozs7O0FDWnRCLE1BQU0sVUFBVTtJQUdmLFlBQVksR0FBZ0I7UUFJckIsWUFBTyxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7WUFHakMsT0FBTyxJQUFJO2lCQUNULFdBQVcsRUFBRTtpQkFDYixPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7UUFDdEIsQ0FBQztRQVZBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztJQUNmLENBQUM7Q0FVRDtBQUVELGtCQUFlLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25CekIsa0Q7Ozs7Ozs7Ozs7O0FDQUEsMEQ7Ozs7Ozs7Ozs7O0FDQUEscUU7Ozs7Ozs7Ozs7O0FDQUEsMEQ7Ozs7Ozs7Ozs7O0FDQUEscUU7Ozs7Ozs7Ozs7O0FDQUEsa0Q7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsb0MiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vXCIgKyBcIi5ob3QvXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIik7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rLmlkLCBjaHVuay5tb2R1bGVzKTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkge1xuIFx0XHR0cnkge1xuIFx0XHRcdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIFwiLmhvdC9cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpO1xuIFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcbiBcdH1cblxuIFx0Ly9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIyOGM4YzdhZmQxYzMyOGQ4OTgzY1wiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0e1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkICYmXG4gXHRcdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG4gXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgQXBwVXRpbHMgZnJvbSAndXRpbGxpdHknXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgbWlkZGxld2FlcyBmcm9tICdtaWRkbGV3YXJlcydcblxuY2xhc3MgQXBwIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIGFwcFV0aWxzOiBBcHBVdGlsc1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuYXBwID0gZXhwcmVzcygpXG5cblx0XHR0aGlzLmFwcFV0aWxzID0gbmV3IEFwcFV0aWxzKHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwbHlTZXJ2ZXIoKVxuXHR9XG5cblx0cHVibGljIHN0YXRpYyBib290c3RyYXAoKTogQXBwIHtcblx0XHRyZXR1cm4gbmV3IEFwcCgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5U2VydmVyID0gYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHRoaXMuYXBwVXRpbHMuYXBwbHlVdGlscygpXG5cdFx0YXdhaXQgdGhpcy5hcHBseU1pZGRsZXdhcmUoKVxuXHR9XG5cblx0cHJpdmF0ZSBhcHBseU1pZGRsZXdhcmUgPSBhc3luYyAoKSA9PiB7XG5cdFx0bWlkZGxld2Flcyh0aGlzLmFwcClcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgQXBwKClcbmV4cG9ydCBkZWZhdWx0IGFwcGxpY2F0aW9uLmFwcFxuIiwiaW1wb3J0ICogYXMgZ3JwYyBmcm9tICdncnBjJ1xuXG5pbXBvcnQgeyBDb21wYW55U2VydmljZUNsaWVudCB9IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tY29tcGFueS1ub2RlJ1xuXG5jb25zdCBjb21wYW55Q2xpZW50ID0gbmV3IENvbXBhbnlTZXJ2aWNlQ2xpZW50KCdsb2NhbGhvc3Q6MzAwMCcsIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcblxuZXhwb3J0IGRlZmF1bHQgY29tcGFueUNsaWVudFxuIiwiaW1wb3J0IHsgQ29tcGFueSwgQ29tcGFueUFsbFJlc3BvbnNlLCBJZCwgUGFnaW5hdGlvbiwgUmFuZ2UgfSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLWNvbXBhbnktbm9kZS9zZXJ2aWNlX3BiJ1xuaW1wb3J0IHsgY3JlYXRlQ29tcGFueSwgcmVhZEFsbENvbXBhbmllcywgcmVhZENvbXBhbnkgfSBmcm9tICcuLi90cmFuc2Zvcm1lcidcblxuaW1wb3J0IHsgUHViU3ViIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJ1xuXG5jb25zdCBDT01QQU5ZX0NSRUFURUQgPSAnQ09NUEFOWV9DUkVBVEVEJ1xuXG5jb25zdCBSZWFkQ29tcGFueSA9IGFzeW5jIChfOiBhbnksIHsgaW5wdXQgfTogYW55KSA9PiB7XG5cdGNvbnN0IGlkID0gbmV3IElkKClcblx0aWQuc2V0SWQoaW5wdXQpXG5cdGNvbnN0IGNvbXBhbnkgPSAoYXdhaXQgcmVhZENvbXBhbnkoaWQpKSBhcyBDb21wYW55XG5cblx0cmV0dXJuIGNvbXBhbnkudG9PYmplY3QodHJ1ZSlcbn1cblxuY29uc3QgUmVhZENvbXBhbmllcyA9IGFzeW5jIChfOiBhbnksIHsgaW5wdXQgfTogYW55KSA9PiB7XG5cdGNvbnN0IHBhZ2luYXRpb24gPSBuZXcgUGFnaW5hdGlvbigpXG5cdHBhZ2luYXRpb24uc2V0TGltaXQoaW5wdXQubGltaXQpXG5cdHBhZ2luYXRpb24uc2V0U2tpcChpbnB1dC5za2lwKVxuXG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzcG9uc2UgPSAoYXdhaXQgcmVhZEFsbENvbXBhbmllcyhwYWdpbmF0aW9uKSkgYXMgQ29tcGFueUFsbFJlc3BvbnNlXG5cdFx0Y29uc3QgX2NvbXBhbmllcyA9IHJlc3BvbnNlLmdldENvbXBhbmllc0xpc3QoKVxuXHRcdGNvbnN0IGNvbXBhbmllcyA9IF9jb21wYW5pZXMubWFwKChjb21wYW55KSA9PiBjb21wYW55LnRvT2JqZWN0KHRydWUpKVxuXG5cdFx0cmV0dXJuIGNvbXBhbmllc1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihlcnJvcilcblx0fVxufVxuXG5leHBvcnQgY29uc3QgUXVlcnkgPSB7XG5cdFJlYWRDb21wYW55LFxuXHRSZWFkQ29tcGFuaWVzXG59XG5cbmNvbnN0IENyZWF0ZUNvbXBhbnkgPSBhc3luYyAoXzogYW55LCB7IGlucHV0IH06IGFueSwgeyBwdWJzdWIgfTogeyBwdWJzdWI6IFB1YlN1YiB9KSA9PiB7XG5cdGNvbnN0IGNvbXBhbnlJbnB1dCA9IG5ldyBDb21wYW55KClcblx0Y29tcGFueUlucHV0LnNldENyZWF0ZWRCeShpbnB1dC5jcmVhdGVkQnkpXG5cdGNvbXBhbnlJbnB1dC5zZXROYW1lKGlucHV0Lm5hbWUpXG5cdGNvbXBhbnlJbnB1dC5zZXREZXNjcmlwdGlvbihpbnB1dC5kZXNjcmlwdGlvbilcblx0Y29tcGFueUlucHV0LnNldFVybChpbnB1dC51cmwpXG5cdGNvbXBhbnlJbnB1dC5zZXRMb2dvKGlucHV0LmxvZ28pXG5cdGNvbXBhbnlJbnB1dC5zZXRMb2NhdGlvbihpbnB1dC5sb2NhdGlvbilcblx0Y29tcGFueUlucHV0LnNldEZvdW5kZWRZZWFyKGlucHV0LmZvdW5kZWRZZWFyKVxuXHRjb25zdCByYW5nZSA9IG5ldyBSYW5nZSgpXG5cdHJhbmdlLnNldE1pbihpbnB1dC5ub09mRW1wbG95ZWVzLm1pbilcblx0cmFuZ2Uuc2V0TWF4KGlucHV0Lm5vT2ZFbXBsb3llZXMubWF4KVxuXHRjb21wYW55SW5wdXQuc2V0Tm9PZkVtcGxveWVlcyhyYW5nZSlcblx0Y29tcGFueUlucHV0LnNldEhpcmluZ1N0YXR1cyhpbnB1dC5oaXJpbmdTdGF0dXMpXG5cdGNvbXBhbnlJbnB1dC5zZXRTa2lsbHNMaXN0KGlucHV0LnNraWxscylcblxuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gKGF3YWl0IGNyZWF0ZUNvbXBhbnkoY29tcGFueUlucHV0KSkgYXMgSWRcblx0XHRjb25zdCBjb21wYW55ID0gcmVzcG9uc2UudG9PYmplY3QoKVxuXHRcdHB1YnN1Yi5wdWJsaXNoKENPTVBBTllfQ1JFQVRFRCwgeyBjb21wYW55Q3JlYXRlZDogY29tcGFueSB9KVxuXG5cdFx0cmV0dXJuIGNvbXBhbnlcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpXG5cdH1cbn1cbmNvbnN0IFVwZGF0ZUNvbXBhbnkgPSAoKSA9PiB7fVxuXG5jb25zdCBEZWxldGVDb21wYW55ID0gKCkgPT4ge31cblxuZXhwb3J0IGNvbnN0IE11dGF0aW9uID0ge1xuXHRDcmVhdGVDb21wYW55LFxuXHRVcGRhdGVDb21wYW55LFxuXHREZWxldGVDb21wYW55XG59XG5cbmNvbnN0IENvbXBhbnlDcmVhdGVkID0ge1xuXHRzdWJzY3JpYmU6IChfOiBhbnksIF9fOiBhbnksIHsgcHVic3ViIH06IHsgcHVic3ViOiBQdWJTdWIgfSkgPT4gcHVic3ViLmFzeW5jSXRlcmF0b3IoQ09NUEFOWV9DUkVBVEVEKVxufVxuXG5leHBvcnQgY29uc3QgU3Vic2NyaXB0aW9uID0ge1xuXHRDb21wYW55Q3JlYXRlZFxufVxuXG5leHBvcnQgY29uc3QgY29tcGFueVJlc29sdmVycyA9IHtcblx0UXVlcnksXG5cdE11dGF0aW9uLFxuXHRTdWJzY3JpcHRpb25cbn1cbmV4cG9ydCBkZWZhdWx0IGNvbXBhbnlSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIENvbXBhbnkgaW1wbGVtZW50cyBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGNyZWF0ZWRCeTogSURcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRfeWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZVxcbiAgbGFzdEFjdGl2ZTogVGltZXN0YW1wXFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbmlucHV0IENvbXBhbnlJbnB1dCB7XFxuICBjcmVhdGVkQnk6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgZGVzY3JpcHRpb246IFN0cmluZyFcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRZZWFyOiBTdHJpbmdcXG4gIG5vT2ZFbXBsb3llZXM6IFJhbmdlSW5wdXRcXG4gIGhpcmluZ1N0YXR1czogQm9vbGVhblxcbiAgc2tpbGxzOiBbU3RyaW5nXVxcbn1cXG5cXG5leHRlbmQgdHlwZSBRdWVyeSB7XFxuICBSZWFkQ29tcGFuaWVzKGlucHV0OiBQYWdpbmF0aW9uSW5wdXQpOiBbQ29tcGFueV0hXFxuICBSZWFkTXlDb21wYW5pZXMoaW5wdXQ6IElEISk6IFtDb21wYW55XSFcXG4gIFJlYWRDb21wYW55KGlucHV0OiBJRCk6IENvbXBhbnlcXG59XFxuXFxuZXh0ZW5kIHR5cGUgTXV0YXRpb24ge1xcbiAgQ3JlYXRlQ29tcGFueShpbnB1dDogQ29tcGFueUlucHV0ISk6IElkIVxcbiAgVXBkYXRlQ29tcGFueShpbnB1dDogQ29tcGFueUlucHV0ISk6IElkIVxcbiAgRGVsZXRlQ29tcGFueShpbnB1dDogSUQhKTogSWQhXFxufVxcblxcbmV4dGVuZCB0eXBlIFN1YnNjcmlwdGlvbiB7XFxuICBDb21wYW55Q3JlYXRlZDogSWQhXFxufVxcblwiIiwiaW1wb3J0IGNvbXBhbnlDbGllbnQgZnJvbSAnLi4vJ1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCdcblxuZXhwb3J0IGNvbnN0IHJlYWRDb21wYW55ID0gcHJvbWlzaWZ5KGNvbXBhbnlDbGllbnQucmVhZENvbXBhbnkpLmJpbmQoY29tcGFueUNsaWVudClcbmV4cG9ydCBjb25zdCByZWFkQ29tcGFuaWVzID0gcHJvbWlzaWZ5KGNvbXBhbnlDbGllbnQucmVhZENvbXBhbmllcykuYmluZChjb21wYW55Q2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlYWRBbGxDb21wYW5pZXMgPSBwcm9taXNpZnkoY29tcGFueUNsaWVudC5yZWFkQWxsQ29tcGFuaWVzKS5iaW5kKGNvbXBhbnlDbGllbnQpXG5leHBvcnQgY29uc3QgY3JlYXRlQ29tcGFueSA9IHByb21pc2lmeShjb21wYW55Q2xpZW50LmNyZWF0ZUNvbXBhbnkpLmJpbmQoY29tcGFueUNsaWVudClcbmV4cG9ydCBjb25zdCB1cGRhdGVDb21wYW55ID0gcHJvbWlzaWZ5KGNvbXBhbnlDbGllbnQudXBkYXRlQ29tcGFueSkuYmluZChjb21wYW55Q2xpZW50KVxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbXBhbnkgPSBwcm9taXNpZnkoY29tcGFueUNsaWVudC5kZWxldGVDb21wYW55KS5iaW5kKGNvbXBhbnlDbGllbnQpXG4iLCJjb25zdCBSZWFkSm9icyA9ICgpID0+IHt9XG5cbmNvbnN0IFJlYWRKb2IgPSAoKSA9PiB7fVxuXG5jb25zdCBSZWFkTXlKb2JzID0gKCkgPT4ge31cblxuZXhwb3J0IGNvbnN0IFF1ZXJ5ID0ge1xuXHRSZWFkSm9iLFxuXHRSZWFkSm9icyxcblx0UmVhZE15Sm9ic1xufVxuXG5jb25zdCBDcmVhdGVKb2IgPSAoKSA9PiB7fVxuXG5jb25zdCBVcGRhdGVKb2IgPSAoKSA9PiB7fVxuXG5jb25zdCBEZWxldGVKb2IgPSAoKSA9PiB7fVxuXG5leHBvcnQgY29uc3QgTXV0YXRpb24gPSB7XG5cdENyZWF0ZUpvYixcblx0VXBkYXRlSm9iLFxuXHREZWxldGVKb2Jcbn1cblxuZXhwb3J0IGNvbnN0IGpvYlJlc29sdmVycyA9IHtcblx0UXVlcnksXG5cdE11dGF0aW9uXG59XG5leHBvcnQgZGVmYXVsdCBqb2JSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIEN1cnJlbnRTdGF0dXMge1xcbiAgQUNUSVZFXFxuICBIT0xEXFxuICBFWFBJUkVEXFxufVxcblxcbmVudW0gSm9iVHlwZSB7XFxuICBERUZBVUxUXFxuICBGRUFUVVJFRFxcbiAgUFJFTUlVTVxcbn1cXG5cXG50eXBlIFNhbGxhcnkge1xcbiAgdmFsdWU6IEZsb2F0IVxcbiAgY3VycmVuY3k6IFN0cmluZyFcXG59XFxuXFxudHlwZSBKb2IgaW1wbGVtZW50cyBJTm9kZSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmchXFxuICB0eXBlOiBKb2JUeXBlIVxcbiAgY2F0ZWdvcnk6IFtTdHJpbmchXSFcXG4gIGRlc2M6IFN0cmluZyFcXG4gIHNraWxsc1JlcXVpcmVkOiBbU3RyaW5nIV0hXFxuICBzYWxsYXJ5OiBSYW5nZVxcbiAgbG9jYXRpb246IFN0cmluZyFcXG4gIGF0dGFjaG1lbnQ6IFtBdHRhY2htZW50XVxcbiAgc3RhdHVzOiBDdXJyZW50U3RhdHVzXFxuICB2aWV3czogSW50XFxuICB1c2Vyc0FwcGxpZWQ6IFtTdHJpbmchXVxcbiAgY3JlYXRlZEJ5OiBTdHJpbmdcXG4gIGNvbXBhbnk6IFN0cmluZyFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnR5cGUgSm9iUmVzdWx0Q3Vyc29yIHtcXG4gIGVkZ2VzOiBFZGdlIVxcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxcbiAgdG90YWxDb3VudDogSW50IVxcbn1cXG5cXG5pbnB1dCBTYWxsYXJ5SW5wdXQge1xcbiAgdmFsdWU6IEZsb2F0IVxcbiAgY3VycmVuY3k6IFN0cmluZyFcXG59XFxuXFxuaW5wdXQgQ3JlYXRlSm9iSW5wdXQge1xcbiAgbmFtZTogU3RyaW5nIVxcbiAgdHlwZTogSm9iVHlwZSFcXG4gIGNhdGVnb3J5OiBbU3RyaW5nIV0hXFxuICBkZXNjOiBTdHJpbmchXFxuICBza2lsbHNfcmVxdWlyZWQ6IFtTdHJpbmchXSFcXG4gIHNhbGxhcnk6IFJhbmdlSW5wdXQhXFxuICBzYWxsYXJ5X21heDogU2FsbGFyeUlucHV0IVxcbiAgYXR0YWNobWVudDogW0F0dGFjaG1lbnRJbnB1dF1cXG4gIGxvY2F0aW9uOiBTdHJpbmchXFxuICBzdGF0dXM6IEN1cnJlbnRTdGF0dXMhXFxuICBjb21wYW55OiBTdHJpbmchXFxufVxcblxcbmV4dGVuZCB0eXBlIFF1ZXJ5IHtcXG4gIFJlYWRKb2JzKGlucHV0OiBQYWdpbmF0aW9uSW5wdXQpOiBbSm9iXSFcXG4gIFJlYWRKb2IoaW5wdXQ6IElEISk6IEpvYlxcbiAgUmVhZE15Sm9icyhpbnB1dDogSUQhKTogW0pvYl0hXFxufVxcblxcbmV4dGVuZCB0eXBlIE11dGF0aW9uIHtcXG4gIENyZWF0ZUpvYihpbnB1dDogQ3JlYXRlSm9iSW5wdXQhKTogSWQhXFxuICBVcGRhdGVKb2IoaW5wdXQ6IENyZWF0ZUpvYklucHV0ISk6IElkIVxcbiAgRGVsZXRlSm9iKGlucHV0OiBJRCEpOiBJZCFcXG59XFxuXCIiLCJpbXBvcnQgKiBhcyBncnBjIGZyb20gJ2dycGMnXG5cbmltcG9ydCB7IFByb2ZpbGVTZXJ2aWNlQ2xpZW50IH0gZnJvbSAnQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUnXG5cbmNvbnN0IHByb2ZpbGVDbGllbnQgPSBuZXcgUHJvZmlsZVNlcnZpY2VDbGllbnQoJ2xvY2FsaG9zdDozMDAwJywgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuXG5leHBvcnQgZGVmYXVsdCBwcm9maWxlQ2xpZW50XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBBY2NvdW50VHlwZSB7XFxuICBCQVNFXFxuICBDT01QQU5ZXFxuICBGVU5ESU5HXFxuICBKT0JcXG59XFxuXFxuZW51bSBHZW5kZXIge1xcbiAgTUFMRVxcbiAgRkVNQUxFXFxuICBPVEhFUlxcbn1cXG5cXG5lbnVtIFByb2ZpbGVPcGVyYXRpb25zIHtcXG4gIENSRUFURVxcbiAgUkVBRFxcbiAgVVBEQVRFXFxuICBERUxFVEVcXG4gIEJVTEtfVVBEQVRFXFxufVxcblxcbmVudW0gT3BlcmF0aW9uRW50aXR5IHtcXG4gIENPTVBBTllcXG4gIEpPQlxcbiAgSU5WRVNUT1JcXG59XFxuXFxudHlwZSBFZHVjYXRpb24ge1xcbiAgZWR1Y2F0aW9uOiBTdHJpbmdcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlU2VjdXJpdHkge1xcbiAgcGFzc3dvcmQ6IFN0cmluZ1xcbiAgcGFzc3dvcmRTYWx0OiBTdHJpbmdcXG4gIHBhc3N3b3JkSGFzaDogU3RyaW5nXFxuICBjb2RlOiBTdHJpbmdcXG4gIGNvZGVUeXBlOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlIHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVyXFxuICBnaXZlbk5hbWU6IFN0cmluZ1xcbiAgbWlkZGxlTmFtZTogU3RyaW5nXFxuICBmYW1pbHlOYW1lOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIEVtYWlsOiBTdHJpbmdcXG4gIGdlbmRlcjogR2VuZGVyXFxuICBiaXJ0aGRhdGU6IFRpbWVzdGFtcFxcbiAgY3VycmVudFBvc2l0aW9uOiBTdHJpbmdcXG4gIGVkdWNhdGlvbjogRWR1Y2F0aW9uXFxuICBhZGRyZXNzOiBBZGRyZXNzXFxuICBzZWN1cml0eTogUHJvZmlsZVNlY3VyaXR5XFxuICBtZXRhZGF0YTogTWV0YWRhdGFcXG59XFxuXCIiLCJpbXBvcnQgcHJvZmlsZUNsaWVudCBmcm9tICcuLi8nXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuXG5leHBvcnQgY29uc3QgY3JlYXRlUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmNyZWF0ZVByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBjb25maXJtUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmNvbmZpcm1Qcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgcmVhZFByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5yZWFkUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC51cGRhdGVQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VybmFtZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZhbGlkYXRlVXNlcm5hbWUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUVtYWlsID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmFsaWRhdGVFbWFpbCkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IGNoZWNrID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuY2hlY2spLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB3YXRjaCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LndhdGNoKS5iaW5kKHByb2ZpbGVDbGllbnQpXG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnQG9vam9iL29vam9iLXByb3RvYnVmJ1xuaW1wb3J0IHsgUHJvZmlsZSB9IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGInXG5pbXBvcnQgeyBjcmVhdGVQcm9maWxlIH0gZnJvbSAnLi4vLi4vcHJvZmlsZS90cmFuc2Zvcm1lcidcblxuY29uc3Qgcm9vdFJlc29sdmVycyA9IHtcblx0UXVlcnk6IHtcblx0XHRkdW1teTogYXN5bmMgKCkgPT4ge1xuXHRcdFx0Ly8gZG8gZm9yIGRvZG9cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHByb2ZpbGUgPSBuZXcgUHJvZmlsZSgpXG5cdFx0XHRcdGNvbnN0IGlkZW50aWZpZXIgPSBuZXcgSWRlbnRpZmllcigpXG5cdFx0XHRcdGlkZW50aWZpZXIuc2V0TmFtZSgnZG9kbyBkdWNrJylcblx0XHRcdFx0aWRlbnRpZmllci5zZXRJZGVudGlmaWVyKCdVVEYxMjM0OikoKCknKVxuXHRcdFx0XHRpZGVudGlmaWVyLnNldEFsdGVybmF0ZU5hbWUoJ2RvZG8gZHVjayBhbHRlcm5hdGUgbmFtZScpXG5cdFx0XHRcdHByb2ZpbGUuc2V0SWRlbnRpdHkoaWRlbnRpZmllcilcblxuXHRcdFx0XHRjb25zdCByZXMgPSBhd2FpdCBjcmVhdGVQcm9maWxlKHByb2ZpbGUpXG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlcylcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gJ2RvZG8gZHVjayBsaXZlcyBoZXJlJ1xuXHRcdH1cblx0fSxcblx0TXV0YXRpb246IHtcblx0XHRkdW1teTogYXN5bmMgKCkgPT4ge1xuXHRcdFx0cmV0dXJuICdEb2RvIER1Y2snXG5cdFx0fVxuXHR9LFxuXHRSZXN1bHQ6IHtcblx0XHRfX3Jlc29sdmVUeXBlOiAobm9kZTogYW55KSA9PiB7XG5cdFx0XHRpZiAobm9kZS5ub09mRW1wbG95ZWVzKSByZXR1cm4gJ0NvbXBhbnknXG5cblx0XHRcdHJldHVybiAnSm9iJ1xuXHRcdH1cblx0fSxcblx0SU5vZGU6IHtcblx0XHRfX3Jlc29sdmVUeXBlOiAobm9kZTogYW55KSA9PiB7XG5cdFx0XHRpZiAobm9kZS5ub09mRW1wbG95ZWVzKSByZXR1cm4gJ0NvbXBhbnknXG5cdFx0XHRpZiAobm9kZS5zdGFycykgcmV0dXJuICdSZXZpZXcnXG5cblx0XHRcdHJldHVybiAnQ29tcGFueSdcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcm9vdFJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgQXBwbGljYW50IHtcXG4gIGFwcGxpY2F0aW9uczogW1N0cmluZ10hXFxuICBzaG9ydGxpc3RlZDogW1N0cmluZ10hXFxuICBvbmhvbGQ6IFtTdHJpbmddIVxcbiAgcmVqZWN0ZWQ6IFtTdHJpbmddIVxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIFNvcnQge1xcbiAgQVNDXFxuICBERVNDXFxufVxcblxcbnR5cGUgUGFnaW5hdGlvbiB7XFxuICBwYWdlOiBJbnRcXG4gIGZpcnN0OiBJbnRcXG4gIGFmdGVyOiBTdHJpbmdcXG4gIG9mZnNldDogSW50XFxuICBsaW1pdDogSW50XFxuICBzb3J0OiBTb3J0XFxuICBwcmV2aW91czogU3RyaW5nXFxuICBuZXh0OiBTdHJpbmdcXG4gIGlkZW50aWZpZXI6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBQYWdpbmF0aW9uSW5wdXQge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgTWV0YWRhdGEge1xcbiAgY3JlYXRlZF9hdDogVGltZXN0YW1wXFxuICB1cGRhdGVkX2F0OiBUaW1lc3RhbXBcXG4gIHB1Ymxpc2hlZF9kYXRlOiBUaW1lc3RhbXBcXG4gIGVuZF9kYXRlOiBUaW1lc3RhbXBcXG4gIGxhc3RfYWN0aXZlOiBUaW1lc3RhbXBcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBSYXRpbmcge1xcbiAgYXV0aG9yOiBTdHJpbmdcXG4gIGJlc3RSYXRpbmc6IEludFxcbiAgZXhwbGFuYXRpb246IFN0cmluZ1xcbiAgdmFsdWU6IEludFxcbiAgd29yc3RSYXRpbmc6IEludFxcbn1cXG5cXG50eXBlIEFnZ3JlZ2F0ZVJhdGluZyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZyFcXG4gIHJhdGluZ0NvdW50OiBJbnQhXFxuICByZXZpZXdDb3VudDogSW50XFxufVxcblxcbnR5cGUgUmV2aWV3IHtcXG4gIGl0ZW1SZXZpZXdlZDogU3RyaW5nXFxuICBhc3BlY3Q6IFN0cmluZ1xcbiAgYm9keTogU3RyaW5nXFxuICByYXRpbmc6IFN0cmluZ1xcbn1cXG5cXG50eXBlIEdlb0xvY2F0aW9uIHtcXG4gIGVsZXZhdGlvbjogSW50XFxuICBsYXRpdHVkZTogSW50XFxuICBsb25naXR1ZGU6IEludFxcbiAgcG9zdGFsQ29kZTogSW50XFxufVxcblxcbnR5cGUgQWRkcmVzcyB7XFxuICBjb3VudHJ5OiBTdHJpbmchXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFBsYWNlIHtcXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHJldmlldzogUmV2aWV3XFxuICBhZ2dyZWdhdGVSYXRpbmc6IEFnZ3JlZ2F0ZVJhdGluZ1xcbiAgYnJhbmNoQ29kZTogU3RyaW5nXFxuICBnZW86IEdlb0xvY2F0aW9uXFxufVxcblxcbnR5cGUgQWRkcmVzc0lucHV0IHtcXG4gIGNvdW50cnk6IFN0cmluZ1xcbiAgbG9jYWxpdHk6IFN0cmluZ1xcbiAgcmVnaW9uOiBTdHJpbmdcXG4gIHBvc3RhbENvZGU6IEludFxcbiAgc3RyZWV0OiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBSYW5nZSB7XFxuICBtaW46IEludCFcXG4gIG1heDogSW50IVxcbn1cXG5cXG50eXBlIElkIHtcXG4gIGlkOiBJRCFcXG59XFxuXFxuZW51bSBFbWFpbFN0YXR1cyB7XFxuICBXQUlUSU5HXFxuICBDT05GSVJNRURcXG4gIEJMT0NLRURcXG4gIEVYUElSRURcXG59XFxuXFxudHlwZSBFbWFpbCB7XFxuICBlbWFpbDogU3RyaW5nXFxuICBzdGF0dXM6IEVtYWlsU3RhdHVzXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbnR5cGUgQXR0YWNobWVudCB7XFxuICB0eXBlOiBTdHJpbmdcXG4gIGZpbGU6IFN0cmluZ1xcbiAgdXBsb2FkRGF0ZTogVGltZXN0YW1wXFxuICB1cmw6IFN0cmluZ1xcbiAgdXNlcjogU3RyaW5nXFxuICBmb2xkZXI6IFN0cmluZ1xcbn1cXG5cXG50eXBlIElkZW50aWZpZXIge1xcbiAgaWRlbnRpZmllcjogU3RyaW5nIVxcbiAgbmFtZTogU3RyaW5nXFxuICBhbHRlcm5hdGVOYW1lOiBTdHJpbmdcXG4gIHR5cGU6IFN0cmluZ1xcbiAgYWRkaXRpb25hbFR5cGU6IFN0cmluZ1xcbiAgZGVzY3JpcHRpb246IFN0cmluZ1xcbiAgZGlzYW1iaWd1YXRpbmdEZXNjcmlwdGlvbjogU3RyaW5nXFxuICBoZWFkbGluZTogU3RyaW5nXFxuICBzbG9nYW46IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBSYW5nZUlucHV0IHtcXG4gIG1pbjogSW50IVxcbiAgbWF4OiBJbnQhXFxufVxcblxcbmlucHV0IElkSW5wdXQge1xcbiAgaWQ6IElEIVxcbn1cXG5cXG5pbnB1dCBFbWFpbElucHV0IHtcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxuaW5wdXQgQXR0YWNobWVudElucHV0IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxuICB1c2VyOiBTdHJpbmdcXG4gIGZvbGRlcjogU3RyaW5nXFxufVxcblxcbmlucHV0IElkZW50aWZpZXJJbnB1dCB7XFxuICBuYW1lOiBTdHJpbmdcXG4gIGFsdGVybmF0ZU5hbWU6IFN0cmluZ1xcbiAgdHlwZTogU3RyaW5nXFxuICBhZGRpdGlvbmFsVHlwZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBkaXNhbWJpZ3VhdGluZ0Rlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGhlYWRsaW5lOiBTdHJpbmdcXG4gIHNsb2dhbjogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gRGF5c09mV2VlayB7XFxuICBNT05EQVlcXG4gIFRVRVNEQVlcXG4gIFdFRE5FU0RBWVxcbiAgVEhSVVNEQVlcXG4gIEZSSURBWVxcbiAgU1RBVVJEQVlcXG4gIFNVTkRBWVxcbn1cXG5cXG50eXBlIFRpbWUge1xcbiAgb3BlbnM6IFRpbWVzdGFtcFxcbiAgY2xvc2VzOiBUaW1lc3RhbXBcXG4gIGRheXNPZldlZWs6IERheXNPZldlZWtcXG4gIHZhbGlkRnJvbTogVGltZXN0YW1wXFxuICB2YWxpZFRocm91Z2g6IFRpbWVzdGFtcFxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJzY2FsYXIgRGF0ZVxcblxcbnR5cGUgVGltZXN0YW1wIHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cXG50eXBlIEVkZ2Uge1xcbiAgY3Vyc29yOiBTdHJpbmchXFxuICBub2RlOiBbUmVzdWx0IV0hXFxufVxcblxcbnR5cGUgUGFnZUluZm8ge1xcbiAgZW5kQ3Vyc29yOiBTdHJpbmchXFxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcXG59XFxuXFxuaW50ZXJmYWNlIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnVuaW9uIFJlc3VsdCA9IEpvYiB8IENvbXBhbnlcXG5cXG50eXBlIFF1ZXJ5IHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgTXV0YXRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBTdWJzY3JpcHRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxuc2NoZW1hIHtcXG4gIHF1ZXJ5OiBRdWVyeVxcbiAgbXV0YXRpb246IE11dGF0aW9uXFxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGFwcGxpY2FudHNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGNvbXBhbnlTY2hlbWEgZnJvbSAnY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY3Vyc29yU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9jdXJzb3IuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGpvYlNjaGVtYSBmcm9tICdjbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIG1ldGFkYXRhU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9tZXRhZGF0YS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcGxhY2VTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3BsYWNlLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwcm9maWxlU2NoZW1hIGZyb20gJ2NsaWVudC9wcm9maWxlL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHJvb3RTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgc3lzdGVtU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9zeXN0ZW0uZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHRpbWVTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3RpbWUuZ3JhcGhxbCdcblxuaW1wb3J0IHsgQXBvbGxvU2VydmVyLCBQdWJTdWIgfSBmcm9tICdhcG9sbG8tc2VydmVyLWV4cHJlc3MnXG5cbmltcG9ydCBjb21wYW55UmVzb2x2ZXJzIGZyb20gJ2NsaWVudC9jb21wYW55L3Jlc29sdmVyJ1xuaW1wb3J0IGpvYlJlc29sdmVycyBmcm9tICdjbGllbnQvam9iL3Jlc29sdmVyJ1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgcm9vdFJlc29sdmVycyBmcm9tICdjbGllbnQvcm9vdC9yZXNvbHZlcidcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gW1xuXHRyb290U2NoZW1hLFxuXHRhcHBsaWNhbnRzU2NoZW1hLFxuXHRjdXJzb3JTY2hlbWEsXG5cdG1ldGFkYXRhU2NoZW1hLFxuXHRwbGFjZVNjaGVtYSxcblx0c3lzdGVtU2NoZW1hLFxuXHR0aW1lU2NoZW1hLFxuXHRjb21wYW55U2NoZW1hLFxuXHRqb2JTY2hlbWEsXG5cdHByb2ZpbGVTY2hlbWFcbl1cbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSBtZXJnZSh7fSwgcm9vdFJlc29sdmVycywgY29tcGFueVJlc29sdmVycywgam9iUmVzb2x2ZXJzKVxuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcblx0dHlwZURlZnMsXG5cdHJlc29sdmVycyxcblx0Y29udGV4dDogYXN5bmMgKHsgcmVxLCBjb25uZWN0aW9uIH0pID0+ICh7XG5cdFx0cmVxLFxuXHRcdGNvbm5lY3Rpb24sXG5cdFx0cHVic3ViXG5cdH0pLFxuXHR0cmFjaW5nOiB0cnVlXG59KVxuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXJcbiIsImltcG9ydCAnZG90ZW52L2NvbmZpZydcblxuaW1wb3J0IHsgU2VydmVyLCBjcmVhdGVTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuaW1wb3J0IHsgZm9yaywgaXNNYXN0ZXIsIG9uIH0gZnJvbSAnY2x1c3RlcidcblxuaW1wb3J0IEFwcCBmcm9tICdhcHAuc2VydmVyJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGdyYXBocWxTZXJ2ZXIgZnJvbSAnZ3JhcGhxbC5zZXJ2ZXInXG5pbXBvcnQgeyBub3JtYWxpemVQb3J0IH0gZnJvbSAndXRpbGxpdHkvbm9ybWFsaXplJ1xuXG5kZWNsYXJlIGNvbnN0IG1vZHVsZTogYW55XG5cbmNsYXNzIFN5bmNTZXJ2ZXIge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwdWJsaWMgc2VydmVyOiBTZXJ2ZXJcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0XHRncmFwaHFsU2VydmVyLmFwcGx5TWlkZGxld2FyZSh7IGFwcCB9KVxuXHRcdHRoaXMuc2VydmVyID0gY3JlYXRlU2VydmVyKGFwcClcblx0XHRncmFwaHFsU2VydmVyLmluc3RhbGxTdWJzY3JpcHRpb25IYW5kbGVycyh0aGlzLnNlcnZlcilcblx0fVxuXG5cdHN0YXJ0U3luY1NlcnZlciA9IGFzeW5jIChwb3J0OiBzdHJpbmcpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgUE9SVCA9IG5vcm1hbGl6ZVBvcnQocG9ydClcblx0XHRcdHRoaXMuc2VydmVyLmxpc3RlbihQT1JULCAoKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGBzZXJ2ZXIgcmVhZHkgYXQgaHR0cDovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLmdyYXBocWxQYXRofWApXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBTdWJzY3JpcHRpb25zIHJlYWR5IGF0IHdzOi8vbG9jYWxob3N0OiR7UE9SVH0ke2dyYXBocWxTZXJ2ZXIuc3Vic2NyaXB0aW9uc1BhdGh9YClcblx0XHRcdH0pXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGF3YWl0IHRoaXMuc3RvcFNlcnZlcigpXG5cdFx0fVxuXHR9XG5cblx0c3RvcFNlcnZlciA9IGFzeW5jICgpID0+IHtcblx0XHRwcm9jZXNzLm9uKCdTSUdJTlQnLCBhc3luYyAoKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZygnQ2xvc2luZyBTdGF5b2xvZ3kgU3luY1NlcnZlciAuLi4nKVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0aGlzLnNlcnZlci5jbG9zZSgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdTdGF5b2xvZ3kgU3luY1NlcnZlciBDbG9zZWQnKVxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3IgQ2xvc2luZyBTeW5jU2VydmVyIFNlcnZlciBDb25uZWN0aW9uJylcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnJvcilcblx0XHRcdFx0cHJvY2Vzcy5raWxsKHByb2Nlc3MucGlkKVxuXHRcdFx0fVxuXHRcdH0pXG5cdH1cbn1cblxuY29uc3QgeyBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIsIGFwcCwgc2VydmVyIH0gPSBuZXcgU3luY1NlcnZlcihBcHApXG5jb25zdCBzdGFydCA9IGFzeW5jICgpID0+IHtcblx0Y29uc3QgeyBQT1JUIH0gPSBwcm9jZXNzLmVudlxuXHRjb25zdCBwb3J0ID0gUE9SVCB8fCAnODA4MCdcblxuXHR0cnkge1xuXHRcdGF3YWl0IHN0b3BTZXJ2ZXIoKVxuXHRcdGF3YWl0IHN0YXJ0U3luY1NlcnZlcihwb3J0KVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoJ1NlcnZlciBGYWlsZWQgdG8gc3RhcnQnKVxuXHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cdFx0cHJvY2Vzcy5leGl0KDEpXG5cdH1cbn1cblxuaWYgKGlzTWFzdGVyKSB7XG5cdGNvbnN0IG51bUNQVXMgPSByZXF1aXJlKCdvcycpLmNwdXMoKS5sZW5ndGhcblxuXHRjb25zb2xlLmxvZyhgTWFzdGVyICR7cHJvY2Vzcy5waWR9IGlzIHJ1bm5pbmdgKVxuXG5cdC8vIEZvcmsgd29ya2Vycy5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1DUFVzOyBpKyspIHtcblx0XHRmb3JrKClcblx0fVxuXG5cdG9uKCdmb3JrJywgKHdvcmtlcikgPT4ge1xuXHRcdGNvbnNvbGUubG9nKCd3b3JrZXIgaXMgZGVhZDonLCB3b3JrZXIuaXNEZWFkKCkpXG5cdH0pXG5cblx0b24oJ2V4aXQnLCAod29ya2VyKSA9PiB7XG5cdFx0Y29uc29sZS5sb2coJ3dvcmtlciBpcyBkZWFkOicsIHdvcmtlci5pc0RlYWQoKSlcblx0fSlcbn0gZWxzZSB7XG5cdC8qKlxuXHQgKiBbaWYgSG90IE1vZHVsZSBmb3Igd2VicGFja11cblx0ICogQHBhcmFtICB7W3R5cGVdfSBtb2R1bGUgW2dsb2JhbCBtb2R1bGUgbm9kZSBvYmplY3RdXG5cdCAqL1xuXHRsZXQgY3VycmVudEFwcCA9IGFwcFxuXHRpZiAobW9kdWxlLmhvdCkge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KCdhcHAuc2VydmVyJywgKCkgPT4ge1xuXHRcdFx0c2VydmVyLnJlbW92ZUxpc3RlbmVyKCdyZXF1ZXN0JywgY3VycmVudEFwcClcblx0XHRcdHNlcnZlci5vbigncmVxdWVzdCcsIGFwcClcblx0XHRcdGN1cnJlbnRBcHAgPSBhcHBcblx0XHR9KVxuXG5cdFx0LyoqXG5cdFx0ICogTmV4dCBjYWxsYmFjayBpcyBlc3NlbnRpYWw6XG5cdFx0ICogQWZ0ZXIgY29kZSBjaGFuZ2VzIHdlcmUgYWNjZXB0ZWQgd2UgbmVlZCB0byByZXN0YXJ0IHRoZSBhcHAuXG5cdFx0ICogc2VydmVyLmNsb3NlKCkgaXMgaGVyZSBFeHByZXNzLkpTLXNwZWNpZmljIGFuZCBjYW4gZGlmZmVyIGluIG90aGVyIGZyYW1ld29ya3MuXG5cdFx0ICogVGhlIGlkZWEgaXMgdGhhdCB5b3Ugc2hvdWxkIHNodXQgZG93biB5b3VyIGFwcCBoZXJlLlxuXHRcdCAqIERhdGEvc3RhdGUgc2F2aW5nIGJldHdlZW4gc2h1dGRvd24gYW5kIG5ldyBzdGFydCBpcyBwb3NzaWJsZVxuXHRcdCAqL1xuXHRcdG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiBzZXJ2ZXIuY2xvc2UoKSlcblx0fVxuXG5cdC8vIFdvcmtlcnMgY2FuIHNoYXJlIGFueSBUQ1AgY29ubmVjdGlvblxuXHQvLyBJbiB0aGlzIGNhc2UgaXQgaXMgYW4gSFRUUCBzZXJ2ZXJcblx0c3RhcnQoKVxuXG5cdGNvbnNvbGUubG9nKGBXb3JrZXIgJHtwcm9jZXNzLnBpZH0gc3RhcnRlZGApXG59XG4iLCJpbXBvcnQgKiBhcyBjb3JzTGlicmFyeSBmcm9tICdjb3JzJ1xuXG5jb25zdCBjb3JzT3B0aW9uID0ge1xuXHRvcmlnaW46IHRydWUsXG5cdG1ldGhvZHM6ICdHRVQsIEhFQUQsIFBVVCwgUEFUQ0gsIFBPU1QsIERFTEVURSwgT1BUSU9OJyxcblx0Y3JlZGVudGlhbHM6IHRydWUsXG5cdGV4cG9zZWRIZWFkZXJzOiBbJ2F1dGhvcml6YXRpb24nXVxufVxuXG5jb25zdCBjb3JzID0gKCkgPT4gY29yc0xpYnJhcnkoY29yc09wdGlvbilcbmV4cG9ydCBkZWZhdWx0IGNvcnNcbiIsImltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgKiBhcyBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbidcbmltcG9ydCAqIGFzIGhlbG1ldCBmcm9tICdoZWxtZXQnXG5pbXBvcnQgKiBhcyBocHAgZnJvbSAnaHBwJ1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiwgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBjb3JzIGZyb20gJy4vY29ycydcbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXInXG5pbXBvcnQgdG9vYnVzeSBmcm9tICcuL3Rvb2J1c3knXG5pbXBvcnQgd2luc3RvbiBmcm9tICcuL3dpbnN0b24nXG5cbmNvbnN0IG1pZGRsZXdhcmVzID0gKGFwcDogQXBwbGljYXRpb24pID0+IHtcblx0Ly8gQ09SUyBmb3IgY3Jvc3NzLXRlIGFjY2Vzc1xuXHRhcHAudXNlKGNvcnMoKSlcblxuXHQvLyBqc29uIGVuY29kaW5nIGFuZCBkZWNvZGluZ1xuXHRhcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSlcblx0YXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSlcblxuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXG5cdC8vIHNldCBHWmlwIG9uIGhlYWRlcnMgZm9yIHJlcXVlc3QvcmVzcG9uc2Vcblx0YXBwLnVzZShjb21wcmVzc2lvbigpKVxuXG5cdC8vIGF0dGFjaCBsb2dnZXIgZm9yIGFwcGxpY2F0aW9uXG5cdGFwcC51c2UoKHJlcTogUmVxdWVzdCwgXzogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRcdGxvZ2dlcih3aW5zdG9uKVxuXHRcdHJlcS5sb2dnZXIgPSB3aW5zdG9uXG5cblx0XHRyZXR1cm4gbmV4dCgpXG5cdH0pXG5cblx0Ly8gc2VjdXJpdHkgaGVsbWV0IHBhY2thZ2Vcblx0Ly8gRG9uJ3QgZXhwb3NlIGFueSBzb2Z0d2FyZSBpbmZvcm1hdGlvbiB0byBoYWNrZXJzLlxuXHRhcHAuZGlzYWJsZSgneC1wb3dlcmVkLWJ5JylcblxuXHQvLyBFeHByZXNzIG1pZGRsZXdhcmUgdG8gcHJvdGVjdCBhZ2FpbnN0IEhUVFAgUGFyYW1ldGVyIFBvbGx1dGlvbiBhdHRhY2tzXG5cdGFwcC51c2UoaHBwKCkpXG5cblx0Ly8gVGhlIFgtRnJhbWUtT3B0aW9ucyBoZWFkZXIgdGVsbHMgYnJvd3NlcnMgdG8gcHJldmVudCB5b3VyIHdlYnBhZ2UgZnJvbSBiZWluZyBwdXQgaW4gYW4gaWZyYW1lLlxuXHRhcHAudXNlKGhlbG1ldC5mcmFtZWd1YXJkKHsgYWN0aW9uOiAnc2FtZW9yaWdpbicgfSkpXG5cblx0Ly8gQ3Jvc3Mtc2l0ZSBzY3JpcHRpbmcsIGFiYnJldmlhdGVkIHRvIOKAnFhTU+KAnSwgaXMgYSB3YXkgYXR0YWNrZXJzIGNhbiB0YWtlIG92ZXIgd2VicGFnZXMuXG5cdGFwcC51c2UoaGVsbWV0Lnhzc0ZpbHRlcigpKVxuXG5cdC8vIFNldHMgdGhlIFgtRG93bmxvYWQtT3B0aW9ucyB0byBwcmV2ZW50IEludGVybmV0IEV4cGxvcmVyIGZyb20gZXhlY3V0aW5nXG5cdC8vIGRvd25sb2FkcyBpbiB5b3VyIHNpdGXigJlzIGNvbnRleHQuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9pZW5vb3Blbi9cblx0YXBwLnVzZShoZWxtZXQuaWVOb09wZW4oKSlcblxuXHQvLyBEb27igJl0IFNuaWZmIE1pbWV0eXBlIG1pZGRsZXdhcmUsIG5vU25pZmYsIGhlbHBzIHByZXZlbnQgYnJvd3NlcnMgZnJvbSB0cnlpbmdcblx0Ly8gdG8gZ3Vlc3MgKOKAnHNuaWZm4oCdKSB0aGUgTUlNRSB0eXBlLCB3aGljaCBjYW4gaGF2ZSBzZWN1cml0eSBpbXBsaWNhdGlvbnMuIEl0XG5cdC8vIGRvZXMgdGhpcyBieSBzZXR0aW5nIHRoZSBYLUNvbnRlbnQtVHlwZS1PcHRpb25zIGhlYWRlciB0byBub3NuaWZmLlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvZG9udC1zbmlmZi1taW1ldHlwZS9cblx0YXBwLnVzZShoZWxtZXQubm9TbmlmZigpKVxuXG5cdC8vIGJ1c3N5IHNlcnZlciAod2FpdCBmb3IgaXQgdG8gcmVzb2x2ZSlcblx0Ly8gYXBwLnVzZSh0b29idXN5KCkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1pZGRsZXdhcmVzXG4iLCJpbXBvcnQgKiBhcyBtb3JnYW4gZnJvbSAnbW9yZ2FuJ1xuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnd2luc3RvbidcblxuY29uc3QgbG9nZ2VyID0gKGxvZ2dlcjogTG9nZ2VyKSA9PlxuXHRtb3JnYW4oJ2NvbWJpbmVkJywge1xuXHRcdHNraXA6IChfOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiByZXMuc3RhdHVzQ29kZSA+PSAyMDAgJiYgcmVzLnN0YXR1c0NvZGUgPCAzMDAsXG5cdFx0c3RyZWFtOiB7XG5cdFx0XHR3cml0ZTogKG1lc3NhZ2U6IHN0cmluZywgbWV0YT86IGFueSkgPT4gbG9nZ2VyLmluZm8obWVzc2FnZSwgbWV0YSlcblx0XHR9XG5cdH0pXG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJPcHRpb25zLCBjcmVhdGVMb2dnZXIsIGZvcm1hdCwgdHJhbnNwb3J0cyB9IGZyb20gJ3dpbnN0b24nXG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdmcydcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuXG5jb25zdCB7IGNvbWJpbmUsIHRpbWVzdGFtcCwgcHJldHR5UHJpbnQgfSA9IGZvcm1hdFxuY29uc3QgbG9nRGlyZWN0b3J5ID0gam9pbihfX2Rpcm5hbWUsICdsb2cnKVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG50eXBlIElMb2dnZXJPcHRpb25zID0geyBmaWxlOiBMb2dnZXJPcHRpb25zOyBjb25zb2xlOiBMb2dnZXJPcHRpb25zIH1cblxuZXhwb3J0IGNvbnN0IGxvZ2dlck9wdGlvbnMgPSB7XG5cdGZpbGU6IHtcblx0XHRsZXZlbDogJ2luZm8nLFxuXHRcdGZpbGVuYW1lOiBgJHtsb2dEaXJlY3Rvcnl9L2xvZ3MvYXBwLmxvZ2AsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiB0cnVlLFxuXHRcdG1heHNpemU6IDUyNDI4ODAsIC8vIDVNQlxuXHRcdG1heEZpbGVzOiA1LFxuXHRcdGNvbG9yaXplOiBmYWxzZVxuXHR9LFxuXHRjb25zb2xlOiB7XG5cdFx0bGV2ZWw6ICdkZWJ1ZycsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiBmYWxzZSxcblx0XHRjb2xvcml6ZTogdHJ1ZVxuXHR9XG59XG5jb25zdCBsb2dnZXJUcmFuc3BvcnRzID0gW1xuXHRuZXcgdHJhbnNwb3J0cy5Db25zb2xlKHtcblx0XHQuLi5sb2dnZXJPcHRpb25zLmNvbnNvbGUsXG5cdFx0Zm9ybWF0OiBmb3JtYXQuY29tYmluZShcblx0XHRcdGZvcm1hdC50aW1lc3RhbXAoKSxcblx0XHRcdGZvcm1hdC5jb2xvcml6ZSh7IGFsbDogdHJ1ZSB9KSxcblx0XHRcdGZvcm1hdC5hbGlnbigpLFxuXHRcdFx0Zm9ybWF0LnByaW50ZigoaW5mbykgPT4ge1xuXHRcdFx0XHRjb25zdCB7IHRpbWVzdGFtcCwgbGV2ZWwsIG1lc3NhZ2UsIC4uLmFyZ3MgfSA9IGluZm9cblxuXHRcdFx0XHQvLyBjb25zdCB0cyA9IHRpbWVzdGFtcC5zbGljZSgwLCAxOSkucmVwbGFjZSgnVCcsICcgJyk7XG5cdFx0XHRcdHJldHVybiBgJHt0aW1lc3RhbXB9ICR7bGV2ZWx9OiAke21lc3NhZ2V9ICR7T2JqZWN0LmtleXMoYXJncykubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoYXJncywgbnVsbCwgMikgOiAnJ31gXG5cdFx0XHR9KVxuXHRcdClcblx0fSlcbl1cblxuY2xhc3MgQXBwTG9nZ2VyIHtcblx0cHVibGljIGxvZ2dlcjogTG9nZ2VyXG5cdHB1YmxpYyBsb2dnZXJPcHRpb25zOiBJTG9nZ2VyT3B0aW9uc1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IElMb2dnZXJPcHRpb25zKSB7XG5cdFx0aWYgKCFpc0RldmVsb3BtZW50KSB7XG5cdFx0XHRleGlzdHNTeW5jKGxvZ0RpcmVjdG9yeSkgfHwgbWtkaXJTeW5jKGxvZ0RpcmVjdG9yeSlcblx0XHR9XG5cblx0XHR0aGlzLmxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XG5cdFx0XHR0cmFuc3BvcnRzOiBpc0RldmVsb3BtZW50XG5cdFx0XHRcdD8gWy4uLmxvZ2dlclRyYW5zcG9ydHNdXG5cdFx0XHRcdDogW1xuXHRcdFx0XHRcdFx0Li4ubG9nZ2VyVHJhbnNwb3J0cyxcblx0XHRcdFx0XHRcdG5ldyB0cmFuc3BvcnRzLkZpbGUoe1xuXHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLmZpbGUsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogY29tYmluZSh0aW1lc3RhbXAoKSwgcHJldHR5UHJpbnQoKSlcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdCAgXSxcblx0XHRcdGV4aXRPbkVycm9yOiBmYWxzZVxuXHRcdH0pXG5cdH1cbn1cblxuY29uc3QgeyBsb2dnZXIgfSA9IG5ldyBBcHBMb2dnZXIobG9nZ2VyT3B0aW9ucylcbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0IHsgY3JlYXRlQ2lwaGVyLCBjcmVhdGVEZWNpcGhlciB9IGZyb20gJ2NyeXB0bydcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY2xhc3MgQXBwQ3J5cHRvIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHJpdmF0ZSBFTkNSWVBUX0FMR09SSVRITTogc3RyaW5nXG5cdHByaXZhdGUgRU5DUllQVF9TRUNSRVQ6IHN0cmluZ1xuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHRjb25zdCB7IEVOQ1JZUFRfU0VDUkVUID0gJ2RvZG9kdWNrQE45JywgRU5DUllQVF9BTEdPUklUSE0gPSAnYWVzLTI1Ni1jdHInIH0gPSBwcm9jZXNzLmVudlxuXG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0XHR0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNID0gRU5DUllQVF9BTEdPUklUSE1cblx0XHR0aGlzLkVOQ1JZUFRfU0VDUkVUID0gRU5DUllQVF9TRUNSRVRcblx0fVxuXG5cdHB1YmxpYyBlbmNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBFbmNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjaXBoZXIgPSBjcmVhdGVDaXBoZXIodGhpcy5FTkNSWVBUX0FMR09SSVRITSwgdGhpcy5FTkNSWVBUX1NFQ1JFVClcblx0XHRcdGxldCBjcnlwdGVkID0gY2lwaGVyLnVwZGF0ZSh0ZXh0LCAndXRmOCcsICdoZXgnKVxuXHRcdFx0Y3J5cHRlZCArPSBjaXBoZXIuZmluYWwoJ2hleCcpXG5cblx0XHRcdHJldHVybiBjcnlwdGVkXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZGVjcnlwdCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHR0aGlzLmFwcC5sb2dnZXIuaW5mbyhgRGVjcnlwdCBmb3IgJHt0ZXh0fWApXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGRlYyA9IGRlY2lwaGVyLnVwZGF0ZSh0ZXh0LCAnaGV4JywgJ3V0ZjgnKVxuXHRcdFx0ZGVjICs9IGRlY2lwaGVyLmZpbmFsKCd1dGY4JylcblxuXHRcdFx0cmV0dXJuIGRlY1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcC5sb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSlcblxuXHRcdFx0cmV0dXJuICcnXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENyeXB0b1xuIiwiaW1wb3J0IEFwcENyeXB0byBmcm9tICcuL2NyeXB0bydcbmltcG9ydCBBcHBTbHVnaWZ5IGZyb20gJy4vc2x1Z2lmeSdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IElBcHBVdGlscyB9IGZyb20gJy4vdXRpbC5pbnRlcmZhY2UnXG5cbmNsYXNzIEFwcFV0aWxzIGltcGxlbWVudHMgSUFwcFV0aWxzIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblxuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKCdJbml0aWFsaXplZCBBcHBVdGlscycpXG5cdH1cblxuXHRwdWJsaWMgYXBwbHlVdGlscyA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcblx0XHRjb25zdCB7IGVuY3J5cHQsIGRlY3J5cHQgfSA9IG5ldyBBcHBDcnlwdG8odGhpcy5hcHApXG5cdFx0Y29uc3QgeyBzbHVnaWZ5IH0gPSBuZXcgQXBwU2x1Z2lmeSh0aGlzLmFwcClcblx0XHR0aGlzLmFwcC51dGlsaXR5ID0ge1xuXHRcdFx0ZW5jcnlwdCxcblx0XHRcdGRlY3J5cHQsXG5cdFx0XHRzbHVnaWZ5XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWVcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBVdGlsc1xuIiwiY29uc3Qgbm9ybWFsaXplUG9ydCA9IChwb3J0VmFsdWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG5cdGNvbnN0IHBvcnQgPSBwYXJzZUludChwb3J0VmFsdWUsIDEwKVxuXG5cdGlmIChpc05hTihwb3J0KSkge1xuXHRcdHJldHVybiA4MDgwXG5cdH1cblxuXHRpZiAocG9ydCA+PSAwKSB7XG5cdFx0cmV0dXJuIHBvcnRcblx0fVxuXG5cdHJldHVybiBwb3J0XG59XG5cbmV4cG9ydCB7IG5vcm1hbGl6ZVBvcnQgfVxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBTbHVnaWZ5IHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0fVxuXG5cdHB1YmxpYyBzbHVnaWZ5ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBTbHVnaWZ5IGZvciAke3RleHR9YClcblxuXHRcdHJldHVybiB0ZXh0XG5cdFx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdFx0LnJlcGxhY2UoL1teXFx3IF0rL2csICcnKVxuXHRcdFx0LnJlcGxhY2UoLyArL2csICctJylcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBTbHVnaWZ5XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL3Byb3RvcmVwby1jb21wYW55LW5vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL3Byb3RvcmVwby1jb21wYW55LW5vZGUvc2VydmljZV9wYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbHVzdGVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvbXByZXNzaW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudi9jb25maWdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncnBjXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhlbG1ldFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJocHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9yZ2FuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHNsaWJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ3aW5zdG9uXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=