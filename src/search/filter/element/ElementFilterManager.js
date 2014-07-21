/* global ElementFilterManager: true */
var ElementFilterManager = (function () {

  function ElementFilterManager(graph) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.vertexOperator = AND;
    this.edgeOperator = AND;
    this.executed = false;
    this.filters = [];

    initResults(this);
  }

  utils.mixin(ElementFilterManager.prototype, {
    addFilter: function (newFilter) {
      newFilter = newFilter || new ElementFilter();
      this.filters.push(newFilter);
      return newFilter;
    },

    vertexFilterOperator: function (operator) {
      utils.checkArgument(operator === AND || operator === OR, 'Operator can be only AND or OR');
      this.vertexOperator = operator;
      return this;
    },

    edgeFilterOperator: function (operator) {
      utils.checkArgument(operator === AND || operator === OR, 'Operator can be only AND or OR');
      this.edgeOperator = operator;
      return this;
    },

    getNormalGraph: function () {
      if (!this.executed) {
        filterGraph(this);
      }

      return this.normalGraph;
    },

    getAggragatedGraph: function () {
      if (!this.executed) {
        filterGraph(this);
      }

      return this.aggregatedGraph;
    },

    getFilteredVertices: function () {
      if (!this.executed) {
        filterGraph(this);
      }

      return this.filteredVertices;
    },

    getFilteredEdges: function () {
      if (!this.executed) {
        filterGraph(this);
      }

      return this.filteredEdges;
    },

    getFilteredAggregatedVertices: function () {
      if (!this.executed) {
        filterGraph(this);
      }

      return this.filteredAggregatedVertices;
    },

    getFilteredAggregatedEdges: function () {
      if (!this.executed) {
        filterGraph(this);
      }

      return this.filteredAggregatedEdges;
    },

    reset: function () {
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

    for (var j = 0; j < filterCount; j++) {
      var filterMatched = true;
      var currentFilter = filters[j];

      if (!filterCanBeApplied(element, currentFilter)) {
        continue;
      }

      var hasConditions = currentFilter.hasConditions;
      for (var k = 0; k < hasConditions.length; k++) {
        if (!hasConditions[k].matches(element)) {
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
      addEdgeToGraph(context.normalGraph, edge);
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

    if (inVertexEdges.length < 1) {
      var newEdge = context.aggregatedGraph.addEdge(null, outVertex, inVertex);
      newEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
    } else {
      findConnectedEdgesAndAggregate(inVertexEdges, inVertex, outVertex, strength);
    }
  }

  function addEdgeToGraph(graph, edge) {
    var newEdge = graph.addEdge(edge.id, edge.getOutVertex(), edge.getInVertex(), edge.label);
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
        filteredEdge.setProperty(settings.edge.lineWeightPropertyKey, strength);
        break;
      }
    }

    if (context.filteredAggregatedEdges.length < 1 || !wasConnection) {
      var newEdge = createSingleAggregatedEdge(edge.getOutVertex(), edge.getInVertex(), strength, context);
      context.filteredAggregatedEdges.push(newEdge);
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

  function findConnectedEdgesAndAggregate(sourceVertexEdges, sourceVertex, destinationVertex, currentStrength) {
    for (var i = 0; i < sourceVertexEdges.length; i++) {
      var currentEdge = sourceVertexEdges[i];
      var connectedWithDestinationVertex = currentEdge.connects(sourceVertex, destinationVertex);

      if (connectedWithDestinationVertex) {
        //already has connection
        currentStrength += currentEdge.getProperty(settings.edge.lineWeightPropertyKey) || settings.edge.defaultLineWeight;
        currentEdge.setProperty(settings.edge.lineWeightPropertyKey, currentStrength);
      }
    }
  }

  function resetFilterCounters(filters) {
    for (var i = 0; i < filters.length; i++) {
      filters[i].count(0);
    }
  }

  return ElementFilterManager;

}());
