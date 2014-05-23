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
    var Element = function() {
        return {
            initProperties: function(graph) {
                this.properties = [];
                this.graph = graph;
            },
            setProperty: function(key, value) {
                utils.checkExists("Property key", key);
                utils.checkExists("Property value", value);
                utils.checkNotEmpty("Property key", key);
                var oldValue = this.properties[key];
                this.properties[key] = value;
                this.graph.indexManager.updateKeyIndexValue(key, value, oldValue, this);
            },
            getProperty: function(key) {
                return utils.isUndefined(this.properties[key]) ? null : this.properties[key];
            },
            getPropertyKeys: function() {
                return utils.keys(this.properties);
            },
            removeProperty: function(key) {
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
        function Graph(container, engine) {
            this.vertices = {};
            this.edges = {};
            this.indexManager = new IndexManager(this);
            if (utils.exists(container) && utils.exists(engine)) {
                this.renderer = new Renderer(this, container, engine);
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
            getVertices: function(key, value) {
                if (utils.isUndefined(key) || key === null) {
                    return utils.values(this.vertices);
                } else {
                    return new GraphQuery(this).has(key, value).vertices();
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
            getEdges: function(key, value) {
                if (utils.isUndefined(key) || key === null) {
                    return utils.values(this.edges);
                } else {
                    return new GraphQuery(this).has(key, value).edges();
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
            render: function() {
                this.renderer.render();
            }
        });
        return Graph;
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
        function HasFilter(key, predicate, value) {
            utils.checkExists("Key", key);
            utils.checkExists("Predicate", predicate);
            this.key = key;
            this.value = value;
            this.predicate = predicate;
        }
        utils.mixin(HasFilter.prototype, {
            matches: function(element) {
                return this.predicate.evaluate(element.getProperty(this.key), this.value);
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
            has: function(key, value1, value2) {
                if (!utils.isUndefined(value2) && value2 !== null) {
                    this.hasFilters.push(new HasFilter(key, value1, value2));
                } else if (!utils.isUndefined(value1) && value1 !== null) {
                    this.hasFilters.push(new HasFilter(key, Compare.EQUAL, value1));
                } else {
                    this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, null));
                }
                return this;
            },
            hasNot: function(key, value) {
                if (utils.isUndefined(value) || value === null) {
                    this.hasFilters.push(new HasFilter(key, Compare.EQUAL, null));
                } else {
                    this.hasFilters.push(new HasFilter(key, Compare.NOT_EQUAL, value));
                }
                return this;
            },
            interval: function(key, startValue, endValue) {
                this.hasFilters.push(new HasFilter(key, Compare.GREATER_THAN_EQUAL, startValue));
                this.hasFilters.push(new HasFilter(key, Compare.LESS_THAN, endValue));
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
            init: function(container, width, height, graph) {
                utils.checkExists("Container", container);
                utils.checkExists("Graph", graph);
                if (utils.isFunction(this.initEngine)) {
                    this.initEngine(container, width, height, graph);
                }
            },
            beforeRender: function() {},
            initVertex: function() {},
            renderVertex: function() {}
        };
    }();
    var D3Engine = function() {
        function D3Engine() {}
        utils.mixin(D3Engine.prototype, Engine);
        utils.mixin(D3Engine.prototype, {
            initEngine: function(container, width, height) {
                function zoom() {
                    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }
                var svg = this.svg = d3.select(container).append("svg").attr("width", width).attr("height", height).append("g").call(d3.behavior.zoom().scaleExtent([ 1, 8 ]).on("zoom", zoom)).append("g");
                svg.append("rect").attr("class", "overlay").attr("width", width).attr("height", height);
            },
            beforeRender: function(vertices, edges) {
                var edgeSet = bindData(this.svg, "edge", edges);
                addEnterSection("edge", edgeSet);
                var vertexSet = bindData(this.svg, "vertex", vertices);
                var vertexEnter = addEnterSection("vertex", vertexSet);
                translateVertices(vertexSet);
                addDragToVertices(vertexEnter);
                updateEdgePositions(edgeSet);
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
                var elementType = uiElement[type].getProperty(PROP_TYPE);
                var clazz = type;
                if (elementType) {
                    clazz += " " + elementType;
                }
                return clazz;
            });
            element.each(function(uiElement) {'use strict';
                var elementRenderer = ElementRendererProvider.getRenderer(uiElement[type], "d3", type);
                elementRenderer.init(uiElement, d3.select(this));
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
    var D3LineEdgeRenderer = function() {
        return {
            init: function(edge, element) {
                edge.uiElement = element.append("line");
            },
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
    var D3SymbolVertexRenderer = function() {
        function D3SymbolVertexRenderer(type) {
            utils.checkExists("Type", type);
            this.type = type;
        }
        utils.mixin(D3SymbolVertexRenderer.prototype, {
            init: function(vertex, element) {
                var path = element.append("path");
                path.attr("d", d3.svg.symbol().type(this.type).size(200));
            }
        });
        return D3SymbolVertexRenderer;
    }();
    var RaphaelEngine = function() {
        function RaphaelEngine() {}
        utils.mixin(RaphaelEngine.prototype, Engine);
        utils.mixin(RaphaelEngine.prototype, {
            initEngine: function(container, width, height) {
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
                var elementType = element.getProperty(PROP_TYPE);
                if (elementType !== null) {
                    renderer = utils.get(settings, engine, type === "vertex" ? "vertexRenderers" : "edgeRenderers", elementType);
                }
                if (utils.isUndefined(renderer)) {
                    renderer = utils.get(settings, engine, type === "vertex" ? "defaultVertexRenderer" : "defaultEdgeRenderer");
                }
                return renderer;
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
        function Renderer(graph, container, engine) {
            utils.checkExists("Graph", graph);
            this.graph = graph;
            this.container = container;
            this.engine = utils.isUndefined(engine) ? settings.engine : engine;
            this.width = settings.width;
            this.height = settings.height;
            this.initialized = false;
            this.layout = settings.layout;
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
                var running = this.layout.step(this.vertices, this.edges, this.width, this.height);
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
                this.engine.init(this.container, this.width, this.height, this.graph);
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
        engine: new RaphaelEngine(),
        layout: new RandomLayout(),
        raphael: {
            defaultVertexRenderer: RaphaelRectangleVertexRenderer,
            vertexRenderers: {}
        },
        d3: {
            defaultVertexRenderer: new D3SymbolVertexRenderer("circle"),
            defaultEdgeRenderer: D3LineEdgeRenderer,
            vertexRenderers: {
                circle: new D3SymbolVertexRenderer("circle"),
                cross: new D3SymbolVertexRenderer("cross"),
                diamond: new D3SymbolVertexRenderer("diamond"),
                square: new D3SymbolVertexRenderer("square"),
                "triangle-down": new D3SymbolVertexRenderer("triangle-down"),
                "triangle-up": new D3SymbolVertexRenderer("triangle-up")
            },
            edgeRenderers: {
                line: D3LineEdgeRenderer
            }
        },
        width: 640,
        height: 480
    };
    exports.settings = settings;
    exports.Edge = Edge;
    exports.Vertex = Vertex;
    exports.Graph = Graph;
    exports.VertexQuery = VertexQuery;
    exports.GraphQuery = VertexQuery;
    exports.Index = Index;
    exports.RandomLayout = RandomLayout;
    exports.ForceDirectedLayout = ForceDirectedLayout;
    exports.D3Engine = D3Engine;
    exports.D3SymbolVertexRenderer = D3SymbolVertexRenderer;
    exports.D3LineEdgeRenderer = D3LineEdgeRenderer;
    exports.RaphaelEngine = RaphaelEngine;
    exports.RaphaelRectangleVertexRenderer = RaphaelRectangleVertexRenderer;
    exports.Renderer = Renderer;
    exports.OUT = OUT;
    exports.IN = IN;
    exports.BOTH = BOTH;
    exports.PROP_TYPE = PROP_TYPE;
})({}, function() {
    return this;
}());