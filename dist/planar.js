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
        remove: function(needle, haystack) {
            var removed = false;
            var index = this.indexOf(needle, haystack);
            if (index >= 0) {
                haystack.splice(index, 1);
                removed = true;
            }
            return removed;
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
        checkExists: function(name, obj) {
            if (utils.isUndefined(obj) || obj === null) {
                throw {
                    message: name + " must be specified"
                };
            }
        },
        checkInArray: function(name, obj, array) {
            this.checkExists(name, obj);
            if (this.indexOf(obj, array) === -1) {
                throw {
                    message: name + " must be one of " + array
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
        generateId: function() {
            var id = 1;
            return function() {
                return id++;
            };
        }(),
        convertVarArgs: function(args) {
            return args.length > 0 && utils.isArray(args[0]) ? args[0] : Array.prototype.slice.call(args);
        }
    };
    var OUT = 1;
    var IN = 2;
    var BOTH = 3;
    var Element = function() {
        return {
            initProperties: function() {
                this.properties = [];
            },
            setProperty: function(key, value) {
                utils.checkExists("Property key", key);
                utils.checkExists("Property value", value);
                utils.checkNotEmpty("Property key", key);
                this.properties[key] = value;
            },
            getProperty: function(key) {
                return utils.isUndefined(this.properties[key]) ? null : this.properties[key];
            },
            getPropertyKeys: function() {
                var keys = [];
                for (var key in this.properties) {
                    keys.push(key);
                }
                return keys;
            },
            removeProperty: function(key) {
                var value = this.getProperty(key);
                delete this.properties[key];
                return value;
            },
            getId: function() {
                return this.id;
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
            this.graph = graph;
            this.initProperties();
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
            this.graph = graph;
            this.initProperties();
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
            }
        });
        return Vertex;
    }();
    var Graph = function() {
        function Graph() {
            this.vertices = {};
            this.edges = {};
        }
        utils.mixin(Graph.prototype, {
            addVertex: function(id) {
                if (utils.isUndefined(id) || id === null) {
                    id = utils.generateId();
                    while (this.getVertex(id) !== null) {
                        id = utils.generateId();
                    }
                }
                var vertex = this.getVertex(id);
                if (!vertex) {
                    vertex = new Vertex(id, this);
                }
                this.vertices[id] = vertex;
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
                    delete this.vertices[storedVertex.id];
                }
            },
            getVertices: function() {
                return utils.values(this.vertices);
            },
            addEdge: function(id, outVertex, inVertex, label) {
                if (utils.isUndefined(id) || id === null) {
                    id = utils.generateId();
                    while (this.getEdge(id) !== null) {
                        id = utils.generateId();
                    }
                }
                var edge = new Edge(id, outVertex, inVertex, label, this);
                this.edges[id] = edge;
                outVertex.outEdges[edge.id] = edge;
                inVertex.inEdges[edge.id] = edge;
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
                        delete this.edges[edgeToDelete.id];
                        delete edgeToDelete.outVertex.outEdges[edgeToDelete.id];
                        delete edgeToDelete.inVertex.inEdges[edgeToDelete.id];
                    }
                }
            },
            getEdges: function() {
                return utils.values(this.edges);
            },
            forEachNode: function(callback) {
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
            }
        });
        return Graph;
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
    var Query = function() {
        function filterElements(elements, filters, queryLimit, resultExtractor) {
            var count = 0;
            if (!utils.isArray(elements)) {
                elements = [ elements ];
            }
            var result = [];
            for (var i = 0; i < elements.length; i++) {
                var elementsByIds = elements[i];
                for (var id in elementsByIds) {
                    var element = elementsByIds[id];
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
            },
            limit: function(limit) {
                this.queryLimit = limit;
                return this;
            },
            edges: function() {
                var elements = this.getInitialEdges();
                var filters = this.getBaseFilters();
                return filterElements(elements, filters, this.queryLimit);
            },
            vertices: function() {
                var elements = this.getInitialVertices();
                var filters = this.getBaseFilters();
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
    exports.Edge = Edge;
    exports.Vertex = Vertex;
    exports.Graph = Graph;
    exports.VertexQuery = VertexQuery;
    exports.OUT = OUT;
    exports.IN = IN;
    exports.BOTH = BOTH;
})({}, function() {
    return this;
}());