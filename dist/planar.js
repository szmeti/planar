(function(exports, global) {'use strict';
    global["planar"] = exports;
    var VERSION = "0.0.1";
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
    var OUT = 1;
    var IN = 2;
    var BOTH = 3;
    var PROP_TYPE = "_type";
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
            instanceSettings = instanceSettings || {};
            this.settings = utils.mixin({}, settings);
            this.settings = utils.mixin(this.settings, instanceSettings);
            if (utils.exists(this.settings.container) && utils.exists(this.settings.engine)) {
                this.renderer = new Renderer(this, this.settings);
                this.renderer.init();
            }
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
    var LabelFilter = function() {
        function LabelFilter() {
            this.labels = utils.convertVarArgs(arguments);
        }
        utils.mixin(LabelFilter.prototype, {
            matches: function(element) {
                for (var i = 0; i < this.labels.length; i++) {
                    if (this.labels[i] === element.getLabel()) {
                        return true;
                    }
                }
                return false;
            }
        });
        return LabelFilter;
    }();
    var Compare = function() {
        return {
            EQUAL: {
                evaluate: function(first, second) {
                    return first === second;
                }
            },
            NOT_EQUAL: {
                evaluate: function(first, second) {
                    return first !== second;
                }
            },
            GREATER_THAN: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first > second;
                }
            },
            LESS_THAN: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first < second;
                }
            },
            GREATER_THAN_EQUAL: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first >= second;
                }
            },
            LESS_THAN_EQUAL: {
                evaluate: function(first, second) {
                    return first !== null && second !== null && first <= second;
                }
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
            NOT_IN: {
                evaluate: function(first, second) {
                    utils.checkArray("Second argument", second);
                    return utils.indexOf(first, second) === -1;
                }
            }
        };
    }();
    var HasFilter = function() {
        function HasFilter(key, predicate, value, disabledFilters) {
            utils.checkExists("Key", key);
            utils.checkExists("Predicate", predicate);
            this.key = key;
            this.predicate = predicate;
            this.value = value;
            this.disabledFilters = disabledFilters;
        }
        utils.mixin(HasFilter.prototype, {
            matches: function(element) {
                return this.predicate.evaluate(element.getProperty(this.key, this.disabledFilters), this.value);
            }
        });
        return HasFilter;
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
        return {
            initQuery: function() {
                this.queryLimit = Number.MAX_VALUE;
                this.hasFilters = [];
            },
            limit: function(limit) {
                this.queryLimit = limit;
                return this;
            },
            has: function(key, value1, value2, disabledFilters) {
                disabledFilters = disabledFilters || [];
                if (!utils.isUndefined(value2) && value2 !== null) {
                    this.hasFilters.push(new HasFilter(key, value1, value2, disabledFilters));
                } else if (!utils.isUndefined(value1) && value1 !== null) {
                    this.hasFilters.push(new HasFilter(key, Compare.EQUAL, value1, disabledFilters));
                } else {
                    this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, null, disabledFilters));
                }
                return this;
            },
            hasNot: function(key, value, disabledFilters) {
                disabledFilters = disabledFilters || [];
                if (utils.isUndefined(value) || value === null) {
                    this.hasFilters.push(new HasFilter(key, Compare.EQUAL, null, disabledFilters));
                } else {
                    this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, value, disabledFilters));
                }
                return this;
            },
            interval: function(key, startValue, endValue, disabledFilters) {
                disabledFilters = disabledFilters || [];
                this.hasFilters.push(new HasFilter(key, Compare.GREATER_THAN_EQUAL, startValue, disabledFilters));
                this.hasFilters.push(new HasFilter(key, Compare.LESS_THAN, endValue, disabledFilters));
                return this;
            },
            edges: function() {
                var elements = this.getInitialEdges();
                var filters = this.getBaseFilters();
                filters = filters.concat(this.hasFilters);
                return filterElements(elements, filters, this.queryLimit);
            },
            vertices: function() {
                var elements = this.getInitialVertices();
                var filters = this.getBaseFilters();
                filters = filters.concat(this.hasFilters);
                return filterElements(elements, filters, this.queryLimit, this.resultExtractor(this));
            }
        };
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
                return this.queryLabels.length > 0 ? [ new LabelFilter(this.queryLabels) ] : [];
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
                var edges = this.graph.indexManager.fetchFirstMatching(Edge, this.hasFilters);
                if (!edges) {
                    edges = this.graph.edges;
                }
                return edges;
            },
            getInitialVertices: function() {
                var vertices = this.graph.indexManager.fetchFirstMatching(Vertex, this.hasFilters);
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
        function RandomLayout() {
            this.running = true;
        }
        utils.mixin(RandomLayout.prototype, {
            step: function(vertices, edges, width, height) {
                if (this.running) {
                    for (var i = 0; i < vertices.length; i++) {
                        var vertex = vertices[i];
                        vertex.x = utils.randomInteger(0, width + 1);
                        vertex.y = utils.randomInteger(0, height + 1);
                    }
                }
                this.running = false;
                return this.running;
            }
        });
        return RandomLayout;
    }();
    var ForceDirectedLayout = function() {
        function ForceDirectedLayout() {}
        utils.mixin(ForceDirectedLayout.prototype, {
            step: function(vertices, edges, width, height) {
                return true;
            }
        });
        return ForceDirectedLayout;
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
            renderVertex: function() {}
        };
    }();
    var D3ZoomPanManager = function() {
        function D3ZoomPanManager(settings) {}
        utils.mixin(D3ZoomPanManager.prototype, {});
        return D3ZoomPanManager;
    }();
    var D3Navigator = function() {
        function D3Navigator(selection, zoom, target, settings) {
            this.navigatorScale = settings.navigator.scale;
            this.scale = 1;
            this.zoom = zoom;
            this.target = target;
            this.width = settings.width;
            this.height = settings.height;
            this.frameX = 0;
            this.frameY = 0;
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
            D3Navigator.node = navigatorClipPath.node();
            this.frame = navigatorClipPath.append("g").attr("class", "frame");
            this.frame.append("rect").attr("class", "background").attr("width", this.width).attr("height", this.height);
            var drag = d3.behavior.drag().on("dragstart.navigator", function() {
                onDragstart(navigator);
            }).on("drag.navigator", function() {
                onDrag(navigator);
            });
            this.frame.call(drag);
        }
        utils.mixin(D3Navigator.prototype, {
            render: function() {
                this.scale = this.zoom.scale();
                this.container.attr("transform", "scale(" + this.navigatorScale + ")");
                var node = this.target.node().cloneNode(true);
                node.removeAttribute("id");
                d3.selectAll(".navigator .panCanvas").remove();
                this.base.selectAll(".navigator .canvas").remove();
                D3Navigator.node.appendChild(node);
                var targetTransform = SvgUtils.getXYFromTranslate(this.target.attr("transform"));
                this.frame.attr("transform", "translate(" + -targetTransform[0] / this.scale + "," + -targetTransform[1] / this.scale + ")").select(".background").attr("width", this.width / this.scale).attr("height", this.height / this.scale);
                this.frame.node().parentNode.appendChild(this.frame.node());
                d3.select(node).attr("transform", "translate(1,1)");
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
        function D3ZoomPanControl(container, zoom, target, settings) {
            this.base = container;
            this.width = settings.width;
            this.height = settings.height;
            this.zoom = zoom;
            this.target = target;
            this.zoomScale = settings.zoomPanControl.zoomStep;
            this.panScale = settings.zoomPanControl.panStep;
            this.x = settings.zoomPanControl.paddingLeft;
            this.y = settings.zoomPanControl.paddingTop;
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
            initEngine: function(settings) {
                var scale = 1, translation = [ 0, 0 ];
                this.navigatorContainer = settings.navigatorContainer;
                var xScale = d3.scale.linear().domain([ -settings.width / 2, settings.width / 2 ]).range([ 0, settings.width ]);
                var yScale = d3.scale.linear().domain([ -settings.height / 2, settings.height / 2 ]).range([ settings.height, 0 ]);
                var zoomHandler = function(newScale) {
                    if (!settings.zoom.enabled) {
                        return;
                    }
                    if (d3.event) {
                        scale = d3.event.scale;
                    } else {
                        scale = newScale;
                    }
                    if (settings.drag.enabled) {
                        var topBound = -settings.height * scale + settings.height, bottomBound = 0, leftBound = -settings.width * scale + settings.width, rightBound = 0;
                        translation = d3.event ? d3.event.translate : [ 0, 0 ];
                        translation = [ Math.max(Math.min(translation[0], rightBound), leftBound), Math.max(Math.min(translation[1], bottomBound), topBound) ];
                    }
                    d3.select(".panCanvas, .panCanvas .bg").attr("transform", "translate(" + translation + ")" + " scale(" + scale + ")");
                };
                function initCommonDefs(svgDefs) {
                    svgDefs.append("clipPath").attr("id", "wrapperClipPath").attr("class", "wrapper clipPath").append("rect").attr("class", "background").attr("width", settings.width).attr("height", settings.height);
                    var outerWrapper = svg.append("g").attr("id", "outerWrapper").attr("class", "wrapper outer");
                    outerWrapper.append("rect").attr("class", "background").attr("width", settings.width).attr("height", settings.height);
                    var innerWrapper = outerWrapper.append("g").attr("class", "wrapper inner").attr("clip-path", "url(#wrapperClipPath)").call(zoom);
                    innerWrapper.append("rect").attr("class", "background").attr("width", settings.width).attr("height", settings.height);
                    var panCanvas = innerWrapper.append("g").attr("id", "panCanvas").attr("class", "panCanvas").attr("width", settings.width).attr("height", settings.height).attr("transform", "translate(0,0)");
                    panCanvas.append("rect").attr("class", "background").attr("width", settings.width).attr("height", settings.height);
                    panCanvas.append("g").attr("id", "graphElements").attr("transform", "scale(0.5)");
                }
                var zoom = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([ settings.zoom.minScale, settings.zoom.maxScale ]).on("zoom.canvas", zoomHandler);
                var svg = this.svg = d3.select(settings.container).append("svg").attr("class", "svg canvas").attr("width", settings.width).attr("height", settings.height);
                svg.append("rect").attr("class", "overlay").attr("width", settings.width).attr("height", settings.height);
                var defs = svg.append("defs");
                initCommonDefs(defs);
                this.panCanvas = d3.select("#panCanvas");
                this.graphElements = d3.select("#graphElements");
                this.navigator = initNavigator(zoom, settings);
                initZoomPanControl(svg, zoom);
                var d3Renderers = ElementRendererProvider.getAll("d3");
                for (var i = 0; i < d3Renderers.length; i++) {
                    if (typeof d3Renderers[i].initDefs === "function") {
                        d3Renderers[i].initDefs(defs);
                    }
                }
            },
            beforeRender: function(vertices, edges) {
                var edgeSet = bindData(this.graphElements, "edge", edges);
                addEnterSection("edge", edgeSet);
                var vertexSet = bindData(this.graphElements, "vertex", vertices);
                var vertexEnter = addEnterSection("vertex", vertexSet);
                translateVertices(vertexSet);
                addDragToVertices(vertexEnter);
                updateEdgePositions(edgeSet);
                if (utils.exists(this.navigatorContainer)) {
                    this.navigator.render();
                }
            }
        });
        function initNavigator(zoom, settings) {
            if (!utils.exists(settings.container)) {
                return null;
            }
            var navigatorSvg = d3.select(settings.navigatorContainer).append("svg").attr("width", settings.width * settings.navigator.scale).attr("height", settings.height * settings.navigator.scale).attr("class", "svg canvas");
            return new D3Navigator(navigatorSvg, zoom, d3.select("#panCanvas"), settings);
        }
        function initZoomPanControl(container, zoom) {
            var zoomPanControl = new D3ZoomPanControl(container, zoom, d3.select("#panCanvas"), settings);
            zoomPanControl.render();
        }
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
        function addDragToVertices(element) {
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
            element.call(drag);
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
        return {
            init: function(edge, element) {
                var text = element.append("text").attr("id", "text-of-label-" + edge.id).attr("x", 10).attr("y", 100).attr("alignment-baseline", "central").attr("text-anchor", "middle").attr("class", "edge-label");
                text.append("tspan").attr("baseline-shift", "super").text(edge.edge.label);
                edge.uiElement = element.append("path").attr("id", "edgeLabel").attr("class", "directed-edge arrow").attr("marker-end", "url(#arrow)").attr("style", "fill: none;stroke: #666;stroke-width: 1.5px;");
                if (edge.edge.label === "references") {
                    edge.uiElement.attr("stroke-dasharray", "5,5");
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
        };
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
        return {
            init: function(edge, element) {
                edge.uiElement = element.append("line");
            },
            initDefs: function(defs) {},
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
        };
    }();
    var D3QueryResultVertexRenderer = function() {
        return {
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
                whiteGradient.append("stop").attr("offset", "0%").attr("style", "stop-color:#f9f9f9;stop-opacity:1");
                whiteGradient.append("stop").attr("offset", "100%").attr("style", "stop-color:#edebf4;stop-opacity:1");
                var zoomInIcon = defs.append("g").attr("id", "icon-zoomin");
                zoomInIcon.append("path").attr("d", "M15.504 13.616l-3.79-3.223c-0.392-0.353-0.811-0.514-1.149-0.499 " + "0.895-1.048 1.435-2.407 1.435-3.893 0-3.314-2.686-6-6-6-3.314 0-6 2.686-6 " + "6 0 3.314 2.686 6 6 6 1.486 0 2.845-0.54 3.893-1.435-0.016 0.338 0.146 0.757 " + "0.499 1.149l3.223 3.79c0.552 0.613 1.453 0.665 2.003 0.115s0.498-1.452-0.115-2.003zM6 " + "10c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zM7 3h-2v2h-2v2h2v2h2v-2h2v-2h-2z");
            }
        };
    }();
    var D3QueryVertexRenderer = function() {
        return {
            init: function(uiVertex, element) {
                var vertex = uiVertex.vertex;
                var filters = vertex.getPropertyUnfiltered("filters") || [];
                var alias = vertex.getPropertyUnfiltered("alias");
                var entityType = vertex.getPropertyUnfiltered("entityType");
                var lineHeight = 25;
                var boxPadding = 10;
                var numberOfLines = 1 + filters.length;
                var currentHeight = -(numberOfLines * lineHeight) / 2 + lineHeight / 2;
                var boundingBoxCalculator = new BoundingBoxCalculator(boxPadding, lineHeight, numberOfLines);
                uiVertex.uiElement = element;
                var header = element.append("g").attr("class", "query-vertex-header");
                var entityTypeLabel = header.append("text").attr("class", "entity-type-label").attr("text-anchor", "start").attr("y", currentHeight).text(entityType);
                var aliasText = header.append("text").attr("class", "alias-label").attr("text-anchor", "end").attr("y", currentHeight).text(alias);
                boundingBoxCalculator.addElement(header[0][0]);
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i];
                    currentHeight += lineHeight;
                    var propertyKey = D3QueryVertexRenderer.formatText(filter, alias, filter.propertyKey);
                    var value = D3QueryVertexRenderer.formatText(filter, alias, filter.value);
                    var text = D3QueryVertexRenderer.translateTextWithPredicate(filter.predicate, propertyKey, value);
                    var filterText = element.append("text").attr("text-anchor", "middle").attr("x", 0).attr("y", currentHeight).text(text);
                    boundingBoxCalculator.addElement(filterText[0][0]);
                }
                var linePadding = 5;
                var totalWidth = boundingBoxCalculator.totalWidth();
                var minWidth = header[0][0].getBBox().width + 4 * boxPadding;
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
                aliasText.attr("x", rightEdge - boxPadding);
                entityTypeLabel.attr("x", leftEdge + boxPadding);
                element.append("line").attr("class", "divider").attr("x1", leftEdge).attr("y1", dividerY).attr("x2", rightEdge).attr("y2", dividerY);
                element.insert("rect", ".query-vertex-header").attr("class", "query-vertex-box").attr("rx", "4").attr("width", totalWidth).attr("height", totalHeight).attr("x", leftEdge).attr("y", boundingBoxCalculator.topEdge());
            },
            initDefs: function(defs) {
                var whiteGradient = defs.append("linearGradient").attr("id", "queryVertexDefaultFillScheme").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
                whiteGradient.append("stop").attr("offset", "0%").attr("style", "stop-color:#f9f9f9;stop-opacity:1");
                whiteGradient.append("stop").attr("offset", "100%").attr("style", "stop-color:#edebf4;stop-opacity:1");
                var closeIcon = defs.append("symbol").attr("id", "icon-close").attr("viewBox", "0 0 16 16");
                closeIcon.append("title").text("close");
                closeIcon.append("path").attr("d", "M2.343 13.657c-3.124-3.124-3.124-8.19 0-11.314 3.125-3.124 8.19-3.124 11.315 0 3.124 3.124 3.124 8.19 0 11.314-3.125 3.125-8.19 3.125-11.315 0zM12.243 3.757c-2.344-2.343-6.143-2.343-8.485 0-2.344 2.343-2.344 6.142 0 8.485 2.343 2.343 6.142 2.343 8.485 0 2.343-2.343 2.343-6.142 0-8.485zM5.879 11.536l-1.414-1.415 2.121-2.121-2.121-2.121 1.414-1.415 2.121 2.122 2.121-2.122 1.414 1.415-2.121 2.121 2.121 2.121-1.414 1.415-2.121-2.122-2.121 2.122z");
            },
            formatText: function(filter, alias, text) {
                if (filter.hasOwnProperty("referencedAlias")) {
                    return alias + "." + text;
                } else {
                    return text;
                }
            },
            translateTextWithPredicate: function(predicate, propertyKey, value) {
                switch (predicate) {
                  case "LESS_THAN":
                    return propertyKey + " < " + value;

                  case "LESS_THAN_EQUAL":
                    return propertyKey + " <= " + value;

                  case "GREATER_THAN":
                    return propertyKey + " > " + value;

                  case "GREATER_THAN_EQUAL":
                    return propertyKey + " >= " + value;

                  case "CONTAINS":
                    return "CONTAINS(" + propertyKey + "," + value + ")";

                  case "CONTAINS_PREFIX":
                    return "CONTAINS_PREFIX(" + propertyKey + "," + value + ")";

                  case "CONTAINS_REGEX":
                    return "CONTAINS_REGEX(" + propertyKey + "," + value + ")";

                  case "PREFIX":
                    return "PREFIX(" + propertyKey + "," + value + ")";

                  case "REGEX":
                    return "REGEX(" + propertyKey + "," + value + ")";

                  case "EQUAL":
                    return propertyKey + " = " + value;

                  case "NOT_EQUAL":
                    return propertyKey + decodeURI(" ≠ ") + value;

                  case "IN":
                    return propertyKey + decodeURI(" ∈ ") + value;

                  case "NOT_IN":
                    return propertyKey + decodeURI(" ∉ ") + value;
                }
            }
        };
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
            },
            initDefs: function(defs) {}
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
                var elementType = element.getPropertyUnfiltered(PROP_TYPE);
                if (elementType !== null) {
                    renderer = utils.get(settings, engine, type === "vertex" ? "vertexRenderers" : "edgeRenderers", elementType);
                }
                if (utils.isUndefined(renderer)) {
                    renderer = utils.get(settings, engine, type === "vertex" ? "defaultVertexRenderer" : "defaultEdgeRenderer");
                }
                return renderer;
            },
            getAll: function(engine) {
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
    var Renderer = function() {
        function Renderer(graph, instanceSettings) {
            utils.checkExists("Graph", graph);
            this.graph = graph;
            this.container = settings.container;
            this.navigatorContainer = settings.navigatorContainer;
            this.engine = utils.isUndefined(instanceSettings.engine) ? settings.engine : instanceSettings.engine;
            this.initialized = false;
            this.settings = instanceSettings;
            this.vertices = [];
            this.verticesById = {};
            this.edges = [];
            this.edgesById = {};
        }
        function setUpEventHandlers(graph, renderer) {
            graph.on("vertexAdded", function(event, vertex) {
                var uiVertex = {
                    id: vertex.getId(),
                    vertex: vertex
                };
                renderer.vertices.push(uiVertex);
                renderer.verticesById[uiVertex.id] = uiVertex;
            });
            graph.on("edgeAdded", function(event, edge) {
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
            });
            graph.on("vertexRemoved", function(event, vertex) {
                var uiVertex = renderer.verticesById[vertex.getId()];
                utils.remove(uiVertex, renderer.vertices);
                delete renderer.verticesById[uiVertex.id];
            });
            graph.on("edgeRemoved", function(event, edge) {
                var uiEdge = renderer.edgesById[edge.getId()];
                utils.remove(uiEdge, renderer.edges);
                delete renderer.edgesById[uiEdge.id];
            });
        }
        utils.mixin(Renderer.prototype, {
            render: function(steps) {
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
                var running = this.settings.layout.step(this.vertices, this.edges, this.settings.width, this.settings.height);
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
                setUpEventHandlers(this.graph, this);
                this.engine.init(this.settings, this.graph);
                var self = this;
                this.graph.forEachVertex(function(vertex) {'use strict';
                    self.engine.initVertex(vertex);
                });
                this.initialized = true;
            }
        });
        return Renderer;
    }();
    var settings = {
        container: null,
        navigatorContainer: null,
        engine: new D3Engine(),
        layout: new RandomLayout(),
        raphael: {
            defaultVertexRenderer: RaphaelRectangleVertexRenderer,
            vertexRenderers: {}
        },
        d3: {
            defaultVertexRenderer: new D3SymbolVertexRenderer("circle"),
            defaultEdgeRenderer: D3DirectedLineEdgeRenderer,
            vertexRenderers: {
                circle: new D3SymbolVertexRenderer("circle"),
                cross: new D3SymbolVertexRenderer("cross"),
                diamond: new D3SymbolVertexRenderer("diamond"),
                square: new D3SymbolVertexRenderer("square"),
                "triangle-down": new D3SymbolVertexRenderer("triangle-down"),
                "triangle-up": new D3SymbolVertexRenderer("triangle-up"),
                "query-vertex": D3QueryVertexRenderer,
                "query-result-vertex": D3QueryResultVertexRenderer
            },
            edgeRenderers: {
                line: D3DirectedLineEdgeRenderer
            }
        },
        width: 900,
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
        }
    };
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
    exports.D3Navigator = D3Navigator;
    exports.D3ZoomPanManager = D3ZoomPanManager;
    exports.D3ZoomPanControl = D3ZoomPanControl;
    exports.D3Engine = D3Engine;
    exports.D3SymbolVertexRenderer = D3SymbolVertexRenderer;
    exports.D3QueryVertexRenderer = D3QueryVertexRenderer;
    exports.D3QueryResultVertexRenderer = D3QueryResultVertexRenderer;
    exports.D3LineEdgeRenderer = D3LineEdgeRenderer;
    exports.D3DirectedLineEdgeRenderer = D3DirectedLineEdgeRenderer;
    exports.RaphaelEngine = RaphaelEngine;
    exports.RaphaelRectangleVertexRenderer = RaphaelRectangleVertexRenderer;
    exports.Renderer = Renderer;
    exports.Point = Point;
    exports.Rectangle = Rectangle;
    exports.GeometryUtils = GeometryUtils;
    exports.SvgUtils = SvgUtils;
    exports.OUT = OUT;
    exports.IN = IN;
    exports.BOTH = BOTH;
    exports.PROP_TYPE = PROP_TYPE;
    exports.QueryResultVertexPropertyPredicate = QueryResultVertexPropertyPredicate;
})({}, function() {
    return this;
}());