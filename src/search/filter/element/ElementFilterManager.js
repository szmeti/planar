/* global ElementFilterManager: true */
var ElementFilterManager = (function () {

  function ElementFilterManager(graph) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.vertexOperator = AND;
    this.edgeOperator = AND;
    this.executed = false;
    this.filters = [];

    this.normalGraph = new Graph();
    this.aggregatedGraph = new Graph();
    this.filteredVertices = [];
    this.filteredEdges = [];
    this.filteredAggregatedVertices = [];
    this.filteredAggregatedEdges = [];
  }

  utils.mixin(ElementFilterManager.prototype, {
    addFilter: function(newFilter) {
      newFilter = newFilter || new ElementFilter();
      this.filters.push(newFilter);
      return newFilter;
    },

    vertexFilterOperator: function(operator) {
      this.vertexOperator = operator;
      return this;
    },

    edgeFilterOperator: function(operator) {
      this.edgeOperator = operator;
      return this;
    },

    getNormalGraph: function () {
      if (this.executed) {
        return this.normalGraph;
      }

      filterGraph(this);
      return this.normalGraph;
    },

    getAggragatedGraph: function () {
      if (this.executed) {
        return this.aggregatedGraph;
      }

      filterGraph(this);
      return this.aggregatedGraph;
    },

    getFilteredVertices: function () {
      if (this.executed) {
        return this.filteredVertices;
      }

      filterGraph(this);
      return this.filteredVertices;
    },

    getFilteredEdges: function () {
      if (this.executed) {
        return this.filteredEdges;
      }

      filterGraph(this);
      return this.filteredEdges;
    },

    getFilteredAggregatedVertices: function () {
      if (this.executed) {
        return this.filteredAggregatedVertices;
      }

      filterGraph(this);
      return this.filteredAggregatedVertices;
    },

    getFilteredAggregatedEdges: function () {
      if (this.executed) {
        return this.filteredAggregatedEdges;
      }

      filterGraph(this);
      return this.filteredAggregatedEdges;
    },

    reset: function() {
      this.executed = false;
      return this;
    }

  });

  function filterGraph(context) {
    applyFilters(context.graph.getVertices(), context, filterVertices);
    applyFilters(context.graph.getEdges(), context, filterEdges);
    context.executed = true;
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
    vertex.copyProperties(newVertex);
  }

  function addEdgeToGraph(graph, edge) {
    var newEdge = graph.addEdge(edge.id, edge.outVertex, edge.inVertex, edge.label);
    edge.copyProperties(newEdge);
  }

  function filterEdges(edge, context, filtered) {
    var inVertex = context.normalGraph.getVertex(edge.inVertex.id);
    var outVertex = context.normalGraph.getVertex(edge.outVertex.id);
    var existingVertices = inVertex !== null && outVertex !== null;

    if (existingVertices && !filtered) {
      addEdgeToGraph(context.normalGraph, edge);
      addAggregatedEdgeToGraph(context, edge);
    } else {
      addAggregatedEdgeToFilteredList(context, edge);
      context.filteredEdges.push(edge);
    }
  }

  function addAggregatedEdgeToFilteredList(context, edge) {
    for (var i = 0; i < context.filteredEdges.length; i++) {
      var filteredEdge = context.filteredEdges[i];
      var connectsSameVertices = edge.connects(filteredEdge.inVertex, filteredEdge.outVertex);
      if (connectsSameVertices) {
        var strength = edge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
        strength += filteredEdge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
        var newEdge = createSingleAggregatedEdge(filteredEdge.outVertex, filteredEdge.inVertex, strength, context);
        context.filteredAggregatedEdges.push(newEdge);
      }
    }
  }

  function createSingleAggregatedEdge(outVertex, inVertex, strength, context) {
    var id = utils.generateId();
    while (context.aggregatedGraph.getEdge(id) !== null) {
      id = utils.generateId();
    }
    var newEdge = new Edge(id, outVertex, inVertex, null, context.aggregatedGraph);
    newEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
    return newEdge;
  }

  function addAggregatedEdgeToGraph(context,edge) {
    var inVertex = context.aggregatedGraph.getVertex(edge.inVertex.id);
    var outVertex = context.aggregatedGraph.getVertex(edge.outVertex.id);

    var settings = context.graph.getSettings();
    var strength = edge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;

    var inVertexEdges = inVertex.getEdges(BOTH);

    if (inVertexEdges.length < 1) {
      var newEdge = context.aggregatedGraph.addEdge(null, outVertex, inVertex);
      newEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
    } else {
      findConnectedEdgesAndAggregate(inVertexEdges, outVertex, strength);
    }
  }

  function findConnectedEdgesAndAggregate(sourceVertexEdges, destinationVertex, currentStrength) {
    for(var i = 0; i < sourceVertexEdges.length; i++) {
      var currentEdge = sourceVertexEdges[i];
      var connectedWithDestinationVertex = currentEdge.inVertex === destinationVertex || currentEdge.outVertex === destinationVertex;

      if (connectedWithDestinationVertex) {
        //already has connection
        currentStrength += currentEdge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
        currentEdge.setProperty(settings.edge.lineWeightPropertyKey, currentStrength);
      }
    }
  }

  function applyFilters(elements, context, filterCallback) {
    if (!utils.isArray(elements)) {
      elements = [elements];
    }

    for (var i = 0; i < elements.length; i++) {
      var currentElements = elements[i];
      if (utils.isOfType(elements[i], Vertex) || utils.isOfType(elements[i], Edge)) {
        currentElements = [currentElements];
      }

      for (var id in currentElements) {
        var element = currentElements[id];
        var filters = context.filters;
        var operator = utils.isOfType(element, Vertex) ? context.vertexOperator : context.edgeOperator;

        var filtered = checkFiltered(element, filters, operator);

        filterCallback(element, context, filtered);
      }
    }
  }

  function checkFiltered(element, filters, operator) {
    var nonMatchedFilters = 0;
    var filterCount = filters.length;

    for (var j = 0; j < filterCount; j++) {
      var filterMatched = true;
      var currentFilter = filters[j];

      if(!filterCanBeApplied(element, currentFilter)) {
        continue;
      }

      var hasFilters = currentFilter.hasFilters;
      for (var k = 0; k < hasFilters.length; k++) {
        if (!hasFilters[k].matches(element)) {
          filterMatched = false;
        }
      }

      if (filterMatched) {
        currentFilter.count(currentFilter.count() + 1);
      } else if (currentFilter.active()) {
        nonMatchedFilters++;
      }
    }

    return operator === AND ? nonMatchedFilters > 0 : nonMatchedFilters === filterCount;
  }

  function filterCanBeApplied(element, filter) {
    return utils.isOfType(element, Vertex) && filter.type() === VERTEX_FILTER ||
      utils.isOfType(element, Edge) && filter.type() === EDGE_FILTER ||
      filter.type() === BOTH_FILTER;
  }

  return ElementFilterManager;

}());
