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
/******/ 	var hotCurrentHash = "aac2f5ad2b1df9013b16";
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

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const express = __webpack_require__(/*! express */ "express");
const utillity_1 = __webpack_require__(/*! ./utillity */ "./src/utillity/index.ts");
const middlewares_1 = __webpack_require__(/*! ./middlewares */ "./src/middlewares/index.ts");
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
exports.Query = {
    ReadCompany,
    ReadCompanies
};
const companyResolvers = {
    Query: exports.Query,
    Mutation: {
        CreateCompany
    },
    Subscription: {
        companyCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(COMPANY_CREATED)
        }
    }
};
exports.default = companyResolvers;


/***/ }),

/***/ "./src/client/company/schema/schema.graphql":
/*!**************************************************!*\
  !*** ./src/client/company/schema/schema.graphql ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "type Company {\n  id: ID!\n  name: String\n  description: String\n  createdBy: ID\n  url: String\n  logo: String\n  location: String\n  founded_year: String\n  noOfEmployees: Range\n  lastActive: Timestamp\n  hiringStatus: Boolean\n  skills: [String]\n  createdAt: Timestamp!\n  updatedAt: Timestamp!\n}\n\ninput CompanyInput {\n  createdBy: ID!\n  name: String!\n  description: String!\n  url: String\n  logo: String\n  location: String\n  foundedYear: String\n  noOfEmployees: RangeInput\n  hiringStatus: Boolean\n  skills: [String]\n}\n\nextend type Query {\n  ReadCompanies(input: PaginationInput): [Company]!\n  ReadCompany(input: ID): Company\n}\n\nextend type Mutation {\n  CreateCompany(input: CompanyInput!): Id!\n}\n\nextend type Subscription {\n  companyCreated: Id!\n}\n"

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

/***/ "./src/client/root/resolver/index.ts":
/*!*******************************************!*\
  !*** ./src/client/root/resolver/index.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const rootResolvers = {
    Query: {
        dummy: () => 'dodo duck lives here'
    },
    Mutation: {
        dummy: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            return 'Dodo Duck';
        })
    }
};
exports.default = rootResolvers;


/***/ }),

/***/ "./src/client/root/schema/schema.graphql":
/*!***********************************************!*\
  !*** ./src/client/root/schema/schema.graphql ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "scalar Date\n\nenum Permissions {\n  ADMIN\n  COMPANY\n  JOB\n  INVESTOR\n  COMPANYREAD\n  JOBREAD\n  INVESTORREAD\n  PERMISSIONUPDATE\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  OTHER\n}\n\nenum AccType {\n  BASE_USER\n  COMPANY_USER\n  FUNDING_USER\n  JOB_USER\n}\n\nenum Sort {\n  ASC\n  DESC\n}\n\ntype Timestamp {\n  seconds: String\n  nanos: String\n}\n\ntype Id {\n  id: ID!\n}\n\ntype Range {\n  min: Int!\n  max: Int!\n}\n\ntype Attachment {\n  type: String\n  file: String\n}\n\ntype PageInfo {\n  endCursor: String!\n  hasNextPage: Boolean!\n}\n\ntype Pagination {\n  skip: String\n  limit: Int\n}\n\ninput IdInput {\n  id: ID!\n}\n\ninput RangeInput {\n  min: Int!\n  max: Int!\n}\n\ninput AttachmentInput {\n  type: String\n  file: String\n}\n\ninput PaginationInput {\n  page: Int\n  first: Int\n  after: String\n  offset: Int\n  sort: Sort\n  skip: String\n  limit: Int\n}\n\ntype Query {\n  dummy: String!\n}\n\ntype Mutation {\n  dummy: String!\n}\n\ntype Subscription {\n  dummy: String!\n}\n\nschema {\n  query: Query\n  mutation: Mutation\n  subscription: Subscription\n}\n"

/***/ }),

/***/ "./src/graphql.ts":
/*!************************!*\
  !*** ./src/graphql.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(/*! tslib */ "tslib");
