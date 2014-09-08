(function(exports, global) {'use strict';
    global["planar"] = exports;
    var VERSION = "0.9.0";
    var utils = {
        mixin: function(target, source) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
            return target;
        },
        indexOf: function(needle, haystack) {
            if (needle) {
                for (var i = 0; i < haystack.length; i++) {
                    if (haystack[i] === needle) {
                        return i;
                    }
                }
            }
            return -1;
        },
        indexOfById: function(id, haystack) {
            if (id) {
                for (var i = 0; i < haystack.length; i++) {
                    if (haystack[i].id === id) {
                        return i;
                    }
                }
            }
            return -1;
        },
        remove: function(needle, haystack) {
            var removed = false;
            var index = this.indexOf(needle, haystack);
            if (index >= 0) {
                haystack.splice(index, 1);
                removed = true;
            }
            return removed;
        },
        removeById: function(id, haystack) {
            var removed = false;
            var index = this.indexOfById(id, haystack);
            if (index >= 0) {
                haystack.splice(index, 1);
                removed = true;
            }
            return removed;
        },
        keys: function(obj) {
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        },
        select: function(haystack, excludedElements) {
            var elements = [];
            for (var key in haystack) {
                if (haystack.hasOwnProperty(key) && utils.indexOf(key, excludedElements) === -1) {
                    elements.push(haystack[key]);
                }
            }
            return elements;
        },
        get: function() {
            var args = this.convertVarArgs(arguments);
            var current = args[0];
            args.shift();
            var keys = args;
            for (var i = 0; i < keys.length; ++i) {
                if (this.isUndefined(current[keys[i]])) {
                    return undefined;
                } else {
                    current = current[keys[i]];
                }
            }
            return current;
        },
        values: function(obj) {
            var values = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    values.push(obj[key]);
                }
            }
            return values;
        },
        isFunction: function(obj) {
            return typeof obj === "function";
        },
        isUndefined: function(obj) {
            return typeof obj === "undefined";
        },
        isArray: function(value) {
            return Object.prototype.toString.apply(value) === "[object Array]";
        },
        isOfType: function(obj, type) {
            return obj.constructor === type;
        },
        checkExists: function(name, obj) {
            if (!utils.exists(obj)) {
                throw {
                    message: name + " must be specified"
                };
            }
        },
        exists: function(obj) {
            return !utils.isUndefined(obj) && obj !== null;
        },
        checkInArray: function(name, obj, array) {
            this.checkExists(name, obj);
            if (this.indexOf(obj, array) === -1) {
                throw {
                    message: name + " must be one of " + array
                };
            }
        },
        checkArray: function(name, array) {
            if (!this.isArray(array)) {
                throw {
                    message: name + " must be an array"
                };
            }
        },
        checkNotEmpty: function(name, obj) {
            if (obj === "") {
                throw {
                    message: name + " must not be empty"
                };
            }
        },
        checkArgument: function(predicate, message) {
            if (!predicate) {
                throw {
                    message: message
                };
            }
        },
        checkType: function(name, obj, type) {
            if (!this.isOfType(obj, type)) {
                throw {
                    message: name + " must be of type " + type
                };
            }
        },
        generateId: function() {
            var id = 1;
            return function() {
                return id++;
            };
        }(),
        convertVarArgs: function(args) {
            return args.length > 0 && utils.isArray(args[0]) ? args[0] : Array.prototype.slice.call(args);
        },
        randomInteger: function(lower, upper) {
            return Math.floor(Math.random() * upper) + lower;
        },
        randomDouble: function(lower, upper) {
            return Math.random() * upper + lower;
        }
    };
    var GeometryUtils = {
        isLeftOf: function(pt1, pt2) {
            return pt1.x < pt2.x;
        },
        isRightOf: function(pt1, pt2) {
            return GeometryUtils.isLeftOf(pt1, pt2);
        },
        isAbove: function(pt1, pt2) {
            return pt1.y < pt2.y;
        },
        isBelow: function(pt1, pt2) {
            return !GeometryUtils.isAbove(pt1, pt2);
        },
        centerOf: function(rect) {
            return new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
        },
        gradient: function(pt1, pt2) {
            return (pt2.y - pt1.y) / (pt2.x - pt1.x);
        },
        aspectRatio: function(rect) {
            return rect.height / rect.width;
        },
        distanceOfPoints: function(p1, p2) {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        },
        findIntersectionOnClosestSide: function(fromRect, toRect) {
            var centerA = GeometryUtils.centerOf(fromRect), centerB = GeometryUtils.centerOf(toRect), gradA2B = GeometryUtils.gradient(centerA, centerB), aspectA = GeometryUtils.aspectRatio(fromRect), h05 = fromRect.width / 2, w05 = fromRect.height / 2, normA2B = Math.abs(gradA2B / aspectA), add = new Point((GeometryUtils.isLeftOf(centerA, centerB) ? 1 : -1) * h05, (GeometryUtils.isAbove(centerA, centerB) ? 1 : -1) * w05);
            if (normA2B < 1) {
                add.y *= normA2B;
            } else {
                add.x /= normA2B;
            }
            return new Point(centerA.x + add.x, centerA.y + add.y);
        },
        findClosestMidpointToIntersection: function(intersection, pointOnElement, width, height) {
            var halfWidth = width / 2;
            var halfHeight = height / 2;
            if (pointOnElement.y - halfHeight === intersection.y) {
                return {
                    point: new Point(pointOnElement.x, pointOnElement.y - halfHeight),
                    horizontal: true
                };
            } else if (halfHeight + pointOnElement.y === intersection.y) {
                return {
                    point: new Point(pointOnElement.x, pointOnElement.y + halfHeight),
                    horizontal: true
                };
            } else if (pointOnElement.x - halfWidth === intersection.x) {
                return {
                    point: new Point(pointOnElement.x - halfWidth, pointOnElement.y),
                    horizontal: false
                };
            } else if (halfWidth + pointOnElement.x === intersection.x) {
                return {
                    point: new Point(pointOnElement.x + halfWidth, pointOnElement.y),
                    horizontal: false
                };
            }
        }
    };
    var SvgUtils = {
        widthOf: function(element) {
            return element.g[0][0].getBBox().width;
        },
        heightOf: function(element) {
            return element.g[0][0].getBBox().height;
        },
        getXYFromTranslate: function(translateString) {
            var split = translateString.split(",");
            var x = split[0] ? split[0].split("(")[1] : 0;
            var y = split[1] ? split[1].split(")")[0] : 0;
            return [ parseInt(x, 10), parseInt(y, 10) ];
        }
    };
    var DomUtils = {
        traverse: function(domElement, callbackForElements, context) {
            callbackForElements(domElement, context);
            domElement = domElement.firstChild;
            while (domElement) {
                this.traverse(domElement, callbackForElements, context);
                domElement = domElement.nextSibling;
            }
        },
        convertImgToBase64: function(url, callback, outputFormat) {
            var canvas = document.createElement("CANVAS"), ctx = canvas.getContext("2d"), img = new Image();
            img.onload = function() {
                var dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(this, dataURL);
                canvas = null;
            };
            img.src = url;
        },
        explicitlySetStyle: function(element, skippedElements, skipChildren) {
            skipChildren = skipChildren || false;
            if (element.nodeType !== window.Node.ELEMENT_NODE || skippedElements.indexOf(element.nodeName) > -1 || skipChildren && skippedElements.indexOf(element.parentNode.nodeName) > -1) {
                return;
            }
            var computedStyle = getComputedStyle(element);
            var computedStyleStr = "";
            for (var i = 0; i < computedStyle.length; i++) {
                var key = computedStyle[i];
                if (key === "quotes") {
                    continue;
                }
                var value = computedStyle.getPropertyValue(key);
                computedStyleStr += key + ":" + value + ";";
            }
            element.setAttribute("style", computedStyleStr);
        }
    };
    var OUT = 1;
    var IN = 2;
    var BOTH = 3;
    var PROP_TYPE = "_type";
    var AND = "and";
    var OR = "or";
    var VERTEX_FILTER = "vertex";
    var EDGE_FILTER = "edge";
    var BOTH_FILTER = "both";
    var NODE_WIDTH = 75;
    var EventEmitter = function() {
        return {
            on: function(eventType, callback) {
                utils.checkExists("Event", eventType);
                utils.checkExists("Callback", callback);
                this.eventCallbacks = this.eventCallbacks || {};
                this.eventCallbacks[eventType] = this.eventCallbacks[eventType] || [];
                this.eventCallbacks[eventType].push(callback);
            },
            off: function(eventType) {
                utils.checkExists("Event", eventType);
                if (!this.eventCallbacks) {
                    return;
                }
                delete this.eventCallbacks[eventType];
            },
            trigger: function(eventType) {
                utils.checkExists("Event", eventType);
                var callbacks, args, cancelled;
                if (!this.eventCallbacks || !this.eventCallbacks[eventType]) {
                    return;
                }
                args = [].slice.call(arguments, 1);
                callbacks = this.eventCallbacks[eventType];
                for (var i = 0; !cancelled && i < callbacks.length; i++) {
                    cancelled = callbacks[i].apply(this, [ eventType ].concat(args)) === false;
                }
            }
        };
    }();
    var Point = function(x, y) {
        return {
            x: x,
            y: y
        };
    };
    var Rectangle = function(x, y, w, h) {
        return {
            x: x,
            y: y,
            width: w,
            height: h
        };
    };
    var Element = function() {
        function checkPropertyAccess(graph, element, propertyKey, disabledFilters) {
            var filterPredicates = graph.getPropertyFilters(element, disabledFilters);
            for (var i = 0; i < filterPredicates.length; i++) {
                if (!filterPredicates[i].isVisible(element, propertyKey)) {
                    return false;
                }
            }
            return true;
        }
        return {
            initProperties: function(graph) {
                this.properties = [];
                this.graph = graph;
            },
            setProperty: function(key, value) {
                utils.checkExists("Property key", key);
                utils.checkExists("Property value", value);
                utils.checkNotEmpty("Property key", key);
                if (checkPropertyAccess(this.graph, this, key, Array.prototype.splice.call(arguments, 2))) {
                    this.setPropertyUnfiltered(key, value);
                }
            },
            setPropertyUnfiltered: function(key, value) {
                utils.checkExists("Property key", key);
                utils.checkExists("Property value", value);
                utils.checkNotEmpty("Property key", key);
                var oldValue = this.properties[key];
                this.properties[key] = value;
                this.graph.indexManager.updateKeyIndexValue(key, value, oldValue, this);
            },
            getProperty: function(key) {
                if (checkPropertyAccess(this.graph, this, key, Array.prototype.splice.call(arguments, 1))) {
                    return this.getPropertyUnfiltered(key);
                } else {
                    return null;
                }
            },
            getPropertyUnfiltered: function(key) {
                return utils.isUndefined(this.properties[key]) ? null : this.properties[key];
            },
            getPropertyKeys: function() {
                var keys = [];
                for (var key in this.properties) {
                    if (this.properties.hasOwnProperty(key) && checkPropertyAccess(this.graph, this, key, Array.prototype.slice.call(arguments))) {
                        keys.push(key);
                    }
                }
                return keys;
            },
            getPropertyKeysUnfiltered: function() {
                return utils.keys(this.properties);
            },
            removeProperty: function(key) {
                if (checkPropertyAccess(this.graph, this, key, Array.prototype.splice.call(arguments, 1))) {
                    return this.removePropertyUnfiltered(key);
                } else {
                    return null;
                }
            },
            removePropertyUnfiltered: function(key) {
                var value = this.getProperty(key);
                delete this.properties[key];
                this.graph.indexManager.removeKeyIndexValue(key, value, this);
                return value;
            },
            copyPropertiesTo: function(to) {
                var propertyKeys = this.getPropertyKeys();
                for (var i = 0; i < propertyKeys.length; i++) {
                    var key = propertyKeys[i];
                    var value = this.getProperty(key);
                    to.setProperty(key, value);
                }
            },
            getId: function() {
                return this.id;
            },
            getGraph: function() {
                return this.graph;
            }
        };
    }();
    var Edge = function() {
        function Edge(id, outVertex, inVertex, label, graph) {
            utils.checkExists("ID", id);
            utils.checkExists("Out vertex", outVertex);
            utils.checkExists("In vertex", inVertex);
            this.id = id;
            this.outVertex = outVertex;
            this.inVertex = inVertex;
            this.label = label;
            this.initProperties(graph);
        }
        utils.mixin(Edge.prototype, Element);
        utils.mixin(Edge.prototype, {
            getLabel: function() {
                return this.label;
            },
            getInVertex: function() {
                return this.inVertex;
            },
            getOutVertex: function() {
                return this.outVertex;
            },
            getVertex: function(direction) {
                if (direction === OUT) {
                    return this.outVertex;
                } else if (direction === IN) {
                    return this.inVertex;
                } else {
                    throw {
                        message: "Invalid direction. Must be either IN or OUT"
                    };
                }
            },
            getOtherVertex: function(vertex) {
                return this.inVertex.getId() === vertex.getId() ? this.outVertex : this.inVertex;
            },
            remove: function() {
                this.graph.removeEdge(this);
            },
            connects: function(v1, v2) {
                return this.outVertex.id === v1.id && this.inVertex.id === v2.id || this.outVertex.id === v2.id && this.inVertex.id === v1.id;
            }
        });
        return Edge;
    }();
    var Vertex = function() {
        function Vertex(id, graph) {
            this.id = id;
            this.inEdges = {};
            this.outEdges = {};
            this.ui = {};
            this.initProperties(graph);
        }
        utils.mixin(Vertex.prototype, Element);
        utils.mixin(Vertex.prototype, {
            getEdges: function(direction) {
                var labels = Array.prototype.slice.call(arguments, 1);
                return new VertexQuery(this).labels(labels).direction(direction).edges();
            },
            getVertices: function(direction) {
                var labels = Array.prototype.slice.call(arguments, 1);
                return new VertexQuery(this).labels(labels).direction(direction).vertices();
            },
            addEdge: function(label, inVertex) {
                return this.graph.addEdge(null, this, inVertex, label);
            },
            remove: function() {
                this.graph.removeVertex(this);
            },
            query: function() {
                return new VertexQuery(this);
            },
            select: function() {
                this.graph.renderer.selectedVertex = this.graph.renderer.verticesById[this.id];
            }
        });
        return Vertex;
    }();
    var Graph = function() {
        function Graph(instanceSettings) {
            this.vertices = {};
            this.edges = {};
            this.indexManager = new IndexManager(this);
            this.vertexPropertyFilters = {};
            this.edgePropertyFilters = {};
            this.updateSettings(instanceSettings);
        }
        utils.mixin(Graph.prototype, EventEmitter);
        utils.mixin(Graph.prototype, {
            addVertex: function(id) {
                if (utils.isUndefined(id) || id === null) {
                    id = utils.generateId();
                    while (this.getVertex(id) !== null) {
                        id = utils.generateId();
                    }
                }
                var vertex = this.getVertex(id);
                if (vertex) {
                    throw {
                        message: "Vertex already exists with the given ID"
                    };
                } else {
                    vertex = new Vertex(id, this);
                }
                this.vertices[id] = vertex;
                this.trigger("vertexAdded", vertex);
                this.trigger("graphUpdated");
                return vertex;
            },
            getVertex: function(id) {
                utils.checkExists("ID", id);
                return utils.isUndefined(this.vertices[id]) ? null : this.vertices[id];
            },
            removeVertex: function(vertex) {
                utils.checkExists("Vertex", vertex);
                var storedVertex = this.getVertex(vertex.id);
                if (storedVertex) {
                    var id;
                    for (id in storedVertex.inEdges) {
                        this.removeEdge(storedVertex.inEdges[id]);
                    }
                    for (id in storedVertex.outEdges) {
                        this.removeEdge(storedVertex.outEdges[id]);
                    }
                    this.indexManager.removeElement(storedVertex);
                    delete this.vertices[storedVertex.id];
                    this.trigger("vertexRemoved", storedVertex);
                    this.trigger("graphUpdated");
                }
            },
            getVertices: function(key, value, disabledFilters) {
                disabledFilters = disabledFilters || [];
                if (utils.isUndefined(key) || key === null) {
                    return utils.values(this.vertices);
                } else {
                    return new GraphQuery(this).has(key, value, null, disabledFilters).vertices();
                }
            },
            addEdge: function(id, outVertex, inVertex, label) {
                if (utils.isUndefined(id) || id === null) {
                    id = utils.generateId();
                    while (this.getEdge(id) !== null) {
                        id = utils.generateId();
                    }
                }
                var edge = new Edge(id, outVertex, inVertex, label, this);
                if (this.edges[id]) {
                    throw {
                        message: "Edge already exists with the given ID"
                    };
                } else {
                    this.edges[id] = edge;
                }
                outVertex.outEdges[edge.id] = edge;
                inVertex.inEdges[edge.id] = edge;
                this.trigger("edgeAdded", edge);
                this.trigger("graphUpdated");
                return edge;
            },
            getEdge: function(id) {
                utils.checkExists("ID", id);
                return utils.isUndefined(this.edges[id]) ? null : this.edges[id];
            },
            removeEdge: function(edge) {
                if (edge) {
                    var edgeToDelete = this.edges[edge.id];
                    if (edgeToDelete) {
                        this.indexManager.removeElement(edgeToDelete);
                        delete this.edges[edgeToDelete.id];
                        delete edgeToDelete.outVertex.outEdges[edgeToDelete.id];
                        delete edgeToDelete.inVertex.inEdges[edgeToDelete.id];
                        this.trigger("edgeRemoved", edge);
                        this.trigger("graphUpdated");
                    }
                }
            },
            getEdges: function(key, value, disabledFilters) {
                if (utils.isUndefined(key) || key === null) {
                    return utils.values(this.edges);
                } else {
                    return new GraphQuery(this).has(key, value, null, disabledFilters).edges();
                }
            },
            forEachVertex: function(callback) {
                if (utils.isFunction(callback)) {
                    for (var id in this.vertices) {
                        if (callback(this.vertices[id])) {
                            return;
                        }
                    }
                }
            },
            forEachEdge: function(callback) {
                if (utils.isFunction(callback)) {
                    for (var id in this.edges) {
                        if (callback(this.edges[id])) {
                            return;
                        }
                    }
                }
            },
            query: function() {
                return new GraphQuery(this);
            },
            createIndex: function(name, type) {
                return this.indexManager.createIndex(name, type);
            },
            getIndex: function(name, type) {
                return this.indexManager.getIndex(name, type);
            },
            getIndices: function() {
                return this.indexManager.getIndices();
            },
            dropIndex: function(name) {
                this.indexManager.dropIndex(name);
            },
            createKeyIndex: function(key, type) {
                return this.indexManager.createKeyIndex(key, type);
            },
            getIndexedKeys: function(type) {
                return this.indexManager.getIndexedKeys(type);
            },
            dropKeyIndex: function(key, type) {
                this.indexManager.dropKeyIndex(key, type);
            },
            addVertexPropertyFilter: function(name, predicate) {
                utils.checkExists("Predicate name", name);
                utils.checkExists("Predicate", predicate);
                this.vertexPropertyFilters[name] = predicate;
            },
            addEdgePropertyFilter: function(name, predicate) {
                utils.checkExists("Predicate name", name);
                utils.checkExists("Predicate", predicate);
                this.edgePropertyFilters[name] = predicate;
            },
            getPropertyFilters: function(element, disabledFilters) {
                disabledFilters = utils.convertVarArgs(disabledFilters);
                if (utils.isOfType(element, Vertex)) {
                    return utils.select(this.vertexPropertyFilters, disabledFilters);
                } else if (utils.isOfType(element, Edge)) {
                    return utils.select(this.edgePropertyFilters, disabledFilters);
                } else {
                    throw "Invalid type";
                }
            },
            removeAllVertexPropertyFilters: function() {
                this.vertexPropertyFilters = {};
            },
            removeAllEdgePropertyFilters: function() {
                this.edgePropertyFilters = {};
            },
            removeVertexPropertyFilter: function(predicateName) {
                utils.checkExists("Predicate name", predicateName);
                delete this.vertexPropertyFilters[predicateName];
            },
            removeEdgePropertyFilter: function(predicateName) {
                utils.checkExists("Predicate name", predicateName);
                delete this.edgePropertyFilters[predicateName];
            },
            render: function() {
                this.renderer.render();
            },
            saveAsImage: function() {
                this.renderer.saveAsImage();
            },
            getSettings: function() {
                return this.settings;
            },
            filteredView: function() {
                return new ElementFilterManager(this);
            },
            destroy: function() {
                this.renderer.stop();
            },
            updateSettings: function(instanceSettings) {
                instanceSettings = instanceSettings || {};
                this.settings = utils.mixin({}, settings);
                this.settings = utils.mixin(this.settings, instanceSettings);
                if (utils.exists(this.settings.container) && utils.exists(this.settings.engine)) {
                    this.renderer = new Renderer(this, this.settings);
                    this.renderer.init();
                }
            },
            resize: function() {
                this.renderer.resize();
            }
        });
        return Graph;
    }();
    var InternalPropertyFilter = function() {
        return {
            isVisible: function(element, propertyKey) {
                return propertyKey.indexOf("_") !== 0;
            }
        };
    }();
    var Index = function() {
        function Index(name, type) {
            utils.checkExists("Name", name);
            utils.checkExists("Type", type);
            this.name = name;
            this.type = type;
            this.index = {};
        }
        utils.mixin(Index.prototype, {
            getIndexName: function() {
                return this.name;
            },
            getIndexType: function() {
                return this.type;
            },
            put: function(key, value, element) {
                utils.checkExists("Key", key);
                utils.checkExists("Value", value);
                utils.checkType("Element", element, this.type);
                var keyHash = this.index[key] = this.index[key] || {};
                var elements = keyHash[value] = keyHash[value] || {};
                elements[element.getId()] = element;
            },
            putAll: function(key, elements) {
                utils.checkExists("Key", key);
                utils.checkArray("Elements", elements);
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    utils.checkType("Element " + i, element, this.type);
                    var value = element.getProperty(key);
                    if (value) {
                        this.put(key, value, element);
                    }
                }
            },
            get: function(key, value) {
                var keyHash = this.index[key] || {};
                var elements = keyHash[value] || {};
                return utils.values(elements);
            },
            count: function(key, value) {
                return this.get(key, value).length;
            },
            remove: function(key, value, element) {
                utils.checkType("Element", element, this.type);
                var keyHash = this.index[key];
                if (keyHash) {
                    var elements = keyHash[value];
                    if (elements) {
                        delete elements[element.getId()];
                    }
                }
            },
            removeElement: function(element) {
                utils.checkType("Element", element, this.type);
                for (var key in this.index) {
                    var elements = this.index[key];
                    if (elements) {
                        for (var value in elements) {
                            delete elements[value][element.getId()];
                        }
                    }
                }
            },
            removeKey: function(key) {
                delete this.index[key];
            },
            getIndexedKeys: function() {
                return utils.keys(this.index);
            },
            update: function(key, newValue, oldValue, element) {
                if (utils.indexOf(key, this.getIndexedKeys()) > -1) {
                    if (!utils.isUndefined(oldValue)) {
                        this.remove(key, oldValue, element);
                    }
                    this.put(key, newValue, element);
                }
            }
        });
        return Index;
    }();
    var IndexManager = function() {
        function IndexManager(graph) {
            utils.checkExists("Graph", graph);
            this.graph = graph;
            this.indices = {};
            this.vertexKeyIndex = new Index(name, Vertex);
            this.edgeKeyIndex = new Index(name, Edge);
        }
        utils.mixin(IndexManager.prototype, {
            createIndex: function(name, type) {
                utils.checkExists("Name", name);
                utils.checkExists("Type", type);
                if (this.indices.hasOwnProperty(name)) {
                    throw {
                        message: "Index already exists"
                    };
                }
                var index = new Index(name, type);
                this.indices[name] = index;
                return index;
            },
            createKeyIndex: function(key, type) {
                if (type === Vertex) {
                    return indexElementsByKey(this.vertexKeyIndex, this.graph.getVertices(), key);
                } else if (type === Edge) {
                    return indexElementsByKey(this.edgeKeyIndex, this.graph.getEdges(), key);
                } else {
                    throw {
                        message: "Invalid type"
                    };
                }
            },
            getIndex: function(name, type) {
                var index = this.indices[name];
                if (utils.isUndefined(index)) {
                    return null;
                }
                if (type !== index.getIndexType()) {
                    throw {
                        message: "Invalid index type"
                    };
                }
                return index;
            },
            getIndices: function() {
                return utils.values(this.indices);
            },
            getIndexedKeys: function(type) {
                return this._getKeyIndex(type).getIndexedKeys();
            },
            dropIndex: function(name) {
                delete this.indices[name];
            },
            dropKeyIndex: function(key, type) {
                this._getKeyIndex(type).removeKey(key);
            },
            removeElement: function(element) {
                var indices = utils.values(this.indices);
                for (var i = 0; i < indices.length; i++) {
                    var index = indices[i];
                    if (utils.isOfType(element, index.getIndexType())) {
                        index.removeElement(element);
                    }
                }
                this._getKeyIndex(element.constructor).removeElement(element);
            },
            updateKeyIndexValue: function(key, newValue, oldValue, element) {
                this._getKeyIndex(element.constructor).update(key, newValue, oldValue, element);
            },
            removeKeyIndexValue: function(key, oldValue, element) {
                this._getKeyIndex(element.constructor).remove(key, oldValue, element);
            },
            fetchFirstMatching: function(type, filters) {
                var keys = this.getIndexedKeys(type);
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i];
                    if (filter.predicate === Compare.EQUAL && utils.indexOf(filter.key, keys) > -1) {
                        return this._getKeyIndex(type).get(filter.key, filter.value);
                    }
                }
                return null;
            },
            _getKeyIndex: function(type) {
                if (type === Vertex) {
                    return this.vertexKeyIndex;
                } else if (type === Edge) {
                    return this.edgeKeyIndex;
                } else {
                    throw {
                        message: "Invalid type"
                    };
                }
            }
        });
        function indexElementsByKey(index, elements, key) {
            index.removeKey(key);
            index.index[key] = {};
            index.putAll(key, elements);
            return index;
        }
        return IndexManager;
    }();
    var HasCondition = function() {
        function HasCondition(key, predicate, value, disabledFilters) {
            utils.checkExists("Key", key);
            utils.checkExists("Predicate", predicate);
            this.key = key;
            this.predicate = predicate;
            this.value = value;
            this.disabledFilters = disabledFilters;
        }
        utils.mixin(HasCondition.prototype, {
            matches: function(element) {
                return this.predicate.evaluate(element.getProperty(this.key, this.disabledFilters), this.value);
            }
        });
        return HasCondition;
    }();
    var LabelCondition = function() {
        function LabelCondition() {
            this.labels = utils.convertVarArgs(arguments);
        }
        utils.mixin(LabelCondition.prototype, {
            matches: function(element) {
                for (var i = 0; i < this.labels.length; i++) {
                    if (this.labels[i] === element.getLabel()) {
                        return true;
                    }
                }
                return false;
            }
        });
        return LabelCondition;
    }();
    var HasConditions = function() {
        return {
            initHasConditions: function() {
                this.hasConditions = [];
            },
            has: function(key, value1, value2, disabledFilters) {
                disabledFilters = disabledFilters || [];
                if (!utils.isUndefined(value2) && value2 !== null) {
                    this.hasConditions.push(new HasCondition(key, value1, value2, disabledFilters));
                } else if (!utils.isUndefined(value1) && value1 !== null) {
                    this.hasConditions.push(new HasCondition(key, Compare.EQUAL, value1, disabledFilters));
                } else {
                    this.hasConditions.push(new HasCondition(key, Compare.NOT_EQUAL, null, disabledFilters));
                }
                return this;
            },
            hasNot: function(key, value, disabledFilters) {
                disabledFilters = disabledFilters || [];
                if (utils.isUndefined(value) || value === null) {
                    this.hasConditions.push(new HasCondition(key, Compare.EQUAL, null, disabledFilters));
                } else {
                    this.hasConditions.push(new HasCondition(key, Compare.NOT_EQUAL, value, disabledFilters));
                }
                return this;
            },
            interval: function(key, startValue, endValue, disabledFilters) {
                disabledFilters = disabledFilters || [];
                this.hasConditions.push(new HasCondition(key, Compare.GREATER_THAN_EQUAL, startValue, disabledFilters));
                this.hasConditions.push(new HasCondition(key, Compare.LESS_THAN, endValue, disabledFilters));
                return this;
            }
        };
    }();
    var Compare = function() {
        return {
            EQUAL: {
                evaluate: function(first, second) {
                    return first === second;
                },
                displayName: "Equal to"
            },
            NOT_EQUAL: {
                evaluate: function(first, second) {
                    return first !== second;
                },
                displayName: "Not equal to"
            },
            GREATER_THAN: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first > second;
                },
                displayName: "Greater than"
            },
            LESS_THAN: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first < second;
                },
                displayName: "Less than"
            },
            GREATER_THAN_EQUAL: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first >= second;
                },
                displayName: "Greater than or equal to"
            },
            LESS_THAN_EQUAL: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first <= second;
                },
                displayName: "Less than or equal to"
            }
        };
    }();
    var Contains = function() {
        return {
            IN: {
                evaluate: function(first, second) {
                    utils.checkArray("Second argument", second);
                    return utils.indexOf(first, second) > -1;
                }
            },
            HAS_ELEMENT: {
                evaluate: function(first, second) {
                    utils.checkArray("First argument", first);
                    return utils.indexOf(second, first) > -1;
                }
            },
            NOT_IN: {
                evaluate: function(first, second) {
                    utils.checkArray("Second argument", second);
                    return utils.indexOf(first, second) === -1;
                }
            }
        };
    }();
    var Query = function() {
        function filterElements(elements, filters, queryLimit, resultExtractor) {
            var count = 0;
            if (!utils.isArray(elements)) {
                elements = [ elements ];
            }
            var result = [];
            for (var i = 0; i < elements.length; i++) {
                var currentElements = elements[i];
                if (utils.isOfType(elements[i], Vertex) || utils.isOfType(elements[i], Edge)) {
                    currentElements = [ currentElements ];
                }
                for (var id in currentElements) {
                    var element = currentElements[id];
                    var filtered = false;
                    for (var j = 0; j < filters.length; j++) {
                        if (!filters[j].matches(element)) {
                            filtered = true;
                            break;
                        }
                    }
                    if (!filtered) {
                        if (++count <= queryLimit) {
                            if (resultExtractor) {
                                result.push(resultExtractor(element));
                            } else {
                                result.push(element);
                            }
                        } else {
                            return result;
                        }
                    }
                }
            }
            return result;
        }
        return utils.mixin({
            initQuery: function() {
                this.queryLimit = Number.MAX_VALUE;
                this.initHasConditions();
            },
            limit: function(limit) {
                this.queryLimit = limit;
                return this;
            },
            edges: function() {
                var elements = this.getInitialEdges();
                var filters = this.getBaseFilters();
                filters = filters.concat(this.hasConditions);
                return filterElements(elements, filters, this.queryLimit);
            },
            vertices: function() {
                var elements = this.getInitialVertices();
                var filters = this.getBaseFilters();
                filters = filters.concat(this.hasConditions);
                return filterElements(elements, filters, this.queryLimit, this.resultExtractor(this));
            }
        }, HasConditions);
    }();
    var VertexQuery = function() {
        function VertexQuery(vertex) {
            utils.checkExists("Vertex", vertex);
            this.initQuery();
            this.vertex = vertex;
            this.queryLabels = [];
            this.queryDirection = BOTH;
        }
        utils.mixin(VertexQuery.prototype, Query);
        utils.mixin(VertexQuery.prototype, {
            direction: function(direction) {
                utils.checkInArray("direction", direction, [ IN, OUT, BOTH ]);
                this.queryDirection = direction;
                return this;
            },
            labels: function() {
                this.queryLabels = utils.convertVarArgs(arguments);
                return this;
            },
            getInitialEdges: function() {
                return filterByDirection(this.queryDirection, this.vertex);
            },
            getInitialVertices: function() {
                return filterByDirection(this.queryDirection, this.vertex);
            },
            getBaseFilters: function() {
                return this.queryLabels.length > 0 ? [ new LabelCondition(this.queryLabels) ] : [];
            },
            resultExtractor: function(self) {
                return function(edge) {
                    if (self.queryDirection === IN) {
                        return edge.getOutVertex();
                    } else if (self.queryDirection === OUT) {
                        return edge.getInVertex();
                    } else if (edge.getOutVertex() === self.vertex) {
                        return edge.getInVertex();
                    } else {
                        return edge.getOutVertex();
                    }
                };
            },
            count: function() {
                return this.edges().length;
            }
        });
        function filterByDirection(direction, vertex) {
            var edges = [];
            if (direction === IN) {
                edges.push(vertex.inEdges);
            } else if (direction === OUT) {
                edges.push(vertex.outEdges);
            } else {
                edges.push(vertex.inEdges);
                edges.push(vertex.outEdges);
            }
            return edges;
        }
        return VertexQuery;
    }();
    var GraphQuery = function() {
        function GraphQuery(graph) {
            utils.checkExists("Graph", graph);
            this.initQuery();
            this.graph = graph;
        }
        utils.mixin(GraphQuery.prototype, Query);
        utils.mixin(GraphQuery.prototype, {
            getInitialEdges: function() {
                var edges = this.graph.indexManager.fetchFirstMatching(Edge, this.hasConditions);
                if (!edges) {
                    edges = this.graph.edges;
                }
                return edges;
            },
            getInitialVertices: function() {
                var vertices = this.graph.indexManager.fetchFirstMatching(Vertex, this.hasConditions);
                if (!vertices) {
                    vertices = this.graph.vertices;
                }
                return vertices;
            },
            getBaseFilters: function() {
                return [];
            },
            resultExtractor: function() {
                return function(vertex) {
                    return vertex;
                };
            }
        });
        return GraphQuery;
    }();
    var Timer = function() {
        var lastTime = 0;
        var vendors = [ "ms", "moz", "webkit", "o" ];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
            window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() {'use strict';
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
        function Timer(callback, scope) {
            utils.checkExists("Callback", callback);
            this.callback = callback;
            this.scope = scope;
            var id;
            var start = function() {
                id = window.requestAnimationFrame(start);
                callback.apply(scope);
            };
            var stop = function() {
                window.cancelAnimationFrame(id);
            };
            return {
                start: start,
                stop: stop
            };
        }
        return Timer;
    }();
    var BoundingBoxCalculator = function() {
        function BoundingBoxCalculator(padding, lineHeight, numberOfLines) {
            this.width = 0;
            this.padding = padding || 0;
            this.lineHeight = lineHeight || 0;
            this.numberLines = numberOfLines || 0;
            this.heightWithPadding = lineHeight * numberOfLines + 2 * padding;
        }
        utils.mixin(BoundingBoxCalculator.prototype, {
            addElement: function(element) {
                var elementWidth = element.getBBox().width;
                this.width = elementWidth > this.width ? elementWidth : this.width;
            },
            leftEdge: function() {
                return -this.totalWidth() / 2;
            },
            rightEdge: function() {
                return this.totalWidth() / 2;
            },
            topEdge: function() {
                return -this.heightWithPadding / 2;
            },
            bottomEdge: function() {
                return this.heightWithPadding / 2;
            },
            totalWidth: function() {
                return this.width + this.padding * 2;
            },
            totalHeight: function() {
                return this.heightWithPadding;
            }
        });
        return BoundingBoxCalculator;
    }();
    var RandomLayout = function() {
        var padding = 10;
        function RandomLayout(duration, easing) {
            this.running = true;
            this.tween = new Tween(duration, easing);
            this.name = "random";
        }
        var calculateScale = function(width, height, numberOfVertices) {
            var areaRatio = width * height / (NODE_WIDTH * NODE_WIDTH * numberOfVertices);
            return areaRatio > 1 ? 1 : areaRatio;
        };
        utils.mixin(RandomLayout.prototype, {
            step: function(vertices, edges, width, height) {
                var finishedVertices = vertices.length;
                if (this.running) {
                    finishedVertices = 0;
                    var scale = calculateScale(width, height, vertices.length);
                    var cx = width * (.5 / scale);
                    var cy = height * (.5 / scale);
                    for (var i = 0; i < vertices.length; i++) {
                        var vertex = vertices[i];
                        if (vertex.started) {
                            this.tween.runFrame(vertex, scale);
                            if (vertex.finished) {
                                finishedVertices++;
                            }
                        } else {
                            RandomLayout.setBeginPoint(vertex, cx, cy);
                            vertex.endX = utils.randomInteger(0, width + 1);
                            vertex.endX = Math.max(vertex.endX, NODE_WIDTH / 2 + padding);
                            vertex.endX = Math.min(vertex.endX, width - NODE_WIDTH / 2 - padding);
                            vertex.endY = utils.randomInteger(0, height + 1);
                            vertex.endY = Math.max(vertex.endY, NODE_WIDTH / 2 + padding);
                            vertex.endY = Math.min(vertex.endY, height - NODE_WIDTH / 2 - padding);
                            this.tween.start(vertex, scale);
                        }
                    }
                }
                if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
                    vertices[0].vertex.getGraph().trigger("graphUpdated");
                }
                this.running = finishedVertices < vertices.length;
                return this.running;
            }
        });
        RandomLayout.setBeginPoint = function(uiVertex, cx, cy) {
            if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
                uiVertex.beginX = cx;
                uiVertex.beginY = cy;
                uiVertex.x = cx;
                uiVertex.y = cy;
            } else {
                uiVertex.beginX = uiVertex.x;
                uiVertex.beginY = uiVertex.y;
            }
        };
        return RandomLayout;
    }();
    var ForceDirectedLayout = function() {
        function ForceDirectedLayout() {}
        utils.mixin(ForceDirectedLayout.prototype, {
            step: function() {
                return true;
            }
        });
        return ForceDirectedLayout;
    }();
    var ElementRendererDecorator = function() {
        return {
            decorateRenderer: function(renderer) {
                this.elementRenderer = renderer;
                if (this.elementRenderer.asynch === true) {
                    this.asynch = true;
                }
            },
            init: function(element, container) {
                if (this.elementRenderer.asynch === true) {
                    var that = this;
                    this.elementRenderer.drawReadyCallback = function() {
                        var self = that;
                        return function(uiElement, element) {
                            self.doInit(uiElement, element);
                            if (self.drawReadyCallback) {
                                self.drawReadyCallback(uiElement, element);
                            }
                        };
                    }();
                    this.elementRenderer.init(element, container);
                } else {
                    this.elementRenderer.init(element, container);
                    this.doInit(element, container);
                }
            },
            initDefs: function(defs) {
                this.elementRenderer.initDefs(defs);
                this.doInitDefs(defs);
            },
            updatePosition: function(uiEdge) {
                this.elementRenderer.updatePosition(uiEdge);
                this.doUpdatePosition(uiEdge);
            },
            doInit: function() {},
            doInitDefs: function() {},
            doUpdatePosition: function() {}
        };
    }();
    var D3EdgeLabelDecorator = function() {
        function D3EdgeLabelDecorator(rendererToBeDecorated) {
            this.decorateRenderer(rendererToBeDecorated);
        }
        utils.mixin(D3EdgeLabelDecorator.prototype, ElementRendererDecorator);
        utils.mixin(D3EdgeLabelDecorator.prototype, {
            doInit: function(element, container) {
                var text = container.append("text").attr("id", "text-of-label-" + element.edge.id).attr("x", 10).attr("y", 100).attr("alignment-baseline", "central").attr("text-anchor", "middle").attr("class", "edge-label");
                text.append("tspan").attr("baseline-shift", "super").text(element.edge.label);
            }
        });
        return D3EdgeLabelDecorator;
    }();
    var D3VertexBorderDecorator = function() {
        function D3VertexBorderDecorator(rendererToBeDecorated) {
            this.decorateRenderer(rendererToBeDecorated);
            this.doInit = function(uiElement, container) {
                var vertex = uiElement.vertex;
                var instanceSettings = vertex.getGraph().getSettings();
                var borderColor = vertex.getProperty(instanceSettings.vertex.borderColorPropertyKey) || instanceSettings.vertex.borderColor;
                var borderWeight = vertex.getProperty(instanceSettings.vertex.borderWeightPropertyKey) || instanceSettings.vertex.borderWeight;
                var borderRadius = vertex.getProperty(instanceSettings.vertex.borderRadiusPropertyKey) || instanceSettings.vertex.borderRadius;
                var borderPadding = vertex.getProperty(instanceSettings.vertex.borderPaddingPropertyKey) || instanceSettings.vertex.borderPadding;
                var containerBox = container.node().getBBox();
                container.append("rect").attr("x", -containerBox.width / 2 - borderPadding).attr("y", -containerBox.height / 2 - borderPadding).attr("rx", borderRadius).attr("ry", borderRadius).attr("style", "fill:none;stroke:" + borderColor + ";stroke-width:" + borderWeight + "px;").attr("width", containerBox.width + 2 * borderPadding).attr("height", containerBox.height + 2 * borderPadding);
            };
        }
        utils.mixin(D3VertexBorderDecorator.prototype, ElementRendererDecorator);
        return D3VertexBorderDecorator;
    }();
    var D3VertexIconDecorator = function() {
        var ICON_SIZE = 16;
        var PADDING = 2;
        function D3VertexIconDecorator(rendererToBeDecorated) {
            this.decorateRenderer(rendererToBeDecorated);
        }
        utils.mixin(D3VertexIconDecorator.prototype, ElementRendererDecorator);
        utils.mixin(D3VertexIconDecorator.prototype, {
            doInit: function(uiElement, container) {
                var vertex = uiElement.vertex;
                var instanceSettings = vertex.getGraph().getSettings();
                var icons = vertex.getProperty(instanceSettings.vertex.vertexIconsPropertyKey);
                if (utils.isArray(icons)) {
                    var containerBox = container.node().getBBox();
                    var startX = -containerBox.width / 2 + PADDING;
                    for (var i = 0; i < icons.length; i++) {
                        var icon = icons[i];
                        var fillColor = icon.color || instanceSettings.vertex.iconDefaultColor;
                        container.append("use").attr("xlink:href", "#" + icon.id).attr("x", startX + i * (ICON_SIZE + PADDING)).attr("y", containerBox.height / 2 - ICON_SIZE - PADDING).attr("fill", fillColor);
                    }
                }
            },
            doInitDefs: function(defs) {
                defs.append("path").attr("id", "icon-spam").attr("d", "M16 11.5l-4.5-11.5h-7l-4.5 4.5v7l4.5 " + "4.5h7l4.5-4.5v-7l-4.5-4.5zM9 13h-2v-2h2v2zM9 9h-2v-6h2v6z");
                defs.append("path").attr("id", "icon-airplane").attr("d", "M12 9.999l-2.857-2.857 6.857-5.143-2-2-8.571 " + "3.429-2.698-2.699c-0.778-0.778-1.864-0.964-2.414-0.414s-0.364 1.636 0.414 " + "2.414l2.698 2.698-3.429 8.572 2 2 5.144-6.857 2.857 2.857v4h2l1-3 3-1v-2l-4 0z");
            }
        });
        return D3VertexIconDecorator;
    }();
    var D3VertexLabelDecorator = function() {
        function D3VertexLabelDecorator(rendererToBeDecorated, settings) {
            this.decorateRenderer(rendererToBeDecorated);
            this.doInit = function(element, container) {
                var containerBox = container.node().getBBox();
                var edge = containerBox.height / 2;
                var padding = settings.padding;
                if (settings.labelTop) {
                    edge = -edge;
                    padding = -padding;
                }
                var yPosition = edge;
                yPosition += settings.labelInside ? -padding : padding;
                var label = element.vertex.getProperty(settings.labelPropertyKey);
                container.append("text").attr("class", "custom-label").attr("text-anchor", "middle").attr("y", yPosition).text(label);
            };
        }
        utils.mixin(D3VertexLabelDecorator.prototype, ElementRendererDecorator);
        return D3VertexLabelDecorator;
    }();
    var Engine = function() {
        return {
            init: function(settings, graph) {
                utils.checkExists("Container", settings.container);
                utils.checkExists("Graph", graph);
                if (utils.isFunction(this.initEngine)) {
                    this.initEngine(settings, graph);
                }
            },
            beforeRender: function() {},
            initVertex: function() {},
            renderVertex: function() {},
            stop: function() {}
        };
    }();
    var D3SvgImageDownloader = function() {
        function D3SvgImageDownloader(element, graph, disablePanControl) {
            this.svg = element;
            this.graph = graph;
            this.svg.attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns:xmlns:xlink", "http://www.w3.org/1999/xlink");
            this.imageVertices = this.svg.selectAll("image").size();
            this.disablePanControl = disablePanControl || false;
            this.existingElementStyles = [];
        }
        utils.mixin(D3SvgImageDownloader.prototype, {
            download: function() {
                this.graph.trigger("downloadStarted");
                hidePanControl(this);
                DomUtils.traverse(this.svg.node(), modifySvgElements, this);
                waitForImagesAndSave(this);
            }
        });
        function waitForImagesAndSave(ctx) {
            ctx.imageLoadedInterval = setInterval(saveAsImage, 100, ctx);
        }
        function saveAsImage(ctx) {
            if (ctx.imageVertices !== 0) {
                return;
            }
            var serializer = new XMLSerializer();
            var svgStr = serializer.serializeToString(ctx.svg.node());
            var image = new Image();
            image.onload = function() {
                var canvas = document.createElement("canvas");
                canvas.width = ctx.svg.attr("width");
                canvas.height = ctx.svg.attr("height");
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);
                var a = document.createElement("a");
                a.download = "image.png";
                a.href = canvas.toDataURL("image/png");
                document.body.appendChild(a);
                a.click();
                restoreSvg(ctx);
                ctx.graph.trigger("downloadFinished");
            };
            image.onerror = function() {
                console.log("Failed to save image.");
            };
            image.src = "data:image/svg+xml;base64," + window.btoa(svgStr);
            clearInterval(ctx.imageLoadedInterval);
        }
        function modifySvgElements(element, ctx) {
            changeImageSrcToBase64Uri(element, ctx);
            collectOriginalStyles(element, ctx);
            DomUtils.explicitlySetStyle(element, [ "defs" ], true);
        }
        function changeImageSrcToBase64Uri(element, ctx) {
            if (element.nodeName.toLowerCase() !== "image") {
                return;
            }
            var imageUrl = d3.select(element).attr("xlink:href");
            DomUtils.convertImgToBase64(imageUrl, function(img, dataUrl) {
                d3.select(element).attr("xlink:href", dataUrl);
                vertexImageLoaded(ctx);
            }, "image/png");
        }
        function vertexImageLoaded(ctx) {
            ctx.imageVertices--;
        }
        function collectOriginalStyles(element, ctx) {
            if (element.nodeType !== window.Node.ELEMENT_NODE || !element.hasAttribute("style")) {
                return;
            }
            var id = Math.floor(Math.random() * 1e5 + 1);
            var newClass = "has-style-" + element.tagName + "-" + id;
            var newClasses = element.getAttribute("class") + " " + newClass;
            element.setAttribute("class", newClasses);
            element.setAttribute("className", newClasses);
            ctx.existingElementStyles.push({
                id: newClass,
                style: element.getAttribute("style")
            });
        }
        function hidePanControl(ctx) {
            if (!ctx.disablePanControl) {
                return;
            }
            d3.select("#zoomPanControl").attr("style", "display:none;");
        }
        function restoreSvg(ctx) {
            ctx.svg.attr("style", null);
            ctx.svg.selectAll("*").attr("style", null);
            for (var i = 0; i < ctx.existingElementStyles.length; i++) {
                var currentStyle = ctx.existingElementStyles[i];
                var newClass = "." + currentStyle.id;
                var element = d3.select(ctx.svg.node().parentNode).select(newClass);
                element.attr("style", currentStyle.style);
                var classes = element.node().className.baseVal.split(" ");
                var indexOfId = classes.indexOf(currentStyle.id);
                classes.splice(indexOfId, 1);
                var newClasses = classes.join(" ");
                element.node().setAttribute("class", newClasses);
                element.node().setAttribute("className", newClasses);
            }
            d3.select("#zoomPanControl").attr("style", "display:block;");
        }
        return D3SvgImageDownloader;
    }();
    var D3ZoomPanManager = function() {
        function D3ZoomPanManager(container, defs, settings, graph) {
            this.scale = 1;
            this.translation = [ 0, 0 ];
            this.xScale = getXScale(settings);
            this.yScale = getYScale(settings);
            this.svg = container;
            this.svgDefs = defs;
            this.zoom = null;
            this.navigator = null;
            this.graphContainer = null;
            this.settings = settings;
            this.graph = graph;
        }
        utils.mixin(D3ZoomPanManager.prototype, {
            init: function() {
                var context = this;
                var zoomCallback = function() {
                    var settings = context.settings;
                    return function(newScale) {
                        if (!settings.zoom.enabled) {
                            return;
                        }
                        if (d3.event) {
                            this.scale = d3.event.scale;
                        } else {
                            this.scale = newScale;
                        }
                        if (settings.drag.enabled) {
                            var topBound = -settings.height * this.scale + settings.height, bottomBound = 0, leftBound = -settings.width * this.scale + settings.width, rightBound = 0;
                            this.translation = d3.event ? d3.event.translate : [ 0, 0 ];
                            this.translation = [ Math.max(Math.min(this.translation[0], rightBound), leftBound), Math.max(Math.min(this.translation[1], bottomBound), topBound) ];
                        }
                        d3.select(".panCanvas, .panCanvas .bg").attr("transform", "translate(" + this.translation + ")" + " scale(" + this.scale + ")");
                    };
                }();
                this.zoom = d3.behavior.zoom().x(this.xScale).y(this.yScale).scaleExtent([ this.settings.zoom.minScale, this.settings.zoom.maxScale ]).on("zoom.canvas", zoomCallback);
                initCommonDefs(this);
                this.navigator = initNavigator(this.zoom, this.settings, this.graph);
                initZoomPanControl(this.svg, this.zoom, this.settings, this.graph);
            },
            zoom: function(value) {
                if (!arguments.length) {
                    return this.zoom;
                }
                this.zoom = value;
                return this;
            },
            getNavigator: function() {
                return this.navigator;
            },
            getGraphContainer: function() {
                return this.graphContainer;
            }
        });
        function getXScale(settings) {
            return d3.scale.linear().domain([ -settings.width / 2, settings.width / 2 ]).range([ 0, settings.width ]);
        }
        function getYScale(settings) {
            return d3.scale.linear().domain([ -settings.height / 2, settings.height / 2 ]).range([ settings.height, 0 ]);
        }
        function initNavigator(zoom, settings, graph) {
            if (!utils.exists(settings.navigatorContainer) || !settings.navigator.enabled) {
                return null;
            }
            var navigatorSvg = d3.select(settings.navigatorContainer).append("svg").attr("width", settings.width * settings.navigator.scale).attr("height", settings.height * settings.navigator.scale).attr("class", "svg canvas");
            return new D3Navigator(navigatorSvg, zoom, d3.select("#panCanvas"), settings, graph);
        }
        function initZoomPanControl(container, zoom, settings, graph) {
            var zoomPanControl = new D3ZoomPanControl(container, zoom, d3.select("#panCanvas"), settings, graph);
            zoomPanControl.render();
        }
        function initCommonDefs(context) {
            context.svgDefs.append("clipPath").attr("id", "wrapperClipPath").attr("class", "wrapper clipPath").append("rect").attr("class", "background").attr("width", context.settings.width).attr("height", context.settings.height);
            var outerWrapper = context.svg.append("g").attr("id", "outerWrapper").attr("class", "wrapper outer");
            outerWrapper.append("rect").attr("class", "background").attr("width", context.settings.width).attr("height", context.settings.height);
            var innerWrapper = outerWrapper.append("g").attr("class", "wrapper inner").attr("clip-path", "url(#wrapperClipPath)").call(context.zoom);
            innerWrapper.append("rect").attr("class", "background").attr("width", context.settings.width).attr("height", context.settings.height);
            var panCanvas = innerWrapper.append("g").attr("id", "panCanvas").attr("class", "panCanvas").attr("width", context.settings.width).attr("height", context.settings.height).attr("transform", "translate(0,0)");
            panCanvas.append("rect").attr("class", "background").attr("width", context.settings.width).attr("height", context.settings.height);
            context.graphContainer = panCanvas.append("g").attr("id", "graphElements").attr("transform", "scale(0.5)");
        }
        return D3ZoomPanManager;
    }();
    var D3VertexManager = function() {
        function D3VertexManager(element) {
            this.element = element;
        }
        utils.mixin(D3VertexManager.prototype, {
            addDragToVertices: function() {
                var drag = d3.behavior.drag();
                drag.on("dragstart", function(uiVertex) {
                    d3.event.sourceEvent.stopPropagation();
                    var graph = uiVertex.vertex.getGraph();
                    graph.trigger("vertexDragStart", uiVertex);
                });
                drag.on("drag", function(uiVertex) {
                    uiVertex.x = d3.event.x;
                    uiVertex.y = d3.event.y;
                    var graph = uiVertex.vertex.getGraph();
                    graph.trigger("vertexDrag", uiVertex);
                });
                drag.on("dragend", function(uiVertex) {
                    var graph = uiVertex.vertex.getGraph();
                    graph.trigger("vertexDragEnd", uiVertex);
                });
                this.element.call(drag);
            }
        });
        return D3VertexManager;
    }();
    var D3Navigator = function() {
        function D3Navigator(selection, zoom, target, settings, graph) {
            this.navigatorScale = settings.navigator.scale;
            this.scale = 1;
            this.zoom = zoom;
            this.target = target;
            this.width = settings.width;
            this.height = settings.height;
            this.frameX = 0;
            this.frameY = 0;
            this.renderNavigator = true;
            this.graph = graph;
            if (!shouldShowNavigator()) {
                D3Navigator.render = function() {};
                return;
            }
            initDefs(selection, this.width, this.height);
            this.base = selection;
            this.container = this.base.append("g").attr("class", "navigator").attr("clip-path", "url(#navigatorClipPath)").call(this.zoom);
            var navigatorClipPath = this.container.append("g");
            var navigator = this;
            this.zoom.on("zoom.navigator", function() {
                navigator.scale = d3.event.scale;
            });
            this.node = navigatorClipPath.node();
            this.frame = navigatorClipPath.append("g").attr("class", "frame");
            this.frame.append("rect").attr("class", "background").attr("width", this.width).attr("height", this.height);
            var navigatorDrag = d3.behavior.drag().on("dragstart.navigator", function() {
                onDragstart(navigator);
            }).on("drag.navigator", function() {
                onDrag(navigator);
            });
            this.frame.call(navigatorDrag);
            graph.on("graphUpdated", function() {
                navigator.renderNavigator = true;
            });
            graph.on("vertexDrag", function() {
                navigator.renderNavigator = true;
            });
        }
        utils.mixin(D3Navigator.prototype, {
            render: function() {
                var targetTransform = SvgUtils.getXYFromTranslate(this.target.attr("transform"));
                this.frame.attr("transform", "translate(" + -targetTransform[0] / this.scale + "," + -targetTransform[1] / this.scale + ")").select(".background").attr("width", this.width / this.scale).attr("height", this.height / this.scale);
                if (!this.renderNavigator) {
                    return;
                }
                this.scale = this.zoom.scale();
                this.container.attr("transform", "scale(" + this.navigatorScale + ")");
                var node = this.target.node().cloneNode(true);
                node.removeAttribute("id");
                d3.selectAll(".navigator .panCanvas").remove();
                this.base.selectAll(".navigator .canvas").remove();
                this.node.appendChild(node);
                this.frame.node().parentNode.appendChild(this.frame.node());
                d3.select(node).attr("transform", "translate(1,1)");
                this.renderNavigator = false;
            }
        });
        function shouldShowNavigator() {
            return settings.zoom.enabled && settings.navigator.enabled;
        }
        function onDragstart(navigator) {
            var frameTranslate = SvgUtils.getXYFromTranslate(navigator.frame.attr("transform"));
            navigator.frameX = parseInt(frameTranslate[0], 10);
            navigator.frameY = parseInt(frameTranslate[1], 10);
        }
        function onDrag(navigator) {
            var topBound = 0, bottomBound = navigator.height - navigator.height / navigator.scale, leftBound = 0, rightBound = navigator.width - navigator.width / navigator.scale;
            d3.event.sourceEvent.stopImmediatePropagation();
            navigator.frameX += d3.event.dx;
            navigator.frameY += d3.event.dy;
            navigator.frameX = Math.max(Math.min(navigator.frameX, rightBound), leftBound);
            navigator.frameY = Math.max(Math.min(navigator.frameY, bottomBound), topBound);
            navigator.frame.attr("transform", "translate(" + navigator.frameX + "," + navigator.frameY + ")");
            var translate = [ -navigator.frameX * navigator.scale, -navigator.frameY * navigator.scale ];
            navigator.target.attr("transform", "translate(" + translate + ")scale(" + navigator.scale + ")");
            navigator.zoom.translate(translate);
        }
        function initDefs(svg, width, height) {
            var svgDefs = svg.append("defs");
            svgDefs.append("clipPath").attr("id", "navigatorClipPath").attr("class", "navigator clipPath").attr("width", width).attr("height", height).append("rect").attr("class", "background").attr("width", width).attr("height", height);
        }
        return D3Navigator;
    }();
    var D3ZoomPanControl = function() {
        function D3ZoomPanControl(container, zoom, target, settings, graph) {
            this.base = container;
            this.width = settings.width;
            this.height = settings.height;
            this.zoom = zoom;
            this.target = target;
            this.zoomScale = settings.zoomPanControl.zoomStep;
            this.panScale = settings.zoomPanControl.panStep;
            this.x = settings.zoomPanControl.paddingLeft;
            this.y = settings.zoomPanControl.paddingTop;
            this.graph = graph;
            var control = this;
            this.graph.on("graphZoomOut", function() {
                doZoom(control, -7);
            });
        }
        utils.mixin(D3ZoomPanControl.prototype, {
            render: function() {
                if (!settings.zoomPanControl.enabled) {
                    return;
                }
                var container = this.base.append("g").attr("id", "zoomPanControl");
                container.append("circle").attr("class", "wrapperCircle").attr("cx", 50).attr("cy", 50).attr("r", 42);
                container.append("path").attr("id", "panUp").attr("class", "zoomPanButton").attr("d", "M50 10 l12   20 a40, 70 0 0,0 -24,  0z");
                container.append("path").attr("id", "panLeft").attr("class", "zoomPanButton").attr("d", "M10 50 l20  -12 a70, 40 0 0,0   0, 24z");
                container.append("path").attr("id", "panDown").attr("class", "zoomPanButton").attr("d", "M50 90 l12  -20 a40, 70 0 0,1 -24,  0z");
                container.append("path").attr("id", "panRight").attr("class", "zoomPanButton").attr("d", "M90 50 l-20 -12 a70, 40 0 0,1   0, 24z");
                container.append("circle").attr("class", "compass").attr("cx", 50).attr("cy", 50).attr("r", 20);
                container.append("circle").attr("id", "zoomOut").attr("class", "zoomPanButton").attr("cx", 50).attr("cy", 41).attr("r", 8);
                container.append("circle").attr("id", "zoomIn").attr("class", "zoomPanButton").attr("cx", 50).attr("cy", 59).attr("r", 8);
                container.append("rect").attr("class", "plus-minus").attr("x", 46).attr("y", 39.5).attr("width", 8).attr("height", 3);
                container.append("rect").attr("class", "plus-minus").attr("x", 46).attr("y", 57.5).attr("width", 8).attr("height", 3);
                container.append("rect").attr("class", "plus-minus").attr("x", 48.5).attr("y", 55).attr("width", 3).attr("height", 8);
                container.attr("transform", "translate(" + this.x + "," + this.y + ")");
                var control = this;
                d3.select("#panUp").on("click", function() {
                    doPan(control, {
                        x: 0,
                        y: control.panScale
                    });
                });
                d3.select("#panDown").on("click", function() {
                    doPan(control, {
                        x: 0,
                        y: -control.panScale
                    });
                });
                d3.select("#panLeft").on("click", function() {
                    doPan(control, {
                        x: control.panScale,
                        y: 0
                    });
                });
                d3.select("#panRight").on("click", function() {
                    doPan(control, {
                        x: -control.panScale,
                        y: 0
                    });
                });
                d3.select("#zoomIn").on("click", function() {
                    doZoom(control, control.zoomScale);
                });
                d3.select("#zoomOut").on("click", function() {
                    doZoom(control, -control.zoomScale);
                });
            }
        });
        function doZoom(context, newScaleStep) {
            var targetTransform = SvgUtils.getXYFromTranslate(context.target.attr("transform"));
            var scale = context.zoom.scale();
            var newScale = scale + newScaleStep;
            var originalCanvas = {
                w: context.width * scale,
                h: context.height * scale
            };
            var newCanvas = {
                w: context.width * newScale,
                h: context.height * newScale
            };
            var xScale = (originalCanvas.w - newCanvas.w) / 2;
            var yScale = (originalCanvas.h - newCanvas.h) / 2;
            var newTransform = [ xScale + targetTransform[0], yScale + targetTransform[1] ];
            newScale = Math.min(context.zoom.scaleExtent()[1], Math.max(context.zoom.scaleExtent()[0], newScale));
            var topBound = -context.height * newScale + context.height, bottomBound = 0, leftBound = -context.width * newScale + context.width, rightBound = 0;
            var translation = [ Math.max(Math.min(newTransform[0], rightBound), leftBound), Math.max(Math.min(newTransform[1], bottomBound), topBound) ];
            context.target.attr("transform", "translate(" + translation + ")scale(" + newScale + ")");
            context.zoom.translate(translation).scale(newScale);
        }
        function doPan(context, translation) {
            var scale = context.zoom.scale();
            var topBound = -context.height * scale + context.height, bottomBound = 0, leftBound = -context.width * scale + context.width, rightBound = 0;
            var targetTransform = SvgUtils.getXYFromTranslate(context.target.attr("transform"));
            var frameX = targetTransform[0];
            var frameY = targetTransform[1];
            frameX += translation.x;
            frameY += translation.y;
            frameX = Math.max(Math.min(frameX, rightBound), leftBound);
            frameY = Math.max(Math.min(frameY, bottomBound), topBound);
            context.target.attr("transform", "translate(" + [ frameX, frameY ] + ")scale(" + scale + ")");
            context.zoom.translate([ frameX, frameY ]);
        }
        return D3ZoomPanControl;
    }();
    var D3Engine = function() {
        function D3Engine() {}
        utils.mixin(D3Engine.prototype, Engine);
        utils.mixin(D3Engine.prototype, {
            initEngine: function(settings, graph) {
                this.graph = graph;
                this.settings = settings;
                var svg = this.svg = d3.select(settings.container).append("svg").attr("id", "graph-canvas").attr("class", "svg canvas").attr("width", settings.width).attr("height", settings.height);
                svg.append("rect").attr("class", "overlay").attr("width", settings.width).attr("height", settings.height);
                var defs = svg.append("defs");
                this.zoomPanManager = new D3ZoomPanManager(svg, defs, settings, graph);
                this.zoomPanManager.init();
                var d3Renderers = ElementRendererProvider.getAll("d3", settings);
                for (var i = 0; i < d3Renderers.length; i++) {
                    if (typeof d3Renderers[i].initDefs === "function") {
                        d3Renderers[i].initDefs(defs);
                    }
                }
            },
            beforeRender: function(vertices, edges) {
                var edgeSet = bindData(this.zoomPanManager.getGraphContainer(), "edge", edges);
                addEnterSection("edge", edgeSet);
                var vertexSet = bindData(this.zoomPanManager.getGraphContainer(), "vertex", vertices);
                var vertexEnter = addEnterSection("vertex", vertexSet);
                translateVertices(vertexSet);
                var vertexManager = new D3VertexManager(vertexEnter);
                vertexManager.addDragToVertices();
                updateEdgePositions(edgeSet);
                var navigator = this.zoomPanManager.getNavigator();
                if (navigator !== null) {
                    navigator.render();
                }
            },
            saveAsImage: function() {
                var imageDownloader = new D3SvgImageDownloader(d3.select("#graph-canvas"), this.graph, true);
                imageDownloader.download();
            },
            stop: function() {
                d3.select(this.settings.container).selectAll("*").remove();
                d3.select(this.settings.navigatorContainer).selectAll("*").remove();
            }
        });
        function bindData(svg, type, elements) {
            return svg.selectAll("." + type).data(elements, function(uiElement) {
                return uiElement.id;
            });
        }
        function addEnterSection(type, elementSet) {
            var element = elementSet.enter().append("g");
            element.attr("class", function(uiElement) {
                var elementType = uiElement[type].getPropertyUnfiltered(PROP_TYPE);
                var clazz = type;
                if (elementType) {
                    clazz += " " + elementType;
                }
                return clazz;
            });
            element.each(function(uiElement) {'use strict';
                var elementRenderer = ElementRendererProvider.getRenderer(uiElement[type], "d3", type);
                uiElement.g = d3.select(this);
                elementRenderer.init(uiElement, uiElement.g);
            });
            element.on("click", function(uiElement) {
                var graph = uiElement[type].getGraph();
                graph.trigger(type + "Clicked", uiElement);
            });
            elementSet.exit().remove();
            return element;
        }
        function translateVertices(vertexSet) {
            vertexSet.attr("transform", function(uiVertex) {
                return "translate(" + uiVertex.x + "," + uiVertex.y + ")";
            });
        }
        function updateEdgePositions(edgeSet) {
            edgeSet.each(function(uiEdge) {'use strict';
                var edgeRenderer = ElementRendererProvider.getRenderer(uiEdge.edge, "d3", "edge");
                edgeRenderer.updatePosition(uiEdge);
            });
        }
        return D3Engine;
    }();
    var D3DirectedLineEdgeRenderer = function() {
        function D3DirectedLineEdgeRenderer() {}
        utils.mixin(D3DirectedLineEdgeRenderer.prototype, {
            init: function(uiEdge, element) {
                var edge = uiEdge.edge;
                var instanceSettings = edge.getGraph().getSettings();
                var lineWeight = edge.getProperty(instanceSettings.edge.lineWeightPropertyKey) || instanceSettings.edge.defaultLineWeight;
                var markerEnd = instanceSettings.edge.useArrows ? "url(#arrow)" : "";
                uiEdge.uiElement = element.append("path").attr("id", "edgeLabel").attr("class", "directed-edge arrow").attr("marker-end", markerEnd).attr("style", "stroke-width: " + lineWeight + "px;");
                if (edge.label === "references") {
                    uiEdge.uiElement.attr("stroke-dasharray", "5,5");
                }
            },
            initDefs: function(defs) {
                defs.append("marker").attr("id", "arrow").attr("refX", 10).attr("refY", 2).attr("markerWidth", 10).attr("markerHeight", 4).attr("orient", "auto").append("path").attr("d", "M0,0L10,2L0,4");
            },
            updatePosition: function(edge) {
                var line = edge.uiElement;
                var calculator = new DirectedLineEdgeCalculator(edge);
                var edgeProprties = calculator.calculate();
                d3.select("#text-of-label-" + edge.id).attr("x", edgeProprties.labelPosition.x);
                d3.select("#text-of-label-" + edge.id).attr("y", edgeProprties.labelPosition.y);
                line.attr("id", "edgeLabel" + edge.id);
                line.attr("d", "M" + edgeProprties.startPoint.x + "," + edgeProprties.startPoint.y + "A " + edgeProprties.radiusX + " " + edgeProprties.radiusY + " " + edgeProprties.xAxisRotation + " 0 " + edgeProprties.sweepFlag + " " + edgeProprties.endPoint.x + " " + edgeProprties.endPoint.y);
            }
        });
        return D3DirectedLineEdgeRenderer;
    }();
    var DirectedLineEdgeCalculator = function() {
        function DirectedLineEdgeCalculator(edge) {
            this.edge = edge;
        }
        var calculateRadius = function(actualEdge, countOfEdges, distanceOfMidpoints) {
            var radiusConstant = 25e3 / distanceOfMidpoints;
            radiusConstant = Math.min(radiusConstant, 105);
            radiusConstant = Math.max(radiusConstant, 55);
            var diameter = (countOfEdges - 1) * radiusConstant;
            var maxRadius = diameter / 2;
            return Math.abs(-maxRadius + actualEdge * radiusConstant);
        };
        var calculateMidPointByIntersection = function(intersection, element) {
            var uiElement = element.uiElement;
            var width = uiElement[0][0].getBBox().width;
            var height = uiElement[0][0].getBBox().height;
            return GeometryUtils.findClosestMidpointToIntersection(intersection, element, width, height);
        };
        var countSiblingsAndFindCurrent = function(edge) {
            var inVertexEdges = edge.inVertex.vertex.getEdges(BOTH);
            var indexOfCurrentEdge = 0, siblingEdges = 0;
            for (var i = 0; i < inVertexEdges.length; i++) {
                if (!inVertexEdges[i].connects(edge.outVertex, edge.inVertex)) {
                    continue;
                }
                if (edge.id < inVertexEdges[i].id) {
                    indexOfCurrentEdge++;
                }
                siblingEdges++;
            }
            return {
                indexOfCurrentEdge: indexOfCurrentEdge,
                siblingEdges: siblingEdges
            };
        };
        var calculateLabelPosition = function(radius, midPointOfDistance, isEdgeBelowCenter, sinAlpha, cosAlpha) {
            var labelX = radius / 1.75 * sinAlpha;
            var labelY = radius / 1.75 * cosAlpha;
            labelX = isEdgeBelowCenter ? -labelX : labelX;
            labelY = isEdgeBelowCenter ? -labelY : labelY;
            return {
                x: midPointOfDistance.x + labelX,
                y: midPointOfDistance.y - labelY
            };
        };
        utils.mixin(DirectedLineEdgeCalculator.prototype, {
            calculate: function() {
                var inWidth = SvgUtils.widthOf(this.edge.inVertex), inHeight = SvgUtils.heightOf(this.edge.inVertex), outWidth = SvgUtils.widthOf(this.edge.outVertex), outHeight = SvgUtils.heightOf(this.edge.outVertex);
                var inVertexRect = new Rectangle(this.edge.inVertex.x - inWidth / 2, this.edge.inVertex.y - inHeight / 2, inWidth, inHeight);
                var outVertexRect = new Rectangle(this.edge.outVertex.x - outWidth / 2, this.edge.outVertex.y - outHeight / 2, outWidth, outHeight);
                var intersectionOnOutVertex = GeometryUtils.findIntersectionOnClosestSide(outVertexRect, inVertexRect);
                var intersectionOnInVertex = GeometryUtils.findIntersectionOnClosestSide(inVertexRect, outVertexRect);
                var inEdgeMidPoint = calculateMidPointByIntersection(intersectionOnInVertex, this.edge.inVertex);
                var outEdgeMidPoint = calculateMidPointByIntersection(intersectionOnOutVertex, this.edge.outVertex);
                var distanceOfMidPoints = GeometryUtils.distanceOfPoints(inEdgeMidPoint.point, outEdgeMidPoint.point);
                var connectedEdges = countSiblingsAndFindCurrent(this.edge);
                var radius = calculateRadius(connectedEdges.indexOfCurrentEdge, connectedEdges.siblingEdges, distanceOfMidPoints);
                var isEdgeBelowCenter = connectedEdges.indexOfCurrentEdge < connectedEdges.siblingEdges / 2;
                var isAboveInOut = GeometryUtils.isAbove(inEdgeMidPoint.point, outEdgeMidPoint.point);
                var isLeftInOut = GeometryUtils.isLeftOf(inEdgeMidPoint.point, outEdgeMidPoint.point);
                var referenceVertex = this.edge.inVertex.id > this.edge.outVertex.id ? this.edge.inVertex : this.edge.outVertex;
                var direction = this.edge.inVertex === referenceVertex;
                var referencePoint = this.edge.inVertex.id > this.edge.outVertex.id ? inEdgeMidPoint.point : outEdgeMidPoint.point;
                var otherPoint = this.edge.inVertex.id > this.edge.outVertex.id ? outEdgeMidPoint.point : inEdgeMidPoint.point;
                var sinAlphaAbs = Math.abs(inEdgeMidPoint.point.y - outEdgeMidPoint.point.y) / distanceOfMidPoints;
                var alpha = Math.asin(sinAlphaAbs) * 180 / Math.PI;
                var sinAlpha = (referencePoint.y - otherPoint.y) / distanceOfMidPoints;
                var cosAlpha = (referencePoint.x - otherPoint.x) / distanceOfMidPoints;
                var midPointOfDistance = new Point((inEdgeMidPoint.point.x + outEdgeMidPoint.point.x) / 2, (inEdgeMidPoint.point.y + outEdgeMidPoint.point.y) / 2);
                return {
                    startPoint: {
                        x: outEdgeMidPoint.point.x,
                        y: outEdgeMidPoint.point.y
                    },
                    endPoint: {
                        x: inEdgeMidPoint.point.x,
                        y: inEdgeMidPoint.point.y
                    },
                    labelPosition: calculateLabelPosition(radius, midPointOfDistance, isEdgeBelowCenter, sinAlpha, cosAlpha),
                    radiusX: distanceOfMidPoints * .55,
                    radiusY: radius,
                    xAxisRotation: isAboveInOut === isLeftInOut ? alpha : -alpha,
                    sweepFlag: direction !== isEdgeBelowCenter ? 1 : 0
                };
            }
        });
        return DirectedLineEdgeCalculator;
    }();
    var D3LineEdgeRenderer = function() {
        function D3LineEdgeRenderer() {}
        utils.mixin(D3LineEdgeRenderer.prototype, {
            init: function(uiEdge, element) {
                var edge = uiEdge.edge;
                var instanceSettings = edge.getGraph().getSettings();
                var lineWeight = edge.getProperty(instanceSettings.edge.lineWeightPropertyKey) || instanceSettings.edge.defaultLineWeight;
                uiEdge.uiElement = element.append("line").attr("style", "stroke-width: " + lineWeight + "px;");
            },
            initDefs: function() {},
            updatePosition: function(edge) {
                var line = edge.uiElement;
                line.attr("x1", function(uiEdge) {
                    return uiEdge.inVertex.x;
                });
                line.attr("y1", function(uiEdge) {
                    return uiEdge.inVertex.y;
                });
                line.attr("x2", function(uiEdge) {
                    return uiEdge.outVertex.x;
                });
                line.attr("y2", function(uiEdge) {
                    return uiEdge.outVertex.y;
                });
            }
        });
        return D3LineEdgeRenderer;
    }();
    var D3ImageVertexRenderer = function() {
        function D3ImageVertexRenderer() {
            this.asynch = true;
        }
        utils.mixin(D3ImageVertexRenderer.prototype, {
            init: function(uiVertex, element) {
                var vertex = uiVertex.vertex;
                uiVertex.uiElement = element;
                var instanceSettings = vertex.getGraph().getSettings();
                var imageUrl = vertex.getProperty(instanceSettings.vertex.imageUrlPropertyKey);
                var image = element.append("svg:image").attr("xlink:href", imageUrl);
                var self = this;
                var img = new Image();
                img.src = imageUrl;
                img.onload = function() {
                    var width = this.width;
                    var height = this.height;
                    image.attr("width", width).attr("height", height).attr("x", -width / 2).attr("y", -height / 2);
                    vertex.getGraph().trigger("graphUpdated");
                    self.drawReadyCallback(uiVertex, element);
                };
            },
            initDefs: function() {}
        });
        return D3ImageVertexRenderer;
    }();
    var D3QueryResultVertexRenderer = function() {
        function D3QueryResultVertexRenderer() {}
        utils.mixin(D3QueryResultVertexRenderer.prototype, {
            init: function(uiVertex, element) {
                var vertex = uiVertex.vertex;
                var queryVertexReference = vertex.getPropertyUnfiltered("_queryVertexReference");
                var entityType = vertex.getPropertyUnfiltered("entityType");
                var lineHeight = 25;
                var boxPadding = 10;
                var propertyKeys = vertex.getPropertyKeys();
                var numberOfLines = propertyKeys.length + 1;
                var currentHeight = -(numberOfLines * lineHeight) / 2 + lineHeight / 2;
                var boundingBoxCalculator = new BoundingBoxCalculator(boxPadding, lineHeight, numberOfLines);
                uiVertex.uiElement = element;
                var header = element.append("g").attr("class", "query-result-vertex-header");
                var entityTypeLabel = header.append("text").attr("class", "entity-type-label").attr("text-anchor", "start").attr("y", currentHeight).text(entityType);
                var queryVertexRefLabel = header.append("text").attr("class", "query-vertex-ref-label").attr("text-anchor", "end").attr("y", currentHeight).text(queryVertexReference);
                var iconSize = 16;
                var zoomInIcon = header.append("use").attr("xlink:href", "#icon-zoomin").attr("y", currentHeight - iconSize + 2);
                boundingBoxCalculator.addElement(header[0][0]);
                for (var i = 0; i < propertyKeys.length; i++) {
                    var propertyKey = propertyKeys[i];
                    var propertyValue = vertex.getProperty(propertyKey);
                    currentHeight += lineHeight;
                    var propertyText = element.append("text").attr("text-anchor", "middle").attr("x", 0).attr("y", currentHeight);
                    propertyText.append("tspan").attr("class", "property-name-label").text(propertyKey + ": ");
                    propertyText.append("tspan").text(propertyValue);
                    boundingBoxCalculator.addElement(propertyText[0][0]);
                }
                var linePadding = 5;
                var totalWidth = boundingBoxCalculator.totalWidth();
                var minWidth = header[0][0].getBBox().width + 5 * boxPadding;
                var totalHeight = boundingBoxCalculator.totalHeight();
                var dividerY = -(totalHeight / 2 - lineHeight) + linePadding;
                var leftEdge;
                var rightEdge;
                if (totalWidth > minWidth) {
                    leftEdge = boundingBoxCalculator.leftEdge();
                    rightEdge = boundingBoxCalculator.rightEdge();
                } else {
                    totalWidth = minWidth;
                    leftEdge = -totalWidth / 2;
                    rightEdge = totalWidth / 2;
                }
                queryVertexRefLabel.attr("x", rightEdge - boxPadding - iconSize - 4);
                entityTypeLabel.attr("x", leftEdge + boxPadding);
                zoomInIcon.attr("x", rightEdge - boxPadding - iconSize);
                element.append("line").attr("class", "divider").attr("x1", leftEdge).attr("y1", dividerY).attr("x2", rightEdge).attr("y2", dividerY);
                element.insert("rect", ".query-result-vertex-header").attr("class", "query-vertex-box").attr("rx", "4").attr("width", totalWidth).attr("height", totalHeight).attr("x", leftEdge).attr("y", boundingBoxCalculator.topEdge());
            },
            initDefs: function(defs) {
                var whiteGradient = defs.append("linearGradient").attr("id", "queryResultVertexDefaultFillScheme").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
                whiteGradient.append("stop").attr("offset", "0%").attr("stop-color", "#f9f9f9").attr("stop-opacity", "1");
                whiteGradient.append("stop").attr("offset", "100%").attr("stop-color", "#edebf4").attr("stop-opacity", "1");
                var zoomInIcon = defs.append("g").attr("id", "icon-zoomin");
                zoomInIcon.append("path").attr("d", "M15.504 13.616l-3.79-3.223c-0.392-0.353-0.811-0.514-1.149-0.499 " + "0.895-1.048 1.435-2.407 1.435-3.893 0-3.314-2.686-6-6-6-3.314 0-6 2.686-6 " + "6 0 3.314 2.686 6 6 6 1.486 0 2.845-0.54 3.893-1.435-0.016 0.338 0.146 0.757 " + "0.499 1.149l3.223 3.79c0.552 0.613 1.453 0.665 2.003 0.115s0.498-1.452-0.115-2.003zM6 " + "10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zM7 3h-2v2h-2v2h2v2h2v-2h2v-2h-2z");
            }
        });
        return D3QueryResultVertexRenderer;
    }();
    var D3SymbolVertexRenderer = function() {
        function D3SymbolVertexRenderer(type) {
            utils.checkExists("Type", type);
            this.type = type;
        }
        utils.mixin(D3SymbolVertexRenderer.prototype, {
            init: function(vertex, element) {
                var path = element.append("path");
                path.attr("d", d3.svg.symbol().type(this.type).size(200));
                vertex.uiElement = path;
            },
            initDefs: function() {}
        });
        return D3SymbolVertexRenderer;
    }();
    var QueryResultVertexPropertyPredicate = function() {
        function QueryResultVertexPropertyPredicate(queryGraph) {
            utils.checkExists("Query Graph", queryGraph);
            this.queryGraph = queryGraph;
        }
        utils.mixin(QueryResultVertexPropertyPredicate.prototype, {
            isVisible: function(vertex, propertyKey) {
                if (propertyKey === "entityType") {
                    return false;
                }
                return true;
            }
        });
        return QueryResultVertexPropertyPredicate;
    }();
    var RaphaelEngine = function() {
        function RaphaelEngine() {}
        utils.mixin(RaphaelEngine.prototype, Engine);
        utils.mixin(RaphaelEngine.prototype, {
            initEngine: function(container, navigatorContainer, width, height) {
                this.paper = new Raphael(container, width, height);
            },
            initVertex: function(vertex) {
                var renderer = ElementRendererProvider.getVertexRenderer(vertex, "raphael");
                utils.checkExists("Renderer", renderer);
                renderer.init(vertex, this.paper);
            },
            renderVertex: function(vertex) {
                var renderer = ElementRendererProvider.getVertexRenderer(vertex, "raphael");
                utils.checkExists("Renderer", renderer);
                renderer.render(vertex, this.paper);
            }
        });
        return RaphaelEngine;
    }();
    var RaphaelRectangleVertexRenderer = function() {
        return {
            init: function(vertex, paper) {
                vertex.ui.element = paper.rect(0, 0, 60, 40, 10);
            },
            render: function(vertex) {
                vertex.ui.element.attr(vertex.ui.position);
            }
        };
    }();
    var ElementRendererProvider = function() {
        return {
            getRenderer: function(element, engine, type) {
                var renderer;
                var settings = element.getGraph().getSettings();
                var elementType = element.getPropertyUnfiltered(PROP_TYPE);
                if (elementType !== null) {
                    renderer = utils.get(settings, engine, type === "vertex" ? "vertexRenderers" : "edgeRenderers", elementType);
                }
                if (utils.isUndefined(renderer)) {
                    renderer = utils.get(settings, engine, type === "vertex" ? "defaultVertexRenderer" : "defaultEdgeRenderer");
                }
                return renderer;
            },
            getAll: function(engine, settings) {
                var engineSetting = utils.get(settings, engine);
                var renderers = utils.values(engineSetting.vertexRenderers);
                renderers = renderers.concat(utils.values(engineSetting.edgeRenderers));
                return renderers;
            },
            getVertexRenderer: function(vertex, engine) {
                return this.getRenderer(vertex, engine, "vertex");
            },
            getEdgeRenderer: function(edge, engine) {
                return this.getRenderer(edge, engine, "edge");
            }
        };
    }();
    var Tween = function() {
        function Tween(duration, easing) {
            this.duration = duration;
            this.easing = easing;
        }
        var calculateState = function(vertex, duration) {
            var now = Tween.dateNow();
            vertex.currentTime = vertex.endTime - now;
            vertex.state = vertex.currentTime / duration;
            if (vertex.state < 0) {
                vertex.state = 0;
            }
        };
        utils.mixin(Tween.prototype, {
            start: function(vertex, scale) {
                vertex.state = 1;
                vertex.startTime = Tween.dateNow();
                vertex.endTime = vertex.startTime + this.duration;
                vertex.started = true;
                this.runFrame(vertex, scale);
            },
            runFrame: function(vertex, scale) {
                calculateState(vertex, this.duration);
                vertex.x = this.easing(vertex.currentTime, vertex.endX, vertex.beginX - vertex.endX, this.duration);
                vertex.y = this.easing(vertex.currentTime, vertex.endY, vertex.beginY - vertex.endY, this.duration);
                LayoutUtils.setScale(this.easing(vertex.currentTime, scale, LayoutUtils.getScale() - scale, this.duration));
                if (vertex.state === 0) {
                    vertex.finished = true;
                }
            }
        });
        Tween.dateNow = function() {
            return new Date().getTime();
        };
        return Tween;
    }();
    var CircleLayout = function() {
        function CircleLayout(duration, easing, ignoreVertex) {
            this.running = true;
            this.tween = new Tween(duration, easing);
            this.ignoreVertex = ignoreVertex;
            this.name = "circle";
        }
        CircleLayout.MIN_RADIUS = 100;
        var calculateRadius = function(vertexCount) {
            var radius = vertexCount * 19;
            return radius < CircleLayout.MIN_RADIUS ? CircleLayout.MIN_RADIUS : radius;
        };
        var calculateScale = function(radius, width, height) {
            var maxRadius = width < height ? width / 2 : height / 2;
            var scale = maxRadius / (radius + 75);
            return scale > 1 ? 1 : scale;
        };
        utils.mixin(CircleLayout.prototype, {
            step: function(vertices, edges, width, height, ignoredVertex) {
                var finishedVertices = vertices.length;
                if (this.running) {
                    finishedVertices = 0;
                    if (utils.isUndefined(this.ignoreVertex) || !this.ignoreVertex) {
                        ignoredVertex = undefined;
                    }
                    var numberOfVertices = utils.isUndefined(ignoredVertex) ? vertices.length : vertices.length - 1;
                    var radius = calculateRadius(numberOfVertices);
                    var scale = calculateScale(radius, width, height);
                    var cx = width * (.5 / scale);
                    var cy = height * (.5 / scale);
                    var indexOnCircle = 0;
                    for (var i = 0; i < vertices.length; i++) {
                        var uiVertex = vertices[i];
                        if (uiVertex.started) {
                            this.tween.runFrame(uiVertex, scale);
                            if (uiVertex.finished) {
                                finishedVertices++;
                            }
                        } else {
                            CircleLayout.setBeginPoint(uiVertex, cx, cy);
                            if (!utils.isUndefined(ignoredVertex) && ignoredVertex.id === uiVertex.id) {
                                uiVertex.endX = cx;
                                uiVertex.endY = cy;
                            } else {
                                var angle = 2 * Math.PI * indexOnCircle++ / numberOfVertices;
                                uiVertex.endX = Math.cos(angle) * radius + cx;
                                uiVertex.endY = Math.sin(angle) * radius + cy;
                            }
                            this.tween.start(uiVertex, scale);
                        }
                    }
                }
                if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
                    vertices[0].vertex.getGraph().trigger("graphUpdated");
                }
                this.running = finishedVertices < vertices.length;
                return this.running;
            }
        });
        CircleLayout.setBeginPoint = function(uiVertex, cx, cy) {
            if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
                uiVertex.beginX = cx;
                uiVertex.beginY = cy;
                uiVertex.x = uiVertex.beginX;
                uiVertex.y = uiVertex.beginY;
            } else {
                uiVertex.beginX = uiVertex.x;
                uiVertex.beginY = uiVertex.y;
            }
        };
        return CircleLayout;
    }();
    var WheelLayout = function() {
        function WheelLayout(duration, easing) {
            this.running = true;
            this.circleLayout = new CircleLayout(duration, easing, true);
            this.name = "wheel";
        }
        utils.mixin(WheelLayout.prototype, {
            step: function(vertices, edges, width, height, selectedVertex) {
                if (this.running) {
                    var centerVertex = selectedVertex;
                    if (vertices.length > 0 && utils.isUndefined(selectedVertex)) {
                        centerVertex = vertices[0];
                    }
                    this.running = this.circleLayout.step(vertices, edges, width, height, centerVertex);
                }
                return this.running;
            }
        });
        return WheelLayout;
    }();
    var GridLayout = function() {
        function GridLayout(duration, easing) {
            this.running = true;
            this.tween = new Tween(duration, easing);
            this.name = "grid";
        }
        var calculateScale = function(width, height, rows, cols) {
            var widthScale = cols === 1 ? 1 : width / ((cols - 1) * (width / (cols - 1) + NODE_WIDTH));
            var heightScale = rows === 1 ? 1 : height / ((rows - 1) * (height / (rows - 1) + NODE_WIDTH));
            var scale = Math.min(widthScale, heightScale);
            return scale > 1 ? 1 : scale;
        };
        utils.mixin(GridLayout.prototype, {
            step: function(vertices, edges, width, height) {
                var finishedVertices = vertices.length;
                if (this.running) {
                    finishedVertices = 0;
                    var numberOfVertices = vertices.length;
                    var rows = Math.floor(Math.sqrt(numberOfVertices));
                    var cols = rows === 0 ? 0 : Math.floor(numberOfVertices / rows) + 1;
                    var h = height - NODE_WIDTH;
                    var w = width - 2 * NODE_WIDTH;
                    var scale = calculateScale(w, h, rows, cols);
                    var bx = 2 * NODE_WIDTH / scale;
                    var by = NODE_WIDTH;
                    for (var i = 0; i < vertices.length; i++) {
                        var uiVertex = vertices[i];
                        if (uiVertex.started) {
                            this.tween.runFrame(uiVertex, scale);
                            if (uiVertex.finished) {
                                finishedVertices++;
                            }
                        } else {
                            GridLayout.setBeginPoint(uiVertex, bx, by);
                            uiVertex.endX = bx + w * (i % cols / cols) + i % cols * NODE_WIDTH;
                            uiVertex.endY = by + h * (Math.floor(i / cols) / rows) + Math.floor(i / cols) * NODE_WIDTH;
                            this.tween.start(uiVertex, scale);
                        }
                    }
                }
                if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
                    vertices[0].vertex.getGraph().trigger("graphUpdated");
                }
                this.running = finishedVertices < vertices.length;
                return this.running;
            }
        });
        GridLayout.setBeginPoint = function(uiVertex, bx, by) {
            if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
                uiVertex.beginX = bx;
                uiVertex.beginY = by;
                uiVertex.x = bx;
                uiVertex.y = by;
            } else {
                uiVertex.beginX = uiVertex.x;
                uiVertex.beginY = uiVertex.y;
            }
        };
        return GridLayout;
    }();
    var NodeLinkTreeLayout = function() {
        function NodeLinkTreeLayout(duration, easing) {
            this.running = true;
            this.tween = new Tween(duration, easing);
            this.maxX = 0;
            this.maxY = 0;
            this.maxDepth = 0;
            this.name = "tree";
        }
        NodeLinkTreeLayout.SIBLING_NODE_DISTANCE = 5;
        NodeLinkTreeLayout.SUBTREE_DISTANCE = 25;
        NodeLinkTreeLayout.DEPTH_DISTANCE = 125;
        NodeLinkTreeLayout.PADDING = 75;
        var buildSpanningTree = function(uiVertex, uiVertices) {
            var queue = [];
            var visit = [];
            queue.push(uiVertex);
            visit.push(uiVertex.id);
            while (queue.length > 0) {
                var parent = queue[0];
                queue.splice(0, 1);
                parent.children = [];
                var parentEdges = parent.vertex.getEdges(BOTH);
                for (var i = 0; i < parentEdges.length; i++) {
                    var edge = parentEdges[i];
                    var child = uiVertices[edge.getInVertex().id === parent.id ? edge.getOutVertex().id : edge.getInVertex().id];
                    if (visit.indexOf(child.id) === -1) {
                        queue.push(child);
                        visit.push(child.id);
                        parent.children.push(child);
                        child.parent = parent;
                    }
                }
            }
        };
        var firstWalk = function(uiVertex, number, depth) {
            uiVertex.number = number;
            uiVertex.depth = depth;
            var leftSibling;
            if (uiVertex.children.length === 0) {
                leftSibling = getLeftSibling(uiVertex);
                if (utils.isUndefined(leftSibling)) {
                    uiVertex.prelim = 0;
                } else {
                    uiVertex.prelim = leftSibling.prelim + distance(leftSibling, uiVertex, true);
                }
            } else {
                var leftMostChild = uiVertex.children[0];
                var rightMostChild = uiVertex.children[uiVertex.children.length - 1];
                var defaultAncestor = leftMostChild;
                for (var i = 0; i < uiVertex.children.length; i++) {
                    var child = uiVertex.children[i];
                    firstWalk(child, i, depth + 1);
                    defaultAncestor = apportion(child, defaultAncestor);
                }
                executeShifts(uiVertex);
                var midpoint = .5 * (leftMostChild.prelim + rightMostChild.prelim);
                leftSibling = getLeftSibling(uiVertex);
                if (!utils.isUndefined(leftSibling)) {
                    uiVertex.prelim = leftSibling.prelim + distance(leftSibling, uiVertex, true);
                    uiVertex.mod = uiVertex.prelim - midpoint;
                } else {
                    uiVertex.prelim = midpoint;
                }
            }
        };
        var apportion = function(uiVertex, defaultAncestor) {
            var leftSibling = getLeftSibling(uiVertex);
            if (!utils.isUndefined(leftSibling)) {
                var vertexInsideRightSubtree = uiVertex;
                var vertexOutsideRightSubtree = uiVertex;
                var vertexInsideLeftSubtree = leftSibling;
                var vertexOutsideLeftSubtree = uiVertex.parent.children[0];
                var summedModifierInsideRightSubtree = vertexInsideRightSubtree.mod;
                var summedModifierInsideLeftSubtree = vertexInsideLeftSubtree.mod;
                var summedModifierOutsideRightSubtree = vertexOutsideRightSubtree.mod;
                var summedModifierOutsideLeftSubtree = vertexOutsideLeftSubtree.mod;
                var nextRightVertex = nextRight(vertexInsideLeftSubtree);
                var nextLeftVertex = nextLeft(vertexInsideRightSubtree);
                while (!utils.isUndefined(nextRightVertex) && !utils.isUndefined(nextLeftVertex)) {
                    vertexInsideLeftSubtree = nextRightVertex;
                    vertexInsideRightSubtree = nextLeftVertex;
                    vertexOutsideLeftSubtree = nextLeft(vertexOutsideLeftSubtree);
                    vertexOutsideRightSubtree = nextRight(vertexOutsideRightSubtree);
                    vertexOutsideRightSubtree.ancestor = uiVertex;
                    var shift = vertexInsideLeftSubtree.prelim + summedModifierInsideLeftSubtree - (vertexInsideRightSubtree.prelim + summedModifierInsideRightSubtree) + distance(vertexInsideLeftSubtree, vertexInsideRightSubtree, false);
                    if (shift > 0) {
                        moveSubtree(ancestor(vertexInsideLeftSubtree, uiVertex, defaultAncestor), uiVertex, shift);
                        summedModifierInsideRightSubtree = summedModifierInsideRightSubtree + shift;
                        summedModifierOutsideRightSubtree = summedModifierOutsideRightSubtree + shift;
                    }
                    summedModifierInsideLeftSubtree += vertexInsideLeftSubtree.mod;
                    summedModifierInsideRightSubtree += vertexInsideRightSubtree.mod;
                    summedModifierOutsideLeftSubtree += vertexOutsideLeftSubtree.mod;
                    summedModifierOutsideRightSubtree += vertexOutsideRightSubtree.mod;
                    nextRightVertex = nextRight(vertexInsideLeftSubtree);
                    nextLeftVertex = nextLeft(vertexInsideRightSubtree);
                }
                if (!utils.isUndefined(nextRightVertex) && utils.isUndefined(nextRight(vertexOutsideRightSubtree))) {
                    vertexOutsideRightSubtree.thread = nextRightVertex;
                    vertexOutsideRightSubtree.mod += summedModifierInsideLeftSubtree - summedModifierOutsideRightSubtree;
                }
                if (!utils.isUndefined(nextLeftVertex) && utils.isUndefined(nextLeft(vertexOutsideLeftSubtree))) {
                    vertexOutsideLeftSubtree.thread = nextLeftVertex;
                    vertexOutsideLeftSubtree.mod += summedModifierInsideRightSubtree - summedModifierOutsideLeftSubtree;
                    defaultAncestor = uiVertex;
                }
            }
            return defaultAncestor;
        };
        var nextLeft = function(uiVertex) {
            if (uiVertex.children.length > 0) {
                return uiVertex.children[0];
            } else {
                return uiVertex.thread;
            }
        };
        var nextRight = function(uiVertex) {
            if (uiVertex.children.length > 0) {
                return uiVertex.children[uiVertex.children.length - 1];
            } else {
                return uiVertex.thread;
            }
        };
        var moveSubtree = function(vertexLeft, vertexRight, shift) {
            var subtrees = vertexRight.number - vertexLeft.number;
            vertexRight.change -= shift / subtrees;
            vertexRight.shift += shift;
            vertexLeft.change += shift / subtrees;
            vertexRight.prelim += shift;
            vertexRight.mod += shift;
        };
        var ancestor = function(vertexInsideLeftSubtree, uiVertex, defaultAncestor) {
            if (vertexInsideLeftSubtree.ancestor.parent === uiVertex.parent) {
                return vertexInsideLeftSubtree.ancestor;
            } else {
                return defaultAncestor;
            }
        };
        var executeShifts = function(uiVertex) {
            var shift = 0;
            var change = 0;
            for (var i = uiVertex.children.length - 1; i >= 0; i--) {
                var child = uiVertex.children[i];
                child.prelim += shift;
                child.mod += shift;
                change += child.change;
                shift += child.shift + change;
            }
        };
        var getLeftSibling = function(uiVertex) {
            if (!utils.isUndefined(uiVertex.parent)) {
                for (var i = 0; i < uiVertex.parent.children.length; i++) {
                    var sibling = uiVertex.parent.children[i];
                    if (i > 0 && sibling.id === uiVertex.id) {
                        return uiVertex.parent.children[i - 1];
                    }
                }
            }
            return undefined;
        };
        var distance = function(left, right, siblings) {
            return (siblings ? NodeLinkTreeLayout.SIBLING_NODE_DISTANCE : NodeLinkTreeLayout.SUBTREE_DISTANCE) + NODE_WIDTH;
        };
        var secondWalk = function secondWalk(uiVertex, modifier, self, width, leftMostX) {
            var defaultX = width / 2 + uiVertex.prelim + modifier;
            if (defaultX < leftMostX) {
                leftMostX = defaultX;
            }
            for (var i = 0; i < uiVertex.children.length; i++) {
                leftMostX = secondWalk(uiVertex.children[i], modifier + uiVertex.mod, self, width, leftMostX);
            }
            uiVertex.endX = width / 2 + uiVertex.prelim + modifier + (NodeLinkTreeLayout.PADDING - leftMostX);
            uiVertex.endY = uiVertex.depth * NodeLinkTreeLayout.DEPTH_DISTANCE + NodeLinkTreeLayout.PADDING;
            if (uiVertex.endX > self.maxX) {
                self.maxX = uiVertex.endX;
            }
            if (uiVertex.endY > self.maxY) {
                self.maxY = uiVertex.endY;
            }
            if (uiVertex.depth > self.maxDepth) {
                self.maxDepth = uiVertex.depth;
            }
            return leftMostX;
        };
        var calculateScale = function(self, width, height) {
            var scale = Math.min((width - NodeLinkTreeLayout.PADDING) / self.maxX, (height - NodeLinkTreeLayout.PADDING) / self.maxY);
            return scale > 1 ? 1 : scale;
        };
        utils.mixin(NodeLinkTreeLayout.prototype, {
            step: function(vertices, edges, width, height, selectedVertex) {
                var finishedVertices = vertices.length;
                if (this.running) {
                    finishedVertices = 0;
                    var uiVertices = {};
                    for (var i = 0; i < vertices.length; i++) {
                        var uiVertex = vertices[i];
                        if (uiVertex.started) {
                            this.tween.runFrame(uiVertex, this.scale);
                            if (uiVertex.finished) {
                                finishedVertices++;
                            }
                        } else {
                            uiVertex.mod = 0;
                            uiVertex.prelim = 0;
                            uiVertex.shift = 0;
                            uiVertex.change = 0;
                            uiVertex.thread = undefined;
                            uiVertex.ancestor = uiVertex;
                            uiVertex.number = -1;
                            uiVertices[uiVertex.id] = uiVertex;
                        }
                    }
                    var root = utils.isUndefined(selectedVertex) ? vertices[0] : selectedVertex;
                    if (!root.started) {
                        var self = this;
                        var firstDepth = 0;
                        buildSpanningTree(root, uiVertices);
                        firstWalk(root, 0, firstDepth);
                        secondWalk(root, -root.prelim, self, width, NodeLinkTreeLayout.PADDING);
                        var existVertexWithoutEndPoint = true;
                        while (existVertexWithoutEndPoint) {
                            existVertexWithoutEndPoint = false;
                            for (i = 0; i < vertices.length; i++) {
                                if (utils.isUndefined(vertices[i].endX) || utils.isUndefined(vertices[i].endY)) {
                                    root = vertices[i];
                                    existVertexWithoutEndPoint = true;
                                    break;
                                }
                            }
                            if (existVertexWithoutEndPoint) {
                                buildSpanningTree(root, uiVertices);
                                firstDepth = self.maxDepth + 1;
                                firstWalk(root, 0, firstDepth);
                                secondWalk(root, -root.prelim, self, width, NodeLinkTreeLayout.PADDING);
                            }
                        }
                        this.scale = calculateScale(self, width, height);
                        for (i = 0; i < vertices.length; i++) {
                            var vertex = vertices[i];
                            NodeLinkTreeLayout.setBeginPoint(vertex, root);
                            this.tween.start(vertex, this.scale);
                        }
                    }
                }
                if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
                    vertices[0].vertex.getGraph().trigger("graphUpdated");
                }
                this.running = finishedVertices < vertices.length;
                return this.running;
            }
        });
        NodeLinkTreeLayout.setBeginPoint = function(uiVertex, root) {
            if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
                uiVertex.beginX = root.endX;
                uiVertex.beginY = root.endY;
                uiVertex.x = root.endX;
                uiVertex.y = root.endY;
            } else {
                uiVertex.beginX = uiVertex.x;
                uiVertex.beginY = uiVertex.y;
            }
        };
        return NodeLinkTreeLayout;
    }();
    var FruchtermanReingoldLayout = function() {
        function FruchtermanReingoldLayout(duration, easing) {
            this.running = true;
            this.started = false;
            this.maxIteration = 700;
            this.tween = new Tween(duration, easing);
            this.name = "fruchtermanReingold";
        }
        var EPSILON = 1e-6;
        var ALPHA = 1;
        var padding = 15;
        var init = function(vertices, width, height, self) {
            var vertexCount = vertices.length;
            self.temp = width / 10;
            self.forceConstant = 1.2 * Math.sqrt(height * width / vertexCount);
            var scaleW = ALPHA * width / 2;
            var scaleH = ALPHA * height / 2;
            for (var i = 0; i < vertices.length; i++) {
                var uiVertex = vertices[i];
                FruchtermanReingoldLayout.setBeginPoint(uiVertex, width, height);
                uiVertex.endX = width / 2 + utils.randomDouble(0, 42) * scaleW;
                uiVertex.endY = height / 2 + utils.randomDouble(0, 42) * scaleH;
            }
        };
        var calcRepulsion = function(vertices, UiVertex, self) {
            UiVertex.disp = [ 0, 0 ];
            for (var i = 0; i < vertices.length; i++) {
                var uiVertex2 = vertices[i];
                if (UiVertex.id !== uiVertex2.id) {
                    var xDelta = UiVertex.endX - uiVertex2.endX;
                    var yDelta = UiVertex.endY - uiVertex2.endY;
                    var deltaLength = Math.max(EPSILON, Math.sqrt(xDelta * xDelta + yDelta * yDelta));
                    var force = self.forceConstant * self.forceConstant / deltaLength;
                    UiVertex.disp[0] += xDelta / deltaLength * force;
                    UiVertex.disp[1] += yDelta / deltaLength * force;
                }
            }
        };
        var calcAttraction = function(edge, self) {
            var uiVertex1 = edge.inVertex;
            var uiVertex2 = edge.outVertex;
            var xDelta = uiVertex1.endX - uiVertex2.endX;
            var yDelta = uiVertex1.endY - uiVertex2.endY;
            var deltaLength = Math.max(EPSILON, Math.sqrt(xDelta * xDelta + yDelta * yDelta));
            var force = deltaLength * deltaLength / self.forceConstant;
            var xDisp = xDelta / deltaLength * force;
            var yDisp = yDelta / deltaLength * force;
            uiVertex1.disp[0] -= xDisp;
            uiVertex1.disp[1] -= yDisp;
            uiVertex2.disp[0] += xDisp;
            uiVertex2.disp[1] += yDisp;
        };
        var calcPositions = function(uiVertex, width, height, self) {
            var deltaLength = Math.max(EPSILON, Math.sqrt(uiVertex.disp[0] * uiVertex.disp[0] + uiVertex.disp[1] * uiVertex.disp[1]));
            var xDisp = uiVertex.disp[0] / deltaLength * Math.min(deltaLength, self.temp);
            var yDisp = uiVertex.disp[1] / deltaLength * Math.min(deltaLength, self.temp);
            uiVertex.endX += xDisp;
            uiVertex.endY += yDisp;
            var borderWidth = width / 50;
            var x = uiVertex.endX;
            if (x < 2 * NODE_WIDTH + borderWidth) {
                x = 2 * NODE_WIDTH + borderWidth + Math.random() * borderWidth * 2;
            } else if (x > width - borderWidth) {
                x = width - borderWidth - Math.random() * borderWidth * 2;
            }
            var y = uiVertex.endY;
            if (y < NODE_WIDTH + borderWidth) {
                y = NODE_WIDTH + borderWidth + Math.random() * borderWidth * 2;
            } else if (y > height - borderWidth) {
                y = height - borderWidth - Math.random() * borderWidth * 2;
            }
            uiVertex.endX = x;
            uiVertex.endX = Math.max(uiVertex.endX, NODE_WIDTH / 2 + padding);
            uiVertex.endX = Math.min(uiVertex.endX, width - NODE_WIDTH / 2 - padding);
            uiVertex.endY = y;
            uiVertex.endY = Math.max(uiVertex.endY, NODE_WIDTH / 2 + padding);
            uiVertex.endY = Math.min(uiVertex.endY, height - NODE_WIDTH / 2 - padding);
        };
        var cool = function(self, currentIteration) {
            self.temp *= 1 - currentIteration / self.maxIteration;
        };
        var calculateScale = function(width, height, minWidth, minHeight) {
            var scale;
            if (width > height) {
                scale = width / minWidth;
            } else {
                scale = height / minHeight;
            }
            return scale > 1 ? 1 : scale;
        };
        utils.mixin(FruchtermanReingoldLayout.prototype, {
            step: function(vertices, edges, width, height) {
                var finishedVertices = vertices.length;
                var w = vertices.length * (NODE_WIDTH / 1.5);
                w = Math.max(w, width);
                var h = w * (height / width);
                var scale = calculateScale(width, height, w, h);
                if (this.running) {
                    var i;
                    var uiVertex;
                    if (!this.started) {
                        init(vertices, w, h, this);
                        for (i = 0; i < this.maxIteration; i++) {
                            for (var j = 0; j < vertices.length; j++) {
                                uiVertex = vertices[j];
                                calcRepulsion(vertices, uiVertex, this);
                            }
                            for (j = 0; j < edges.length; j++) {
                                var edge = edges[j];
                                calcAttraction(edge, this);
                            }
                            for (j = 0; j < vertices.length; j++) {
                                uiVertex = vertices[j];
                                calcPositions(uiVertex, w, h, this);
                            }
                            cool(this, i);
                        }
                        this.started = true;
                    }
                    finishedVertices = 0;
                    for (i = 0; i < vertices.length; i++) {
                        uiVertex = vertices[i];
                        if (uiVertex.started) {
                            this.tween.runFrame(uiVertex, scale);
                            if (uiVertex.finished) {
                                finishedVertices++;
                            }
                        } else {
                            this.tween.start(uiVertex, scale);
                        }
                    }
                }
                if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
                    vertices[0].vertex.getGraph().trigger("graphUpdated");
                }
                this.running = finishedVertices < vertices.length;
                return this.running;
            }
        });
        FruchtermanReingoldLayout.setBeginPoint = function(uiVertex, width, height) {
            if (utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
                uiVertex.beginX = width / 2;
                uiVertex.beginY = height / 2;
                uiVertex.x = uiVertex.beginX;
                uiVertex.y = uiVertex.beginY;
            } else {
                uiVertex.beginX = uiVertex.x;
                uiVertex.beginY = uiVertex.y;
            }
        };
        return FruchtermanReingoldLayout;
    }();
    var LayoutUtils = {
        setScale: function(scale) {
            d3.select("#graphElements").attr("transform", "scale(" + scale + ")");
        },
        getScale: function() {
            var graphElements = d3.select("#graphElements");
            if (graphElements.empty()) {
                return 1;
            } else {
                var transform = graphElements.attr("transform");
                return transform.substring(6, transform.length - 1);
            }
        }
    };
    var Easing = {
        expoInOut: function(time, begin, change, duration) {
            if (time === 0) {
                return begin;
            }
            if (time === duration) {
                return begin + change;
            }
            time = time / (duration / 2);
            if (time < 1) {
                return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
            }
            return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
        }
    };
    var Renderer = function() {
        function Renderer(graph, instanceSettings) {
            utils.checkExists("Graph", graph);
            this.graph = graph;
            this.container = instanceSettings.container;
            this.navigatorContainer = instanceSettings.navigatorContainer;
            this.engine = instanceSettings.engine;
            this.settings = instanceSettings;
            this.layoutId = this.settings.defaultLayout;
            reset(this);
            setUpEventHandlers(graph, this);
        }
        function reset(renderer) {
            renderer.initialized = false;
            renderer.vertices = [];
            renderer.verticesById = {};
            renderer.edges = [];
            renderer.edgesById = {};
            var Layout = renderer.settings.layouts[renderer.layoutId];
            renderer.layout = new Layout(renderer.settings.animationDuration, renderer.settings.easing);
        }
        function addVertex(vertex, renderer) {
            var uiVertex = {
                id: vertex.getId(),
                vertex: vertex
            };
            renderer.vertices.push(uiVertex);
            renderer.verticesById[uiVertex.id] = uiVertex;
        }
        function addEdge(edge, renderer) {
            var inId = edge.getInVertex().getId();
            var outId = edge.getOutVertex().getId();
            var uiEdge = {
                id: edge.getId(),
                edge: edge,
                inVertex: renderer.verticesById[inId],
                outVertex: renderer.verticesById[outId]
            };
            renderer.edges.push(uiEdge);
            renderer.edgesById[uiEdge.id] = uiEdge;
        }
        function removeVertex(vertex, renderer) {
            var uiVertex = renderer.verticesById[vertex.getId()];
            utils.remove(uiVertex, renderer.vertices);
            delete renderer.verticesById[uiVertex.id];
        }
        function removeEdge(edge, renderer) {
            var uiEdge = renderer.edgesById[edge.getId()];
            utils.remove(uiEdge, renderer.edges);
            delete renderer.edgesById[uiEdge.id];
        }
        function setUpEventHandlers(graph, renderer) {
            graph.on("vertexAdded", function(event, vertex) {
                addVertex(vertex, renderer);
            });
            graph.on("edgeAdded", function(event, edge) {
                addEdge(edge, renderer);
            });
            graph.on("vertexRemoved", function(event, vertex) {
                removeVertex(vertex, renderer);
            });
            graph.on("edgeRemoved", function(event, edge) {
                removeEdge(edge, renderer);
            });
            graph.on("vertexClicked", function(event, vertex) {
                this.renderer.selectedVertex = vertex;
            });
            graph.on("vertexDragStart", function(event, vertex) {
                vertex.uiElement.remove();
                this.renderer.selectedVertex = vertex;
            });
            if (!renderer.settings.width) {
                var timeOfLastResizeEvent;
                var timeout = false;
                var delta = 200;
                window.addEventListener("resize", function() {
                    timeOfLastResizeEvent = new Date();
                    if (timeout === false) {
                        timeout = true;
                        setTimeout(checkIfResizeEnded, delta);
                    }
                });
                var checkIfResizeEnded = function() {
                    if (new Date() - timeOfLastResizeEvent < delta) {
                        setTimeout(checkIfResizeEnded, delta);
                    } else {
                        timeout = false;
                        resize(renderer);
                    }
                };
            }
        }
        function resize(renderer) {
            var newWidth = determineContainerWidth(renderer.settings.container);
            if (renderer.settings.width !== newWidth) {
                renderer.settings.width = null;
                renderer.stop();
                reset(renderer);
                renderer.render();
            }
        }
        function determineContainerWidth(containerId) {
            var container = document.getElementById(containerId.substring(1));
            if (!container) {
                throw {
                    message: "Cannot find graph container"
                };
            }
            return container.offsetWidth;
        }
        utils.mixin(Renderer.prototype, {
            render: function() {
                if (!this.initialized) {
                    this.init();
                }
                if (this.timer) {
                    return;
                }
                this.timer = new Timer(this.onAnimationFrame, this);
                this.timer.start();
            },
            onAnimationFrame: function() {
                var running = this.layout.step(this.vertices, this.edges, this.settings.width, this.settings.height, this.selectedVertex);
                this.renderFrame();
                return running;
            },
            renderFrame: function() {
                this.engine.beforeRender(this.vertices, this.edges);
                var self = this;
                this.graph.forEachVertex(function(vertex) {'use strict';
                    self.engine.renderVertex(vertex);
                });
            },
            init: function() {
                if (!this.settings.width) {
                    this.settings.width = determineContainerWidth(this.settings.container);
                }
                this.engine.init(this.settings, this.graph, this);
                var self = this;
                this.graph.forEachVertex(function(vertex) {'use strict';
                    if (!self.verticesById[vertex.getId()]) {
                        addVertex(vertex, self);
                    }
                    self.engine.initVertex(vertex);
                });
                this.graph.forEachEdge(function(edge) {'use strict';
                    if (!self.edgesById[edge.getId()]) {
                        addEdge(edge, self);
                    }
                });
                this.initialized = true;
            },
            saveAsImage: function() {
                this.engine.saveAsImage();
            },
            changeLayout: function(layout) {
                for (var i = 0; i < this.vertices.length; i++) {
                    var uiVertex = this.vertices[i];
                    uiVertex.started = false;
                    uiVertex.finished = false;
                    uiVertex.endX = undefined;
                    uiVertex.endY = undefined;
                }
                this.layoutId = layout;
                var Layout = this.settings.layouts[layout];
                this.layout = new Layout(this.settings.animationDuration, this.settings.easing);
                this.graph.trigger("graphZoomOut");
            },
            stop: function() {
                if (this.timer) {
                    this.timer.stop();
                    this.timer = null;
                }
                this.engine.stop();
            },
            resize: function() {
                resize(this);
            }
        });
        return Renderer;
    }();
    var GraphSONReader = function() {
        function GraphSONReader() {}
        var copyProperties = function(from, to) {
            for (var property in from) {
                if (property.indexOf("_") !== 0) {
                    to.setProperty(property, from[property]);
                }
            }
        };
        utils.mixin(GraphSONReader.prototype, {
            read: function(graph, graphSON) {
                for (var i = 0; i < graphSON.graph.vertices.length; i++) {
                    var graphSONVertex = graphSON.graph.vertices[i];
                    var vertex = graph.getVertex(graphSONVertex._id);
                    if (!utils.exists(vertex)) {
                        vertex = graph.addVertex(graphSONVertex._id);
                    }
                    copyProperties(graphSONVertex, vertex);
                }
                for (i = 0; i < graphSON.graph.edges.length; i++) {
                    var graphSONEdge = graphSON.graph.edges[i];
                    var edge = graph.getEdge(graphSONEdge._id);
                    if (!utils.exists(edge)) {
                        var outV = graph.getVertex(graphSONEdge._outV);
                        var inV = graph.getVertex(graphSONEdge._inV);
                        edge = graph.addEdge(graphSONEdge._id, outV, inV, graphSONEdge._label);
                    }
                    copyProperties(graphSONEdge, edge);
                }
                return graph;
            }
        });
        return GraphSONReader;
    }();
    var settings = {
        container: null,
        navigatorContainer: null,
        engine: new D3Engine(),
        defaultLayout: "circle",
        layouts: {
            random: RandomLayout,
            circle: CircleLayout,
            wheel: WheelLayout,
            grid: GridLayout,
            tree: NodeLinkTreeLayout,
            fruchtermanReingold: FruchtermanReingoldLayout
        },
        animationDuration: 1e3,
        easing: Easing.expoInOut,
        raphael: {
            defaultVertexRenderer: RaphaelRectangleVertexRenderer,
            vertexRenderers: {}
        },
        d3: {
            defaultVertexRenderer: new D3SymbolVertexRenderer("circle"),
            defaultEdgeRenderer: new D3LineEdgeRenderer(),
            vertexRenderers: {
                circle: new D3SymbolVertexRenderer("circle"),
                cross: new D3SymbolVertexRenderer("cross"),
                diamond: new D3SymbolVertexRenderer("diamond"),
                square: new D3SymbolVertexRenderer("square"),
                "triangle-down": new D3SymbolVertexRenderer("triangle-down"),
                "triangle-up": new D3SymbolVertexRenderer("triangle-up"),
                "image-vertex": new D3ImageVertexRenderer(),
                "query-result-vertex": new D3QueryResultVertexRenderer(),
                "labeled-image-vertex": new D3VertexLabelDecorator(new D3ImageVertexRenderer(), {
                    labelInside: true,
                    labelTop: false,
                    padding: 10,
                    labelPropertyKey: "additionalLabel"
                }),
                "bordered-image-vertex": new D3VertexBorderDecorator(new D3ImageVertexRenderer())
            },
            edgeRenderers: {
                "curved-line": new D3DirectedLineEdgeRenderer(),
                "labeled-curved-line": new D3EdgeLabelDecorator(new D3DirectedLineEdgeRenderer())
            }
        },
        height: 680,
        zoom: {
            enabled: true,
            minScale: 1,
            maxScale: 8
        },
        drag: {
            enabled: true
        },
        navigator: {
            enabled: true,
            scale: .25
        },
        zoomPanControl: {
            enabled: true,
            zoomStep: .25,
            panStep: 50,
            paddingTop: 5,
            paddingLeft: 10
        },
        vertex: {
            imageUrlPropertyKey: "imageUrl",
            borderColorPropertyKey: "borderColor",
            borderWeightPropertyKey: "borderWeight",
            borderRadiusPropertyKey: "borderRadius",
            borderPaddingPropertyKey: "borderPadding",
            borderColor: "#000000",
            borderWeight: 2,
            borderRadius: 0,
            borderPadding: 5,
            vertexIconsPropertyKey: "icons",
            iconDefaultColor: "#000000"
        },
        edge: {
            lineWeightPropertyKey: "strength",
            defaultLineWeight: 2,
            useArrows: true,
            aggregatedByPropertyKey: "aggregatedBy"
        }
    };
    var ElementFilterManager = function() {
        function ElementFilterManager(graph) {
            utils.checkExists("Graph", graph);
            this.graph = graph;
            this.vertexOperator = AND;
            this.edgeOperator = AND;
            this.executed = false;
            this.filters = [];
            initResults(this);
        }
        utils.mixin(ElementFilterManager.prototype, {
            addFilter: function(newFilter) {
                newFilter = newFilter || new ElementFilter();
                this.filters.push(newFilter);
                return newFilter;
            },
            vertexFilterOperator: function(operator) {
                utils.checkArgument(operator === AND || operator === OR, "Operator can be only AND or OR");
                this.vertexOperator = operator;
                return this;
            },
            edgeFilterOperator: function(operator) {
                utils.checkArgument(operator === AND || operator === OR, "Operator can be only AND or OR");
                this.edgeOperator = operator;
                return this;
            },
            getNormalGraph: function() {
                if (!this.executed) {
                    filterGraph(this);
                }
                return this.normalGraph;
            },
            getAggragatedGraph: function() {
                if (!this.executed) {
                    filterGraph(this);
                }
                return this.aggregatedGraph;
            },
            getFilteredVertices: function() {
                if (!this.executed) {
                    filterGraph(this);
                }
                return this.filteredVertices;
            },
            getFilteredEdges: function() {
                if (!this.executed) {
                    filterGraph(this);
                }
                return this.filteredEdges;
            },
            getFilteredAggregatedVertices: function() {
                if (!this.executed) {
                    filterGraph(this);
                }
                return this.filteredAggregatedVertices;
            },
            getFilteredAggregatedEdges: function() {
                if (!this.executed) {
                    filterGraph(this);
                }
                return this.filteredAggregatedEdges;
            },
            reset: function() {
                this.executed = false;
                initResults(this);
                resetFilterCounters(this.filters);
                return this;
            }
        });
        function initResults(context) {
            context.normalGraph = new Graph();
            context.aggregatedGraph = new Graph();
            context.filteredVertices = [];
            context.filteredEdges = [];
            context.filteredAggregatedVertices = [];
            context.filteredAggregatedEdges = [];
        }
        function filterGraph(context) {
            applyFilters(context.graph.getVertices(), context, filterVertices);
            applyFilters(context.graph.getEdges(), context, filterEdges);
            context.executed = true;
        }
        function applyFilters(elements, context, filterCallback) {
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var filters = context.filters;
                var operator = utils.isOfType(element, Vertex) ? context.vertexOperator : context.edgeOperator;
                var filtered = checkFiltered(element, filters, operator);
                filterCallback(element, context, filtered);
            }
        }
        function checkFiltered(element, filters, operator) {
            var nonMatchedFilters = 0;
            var filterCount = filters.length;
            var notApplied = 0;
            var atLeastOneMatchedAndActive = false;
            for (var j = 0; j < filterCount; j++) {
                var filterMatched = true;
                var currentFilter = filters[j];
                if (!filterCanBeApplied(element, currentFilter)) {
                    notApplied++;
                    continue;
                }
                var hasConditions = currentFilter.hasConditions;
                for (var k = 0; k < hasConditions.length; k++) {
                    if (!hasConditions[k].matches(element)) {
                        filterMatched = false;
                    }
                }
                if (filterMatched) {
                    if (!currentFilter.active() && currentFilter.enabled()) {
                        nonMatchedFilters++;
                    } else if (currentFilter.active()) {
                        atLeastOneMatchedAndActive = true;
                    }
                    currentFilter.count(currentFilter.count() + 1);
                } else if (currentFilter.active()) {
                    nonMatchedFilters++;
                }
            }
            return operator === AND ? nonMatchedFilters > 0 : nonMatchedFilters === filterCount - notApplied || !atLeastOneMatchedAndActive;
        }
        function filterCanBeApplied(element, filter) {
            return utils.isOfType(element, Vertex) && filter.type() === VERTEX_FILTER || utils.isOfType(element, Edge) && filter.type() === EDGE_FILTER || filter.type() === BOTH_FILTER;
        }
        function filterVertices(vertex, context, filtered) {
            if (!filtered) {
                addVertexToGraph(context.normalGraph, vertex);
                addVertexToGraph(context.aggregatedGraph, vertex);
            } else {
                context.filteredVertices.push(vertex);
                context.filteredAggregatedVertices.push(vertex);
            }
        }
        function addVertexToGraph(graph, vertex) {
            var newVertex = graph.addVertex(vertex.id);
            vertex.copyPropertiesTo(newVertex);
        }
        function filterEdges(edge, context, filtered) {
            var inVertex = context.normalGraph.getVertex(edge.getInVertex().id);
            var outVertex = context.normalGraph.getVertex(edge.getOutVertex().id);
            var existingVertices = inVertex !== null && outVertex !== null;
            if (existingVertices && !filtered) {
                addEdgeToGraph(context.normalGraph, edge, inVertex, outVertex);
                addAggregatedEdgeToGraph(context, edge);
            } else {
                addAggregatedEdgeToFilteredList(context, edge);
                context.filteredEdges.push(edge);
            }
        }
        function addAggregatedEdgeToGraph(context, edge) {
            var inVertex = context.aggregatedGraph.getVertex(edge.getInVertex().id);
            var outVertex = context.aggregatedGraph.getVertex(edge.getOutVertex().id);
            var settings = context.graph.getSettings();
            var strength = edge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
            var inVertexEdges = inVertex.getEdges(BOTH);
            if (!hasEdgeBetweenVertices(inVertex, outVertex)) {
                var newEdge = context.aggregatedGraph.addEdge(null, outVertex, inVertex);
                edge.copyPropertiesTo(newEdge);
                newEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
                newEdge.setProperty(settings.edge.aggregatedByPropertyKey, [ edge.getId() ]);
            } else {
                findConnectedEdgesAndAggregate(inVertexEdges, inVertex, outVertex, strength, edge);
            }
        }
        function hasEdgeBetweenVertices(vertex1, vertex2) {
            var edges = vertex1.getEdges(BOTH);
            for (var i = 0; i < edges.length; i++) {
                var edge = edges[i];
                if (edge.connects(vertex1, vertex2)) {
                    return true;
                }
            }
            return false;
        }
        function findConnectedEdgesAndAggregate(sourceVertexEdges, sourceVertex, destinationVertex, currentStrength, originalEdge) {
            for (var i = 0; i < sourceVertexEdges.length; i++) {
                var currentEdge = sourceVertexEdges[i];
                var connectedWithDestinationVertex = currentEdge.connects(sourceVertex, destinationVertex);
                if (connectedWithDestinationVertex) {
                    currentStrength += currentEdge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
                    currentEdge.setProperty(settings.edge.lineWeightPropertyKey, currentStrength);
                    var aggregatedBy = currentEdge.getProperty(settings.edge.aggregatedByPropertyKey) || [];
                    aggregatedBy.push(originalEdge.getId());
                    currentEdge.setProperty(settings.edge.aggregatedByPropertyKey, aggregatedBy);
                }
            }
        }
        function addEdgeToGraph(graph, edge, inVertex, outVertex) {
            var newEdge = graph.addEdge(edge.id, outVertex, inVertex, edge.label);
            edge.copyPropertiesTo(newEdge);
        }
        function addAggregatedEdgeToFilteredList(context, edge) {
            var strength = edge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
            var wasConnection = false;
            for (var i = 0; i < context.filteredAggregatedEdges.length; i++) {
                var filteredEdge = context.filteredAggregatedEdges[i];
                var connectsSameVertices = edge.connects(filteredEdge.getInVertex(), filteredEdge.getOutVertex());
                if (connectsSameVertices) {
                    wasConnection = true;
                    strength += filteredEdge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
                    edge.copyPropertiesTo(filteredEdge);
                    filteredEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
                    var aggregatedBy = filteredEdge.getProperty(settings.edge.aggregatedByPropertyKey) || [];
                    aggregatedBy.push(edge.getId());
                    filteredEdge.setProperty(settings.edge.aggregatedByPropertyKey, aggregatedBy);
                    break;
                }
            }
            if (context.filteredAggregatedEdges.length < 1 || !wasConnection) {
                var newEdge = createSingleAggregatedEdge(edge.getOutVertex(), edge.getInVertex(), strength, edge, context);
                newEdge.setProperty(settings.edge.aggregatedByPropertyKey, [ edge.getId() ]);
                context.filteredAggregatedEdges.push(newEdge);
            }
        }
        function createSingleAggregatedEdge(outVertex, inVertex, strength, originalEdge, context) {
            var id = utils.generateId();
            while (context.aggregatedGraph.getEdge(id) !== null) {
                id = utils.generateId();
            }
            var newEdge = new Edge(id, outVertex, inVertex, null, context.aggregatedGraph);
            originalEdge.copyPropertiesTo(newEdge);
            newEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
            return newEdge;
        }
        function resetFilterCounters(filters) {
            for (var i = 0; i < filters.length; i++) {
                filters[i].count(0);
            }
        }
        return ElementFilterManager;
    }();
    var ElementFilter = function() {
        function ElementFilter() {
            this.filterName = null;
            this.filterId = null;
            this.elementCount = 0;
            this.activeFlag = true;
            this.enable = true;
            this.elementType = BOTH_FILTER;
            this.labelFilterActivated = false;
            this.initHasConditions();
        }
        utils.mixin(ElementFilter.prototype, HasConditions);
        utils.mixin(ElementFilter.prototype, {
            id: function(value) {
                if (!arguments.length) {
                    return this.filterId;
                }
                this.filterId = value;
                return this;
            },
            active: function(value) {
                if (!arguments.length) {
                    return this.activeFlag;
                }
                this.activeFlag = value;
                return this;
            },
            enabled: function(value) {
                if (!arguments.length) {
                    return this.enable;
                }
                this.enable = value;
                return this;
            },
            type: function(value) {
                if (!arguments.length) {
                    return this.elementType;
                }
                utils.checkArgument(!this.labelFilterActivated || value === EDGE_FILTER, "If label filter added the type could not be changed.");
                this.elementType = value;
                return this;
            },
            count: function(value) {
                if (!arguments.length) {
                    return this.elementCount;
                }
                this.elementCount = value;
                return this;
            },
            incrementCount: function(value) {
                value = value || 1;
                this.elementCount += value;
                return this;
            },
            decrementCount: function(value) {
                value = value || 1;
                this.elementCount -= value;
                return this;
            },
            name: function(value) {
                if (!arguments.length) {
                    return this.filterName;
                }
                this.filterName = value;
                return this;
            },
            addCondition: function(condition) {
                utils.checkExists("Condition", condition);
                this.hasConditions.push(condition);
                return this;
            },
            label: function() {
                var labels = utils.convertVarArgs(arguments);
                this.hasConditions.push(new LabelCondition(labels));
                this.labelFilterActivated = true;
                this.elementType = EDGE_FILTER;
                return this;
            }
        });
        return ElementFilter;
    }();
    exports.settings = settings;
    exports.Edge = Edge;
    exports.Vertex = Vertex;
    exports.Graph = Graph;
    exports.InternalPropertyFilter = InternalPropertyFilter;
    exports.VertexQuery = VertexQuery;
    exports.GraphQuery = VertexQuery;
    exports.Index = Index;
    exports.RandomLayout = RandomLayout;
    exports.ForceDirectedLayout = ForceDirectedLayout;
    exports.ElementFilterManager = ElementFilterManager;
    exports.ElementFilter = ElementFilter;
    exports.D3Navigator = D3Navigator;
    exports.D3SvgImageDownloader = D3SvgImageDownloader;
    exports.D3ZoomPanManager = D3ZoomPanManager;
    exports.D3VertexManager = D3VertexManager;
    exports.D3ZoomPanControl = D3ZoomPanControl;
    exports.ElementRendererDecorator = ElementRendererDecorator;
    exports.D3VertexLabelDecorator = D3VertexLabelDecorator;
    exports.D3VertexBorderDecorator = D3VertexBorderDecorator;
    exports.D3VertexIconDecorator = D3VertexIconDecorator;
    exports.D3EdgeLabelDecorator = D3EdgeLabelDecorator;
    exports.D3Engine = D3Engine;
    exports.D3ImageVertexRenderer = D3ImageVertexRenderer;
    exports.D3SymbolVertexRenderer = D3SymbolVertexRenderer;
    exports.D3QueryResultVertexRenderer = D3QueryResultVertexRenderer;
    exports.D3LineEdgeRenderer = D3LineEdgeRenderer;
    exports.D3DirectedLineEdgeRenderer = D3DirectedLineEdgeRenderer;
    exports.BoundingBoxCalculator = BoundingBoxCalculator;
    exports.RaphaelEngine = RaphaelEngine;
    exports.RaphaelRectangleVertexRenderer = RaphaelRectangleVertexRenderer;
    exports.Renderer = Renderer;
    exports.Point = Point;
    exports.Rectangle = Rectangle;
    exports.GeometryUtils = GeometryUtils;
    exports.SvgUtils = SvgUtils;
    exports.DomUtils = DomUtils;
    exports.OUT = OUT;
    exports.IN = IN;
    exports.BOTH = BOTH;
    exports.PROP_TYPE = PROP_TYPE;
    exports.AND = AND;
    exports.OR = OR;
    exports.BOTH_FILTER = BOTH_FILTER;
    exports.VERTEX_FILTER = VERTEX_FILTER;
    exports.EDGE_FILTER = EDGE_FILTER;
    exports.NODE_WIDTH = NODE_WIDTH;
    exports.QueryResultVertexPropertyPredicate = QueryResultVertexPropertyPredicate;
    exports.GraphSONReader = GraphSONReader;
    exports.Tween = Tween;
    exports.CircleLayout = CircleLayout;
    exports.WheelLayout = WheelLayout;
    exports.GridLayout = GridLayout;
    exports.NodeLinkTreeLayout = NodeLinkTreeLayout;
    exports.FruchtermanReingoldLayout = FruchtermanReingoldLayout;
    exports.LayoutUtils = LayoutUtils;
    exports.Easing = Easing;
    exports.Compare = Compare;
    exports.Contains = Contains;
})({}, function() {
    return this;
}());