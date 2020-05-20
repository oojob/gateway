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
/******/ 	var hotCurrentHash = "baec657fe1dbebe3d78a";
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
        logger.info('validating username');
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
const tracer_1 = __webpack_require__(/*! tracer */ "./src/tracer.ts");
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
const tracer = tracer_1.default('service:gateway');
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
            tracer,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NvcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2NzcmYudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2Vycm9yLWhhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21pZGRsZXdhcmVzL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFjZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2NyeXB0by50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L25vcm1hbGl6ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGxpdHkvc2x1Z2lmeS50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIkBvb2pvYi9wcm90b3JlcG8tcHJvZmlsZS1ub2RlL3NlcnZpY2VfcGJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9hcGlcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb3BlbnRlbGVtZXRyeS9ub2RlXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2x1c3RlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNvbXByZXNzaW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImNyeXB0b1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImRvdGVudi9jb25maWdcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImdycGNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJoZWxtZXRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJob3N0LXZhbGlkYXRpb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJocHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibG9kYXNoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidG9vYnVzeS1qc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcInRzbGliXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXRpbFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV1aWRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ3aW5zdG9uXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLDZCQUE2QjtRQUM3Qiw2QkFBNkI7UUFDN0I7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EscUJBQXFCLGdCQUFnQjtRQUNyQztRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLHFCQUFxQixnQkFBZ0I7UUFDckM7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EsS0FBSzs7UUFFTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQSxrQkFBa0IsOEJBQThCO1FBQ2hEO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0EsT0FBTztRQUNQO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtR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QUFFLEVBQUU7WUFHakMsT0FBTyxJQUFJO2lCQUNULFdBQVcsRUFBRTtpQkFDYixPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztpQkFDdkIsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7UUFDdEIsQ0FBQztRQVZBLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRztJQUNmLENBQUM7Q0FVRDtBQUVRLGdDQUFVO0FBQ25CLGtCQUFlLFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQnpCLGtEOzs7Ozs7Ozs7OztBQ0FBLDBEOzs7Ozs7Ozs7OztBQ0FBLHFFOzs7Ozs7Ozs7OztBQ0FBLCtDOzs7Ozs7Ozs7OztBQ0FBLDJEOzs7Ozs7Ozs7OztBQ0FBLGdEOzs7Ozs7Ozs7OztBQ0FBLG1EOzs7Ozs7Ozs7OztBQ0FBLGtEOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLGlEOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLDRDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7OztBQ0FBLG9DIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7XG4gXHRcdHZhciBjaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgXCIuaG90L1wiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCIpO1xuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVuay5pZCwgY2h1bmsubW9kdWxlcyk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHtcbiBcdFx0dHJ5IHtcbiBcdFx0XHR2YXIgdXBkYXRlID0gcmVxdWlyZShcIi4vXCIgKyBcIi5ob3QvXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiKTtcbiBcdFx0fSBjYXRjaCAoZSkge1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiBcdFx0fVxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVwZGF0ZSk7XG4gXHR9XG5cbiBcdC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiYmFlYzY1N2ZlMWRiZWJlM2Q3OGFcIjtcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdGlmICghbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gXHRcdFx0aWYgKG1lLmhvdC5hY3RpdmUpIHtcbiBcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XG4gXHRcdFx0XHRcdGlmIChpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPT09IC0xKSB7XG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArXG4gXHRcdFx0XHRcdFx0cmVxdWVzdCArXG4gXHRcdFx0XHRcdFx0XCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICtcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0KTtcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XG4gXHRcdFx0fVxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xuIFx0XHR9O1xuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XG4gXHRcdFx0XHR9LFxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fTtcbiBcdFx0Zm9yICh2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcImVcIiAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJ0XCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdGZuLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRcdGlmIChtb2RlICYgMSkgdmFsdWUgPSBmbih2YWx1ZSk7XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18udCh2YWx1ZSwgbW9kZSAmIH4xKTtcbiBcdFx0fTtcbiBcdFx0cmV0dXJuIGZuO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgaG90ID0ge1xuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXG5cbiBcdFx0XHQvLyBNb2R1bGUgQVBJXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKGRlcCA9PT0gdW5kZWZpbmVkKSBob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xuIFx0XHRcdFx0ZWxzZSBob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aWYgKCFsKSByZXR1cm4gaG90U3RhdHVzO1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XG4gXHRcdFx0fSxcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0fSxcblxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxuIFx0XHR9O1xuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XG4gXHRcdHJldHVybiBob3Q7XG4gXHR9XG5cbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xuXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcbiBcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XG4gXHR9XG5cbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90RGVmZXJyZWQ7XG5cbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xuIFx0XHR2YXIgaXNOdW1iZXIgPSAraWQgKyBcIlwiID09PSBpZDtcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XG4gXHRcdGlmIChob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB7XG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdH1cbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XG4gXHRcdFx0aWYgKCF1cGRhdGUpIHtcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcbiBcdFx0XHR9XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcblxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IFwibWFpblwiO1xuIFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb25lLWJsb2Nrc1xuIFx0XHRcdHtcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nID09PSAwICYmXG4gXHRcdFx0XHRob3RXYWl0aW5nRmlsZXMgPT09IDBcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7XG4gXHRcdGlmICghaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxuIFx0XHRcdHJldHVybjtcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcbiBcdFx0Zm9yICh2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmICgtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdH0gZWxzZSB7XG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XG4gXHRcdGlmICghZGVmZXJyZWQpIHJldHVybjtcbiBcdFx0aWYgKGhvdEFwcGx5T25VcGRhdGUpIHtcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKVxuIFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcbiBcdFx0XHRcdH0pXG4gXHRcdFx0XHQudGhlbihcbiBcdFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XG4gXHRcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuIFx0XHRcdFx0XHR9LFxuIFx0XHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0KTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9XG4gXHR9XG5cbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKVxuIFx0XHRcdHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiBcdFx0dmFyIGNiO1xuIFx0XHR2YXIgaTtcbiBcdFx0dmFyIGo7XG4gXHRcdHZhciBtb2R1bGU7XG4gXHRcdHZhciBtb2R1bGVJZDtcblxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG5cbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMubWFwKGZ1bmN0aW9uKGlkKSB7XG4gXHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcbiBcdFx0XHRcdFx0aWQ6IGlkXG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmICghbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZCkgY29udGludWU7XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX21haW4pIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdGlmICghcGFyZW50KSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdFx0Y29udGludWU7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG5cbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcbiBcdFx0XHR9O1xuIFx0XHR9XG5cbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xuIFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xuIFx0XHRcdFx0aWYgKGEuaW5kZXhPZihpdGVtKSA9PT0gLTEpIGEucHVzaChpdGVtKTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XG5cbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcbiBcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIlxuIFx0XHRcdCk7XG4gXHRcdH07XG5cbiBcdFx0Zm9yICh2YXIgaWQgaW4gaG90VXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcbiBcdFx0XHRcdC8qKiBAdHlwZSB7VE9ET30gKi9cbiBcdFx0XHRcdHZhciByZXN1bHQ7XG4gXHRcdFx0XHRpZiAoaG90VXBkYXRlW2lkXSkge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHQvKiogQHR5cGUge0Vycm9yfGZhbHNlfSAqL1xuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcbiBcdFx0XHRcdGlmIChyZXN1bHQuY2hhaW4pIHtcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRcIiBpbiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0LnBhcmVudElkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25VbmFjY2VwdGVkKSBvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkFjY2VwdGVkKSBvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EaXNwb3NlZCkgb3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGFib3J0RXJyb3IpIHtcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0FwcGx5KSB7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0XHRcdFx0Zm9yIChtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRcdFx0XHRpZiAoXG4gXHRcdFx0XHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcyxcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdFx0XHRcdClcbiBcdFx0XHRcdFx0XHQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KFxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sXG4gXHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF1cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9EaXNwb3NlKSB7XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZCAmJlxuIFx0XHRcdFx0Ly8gcmVtb3ZlZCBzZWxmLWFjY2VwdGVkIG1vZHVsZXMgc2hvdWxkIG5vdCBiZSByZXF1aXJlZFxuIFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gIT09IHdhcm5VbmV4cGVjdGVkUmVxdWlyZVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXG4gXHRcdFx0XHR9KTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xuIFx0XHRcdGlmIChob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcbiBcdFx0XHR9XG4gXHRcdH0pO1xuXG4gXHRcdHZhciBpZHg7XG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xuIFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0aWYgKCFtb2R1bGUpIGNvbnRpbnVlO1xuXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcblxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XG4gXHRcdFx0XHRjYihkYXRhKTtcbiBcdFx0XHR9XG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcblxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcblxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XG4gXHRcdFx0XHRpZiAoIWNoaWxkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIHtcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xuIFx0XHRcdFx0XHRcdGlmIChpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiYXBwbHlcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcblxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XG5cbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXG4gXHRcdGZvciAobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xuIFx0XHRcdFx0XHRcdGlmIChjYikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKGNhbGxiYWNrcy5pbmRleE9mKGNiKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XG4gXHRcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcbiBcdFx0XHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0dHJ5IHtcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xuIFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcbiBcdFx0XHRcdFx0fSBjYXRjaCAoZXJyMikge1xuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxuIFx0XHRcdFx0XHRcdFx0XHRvcmlnaW5hbEVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnIyO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXG4gXHRcdGlmIChlcnJvcikge1xuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiBcdFx0fVxuXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHR9KTtcbiBcdH1cblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgwKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVwZGF0ZWRNb2R1bGVzLCByZW5ld2VkTW9kdWxlcykge1xuXHR2YXIgdW5hY2NlcHRlZE1vZHVsZXMgPSB1cGRhdGVkTW9kdWxlcy5maWx0ZXIoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghcmVuZXdlZE1vZHVsZXMgfHwgcmVuZXdlZE1vZHVsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIE5vdGhpbmcgaG90IHVwZGF0ZWQuXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBVcGRhdGVkIG1vZHVsZXM6XCIpO1xuXHRcdHJlbmV3ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdGlmICh0eXBlb2YgbW9kdWxlSWQgPT09IFwic3RyaW5nXCIgJiYgbW9kdWxlSWQuaW5kZXhPZihcIiFcIikgIT09IC0xKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IG1vZHVsZUlkLnNwbGl0KFwiIVwiKTtcblx0XHRcdFx0bG9nLmdyb3VwQ29sbGFwc2VkKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgcGFydHMucG9wKCkpO1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHRcdGxvZy5ncm91cEVuZChcImluZm9cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dmFyIG51bWJlcklkcyA9IHJlbmV3ZWRNb2R1bGVzLmV2ZXJ5KGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHRcIltITVJdIENvbnNpZGVyIHVzaW5nIHRoZSBOYW1lZE1vZHVsZXNQbHVnaW4gZm9yIG1vZHVsZSBuYW1lcy5cIlxuXHRcdFx0KTtcblx0fVxufTtcbiIsInZhciBsb2dMZXZlbCA9IFwiaW5mb1wiO1xuXG5mdW5jdGlvbiBkdW1teSgpIHt9XG5cbmZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuXHR2YXIgc2hvdWxkTG9nID1cblx0XHQobG9nTGV2ZWwgPT09IFwiaW5mb1wiICYmIGxldmVsID09PSBcImluZm9cIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHx8XG5cdFx0KFtcImluZm9cIiwgXCJ3YXJuaW5nXCIsIFwiZXJyb3JcIl0uaW5kZXhPZihsb2dMZXZlbCkgPj0gMCAmJiBsZXZlbCA9PT0gXCJlcnJvclwiKTtcblx0cmV0dXJuIHNob3VsZExvZztcbn1cblxuZnVuY3Rpb24gbG9nR3JvdXAobG9nRm4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxuLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG52YXIgZ3JvdXAgPSBjb25zb2xlLmdyb3VwIHx8IGR1bW15O1xudmFyIGdyb3VwQ29sbGFwc2VkID0gY29uc29sZS5ncm91cENvbGxhcHNlZCB8fCBkdW1teTtcbnZhciBncm91cEVuZCA9IGNvbnNvbGUuZ3JvdXBFbmQgfHwgZHVtbXk7XG4vKiBlc2xpbnQtZW5hYmxlIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGlucyAqL1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG5cdGxvZ0xldmVsID0gbGV2ZWw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHR2YXIgbWVzc2FnZSA9IGVyci5tZXNzYWdlO1xuXHR2YXIgc3RhY2sgPSBlcnIuc3RhY2s7XG5cdGlmICghc3RhY2spIHtcblx0XHRyZXR1cm4gbWVzc2FnZTtcblx0fSBlbHNlIGlmIChzdGFjay5pbmRleE9mKG1lc3NhZ2UpIDwgMCkge1xuXHRcdHJldHVybiBtZXNzYWdlICsgXCJcXG5cIiArIHN0YWNrO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBzdGFjaztcblx0fVxufTtcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdFxuXHRcdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIiwiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgQXBwVXRpbHMgZnJvbSAndXRpbGxpdHknXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ2xvZ2dlcidcbmltcG9ydCBtaWRkbGV3YWVzIGZyb20gJ21pZGRsZXdhcmVzJ1xuXG5jbGFzcyBBcHAge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwdWJsaWMgYXBwVXRpbHM6IEFwcFV0aWxzXG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5hcHAgPSBleHByZXNzKClcblx0XHR0aGlzLmFwcC5sb2dnZXIgPSBsb2dnZXJcblxuXHRcdHRoaXMuYXBwVXRpbHMgPSBuZXcgQXBwVXRpbHModGhpcy5hcHApXG5cdFx0dGhpcy5hcHBseVNlcnZlcigpXG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGJvb3RzdHJhcCgpOiBBcHAge1xuXHRcdHJldHVybiBuZXcgQXBwKClcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgdGhpcy5hcHBVdGlscy5hcHBseVV0aWxzKClcblx0XHRhd2FpdCB0aGlzLmFwcGx5TWlkZGxld2FyZSgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5TWlkZGxld2FyZSA9IGFzeW5jICgpID0+IHtcblx0XHRtaWRkbGV3YWVzKHRoaXMuYXBwKVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBBcHAoKVxuZXhwb3J0IGRlZmF1bHQgYXBwbGljYXRpb24uYXBwXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBDb21wYW55IGltcGxlbWVudHMgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgbmFtZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBjcmVhdGVkQnk6IElEXFxuICB1cmw6IFN0cmluZ1xcbiAgbG9nbzogU3RyaW5nXFxuICBsb2NhdGlvbjogU3RyaW5nXFxuICBmb3VuZGVkX3llYXI6IFN0cmluZ1xcbiAgbm9PZkVtcGxveWVlczogUmFuZ2VcXG4gIGxhc3RBY3RpdmU6IFRpbWVzdGFtcFxcbiAgaGlyaW5nU3RhdHVzOiBCb29sZWFuXFxuICBza2lsbHM6IFtTdHJpbmddXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG5pbnB1dCBDb21wYW55SW5wdXQge1xcbiAgY3JlYXRlZEJ5OiBJRCFcXG4gIG5hbWU6IFN0cmluZyFcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmchXFxuICB1cmw6IFN0cmluZ1xcbiAgbG9nbzogU3RyaW5nXFxuICBsb2NhdGlvbjogU3RyaW5nXFxuICBmb3VuZGVkWWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZUlucHV0XFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBDdXJyZW50U3RhdHVzIHtcXG4gIEFDVElWRVxcbiAgSE9MRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG5lbnVtIEpvYlR5cGUge1xcbiAgREVGQVVMVFxcbiAgRkVBVFVSRURcXG4gIFBSRU1JVU1cXG59XFxuXFxudHlwZSBTYWxsYXJ5IHtcXG4gIHZhbHVlOiBGbG9hdCFcXG4gIGN1cnJlbmN5OiBTdHJpbmchXFxufVxcblxcbnR5cGUgSm9iIGltcGxlbWVudHMgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgdHlwZTogSm9iVHlwZSFcXG4gIGNhdGVnb3J5OiBbU3RyaW5nIV0hXFxuICBkZXNjOiBTdHJpbmchXFxuICBza2lsbHNSZXF1aXJlZDogW1N0cmluZyFdIVxcbiAgc2FsbGFyeTogUmFuZ2VcXG4gIGxvY2F0aW9uOiBTdHJpbmchXFxuICBhdHRhY2htZW50OiBbQXR0YWNobWVudF1cXG4gIHN0YXR1czogQ3VycmVudFN0YXR1c1xcbiAgdmlld3M6IEludFxcbiAgdXNlcnNBcHBsaWVkOiBbU3RyaW5nIV1cXG4gIGNyZWF0ZWRCeTogU3RyaW5nXFxuICBjb21wYW55OiBTdHJpbmchXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG50eXBlIEpvYlJlc3VsdEN1cnNvciB7XFxuICBlZGdlczogRWRnZSFcXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcXG4gIHRvdGFsQ291bnQ6IEludCFcXG59XFxuXFxuaW5wdXQgU2FsbGFyeUlucHV0IHtcXG4gIHZhbHVlOiBGbG9hdCFcXG4gIGN1cnJlbmN5OiBTdHJpbmchXFxufVxcblxcbmlucHV0IENyZWF0ZUpvYklucHV0IHtcXG4gIG5hbWU6IFN0cmluZyFcXG4gIHR5cGU6IEpvYlR5cGUhXFxuICBjYXRlZ29yeTogW1N0cmluZyFdIVxcbiAgZGVzYzogU3RyaW5nIVxcbiAgc2tpbGxzX3JlcXVpcmVkOiBbU3RyaW5nIV0hXFxuICBzYWxsYXJ5OiBSYW5nZUlucHV0IVxcbiAgc2FsbGFyeV9tYXg6IFNhbGxhcnlJbnB1dCFcXG4gIGF0dGFjaG1lbnQ6IFtBdHRhY2htZW50SW5wdXRdXFxuICBsb2NhdGlvbjogU3RyaW5nIVxcbiAgc3RhdHVzOiBDdXJyZW50U3RhdHVzIVxcbiAgY29tcGFueTogU3RyaW5nIVxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGdycGMgZnJvbSAnZ3JwYydcblxuaW1wb3J0IHsgUHJvZmlsZVNlcnZpY2VDbGllbnQgfSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZSdcblxuY29uc3QgeyBBQ0NPVU5UX1NFUlZJQ0VfVVJJID0gJ2xvY2FsaG9zdDozMDAwJyB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHByb2ZpbGVDbGllbnQgPSBuZXcgUHJvZmlsZVNlcnZpY2VDbGllbnQoQUNDT1VOVF9TRVJWSUNFX1VSSSwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuXG5leHBvcnQgZGVmYXVsdCBwcm9maWxlQ2xpZW50XG4iLCJpbXBvcnQge1xuXHRBY2Nlc3NEZXRhaWxzLFxuXHRBdXRoUmVxdWVzdCxcblx0QXV0aFJlc3BvbnNlLFxuXHRQcm9maWxlLFxuXHRQcm9maWxlU2VjdXJpdHksXG5cdFJlYWRQcm9maWxlUmVxdWVzdCxcblx0VG9rZW5SZXF1ZXN0LFxuXHRWYWxpZGF0ZUVtYWlsUmVxdWVzdCxcblx0VmFsaWRhdGVVc2VybmFtZVJlcXVlc3Rcbn0gZnJvbSAnQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUvc2VydmljZV9wYidcbmltcG9ydCB7XG5cdEFjY2Vzc0RldGFpbHNSZXNwb25zZSBhcyBBY2Nlc3NEZXRhaWxzUmVzcG9uc2VTY2hlbWEsXG5cdEF1dGhSZXNwb25zZSBhcyBBdXRoUmVzcG9uc2VTY2hlbWEsXG5cdERlZmF1bHRSZXNwb25zZSBhcyBEZWZhdWx0UmVzcG9uc2VTY2hlbWEsXG5cdElkIGFzIElkU2NoZW1hLFxuXHRNdXRhdGlvblJlc29sdmVycyxcblx0UHJvZmlsZSBhcyBQcm9maWxlU2NoZW1hLFxuXHRQcm9maWxlU2VjdXJpdHkgYXMgUHJvZmlsZVNlY3VyaXR5U2NoZW1hLFxuXHRRdWVyeVJlc29sdmVyc1xufSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcbmltcG9ydCB7IERlZmF1bHRSZXNwb25zZSwgRW1haWwsIElkLCBJZGVudGlmaWVyIH0gZnJvbSAnQG9vam9iL29vam9iLXByb3RvYnVmJ1xuaW1wb3J0IHtcblx0YXV0aCxcblx0Y3JlYXRlUHJvZmlsZSxcblx0bG9nb3V0LFxuXHRyZWFkUHJvZmlsZSxcblx0cmVmcmVzaFRva2VuLFxuXHR2YWxpZGF0ZUVtYWlsLFxuXHR2YWxpZGF0ZVVzZXJuYW1lLFxuXHR2ZXJpZnlUb2tlblxufSBmcm9tICdjbGllbnQvcHJvZmlsZS90cmFuc2Zvcm1lcidcblxuaW1wb3J0IHsgQXV0aGVudGljYXRpb25FcnJvciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3RUb2tlbk1ldGFkYXRhID0gYXN5bmMgKHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYT4gPT4ge1xuXHRjb25zdCB0b2tlblJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KClcblxuXHR0b2tlblJlcXVlc3Quc2V0VG9rZW4odG9rZW4pXG5cblx0Y29uc3QgcmVzOiBBY2Nlc3NEZXRhaWxzUmVzcG9uc2VTY2hlbWEgPSB7fVxuXHR0cnkge1xuXHRcdGNvbnN0IHRva2VuUmVzID0gKGF3YWl0IHZlcmlmeVRva2VuKHRva2VuUmVxdWVzdCkpIGFzIEFjY2Vzc0RldGFpbHNcblx0XHRyZXMudmVyaWZpZWQgPSB0b2tlblJlcy5nZXRWZXJpZmllZCgpXG5cdFx0cmVzLmFjY2Vzc1V1aWQgPSB0b2tlblJlcy5nZXRBY2Nlc3NVdWlkKClcblx0XHRyZXMuYWNjb3VudFR5cGUgPSB0b2tlblJlcy5nZXRBY2NvdW50VHlwZSgpXG5cdFx0cmVzLmF1dGhvcml6ZWQgPSB0b2tlblJlcy5nZXRBdXRob3JpemVkKClcblx0XHRyZXMuZW1haWwgPSB0b2tlblJlcy5nZXRFbWFpbCgpXG5cdFx0cmVzLmlkZW50aWZpZXIgPSB0b2tlblJlcy5nZXRJZGVudGlmaWVyKClcblx0XHRyZXMudXNlcklkID0gdG9rZW5SZXMuZ2V0VXNlcklkKClcblx0XHRyZXMudXNlcm5hbWUgPSB0b2tlblJlcy5nZXRVc2VybmFtZSgpXG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmVzLnZlcmlmaWVkID0gZmFsc2Vcblx0XHRyZXMuYWNjZXNzVXVpZCA9IG51bGxcblx0XHRyZXMuYWNjb3VudFR5cGUgPSBudWxsXG5cdFx0cmVzLmF1dGhvcml6ZWQgPSBmYWxzZVxuXHRcdHJlcy5lbWFpbCA9IG51bGxcblx0XHRyZXMuZXhwID0gbnVsbFxuXHRcdHJlcy5pZGVudGlmaWVyID0gbnVsbFxuXHRcdHJlcy51c2VySWQgPSBudWxsXG5cdFx0cmVzLnVzZXJuYW1lID0gbnVsbFxuXHR9XG5cblx0cmV0dXJuIHJlc1xufVxuXG5leHBvcnQgY29uc3QgUXVlcnk6IFF1ZXJ5UmVzb2x2ZXJzID0ge1xuXHRWYWxpZGF0ZVVzZXJuYW1lOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IHRyYWNlciwgbG9nZ2VyIH0pID0+IHtcblx0XHRsb2dnZXIuaW5mbygndmFsaWRhdGluZyB1c2VybmFtZScpXG5cdFx0Y29uc3Qgc3BhbiA9IHRyYWNlci5zdGFydFNwYW4oJ2NsaWVudDpzZXJ2aWNlLXByb2ZpbGU6dmFsaWRhdGUtdXNlcm5hbWUnKVxuXG5cdFx0Y29uc3QgcmVzOiBEZWZhdWx0UmVzcG9uc2VTY2hlbWEgPSB7fVxuXG5cdFx0Ly8gdHJhY2VyLndpdGhTcGFuQXN5bmMoc3BhbiwgYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHVzZXJuYW1lID0gaW5wdXQudXNlcm5hbWVcblx0XHRjb25zdCB2YWxpZGF0ZVVzZXJuYW1lUmVxID0gbmV3IFZhbGlkYXRlVXNlcm5hbWVSZXF1ZXN0KClcblx0XHRpZiAodXNlcm5hbWUpIHtcblx0XHRcdHZhbGlkYXRlVXNlcm5hbWVSZXEuc2V0VXNlcm5hbWUodXNlcm5hbWUpXG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHZhbGlkYXRlUmVzID0gKGF3YWl0IHZhbGlkYXRlVXNlcm5hbWUodmFsaWRhdGVVc2VybmFtZVJlcSkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IHZhbGlkYXRlUmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gdmFsaWRhdGVSZXMuZ2V0RXJyb3IoKVxuXHRcdFx0c3Bhbi5lbmQoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdFx0c3Bhbi5lbmQoKVxuXHRcdH1cblx0XHQvLyB9KVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRWYWxpZGF0ZUVtYWlsOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgdmFsaWRhdGVFbWFpbFJlcSA9IG5ldyBWYWxpZGF0ZUVtYWlsUmVxdWVzdCgpXG5cblx0XHRjb25zdCBlbWFpbCA9IGlucHV0LmVtYWlsXG5cdFx0aWYgKGVtYWlsKSB7XG5cdFx0XHR2YWxpZGF0ZUVtYWlsUmVxLnNldEVtYWlsKGVtYWlsKVxuXHRcdH1cblxuXHRcdGNvbnN0IHJlczogRGVmYXVsdFJlc3BvbnNlU2NoZW1hID0ge31cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgdmFsaWRhdGVSZXMgPSAoYXdhaXQgdmFsaWRhdGVFbWFpbCh2YWxpZGF0ZUVtYWlsUmVxKSkgYXMgRGVmYXVsdFJlc3BvbnNlXG5cdFx0XHRyZXMuc3RhdHVzID0gdmFsaWRhdGVSZXMuZ2V0U3RhdHVzKClcblx0XHRcdHJlcy5jb2RlID0gdmFsaWRhdGVSZXMuZ2V0Q29kZSgpXG5cdFx0XHRyZXMuZXJyb3IgPSB2YWxpZGF0ZVJlcy5nZXRFcnJvcigpXG5cdFx0fSBjYXRjaCAoeyBtZXNzYWdlLCBjb2RlIH0pIHtcblx0XHRcdHJlcy5zdGF0dXMgPSBmYWxzZVxuXHRcdFx0cmVzLmVycm9yID0gbWVzc2FnZVxuXHRcdFx0cmVzLmNvZGUgPSBjb2RlXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc1xuXHR9LFxuXHRWZXJpZnlUb2tlbjogYXN5bmMgKF8sIHsgaW5wdXQgfSwgeyB0b2tlbjogYWNjZXNzVG9rZW4gfSkgPT4ge1xuXHRcdGxldCByZXM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZVNjaGVtYSA9IHt9XG5cblx0XHRjb25zdCB0b2tlbiA9IChpbnB1dCAmJiBpbnB1dC50b2tlbikgfHwgYWNjZXNzVG9rZW5cblx0XHRpZiAodG9rZW4pIHtcblx0XHRcdHJlcyA9IGF3YWl0IGV4dHJhY3RUb2tlbk1ldGFkYXRhKHRva2VuKVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0UmVmcmVzaFRva2VuOiBhc3luYyAoXywgeyBpbnB1dCB9LCB7IHRva2VuOiBhY2Nlc3NUb2tlbiB9KSA9PiB7XG5cdFx0Y29uc3QgcmVzOiBBdXRoUmVzcG9uc2VTY2hlbWEgPSB7fVxuXG5cdFx0Y29uc3QgdG9rZW5SZXF1ZXN0ID0gbmV3IFRva2VuUmVxdWVzdCgpXG5cdFx0Y29uc3QgdG9rZW4gPSAoaW5wdXQgJiYgaW5wdXQudG9rZW4pIHx8IGFjY2Vzc1Rva2VuXG5cdFx0aWYgKHRva2VuKSB7XG5cdFx0XHR0b2tlblJlcXVlc3Quc2V0VG9rZW4odG9rZW4pXG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRva2VuUmVzcG9uc2UgPSAoYXdhaXQgcmVmcmVzaFRva2VuKHRva2VuUmVxdWVzdCkpIGFzIEF1dGhSZXNwb25zZVxuXHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9IHRva2VuUmVzcG9uc2UuZ2V0QWNjZXNzVG9rZW4oKVxuXHRcdFx0cmVzLnJlZnJlc2hfdG9rZW4gPSB0b2tlblJlc3BvbnNlLmdldFJlZnJlc2hUb2tlbigpXG5cdFx0XHRyZXMudmFsaWQgPSB0b2tlblJlc3BvbnNlLmdldFZhbGlkKClcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0cmVzLmFjY2Vzc190b2tlbiA9ICcnXG5cdFx0XHRyZXMucmVmcmVzaF90b2tlbiA9ICcnXG5cdFx0XHRyZXMudmFsaWQgPSBmYWxzZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0UmVhZFByb2ZpbGU6IGFzeW5jIChfLCB7IGlucHV0IH0sIHsgYWNjZXNzRGV0YWlscyB9KSA9PiB7XG5cdFx0aWYgKCFhY2Nlc3NEZXRhaWxzKSB7XG5cdFx0XHR0aHJvdyBuZXcgQXV0aGVudGljYXRpb25FcnJvcigneW91IG11c3QgYmUgbG9nZ2VkIGluJylcblx0XHR9XG5cblx0XHRpZiAoaW5wdXQuaWQgIT09IGFjY2Vzc0RldGFpbHMudXNlcklkKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJ5b3UgY2FuJ3QgYWNjZXNzIG90aGVyIHByb2ZpbGVcIilcblx0XHR9XG5cblx0XHRjb25zdCByZXM6IFByb2ZpbGVTY2hlbWEgPSB7fVxuXHRcdGNvbnN0IHJlYWRQcm9maWxlUmVxdWVzdCA9IG5ldyBSZWFkUHJvZmlsZVJlcXVlc3QoKVxuXHRcdHJlYWRQcm9maWxlUmVxdWVzdC5zZXRBY2NvdW50SWQoaW5wdXQuaWQpXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcHJvZmlsZVJlcyA9IChhd2FpdCByZWFkUHJvZmlsZShyZWFkUHJvZmlsZVJlcXVlc3QpKSBhcyBQcm9maWxlXG5cdFx0XHRjb25zdCBwcm9maWxlU2VjdXJpdHk6IFByb2ZpbGVTZWN1cml0eVNjaGVtYSA9IHt9XG5cblx0XHRcdGNvbnN0IGVtYWlsID0ge1xuXHRcdFx0XHRlbWFpbDogcHJvZmlsZVJlcy5nZXRFbWFpbCgpPy5nZXRFbWFpbCgpLFxuXHRcdFx0XHQvLyBzdGF0dXM6IHByb2ZpbGVSZXMuZ2V0RW1haWwoKT8uZ2V0U3RhdHVzKCksXG5cdFx0XHRcdHNob3c6IHByb2ZpbGVSZXMuZ2V0RW1haWwoKT8uZ2V0U2hvdygpXG5cdFx0XHR9XG5cblx0XHRcdHByb2ZpbGVTZWN1cml0eS52ZXJpZmllZCA9IHByb2ZpbGVSZXMuZ2V0U2VjdXJpdHkoKT8uZ2V0VmVyaWZpZWQoKVxuXG5cdFx0XHRyZXMudXNlcm5hbWUgPSBwcm9maWxlUmVzLmdldFVzZXJuYW1lKClcblx0XHRcdHJlcy5naXZlbk5hbWUgPSBwcm9maWxlUmVzLmdldEdpdmVuTmFtZSgpXG5cdFx0XHRyZXMuZmFtaWx5TmFtZSA9IHByb2ZpbGVSZXMuZ2V0RmFtaWx5TmFtZSgpXG5cdFx0XHRyZXMubWlkZGxlTmFtZSA9IHByb2ZpbGVSZXMuZ2V0TWlkZGxlTmFtZSgpXG5cdFx0XHRyZXMuZW1haWwgPSBlbWFpbFxuXHRcdFx0cmVzLnNlY3VyaXR5ID0gcHJvZmlsZVNlY3VyaXR5XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihlcnJvcilcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IE11dGF0aW9uOiBNdXRhdGlvblJlc29sdmVycyA9IHtcblx0QXV0aDogYXN5bmMgKF8sIHsgaW5wdXQgfSkgPT4ge1xuXHRcdGNvbnN0IGF1dGhSZXF1ZXN0ID0gbmV3IEF1dGhSZXF1ZXN0KClcblx0XHRpZiAoaW5wdXQ/LnVzZXJuYW1lKSB7XG5cdFx0XHRhdXRoUmVxdWVzdC5zZXRVc2VybmFtZShpbnB1dC51c2VybmFtZSlcblx0XHR9XG5cdFx0aWYgKGlucHV0Py5wYXNzd29yZCkge1xuXHRcdFx0YXV0aFJlcXVlc3Quc2V0UGFzc3dvcmQoaW5wdXQucGFzc3dvcmQpXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzOiBBdXRoUmVzcG9uc2VTY2hlbWEgPSB7fVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB0b2tlblJlc3BvbnNlID0gKGF3YWl0IGF1dGgoYXV0aFJlcXVlc3QpKSBhcyBBdXRoUmVzcG9uc2Vcblx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSB0b2tlblJlc3BvbnNlLmdldEFjY2Vzc1Rva2VuKClcblx0XHRcdHJlcy5yZWZyZXNoX3Rva2VuID0gdG9rZW5SZXNwb25zZS5nZXRSZWZyZXNoVG9rZW4oKVxuXHRcdFx0cmVzLnZhbGlkID0gdG9rZW5SZXNwb25zZS5nZXRWYWxpZCgpXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHJlcy5hY2Nlc3NfdG9rZW4gPSAnJ1xuXHRcdFx0cmVzLnJlZnJlc2hfdG9rZW4gPSAnJ1xuXHRcdFx0cmVzLnZhbGlkID0gZmFsc2Vcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH0sXG5cdENyZWF0ZVByb2ZpbGU6IGFzeW5jIChfLCB7IGlucHV0IH0pID0+IHtcblx0XHRjb25zdCBtaWRkbGVOYW1lID0gaW5wdXQubWlkZGxlTmFtZSA/IGAgJHtpbnB1dC5taWRkbGVOYW1lLnRyaW0oKX1gIDogJydcblx0XHRjb25zdCBmYW1pbHlOYW1lID0gaW5wdXQuZmFtaWx5TmFtZSA/IGAgJHtpbnB1dC5mYW1pbHlOYW1lLnRyaW0oKX1gIDogJydcblx0XHRjb25zdCBuYW1lID0gYCR7aW5wdXQuZ2l2ZW5OYW1lfSR7bWlkZGxlTmFtZX0ke2ZhbWlseU5hbWV9YFxuXHRcdGNvbnN0IGlkZW50aWZpZXIgPSBuZXcgSWRlbnRpZmllcigpXG5cdFx0aWRlbnRpZmllci5zZXROYW1lKG5hbWUudHJpbSgpKVxuXHRcdGNvbnN0IHByb2ZpbGVTZWN1cml0eSA9IG5ldyBQcm9maWxlU2VjdXJpdHkoKVxuXHRcdGlmIChpbnB1dC5zZWN1cml0eT8ucGFzc3dvcmQpIHtcblx0XHRcdHByb2ZpbGVTZWN1cml0eS5zZXRQYXNzd29yZChpbnB1dC5zZWN1cml0eS5wYXNzd29yZClcblx0XHR9XG5cdFx0Y29uc3QgZW1haWwgPSBuZXcgRW1haWwoKVxuXHRcdGlmIChpbnB1dC5lbWFpbD8uZW1haWwpIHtcblx0XHRcdGVtYWlsLnNldEVtYWlsKGlucHV0LmVtYWlsLmVtYWlsKVxuXHRcdH1cblx0XHRpZiAoaW5wdXQuZW1haWw/LnNob3cpIHtcblx0XHRcdGVtYWlsLnNldFNob3coaW5wdXQuZW1haWwuc2hvdylcblx0XHR9XG5cdFx0Y29uc3QgcHJvZmlsZSA9IG5ldyBQcm9maWxlKClcblx0XHRpZiAoaW5wdXQ/LmdlbmRlcikge1xuXHRcdFx0cHJvZmlsZS5zZXRHZW5kZXIoaW5wdXQuZ2VuZGVyKVxuXHRcdH1cblx0XHRpZiAoaW5wdXQ/LnVzZXJuYW1lKSB7XG5cdFx0XHRwcm9maWxlLnNldFVzZXJuYW1lKGlucHV0LnVzZXJuYW1lKVxuXHRcdH1cblx0XHRwcm9maWxlLnNldEVtYWlsKGVtYWlsKVxuXHRcdHByb2ZpbGUuc2V0SWRlbnRpdHkoaWRlbnRpZmllcilcblx0XHRwcm9maWxlLnNldFNlY3VyaXR5KHByb2ZpbGVTZWN1cml0eSlcblx0XHRjb25zdCByZXMgPSAoYXdhaXQgY3JlYXRlUHJvZmlsZShwcm9maWxlKSkgYXMgSWRcblxuXHRcdGNvbnN0IHByb2ZpbGVSZXNwb25zZTogSWRTY2hlbWEgPSB7XG5cdFx0XHRpZDogcmVzLmdldElkKClcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvZmlsZVJlc3BvbnNlXG5cdH0sXG5cdExvZ291dDogYXN5bmMgKF8sIHsgaW5wdXQgfSwgeyB0b2tlbjogYWNjZXNzVG9rZW4gfSkgPT4ge1xuXHRcdGNvbnN0IHJlczogRGVmYXVsdFJlc3BvbnNlU2NoZW1hID0ge31cblx0XHRjb25zdCB0b2tlblJlcXVlc3QgPSBuZXcgVG9rZW5SZXF1ZXN0KClcblxuXHRcdGNvbnN0IHRva2VuID0gKGlucHV0ICYmIGlucHV0LnRva2VuKSB8fCBhY2Nlc3NUb2tlblxuXHRcdGlmICh0b2tlbikge1xuXHRcdFx0dG9rZW5SZXF1ZXN0LnNldFRva2VuKHRva2VuKVxuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBsb2dvdXRSZXMgPSAoYXdhaXQgbG9nb3V0KHRva2VuUmVxdWVzdCkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IGxvZ291dFJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0cmVzLmNvZGUgPSBsb2dvdXRSZXMuZ2V0Q29kZSgpXG5cdFx0XHRyZXMuZXJyb3IgPSBsb2dvdXRSZXMuZ2V0RXJyb3IoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fVxufVxuXG5leHBvcnQgY29uc3QgcHJvZmlsZVJlc29sdmVycyA9IHtcblx0TXV0YXRpb24sXG5cdFF1ZXJ5XG59XG5leHBvcnQgZGVmYXVsdCBwcm9maWxlUmVzb2x2ZXJzXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBBY2NvdW50VHlwZSB7XFxuICBCQVNFXFxuICBDT01QQU5ZXFxuICBGVU5ESU5HXFxuICBKT0JcXG59XFxuXFxuZW51bSBHZW5kZXIge1xcbiAgTUFMRVxcbiAgRkVNQUxFXFxuICBPVEhFUlxcbn1cXG5cXG5lbnVtIFByb2ZpbGVPcGVyYXRpb25zIHtcXG4gIENSRUFURVxcbiAgUkVBRFxcbiAgVVBEQVRFXFxuICBERUxFVEVcXG4gIEJVTEtfVVBEQVRFXFxufVxcblxcbmVudW0gT3BlcmF0aW9uRW50aXR5IHtcXG4gIENPTVBBTllcXG4gIEpPQlxcbiAgSU5WRVNUT1JcXG59XFxuXFxudHlwZSBFZHVjYXRpb24ge1xcbiAgZWR1Y2F0aW9uOiBTdHJpbmdcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlU2VjdXJpdHkge1xcbiAgYWNjb3VudFR5cGU6IEFjY291bnRUeXBlXFxuICB2ZXJpZmllZDogQm9vbGVhblxcbn1cXG5cXG50eXBlIFByb2ZpbGUge1xcbiAgaWRlbnRpdHk6IElkZW50aWZpZXJcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsXFxuICBnZW5kZXI6IEdlbmRlclxcbiAgYmlydGhkYXRlOiBUaW1lc3RhbXBcXG4gIGN1cnJlbnRQb3NpdGlvbjogU3RyaW5nXFxuICBlZHVjYXRpb246IEVkdWNhdGlvblxcbiAgYWRkcmVzczogQWRkcmVzc1xcbiAgc2VjdXJpdHk6IFByb2ZpbGVTZWN1cml0eVxcbiAgbWV0YWRhdGE6IE1ldGFkYXRhXFxufVxcblxcbnR5cGUgQXV0aFJlc3BvbnNlIHtcXG4gIGFjY2Vzc190b2tlbjogU3RyaW5nXFxuICByZWZyZXNoX3Rva2VuOiBTdHJpbmdcXG4gIHZhbGlkOiBCb29sZWFuXFxufVxcblxcbnR5cGUgQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIHtcXG4gIGF1dGhvcml6ZWQ6IEJvb2xlYW5cXG4gIGFjY2Vzc1V1aWQ6IFN0cmluZ1xcbiAgdXNlcklkOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIGlkZW50aWZpZXI6IFN0cmluZ1xcbiAgYWNjb3VudFR5cGU6IFN0cmluZ1xcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG4gIGV4cDogU3RyaW5nXFxufVxcblxcbmlucHV0IEVkdWNhdGlvbklucHV0IHtcXG4gIGVkdWNhdGlvbjogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbmlucHV0IFByb2ZpbGVTZWN1cml0eUlucHV0IHtcXG4gIHBhc3N3b3JkOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbn1cXG5cXG5pbnB1dCBQcm9maWxlSW5wdXQge1xcbiAgaWRlbnRpdHk6IElkZW50aWZpZXJJbnB1dFxcbiAgZ2l2ZW5OYW1lOiBTdHJpbmdcXG4gIG1pZGRsZU5hbWU6IFN0cmluZ1xcbiAgZmFtaWx5TmFtZTogU3RyaW5nXFxuICB1c2VybmFtZTogU3RyaW5nXFxuICBlbWFpbDogRW1haWxJbnB1dFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wSW5wdXRcXG4gIGN1cnJlbnRQb3NpdGlvbjogU3RyaW5nXFxuICBlZHVjYXRpb246IEVkdWNhdGlvbklucHV0XFxuICBhZGRyZXNzOiBBZGRyZXNzSW5wdXRcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlJbnB1dFxcbn1cXG5cXG5pbnB1dCBWYWxpZGF0ZVVzZXJuYW1lSW5wdXQge1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBWYWxpZGF0ZUVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBBdXRoUmVxdWVzdElucHV0IHtcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIHBhc3N3b3JkOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgVG9rZW5SZXF1ZXN0IHtcXG4gIHRva2VuOiBTdHJpbmdcXG4gIGFjY2Vzc1V1aWQ6IFN0cmluZ1xcbiAgdXNlcklkOiBTdHJpbmdcXG59XFxuXFxuZXh0ZW5kIHR5cGUgUXVlcnkge1xcbiAgVmFsaWRhdGVVc2VybmFtZShpbnB1dDogVmFsaWRhdGVVc2VybmFtZUlucHV0ISk6IERlZmF1bHRSZXNwb25zZSFcXG4gIFZhbGlkYXRlRW1haWwoaW5wdXQ6IFZhbGlkYXRlRW1haWxJbnB1dCEpOiBEZWZhdWx0UmVzcG9uc2UhXFxuICBWZXJpZnlUb2tlbihpbnB1dDogVG9rZW5SZXF1ZXN0KTogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIVxcbiAgUmVmcmVzaFRva2VuKGlucHV0OiBUb2tlblJlcXVlc3QpOiBBdXRoUmVzcG9uc2UhXFxuICBSZWFkUHJvZmlsZShpbnB1dDogSWRJbnB1dCEpOiBQcm9maWxlIVxcbn1cXG5cXG5leHRlbmQgdHlwZSBNdXRhdGlvbiB7XFxuICBDcmVhdGVQcm9maWxlKGlucHV0OiBQcm9maWxlSW5wdXQhKTogSWQhXFxuICBBdXRoKGlucHV0OiBBdXRoUmVxdWVzdElucHV0KTogQXV0aFJlc3BvbnNlIVxcbiAgTG9nb3V0KGlucHV0OiBUb2tlblJlcXVlc3QpOiBEZWZhdWx0UmVzcG9uc2UhXFxufVxcblwiIiwiaW1wb3J0IHByb2ZpbGVDbGllbnQgZnJvbSAnY2xpZW50L3Byb2ZpbGUnXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJ1xuXG5leHBvcnQgY29uc3QgY3JlYXRlUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmNyZWF0ZVByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCBjb25maXJtUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmNvbmZpcm1Qcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgcmVhZFByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5yZWFkUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVByb2ZpbGUgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC51cGRhdGVQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmFsaWRhdGVVc2VybmFtZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnZhbGlkYXRlVXNlcm5hbWUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUVtYWlsID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmFsaWRhdGVFbWFpbCkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IGF1dGggPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5hdXRoKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdmVyaWZ5VG9rZW4gPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52ZXJpZnlUb2tlbikuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IGxvZ291dCA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LmxvZ291dCkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHJlZnJlc2hUb2tlbiA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnJlZnJlc2hUb2tlbikuYmluZChwcm9maWxlQ2xpZW50KVxuIiwiaW1wb3J0IHsgTXV0YXRpb25SZXNvbHZlcnMsIFF1ZXJ5UmVzb2x2ZXJzLCBSZXNvbHZlcnMsIFN1YnNjcmlwdGlvblJlc29sdmVycyB9IGZyb20gJ2dlbmVyYXRlZC9ncmFwaHFsJ1xuXG5jb25zdCBRdWVyeTogUXVlcnlSZXNvbHZlcnMgPSB7XG5cdGR1bW15OiAoKSA9PiAnZG9kbyBkdWNrIGxpdmVzIGhlcmUnXG59XG5jb25zdCBNdXRhdGlvbjogTXV0YXRpb25SZXNvbHZlcnMgPSB7XG5cdGR1bW15OiAoKSA9PiAnRG9kbyBEdWNrJ1xufVxuY29uc3QgU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25SZXNvbHZlcnMgPSB7XG5cdGR1bW15OiAoXywgX18sIHsgcHVic3ViIH0pID0+IHB1YnN1Yi5hc3luY0l0ZXJhdG9yKCdET0RPX0RVQ0snKVxufVxuXG5jb25zdCByb290UmVzb2x2ZXJzOiBSZXNvbHZlcnMgPSB7XG5cdFF1ZXJ5LFxuXHRNdXRhdGlvbixcblx0U3Vic2NyaXB0aW9uLFxuXHRSZXN1bHQ6IHtcblx0XHRfX3Jlc29sdmVUeXBlOiAobm9kZTogYW55KSA9PiB7XG5cdFx0XHRpZiAobm9kZS5ub09mRW1wbG95ZWVzKSByZXR1cm4gJ0NvbXBhbnknXG5cblx0XHRcdHJldHVybiAnSm9iJ1xuXHRcdH1cblx0fSxcblx0SU5vZGU6IHtcblx0XHRfX3Jlc29sdmVUeXBlOiAobm9kZTogYW55KSA9PiB7XG5cdFx0XHRpZiAobm9kZS5ub09mRW1wbG95ZWVzKSByZXR1cm4gJ0NvbXBhbnknXG5cdFx0XHQvLyBpZiAobm9kZS5zdGFycykgcmV0dXJuICdSZXZpZXcnXG5cblx0XHRcdHJldHVybiAnQ29tcGFueSdcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcm9vdFJlc29sdmVyc1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgQXBwbGljYW50IHtcXG4gIGFwcGxpY2F0aW9uczogW1N0cmluZ10hXFxuICBzaG9ydGxpc3RlZDogW1N0cmluZ10hXFxuICBvbmhvbGQ6IFtTdHJpbmddIVxcbiAgcmVqZWN0ZWQ6IFtTdHJpbmddIVxcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIFNvcnQge1xcbiAgQVNDXFxuICBERVNDXFxufVxcblxcbnR5cGUgUGFnaW5hdGlvbiB7XFxuICBwYWdlOiBJbnRcXG4gIGZpcnN0OiBJbnRcXG4gIGFmdGVyOiBTdHJpbmdcXG4gIG9mZnNldDogSW50XFxuICBsaW1pdDogSW50XFxuICBzb3J0OiBTb3J0XFxuICBwcmV2aW91czogU3RyaW5nXFxuICBuZXh0OiBTdHJpbmdcXG4gIGlkZW50aWZpZXI6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBQYWdpbmF0aW9uSW5wdXQge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgTWV0YWRhdGEge1xcbiAgY3JlYXRlZF9hdDogVGltZXN0YW1wXFxuICB1cGRhdGVkX2F0OiBUaW1lc3RhbXBcXG4gIHB1Ymxpc2hlZF9kYXRlOiBUaW1lc3RhbXBcXG4gIGVuZF9kYXRlOiBUaW1lc3RhbXBcXG4gIGxhc3RfYWN0aXZlOiBUaW1lc3RhbXBcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBQcm9maWxlT3BlcmF0aW9uT3B0aW9ucyB7XFxuICBDUkVBVEVcXG4gIFJFQURcXG4gIFVQREFURVxcbiAgREVMRVRFXFxuICBCVUxLX1VQREFURVxcbn1cXG5cXG50eXBlIE1hcFByb2ZpbGVQZXJtaXNzaW9uIHtcXG4gIGtleTogU3RyaW5nXFxuICBwcm9maWxlT3BlcmF0aW9uczogW1Byb2ZpbGVPcGVyYXRpb25PcHRpb25zXVxcbn1cXG5cXG50eXBlIFBlcm1pc3Npb25zQmFzZSB7XFxuICBwZXJtaXNzaW9uczogTWFwUHJvZmlsZVBlcm1pc3Npb25cXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBSYXRpbmcge1xcbiAgYXV0aG9yOiBTdHJpbmdcXG4gIGJlc3RSYXRpbmc6IEludFxcbiAgZXhwbGFuYXRpb246IFN0cmluZ1xcbiAgdmFsdWU6IEludFxcbiAgd29yc3RSYXRpbmc6IEludFxcbn1cXG5cXG50eXBlIEFnZ3JlZ2F0ZVJhdGluZyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZyFcXG4gIHJhdGluZ0NvdW50OiBJbnQhXFxuICByZXZpZXdDb3VudDogSW50XFxufVxcblxcbnR5cGUgUmV2aWV3IHtcXG4gIGl0ZW1SZXZpZXdlZDogU3RyaW5nXFxuICBhc3BlY3Q6IFN0cmluZ1xcbiAgYm9keTogU3RyaW5nXFxuICByYXRpbmc6IFN0cmluZ1xcbn1cXG5cXG50eXBlIEdlb0xvY2F0aW9uIHtcXG4gIGVsZXZhdGlvbjogSW50XFxuICBsYXRpdHVkZTogSW50XFxuICBsb25naXR1ZGU6IEludFxcbiAgcG9zdGFsQ29kZTogSW50XFxufVxcblxcbnR5cGUgQWRkcmVzcyB7XFxuICBjb3VudHJ5OiBTdHJpbmchXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFBsYWNlIHtcXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHJldmlldzogUmV2aWV3XFxuICBhZ2dyZWdhdGVSYXRpbmc6IEFnZ3JlZ2F0ZVJhdGluZ1xcbiAgYnJhbmNoQ29kZTogU3RyaW5nXFxuICBnZW86IEdlb0xvY2F0aW9uXFxufVxcblxcbmlucHV0IEFkZHJlc3NJbnB1dCB7XFxuICBjb3VudHJ5OiBTdHJpbmdcXG4gIGxvY2FsaXR5OiBTdHJpbmdcXG4gIHJlZ2lvbjogU3RyaW5nXFxuICBwb3N0YWxDb2RlOiBJbnRcXG4gIHN0cmVldDogU3RyaW5nXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgUmFuZ2Uge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxudHlwZSBEZWZhdWx0UmVzcG9uc2Uge1xcbiAgc3RhdHVzOiBCb29sZWFuXFxuICBlcnJvcjogU3RyaW5nXFxuICBjb2RlOiBJbnRcXG59XFxuXFxudHlwZSBJZCB7XFxuICBpZDogSUQhXFxufVxcblxcbmVudW0gRW1haWxTdGF0dXMge1xcbiAgV0FJVElOR1xcbiAgQ09ORklSTUVEXFxuICBCTE9DS0VEXFxuICBFWFBJUkVEXFxufVxcblxcbnR5cGUgRW1haWwge1xcbiAgZW1haWw6IFN0cmluZ1xcbiAgc3RhdHVzOiBFbWFpbFN0YXR1c1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG50eXBlIEF0dGFjaG1lbnQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG4gIHVwbG9hZERhdGU6IFRpbWVzdGFtcFxcbiAgdXJsOiBTdHJpbmdcXG4gIHVzZXI6IFN0cmluZ1xcbiAgZm9sZGVyOiBTdHJpbmdcXG59XFxuXFxudHlwZSBJZGVudGlmaWVyIHtcXG4gIGlkZW50aWZpZXI6IFN0cmluZyFcXG4gIG5hbWU6IFN0cmluZ1xcbiAgYWx0ZXJuYXRlTmFtZTogU3RyaW5nXFxuICB0eXBlOiBTdHJpbmdcXG4gIGFkZGl0aW9uYWxUeXBlOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGRpc2FtYmlndWF0aW5nRGVzY3JpcHRpb246IFN0cmluZ1xcbiAgaGVhZGxpbmU6IFN0cmluZ1xcbiAgc2xvZ2FuOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUmFuZ2VJbnB1dCB7XFxuICBtaW46IEludCFcXG4gIG1heDogSW50IVxcbn1cXG5cXG5pbnB1dCBJZElucHV0IHtcXG4gIGlkOiBJRCFcXG59XFxuXFxuaW5wdXQgRW1haWxJbnB1dCB7XFxuICBlbWFpbDogU3RyaW5nXFxuICBzaG93OiBCb29sZWFuXFxufVxcblxcbmlucHV0IEF0dGFjaG1lbnRJbnB1dCB7XFxuICB0eXBlOiBTdHJpbmdcXG4gIGZpbGU6IFN0cmluZ1xcbiAgdXNlcjogU3RyaW5nXFxuICBmb2xkZXI6IFN0cmluZ1xcbn1cXG5cXG5pbnB1dCBJZGVudGlmaWVySW5wdXQge1xcbiAgbmFtZTogU3RyaW5nXFxuICBhbHRlcm5hdGVOYW1lOiBTdHJpbmdcXG4gIHR5cGU6IFN0cmluZ1xcbiAgYWRkaXRpb25hbFR5cGU6IFN0cmluZ1xcbiAgZGVzY3JpcHRpb246IFN0cmluZ1xcbiAgZGlzYW1iaWd1YXRpbmdEZXNjcmlwdGlvbjogU3RyaW5nXFxuICBoZWFkbGluZTogU3RyaW5nXFxuICBzbG9nYW46IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJlbnVtIERheXNPZldlZWsge1xcbiAgTU9OREFZXFxuICBUVUVTREFZXFxuICBXRURORVNEQVlcXG4gIFRIUlVTREFZXFxuICBGUklEQVlcXG4gIFNUQVVSREFZXFxuICBTVU5EQVlcXG59XFxuXFxudHlwZSBUaW1lc3RhbXAge1xcbiAgc2Vjb25kczogU3RyaW5nXFxuICBuYW5vczogU3RyaW5nXFxufVxcblxcbnR5cGUgVGltZSB7XFxuICBvcGVuczogVGltZXN0YW1wXFxuICBjbG9zZXM6IFRpbWVzdGFtcFxcbiAgZGF5c09mV2VlazogRGF5c09mV2Vla1xcbiAgdmFsaWRGcm9tOiBUaW1lc3RhbXBcXG4gIHZhbGlkVGhyb3VnaDogVGltZXN0YW1wXFxufVxcblxcbmlucHV0IFRpbWVzdGFtcElucHV0IHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJzY2FsYXIgRGF0ZVxcblxcbnR5cGUgRWRnZSB7XFxuICBjdXJzb3I6IFN0cmluZyFcXG4gIG5vZGU6IFtSZXN1bHQhXSFcXG59XFxuXFxudHlwZSBQYWdlSW5mbyB7XFxuICBlbmRDdXJzb3I6IFN0cmluZyFcXG4gIGhhc05leHRQYWdlOiBCb29sZWFuIVxcbn1cXG5cXG5pbnRlcmZhY2UgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgY3JlYXRlZEF0OiBUaW1lc3RhbXAhXFxuICB1cGRhdGVkQXQ6IFRpbWVzdGFtcCFcXG59XFxuXFxudW5pb24gUmVzdWx0ID0gSm9iIHwgQ29tcGFueVxcblxcbnR5cGUgUXVlcnkge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBNdXRhdGlvbiB7XFxuICBkdW1teTogU3RyaW5nIVxcbn1cXG5cXG50eXBlIFN1YnNjcmlwdGlvbiB7XFxuICBkdW1teTogU3RyaW5nIVxcbn1cXG5cXG5zY2hlbWEge1xcbiAgcXVlcnk6IFF1ZXJ5XFxuICBtdXRhdGlvbjogTXV0YXRpb25cXG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uXFxufVxcblwiIiwiaW1wb3J0ICogYXMgYXBwbGljYW50c1NjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvYXBwbGljYW50cy5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY29tcGFueVNjaGVtYSBmcm9tICdjbGllbnQvY29tcGFueS9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBjdXJzb3JTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgam9iU2NoZW1hIGZyb20gJ2NsaWVudC9qb2Ivc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgbWV0YWRhdGFTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL21ldGFkYXRhLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwZXJtaXNzaW9uc1NjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvcGVybWlzc2lvbnMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHBsYWNlU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcHJvZmlsZVNjaGVtYSBmcm9tICdjbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyByb290U2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHN5c3RlbVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwnXG5pbXBvcnQgKiBhcyB0aW1lU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwnXG5cbmltcG9ydCB7IEFwb2xsb1NlcnZlciwgUHViU3ViIH0gZnJvbSAnYXBvbGxvLXNlcnZlci1leHByZXNzJ1xuaW1wb3J0IHByb2ZpbGVSZXNvbHZlcnMsIHsgZXh0cmFjdFRva2VuTWV0YWRhdGEgfSBmcm9tICdjbGllbnQvcHJvZmlsZS9yZXNvbHZlcidcblxuaW1wb3J0IHsgQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIH0gZnJvbSAnZ2VuZXJhdGVkL2dyYXBocWwnXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBfdHJhY2VyIGZyb20gJ3RyYWNlcidcbmltcG9ydCBsb2dnZXIgZnJvbSAnbG9nZ2VyJ1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgcm9vdFJlc29sdmVycyBmcm9tICdjbGllbnQvcm9vdC9yZXNvbHZlcidcbmltcG9ydCB3aW5zdG9uIGZyb20gJ3dpbnN0b24nXG5cbmV4cG9ydCBjb25zdCBwdWJzdWIgPSBuZXcgUHViU3ViKClcbmV4cG9ydCBjb25zdCB0eXBlRGVmcyA9IFtcblx0cm9vdFNjaGVtYSxcblx0YXBwbGljYW50c1NjaGVtYSxcblx0Y3Vyc29yU2NoZW1hLFxuXHRtZXRhZGF0YVNjaGVtYSxcblx0cGxhY2VTY2hlbWEsXG5cdHN5c3RlbVNjaGVtYSxcblx0cGVybWlzc2lvbnNTY2hlbWEsXG5cdHRpbWVTY2hlbWEsXG5cdHByb2ZpbGVTY2hlbWEsXG5cdGNvbXBhbnlTY2hlbWEsXG5cdGpvYlNjaGVtYVxuXVxuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IG1lcmdlKHt9LCByb290UmVzb2x2ZXJzLCBwcm9maWxlUmVzb2x2ZXJzKVxuY29uc3QgdHJhY2VyID0gX3RyYWNlcignc2VydmljZTpnYXRld2F5JylcbmV4cG9ydCBpbnRlcmZhY2UgT29Kb2JDb250ZXh0IHtcblx0cmVxOiBSZXF1ZXN0XG5cdHB1YnN1YjogUHViU3ViXG5cdHRyYWNlcjogdHlwZW9mIHRyYWNlclxuXHR0b2tlbjogc3RyaW5nXG5cdGFjY2Vzc0RldGFpbHM6IEFjY2Vzc0RldGFpbHNSZXNwb25zZVxuXHRsb2dnZXI6IHdpbnN0b24uTG9nZ2VyXG59XG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcblx0dHlwZURlZnMsXG5cdHJlc29sdmVycyxcblx0Y29udGV4dDogYXN5bmMgKHsgcmVxLCBjb25uZWN0aW9uIH0pID0+IHtcblx0XHRjb25zdCB0b2tlbkRhdGEgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uXG5cdFx0bGV0IHRva2VuOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblx0XHRsZXQgYWNjZXNzRGV0YWlsczogQWNjZXNzRGV0YWlsc1Jlc3BvbnNlIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cblx0XHRpZiAodG9rZW5EYXRhKSB7XG5cdFx0XHR0b2tlbiA9IHRva2VuRGF0YS5zcGxpdCgnICcpWzFdXG5cdFx0fVxuXHRcdGlmICh0b2tlbikge1xuXHRcdFx0YWNjZXNzRGV0YWlscyA9IGF3YWl0IGV4dHJhY3RUb2tlbk1ldGFkYXRhKHRva2VuKVxuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXEsXG5cdFx0XHRjb25uZWN0aW9uLFxuXHRcdFx0cHVic3ViLFxuXHRcdFx0dHJhY2VyLFxuXHRcdFx0YWNjZXNzRGV0YWlscyxcblx0XHRcdHRva2VuLFxuXHRcdFx0bG9nZ2VyXG5cdFx0fVxuXHR9LFxuXHR0cmFjaW5nOiB0cnVlXG59KVxuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXJcbiIsImltcG9ydCAnZG90ZW52L2NvbmZpZydcblxuaW1wb3J0IHsgYXBwLCBzZXJ2ZXIsIHN0YXJ0U3luY1NlcnZlciwgc3RvcFNlcnZlciB9IGZyb20gJ29vam9iLnNlcnZlcidcbmltcG9ydCB7IGZvcmssIGlzTWFzdGVyLCBvbiB9IGZyb20gJ2NsdXN0ZXInXG5cbmltcG9ydCBsb2dnZXIgZnJvbSAnbG9nZ2VyJ1xuXG5kZWNsYXJlIGNvbnN0IG1vZHVsZTogYW55XG5cbmNvbnN0IHN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuXHRjb25zdCB7IFBPUlQgfSA9IHByb2Nlc3MuZW52XG5cdGNvbnN0IHBvcnQgPSBQT1JUIHx8ICc4MDgwJ1xuXG5cdHRyeSB7XG5cdFx0YXdhaXQgc3RvcFNlcnZlcigpXG5cdFx0YXdhaXQgc3RhcnRTeW5jU2VydmVyKHBvcnQpXG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignU2VydmVyIEZhaWxlZCB0byBzdGFydCcpXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcilcblx0XHRwcm9jZXNzLmV4aXQoMSlcblx0fVxufVxuXG5pZiAoaXNNYXN0ZXIpIHtcblx0Y29uc3QgbnVtQ1BVcyA9IHJlcXVpcmUoJ29zJykuY3B1cygpLmxlbmd0aFxuXG5cdGxvZ2dlci5pbmZvKGBNYXN0ZXIgJHtwcm9jZXNzLnBpZH0gaXMgcnVubmluZ2ApXG5cblx0Ly8gRm9yayB3b3JrZXJzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bUNQVXM7IGkrKykge1xuXHRcdGZvcmsoKVxuXHR9XG5cblx0b24oJ2ZvcmsnLCAod29ya2VyKSA9PiB7XG5cdFx0bG9nZ2VyLmluZm8oJ3dvcmtlciBpcyBkZWFkOicsIHdvcmtlci5pc0RlYWQoKSlcblx0fSlcblxuXHRvbignZXhpdCcsICh3b3JrZXIpID0+IHtcblx0XHRsb2dnZXIuaW5mbygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxufSBlbHNlIHtcblx0LyoqXG5cdCAqIFtpZiBIb3QgTW9kdWxlIGZvciB3ZWJwYWNrXVxuXHQgKiBAcGFyYW0gIHtbdHlwZV19IG1vZHVsZSBbZ2xvYmFsIG1vZHVsZSBub2RlIG9iamVjdF1cblx0ICovXG5cdGxldCBjdXJyZW50QXBwID0gYXBwXG5cdGlmIChtb2R1bGUuaG90KSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoJ29vam9iLnNlcnZlcicsICgpID0+IHtcblx0XHRcdHNlcnZlci5yZW1vdmVMaXN0ZW5lcigncmVxdWVzdCcsIGN1cnJlbnRBcHApXG5cdFx0XHRzZXJ2ZXIub24oJ3JlcXVlc3QnLCBhcHApXG5cdFx0XHRjdXJyZW50QXBwID0gYXBwXG5cdFx0fSlcblxuXHRcdC8qKlxuXHRcdCAqIE5leHQgY2FsbGJhY2sgaXMgZXNzZW50aWFsOlxuXHRcdCAqIEFmdGVyIGNvZGUgY2hhbmdlcyB3ZXJlIGFjY2VwdGVkIHdlIG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwLlxuXHRcdCAqIHNlcnZlci5jbG9zZSgpIGlzIGhlcmUgRXhwcmVzcy5KUy1zcGVjaWZpYyBhbmQgY2FuIGRpZmZlciBpbiBvdGhlciBmcmFtZXdvcmtzLlxuXHRcdCAqIFRoZSBpZGVhIGlzIHRoYXQgeW91IHNob3VsZCBzaHV0IGRvd24geW91ciBhcHAgaGVyZS5cblx0XHQgKiBEYXRhL3N0YXRlIHNhdmluZyBiZXR3ZWVuIHNodXRkb3duIGFuZCBuZXcgc3RhcnQgaXMgcG9zc2libGVcblx0XHQgKi9cblx0XHRtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4gc2VydmVyLmNsb3NlKCkpXG5cdH1cblxuXHQvLyBXb3JrZXJzIGNhbiBzaGFyZSBhbnkgVENQIGNvbm5lY3Rpb25cblx0Ly8gSW4gdGhpcyBjYXNlIGl0IGlzIGFuIEhUVFAgc2VydmVyXG5cdHN0YXJ0KClcblxuXHRsb2dnZXIuaW5mbyhgV29ya2VyICR7cHJvY2Vzcy5waWR9IHN0YXJ0ZWRgKVxufVxuIiwiaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJPcHRpb25zLCBjcmVhdGVMb2dnZXIsIGZvcm1hdCwgdHJhbnNwb3J0cyB9IGZyb20gJ3dpbnN0b24nXG5pbXBvcnQgeyBiYXNlbmFtZSwgam9pbiB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdmcydcblxuY29uc3QgeyBjb21iaW5lLCB0aW1lc3RhbXAsIHByZXR0eVByaW50IH0gPSBmb3JtYXRcbmNvbnN0IGxvZ0RpcmVjdG9yeSA9IGpvaW4oX19kaXJuYW1lLCAnbG9nJylcbmNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xudHlwZSBJTG9nZ2VyT3B0aW9ucyA9IHsgZmlsZTogTG9nZ2VyT3B0aW9uczsgY29uc29sZTogTG9nZ2VyT3B0aW9ucyB9XG5cbmNvbnN0IHsgRklMRV9MT0dfTEVWRUwsIENPTlNPTEVfTE9HX0xFVkVMIH0gPSBwcm9jZXNzLmVudlxuZXhwb3J0IGNvbnN0IGxvZ2dlck9wdGlvbnMgPSB7XG5cdGZpbGU6IHtcblx0XHRsZXZlbDogRklMRV9MT0dfTEVWRUwgfHwgJ2luZm8nLFxuXHRcdGZpbGVuYW1lOiBgJHtsb2dEaXJlY3Rvcnl9L2xvZ3MvYXBwLmxvZ2AsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiB0cnVlLFxuXHRcdG1heHNpemU6IDUyNDI4ODAsIC8vIDVNQlxuXHRcdG1heEZpbGVzOiA1LFxuXHRcdGNvbG9yaXplOiBmYWxzZVxuXHR9LFxuXHRjb25zb2xlOiB7XG5cdFx0bGV2ZWw6IENPTlNPTEVfTE9HX0xFVkVMIHx8ICdkZWJ1ZycsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiBmYWxzZSxcblx0XHRjb2xvcml6ZTogdHJ1ZVxuXHR9XG59XG5cbmNvbnN0IGxvZ2dlclRyYW5zcG9ydHMgPSBbXG5cdG5ldyB0cmFuc3BvcnRzLkNvbnNvbGUoe1xuXHRcdC4uLmxvZ2dlck9wdGlvbnMuY29uc29sZSxcblx0XHRmb3JtYXQ6IGZvcm1hdC5jb21iaW5lKFxuXHRcdFx0Zm9ybWF0LnRpbWVzdGFtcCgpLFxuXHRcdFx0Zm9ybWF0LmNvbG9yaXplKHsgYWxsOiB0cnVlIH0pLFxuXHRcdFx0Zm9ybWF0LmFsaWduKCksXG5cdFx0XHRmb3JtYXQucHJpbnRmKChpbmZvKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgbGV2ZWwsIG1lc3NhZ2UsIGxhYmVsIH0gPSBpbmZvXG5cdFx0XHRcdC8vICR7T2JqZWN0LmtleXMoYXJncykubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoYXJncywgbnVsbCwgMikgOiAnJ31cblxuXHRcdFx0XHRyZXR1cm4gYCR7bGV2ZWx9IFske2xhYmVsfV06ICR7bWVzc2FnZX1gXG5cdFx0XHR9KVxuXHRcdClcblx0fSlcbl1cblxuY2xhc3MgQXBwTG9nZ2VyIHtcblx0cHVibGljIGxvZ2dlcjogTG9nZ2VyXG5cdHB1YmxpYyBsb2dnZXJPcHRpb25zOiBJTG9nZ2VyT3B0aW9uc1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IElMb2dnZXJPcHRpb25zKSB7XG5cdFx0aWYgKCFpc0RldmVsb3BtZW50KSB7XG5cdFx0XHRleGlzdHNTeW5jKGxvZ0RpcmVjdG9yeSkgfHwgbWtkaXJTeW5jKGxvZ0RpcmVjdG9yeSlcblx0XHR9XG5cblx0XHR0aGlzLmxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XG5cdFx0XHRmb3JtYXQ6IGZvcm1hdC5jb21iaW5lKFxuXHRcdFx0XHRmb3JtYXQubGFiZWwoeyBsYWJlbDogYmFzZW5hbWUocHJvY2Vzcy5tYWluTW9kdWxlID8gcHJvY2Vzcy5tYWluTW9kdWxlLmZpbGVuYW1lIDogJ3Vua25vd24uZmlsZScpIH0pLFxuXHRcdFx0XHRmb3JtYXQudGltZXN0YW1wKHsgZm9ybWF0OiAnWVlZWS1NTS1ERCBISDptbTpzcycgfSlcblx0XHRcdCksXG5cdFx0XHR0cmFuc3BvcnRzOiBpc0RldmVsb3BtZW50XG5cdFx0XHRcdD8gWy4uLmxvZ2dlclRyYW5zcG9ydHNdXG5cdFx0XHRcdDogW1xuXHRcdFx0XHRcdFx0Li4ubG9nZ2VyVHJhbnNwb3J0cyxcblx0XHRcdFx0XHRcdG5ldyB0cmFuc3BvcnRzLkZpbGUoe1xuXHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLmZpbGUsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogY29tYmluZShcblx0XHRcdFx0XHRcdFx0XHRmb3JtYXQucHJpbnRmKChpbmZvKSA9PiBgJHtpbmZvLnRpbWVzdGFtcH0gJHtpbmZvLmxldmVsfSBbJHtpbmZvLmxhYmVsfV06ICR7aW5mby5tZXNzYWdlfWApXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdCAgXSxcblx0XHRcdGV4aXRPbkVycm9yOiBmYWxzZVxuXHRcdH0pXG5cdH1cbn1cblxuY29uc3QgeyBsb2dnZXIgfSA9IG5ldyBBcHBMb2dnZXIobG9nZ2VyT3B0aW9ucylcbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0ICogYXMgY29yc0xpYnJhcnkgZnJvbSAnY29ycydcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIE5PV19VUkwgPSAnaHR0cHM6Ly9vb2pvYi5pbycsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgcHJvZFVybHMgPSBbJ2h0dHBzOi8vb29qb2IuaW8nLCAnaHR0cHM6Ly9hbHBoYS5vb2pvYi5pbycsICdodHRwczovL2JldGEub29qb2IuaW8nLCBOT1dfVVJMXVxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IGNvcnNPcHRpb24gPSB7XG5cdG9yaWdpbjogaXNQcm9kdWN0aW9uID8gcHJvZFVybHMuZmlsdGVyKEJvb2xlYW4pIDogWy9sb2NhbGhvc3QvXSxcblx0bWV0aG9kczogJ0dFVCwgSEVBRCwgUFVULCBQQVRDSCwgUE9TVCwgREVMRVRFLCBPUFRJT04nLFxuXHRjcmVkZW50aWFsczogdHJ1ZSxcblx0ZXhwb3NlZEhlYWRlcnM6IFsnYXV0aG9yaXphdGlvbiddXG59XG5cbmNvbnN0IGNvcnMgPSAoKSA9PiBjb3JzTGlicmFyeShjb3JzT3B0aW9uKVxuZXhwb3J0IGRlZmF1bHQgY29yc1xuIiwiaW1wb3J0ICogYXMgaG9zdFZhbGlkYXRpb24gZnJvbSAnaG9zdC12YWxpZGF0aW9uJ1xuXG4vLyBOT1RFKEBteHN0YnIpOlxuLy8gLSBIb3N0IGhlYWRlciBvbmx5IGNvbnRhaW5zIHRoZSBkb21haW4sIHNvIHNvbWV0aGluZyBsaWtlICdidWlsZC1hcGktYXNkZjEyMy5ub3cuc2gnIG9yICdvb2pvYi5pbydcbi8vIC0gUmVmZXJlciBoZWFkZXIgY29udGFpbnMgdGhlIGVudGlyZSBVUkwsIHNvIHNvbWV0aGluZyBsaWtlXG4vLyAnaHR0cHM6Ly9idWlsZC1hcGktYXNkZjEyMy5ub3cuc2gvZm9yd2FyZCcgb3IgJ2h0dHBzOi8vb29qb2IuaW8vZm9yd2FyZCdcbi8vIFRoYXQgbWVhbnMgd2UgaGF2ZSB0byBjaGVjayB0aGUgSG9zdCBzbGlnaHRseSBkaWZmZXJlbnRseSBmcm9tIHRoZSBSZWZlcmVyIHRvIGF2b2lkIHRoaW5nc1xuLy8gbGlrZSAnbXktZG9tYWluLW9vam9iLmlvJyB0byBiZSBhYmxlIHRvIGhhY2sgb3VyIHVzZXJzXG5cbi8vIEhvc3RzLCB3aXRob3V0IGh0dHAocyk6Ly8gYW5kIHBhdGhzXG5jb25zdCB7IE5PV19VUkwgPSAnaHR0cDovL29vam9iLmlvJyB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHRydXN0ZWRIb3N0cyA9IFtcblx0Tk9XX1VSTCAmJiBuZXcgUmVnRXhwKGBeJHtOT1dfVVJMLnJlcGxhY2UoJ2h0dHBzOi8vJywgJycpfSRgKSxcblx0L15vb2pvYlxcLmlvJC8sIC8vIFRoZSBEb21haW5cblx0L14uKlxcLm9vam9iXFwuaW8kLyAvLyBBbGwgc3ViZG9tYWluc1xuXS5maWx0ZXIoQm9vbGVhbilcblxuLy8gUmVmZXJlcnMsIHdpdGggaHR0cChzKTovLyBhbmQgcGF0aHNcbmNvbnN0IHRydXN0ZWRSZWZlcmVycyA9IFtcblx0Tk9XX1VSTCAmJiBuZXcgUmVnRXhwKGBeJHtOT1dfVVJMfSgkfFxcLy4qKWApLFxuXHQvXmh0dHBzOlxcL1xcL29vam9iXFwuaW8oJHxcXC8uKikvLCAvLyBUaGUgRG9tYWluXG5cdC9eaHR0cHM6XFwvXFwvLipcXC5zcGVjdHJ1bVxcLmNoYXQoJHxcXC8uKikvIC8vIEFsbCBzdWJkb21haW5zXG5dLmZpbHRlcihCb29sZWFuKVxuXG5jb25zdCBjc3JmID0gaG9zdFZhbGlkYXRpb24oe1xuXHRob3N0czogdHJ1c3RlZEhvc3RzLFxuXHRyZWZlcmVyczogdHJ1c3RlZFJlZmVyZXJzLFxuXHRtb2RlOiAnZWl0aGVyJ1xufSlcbmV4cG9ydCBkZWZhdWx0IGNzcmZcbiIsImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyOiBFcnJvciwgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0aWYgKGVycikge1xuXHRcdGNvbnNvbGUuZXJyb3IoZXJyKVxuXHRcdHJlcy5zdGF0dXMoNTAwKS5zZW5kKCdPb3BzLCBzb21ldGhpbmcgd2VudCB3cm9uZyEgT3VyIGVuZ2luZWVycyBoYXZlIGJlZW4gYWxlcnRlZCBhbmQgd2lsbCBmaXggdGhpcyBhc2FwLicpXG5cdFx0Ly8gY2FwdHVyZSBlcnJvciB3aXRoIGVycm9yIG1ldHJpY3MgY29sbGVjdG9yXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG5leHQoKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGVycm9ySGFuZGxlclxuIiwiaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCAqIGFzIGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgY29ycyBmcm9tICdtaWRkbGV3YXJlcy9jb3JzJ1xuaW1wb3J0IGNzcmYgZnJvbSAnbWlkZGxld2FyZXMvY3NyZidcbmltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnbWlkZGxld2FyZXMvZXJyb3ItaGFuZGxlcidcbmltcG9ydCBzZWN1cml0eSBmcm9tICdtaWRkbGV3YXJlcy9zZWN1cml0eSdcbmltcG9ydCB0b29idXN5IGZyb20gJ21pZGRsZXdhcmVzL3Rvb2J1c3knXG5cbmNvbnN0IHsgRU5BQkxFX0NTUCA9IHRydWUsIEVOQUJMRV9OT05DRSA9IHRydWUgfSA9IHByb2Nlc3MuZW52XG5cbmNvbnN0IG1pZGRsZXdhcmVzID0gKGFwcDogQXBwbGljYXRpb24pID0+IHtcblx0Ly8gQ09SUyBmb3IgY3Jvc3NzLXRlIGFjY2Vzc1xuXHRhcHAudXNlKGNvcnMoKSlcblxuXHQvLyBqc29uIGVuY29kaW5nIGFuZCBkZWNvZGluZ1xuXHRhcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSlcblx0YXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSlcblxuXHQvLyBzZXQgR1ppcCBvbiBoZWFkZXJzIGZvciByZXF1ZXN0L3Jlc3BvbnNlXG5cdGFwcC51c2UoY29tcHJlc3Npb24oKSlcblxuXHRhcHAudXNlKGNzcmYpXG5cdGFwcC51c2UoZXJyb3JIYW5kbGVyKVxuXHRzZWN1cml0eShhcHAsIHsgZW5hYmxlQ1NQOiBCb29sZWFuKEVOQUJMRV9DU1ApLCBlbmFibGVOb25jZTogQm9vbGVhbihFTkFCTEVfTk9OQ0UpIH0pXG5cblx0Ly8gYnVzc3kgc2VydmVyICh3YWl0IGZvciBpdCB0byByZXNvbHZlKVxuXHRhcHAudXNlKHRvb2J1c3koKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWlkZGxld2FyZXNcbiIsImltcG9ydCAqIGFzIGhwcCBmcm9tICdocHAnXG5cbmltcG9ydCB7IEFwcGxpY2F0aW9uLCBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IGNvbnRlbnRTZWN1cml0eVBvbGljeSwgZnJhbWVndWFyZCwgaHN0cywgaWVOb09wZW4sIG5vU25pZmYsIHhzc0ZpbHRlciB9IGZyb20gJ2hlbG1ldCdcblxuaW1wb3J0IGV4cHJlc3NFbmZvcmNlc1NzbCBmcm9tICdleHByZXNzLWVuZm9yY2VzLXNzbCdcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQnXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBzZWN1cml0eSA9IChhcHA6IEFwcGxpY2F0aW9uLCB7IGVuYWJsZU5vbmNlLCBlbmFibGVDU1AgfTogeyBlbmFibGVOb25jZTogYm9vbGVhbjsgZW5hYmxlQ1NQOiBib29sZWFuIH0pID0+IHtcblx0Ly8gc2V0IHRydXN0ZWQgaXBcblx0YXBwLnNldCgndHJ1c3QgcHJveHknLCB0cnVlKVxuXG5cdC8vIGRvIG5vdCBzaG93IHBvd2VyZWQgYnkgZXhwcmVzc1xuXHRhcHAuc2V0KCd4LXBvd2VyZWQtYnknLCBmYWxzZSlcblxuXHQvLyBzZWN1cml0eSBoZWxtZXQgcGFja2FnZVxuXHQvLyBEb24ndCBleHBvc2UgYW55IHNvZnR3YXJlIGluZm9ybWF0aW9uIHRvIGhhY2tlcnMuXG5cdGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxuXG5cdC8vIEV4cHJlc3MgbWlkZGxld2FyZSB0byBwcm90ZWN0IGFnYWluc3QgSFRUUCBQYXJhbWV0ZXIgUG9sbHV0aW9uIGF0dGFja3Ncblx0YXBwLnVzZShocHAoKSlcblxuXHRpZiAoaXNQcm9kdWN0aW9uKSB7XG5cdFx0YXBwLnVzZShcblx0XHRcdGhzdHMoe1xuXHRcdFx0XHQvLyA1IG1pbnMgaW4gc2Vjb25kc1xuXHRcdFx0XHQvLyB3ZSB3aWxsIHNjYWxlIHRoaXMgdXAgaW5jcmVtZW50YWxseSB0byBlbnN1cmUgd2UgZG9udCBicmVhayB0aGVcblx0XHRcdFx0Ly8gYXBwIGZvciBlbmQgdXNlcnNcblx0XHRcdFx0Ly8gc2VlIGRlcGxveW1lbnQgcmVjb21tZW5kYXRpb25zIGhlcmUgaHR0cHM6Ly9oc3RzcHJlbG9hZC5vcmcvP2RvbWFpbj1zcGVjdHJ1bS5jaGF0XG5cdFx0XHRcdG1heEFnZTogMzAwLFxuXHRcdFx0XHRpbmNsdWRlU3ViRG9tYWluczogdHJ1ZSxcblx0XHRcdFx0cHJlbG9hZDogdHJ1ZVxuXHRcdFx0fSlcblx0XHQpXG5cblx0XHRhcHAudXNlKGV4cHJlc3NFbmZvcmNlc1NzbCgpKVxuXHR9XG5cblx0Ly8gVGhlIFgtRnJhbWUtT3B0aW9ucyBoZWFkZXIgdGVsbHMgYnJvd3NlcnMgdG8gcHJldmVudCB5b3VyIHdlYnBhZ2UgZnJvbSBiZWluZyBwdXQgaW4gYW4gaWZyYW1lLlxuXHRhcHAudXNlKGZyYW1lZ3VhcmQoeyBhY3Rpb246ICdzYW1lb3JpZ2luJyB9KSlcblxuXHQvLyBDcm9zcy1zaXRlIHNjcmlwdGluZywgYWJicmV2aWF0ZWQgdG8g4oCcWFNT4oCdLCBpcyBhIHdheSBhdHRhY2tlcnMgY2FuIHRha2Ugb3ZlciB3ZWJwYWdlcy5cblx0YXBwLnVzZSh4c3NGaWx0ZXIoKSlcblxuXHQvLyBTZXRzIHRoZSBYLURvd25sb2FkLU9wdGlvbnMgdG8gcHJldmVudCBJbnRlcm5ldCBFeHBsb3JlciBmcm9tIGV4ZWN1dGluZ1xuXHQvLyBkb3dubG9hZHMgaW4geW91ciBzaXRl4oCZcyBjb250ZXh0LlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvaWVub29wZW4vXG5cdGFwcC51c2UoaWVOb09wZW4oKSlcblxuXHQvLyBEb27igJl0IFNuaWZmIE1pbWV0eXBlIG1pZGRsZXdhcmUsIG5vU25pZmYsIGhlbHBzIHByZXZlbnQgYnJvd3NlcnMgZnJvbSB0cnlpbmdcblx0Ly8gdG8gZ3Vlc3MgKOKAnHNuaWZm4oCdKSB0aGUgTUlNRSB0eXBlLCB3aGljaCBjYW4gaGF2ZSBzZWN1cml0eSBpbXBsaWNhdGlvbnMuIEl0XG5cdC8vIGRvZXMgdGhpcyBieSBzZXR0aW5nIHRoZSBYLUNvbnRlbnQtVHlwZS1PcHRpb25zIGhlYWRlciB0byBub3NuaWZmLlxuXHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvZG9udC1zbmlmZi1taW1ldHlwZS9cblx0YXBwLnVzZShub1NuaWZmKCkpXG5cblx0aWYgKGVuYWJsZU5vbmNlKSB7XG5cdFx0Ly8gQXR0YWNoIGEgdW5pcXVlIFwibm9uY2VcIiB0byBldmVyeSByZXNwb25zZS4gVGhpcyBhbGxvd3MgdXNlIHRvIGRlY2xhcmVcblx0XHQvLyBpbmxpbmUgc2NyaXB0cyBhcyBiZWluZyBzYWZlIGZvciBleGVjdXRpb24gYWdhaW5zdCBvdXIgY29udGVudCBzZWN1cml0eSBwb2xpY3kuXG5cdFx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2NzcC9cblx0XHRhcHAudXNlKChyZXF1ZXN0OiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRcdFx0cmVzcG9uc2UubG9jYWxzLm5vbmNlID0gdXVpZC52NCgpXG5cdFx0XHRuZXh0KClcblx0XHR9KVxuXHR9XG5cblx0Ly8gQ29udGVudCBTZWN1cml0eSBQb2xpY3kgKENTUClcblx0Ly8gSXQgY2FuIGJlIGEgcGFpbiB0byBtYW5hZ2UgdGhlc2UsIGJ1dCBpdCdzIGEgcmVhbGx5IGdyZWF0IGhhYml0IHRvIGdldCBpbiB0by5cblx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2NzcC9cblx0Y29uc3QgY3NwQ29uZmlnID0ge1xuXHRcdGRpcmVjdGl2ZXM6IHtcblx0XHRcdC8vIFRoZSBkZWZhdWx0LXNyYyBpcyB0aGUgZGVmYXVsdCBwb2xpY3kgZm9yIGxvYWRpbmcgY29udGVudCBzdWNoIGFzXG5cdFx0XHQvLyBKYXZhU2NyaXB0LCBJbWFnZXMsIENTUywgRm9udHMsIEFKQVggcmVxdWVzdHMsIEZyYW1lcywgSFRNTDUgTWVkaWEuXG5cdFx0XHQvLyBBcyB5b3UgbWlnaHQgc3VzcGVjdCwgaXMgdXNlZCBhcyBmYWxsYmFjayBmb3IgdW5zcGVjaWZpZWQgZGlyZWN0aXZlcy5cblx0XHRcdGRlZmF1bHRTcmM6IFtcIidzZWxmJ1wiXSxcblxuXHRcdFx0Ly8gRGVmaW5lcyB2YWxpZCBzb3VyY2VzIG9mIEphdmFTY3JpcHQuXG5cdFx0XHRzY3JpcHRTcmM6IFtcblx0XHRcdFx0XCInc2VsZidcIixcblx0XHRcdFx0XCIndW5zYWZlLWV2YWwnXCIsXG5cdFx0XHRcdCd3d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20nLFxuXHRcdFx0XHQnY2RuLnJhdmVuanMuY29tJyxcblx0XHRcdFx0J2Nkbi5wb2x5ZmlsbC5pbycsXG5cdFx0XHRcdCdjZG4uYW1wbGl0dWRlLmNvbScsXG5cblx0XHRcdFx0Ly8gTm90ZTogV2Ugd2lsbCBleGVjdXRpb24gb2YgYW55IGlubGluZSBzY3JpcHRzIHRoYXQgaGF2ZSB0aGUgZm9sbG93aW5nXG5cdFx0XHRcdC8vIG5vbmNlIGlkZW50aWZpZXIgYXR0YWNoZWQgdG8gdGhlbS5cblx0XHRcdFx0Ly8gVGhpcyBpcyB1c2VmdWwgZm9yIGd1YXJkaW5nIHlvdXIgYXBwbGljYXRpb24gd2hpbHN0IGFsbG93aW5nIGFuIGlubGluZVxuXHRcdFx0XHQvLyBzY3JpcHQgdG8gZG8gZGF0YSBzdG9yZSByZWh5ZHJhdGlvbiAocmVkdXgvbW9ieC9hcG9sbG8pIGZvciBleGFtcGxlLlxuXHRcdFx0XHQvLyBAc2VlIGh0dHBzOi8vaGVsbWV0anMuZ2l0aHViLmlvL2RvY3MvY3NwL1xuXHRcdFx0XHQoXzogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlKSA9PiBgJ25vbmNlLSR7cmVzcG9uc2UubG9jYWxzLm5vbmNlfSdgXG5cdFx0XHRdLFxuXG5cdFx0XHQvLyBEZWZpbmVzIHRoZSBvcmlnaW5zIGZyb20gd2hpY2ggaW1hZ2VzIGNhbiBiZSBsb2FkZWQuXG5cdFx0XHQvLyBAbm90ZTogTGVhdmUgb3BlbiB0byBhbGwgaW1hZ2VzLCB0b28gbXVjaCBpbWFnZSBjb21pbmcgZnJvbSBkaWZmZXJlbnQgc2VydmVycy5cblx0XHRcdGltZ1NyYzogWydodHRwczonLCAnaHR0cDonLCBcIidzZWxmJ1wiLCAnZGF0YTonLCAnYmxvYjonXSxcblxuXHRcdFx0Ly8gRGVmaW5lcyB2YWxpZCBzb3VyY2VzIG9mIHN0eWxlc2hlZXRzLlxuXHRcdFx0c3R5bGVTcmM6IFtcIidzZWxmJ1wiLCBcIid1bnNhZmUtaW5saW5lJ1wiXSxcblxuXHRcdFx0Ly8gQXBwbGllcyB0byBYTUxIdHRwUmVxdWVzdCAoQUpBWCksIFdlYlNvY2tldCBvciBFdmVudFNvdXJjZS5cblx0XHRcdC8vIElmIG5vdCBhbGxvd2VkIHRoZSBicm93c2VyIGVtdWxhdGVzIGEgNDAwIEhUVFAgc3RhdHVzIGNvZGUuXG5cdFx0XHRjb25uZWN0U3JjOiBbJ2h0dHBzOicsICd3c3M6J10sXG5cblx0XHRcdC8vIGxpc3RzIHRoZSBVUkxzIGZvciB3b3JrZXJzIGFuZCBlbWJlZGRlZCBmcmFtZSBjb250ZW50cy5cblx0XHRcdC8vIEZvciBleGFtcGxlOiBjaGlsZC1zcmMgaHR0cHM6Ly95b3V0dWJlLmNvbSB3b3VsZCBlbmFibGVcblx0XHRcdC8vIGVtYmVkZGluZyB2aWRlb3MgZnJvbSBZb3VUdWJlIGJ1dCBub3QgZnJvbSBvdGhlciBvcmlnaW5zLlxuXHRcdFx0Ly8gQG5vdGU6IHdlIGFsbG93IHVzZXJzIHRvIGVtYmVkIGFueSBwYWdlIHRoZXkgd2FudC5cblx0XHRcdGNoaWxkU3JjOiBbJ2h0dHBzOicsICdodHRwOiddLFxuXG5cdFx0XHQvLyBhbGxvd3MgY29udHJvbCBvdmVyIEZsYXNoIGFuZCBvdGhlciBwbHVnaW5zLlxuXHRcdFx0b2JqZWN0U3JjOiBbXCInbm9uZSdcIl0sXG5cblx0XHRcdC8vIHJlc3RyaWN0cyB0aGUgb3JpZ2lucyBhbGxvd2VkIHRvIGRlbGl2ZXIgdmlkZW8gYW5kIGF1ZGlvLlxuXHRcdFx0bWVkaWFTcmM6IFtcIidub25lJ1wiXVxuXHRcdH0sXG5cblx0XHQvLyBTZXQgdG8gdHJ1ZSBpZiB5b3Ugb25seSB3YW50IGJyb3dzZXJzIHRvIHJlcG9ydCBlcnJvcnMsIG5vdCBibG9jayB0aGVtLlxuXHRcdHJlcG9ydE9ubHk6IE5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnIHx8IEJvb2xlYW4oRk9SQ0VfREVWKSB8fCBmYWxzZSxcblx0XHQvLyBOZWNlc3NhcnkgYmVjYXVzZSBvZiBaZWl0IENETiB1c2FnZVxuXHRcdGJyb3dzZXJTbmlmZjogZmFsc2Vcblx0fVxuXG5cdGlmIChlbmFibGVDU1ApIHtcblx0XHRhcHAudXNlKGNvbnRlbnRTZWN1cml0eVBvbGljeShjc3BDb25maWcpKVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHNlY3VyaXR5XG4iLCJpbXBvcnQgKiBhcyB0b29idXN5IGZyb20gJ3Rvb2J1c3ktanMnXG5pbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRpZiAoIWlzRGV2ZWxvcG1lbnQgJiYgdG9vYnVzeSgpKSB7XG5cdFx0cmVzLnN0YXR1c0NvZGUgPSA1MDNcblx0XHRyZXMuc2VuZCgnSXQgbG9va2UgbGlrZSB0aGUgc2V2ZXIgaXMgYnVzc3kuIFdhaXQgZmV3IHNlY29uZHMuLi4nKVxuXHR9IGVsc2Uge1xuXHRcdC8vIHF1ZXVlIHVwIHRoZSByZXF1ZXN0IGFuZCB3YWl0IGZvciBpdCB0byBjb21wbGV0ZSBpbiB0ZXN0aW5nIGFuZCBkZXZlbG9wbWVudCBwaGFzZVxuXHRcdG5leHQoKVxuXHR9XG59XG4iLCJpbXBvcnQgeyBTZXJ2ZXIsIGNyZWF0ZVNlcnZlciB9IGZyb20gJ2h0dHAnXG5cbmltcG9ydCBBcHAgZnJvbSAnYXBwLnNlcnZlcidcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBncmFwaHFsU2VydmVyIGZyb20gJ2dyYXBocWwuc2VydmVyJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICdsb2dnZXInXG5pbXBvcnQgeyBub3JtYWxpemVQb3J0IH0gZnJvbSAndXRpbGxpdHkvbm9ybWFsaXplJ1xuXG5jbGFzcyBPb2pvYlNlcnZlciB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cdHB1YmxpYyBzZXJ2ZXI6IFNlcnZlclxuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHR0aGlzLmFwcCA9IGFwcFxuXHRcdGdyYXBocWxTZXJ2ZXIuYXBwbHlNaWRkbGV3YXJlKHtcblx0XHRcdGFwcCxcblx0XHRcdG9uSGVhbHRoQ2hlY2s6ICgpID0+XG5cdFx0XHRcdG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0XHQvLyBSZXBsYWNlIHRoZSBgdHJ1ZWAgaW4gdGhpcyBjb25kaXRpb25hbCB3aXRoIG1vcmUgc3BlY2lmaWMgY2hlY2tzIVxuXHRcdFx0XHRcdGlmIChwYXJzZUludCgnMicpID09PSAyKSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKClcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmVqZWN0KClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0fSlcblx0XHR0aGlzLnNlcnZlciA9IGNyZWF0ZVNlcnZlcihhcHApXG5cdFx0Z3JhcGhxbFNlcnZlci5pbnN0YWxsU3Vic2NyaXB0aW9uSGFuZGxlcnModGhpcy5zZXJ2ZXIpXG5cdH1cblxuXHRzdGFydFN5bmNTZXJ2ZXIgPSBhc3luYyAocG9ydDogc3RyaW5nKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFBPUlQgPSBub3JtYWxpemVQb3J0KHBvcnQpXG5cdFx0XHR0aGlzLnNlcnZlci5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuXHRcdFx0XHRsb2dnZXIuaW5mbyhgc2VydmVyIHJlYWR5IGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtQT1JUfSR7Z3JhcGhxbFNlcnZlci5ncmFwaHFsUGF0aH1gKVxuXHRcdFx0XHRsb2dnZXIuaW5mbyhgU3Vic2NyaXB0aW9ucyByZWFkeSBhdCB3czovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLnN1YnNjcmlwdGlvbnNQYXRofWApXG5cdFx0XHRcdGxvZ2dlci5pbmZvKGBUcnkgeW91ciBoZWFsdGggY2hlY2sgYXQ6IGh0dHA6Ly9sb2NhbGhvc3Q6JHtQT1JUfS8ud2VsbC1rbm93bi9hcG9sbG8vc2VydmVyLWhlYWx0aGApXG5cdFx0XHR9KVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRhd2FpdCB0aGlzLnN0b3BTZXJ2ZXIoKVxuXHRcdH1cblx0fVxuXG5cdHN0b3BTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0cHJvY2Vzcy5vbignU0lHSU5UJywgYXN5bmMgKCkgPT4ge1xuXHRcdFx0bG9nZ2VyLmluZm8oJ0Nsb3Npbmcgb29qb2IgU3luY1NlcnZlciAuLi4nKVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0aGlzLnNlcnZlci5jbG9zZSgpXG5cdFx0XHRcdGxvZ2dlci5pbmZvKCdvb2pvYiBTeW5jU2VydmVyIENsb3NlZCcpXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBDbG9zaW5nIFN5bmNTZXJ2ZXIgU2VydmVyIENvbm5lY3Rpb24nKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdFx0XHRwcm9jZXNzLmtpbGwocHJvY2Vzcy5waWQpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG5leHBvcnQgY29uc3QgeyBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIsIHNlcnZlciwgYXBwIH0gPSBuZXcgT29qb2JTZXJ2ZXIoQXBwKVxuIiwiaW1wb3J0IHsgSmFlZ2VyRXhwb3J0ZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9leHBvcnRlci1qYWVnZXInXG5pbXBvcnQgeyBOb2RlVHJhY2VyUHJvdmlkZXIgfSBmcm9tICdAb3BlbnRlbGVtZXRyeS9ub2RlJ1xuaW1wb3J0IHsgU2ltcGxlU3BhblByb2Nlc3NvciB9IGZyb20gJ0BvcGVudGVsZW1ldHJ5L3RyYWNpbmcnXG5pbXBvcnQgb3BlbnRlbGVtZXRyeSBmcm9tICdAb3BlbnRlbGVtZXRyeS9hcGknXG5cbmNvbnN0IHRyYWNlciA9IChzZXJ2aWNlTmFtZTogc3RyaW5nKSA9PiB7XG5cdGNvbnN0IHByb3ZpZGVyID0gbmV3IE5vZGVUcmFjZXJQcm92aWRlcih7XG5cdFx0cGx1Z2luczoge1xuXHRcdFx0Z3JwYzoge1xuXHRcdFx0XHRlbmFibGVkOiB0cnVlLFxuXHRcdFx0XHRwYXRoOiAnQG9wZW50ZWxlbWV0cnkvcGx1Z2luLWdycGMnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxuXG5cdGNvbnN0IGV4cG9ydGVyID0gbmV3IEphZWdlckV4cG9ydGVyKHtcblx0XHRzZXJ2aWNlTmFtZVxuXHR9KVxuXG5cdHByb3ZpZGVyLmFkZFNwYW5Qcm9jZXNzb3IobmV3IFNpbXBsZVNwYW5Qcm9jZXNzb3IoZXhwb3J0ZXIpKVxuXHRwcm92aWRlci5yZWdpc3RlcigpXG5cblx0cmV0dXJuIG9wZW50ZWxlbWV0cnkudHJhY2UuZ2V0VHJhY2VyKCdzZXJ2aWNlOmdhdGV3YXknKVxufVxuXG5leHBvcnQgZGVmYXVsdCB0cmFjZXJcbiIsImltcG9ydCB7IGNyZWF0ZUNpcGhlciwgY3JlYXRlRGVjaXBoZXIgfSBmcm9tICdjcnlwdG8nXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmNsYXNzIEFwcENyeXB0byB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cdHByaXZhdGUgRU5DUllQVF9BTEdPUklUSE06IHN0cmluZ1xuXHRwcml2YXRlIEVOQ1JZUFRfU0VDUkVUOiBzdHJpbmdcblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0Y29uc3QgeyBFTkNSWVBUX1NFQ1JFVCA9ICdkb2RvZHVja0BOOScsIEVOQ1JZUFRfQUxHT1JJVEhNID0gJ2Flcy0yNTYtY3RyJyB9ID0gcHJvY2Vzcy5lbnZcblxuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0dGhpcy5FTkNSWVBUX0FMR09SSVRITSA9IEVOQ1JZUFRfQUxHT1JJVEhNXG5cdFx0dGhpcy5FTkNSWVBUX1NFQ1JFVCA9IEVOQ1JZUFRfU0VDUkVUXG5cdH1cblxuXHRwdWJsaWMgZW5jcnlwdCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHR0aGlzLmFwcC5sb2dnZXIuaW5mbyhgRW5jcnlwdCBmb3IgJHt0ZXh0fWApXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgY2lwaGVyID0gY3JlYXRlQ2lwaGVyKHRoaXMuRU5DUllQVF9BTEdPUklUSE0sIHRoaXMuRU5DUllQVF9TRUNSRVQpXG5cdFx0XHRsZXQgY3J5cHRlZCA9IGNpcGhlci51cGRhdGUodGV4dCwgJ3V0ZjgnLCAnaGV4Jylcblx0XHRcdGNyeXB0ZWQgKz0gY2lwaGVyLmZpbmFsKCdoZXgnKVxuXG5cdFx0XHRyZXR1cm4gY3J5cHRlZFxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcC5sb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSlcblxuXHRcdFx0cmV0dXJuICcnXG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGRlY3J5cHQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG5cdFx0dGhpcy5hcHAubG9nZ2VyLmluZm8oYERlY3J5cHQgZm9yICR7dGV4dH1gKVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGRlY2lwaGVyID0gY3JlYXRlRGVjaXBoZXIodGhpcy5FTkNSWVBUX0FMR09SSVRITSwgdGhpcy5FTkNSWVBUX1NFQ1JFVClcblx0XHRcdGxldCBkZWMgPSBkZWNpcGhlci51cGRhdGUodGV4dCwgJ2hleCcsICd1dGY4Jylcblx0XHRcdGRlYyArPSBkZWNpcGhlci5maW5hbCgndXRmOCcpXG5cblx0XHRcdHJldHVybiBkZWNcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0dGhpcy5hcHAubG9nZ2VyLmVycm9yKGVycm9yLm1lc3NhZ2UpXG5cblx0XHRcdHJldHVybiAnJ1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBDcnlwdG9cbiIsImltcG9ydCBBcHBDcnlwdG8gZnJvbSAnLi9jcnlwdG8nXG5pbXBvcnQgQXBwU2x1Z2lmeSBmcm9tICcuL3NsdWdpZnknXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgeyBJQXBwVXRpbHMgfSBmcm9tICcuL3V0aWwuaW50ZXJmYWNlJ1xuXG5jbGFzcyBBcHBVdGlscyBpbXBsZW1lbnRzIElBcHBVdGlscyB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cblx0XHQvLyB0aGlzLmFwcC5sb2dnZXIuaW5mbygnSW5pdGlhbGl6ZWQgQXBwVXRpbHMnKVxuXHR9XG5cblx0cHVibGljIGFwcGx5VXRpbHMgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG5cdFx0Y29uc3QgeyBlbmNyeXB0LCBkZWNyeXB0IH0gPSBuZXcgQXBwQ3J5cHRvKHRoaXMuYXBwKVxuXHRcdGNvbnN0IHsgc2x1Z2lmeSB9ID0gbmV3IEFwcFNsdWdpZnkodGhpcy5hcHApXG5cdFx0dGhpcy5hcHAudXRpbGl0eSA9IHtcblx0XHRcdGVuY3J5cHQsXG5cdFx0XHRkZWNyeXB0LFxuXHRcdFx0c2x1Z2lmeVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwVXRpbHNcbiIsImNvbnN0IG5vcm1hbGl6ZVBvcnQgPSAocG9ydFZhbHVlOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuXHRjb25zdCBwb3J0ID0gcGFyc2VJbnQocG9ydFZhbHVlLCAxMClcblxuXHRpZiAoaXNOYU4ocG9ydCkpIHtcblx0XHRyZXR1cm4gODA4MFxuXHR9XG5cblx0aWYgKHBvcnQgPj0gMCkge1xuXHRcdHJldHVybiBwb3J0XG5cdH1cblxuXHRyZXR1cm4gcG9ydFxufVxuXG5leHBvcnQgeyBub3JtYWxpemVQb3J0IH1cbmV4cG9ydCBkZWZhdWx0IG5vcm1hbGl6ZVBvcnRcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY2xhc3MgQXBwU2x1Z2lmeSB7XG5cdHB1YmxpYyBhcHA6IEFwcGxpY2F0aW9uXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdH1cblxuXHRwdWJsaWMgc2x1Z2lmeSA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHQvLyB0aGlzLmFwcC5sb2dnZXIuaW5mbyhgU2x1Z2lmeSBmb3IgJHt0ZXh0fWApXG5cblx0XHRyZXR1cm4gdGV4dFxuXHRcdFx0LnRvTG93ZXJDYXNlKClcblx0XHRcdC5yZXBsYWNlKC9bXlxcdyBdKy9nLCAnJylcblx0XHRcdC5yZXBsYWNlKC8gKy9nLCAnLScpXG5cdH1cbn1cblxuZXhwb3J0IHsgQXBwU2x1Z2lmeSB9XG5leHBvcnQgZGVmYXVsdCBBcHBTbHVnaWZ5XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUvc2VydmljZV9wYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb3BlbnRlbGVtZXRyeS9hcGlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvZXhwb3J0ZXItamFlZ2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBvcGVudGVsZW1ldHJ5L25vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9wZW50ZWxlbWV0cnkvdHJhY2luZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2x1c3RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21wcmVzc2lvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnYvY29uZmlnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JwY1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoZWxtZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaG9zdC12YWxpZGF0aW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhwcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRvb2J1c3ktanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHNsaWJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dWlkXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndpbnN0b25cIik7Il0sInNvdXJjZVJvb3QiOiIifQ==