const companySchema = __webpack_require__(/*! ./client/company/schema/schema.graphql */ "./src/client/company/schema/schema.graphql");
const rootSchema = __webpack_require__(/*! ./client/root/schema/schema.graphql */ "./src/client/root/schema/schema.graphql");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const resolver_1 = __webpack_require__(/*! ./client/company/resolver */ "./src/client/company/resolver/index.ts");
const lodash_1 = __webpack_require__(/*! lodash */ "lodash");
const resolver_2 = __webpack_require__(/*! ./client/root/resolver */ "./src/client/root/resolver/index.ts");
exports.pubsub = new apollo_server_express_1.PubSub();
exports.typeDefs = [rootSchema, companySchema];
exports.resolvers = lodash_1.merge({}, resolver_2.default, resolver_1.default);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
    context: ({ req, connection }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return {
            req,
            connection,
            pubsub: exports.pubsub
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
const http_1 = __webpack_require__(/*! http */ "http");
const cluster_1 = __webpack_require__(/*! cluster */ "cluster");
const app_1 = __webpack_require__(/*! ./app */ "./src/app.ts");
const graphql_1 = __webpack_require__(/*! ./graphql */ "./src/graphql.ts");
const normalize_1 = __webpack_require__(/*! ./utillity/normalize */ "./src/utillity/normalize.ts");
class SyncServer {
    constructor(app) {
        this.startSyncServer = (port) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const PORT = normalize_1.normalizePort(port);
                this.server.listen(PORT, () => {
                    console.log(`server ready at http://localhost:${PORT}${graphql_1.default.graphqlPath}`);
                    console.log(`Subscriptions ready at ws://localhost:${PORT}${graphql_1.default.subscriptionsPath}`);
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
        graphql_1.default.applyMiddleware({ app });
        this.server = http_1.createServer(app);
        graphql_1.default.installSubscriptionHandlers(this.server);
    }
}
const { startSyncServer, stopServer, app, server } = new SyncServer(app_1.default);
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
        module.hot.accept(/*! ./app */ "./src/app.ts", () => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9jb21wYW55L3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvY29tcGFueS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9jb21wYW55L3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9ncmFwaHFsLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvY29ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2xvZ2dlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvd2luc3Rvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvY3J5cHRvLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvbm9ybWFsaXplLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9zbHVnaWZ5LnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tY29tcGFueS1ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL3Byb3RvcmVwby1jb21wYW55LW5vZGUvc2VydmljZV9wYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudi9jb25maWdcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncnBjXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaGVsbWV0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHBwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImxvZGFzaFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vcmdhblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInRzbGliXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXRpbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIndpbnN0b25cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtR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OztRQUVBO1FBQ0E7UUFDQTtRQUNBLGdCQUFnQixLQUFLO1FBQ3JCO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLFlBQVk7UUFDNUI7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQSxjQUFjLDRCQUE0QjtRQUMxQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7O1FBRUo7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQSxlQUFlLDRCQUE0QjtRQUMzQztRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBLGVBQWUsNEJBQTRCO1FBQzNDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxpQkFBaUIsdUNBQXVDO1FBQ3hEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFD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QUVRLHNDQUFhOzs7Ozs7Ozs7Ozs7Ozs7QUNadEIsTUFBTSxVQUFVO0lBR2YsWUFBWSxHQUFnQjtRQUlyQixZQUFPLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUdqQyxPQUFPLElBQUk7aUJBQ1QsV0FBVyxFQUFFO2lCQUNiLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDO2lCQUN2QixPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztRQUN0QixDQUFDO1FBVkEsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHO0lBQ2YsQ0FBQztDQVVEO0FBRUQsa0JBQWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkJ6QiwwRDs7Ozs7Ozs7Ozs7QUNBQSxxRTs7Ozs7Ozs7Ozs7QUNBQSxrRDs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxnQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQyIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgY2h1bmsgPSByZXF1aXJlKFwiLi9cIiArIFwiLmhvdC9cIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiKTtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmsuaWQsIGNodW5rLm1vZHVsZXMpO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7XG4gXHRcdHRyeSB7XG4gXHRcdFx0dmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIuL1wiICsgXCIuaG90L1wiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIik7XG4gXHRcdH0gY2F0Y2ggKGUpIHtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gXHRcdH1cbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh1cGRhdGUpO1xuIFx0fVxuXG4gXHQvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cblxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcImFhYzJmNWFkMmIxZGY5MDEzYjE2XCI7XG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTtcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRpZiAoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuIFx0XHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG4gXHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuIFx0XHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSkge1xuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuIFx0XHRcdFx0XHRcdHJlcXVlc3QgK1xuIFx0XHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdCk7XG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcbiBcdFx0fTtcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xuIFx0XHRcdFx0fSxcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH07XG4gXHRcdH07XG4gXHRcdGZvciAodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJlXCIgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwidFwiXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicmVhZHlcIikgaG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcbiBcdFx0XHRcdHRocm93IGVycjtcbiBcdFx0XHR9KTtcblxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcbiBcdFx0XHRcdGlmIChob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XG4gXHRcdFx0XHRcdGlmICghaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRmbi50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0XHRpZiAobW9kZSAmIDEpIHZhbHVlID0gZm4odmFsdWUpO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLnQodmFsdWUsIG1vZGUgJiB+MSk7XG4gXHRcdH07XG4gXHRcdHJldHVybiBmbjtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIGhvdCA9IHtcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxuXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0XHRlbHNlIGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XG4gXHRcdFx0fSxcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcbiBcdFx0XHRcdGlmIChkZXAgPT09IHVuZGVmaW5lZCkgaG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGlmICghbCkgcmV0dXJuIGhvdFN0YXR1cztcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cbiBcdFx0fTtcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xuIFx0XHRyZXR1cm4gaG90O1xuIFx0fVxuXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcblxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XG4gXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xuIFx0fVxuXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdERlZmVycmVkO1xuXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcbiBcdFx0dmFyIGlzTnVtYmVyID0gK2lkICsgXCJcIiA9PT0gaWQ7XG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcImlkbGVcIikge1xuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xuIFx0XHR9XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSBcIm1haW5cIjtcbiBcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbG9uZS1ibG9ja3NcbiBcdFx0XHR7XG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJlxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJlxuIFx0XHRcdFx0aG90V2FpdGluZ0ZpbGVzID09PSAwXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcbiBcdFx0XHRyZXR1cm47XG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XG4gXHRcdGZvciAodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRpZiAoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xuIFx0XHRpZiAoIWRlZmVycmVkKSByZXR1cm47XG4gXHRcdGlmIChob3RBcHBseU9uVXBkYXRlKSB7XG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKClcbiBcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XG4gXHRcdFx0XHR9KVxuIFx0XHRcdFx0LnRoZW4oXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiBcdFx0XHRcdFx0fSxcbiBcdFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdCk7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwicmVhZHlcIilcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gXHRcdHZhciBjYjtcbiBcdFx0dmFyIGk7XG4gXHRcdHZhciBqO1xuIFx0XHR2YXIgbW9kdWxlO1xuIFx0XHR2YXIgbW9kdWxlSWQ7XG5cbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQgJiZcbiBcdFx0XHRcdC8vIHJlbW92ZWQgc2VsZi1hY2NlcHRlZCBtb2R1bGVzIHNob3VsZCBub3QgYmUgcmVxdWlyZWRcbiBcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdICE9PSB3YXJuVW5leHBlY3RlZFJlcXVpcmVcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxuIFx0XHRcdFx0fSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBBcHBVdGlscyBmcm9tICcuL3V0aWxsaXR5J1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IG1pZGRsZXdhZXMgZnJvbSAnLi9taWRkbGV3YXJlcydcblxuY2xhc3MgQXBwIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIGFwcFV0aWxzOiBBcHBVdGlsc1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuYXBwID0gZXhwcmVzcygpXG5cblx0XHR0aGlzLmFwcFV0aWxzID0gbmV3IEFwcFV0aWxzKHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwbHlTZXJ2ZXIoKVxuXHR9XG5cblx0cHVibGljIHN0YXRpYyBib290c3RyYXAoKTogQXBwIHtcblx0XHRyZXR1cm4gbmV3IEFwcCgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5U2VydmVyID0gYXN5bmMgKCkgPT4ge1xuXHRcdGF3YWl0IHRoaXMuYXBwVXRpbHMuYXBwbHlVdGlscygpXG5cdFx0YXdhaXQgdGhpcy5hcHBseU1pZGRsZXdhcmUoKVxuXHR9XG5cblx0cHJpdmF0ZSBhcHBseU1pZGRsZXdhcmUgPSBhc3luYyAoKSA9PiB7XG5cdFx0bWlkZGxld2Flcyh0aGlzLmFwcClcblx0fVxufVxuXG5leHBvcnQgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgQXBwKClcbmV4cG9ydCBkZWZhdWx0IGFwcGxpY2F0aW9uLmFwcFxuIiwiaW1wb3J0ICogYXMgZ3JwYyBmcm9tICdncnBjJ1xuXG5pbXBvcnQgeyBDb21wYW55U2VydmljZUNsaWVudCB9IGZyb20gJ0Bvb2pvYi9wcm90b3JlcG8tY29tcGFueS1ub2RlJ1xuXG5jb25zdCBjb21wYW55Q2xpZW50ID0gbmV3IENvbXBhbnlTZXJ2aWNlQ2xpZW50KCdsb2NhbGhvc3Q6MzAwMCcsIGdycGMuY3JlZGVudGlhbHMuY3JlYXRlSW5zZWN1cmUoKSlcblxuZXhwb3J0IGRlZmF1bHQgY29tcGFueUNsaWVudFxuIiwiaW1wb3J0IHsgQ29tcGFueSwgQ29tcGFueUFsbFJlc3BvbnNlLCBJZCwgUGFnaW5hdGlvbiwgUmFuZ2UgfSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLWNvbXBhbnktbm9kZS9zZXJ2aWNlX3BiJ1xuaW1wb3J0IHsgY3JlYXRlQ29tcGFueSwgcmVhZEFsbENvbXBhbmllcywgcmVhZENvbXBhbnkgfSBmcm9tICcuLi90cmFuc2Zvcm1lcidcbmltcG9ydCB7IFB1YlN1YiB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcblxuY29uc3QgQ09NUEFOWV9DUkVBVEVEID0gJ0NPTVBBTllfQ1JFQVRFRCdcblxuY29uc3QgUmVhZENvbXBhbnkgPSBhc3luYyAoXzogYW55LCB7IGlucHV0IH06IGFueSkgPT4ge1xuXHRjb25zdCBpZCA9IG5ldyBJZCgpXG5cdGlkLnNldElkKGlucHV0KVxuXHRjb25zdCBjb21wYW55ID0gKGF3YWl0IHJlYWRDb21wYW55KGlkKSkgYXMgQ29tcGFueVxuXG5cdHJldHVybiBjb21wYW55LnRvT2JqZWN0KHRydWUpXG59XG5cbmNvbnN0IFJlYWRDb21wYW5pZXMgPSBhc3luYyAoXzogYW55LCB7IGlucHV0IH06IGFueSkgPT4ge1xuXHRjb25zdCBwYWdpbmF0aW9uID0gbmV3IFBhZ2luYXRpb24oKVxuXHRwYWdpbmF0aW9uLnNldExpbWl0KGlucHV0LmxpbWl0KVxuXHRwYWdpbmF0aW9uLnNldFNraXAoaW5wdXQuc2tpcClcblxuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3BvbnNlID0gKGF3YWl0IHJlYWRBbGxDb21wYW5pZXMocGFnaW5hdGlvbikpIGFzIENvbXBhbnlBbGxSZXNwb25zZVxuXHRcdGNvbnN0IF9jb21wYW5pZXMgPSByZXNwb25zZS5nZXRDb21wYW5pZXNMaXN0KClcblx0XHRjb25zdCBjb21wYW5pZXMgPSBfY29tcGFuaWVzLm1hcCgoY29tcGFueSkgPT4gY29tcGFueS50b09iamVjdCh0cnVlKSlcblxuXHRcdHJldHVybiBjb21wYW5pZXNcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyb3IpXG5cdH1cbn1cblxuY29uc3QgQ3JlYXRlQ29tcGFueSA9IGFzeW5jIChfOiBhbnksIHsgaW5wdXQgfTogYW55LCB7IHB1YnN1YiB9OiB7IHB1YnN1YjogUHViU3ViIH0pID0+IHtcblx0Y29uc3QgY29tcGFueUlucHV0ID0gbmV3IENvbXBhbnkoKVxuXHRjb21wYW55SW5wdXQuc2V0Q3JlYXRlZEJ5KGlucHV0LmNyZWF0ZWRCeSlcblx0Y29tcGFueUlucHV0LnNldE5hbWUoaW5wdXQubmFtZSlcblx0Y29tcGFueUlucHV0LnNldERlc2NyaXB0aW9uKGlucHV0LmRlc2NyaXB0aW9uKVxuXHRjb21wYW55SW5wdXQuc2V0VXJsKGlucHV0LnVybClcblx0Y29tcGFueUlucHV0LnNldExvZ28oaW5wdXQubG9nbylcblx0Y29tcGFueUlucHV0LnNldExvY2F0aW9uKGlucHV0LmxvY2F0aW9uKVxuXHRjb21wYW55SW5wdXQuc2V0Rm91bmRlZFllYXIoaW5wdXQuZm91bmRlZFllYXIpXG5cdGNvbnN0IHJhbmdlID0gbmV3IFJhbmdlKClcblx0cmFuZ2Uuc2V0TWluKGlucHV0Lm5vT2ZFbXBsb3llZXMubWluKVxuXHRyYW5nZS5zZXRNYXgoaW5wdXQubm9PZkVtcGxveWVlcy5tYXgpXG5cdGNvbXBhbnlJbnB1dC5zZXROb09mRW1wbG95ZWVzKHJhbmdlKVxuXHRjb21wYW55SW5wdXQuc2V0SGlyaW5nU3RhdHVzKGlucHV0LmhpcmluZ1N0YXR1cylcblx0Y29tcGFueUlucHV0LnNldFNraWxsc0xpc3QoaW5wdXQuc2tpbGxzKVxuXG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzcG9uc2UgPSAoYXdhaXQgY3JlYXRlQ29tcGFueShjb21wYW55SW5wdXQpKSBhcyBJZFxuXHRcdGNvbnN0IGNvbXBhbnkgPSByZXNwb25zZS50b09iamVjdCgpXG5cdFx0cHVic3ViLnB1Ymxpc2goQ09NUEFOWV9DUkVBVEVELCB7IGNvbXBhbnlDcmVhdGVkOiBjb21wYW55IH0pXG5cblx0XHRyZXR1cm4gY29tcGFueVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHRocm93IG5ldyBFcnJvcihlcnJvcilcblx0fVxufVxuY29uc3QgVXBkYXRlQ29tcGFueSA9ICgpID0+IHt9XG5jb25zdCBEZWxldGVDb21wYW55ID0gKCkgPT4ge31cblxuZXhwb3J0IGNvbnN0IFF1ZXJ5ID0ge1xuXHRSZWFkQ29tcGFueSxcblx0UmVhZENvbXBhbmllc1xufVxuXG5jb25zdCBjb21wYW55UmVzb2x2ZXJzID0ge1xuXHRRdWVyeSxcblx0TXV0YXRpb246IHtcblx0XHRDcmVhdGVDb21wYW55XG5cdFx0Ly8gXHRVcGRhdGVDb21wYW55LFxuXHRcdC8vIFx0RGVsZXRlQ29tcGFueVxuXHR9LFxuXHRTdWJzY3JpcHRpb246IHtcblx0XHRjb21wYW55Q3JlYXRlZDoge1xuXHRcdFx0c3Vic2NyaWJlOiAoXzogYW55LCBfXzogYW55LCB7IHB1YnN1YiB9OiB7IHB1YnN1YjogUHViU3ViIH0pID0+IHB1YnN1Yi5hc3luY0l0ZXJhdG9yKENPTVBBTllfQ1JFQVRFRClcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tcGFueVJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgQ29tcGFueSB7XFxuICBpZDogSUQhXFxuICBuYW1lOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGNyZWF0ZWRCeTogSURcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRfeWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZVxcbiAgbGFzdEFjdGl2ZTogVGltZXN0YW1wXFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbmlucHV0IENvbXBhbnlJbnB1dCB7XFxuICBjcmVhdGVkQnk6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgZGVzY3JpcHRpb246IFN0cmluZyFcXG4gIHVybDogU3RyaW5nXFxuICBsb2dvOiBTdHJpbmdcXG4gIGxvY2F0aW9uOiBTdHJpbmdcXG4gIGZvdW5kZWRZZWFyOiBTdHJpbmdcXG4gIG5vT2ZFbXBsb3llZXM6IFJhbmdlSW5wdXRcXG4gIGhpcmluZ1N0YXR1czogQm9vbGVhblxcbiAgc2tpbGxzOiBbU3RyaW5nXVxcbn1cXG5cXG5leHRlbmQgdHlwZSBRdWVyeSB7XFxuICBSZWFkQ29tcGFuaWVzKGlucHV0OiBQYWdpbmF0aW9uSW5wdXQpOiBbQ29tcGFueV0hXFxuICBSZWFkQ29tcGFueShpbnB1dDogSUQpOiBDb21wYW55XFxufVxcblxcbmV4dGVuZCB0eXBlIE11dGF0aW9uIHtcXG4gIENyZWF0ZUNvbXBhbnkoaW5wdXQ6IENvbXBhbnlJbnB1dCEpOiBJZCFcXG59XFxuXFxuZXh0ZW5kIHR5cGUgU3Vic2NyaXB0aW9uIHtcXG4gIGNvbXBhbnlDcmVhdGVkOiBJZCFcXG59XFxuXCIiLCJpbXBvcnQgY29tcGFueUNsaWVudCBmcm9tICcuLi8nXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuXG5leHBvcnQgY29uc3QgcmVhZENvbXBhbnkgPSBwcm9taXNpZnkoY29tcGFueUNsaWVudC5yZWFkQ29tcGFueSkuYmluZChjb21wYW55Q2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlYWRDb21wYW5pZXMgPSBwcm9taXNpZnkoY29tcGFueUNsaWVudC5yZWFkQ29tcGFuaWVzKS5iaW5kKGNvbXBhbnlDbGllbnQpXG5leHBvcnQgY29uc3QgcmVhZEFsbENvbXBhbmllcyA9IHByb21pc2lmeShjb21wYW55Q2xpZW50LnJlYWRBbGxDb21wYW5pZXMpLmJpbmQoY29tcGFueUNsaWVudClcbmV4cG9ydCBjb25zdCBjcmVhdGVDb21wYW55ID0gcHJvbWlzaWZ5KGNvbXBhbnlDbGllbnQuY3JlYXRlQ29tcGFueSkuYmluZChjb21wYW55Q2xpZW50KVxuZXhwb3J0IGNvbnN0IHVwZGF0ZUNvbXBhbnkgPSBwcm9taXNpZnkoY29tcGFueUNsaWVudC51cGRhdGVDb21wYW55KS5iaW5kKGNvbXBhbnlDbGllbnQpXG5leHBvcnQgY29uc3QgZGVsZXRlQ29tcGFueSA9IHByb21pc2lmeShjb21wYW55Q2xpZW50LmRlbGV0ZUNvbXBhbnkpLmJpbmQoY29tcGFueUNsaWVudClcbiIsImNvbnN0IHJvb3RSZXNvbHZlcnMgPSB7XG5cdFF1ZXJ5OiB7XG5cdFx0ZHVtbXk6ICgpID0+ICdkb2RvIGR1Y2sgbGl2ZXMgaGVyZSdcblx0fSxcblx0TXV0YXRpb246IHtcblx0XHRkdW1teTogYXN5bmMgKCkgPT4ge1xuXHRcdFx0cmV0dXJuICdEb2RvIER1Y2snXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJzY2FsYXIgRGF0ZVxcblxcbmVudW0gUGVybWlzc2lvbnMge1xcbiAgQURNSU5cXG4gIENPTVBBTllcXG4gIEpPQlxcbiAgSU5WRVNUT1JcXG4gIENPTVBBTllSRUFEXFxuICBKT0JSRUFEXFxuICBJTlZFU1RPUlJFQURcXG4gIFBFUk1JU1NJT05VUERBVEVcXG59XFxuXFxuZW51bSBHZW5kZXIge1xcbiAgTUFMRVxcbiAgRkVNQUxFXFxuICBPVEhFUlxcbn1cXG5cXG5lbnVtIEFjY1R5cGUge1xcbiAgQkFTRV9VU0VSXFxuICBDT01QQU5ZX1VTRVJcXG4gIEZVTkRJTkdfVVNFUlxcbiAgSk9CX1VTRVJcXG59XFxuXFxuZW51bSBTb3J0IHtcXG4gIEFTQ1xcbiAgREVTQ1xcbn1cXG5cXG50eXBlIFRpbWVzdGFtcCB7XFxuICBzZWNvbmRzOiBTdHJpbmdcXG4gIG5hbm9zOiBTdHJpbmdcXG59XFxuXFxudHlwZSBJZCB7XFxuICBpZDogSUQhXFxufVxcblxcbnR5cGUgUmFuZ2Uge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxudHlwZSBBdHRhY2htZW50IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxufVxcblxcbnR5cGUgUGFnZUluZm8ge1xcbiAgZW5kQ3Vyc29yOiBTdHJpbmchXFxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcXG59XFxuXFxudHlwZSBQYWdpbmF0aW9uIHtcXG4gIHNraXA6IFN0cmluZ1xcbiAgbGltaXQ6IEludFxcbn1cXG5cXG5pbnB1dCBJZElucHV0IHtcXG4gIGlkOiBJRCFcXG59XFxuXFxuaW5wdXQgUmFuZ2VJbnB1dCB7XFxuICBtaW46IEludCFcXG4gIG1heDogSW50IVxcbn1cXG5cXG5pbnB1dCBBdHRhY2htZW50SW5wdXQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUGFnaW5hdGlvbklucHV0IHtcXG4gIHBhZ2U6IEludFxcbiAgZmlyc3Q6IEludFxcbiAgYWZ0ZXI6IFN0cmluZ1xcbiAgb2Zmc2V0OiBJbnRcXG4gIHNvcnQ6IFNvcnRcXG4gIHNraXA6IFN0cmluZ1xcbiAgbGltaXQ6IEludFxcbn1cXG5cXG50eXBlIFF1ZXJ5IHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgTXV0YXRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBTdWJzY3JpcHRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxuc2NoZW1hIHtcXG4gIHF1ZXJ5OiBRdWVyeVxcbiAgbXV0YXRpb246IE11dGF0aW9uXFxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGNvbXBhbnlTY2hlbWEgZnJvbSAnLi9jbGllbnQvY29tcGFueS9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyByb290U2NoZW1hIGZyb20gJy4vY2xpZW50L3Jvb3Qvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuXG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIFB1YlN1YiB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcblxuaW1wb3J0IGNvbXBhbnlSZXNvbHZlcnMgZnJvbSAnLi9jbGllbnQvY29tcGFueS9yZXNvbHZlcidcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHJvb3RSZXNvbHZlcnMgZnJvbSAnLi9jbGllbnQvcm9vdC9yZXNvbHZlcidcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuZXhwb3J0IGNvbnN0IHR5cGVEZWZzID0gW3Jvb3RTY2hlbWEsIGNvbXBhbnlTY2hlbWFdXG5leHBvcnQgY29uc3QgcmVzb2x2ZXJzID0gbWVyZ2Uoe30sIHJvb3RSZXNvbHZlcnMsIGNvbXBhbnlSZXNvbHZlcnMpXG5cbmNvbnN0IHNlcnZlciA9IG5ldyBBcG9sbG9TZXJ2ZXIoe1xuXHR0eXBlRGVmcyxcblx0cmVzb2x2ZXJzLFxuXHRjb250ZXh0OiBhc3luYyAoeyByZXEsIGNvbm5lY3Rpb24gfSkgPT4ge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXEsXG5cdFx0XHRjb25uZWN0aW9uLFxuXHRcdFx0cHVic3ViXG5cdFx0fVxuXHR9LFxuXHR0cmFjaW5nOiB0cnVlXG59KVxuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXJcbiIsImltcG9ydCAnZG90ZW52L2NvbmZpZydcblxuaW1wb3J0IHsgU2VydmVyLCBjcmVhdGVTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuaW1wb3J0IHsgZm9yaywgaXNNYXN0ZXIsIG9uIH0gZnJvbSAnY2x1c3RlcidcblxuaW1wb3J0IEFwcCBmcm9tICcuL2FwcCdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBncmFwaHFsU2VydmVyIGZyb20gJy4vZ3JhcGhxbCdcbmltcG9ydCB7IG5vcm1hbGl6ZVBvcnQgfSBmcm9tICcuL3V0aWxsaXR5L25vcm1hbGl6ZSdcblxuZGVjbGFyZSBjb25zdCBtb2R1bGU6IGFueVxuXG5jbGFzcyBTeW5jU2VydmVyIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIHNlcnZlcjogU2VydmVyXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0Z3JhcGhxbFNlcnZlci5hcHBseU1pZGRsZXdhcmUoeyBhcHAgfSlcblx0XHR0aGlzLnNlcnZlciA9IGNyZWF0ZVNlcnZlcihhcHApXG5cdFx0Z3JhcGhxbFNlcnZlci5pbnN0YWxsU3Vic2NyaXB0aW9uSGFuZGxlcnModGhpcy5zZXJ2ZXIpXG5cdH1cblxuXHRzdGFydFN5bmNTZXJ2ZXIgPSBhc3luYyAocG9ydDogc3RyaW5nKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFBPUlQgPSBub3JtYWxpemVQb3J0KHBvcnQpXG5cdFx0XHR0aGlzLnNlcnZlci5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgc2VydmVyIHJlYWR5IGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtQT1JUfSR7Z3JhcGhxbFNlcnZlci5ncmFwaHFsUGF0aH1gKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhgU3Vic2NyaXB0aW9ucyByZWFkeSBhdCB3czovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLnN1YnNjcmlwdGlvbnNQYXRofWApXG5cdFx0XHR9KVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRhd2FpdCB0aGlzLnN0b3BTZXJ2ZXIoKVxuXHRcdH1cblx0fVxuXG5cdHN0b3BTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0cHJvY2Vzcy5vbignU0lHSU5UJywgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Nsb3NpbmcgU3RheW9sb2d5IFN5bmNTZXJ2ZXIgLi4uJylcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5zZXJ2ZXIuY2xvc2UoKVxuXHRcdFx0XHRjb25zb2xlLmxvZygnU3RheW9sb2d5IFN5bmNTZXJ2ZXIgQ2xvc2VkJylcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0Vycm9yIENsb3NpbmcgU3luY1NlcnZlciBTZXJ2ZXIgQ29ubmVjdGlvbicpXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cdFx0XHRcdHByb2Nlc3Mua2lsbChwcm9jZXNzLnBpZClcblx0XHRcdH1cblx0XHR9KVxuXHR9XG59XG5cbmNvbnN0IHsgc3RhcnRTeW5jU2VydmVyLCBzdG9wU2VydmVyLCBhcHAsIHNlcnZlciB9ID0gbmV3IFN5bmNTZXJ2ZXIoQXBwKVxuY29uc3Qgc3RhcnQgPSBhc3luYyAoKSA9PiB7XG5cdGNvbnN0IHsgUE9SVCB9ID0gcHJvY2Vzcy5lbnZcblx0Y29uc3QgcG9ydCA9IFBPUlQgfHwgJzgwODAnXG5cblx0dHJ5IHtcblx0XHRhd2FpdCBzdG9wU2VydmVyKClcblx0XHRhd2FpdCBzdGFydFN5bmNTZXJ2ZXIocG9ydClcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKCdTZXJ2ZXIgRmFpbGVkIHRvIHN0YXJ0Jylcblx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdHByb2Nlc3MuZXhpdCgxKVxuXHR9XG59XG5cbmlmIChpc01hc3Rlcikge1xuXHRjb25zdCBudW1DUFVzID0gcmVxdWlyZSgnb3MnKS5jcHVzKCkubGVuZ3RoXG5cblx0Y29uc29sZS5sb2coYE1hc3RlciAke3Byb2Nlc3MucGlkfSBpcyBydW5uaW5nYClcblxuXHQvLyBGb3JrIHdvcmtlcnMuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ1BVczsgaSsrKSB7XG5cdFx0Zm9yaygpXG5cdH1cblxuXHRvbignZm9yaycsICh3b3JrZXIpID0+IHtcblx0XHRjb25zb2xlLmxvZygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxuXG5cdG9uKCdleGl0JywgKHdvcmtlcikgPT4ge1xuXHRcdGNvbnNvbGUubG9nKCd3b3JrZXIgaXMgZGVhZDonLCB3b3JrZXIuaXNEZWFkKCkpXG5cdH0pXG59IGVsc2Uge1xuXHQvKipcblx0ICogW2lmIEhvdCBNb2R1bGUgZm9yIHdlYnBhY2tdXG5cdCAqIEBwYXJhbSAge1t0eXBlXX0gbW9kdWxlIFtnbG9iYWwgbW9kdWxlIG5vZGUgb2JqZWN0XVxuXHQgKi9cblx0bGV0IGN1cnJlbnRBcHAgPSBhcHBcblx0aWYgKG1vZHVsZS5ob3QpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdCgnLi9hcHAnLCAoKSA9PiB7XG5cdFx0XHRzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3JlcXVlc3QnLCBjdXJyZW50QXBwKVxuXHRcdFx0c2VydmVyLm9uKCdyZXF1ZXN0JywgYXBwKVxuXHRcdFx0Y3VycmVudEFwcCA9IGFwcFxuXHRcdH0pXG5cblx0XHQvKipcblx0XHQgKiBOZXh0IGNhbGxiYWNrIGlzIGVzc2VudGlhbDpcblx0XHQgKiBBZnRlciBjb2RlIGNoYW5nZXMgd2VyZSBhY2NlcHRlZCB3ZSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcC5cblx0XHQgKiBzZXJ2ZXIuY2xvc2UoKSBpcyBoZXJlIEV4cHJlc3MuSlMtc3BlY2lmaWMgYW5kIGNhbiBkaWZmZXIgaW4gb3RoZXIgZnJhbWV3b3Jrcy5cblx0XHQgKiBUaGUgaWRlYSBpcyB0aGF0IHlvdSBzaG91bGQgc2h1dCBkb3duIHlvdXIgYXBwIGhlcmUuXG5cdFx0ICogRGF0YS9zdGF0ZSBzYXZpbmcgYmV0d2VlbiBzaHV0ZG93biBhbmQgbmV3IHN0YXJ0IGlzIHBvc3NpYmxlXG5cdFx0ICovXG5cdFx0bW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHNlcnZlci5jbG9zZSgpKVxuXHR9XG5cblx0Ly8gV29ya2VycyBjYW4gc2hhcmUgYW55IFRDUCBjb25uZWN0aW9uXG5cdC8vIEluIHRoaXMgY2FzZSBpdCBpcyBhbiBIVFRQIHNlcnZlclxuXHRzdGFydCgpXG5cblx0Y29uc29sZS5sb2coYFdvcmtlciAke3Byb2Nlc3MucGlkfSBzdGFydGVkYClcbn1cbiIsImltcG9ydCAqIGFzIGNvcnNMaWJyYXJ5IGZyb20gJ2NvcnMnXG5cbmNvbnN0IGNvcnNPcHRpb24gPSB7XG5cdG9yaWdpbjogdHJ1ZSxcblx0bWV0aG9kczogJ0dFVCwgSEVBRCwgUFVULCBQQVRDSCwgUE9TVCwgREVMRVRFLCBPUFRJT04nLFxuXHRjcmVkZW50aWFsczogdHJ1ZSxcblx0ZXhwb3NlZEhlYWRlcnM6IFsnYXV0aG9yaXphdGlvbiddXG59XG5cbmNvbnN0IGNvcnMgPSAoKSA9PiBjb3JzTGlicmFyeShjb3JzT3B0aW9uKVxuZXhwb3J0IGRlZmF1bHQgY29yc1xuIiwiaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCAqIGFzIGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xuaW1wb3J0ICogYXMgaGVsbWV0IGZyb20gJ2hlbG1ldCdcbmltcG9ydCAqIGFzIGhwcCBmcm9tICdocHAnXG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uLCBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcblxuaW1wb3J0IGNvcnMgZnJvbSAnLi9jb3JzJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL2xvZ2dlcidcbmltcG9ydCB0b29idXN5IGZyb20gJy4vdG9vYnVzeSdcbmltcG9ydCB3aW5zdG9uIGZyb20gJy4vd2luc3RvbidcblxuY29uc3QgbWlkZGxld2FyZXMgPSAoYXBwOiBBcHBsaWNhdGlvbikgPT4ge1xuXHQvLyBDT1JTIGZvciBjcm9zc3MtdGUgYWNjZXNzXG5cdGFwcC51c2UoY29ycygpKVxuXG5cdC8vIGpzb24gZW5jb2RpbmcgYW5kIGRlY29kaW5nXG5cdGFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuXHRhcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKVxuXG5cdC8vIHNldCB0cnVzdGVkIGlwXG5cdGFwcC5zZXQoJ3RydXN0IHByb3h5JywgdHJ1ZSlcblxuXHQvLyBkbyBub3Qgc2hvdyBwb3dlcmVkIGJ5IGV4cHJlc3Ncblx0YXBwLnNldCgneC1wb3dlcmVkLWJ5JywgZmFsc2UpXG5cblx0Ly8gc2V0IEdaaXAgb24gaGVhZGVycyBmb3IgcmVxdWVzdC9yZXNwb25zZVxuXHRhcHAudXNlKGNvbXByZXNzaW9uKCkpXG5cblx0Ly8gYXR0YWNoIGxvZ2dlciBmb3IgYXBwbGljYXRpb25cblx0YXBwLnVzZSgocmVxOiBSZXF1ZXN0LCBfOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdFx0bG9nZ2VyKHdpbnN0b24pXG5cdFx0cmVxLmxvZ2dlciA9IHdpbnN0b25cblxuXHRcdHJldHVybiBuZXh0KClcblx0fSlcblxuXHQvLyBzZWN1cml0eSBoZWxtZXQgcGFja2FnZVxuXHQvLyBEb24ndCBleHBvc2UgYW55IHNvZnR3YXJlIGluZm9ybWF0aW9uIHRvIGhhY2tlcnMuXG5cdGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxuXG5cdC8vIEV4cHJlc3MgbWlkZGxld2FyZSB0byBwcm90ZWN0IGFnYWluc3QgSFRUUCBQYXJhbWV0ZXIgUG9sbHV0aW9uIGF0dGFja3Ncblx0YXBwLnVzZShocHAoKSlcblxuXHQvLyBUaGUgWC1GcmFtZS1PcHRpb25zIGhlYWRlciB0ZWxscyBicm93c2VycyB0byBwcmV2ZW50IHlvdXIgd2VicGFnZSBmcm9tIGJlaW5nIHB1dCBpbiBhbiBpZnJhbWUuXG5cdGFwcC51c2UoaGVsbWV0LmZyYW1lZ3VhcmQoeyBhY3Rpb246ICdzYW1lb3JpZ2luJyB9KSlcblxuXHQvLyBDcm9zcy1zaXRlIHNjcmlwdGluZywgYWJicmV2aWF0ZWQgdG8g4oCcWFNT4oCdLCBpcyBhIHdheSBhdHRhY2tlcnMgY2FuIHRha2Ugb3ZlciB3ZWJwYWdlcy5cblx0YXBwLnVzZShoZWxtZXQueHNzRmlsdGVyKCkpXG5cblx0Ly8gU2V0cyB0aGUgWC1Eb3dubG9hZC1PcHRpb25zIHRvIHByZXZlbnQgSW50ZXJuZXQgRXhwbG9yZXIgZnJvbSBleGVjdXRpbmdcblx0Ly8gZG93bmxvYWRzIGluIHlvdXIgc2l0ZeKAmXMgY29udGV4dC5cblx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2llbm9vcGVuL1xuXHRhcHAudXNlKGhlbG1ldC5pZU5vT3BlbigpKVxuXG5cdC8vIERvbuKAmXQgU25pZmYgTWltZXR5cGUgbWlkZGxld2FyZSwgbm9TbmlmZiwgaGVscHMgcHJldmVudCBicm93c2VycyBmcm9tIHRyeWluZ1xuXHQvLyB0byBndWVzcyAo4oCcc25pZmbigJ0pIHRoZSBNSU1FIHR5cGUsIHdoaWNoIGNhbiBoYXZlIHNlY3VyaXR5IGltcGxpY2F0aW9ucy4gSXRcblx0Ly8gZG9lcyB0aGlzIGJ5IHNldHRpbmcgdGhlIFgtQ29udGVudC1UeXBlLU9wdGlvbnMgaGVhZGVyIHRvIG5vc25pZmYuXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9kb250LXNuaWZmLW1pbWV0eXBlL1xuXHRhcHAudXNlKGhlbG1ldC5ub1NuaWZmKCkpXG5cblx0Ly8gYnVzc3kgc2VydmVyICh3YWl0IGZvciBpdCB0byByZXNvbHZlKVxuXHQvLyBhcHAudXNlKHRvb2J1c3koKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWlkZGxld2FyZXNcbiIsImltcG9ydCAqIGFzIG1vcmdhbiBmcm9tICdtb3JnYW4nXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICd3aW5zdG9uJ1xuXG5jb25zdCBsb2dnZXIgPSAobG9nZ2VyOiBMb2dnZXIpID0+XG5cdG1vcmdhbignY29tYmluZWQnLCB7XG5cdFx0c2tpcDogKF86IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCxcblx0XHRzdHJlYW06IHtcblx0XHRcdHdyaXRlOiAobWVzc2FnZTogc3RyaW5nLCBtZXRhPzogYW55KSA9PiBsb2dnZXIuaW5mbyhtZXNzYWdlLCBtZXRhKVxuXHRcdH1cblx0fSlcblxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyXG4iLCJpbXBvcnQgeyBMb2dnZXIsIExvZ2dlck9wdGlvbnMsIGNyZWF0ZUxvZ2dlciwgZm9ybWF0LCB0cmFuc3BvcnRzIH0gZnJvbSAnd2luc3RvbidcbmltcG9ydCB7IGV4aXN0c1N5bmMsIG1rZGlyU3luYyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXG5cbmNvbnN0IHsgY29tYmluZSwgdGltZXN0YW1wLCBwcmV0dHlQcmludCB9ID0gZm9ybWF0XG5jb25zdCBsb2dEaXJlY3RvcnkgPSBqb2luKF9fZGlybmFtZSwgJ2xvZycpXG5jb25zdCBpc0RldmVsb3BtZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCdcbnR5cGUgSUxvZ2dlck9wdGlvbnMgPSB7IGZpbGU6IExvZ2dlck9wdGlvbnM7IGNvbnNvbGU6IExvZ2dlck9wdGlvbnMgfVxuXG5leHBvcnQgY29uc3QgbG9nZ2VyT3B0aW9ucyA9IHtcblx0ZmlsZToge1xuXHRcdGxldmVsOiAnaW5mbycsXG5cdFx0ZmlsZW5hbWU6IGAke2xvZ0RpcmVjdG9yeX0vbG9ncy9hcHAubG9nYCxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IHRydWUsXG5cdFx0bWF4c2l6ZTogNTI0Mjg4MCwgLy8gNU1CXG5cdFx0bWF4RmlsZXM6IDUsXG5cdFx0Y29sb3JpemU6IGZhbHNlXG5cdH0sXG5cdGNvbnNvbGU6IHtcblx0XHRsZXZlbDogJ2RlYnVnJyxcblx0XHRoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuXHRcdGpzb246IGZhbHNlLFxuXHRcdGNvbG9yaXplOiB0cnVlXG5cdH1cbn1cbmNvbnN0IGxvZ2dlclRyYW5zcG9ydHMgPSBbXG5cdG5ldyB0cmFuc3BvcnRzLkNvbnNvbGUoe1xuXHRcdC4uLmxvZ2dlck9wdGlvbnMuY29uc29sZSxcblx0XHRmb3JtYXQ6IGZvcm1hdC5jb21iaW5lKFxuXHRcdFx0Zm9ybWF0LnRpbWVzdGFtcCgpLFxuXHRcdFx0Zm9ybWF0LmNvbG9yaXplKHsgYWxsOiB0cnVlIH0pLFxuXHRcdFx0Zm9ybWF0LmFsaWduKCksXG5cdFx0XHRmb3JtYXQucHJpbnRmKChpbmZvKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgdGltZXN0YW1wLCBsZXZlbCwgbWVzc2FnZSwgLi4uYXJncyB9ID0gaW5mb1xuXG5cdFx0XHRcdC8vIGNvbnN0IHRzID0gdGltZXN0YW1wLnNsaWNlKDAsIDE5KS5yZXBsYWNlKCdUJywgJyAnKTtcblx0XHRcdFx0cmV0dXJuIGAke3RpbWVzdGFtcH0gJHtsZXZlbH06ICR7bWVzc2FnZX0gJHtPYmplY3Qua2V5cyhhcmdzKS5sZW5ndGggPyBKU09OLnN0cmluZ2lmeShhcmdzLCBudWxsLCAyKSA6ICcnfWBcblx0XHRcdH0pXG5cdFx0KVxuXHR9KVxuXVxuXG5jbGFzcyBBcHBMb2dnZXIge1xuXHRwdWJsaWMgbG9nZ2VyOiBMb2dnZXJcblx0cHVibGljIGxvZ2dlck9wdGlvbnM6IElMb2dnZXJPcHRpb25zXG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczogSUxvZ2dlck9wdGlvbnMpIHtcblx0XHRpZiAoIWlzRGV2ZWxvcG1lbnQpIHtcblx0XHRcdGV4aXN0c1N5bmMobG9nRGlyZWN0b3J5KSB8fCBta2RpclN5bmMobG9nRGlyZWN0b3J5KVxuXHRcdH1cblxuXHRcdHRoaXMubG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcblx0XHRcdHRyYW5zcG9ydHM6IGlzRGV2ZWxvcG1lbnRcblx0XHRcdFx0PyBbLi4ubG9nZ2VyVHJhbnNwb3J0c11cblx0XHRcdFx0OiBbXG5cdFx0XHRcdFx0XHQuLi5sb2dnZXJUcmFuc3BvcnRzLFxuXHRcdFx0XHRcdFx0bmV3IHRyYW5zcG9ydHMuRmlsZSh7XG5cdFx0XHRcdFx0XHRcdC4uLm9wdGlvbnMuZmlsZSxcblx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBjb21iaW5lKHRpbWVzdGFtcCgpLCBwcmV0dHlQcmludCgpKVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0ICBdLFxuXHRcdFx0ZXhpdE9uRXJyb3I6IGZhbHNlXG5cdFx0fSlcblx0fVxufVxuXG5jb25zdCB7IGxvZ2dlciB9ID0gbmV3IEFwcExvZ2dlcihsb2dnZXJPcHRpb25zKVxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VyXG4iLCJpbXBvcnQgeyBjcmVhdGVDaXBoZXIsIGNyZWF0ZURlY2lwaGVyIH0gZnJvbSAnY3J5cHRvJ1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBDcnlwdG8ge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwcml2YXRlIEVOQ1JZUFRfQUxHT1JJVEhNOiBzdHJpbmdcblx0cHJpdmF0ZSBFTkNSWVBUX1NFQ1JFVDogc3RyaW5nXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdGNvbnN0IHsgRU5DUllQVF9TRUNSRVQgPSAnZG9kb2R1Y2tATjknLCBFTkNSWVBUX0FMR09SSVRITSA9ICdhZXMtMjU2LWN0cicgfSA9IHByb2Nlc3MuZW52XG5cblx0XHR0aGlzLmFwcCA9IGFwcFxuXHRcdHRoaXMuRU5DUllQVF9BTEdPUklUSE0gPSBFTkNSWVBUX0FMR09SSVRITVxuXHRcdHRoaXMuRU5DUllQVF9TRUNSRVQgPSBFTkNSWVBUX1NFQ1JFVFxuXHR9XG5cblx0cHVibGljIGVuY3J5cHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0dGhpcy5hcHAubG9nZ2VyLmluZm8oYEVuY3J5cHQgZm9yICR7dGV4dH1gKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGNpcGhlciA9IGNyZWF0ZUNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGNyeXB0ZWQgPSBjaXBoZXIudXBkYXRlKHRleHQsICd1dGY4JywgJ2hleCcpXG5cdFx0XHRjcnlwdGVkICs9IGNpcGhlci5maW5hbCgnaGV4JylcblxuXHRcdFx0cmV0dXJuIGNyeXB0ZWRcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHAubG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpXG5cblx0XHRcdHJldHVybiAnJ1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBkZWNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBEZWNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZWNpcGhlciA9IGNyZWF0ZURlY2lwaGVyKHRoaXMuRU5DUllQVF9BTEdPUklUSE0sIHRoaXMuRU5DUllQVF9TRUNSRVQpXG5cdFx0XHRsZXQgZGVjID0gZGVjaXBoZXIudXBkYXRlKHRleHQsICdoZXgnLCAndXRmOCcpXG5cdFx0XHRkZWMgKz0gZGVjaXBoZXIuZmluYWwoJ3V0ZjgnKVxuXG5cdFx0XHRyZXR1cm4gZGVjXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwQ3J5cHRvXG4iLCJpbXBvcnQgQXBwQ3J5cHRvIGZyb20gJy4vY3J5cHRvJ1xuaW1wb3J0IEFwcFNsdWdpZnkgZnJvbSAnLi9zbHVnaWZ5J1xuaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgSUFwcFV0aWxzIH0gZnJvbSAnLi91dGlsLmludGVyZmFjZSdcblxuY2xhc3MgQXBwVXRpbHMgaW1wbGVtZW50cyBJQXBwVXRpbHMge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXG5cdFx0Ly8gdGhpcy5hcHAubG9nZ2VyLmluZm8oJ0luaXRpYWxpemVkIEFwcFV0aWxzJylcblx0fVxuXG5cdHB1YmxpYyBhcHBseVV0aWxzID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xuXHRcdGNvbnN0IHsgZW5jcnlwdCwgZGVjcnlwdCB9ID0gbmV3IEFwcENyeXB0byh0aGlzLmFwcClcblx0XHRjb25zdCB7IHNsdWdpZnkgfSA9IG5ldyBBcHBTbHVnaWZ5KHRoaXMuYXBwKVxuXHRcdHRoaXMuYXBwLnV0aWxpdHkgPSB7XG5cdFx0XHRlbmNyeXB0LFxuXHRcdFx0ZGVjcnlwdCxcblx0XHRcdHNsdWdpZnlcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFV0aWxzXG4iLCJjb25zdCBub3JtYWxpemVQb3J0ID0gKHBvcnRWYWx1ZTogc3RyaW5nKTogbnVtYmVyID0+IHtcblx0Y29uc3QgcG9ydCA9IHBhcnNlSW50KHBvcnRWYWx1ZSwgMTApXG5cblx0aWYgKGlzTmFOKHBvcnQpKSB7XG5cdFx0cmV0dXJuIDgwODBcblx0fVxuXG5cdGlmIChwb3J0ID49IDApIHtcblx0XHRyZXR1cm4gcG9ydFxuXHR9XG5cblx0cmV0dXJuIHBvcnRcbn1cblxuZXhwb3J0IHsgbm9ybWFsaXplUG9ydCB9XG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmNsYXNzIEFwcFNsdWdpZnkge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXHR9XG5cblx0cHVibGljIHNsdWdpZnkgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0Ly8gdGhpcy5hcHAubG9nZ2VyLmluZm8oYFNsdWdpZnkgZm9yICR7dGV4dH1gKVxuXG5cdFx0cmV0dXJuIHRleHRcblx0XHRcdC50b0xvd2VyQ2FzZSgpXG5cdFx0XHQucmVwbGFjZSgvW15cXHcgXSsvZywgJycpXG5cdFx0XHQucmVwbGFjZSgvICsvZywgJy0nKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFNsdWdpZnlcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9wcm90b3JlcG8tY29tcGFueS1ub2RlXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvb2pvYi9wcm90b3JlcG8tY29tcGFueS1ub2RlL3NlcnZpY2VfcGJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNsdXN0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29tcHJlc3Npb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjcnlwdG9cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52L2NvbmZpZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdycGNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaGVsbWV0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhwcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0c2xpYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndpbnN0b25cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==