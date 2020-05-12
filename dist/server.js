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
/******/ 	var hotCurrentHash = "334b97c9108d81f32fd7";
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
    ValidateUsername: (_, { input }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const username = input.username;
        const validateUsernameReq = new service_pb_1.ValidateUsernameRequest();
        if (username) {
            validateUsernameReq.setUsername(username);
        }
        const res = {};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2hvdC9sb2cuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnNlcnZlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Byb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3Jlc29sdmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcHJvZmlsZS9zY2hlbWEvc2NoZW1hLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9yZXNvbHZlci9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2N1cnNvci5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvbWV0YWRhdGEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9wbGFjZS5ncmFwaHFsIiwid2VicGFjazovLy8uL3NyYy9jbGllbnQvcm9vdC9zY2hlbWEvb29qb2Ivc3lzdGVtLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi90aW1lLmdyYXBocWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsaWVudC9yb290L3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCIsIndlYnBhY2s6Ly8vLi9zcmMvZ3JhcGhxbC5zZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9jb3JzLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9jc3JmLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9lcnJvci1oYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvbG9nZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9taWRkbGV3YXJlcy9zZWN1cml0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvdG9vYnVzeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWlkZGxld2FyZXMvd2luc3Rvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb29qb2Iuc2VydmVyLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9jcnlwdG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlsbGl0eS9ub3JtYWxpemUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxsaXR5L3NsdWdpZnkudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL29vam9iLXByb3RvYnVmXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGVcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXBvbGxvLXNlcnZlci1leHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjbHVzdGVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29tcHJlc3Npb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb3JzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZGVidWdcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkb3RlbnYvY29uZmlnXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3MtZW5mb3JjZXMtc3NsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJncnBjXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaGVsbWV0XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaG9zdC12YWxpZGF0aW9uXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHBwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImxvZGFzaFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm1vcmdhblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInRvb2J1c3ktanNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0c2xpYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV0aWxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dWlkXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwid2luc3RvblwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSzs7UUFFTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQSw2QkFBNkI7UUFDN0IsNkJBQTZCO1FBQzdCO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHFCQUFxQixnQkFBZ0I7UUFDckM7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxxQkFBcUIsZ0JBQWdCO1FBQ3JDO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EsS0FBSzs7UUFFTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0Esa0JBQWtCLDhCQUE4QjtRQUNoRDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBLE9BQU87UUFDUDtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0Esb0JBQW9CLDJCQUEyQjtRQUMvQztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsT0FBTztRQUNQO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxtQkFBbUIsY0FBYztRQUNqQztRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLEtBQUs7UUFDckI7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxnQkFBZ0IsWUFBWTtRQUM1QjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGNBQWMsNEJBQTRCO1FBQzFDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTs7UUFFSjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7O1FBRUE7UUFDQTtRQUNBLGVBQWUsNEJBQTRCO1FBQzNDO1FBQ0E7UUFD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QWUsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25CekIsa0Q7Ozs7Ozs7Ozs7O0FDQUEsMEQ7Ozs7Ozs7Ozs7O0FDQUEscUU7Ozs7Ozs7Ozs7O0FDQUEsa0Q7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsd0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7O0FDQUEsb0M7Ozs7Ozs7Ozs7O0FDQUEsaUQ7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsNEM7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsdUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsb0MiLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0dmFyIGNodW5rID0gcmVxdWlyZShcIi4vXCIgKyBcIi5ob3QvXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIik7XG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rLmlkLCBjaHVuay5tb2R1bGVzKTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkge1xuIFx0XHR0cnkge1xuIFx0XHRcdHZhciB1cGRhdGUgPSByZXF1aXJlKFwiLi9cIiArIFwiLmhvdC9cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCIpO1xuIFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuIFx0XHR9XG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUodXBkYXRlKTtcbiBcdH1cblxuIFx0Ly9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIzMzRiOTdjOTEwOGQ4MWYzMmZkN1wiO1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7XG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkge1xuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0aWYgKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiBcdFx0XHRpZiAobWUuaG90LmFjdGl2ZSkge1xuIFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcbiBcdFx0XHRcdFx0aWYgKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA9PT0gLTEpIHtcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpID09PSAtMSkge1xuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXG4gXHRcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICtcbiBcdFx0XHRcdFx0XHRyZXF1ZXN0ICtcbiBcdFx0XHRcdFx0XHRcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgK1xuIFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHQpO1xuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcbiBcdFx0XHR9XG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XG4gXHRcdH07XG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcbiBcdFx0XHRcdH0sXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcbiBcdFx0XHRcdH1cbiBcdFx0XHR9O1xuIFx0XHR9O1xuIFx0XHRmb3IgKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiZcbiBcdFx0XHRcdG5hbWUgIT09IFwiZVwiICYmXG4gXHRcdFx0XHRuYW1lICE9PSBcInRcIlxuIFx0XHRcdCkge1xuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInJlYWR5XCIpIGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XG4gXHRcdFx0XHR0aHJvdyBlcnI7XG4gXHRcdFx0fSk7XG5cbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XG4gXHRcdFx0XHRpZiAoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xuIFx0XHRcdFx0XHRpZiAoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fTtcbiBcdFx0Zm4udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdFx0aWYgKG1vZGUgJiAxKSB2YWx1ZSA9IGZuKHZhbHVlKTtcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy50KHZhbHVlLCBtb2RlICYgfjEpO1xuIFx0XHR9O1xuIFx0XHRyZXR1cm4gZm47XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBob3QgPSB7XG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcblxuIFx0XHRcdC8vIE1vZHVsZSBBUElcbiBcdFx0XHRhY3RpdmU6IHRydWUsXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIikgaG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxuIFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdFx0ZWxzZSBob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuIFx0XHRcdH0sXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XG4gXHRcdFx0XHRpZiAoZGVwID09PSB1bmRlZmluZWQpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHtcbiBcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcbiBcdFx0fVxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcbiBcdFx0XHRpZiAoIXVwZGF0ZSkge1xuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0XHRcdHJldHVybiBudWxsO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xuXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XG4gXHRcdFx0XHR9O1xuIFx0XHRcdH0pO1xuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xuIFx0XHRcdHZhciBjaHVua0lkID0gXCJtYWluXCI7XG4gXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0e1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5tYXAoZnVuY3Rpb24oaWQpIHtcbiBcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxuIFx0XHRcdFx0XHRpZDogaWRcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKSBjb250aW51ZTtcbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXG4gXHRcdFx0XHRcdH07XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobW9kdWxlLmhvdC5fbWFpbikge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcbiBcdFx0XHRcdFx0aWYgKCFwYXJlbnQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmIChvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0aWYgKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xuIFx0XHRcdFx0XHRcdGlmICghb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXG4gXHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cblxuIFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xuIFx0XHRcdH07XG4gXHRcdH1cblxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XG4gXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XG4gXHRcdFx0XHRpZiAoYS5pbmRleE9mKGl0ZW0pID09PSAtMSkgYS5wdXNoKGl0ZW0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcblxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xuIFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiXG4gXHRcdFx0KTtcbiBcdFx0fTtcblxuIFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xuIFx0XHRcdFx0LyoqIEB0eXBlIHtUT0RPfSAqL1xuIFx0XHRcdFx0dmFyIHJlc3VsdDtcbiBcdFx0XHRcdGlmIChob3RVcGRhdGVbaWRdKSB7XG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xuIFx0XHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdC8qKiBAdHlwZSB7RXJyb3J8ZmFsc2V9ICovXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xuIFx0XHRcdFx0aWYgKHJlc3VsdC5jaGFpbikge1xuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRzd2l0Y2ggKHJlc3VsdC50eXBlKSB7XG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArXG4gXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm1vZHVsZUlkICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGVjbGluZWQpIG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdFwiIGluIFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQucGFyZW50SWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vblVuYWNjZXB0ZWQpIG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm9cbiBcdFx0XHRcdFx0XHRcdCk7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uQWNjZXB0ZWQpIG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRpc3Bvc2VkKSBvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRkZWZhdWx0OlxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoYWJvcnRFcnJvcikge1xuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvQXBwbHkpIHtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xuIFx0XHRcdFx0XHRmb3IgKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdFx0XHRcdGlmIChcbiBcdFx0XHRcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLFxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZFxuIFx0XHRcdFx0XHRcdFx0KVxuIFx0XHRcdFx0XHRcdCkge1xuIFx0XHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQoXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSxcbiBcdFx0XHRcdFx0XHRcdFx0cmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXVxuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChkb0Rpc3Bvc2UpIHtcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHRmb3IgKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiZcbiBcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkICYmXG4gXHRcdFx0XHQvLyByZW1vdmVkIHNlbGYtYWNjZXB0ZWQgbW9kdWxlcyBzaG91bGQgbm90IGJlIHJlcXVpcmVkXG4gXHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSAhPT0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xuIFx0XHRcdH1cbiBcdFx0fSk7XG5cbiBcdFx0dmFyIGlkeDtcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XG4gXHRcdHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRpZiAoIW1vZHVsZSkgY29udGludWU7XG5cbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xuXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcbiBcdFx0XHRmb3IgKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcbiBcdFx0XHRcdGNiKGRhdGEpO1xuIFx0XHRcdH1cbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xuXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xuXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcbiBcdFx0XHRcdGlmICghY2hpbGQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcbiBcdFx0XHRcdGlmIChpZHggPj0gMCkge1xuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XG4gXHRcdGZvciAobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKVxuIFx0XHRcdCkge1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAobW9kdWxlKSB7XG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XG4gXHRcdFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBOb3cgaW4gXCJhcHBseVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xuXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcblxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XG4gXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XG4gXHRcdFx0XHRcdFx0aWYgKGNiKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoY2FsbGJhY2tzLmluZGV4T2YoY2IpICE9PSAtMSkgY29udGludWU7XG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcbiBcdFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xuIFx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuIFx0XHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcbiBcdFx0XHR0cnkge1xuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRpZiAodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiBcdFx0XHRcdFx0dHJ5IHtcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlcnIyKSB7XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25FcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXG4gXHRcdFx0XHRcdFx0XHRcdG9yaWdpbmFsRXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGVycjI7XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcbiBcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcbiBcdFx0aWYgKGVycm9yKSB7XG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuIFx0XHR9XG5cbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH0pO1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdHJldHVybiByZW5ld2VkTW9kdWxlcyAmJiByZW5ld2VkTW9kdWxlcy5pbmRleE9mKG1vZHVsZUlkKSA8IDA7XG5cdH0pO1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXG5cdGlmICh1bmFjY2VwdGVkTW9kdWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0bG9nKFxuXHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcIltITVJdIFRoZSBmb2xsb3dpbmcgbW9kdWxlcyBjb3VsZG4ndCBiZSBob3QgdXBkYXRlZDogKFRoZXkgd291bGQgbmVlZCBhIGZ1bGwgcmVsb2FkISlcIlxuXHRcdCk7XG5cdFx0dW5hY2NlcHRlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdH0pO1xuXHR9XG5cblx0aWYgKCFyZW5ld2VkTW9kdWxlcyB8fCByZW5ld2VkTW9kdWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gTm90aGluZyBob3QgdXBkYXRlZC5cIik7XG5cdH0gZWxzZSB7XG5cdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZWQgbW9kdWxlczpcIik7XG5cdFx0cmVuZXdlZE1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24obW9kdWxlSWQpIHtcblx0XHRcdHJldHVybiB0eXBlb2YgbW9kdWxlSWQgPT09IFwibnVtYmVyXCI7XG5cdFx0fSk7XG5cdFx0aWYgKG51bWJlcklkcylcblx0XHRcdGxvZyhcblx0XHRcdFx0XCJpbmZvXCIsXG5cdFx0XHRcdFwiW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIE5hbWVkTW9kdWxlc1BsdWdpbiBmb3IgbW9kdWxlIG5hbWVzLlwiXG5cdFx0XHQpO1xuXHR9XG59O1xuIiwidmFyIGxvZ0xldmVsID0gXCJpbmZvXCI7XG5cbmZ1bmN0aW9uIGR1bW15KCkge31cblxuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cbnZhciBncm91cCA9IGNvbnNvbGUuZ3JvdXAgfHwgZHVtbXk7XG52YXIgZ3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIHx8IGR1bW15O1xudmFyIGdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZCB8fCBkdW1teTtcbi8qIGVzbGludC1lbmFibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcblx0bG9nTGV2ZWwgPSBsZXZlbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdHZhciBtZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cdHZhciBzdGFjayA9IGVyci5zdGFjaztcblx0aWYgKCFzdGFjaykge1xuXHRcdHJldHVybiBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPCAwKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2UgKyBcIlxcblwiICsgc3RhY2s7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0YWNrO1xuXHR9XG59O1xuIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8qZ2xvYmFscyBfX3Jlc291cmNlUXVlcnkgKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdHZhciBob3RQb2xsSW50ZXJ2YWwgPSArX19yZXNvdXJjZVF1ZXJ5LnN1YnN0cigxKSB8fCAxMCAqIDYwICogMTAwMDtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHR2YXIgY2hlY2tGb3JVcGRhdGUgPSBmdW5jdGlvbiBjaGVja0ZvclVwZGF0ZShmcm9tVXBkYXRlKSB7XG5cdFx0aWYgKG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRtb2R1bGUuaG90XG5cdFx0XHRcdC5jaGVjayh0cnVlKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbih1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRcdGlmICghdXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRcdGlmIChmcm9tVXBkYXRlKSBsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlIGFwcGxpZWQuXCIpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cdFx0XHRcdFx0Y2hlY2tGb3JVcGRhdGUodHJ1ZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0XHR2YXIgc3RhdHVzID0gbW9kdWxlLmhvdC5zdGF0dXMoKTtcblx0XHRcdFx0XHRpZiAoW1wiYWJvcnRcIiwgXCJmYWlsXCJdLmluZGV4T2Yoc3RhdHVzKSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS5cIik7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gWW91IG5lZWQgdG8gcmVzdGFydCB0aGUgYXBwbGljYXRpb24hXCIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cdHNldEludGVydmFsKGNoZWNrRm9yVXBkYXRlLCBob3RQb2xsSW50ZXJ2YWwpO1xufSBlbHNlIHtcblx0dGhyb3cgbmV3IEVycm9yKFwiW0hNUl0gSG90IE1vZHVsZSBSZXBsYWNlbWVudCBpcyBkaXNhYmxlZC5cIik7XG59XG4iLCJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmltcG9ydCBBcHBVdGlscyBmcm9tICd1dGlsbGl0eSdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBtaWRkbGV3YWVzIGZyb20gJ21pZGRsZXdhcmVzJ1xuXG5jbGFzcyBBcHAge1xuXHRwdWJsaWMgYXBwOiBBcHBsaWNhdGlvblxuXHRwdWJsaWMgYXBwVXRpbHM6IEFwcFV0aWxzXG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5hcHAgPSBleHByZXNzKClcblxuXHRcdHRoaXMuYXBwVXRpbHMgPSBuZXcgQXBwVXRpbHModGhpcy5hcHApXG5cdFx0dGhpcy5hcHBseVNlcnZlcigpXG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGJvb3RzdHJhcCgpOiBBcHAge1xuXHRcdHJldHVybiBuZXcgQXBwKClcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0YXdhaXQgdGhpcy5hcHBVdGlscy5hcHBseVV0aWxzKClcblx0XHRhd2FpdCB0aGlzLmFwcGx5TWlkZGxld2FyZSgpXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5TWlkZGxld2FyZSA9IGFzeW5jICgpID0+IHtcblx0XHRtaWRkbGV3YWVzKHRoaXMuYXBwKVxuXHR9XG59XG5cbmV4cG9ydCBjb25zdCBhcHBsaWNhdGlvbiA9IG5ldyBBcHAoKVxuZXhwb3J0IGRlZmF1bHQgYXBwbGljYXRpb24uYXBwXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwidHlwZSBDb21wYW55IGltcGxlbWVudHMgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgbmFtZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBjcmVhdGVkQnk6IElEXFxuICB1cmw6IFN0cmluZ1xcbiAgbG9nbzogU3RyaW5nXFxuICBsb2NhdGlvbjogU3RyaW5nXFxuICBmb3VuZGVkX3llYXI6IFN0cmluZ1xcbiAgbm9PZkVtcGxveWVlczogUmFuZ2VcXG4gIGxhc3RBY3RpdmU6IFRpbWVzdGFtcFxcbiAgaGlyaW5nU3RhdHVzOiBCb29sZWFuXFxuICBza2lsbHM6IFtTdHJpbmddXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG5pbnB1dCBDb21wYW55SW5wdXQge1xcbiAgY3JlYXRlZEJ5OiBJRCFcXG4gIG5hbWU6IFN0cmluZyFcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmchXFxuICB1cmw6IFN0cmluZ1xcbiAgbG9nbzogU3RyaW5nXFxuICBsb2NhdGlvbjogU3RyaW5nXFxuICBmb3VuZGVkWWVhcjogU3RyaW5nXFxuICBub09mRW1wbG95ZWVzOiBSYW5nZUlucHV0XFxuICBoaXJpbmdTdGF0dXM6IEJvb2xlYW5cXG4gIHNraWxsczogW1N0cmluZ11cXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBDdXJyZW50U3RhdHVzIHtcXG4gIEFDVElWRVxcbiAgSE9MRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG5lbnVtIEpvYlR5cGUge1xcbiAgREVGQVVMVFxcbiAgRkVBVFVSRURcXG4gIFBSRU1JVU1cXG59XFxuXFxudHlwZSBTYWxsYXJ5IHtcXG4gIHZhbHVlOiBGbG9hdCFcXG4gIGN1cnJlbmN5OiBTdHJpbmchXFxufVxcblxcbnR5cGUgSm9iIGltcGxlbWVudHMgSU5vZGUge1xcbiAgaWQ6IElEIVxcbiAgbmFtZTogU3RyaW5nIVxcbiAgdHlwZTogSm9iVHlwZSFcXG4gIGNhdGVnb3J5OiBbU3RyaW5nIV0hXFxuICBkZXNjOiBTdHJpbmchXFxuICBza2lsbHNSZXF1aXJlZDogW1N0cmluZyFdIVxcbiAgc2FsbGFyeTogUmFuZ2VcXG4gIGxvY2F0aW9uOiBTdHJpbmchXFxuICBhdHRhY2htZW50OiBbQXR0YWNobWVudF1cXG4gIHN0YXR1czogQ3VycmVudFN0YXR1c1xcbiAgdmlld3M6IEludFxcbiAgdXNlcnNBcHBsaWVkOiBbU3RyaW5nIV1cXG4gIGNyZWF0ZWRCeTogU3RyaW5nXFxuICBjb21wYW55OiBTdHJpbmchXFxuICBjcmVhdGVkQXQ6IFRpbWVzdGFtcCFcXG4gIHVwZGF0ZWRBdDogVGltZXN0YW1wIVxcbn1cXG5cXG50eXBlIEpvYlJlc3VsdEN1cnNvciB7XFxuICBlZGdlczogRWRnZSFcXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcXG4gIHRvdGFsQ291bnQ6IEludCFcXG59XFxuXFxuaW5wdXQgU2FsbGFyeUlucHV0IHtcXG4gIHZhbHVlOiBGbG9hdCFcXG4gIGN1cnJlbmN5OiBTdHJpbmchXFxufVxcblxcbmlucHV0IENyZWF0ZUpvYklucHV0IHtcXG4gIG5hbWU6IFN0cmluZyFcXG4gIHR5cGU6IEpvYlR5cGUhXFxuICBjYXRlZ29yeTogW1N0cmluZyFdIVxcbiAgZGVzYzogU3RyaW5nIVxcbiAgc2tpbGxzX3JlcXVpcmVkOiBbU3RyaW5nIV0hXFxuICBzYWxsYXJ5OiBSYW5nZUlucHV0IVxcbiAgc2FsbGFyeV9tYXg6IFNhbGxhcnlJbnB1dCFcXG4gIGF0dGFjaG1lbnQ6IFtBdHRhY2htZW50SW5wdXRdXFxuICBsb2NhdGlvbjogU3RyaW5nIVxcbiAgc3RhdHVzOiBDdXJyZW50U3RhdHVzIVxcbiAgY29tcGFueTogU3RyaW5nIVxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGdycGMgZnJvbSAnZ3JwYydcblxuaW1wb3J0IHsgUHJvZmlsZVNlcnZpY2VDbGllbnQgfSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZSdcblxuY29uc3QgeyBBQ0NPVU5UX1NFUlZJQ0VfVVJJID0gJ2xvY2FsaG9zdDozMDAwJyB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHByb2ZpbGVDbGllbnQgPSBuZXcgUHJvZmlsZVNlcnZpY2VDbGllbnQoQUNDT1VOVF9TRVJWSUNFX1VSSSwgZ3JwYy5jcmVkZW50aWFscy5jcmVhdGVJbnNlY3VyZSgpKVxuXG5leHBvcnQgZGVmYXVsdCBwcm9maWxlQ2xpZW50XG4iLCJpbXBvcnQgeyBEZWZhdWx0UmVzcG9uc2UsIEVtYWlsLCBJZCwgSWRlbnRpZmllciB9IGZyb20gJ0Bvb2pvYi9vb2pvYi1wcm90b2J1ZidcbmltcG9ydCB7XG5cdERlZmF1bHRSZXNwb25zZSBhcyBEZWZhdWx0UmVzcG9uc2VTY2hlbWEsXG5cdElkIGFzIElkU2NoZW1hLFxuXHRNdXRhdGlvblJlc29sdmVycyxcblx0UXVlcnlSZXNvbHZlcnNcbn0gZnJvbSAnZ2VuZXJhdGVkL2dyYXBocWwnXG5pbXBvcnQge1xuXHRQcm9maWxlLFxuXHRQcm9maWxlU2VjdXJpdHksXG5cdFZhbGlkYXRlRW1haWxSZXF1ZXN0LFxuXHRWYWxpZGF0ZVVzZXJuYW1lUmVxdWVzdFxufSBmcm9tICdAb29qb2IvcHJvdG9yZXBvLXByb2ZpbGUtbm9kZS9zZXJ2aWNlX3BiJ1xuaW1wb3J0IHsgY3JlYXRlUHJvZmlsZSwgdmFsaWRhdGVFbWFpbCwgdmFsaWRhdGVVc2VybmFtZSB9IGZyb20gJ2NsaWVudC9wcm9maWxlL3RyYW5zZm9ybWVyJ1xuXG5leHBvcnQgY29uc3QgUXVlcnk6IFF1ZXJ5UmVzb2x2ZXJzID0ge1xuXHRWYWxpZGF0ZVVzZXJuYW1lOiBhc3luYyAoXywgeyBpbnB1dCB9KSA9PiB7XG5cdFx0Y29uc3QgdXNlcm5hbWUgPSBpbnB1dC51c2VybmFtZVxuXHRcdGNvbnN0IHZhbGlkYXRlVXNlcm5hbWVSZXEgPSBuZXcgVmFsaWRhdGVVc2VybmFtZVJlcXVlc3QoKVxuXHRcdGlmICh1c2VybmFtZSkge1xuXHRcdFx0dmFsaWRhdGVVc2VybmFtZVJlcS5zZXRVc2VybmFtZSh1c2VybmFtZSlcblx0XHR9XG5cblx0XHRjb25zdCByZXM6IERlZmF1bHRSZXNwb25zZVNjaGVtYSA9IHt9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHZhbGlkYXRlUmVzID0gKGF3YWl0IHZhbGlkYXRlVXNlcm5hbWUodmFsaWRhdGVVc2VybmFtZVJlcSkpIGFzIERlZmF1bHRSZXNwb25zZVxuXHRcdFx0cmVzLnN0YXR1cyA9IHZhbGlkYXRlUmVzLmdldFN0YXR1cygpXG5cdFx0XHRyZXMuY29kZSA9IHZhbGlkYXRlUmVzLmdldENvZGUoKVxuXHRcdFx0cmVzLmVycm9yID0gdmFsaWRhdGVSZXMuZ2V0RXJyb3IoKVxuXHRcdH0gY2F0Y2ggKHsgbWVzc2FnZSwgY29kZSB9KSB7XG5cdFx0XHRyZXMuc3RhdHVzID0gZmFsc2Vcblx0XHRcdHJlcy5lcnJvciA9IG1lc3NhZ2Vcblx0XHRcdHJlcy5jb2RlID0gY29kZVxuXHRcdH1cblxuXHRcdHJldHVybiByZXNcblx0fSxcblx0VmFsaWRhdGVFbWFpbDogYXN5bmMgKF8sIHsgaW5wdXQgfSkgPT4ge1xuXHRcdGNvbnN0IGVtYWlsID0gaW5wdXQuZW1haWxcblx0XHRjb25zdCB2YWxpZGF0ZUVtYWlsUmVxID0gbmV3IFZhbGlkYXRlRW1haWxSZXF1ZXN0KClcblx0XHRpZiAoZW1haWwpIHtcblx0XHRcdHZhbGlkYXRlRW1haWxSZXEuc2V0RW1haWwoZW1haWwpXG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzOiBEZWZhdWx0UmVzcG9uc2VTY2hlbWEgPSB7fVxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB2YWxpZGF0ZVJlcyA9IChhd2FpdCB2YWxpZGF0ZUVtYWlsKHZhbGlkYXRlRW1haWxSZXEpKSBhcyBEZWZhdWx0UmVzcG9uc2Vcblx0XHRcdHJlcy5zdGF0dXMgPSB2YWxpZGF0ZVJlcy5nZXRTdGF0dXMoKVxuXHRcdFx0cmVzLmNvZGUgPSB2YWxpZGF0ZVJlcy5nZXRDb2RlKClcblx0XHRcdHJlcy5lcnJvciA9IHZhbGlkYXRlUmVzLmdldEVycm9yKClcblx0XHR9IGNhdGNoICh7IG1lc3NhZ2UsIGNvZGUgfSkge1xuXHRcdFx0cmVzLnN0YXR1cyA9IGZhbHNlXG5cdFx0XHRyZXMuZXJyb3IgPSBtZXNzYWdlXG5cdFx0XHRyZXMuY29kZSA9IGNvZGVcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IE11dGF0aW9uOiBNdXRhdGlvblJlc29sdmVycyA9IHtcblx0Q3JlYXRlUHJvZmlsZTogYXN5bmMgKF8sIHsgaW5wdXQgfSkgPT4ge1xuXHRcdGNvbnN0IG1pZGRsZU5hbWUgPSBpbnB1dC5taWRkbGVOYW1lID8gYCAke2lucHV0Lm1pZGRsZU5hbWUudHJpbSgpfWAgOiAnJ1xuXHRcdGNvbnN0IGZhbWlseU5hbWUgPSBpbnB1dC5mYW1pbHlOYW1lID8gYCAke2lucHV0LmZhbWlseU5hbWUudHJpbSgpfWAgOiAnJ1xuXHRcdGNvbnN0IG5hbWUgPSBgJHtpbnB1dC5naXZlbk5hbWV9JHttaWRkbGVOYW1lfSR7ZmFtaWx5TmFtZX1gXG5cdFx0Y29uc3QgaWRlbnRpZmllciA9IG5ldyBJZGVudGlmaWVyKClcblx0XHRpZGVudGlmaWVyLnNldE5hbWUobmFtZS50cmltKCkpXG5cdFx0Y29uc3QgcHJvZmlsZVNlY3VyaXR5ID0gbmV3IFByb2ZpbGVTZWN1cml0eSgpXG5cdFx0aWYgKGlucHV0LnNlY3VyaXR5Py5wYXNzd29yZCkge1xuXHRcdFx0cHJvZmlsZVNlY3VyaXR5LnNldFBhc3N3b3JkKGlucHV0LnNlY3VyaXR5LnBhc3N3b3JkKVxuXHRcdH1cblx0XHRjb25zdCBlbWFpbCA9IG5ldyBFbWFpbCgpXG5cdFx0aWYgKGlucHV0LmVtYWlsPy5lbWFpbCkge1xuXHRcdFx0ZW1haWwuc2V0RW1haWwoaW5wdXQuZW1haWwuZW1haWwpXG5cdFx0fVxuXHRcdGlmIChpbnB1dC5lbWFpbD8uc2hvdykge1xuXHRcdFx0ZW1haWwuc2V0U2hvdyhpbnB1dC5lbWFpbC5zaG93KVxuXHRcdH1cblx0XHRjb25zdCBwcm9maWxlID0gbmV3IFByb2ZpbGUoKVxuXHRcdGlmIChpbnB1dD8uZ2VuZGVyKSB7XG5cdFx0XHRwcm9maWxlLnNldEdlbmRlcihpbnB1dC5nZW5kZXIpXG5cdFx0fVxuXHRcdGlmIChpbnB1dD8udXNlcm5hbWUpIHtcblx0XHRcdHByb2ZpbGUuc2V0VXNlcm5hbWUoaW5wdXQudXNlcm5hbWUpXG5cdFx0fVxuXHRcdHByb2ZpbGUuc2V0RW1haWwoZW1haWwpXG5cdFx0cHJvZmlsZS5zZXRJZGVudGl0eShpZGVudGlmaWVyKVxuXHRcdHByb2ZpbGUuc2V0U2VjdXJpdHkocHJvZmlsZVNlY3VyaXR5KVxuXHRcdGNvbnN0IHJlcyA9IChhd2FpdCBjcmVhdGVQcm9maWxlKHByb2ZpbGUpKSBhcyBJZFxuXG5cdFx0Y29uc3QgcHJvZmlsZVJlc3BvbnNlOiBJZFNjaGVtYSA9IHtcblx0XHRcdGlkOiByZXMuZ2V0SWQoKVxuXHRcdH1cblxuXHRcdHJldHVybiBwcm9maWxlUmVzcG9uc2Vcblx0fVxufVxuXG5leHBvcnQgY29uc3QgcHJvZmlsZVJlc29sdmVycyA9IHtcblx0TXV0YXRpb24sXG5cdFF1ZXJ5XG59XG5leHBvcnQgZGVmYXVsdCBwcm9maWxlUmVzb2x2ZXJzXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBBY2NvdW50VHlwZSB7XFxuICBCQVNFXFxuICBDT01QQU5ZXFxuICBGVU5ESU5HXFxuICBKT0JcXG59XFxuXFxuZW51bSBHZW5kZXIge1xcbiAgTUFMRVxcbiAgRkVNQUxFXFxuICBPVEhFUlxcbn1cXG5cXG5lbnVtIFByb2ZpbGVPcGVyYXRpb25zIHtcXG4gIENSRUFURVxcbiAgUkVBRFxcbiAgVVBEQVRFXFxuICBERUxFVEVcXG4gIEJVTEtfVVBEQVRFXFxufVxcblxcbmVudW0gT3BlcmF0aW9uRW50aXR5IHtcXG4gIENPTVBBTllcXG4gIEpPQlxcbiAgSU5WRVNUT1JcXG59XFxuXFxudHlwZSBFZHVjYXRpb24ge1xcbiAgZWR1Y2F0aW9uOiBTdHJpbmdcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlU2VjdXJpdHkge1xcbiAgcGFzc3dvcmQ6IFN0cmluZ1xcbiAgcGFzc3dvcmRTYWx0OiBTdHJpbmdcXG4gIHBhc3N3b3JkSGFzaDogU3RyaW5nXFxuICBjb2RlOiBTdHJpbmdcXG4gIGNvZGVUeXBlOiBTdHJpbmdcXG4gIGFjY291bnRUeXBlOiBBY2NvdW50VHlwZVxcbiAgdmVyaWZpZWQ6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBQcm9maWxlIHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVyXFxuICBnaXZlbk5hbWU6IFN0cmluZ1xcbiAgbWlkZGxlTmFtZTogU3RyaW5nXFxuICBmYW1pbHlOYW1lOiBTdHJpbmdcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG4gIGVtYWlsOiBFbWFpbFxcbiAgZ2VuZGVyOiBHZW5kZXJcXG4gIGJpcnRoZGF0ZTogVGltZXN0YW1wXFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25cXG4gIGFkZHJlc3M6IEFkZHJlc3NcXG4gIHNlY3VyaXR5OiBQcm9maWxlU2VjdXJpdHlcXG4gIG1ldGFkYXRhOiBNZXRhZGF0YVxcbn1cXG5cXG5pbnB1dCBFZHVjYXRpb25JbnB1dCB7XFxuICBlZHVjYXRpb246IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBQcm9maWxlU2VjdXJpdHlJbnB1dCB7XFxuICBwYXNzd29yZDogU3RyaW5nXFxuICBhY2NvdW50VHlwZTogQWNjb3VudFR5cGVcXG59XFxuXFxuaW5wdXQgUHJvZmlsZUlucHV0IHtcXG4gIGlkZW50aXR5OiBJZGVudGlmaWVySW5wdXRcXG4gIGdpdmVuTmFtZTogU3RyaW5nXFxuICBtaWRkbGVOYW1lOiBTdHJpbmdcXG4gIGZhbWlseU5hbWU6IFN0cmluZ1xcbiAgdXNlcm5hbWU6IFN0cmluZ1xcbiAgZW1haWw6IEVtYWlsSW5wdXRcXG4gIGdlbmRlcjogR2VuZGVyXFxuICBiaXJ0aGRhdGU6IFRpbWVzdGFtcElucHV0XFxuICBjdXJyZW50UG9zaXRpb246IFN0cmluZ1xcbiAgZWR1Y2F0aW9uOiBFZHVjYXRpb25JbnB1dFxcbiAgYWRkcmVzczogQWRkcmVzc0lucHV0XFxuICBzZWN1cml0eTogUHJvZmlsZVNlY3VyaXR5SW5wdXRcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVVc2VybmFtZUlucHV0IHtcXG4gIHVzZXJuYW1lOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgVmFsaWRhdGVFbWFpbElucHV0IHtcXG4gIGVtYWlsOiBTdHJpbmdcXG59XFxuXFxuZXh0ZW5kIHR5cGUgUXVlcnkge1xcbiAgVmFsaWRhdGVVc2VybmFtZShpbnB1dDogVmFsaWRhdGVVc2VybmFtZUlucHV0ISk6IERlZmF1bHRSZXNwb25zZSFcXG4gIFZhbGlkYXRlRW1haWwoaW5wdXQ6IFZhbGlkYXRlRW1haWxJbnB1dCEpOiBEZWZhdWx0UmVzcG9uc2UhXFxufVxcblxcbmV4dGVuZCB0eXBlIE11dGF0aW9uIHtcXG4gIENyZWF0ZVByb2ZpbGUoaW5wdXQ6IFByb2ZpbGVJbnB1dCEpOiBJZCFcXG59XFxuXCIiLCJpbXBvcnQgcHJvZmlsZUNsaWVudCBmcm9tICdjbGllbnQvcHJvZmlsZSdcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVQcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuY3JlYXRlUHJvZmlsZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IGNvbmZpcm1Qcm9maWxlID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQuY29uZmlybVByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCByZWFkUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnJlYWRQcm9maWxlKS5iaW5kKHByb2ZpbGVDbGllbnQpXG5leHBvcnQgY29uc3QgdXBkYXRlUHJvZmlsZSA9IHByb21pc2lmeShwcm9maWxlQ2xpZW50LnVwZGF0ZVByb2ZpbGUpLmJpbmQocHJvZmlsZUNsaWVudClcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZVVzZXJuYW1lID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQudmFsaWRhdGVVc2VybmFtZSkuYmluZChwcm9maWxlQ2xpZW50KVxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlRW1haWwgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC52YWxpZGF0ZUVtYWlsKS5iaW5kKHByb2ZpbGVDbGllbnQpXG4vLyBleHBvcnQgY29uc3QgY2hlY2sgPSBwcm9taXNpZnkocHJvZmlsZUNsaWVudC5jaGVjaykuYmluZChwcm9maWxlQ2xpZW50KVxuLy8gZXhwb3J0IGNvbnN0IHdhdGNoID0gcHJvbWlzaWZ5KHByb2ZpbGVDbGllbnQud2F0Y2gpLmJpbmQocHJvZmlsZUNsaWVudClcbiIsImltcG9ydCB7IE11dGF0aW9uUmVzb2x2ZXJzLCBRdWVyeVJlc29sdmVycywgUmVzb2x2ZXJzLCBTdWJzY3JpcHRpb25SZXNvbHZlcnMgfSBmcm9tICdnZW5lcmF0ZWQvZ3JhcGhxbCdcblxuY29uc3QgUXVlcnk6IFF1ZXJ5UmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ2RvZG8gZHVjayBsaXZlcyBoZXJlJ1xufVxuY29uc3QgTXV0YXRpb246IE11dGF0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKCkgPT4gJ0RvZG8gRHVjaydcbn1cbmNvbnN0IFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUmVzb2x2ZXJzID0ge1xuXHRkdW1teTogKF8sIF9fLCB7IHB1YnN1YiB9KSA9PiBwdWJzdWIuYXN5bmNJdGVyYXRvcignRE9ET19EVUNLJylcbn1cblxuY29uc3Qgcm9vdFJlc29sdmVyczogUmVzb2x2ZXJzID0ge1xuXHRRdWVyeSxcblx0TXV0YXRpb24sXG5cdFN1YnNjcmlwdGlvbixcblx0UmVzdWx0OiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXG5cdFx0XHRyZXR1cm4gJ0pvYidcblx0XHR9XG5cdH0sXG5cdElOb2RlOiB7XG5cdFx0X19yZXNvbHZlVHlwZTogKG5vZGU6IGFueSkgPT4ge1xuXHRcdFx0aWYgKG5vZGUubm9PZkVtcGxveWVlcykgcmV0dXJuICdDb21wYW55J1xuXHRcdFx0Ly8gaWYgKG5vZGUuc3RhcnMpIHJldHVybiAnUmV2aWV3J1xuXG5cdFx0XHRyZXR1cm4gJ0NvbXBhbnknXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJvb3RSZXNvbHZlcnNcbiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIEFwcGxpY2FudCB7XFxuICBhcHBsaWNhdGlvbnM6IFtTdHJpbmddIVxcbiAgc2hvcnRsaXN0ZWQ6IFtTdHJpbmddIVxcbiAgb25ob2xkOiBbU3RyaW5nXSFcXG4gIHJlamVjdGVkOiBbU3RyaW5nXSFcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBTb3J0IHtcXG4gIEFTQ1xcbiAgREVTQ1xcbn1cXG5cXG50eXBlIFBhZ2luYXRpb24ge1xcbiAgcGFnZTogSW50XFxuICBmaXJzdDogSW50XFxuICBhZnRlcjogU3RyaW5nXFxuICBvZmZzZXQ6IEludFxcbiAgbGltaXQ6IEludFxcbiAgc29ydDogU29ydFxcbiAgcHJldmlvdXM6IFN0cmluZ1xcbiAgbmV4dDogU3RyaW5nXFxuICBpZGVudGlmaWVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgUGFnaW5hdGlvbklucHV0IHtcXG4gIHBhZ2U6IEludFxcbiAgZmlyc3Q6IEludFxcbiAgYWZ0ZXI6IFN0cmluZ1xcbiAgb2Zmc2V0OiBJbnRcXG4gIGxpbWl0OiBJbnRcXG4gIHNvcnQ6IFNvcnRcXG4gIHByZXZpb3VzOiBTdHJpbmdcXG4gIG5leHQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIE1ldGFkYXRhIHtcXG4gIGNyZWF0ZWRfYXQ6IFRpbWVzdGFtcFxcbiAgdXBkYXRlZF9hdDogVGltZXN0YW1wXFxuICBwdWJsaXNoZWRfZGF0ZTogVGltZXN0YW1wXFxuICBlbmRfZGF0ZTogVGltZXN0YW1wXFxuICBsYXN0X2FjdGl2ZTogVGltZXN0YW1wXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcImVudW0gUHJvZmlsZU9wZXJhdGlvbk9wdGlvbnMge1xcbiAgQ1JFQVRFXFxuICBSRUFEXFxuICBVUERBVEVcXG4gIERFTEVURVxcbiAgQlVMS19VUERBVEVcXG59XFxuXFxudHlwZSBNYXBQcm9maWxlUGVybWlzc2lvbiB7XFxuICBrZXk6IFN0cmluZ1xcbiAgcHJvZmlsZU9wZXJhdGlvbnM6IFtQcm9maWxlT3BlcmF0aW9uT3B0aW9uc11cXG59XFxuXFxudHlwZSBQZXJtaXNzaW9uc0Jhc2Uge1xcbiAgcGVybWlzc2lvbnM6IE1hcFByb2ZpbGVQZXJtaXNzaW9uXFxufVxcblwiIiwibW9kdWxlLmV4cG9ydHMgPSBcInR5cGUgUmF0aW5nIHtcXG4gIGF1dGhvcjogU3RyaW5nXFxuICBiZXN0UmF0aW5nOiBJbnRcXG4gIGV4cGxhbmF0aW9uOiBTdHJpbmdcXG4gIHZhbHVlOiBJbnRcXG4gIHdvcnN0UmF0aW5nOiBJbnRcXG59XFxuXFxudHlwZSBBZ2dyZWdhdGVSYXRpbmcge1xcbiAgaXRlbVJldmlld2VkOiBTdHJpbmchXFxuICByYXRpbmdDb3VudDogSW50IVxcbiAgcmV2aWV3Q291bnQ6IEludFxcbn1cXG5cXG50eXBlIFJldmlldyB7XFxuICBpdGVtUmV2aWV3ZWQ6IFN0cmluZ1xcbiAgYXNwZWN0OiBTdHJpbmdcXG4gIGJvZHk6IFN0cmluZ1xcbiAgcmF0aW5nOiBTdHJpbmdcXG59XFxuXFxudHlwZSBHZW9Mb2NhdGlvbiB7XFxuICBlbGV2YXRpb246IEludFxcbiAgbGF0aXR1ZGU6IEludFxcbiAgbG9uZ2l0dWRlOiBJbnRcXG4gIHBvc3RhbENvZGU6IEludFxcbn1cXG5cXG50eXBlIEFkZHJlc3Mge1xcbiAgY291bnRyeTogU3RyaW5nIVxcbiAgbG9jYWxpdHk6IFN0cmluZ1xcbiAgcmVnaW9uOiBTdHJpbmdcXG4gIHBvc3RhbENvZGU6IEludFxcbiAgc3RyZWV0OiBTdHJpbmdcXG59XFxuXFxudHlwZSBQbGFjZSB7XFxuICBhZGRyZXNzOiBBZGRyZXNzXFxuICByZXZpZXc6IFJldmlld1xcbiAgYWdncmVnYXRlUmF0aW5nOiBBZ2dyZWdhdGVSYXRpbmdcXG4gIGJyYW5jaENvZGU6IFN0cmluZ1xcbiAgZ2VvOiBHZW9Mb2NhdGlvblxcbn1cXG5cXG5pbnB1dCBBZGRyZXNzSW5wdXQge1xcbiAgY291bnRyeTogU3RyaW5nXFxuICBsb2NhbGl0eTogU3RyaW5nXFxuICByZWdpb246IFN0cmluZ1xcbiAgcG9zdGFsQ29kZTogSW50XFxuICBzdHJlZXQ6IFN0cmluZ1xcbn1cXG5cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJ0eXBlIFJhbmdlIHtcXG4gIG1pbjogSW50IVxcbiAgbWF4OiBJbnQhXFxufVxcblxcbnR5cGUgRGVmYXVsdFJlc3BvbnNlIHtcXG4gIHN0YXR1czogQm9vbGVhblxcbiAgZXJyb3I6IFN0cmluZ1xcbiAgY29kZTogSW50XFxufVxcblxcbnR5cGUgSWQge1xcbiAgaWQ6IElEIVxcbn1cXG5cXG5lbnVtIEVtYWlsU3RhdHVzIHtcXG4gIFdBSVRJTkdcXG4gIENPTkZJUk1FRFxcbiAgQkxPQ0tFRFxcbiAgRVhQSVJFRFxcbn1cXG5cXG50eXBlIEVtYWlsIHtcXG4gIGVtYWlsOiBTdHJpbmdcXG4gIHN0YXR1czogRW1haWxTdGF0dXNcXG4gIHNob3c6IEJvb2xlYW5cXG59XFxuXFxudHlwZSBBdHRhY2htZW50IHtcXG4gIHR5cGU6IFN0cmluZ1xcbiAgZmlsZTogU3RyaW5nXFxuICB1cGxvYWREYXRlOiBUaW1lc3RhbXBcXG4gIHVybDogU3RyaW5nXFxuICB1c2VyOiBTdHJpbmdcXG4gIGZvbGRlcjogU3RyaW5nXFxufVxcblxcbnR5cGUgSWRlbnRpZmllciB7XFxuICBpZGVudGlmaWVyOiBTdHJpbmchXFxuICBuYW1lOiBTdHJpbmdcXG4gIGFsdGVybmF0ZU5hbWU6IFN0cmluZ1xcbiAgdHlwZTogU3RyaW5nXFxuICBhZGRpdGlvbmFsVHlwZTogU3RyaW5nXFxuICBkZXNjcmlwdGlvbjogU3RyaW5nXFxuICBkaXNhbWJpZ3VhdGluZ0Rlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGhlYWRsaW5lOiBTdHJpbmdcXG4gIHNsb2dhbjogU3RyaW5nXFxufVxcblxcbmlucHV0IFJhbmdlSW5wdXQge1xcbiAgbWluOiBJbnQhXFxuICBtYXg6IEludCFcXG59XFxuXFxuaW5wdXQgSWRJbnB1dCB7XFxuICBpZDogSUQhXFxufVxcblxcbmlucHV0IEVtYWlsSW5wdXQge1xcbiAgZW1haWw6IFN0cmluZ1xcbiAgc2hvdzogQm9vbGVhblxcbn1cXG5cXG5pbnB1dCBBdHRhY2htZW50SW5wdXQge1xcbiAgdHlwZTogU3RyaW5nXFxuICBmaWxlOiBTdHJpbmdcXG4gIHVzZXI6IFN0cmluZ1xcbiAgZm9sZGVyOiBTdHJpbmdcXG59XFxuXFxuaW5wdXQgSWRlbnRpZmllcklucHV0IHtcXG4gIG5hbWU6IFN0cmluZ1xcbiAgYWx0ZXJuYXRlTmFtZTogU3RyaW5nXFxuICB0eXBlOiBTdHJpbmdcXG4gIGFkZGl0aW9uYWxUeXBlOiBTdHJpbmdcXG4gIGRlc2NyaXB0aW9uOiBTdHJpbmdcXG4gIGRpc2FtYmlndWF0aW5nRGVzY3JpcHRpb246IFN0cmluZ1xcbiAgaGVhZGxpbmU6IFN0cmluZ1xcbiAgc2xvZ2FuOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZW51bSBEYXlzT2ZXZWVrIHtcXG4gIE1PTkRBWVxcbiAgVFVFU0RBWVxcbiAgV0VETkVTREFZXFxuICBUSFJVU0RBWVxcbiAgRlJJREFZXFxuICBTVEFVUkRBWVxcbiAgU1VOREFZXFxufVxcblxcbnR5cGUgVGltZXN0YW1wIHtcXG4gIHNlY29uZHM6IFN0cmluZ1xcbiAgbmFub3M6IFN0cmluZ1xcbn1cXG5cXG50eXBlIFRpbWUge1xcbiAgb3BlbnM6IFRpbWVzdGFtcFxcbiAgY2xvc2VzOiBUaW1lc3RhbXBcXG4gIGRheXNPZldlZWs6IERheXNPZldlZWtcXG4gIHZhbGlkRnJvbTogVGltZXN0YW1wXFxuICB2YWxpZFRocm91Z2g6IFRpbWVzdGFtcFxcbn1cXG5cXG5pbnB1dCBUaW1lc3RhbXBJbnB1dCB7XFxuICBzZWNvbmRzOiBTdHJpbmdcXG4gIG5hbm9zOiBTdHJpbmdcXG59XFxuXCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwic2NhbGFyIERhdGVcXG5cXG50eXBlIEVkZ2Uge1xcbiAgY3Vyc29yOiBTdHJpbmchXFxuICBub2RlOiBbUmVzdWx0IV0hXFxufVxcblxcbnR5cGUgUGFnZUluZm8ge1xcbiAgZW5kQ3Vyc29yOiBTdHJpbmchXFxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcXG59XFxuXFxuaW50ZXJmYWNlIElOb2RlIHtcXG4gIGlkOiBJRCFcXG4gIGNyZWF0ZWRBdDogVGltZXN0YW1wIVxcbiAgdXBkYXRlZEF0OiBUaW1lc3RhbXAhXFxufVxcblxcbnVuaW9uIFJlc3VsdCA9IEpvYiB8IENvbXBhbnlcXG5cXG50eXBlIFF1ZXJ5IHtcXG4gIGR1bW15OiBTdHJpbmchXFxufVxcblxcbnR5cGUgTXV0YXRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxudHlwZSBTdWJzY3JpcHRpb24ge1xcbiAgZHVtbXk6IFN0cmluZyFcXG59XFxuXFxuc2NoZW1hIHtcXG4gIHF1ZXJ5OiBRdWVyeVxcbiAgbXV0YXRpb246IE11dGF0aW9uXFxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblxcbn1cXG5cIiIsImltcG9ydCAqIGFzIGFwcGxpY2FudHNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL2FwcGxpY2FudHMuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGNvbXBhbnlTY2hlbWEgZnJvbSAnY2xpZW50L2NvbXBhbnkvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgY3Vyc29yU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9jdXJzb3IuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIGpvYlNjaGVtYSBmcm9tICdjbGllbnQvam9iL3NjaGVtYS9zY2hlbWEuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIG1ldGFkYXRhU2NoZW1hIGZyb20gJ2NsaWVudC9yb290L3NjaGVtYS9vb2pvYi9tZXRhZGF0YS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcGVybWlzc2lvbnNTY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3Blcm1pc3Npb25zLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBwbGFjZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvcGxhY2UuZ3JhcGhxbCdcbmltcG9ydCAqIGFzIHByb2ZpbGVTY2hlbWEgZnJvbSAnY2xpZW50L3Byb2ZpbGUvc2NoZW1hL3NjaGVtYS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgcm9vdFNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvc2NoZW1hLmdyYXBocWwnXG5pbXBvcnQgKiBhcyBzeXN0ZW1TY2hlbWEgZnJvbSAnY2xpZW50L3Jvb3Qvc2NoZW1hL29vam9iL3N5c3RlbS5ncmFwaHFsJ1xuaW1wb3J0ICogYXMgdGltZVNjaGVtYSBmcm9tICdjbGllbnQvcm9vdC9zY2hlbWEvb29qb2IvdGltZS5ncmFwaHFsJ1xuXG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIFB1YlN1YiB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcydcblxuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgcHJvZmlsZVJlc29sdmVycyBmcm9tICdjbGllbnQvcHJvZmlsZS9yZXNvbHZlcidcbmltcG9ydCByb290UmVzb2x2ZXJzIGZyb20gJ2NsaWVudC9yb290L3Jlc29sdmVyJ1xuXG5leHBvcnQgY29uc3QgcHVic3ViID0gbmV3IFB1YlN1YigpXG5leHBvcnQgY29uc3QgdHlwZURlZnMgPSBbXG5cdHJvb3RTY2hlbWEsXG5cdGFwcGxpY2FudHNTY2hlbWEsXG5cdGN1cnNvclNjaGVtYSxcblx0bWV0YWRhdGFTY2hlbWEsXG5cdHBsYWNlU2NoZW1hLFxuXHRzeXN0ZW1TY2hlbWEsXG5cdHBlcm1pc3Npb25zU2NoZW1hLFxuXHR0aW1lU2NoZW1hLFxuXHRwcm9maWxlU2NoZW1hLFxuXHRjb21wYW55U2NoZW1hLFxuXHRqb2JTY2hlbWFcbl1cbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSBtZXJnZSh7fSwgcm9vdFJlc29sdmVycywgcHJvZmlsZVJlc29sdmVycylcblxuY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG5cdHR5cGVEZWZzLFxuXHRyZXNvbHZlcnMsXG5cdGNvbnRleHQ6IGFzeW5jICh7IHJlcSwgY29ubmVjdGlvbiB9KSA9PiAoe1xuXHRcdHJlcSxcblx0XHRjb25uZWN0aW9uLFxuXHRcdHB1YnN1YlxuXHR9KSxcblx0dHJhY2luZzogdHJ1ZVxufSlcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyXG4iLCJpbXBvcnQgJ2RvdGVudi9jb25maWcnXG5cbmltcG9ydCB7IGFwcCwgc2VydmVyLCBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIgfSBmcm9tICdvb2pvYi5zZXJ2ZXInXG5pbXBvcnQgeyBmb3JrLCBpc01hc3Rlciwgb24gfSBmcm9tICdjbHVzdGVyJ1xuXG5kZWNsYXJlIGNvbnN0IG1vZHVsZTogYW55XG5cbmNvbnN0IHN0YXJ0ID0gYXN5bmMgKCkgPT4ge1xuXHRjb25zdCB7IFBPUlQgfSA9IHByb2Nlc3MuZW52XG5cdGNvbnN0IHBvcnQgPSBQT1JUIHx8ICc4MDgwJ1xuXG5cdHRyeSB7XG5cdFx0YXdhaXQgc3RvcFNlcnZlcigpXG5cdFx0YXdhaXQgc3RhcnRTeW5jU2VydmVyKHBvcnQpXG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS5lcnJvcignU2VydmVyIEZhaWxlZCB0byBzdGFydCcpXG5cdFx0Y29uc29sZS5lcnJvcihlcnJvcilcblx0XHRwcm9jZXNzLmV4aXQoMSlcblx0fVxufVxuXG5pZiAoaXNNYXN0ZXIpIHtcblx0Y29uc3QgbnVtQ1BVcyA9IHJlcXVpcmUoJ29zJykuY3B1cygpLmxlbmd0aFxuXG5cdGNvbnNvbGUubG9nKGBNYXN0ZXIgJHtwcm9jZXNzLnBpZH0gaXMgcnVubmluZ2ApXG5cblx0Ly8gRm9yayB3b3JrZXJzLlxuXHRmb3IgKGxldCBpID0gMDsgaSA8IG51bUNQVXM7IGkrKykge1xuXHRcdGZvcmsoKVxuXHR9XG5cblx0b24oJ2ZvcmsnLCAod29ya2VyKSA9PiB7XG5cdFx0Y29uc29sZS5sb2coJ3dvcmtlciBpcyBkZWFkOicsIHdvcmtlci5pc0RlYWQoKSlcblx0fSlcblxuXHRvbignZXhpdCcsICh3b3JrZXIpID0+IHtcblx0XHRjb25zb2xlLmxvZygnd29ya2VyIGlzIGRlYWQ6Jywgd29ya2VyLmlzRGVhZCgpKVxuXHR9KVxufSBlbHNlIHtcblx0LyoqXG5cdCAqIFtpZiBIb3QgTW9kdWxlIGZvciB3ZWJwYWNrXVxuXHQgKiBAcGFyYW0gIHtbdHlwZV19IG1vZHVsZSBbZ2xvYmFsIG1vZHVsZSBub2RlIG9iamVjdF1cblx0ICovXG5cdGxldCBjdXJyZW50QXBwID0gYXBwXG5cdGlmIChtb2R1bGUuaG90KSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoJ2FwcC5zZXJ2ZXInLCAoKSA9PiB7XG5cdFx0XHRzZXJ2ZXIucmVtb3ZlTGlzdGVuZXIoJ3JlcXVlc3QnLCBjdXJyZW50QXBwKVxuXHRcdFx0c2VydmVyLm9uKCdyZXF1ZXN0JywgYXBwKVxuXHRcdFx0Y3VycmVudEFwcCA9IGFwcFxuXHRcdH0pXG5cblx0XHQvKipcblx0XHQgKiBOZXh0IGNhbGxiYWNrIGlzIGVzc2VudGlhbDpcblx0XHQgKiBBZnRlciBjb2RlIGNoYW5nZXMgd2VyZSBhY2NlcHRlZCB3ZSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcC5cblx0XHQgKiBzZXJ2ZXIuY2xvc2UoKSBpcyBoZXJlIEV4cHJlc3MuSlMtc3BlY2lmaWMgYW5kIGNhbiBkaWZmZXIgaW4gb3RoZXIgZnJhbWV3b3Jrcy5cblx0XHQgKiBUaGUgaWRlYSBpcyB0aGF0IHlvdSBzaG91bGQgc2h1dCBkb3duIHlvdXIgYXBwIGhlcmUuXG5cdFx0ICogRGF0YS9zdGF0ZSBzYXZpbmcgYmV0d2VlbiBzaHV0ZG93biBhbmQgbmV3IHN0YXJ0IGlzIHBvc3NpYmxlXG5cdFx0ICovXG5cdFx0bW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHNlcnZlci5jbG9zZSgpKVxuXHR9XG5cblx0Ly8gV29ya2VycyBjYW4gc2hhcmUgYW55IFRDUCBjb25uZWN0aW9uXG5cdC8vIEluIHRoaXMgY2FzZSBpdCBpcyBhbiBIVFRQIHNlcnZlclxuXHRzdGFydCgpXG5cblx0Y29uc29sZS5sb2coYFdvcmtlciAke3Byb2Nlc3MucGlkfSBzdGFydGVkYClcbn1cbiIsImltcG9ydCAqIGFzIGNvcnNMaWJyYXJ5IGZyb20gJ2NvcnMnXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBOT1dfVVJMID0gJ2h0dHBzOi8vb29qb2IuaW8nLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IHByb2RVcmxzID0gWydodHRwczovL29vam9iLmlvJywgJ2h0dHBzOi8vYWxwaGEub29qb2IuaW8nLCAnaHR0cHM6Ly9iZXRhLm9vam9iLmlvJywgTk9XX1VSTF1cbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBjb3JzT3B0aW9uID0ge1xuXHRvcmlnaW46IGlzUHJvZHVjdGlvbiA/IHByb2RVcmxzLmZpbHRlcihCb29sZWFuKSA6IFsvbG9jYWxob3N0L10sXG5cdG1ldGhvZHM6ICdHRVQsIEhFQUQsIFBVVCwgUEFUQ0gsIFBPU1QsIERFTEVURSwgT1BUSU9OJyxcblx0Y3JlZGVudGlhbHM6IHRydWUsXG5cdGV4cG9zZWRIZWFkZXJzOiBbJ2F1dGhvcml6YXRpb24nXVxufVxuXG5jb25zdCBjb3JzID0gKCkgPT4gY29yc0xpYnJhcnkoY29yc09wdGlvbilcbmV4cG9ydCBkZWZhdWx0IGNvcnNcbiIsImltcG9ydCAqIGFzIGhvc3RWYWxpZGF0aW9uIGZyb20gJ2hvc3QtdmFsaWRhdGlvbidcblxuLy8gTk9URShAbXhzdGJyKTpcbi8vIC0gSG9zdCBoZWFkZXIgb25seSBjb250YWlucyB0aGUgZG9tYWluLCBzbyBzb21ldGhpbmcgbGlrZSAnYnVpbGQtYXBpLWFzZGYxMjMubm93LnNoJyBvciAnb29qb2IuaW8nXG4vLyAtIFJlZmVyZXIgaGVhZGVyIGNvbnRhaW5zIHRoZSBlbnRpcmUgVVJMLCBzbyBzb21ldGhpbmcgbGlrZVxuLy8gJ2h0dHBzOi8vYnVpbGQtYXBpLWFzZGYxMjMubm93LnNoL2ZvcndhcmQnIG9yICdodHRwczovL29vam9iLmlvL2ZvcndhcmQnXG4vLyBUaGF0IG1lYW5zIHdlIGhhdmUgdG8gY2hlY2sgdGhlIEhvc3Qgc2xpZ2h0bHkgZGlmZmVyZW50bHkgZnJvbSB0aGUgUmVmZXJlciB0byBhdm9pZCB0aGluZ3Ncbi8vIGxpa2UgJ215LWRvbWFpbi1vb2pvYi5pbycgdG8gYmUgYWJsZSB0byBoYWNrIG91ciB1c2Vyc1xuXG4vLyBIb3N0cywgd2l0aG91dCBodHRwKHMpOi8vIGFuZCBwYXRoc1xuY29uc3QgeyBOT1dfVVJMID0gJ2h0dHA6Ly9vb2pvYi5pbycgfSA9IHByb2Nlc3MuZW52XG5jb25zdCB0cnVzdGVkSG9zdHMgPSBbXG5cdE5PV19VUkwgJiYgbmV3IFJlZ0V4cChgXiR7Tk9XX1VSTC5yZXBsYWNlKCdodHRwczovLycsICcnKX0kYCksXG5cdC9eb29qb2JcXC5pbyQvLCAvLyBUaGUgRG9tYWluXG5cdC9eLipcXC5vb2pvYlxcLmlvJC8gLy8gQWxsIHN1YmRvbWFpbnNcbl0uZmlsdGVyKEJvb2xlYW4pXG5cbi8vIFJlZmVyZXJzLCB3aXRoIGh0dHAocyk6Ly8gYW5kIHBhdGhzXG5jb25zdCB0cnVzdGVkUmVmZXJlcnMgPSBbXG5cdE5PV19VUkwgJiYgbmV3IFJlZ0V4cChgXiR7Tk9XX1VSTH0oJHxcXC8uKilgKSxcblx0L15odHRwczpcXC9cXC9vb2pvYlxcLmlvKCR8XFwvLiopLywgLy8gVGhlIERvbWFpblxuXHQvXmh0dHBzOlxcL1xcLy4qXFwuc3BlY3RydW1cXC5jaGF0KCR8XFwvLiopLyAvLyBBbGwgc3ViZG9tYWluc1xuXS5maWx0ZXIoQm9vbGVhbilcblxuY29uc3QgY3NyZiA9IGhvc3RWYWxpZGF0aW9uKHtcblx0aG9zdHM6IHRydXN0ZWRIb3N0cyxcblx0cmVmZXJlcnM6IHRydXN0ZWRSZWZlcmVycyxcblx0bW9kZTogJ2VpdGhlcidcbn0pXG5leHBvcnQgZGVmYXVsdCBjc3JmXG4iLCJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycjogRXJyb3IsIHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG5cdGlmIChlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKGVycilcblx0XHRyZXMuc3RhdHVzKDUwMCkuc2VuZCgnT29wcywgc29tZXRoaW5nIHdlbnQgd3JvbmchIE91ciBlbmdpbmVlcnMgaGF2ZSBiZWVuIGFsZXJ0ZWQgYW5kIHdpbGwgZml4IHRoaXMgYXNhcC4nKVxuXHRcdC8vIGNhcHR1cmUgZXJyb3Igd2l0aCBlcnJvciBtZXRyaWNzIGNvbGxlY3RvclxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBuZXh0KClcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBlcnJvckhhbmRsZXJcbiIsImltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInXG5pbXBvcnQgKiBhcyBjb21wcmVzc2lvbiBmcm9tICdjb21wcmVzc2lvbidcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgY29ycyBmcm9tICdtaWRkbGV3YXJlcy9jb3JzJ1xuaW1wb3J0IGNzcmYgZnJvbSAnbWlkZGxld2FyZXMvY3NyZidcbmltcG9ydCBlcnJvckhhbmRsZXIgZnJvbSAnbWlkZGxld2FyZXMvZXJyb3ItaGFuZGxlcidcbmltcG9ydCBsb2dnZXIgZnJvbSAnbWlkZGxld2FyZXMvbG9nZ2VyJ1xuaW1wb3J0IHNlY3VyaXR5IGZyb20gJ21pZGRsZXdhcmVzL3NlY3VyaXR5J1xuaW1wb3J0IHRvb2J1c3kgZnJvbSAnbWlkZGxld2FyZXMvdG9vYnVzeSdcbmltcG9ydCB3aW5zdG9uIGZyb20gJ21pZGRsZXdhcmVzL3dpbnN0b24nXG5cbmNvbnN0IHsgRU5BQkxFX0NTUCA9IHRydWUsIEVOQUJMRV9OT05DRSA9IHRydWUgfSA9IHByb2Nlc3MuZW52XG5cbmNvbnN0IG1pZGRsZXdhcmVzID0gKGFwcDogQXBwbGljYXRpb24pID0+IHtcblx0Ly8gQ09SUyBmb3IgY3Jvc3NzLXRlIGFjY2Vzc1xuXHRhcHAudXNlKGNvcnMoKSlcblxuXHQvLyBqc29uIGVuY29kaW5nIGFuZCBkZWNvZGluZ1xuXHRhcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSlcblx0YXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSlcblxuXHQvLyBzZXQgR1ppcCBvbiBoZWFkZXJzIGZvciByZXF1ZXN0L3Jlc3BvbnNlXG5cdGFwcC51c2UoY29tcHJlc3Npb24oKSlcblxuXHQvLyBhdHRhY2ggbG9nZ2VyIGZvciBhcHBsaWNhdGlvblxuXHRhcHAudXNlKChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuXHRcdHJlcS5sb2dnZXIgPSB3aW5zdG9uXG5cblx0XHRyZXR1cm4gbmV4dCgpXG5cdH0pXG5cblx0YXBwLnVzZShsb2dnZXIpXG5cdGFwcC51c2UoY3NyZilcblx0YXBwLnVzZShlcnJvckhhbmRsZXIpXG5cdHNlY3VyaXR5KGFwcCwgeyBlbmFibGVDU1A6IEJvb2xlYW4oRU5BQkxFX0NTUCksIGVuYWJsZU5vbmNlOiBCb29sZWFuKEVOQUJMRV9OT05DRSkgfSlcblxuXHQvLyBidXNzeSBzZXJ2ZXIgKHdhaXQgZm9yIGl0IHRvIHJlc29sdmUpXG5cdGFwcC51c2UodG9vYnVzeSgpKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtaWRkbGV3YXJlc1xuIiwiaW1wb3J0ICogYXMgbW9yZ2FuIGZyb20gJ21vcmdhbidcblxuaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1ZygnbWlkZGxld2FyZXM6bG9nZ2luZycpXG5cbmNvbnN0IHsgTk9ERV9FTlYgPSAnZGV2ZWxvcG1lbnQnLCBGT1JDRV9ERVYgPSBmYWxzZSB9ID0gcHJvY2Vzcy5lbnZcbmNvbnN0IGlzUHJvZHVjdGlvbiA9IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgJiYgIUZPUkNFX0RFVlxuXG5jb25zdCBsb2dnZXIgPSBtb3JnYW4oJ2NvbWJpbmVkJywge1xuXHRza2lwOiAoXzogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4gaXNQcm9kdWN0aW9uICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCAmJiByZXMuc3RhdHVzQ29kZSA8IDMwMCxcblx0c3RyZWFtOiB7XG5cdFx0d3JpdGU6IChtZXNzYWdlOiBzdHJpbmcpID0+IGRlYnVnKG1lc3NhZ2UpXG5cdH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0ICogYXMgaHBwIGZyb20gJ2hwcCdcblxuaW1wb3J0IHsgQXBwbGljYXRpb24sIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgY29udGVudFNlY3VyaXR5UG9saWN5LCBmcmFtZWd1YXJkLCBoc3RzLCBpZU5vT3Blbiwgbm9TbmlmZiwgeHNzRmlsdGVyIH0gZnJvbSAnaGVsbWV0J1xuXG5pbXBvcnQgZXhwcmVzc0VuZm9yY2VzU3NsIGZyb20gJ2V4cHJlc3MtZW5mb3JjZXMtc3NsJ1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCdcblxuY29uc3QgeyBOT0RFX0VOViA9ICdkZXZlbG9wbWVudCcsIEZPUkNFX0RFViA9IGZhbHNlIH0gPSBwcm9jZXNzLmVudlxuY29uc3QgaXNQcm9kdWN0aW9uID0gTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhRk9SQ0VfREVWXG5cbmNvbnN0IHNlY3VyaXR5ID0gKGFwcDogQXBwbGljYXRpb24sIHsgZW5hYmxlTm9uY2UsIGVuYWJsZUNTUCB9OiB7IGVuYWJsZU5vbmNlOiBib29sZWFuOyBlbmFibGVDU1A6IGJvb2xlYW4gfSkgPT4ge1xuXHQvLyBzZXQgdHJ1c3RlZCBpcFxuXHRhcHAuc2V0KCd0cnVzdCBwcm94eScsIHRydWUpXG5cblx0Ly8gZG8gbm90IHNob3cgcG93ZXJlZCBieSBleHByZXNzXG5cdGFwcC5zZXQoJ3gtcG93ZXJlZC1ieScsIGZhbHNlKVxuXHRcblx0Ly8gc2VjdXJpdHkgaGVsbWV0IHBhY2thZ2Vcblx0Ly8gRG9uJ3QgZXhwb3NlIGFueSBzb2Z0d2FyZSBpbmZvcm1hdGlvbiB0byBoYWNrZXJzLlxuXHRhcHAuZGlzYWJsZSgneC1wb3dlcmVkLWJ5JylcblxuXHQvLyBFeHByZXNzIG1pZGRsZXdhcmUgdG8gcHJvdGVjdCBhZ2FpbnN0IEhUVFAgUGFyYW1ldGVyIFBvbGx1dGlvbiBhdHRhY2tzXG5cdGFwcC51c2UoaHBwKCkpXG5cblx0aWYgKGlzUHJvZHVjdGlvbikge1xuXHRcdGFwcC51c2UoXG5cdFx0XHRoc3RzKHtcblx0XHRcdFx0Ly8gNSBtaW5zIGluIHNlY29uZHNcblx0XHRcdFx0Ly8gd2Ugd2lsbCBzY2FsZSB0aGlzIHVwIGluY3JlbWVudGFsbHkgdG8gZW5zdXJlIHdlIGRvbnQgYnJlYWsgdGhlXG5cdFx0XHRcdC8vIGFwcCBmb3IgZW5kIHVzZXJzXG5cdFx0XHRcdC8vIHNlZSBkZXBsb3ltZW50IHJlY29tbWVuZGF0aW9ucyBoZXJlIGh0dHBzOi8vaHN0c3ByZWxvYWQub3JnLz9kb21haW49c3BlY3RydW0uY2hhdFxuXHRcdFx0XHRtYXhBZ2U6IDMwMCxcblx0XHRcdFx0aW5jbHVkZVN1YkRvbWFpbnM6IHRydWUsXG5cdFx0XHRcdHByZWxvYWQ6IHRydWVcblx0XHRcdH0pXG5cdFx0KVxuXG5cdFx0YXBwLnVzZShleHByZXNzRW5mb3JjZXNTc2woKSlcblx0fVxuXG5cdC8vIFRoZSBYLUZyYW1lLU9wdGlvbnMgaGVhZGVyIHRlbGxzIGJyb3dzZXJzIHRvIHByZXZlbnQgeW91ciB3ZWJwYWdlIGZyb20gYmVpbmcgcHV0IGluIGFuIGlmcmFtZS5cblx0YXBwLnVzZShmcmFtZWd1YXJkKHsgYWN0aW9uOiAnc2FtZW9yaWdpbicgfSkpXG5cblx0Ly8gQ3Jvc3Mtc2l0ZSBzY3JpcHRpbmcsIGFiYnJldmlhdGVkIHRvIOKAnFhTU+KAnSwgaXMgYSB3YXkgYXR0YWNrZXJzIGNhbiB0YWtlIG92ZXIgd2VicGFnZXMuXG5cdGFwcC51c2UoeHNzRmlsdGVyKCkpXG5cblx0Ly8gU2V0cyB0aGUgWC1Eb3dubG9hZC1PcHRpb25zIHRvIHByZXZlbnQgSW50ZXJuZXQgRXhwbG9yZXIgZnJvbSBleGVjdXRpbmdcblx0Ly8gZG93bmxvYWRzIGluIHlvdXIgc2l0ZeKAmXMgY29udGV4dC5cblx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2llbm9vcGVuL1xuXHRhcHAudXNlKGllTm9PcGVuKCkpXG5cblx0Ly8gRG9u4oCZdCBTbmlmZiBNaW1ldHlwZSBtaWRkbGV3YXJlLCBub1NuaWZmLCBoZWxwcyBwcmV2ZW50IGJyb3dzZXJzIGZyb20gdHJ5aW5nXG5cdC8vIHRvIGd1ZXNzICjigJxzbmlmZuKAnSkgdGhlIE1JTUUgdHlwZSwgd2hpY2ggY2FuIGhhdmUgc2VjdXJpdHkgaW1wbGljYXRpb25zLiBJdFxuXHQvLyBkb2VzIHRoaXMgYnkgc2V0dGluZyB0aGUgWC1Db250ZW50LVR5cGUtT3B0aW9ucyBoZWFkZXIgdG8gbm9zbmlmZi5cblx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2RvbnQtc25pZmYtbWltZXR5cGUvXG5cdGFwcC51c2Uobm9TbmlmZigpKVxuXG5cdGlmIChlbmFibGVOb25jZSkge1xuXHRcdC8vIEF0dGFjaCBhIHVuaXF1ZSBcIm5vbmNlXCIgdG8gZXZlcnkgcmVzcG9uc2UuIFRoaXMgYWxsb3dzIHVzZSB0byBkZWNsYXJlXG5cdFx0Ly8gaW5saW5lIHNjcmlwdHMgYXMgYmVpbmcgc2FmZSBmb3IgZXhlY3V0aW9uIGFnYWluc3Qgb3VyIGNvbnRlbnQgc2VjdXJpdHkgcG9saWN5LlxuXHRcdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdFx0YXBwLnVzZSgocmVxdWVzdDogUmVxdWVzdCwgcmVzcG9uc2U6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0XHRcdHJlc3BvbnNlLmxvY2Fscy5ub25jZSA9IHV1aWQudjQoKVxuXHRcdFx0bmV4dCgpXG5cdFx0fSlcblx0fVxuXG5cdC8vIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IChDU1ApXG5cdC8vIEl0IGNhbiBiZSBhIHBhaW4gdG8gbWFuYWdlIHRoZXNlLCBidXQgaXQncyBhIHJlYWxseSBncmVhdCBoYWJpdCB0byBnZXQgaW4gdG8uXG5cdC8vIEBzZWUgaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vZG9jcy9jc3AvXG5cdGNvbnN0IGNzcENvbmZpZyA9IHtcblx0XHRkaXJlY3RpdmVzOiB7XG5cdFx0XHQvLyBUaGUgZGVmYXVsdC1zcmMgaXMgdGhlIGRlZmF1bHQgcG9saWN5IGZvciBsb2FkaW5nIGNvbnRlbnQgc3VjaCBhc1xuXHRcdFx0Ly8gSmF2YVNjcmlwdCwgSW1hZ2VzLCBDU1MsIEZvbnRzLCBBSkFYIHJlcXVlc3RzLCBGcmFtZXMsIEhUTUw1IE1lZGlhLlxuXHRcdFx0Ly8gQXMgeW91IG1pZ2h0IHN1c3BlY3QsIGlzIHVzZWQgYXMgZmFsbGJhY2sgZm9yIHVuc3BlY2lmaWVkIGRpcmVjdGl2ZXMuXG5cdFx0XHRkZWZhdWx0U3JjOiBbXCInc2VsZidcIl0sXG5cblx0XHRcdC8vIERlZmluZXMgdmFsaWQgc291cmNlcyBvZiBKYXZhU2NyaXB0LlxuXHRcdFx0c2NyaXB0U3JjOiBbXG5cdFx0XHRcdFwiJ3NlbGYnXCIsXG5cdFx0XHRcdFwiJ3Vuc2FmZS1ldmFsJ1wiLFxuXHRcdFx0XHQnd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tJyxcblx0XHRcdFx0J2Nkbi5yYXZlbmpzLmNvbScsXG5cdFx0XHRcdCdjZG4ucG9seWZpbGwuaW8nLFxuXHRcdFx0XHQnY2RuLmFtcGxpdHVkZS5jb20nLFxuXG5cdFx0XHRcdC8vIE5vdGU6IFdlIHdpbGwgZXhlY3V0aW9uIG9mIGFueSBpbmxpbmUgc2NyaXB0cyB0aGF0IGhhdmUgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvLyBub25jZSBpZGVudGlmaWVyIGF0dGFjaGVkIHRvIHRoZW0uXG5cdFx0XHRcdC8vIFRoaXMgaXMgdXNlZnVsIGZvciBndWFyZGluZyB5b3VyIGFwcGxpY2F0aW9uIHdoaWxzdCBhbGxvd2luZyBhbiBpbmxpbmVcblx0XHRcdFx0Ly8gc2NyaXB0IHRvIGRvIGRhdGEgc3RvcmUgcmVoeWRyYXRpb24gKHJlZHV4L21vYngvYXBvbGxvKSBmb3IgZXhhbXBsZS5cblx0XHRcdFx0Ly8gQHNlZSBodHRwczovL2hlbG1ldGpzLmdpdGh1Yi5pby9kb2NzL2NzcC9cblx0XHRcdFx0KF86IFJlcXVlc3QsIHJlc3BvbnNlOiBSZXNwb25zZSkgPT4gYCdub25jZS0ke3Jlc3BvbnNlLmxvY2Fscy5ub25jZX0nYFxuXHRcdFx0XSxcblxuXHRcdFx0Ly8gRGVmaW5lcyB0aGUgb3JpZ2lucyBmcm9tIHdoaWNoIGltYWdlcyBjYW4gYmUgbG9hZGVkLlxuXHRcdFx0Ly8gQG5vdGU6IExlYXZlIG9wZW4gdG8gYWxsIGltYWdlcywgdG9vIG11Y2ggaW1hZ2UgY29taW5nIGZyb20gZGlmZmVyZW50IHNlcnZlcnMuXG5cdFx0XHRpbWdTcmM6IFsnaHR0cHM6JywgJ2h0dHA6JywgXCInc2VsZidcIiwgJ2RhdGE6JywgJ2Jsb2I6J10sXG5cblx0XHRcdC8vIERlZmluZXMgdmFsaWQgc291cmNlcyBvZiBzdHlsZXNoZWV0cy5cblx0XHRcdHN0eWxlU3JjOiBbXCInc2VsZidcIiwgXCIndW5zYWZlLWlubGluZSdcIl0sXG5cblx0XHRcdC8vIEFwcGxpZXMgdG8gWE1MSHR0cFJlcXVlc3QgKEFKQVgpLCBXZWJTb2NrZXQgb3IgRXZlbnRTb3VyY2UuXG5cdFx0XHQvLyBJZiBub3QgYWxsb3dlZCB0aGUgYnJvd3NlciBlbXVsYXRlcyBhIDQwMCBIVFRQIHN0YXR1cyBjb2RlLlxuXHRcdFx0Y29ubmVjdFNyYzogWydodHRwczonLCAnd3NzOiddLFxuXG5cdFx0XHQvLyBsaXN0cyB0aGUgVVJMcyBmb3Igd29ya2VycyBhbmQgZW1iZWRkZWQgZnJhbWUgY29udGVudHMuXG5cdFx0XHQvLyBGb3IgZXhhbXBsZTogY2hpbGQtc3JjIGh0dHBzOi8veW91dHViZS5jb20gd291bGQgZW5hYmxlXG5cdFx0XHQvLyBlbWJlZGRpbmcgdmlkZW9zIGZyb20gWW91VHViZSBidXQgbm90IGZyb20gb3RoZXIgb3JpZ2lucy5cblx0XHRcdC8vIEBub3RlOiB3ZSBhbGxvdyB1c2VycyB0byBlbWJlZCBhbnkgcGFnZSB0aGV5IHdhbnQuXG5cdFx0XHRjaGlsZFNyYzogWydodHRwczonLCAnaHR0cDonXSxcblxuXHRcdFx0Ly8gYWxsb3dzIGNvbnRyb2wgb3ZlciBGbGFzaCBhbmQgb3RoZXIgcGx1Z2lucy5cblx0XHRcdG9iamVjdFNyYzogW1wiJ25vbmUnXCJdLFxuXG5cdFx0XHQvLyByZXN0cmljdHMgdGhlIG9yaWdpbnMgYWxsb3dlZCB0byBkZWxpdmVyIHZpZGVvIGFuZCBhdWRpby5cblx0XHRcdG1lZGlhU3JjOiBbXCInbm9uZSdcIl1cblx0XHR9LFxuXG5cdFx0Ly8gU2V0IHRvIHRydWUgaWYgeW91IG9ubHkgd2FudCBicm93c2VycyB0byByZXBvcnQgZXJyb3JzLCBub3QgYmxvY2sgdGhlbS5cblx0XHRyZXBvcnRPbmx5OiBOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyB8fCBCb29sZWFuKEZPUkNFX0RFVikgfHwgZmFsc2UsXG5cdFx0Ly8gTmVjZXNzYXJ5IGJlY2F1c2Ugb2YgWmVpdCBDRE4gdXNhZ2Vcblx0XHRicm93c2VyU25pZmY6IGZhbHNlXG5cdH1cblxuXHRpZiAoZW5hYmxlQ1NQKSB7XG5cdFx0YXBwLnVzZShjb250ZW50U2VjdXJpdHlQb2xpY3koY3NwQ29uZmlnKSlcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBzZWN1cml0eVxuIiwiaW1wb3J0ICogYXMgdG9vYnVzeSBmcm9tICd0b29idXN5LWpzJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnXG5cbmNvbnN0IGlzRGV2ZWxvcG1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcblx0aWYgKCFpc0RldmVsb3BtZW50ICYmIHRvb2J1c3koKSkge1xuXHRcdHJlcy5zdGF0dXNDb2RlID0gNTAzXG5cdFx0cmVzLnNlbmQoJ0l0IGxvb2tlIGxpa2UgdGhlIHNldmVyIGlzIGJ1c3N5LiBXYWl0IGZldyBzZWNvbmRzLi4uJylcblx0fSBlbHNlIHtcblx0XHQvLyBxdWV1ZSB1cCB0aGUgcmVxdWVzdCBhbmQgd2FpdCBmb3IgaXQgdG8gY29tcGxldGUgaW4gdGVzdGluZyBhbmQgZGV2ZWxvcG1lbnQgcGhhc2Vcblx0XHRuZXh0KClcblx0fVxufVxuIiwiaW1wb3J0IHsgTG9nZ2VyLCBMb2dnZXJPcHRpb25zLCBjcmVhdGVMb2dnZXIsIGZvcm1hdCwgdHJhbnNwb3J0cyB9IGZyb20gJ3dpbnN0b24nXG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMgfSBmcm9tICdmcydcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuXG5jb25zdCB7IGNvbWJpbmUsIHRpbWVzdGFtcCwgcHJldHR5UHJpbnQgfSA9IGZvcm1hdFxuY29uc3QgbG9nRGlyZWN0b3J5ID0gam9pbihfX2Rpcm5hbWUsICdsb2cnKVxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG50eXBlIElMb2dnZXJPcHRpb25zID0geyBmaWxlOiBMb2dnZXJPcHRpb25zOyBjb25zb2xlOiBMb2dnZXJPcHRpb25zIH1cblxuZXhwb3J0IGNvbnN0IGxvZ2dlck9wdGlvbnMgPSB7XG5cdGZpbGU6IHtcblx0XHRsZXZlbDogJ2luZm8nLFxuXHRcdGZpbGVuYW1lOiBgJHtsb2dEaXJlY3Rvcnl9L2xvZ3MvYXBwLmxvZ2AsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiB0cnVlLFxuXHRcdG1heHNpemU6IDUyNDI4ODAsIC8vIDVNQlxuXHRcdG1heEZpbGVzOiA1LFxuXHRcdGNvbG9yaXplOiBmYWxzZVxuXHR9LFxuXHRjb25zb2xlOiB7XG5cdFx0bGV2ZWw6ICdkZWJ1ZycsXG5cdFx0aGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcblx0XHRqc29uOiBmYWxzZSxcblx0XHRjb2xvcml6ZTogdHJ1ZVxuXHR9XG59XG5jb25zdCBsb2dnZXJUcmFuc3BvcnRzID0gW1xuXHRuZXcgdHJhbnNwb3J0cy5Db25zb2xlKHtcblx0XHQuLi5sb2dnZXJPcHRpb25zLmNvbnNvbGUsXG5cdFx0Zm9ybWF0OiBmb3JtYXQuY29tYmluZShcblx0XHRcdGZvcm1hdC50aW1lc3RhbXAoKSxcblx0XHRcdGZvcm1hdC5jb2xvcml6ZSh7IGFsbDogdHJ1ZSB9KSxcblx0XHRcdGZvcm1hdC5hbGlnbigpLFxuXHRcdFx0Zm9ybWF0LnByaW50ZigoaW5mbykgPT4ge1xuXHRcdFx0XHRjb25zdCB7IHRpbWVzdGFtcCwgbGV2ZWwsIG1lc3NhZ2UsIC4uLmFyZ3MgfSA9IGluZm9cblxuXHRcdFx0XHQvLyBjb25zdCB0cyA9IHRpbWVzdGFtcC5zbGljZSgwLCAxOSkucmVwbGFjZSgnVCcsICcgJyk7XG5cdFx0XHRcdHJldHVybiBgJHt0aW1lc3RhbXB9ICR7bGV2ZWx9OiAke21lc3NhZ2V9ICR7T2JqZWN0LmtleXMoYXJncykubGVuZ3RoID8gSlNPTi5zdHJpbmdpZnkoYXJncywgbnVsbCwgMikgOiAnJ31gXG5cdFx0XHR9KVxuXHRcdClcblx0fSlcbl1cblxuY2xhc3MgQXBwTG9nZ2VyIHtcblx0cHVibGljIGxvZ2dlcjogTG9nZ2VyXG5cdHB1YmxpYyBsb2dnZXJPcHRpb25zOiBJTG9nZ2VyT3B0aW9uc1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM6IElMb2dnZXJPcHRpb25zKSB7XG5cdFx0aWYgKCFpc0RldmVsb3BtZW50KSB7XG5cdFx0XHRleGlzdHNTeW5jKGxvZ0RpcmVjdG9yeSkgfHwgbWtkaXJTeW5jKGxvZ0RpcmVjdG9yeSlcblx0XHR9XG5cblx0XHR0aGlzLmxvZ2dlciA9IGNyZWF0ZUxvZ2dlcih7XG5cdFx0XHR0cmFuc3BvcnRzOiBpc0RldmVsb3BtZW50XG5cdFx0XHRcdD8gWy4uLmxvZ2dlclRyYW5zcG9ydHNdXG5cdFx0XHRcdDogW1xuXHRcdFx0XHRcdFx0Li4ubG9nZ2VyVHJhbnNwb3J0cyxcblx0XHRcdFx0XHRcdG5ldyB0cmFuc3BvcnRzLkZpbGUoe1xuXHRcdFx0XHRcdFx0XHQuLi5vcHRpb25zLmZpbGUsXG5cdFx0XHRcdFx0XHRcdGZvcm1hdDogY29tYmluZSh0aW1lc3RhbXAoKSwgcHJldHR5UHJpbnQoKSlcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdCAgXSxcblx0XHRcdGV4aXRPbkVycm9yOiBmYWxzZVxuXHRcdH0pXG5cdH1cbn1cblxuY29uc3QgeyBsb2dnZXIgfSA9IG5ldyBBcHBMb2dnZXIobG9nZ2VyT3B0aW9ucylcbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuIiwiaW1wb3J0IHsgU2VydmVyLCBjcmVhdGVTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuXG5pbXBvcnQgQXBwIGZyb20gJ2FwcC5zZXJ2ZXInXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgZ3JhcGhxbFNlcnZlciBmcm9tICdncmFwaHFsLnNlcnZlcidcbmltcG9ydCB7IG5vcm1hbGl6ZVBvcnQgfSBmcm9tICd1dGlsbGl0eS9ub3JtYWxpemUnXG5cbmNsYXNzIE9vam9iU2VydmVyIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHVibGljIHNlcnZlcjogU2VydmVyXG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHBsaWNhdGlvbikge1xuXHRcdHRoaXMuYXBwID0gYXBwXG5cdFx0Z3JhcGhxbFNlcnZlci5hcHBseU1pZGRsZXdhcmUoeyBhcHAgfSlcblx0XHR0aGlzLnNlcnZlciA9IGNyZWF0ZVNlcnZlcihhcHApXG5cdFx0Z3JhcGhxbFNlcnZlci5pbnN0YWxsU3Vic2NyaXB0aW9uSGFuZGxlcnModGhpcy5zZXJ2ZXIpXG5cdH1cblxuXHRzdGFydFN5bmNTZXJ2ZXIgPSBhc3luYyAocG9ydDogc3RyaW5nKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IFBPUlQgPSBub3JtYWxpemVQb3J0KHBvcnQpXG5cdFx0XHR0aGlzLnNlcnZlci5saXN0ZW4oUE9SVCwgKCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgc2VydmVyIHJlYWR5IGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtQT1JUfSR7Z3JhcGhxbFNlcnZlci5ncmFwaHFsUGF0aH1gKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhgU3Vic2NyaXB0aW9ucyByZWFkeSBhdCB3czovL2xvY2FsaG9zdDoke1BPUlR9JHtncmFwaHFsU2VydmVyLnN1YnNjcmlwdGlvbnNQYXRofWApXG5cdFx0XHR9KVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRhd2FpdCB0aGlzLnN0b3BTZXJ2ZXIoKVxuXHRcdH1cblx0fVxuXG5cdHN0b3BTZXJ2ZXIgPSBhc3luYyAoKSA9PiB7XG5cdFx0cHJvY2Vzcy5vbignU0lHSU5UJywgYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coJ0Nsb3Npbmcgb29qb2IgU3luY1NlcnZlciAuLi4nKVxuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHR0aGlzLnNlcnZlci5jbG9zZSgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdvb2pvYiBTeW5jU2VydmVyIENsb3NlZCcpXG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdFcnJvciBDbG9zaW5nIFN5bmNTZXJ2ZXIgU2VydmVyIENvbm5lY3Rpb24nKVxuXHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKVxuXHRcdFx0XHRwcm9jZXNzLmtpbGwocHJvY2Vzcy5waWQpXG5cdFx0XHR9XG5cdFx0fSlcblx0fVxufVxuXG5leHBvcnQgY29uc3QgeyBzdGFydFN5bmNTZXJ2ZXIsIHN0b3BTZXJ2ZXIsIHNlcnZlciwgYXBwIH0gPSBuZXcgT29qb2JTZXJ2ZXIoQXBwKVxuIiwiaW1wb3J0IHsgY3JlYXRlQ2lwaGVyLCBjcmVhdGVEZWNpcGhlciB9IGZyb20gJ2NyeXB0bydcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY2xhc3MgQXBwQ3J5cHRvIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblx0cHJpdmF0ZSBFTkNSWVBUX0FMR09SSVRITTogc3RyaW5nXG5cdHByaXZhdGUgRU5DUllQVF9TRUNSRVQ6IHN0cmluZ1xuXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwbGljYXRpb24pIHtcblx0XHRjb25zdCB7IEVOQ1JZUFRfU0VDUkVUID0gJ2RvZG9kdWNrQE45JywgRU5DUllQVF9BTEdPUklUSE0gPSAnYWVzLTI1Ni1jdHInIH0gPSBwcm9jZXNzLmVudlxuXG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0XHR0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNID0gRU5DUllQVF9BTEdPUklUSE1cblx0XHR0aGlzLkVOQ1JZUFRfU0VDUkVUID0gRU5DUllQVF9TRUNSRVRcblx0fVxuXG5cdHB1YmxpYyBlbmNyeXB0ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBFbmNyeXB0IGZvciAke3RleHR9YClcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjaXBoZXIgPSBjcmVhdGVDaXBoZXIodGhpcy5FTkNSWVBUX0FMR09SSVRITSwgdGhpcy5FTkNSWVBUX1NFQ1JFVClcblx0XHRcdGxldCBjcnlwdGVkID0gY2lwaGVyLnVwZGF0ZSh0ZXh0LCAndXRmOCcsICdoZXgnKVxuXHRcdFx0Y3J5cHRlZCArPSBjaXBoZXIuZmluYWwoJ2hleCcpXG5cblx0XHRcdHJldHVybiBjcnlwdGVkXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuYXBwLmxvZ2dlci5lcnJvcihlcnJvci5tZXNzYWdlKVxuXG5cdFx0XHRyZXR1cm4gJydcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZGVjcnlwdCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcblx0XHR0aGlzLmFwcC5sb2dnZXIuaW5mbyhgRGVjcnlwdCBmb3IgJHt0ZXh0fWApXG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgZGVjaXBoZXIgPSBjcmVhdGVEZWNpcGhlcih0aGlzLkVOQ1JZUFRfQUxHT1JJVEhNLCB0aGlzLkVOQ1JZUFRfU0VDUkVUKVxuXHRcdFx0bGV0IGRlYyA9IGRlY2lwaGVyLnVwZGF0ZSh0ZXh0LCAnaGV4JywgJ3V0ZjgnKVxuXHRcdFx0ZGVjICs9IGRlY2lwaGVyLmZpbmFsKCd1dGY4JylcblxuXHRcdFx0cmV0dXJuIGRlY1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHR0aGlzLmFwcC5sb2dnZXIuZXJyb3IoZXJyb3IubWVzc2FnZSlcblxuXHRcdFx0cmV0dXJuICcnXG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENyeXB0b1xuIiwiaW1wb3J0IEFwcENyeXB0byBmcm9tICcuL2NyeXB0bydcbmltcG9ydCBBcHBTbHVnaWZ5IGZyb20gJy4vc2x1Z2lmeSdcbmltcG9ydCB7IEFwcGxpY2F0aW9uIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCB7IElBcHBVdGlscyB9IGZyb20gJy4vdXRpbC5pbnRlcmZhY2UnXG5cbmNsYXNzIEFwcFV0aWxzIGltcGxlbWVudHMgSUFwcFV0aWxzIHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblxuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKCdJbml0aWFsaXplZCBBcHBVdGlscycpXG5cdH1cblxuXHRwdWJsaWMgYXBwbHlVdGlscyA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcblx0XHRjb25zdCB7IGVuY3J5cHQsIGRlY3J5cHQgfSA9IG5ldyBBcHBDcnlwdG8odGhpcy5hcHApXG5cdFx0Y29uc3QgeyBzbHVnaWZ5IH0gPSBuZXcgQXBwU2x1Z2lmeSh0aGlzLmFwcClcblx0XHR0aGlzLmFwcC51dGlsaXR5ID0ge1xuXHRcdFx0ZW5jcnlwdCxcblx0XHRcdGRlY3J5cHQsXG5cdFx0XHRzbHVnaWZ5XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWVcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBVdGlsc1xuIiwiY29uc3Qgbm9ybWFsaXplUG9ydCA9IChwb3J0VmFsdWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG5cdGNvbnN0IHBvcnQgPSBwYXJzZUludChwb3J0VmFsdWUsIDEwKVxuXG5cdGlmIChpc05hTihwb3J0KSkge1xuXHRcdHJldHVybiA4MDgwXG5cdH1cblxuXHRpZiAocG9ydCA+PSAwKSB7XG5cdFx0cmV0dXJuIHBvcnRcblx0fVxuXG5cdHJldHVybiBwb3J0XG59XG5cbmV4cG9ydCB7IG5vcm1hbGl6ZVBvcnQgfVxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBBcHBTbHVnaWZ5IHtcblx0cHVibGljIGFwcDogQXBwbGljYXRpb25cblxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcGxpY2F0aW9uKSB7XG5cdFx0dGhpcy5hcHAgPSBhcHBcblx0fVxuXG5cdHB1YmxpYyBzbHVnaWZ5ID0gKHRleHQ6IHN0cmluZykgPT4ge1xuXHRcdC8vIHRoaXMuYXBwLmxvZ2dlci5pbmZvKGBTbHVnaWZ5IGZvciAke3RleHR9YClcblxuXHRcdHJldHVybiB0ZXh0XG5cdFx0XHQudG9Mb3dlckNhc2UoKVxuXHRcdFx0LnJlcGxhY2UoL1teXFx3IF0rL2csICcnKVxuXHRcdFx0LnJlcGxhY2UoLyArL2csICctJylcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBTbHVnaWZ5XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAb29qb2Ivb29qb2ItcHJvdG9idWZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQG9vam9iL3Byb3RvcmVwby1wcm9maWxlLW5vZGUvc2VydmljZV9wYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2x1c3RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb21wcmVzc2lvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnYvY29uZmlnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzcy1lbmZvcmNlcy1zc2xcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZ3JwY1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJoZWxtZXRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaG9zdC12YWxpZGF0aW9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhwcFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtb3JnYW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0b29idXN5LWpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRzbGliXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ3aW5zdG9uXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=