/* global VisualGraph: true */
var VisualGraph = (function () {

  function VisualGraph(graph) {
    this.graph = graph;
    initRenderer(this);
  }

  function initRenderer(visualGraph) {
    var settings = visualGraph.getSettings();

    utils.checkExists('Container element', settings.container);
    utils.checkExists('Graphics engine', settings.engine);

    visualGraph.renderer = new Renderer(visualGraph, settings);
    visualGraph.renderer.init();
  }

  utils.mixin(VisualGraph.prototype, {

    addVertex: function (id) {
      return this.graph.addVertex(id);
    },

    getVertex: function (id) {
      return this.graph.getVertex(id);
    },

    removeVertex: function (vertex) {
      this.graph.removeVertex(vertex);
    },

    getVertices: function (key, value, disabledFilters) {
      return this.graph.getVertices(key, value, disabledFilters);
    },

    addEdge: function (id, outVertex, inVertex, label) {
      return this.graph.addEdge(id, outVertex, inVertex, label);
    },

    getEdge: function (id) {
      return this.graph.getEdge(id);
    },

    removeEdge: function (edge) {
      this.graph.removeEdge(edge);
    },

    getEdges: function (key, value, disabledFilters) {
      return this.graph.getEdges(key, value, disabledFilters);
    },

    forEachVertex: function (callback) {
      this.graph.forEachVertex(callback);
    },

    forEachEdge: function (callback) {
      this.graph.forEachEdge(callback);
    },

    query: function () {
      return this.graph.query();
    },

    createIndex: function (name, type) {
      return this.graph.createIndex(name, type);
    },

    getIndex: function (name, type) {
      return this.graph.getIndex(name, type);
    },

    getIndices: function () {
      return this.graph.getIndices();
    },

    dropIndex: function (name) {
      this.graph.dropIndex(name);
    },

    createKeyIndex: function (key, type) {
      return this.graph.createKeyIndex(key, type);
    },

    getIndexedKeys: function (type) {
      return this.graph.getIndexedKeys(type);
    },

    dropKeyIndex: function (key, type) {
      this.graph.dropKeyIndex(key, type);
    },

    addVertexPropertyFilter: function (name, predicate) {
      this.graph.addVertexPropertyFilter(name, predicate);
    },

    addEdgePropertyFilter: function (name, predicate) {
      this.graph.addEdgePropertyFilter(name, predicate);
    },

    getPropertyFilters: function (element, disabledFilters) {
      return this.graph.getPropertyFilters(element, disabledFilters);
    },

    removeAllVertexPropertyFilters: function () {
      this.graph.removeAllVertexPropertyFilters();
    },

    removeAllEdgePropertyFilters: function () {
      this.graph.removeAllEdgePropertyFilters();
    },

    removeVertexPropertyFilter: function (predicateName) {
      this.graph.removeVertexPropertyFilter(predicateName);
    },

    removeEdgePropertyFilter: function (predicateName) {
      this.graph.removeEdgePropertyFilter(predicateName);
    },

    filteredView: function () {
      return this.graph.filteredView();
    },

    getSettings: function () {
      return this.graph.getSettings();
    },

    updateSettings: function (instanceSettings) {
      this.graph.updateSettings(instanceSettings);
      initRenderer(this);
    },

    on: function (eventType, callback) {
      this.graph.on(eventType, callback);
    },

    off: function (eventType) {
      this.graph.off(eventType);
    },

    trigger: function () {
      this.graph.trigger(arguments);
    },

    render: function () {
      this.renderer.render();
    },

    saveAsImage: function () {
      this.renderer.saveAsImage();
    },

    destroy: function () {
      this.renderer.stop();
    },

    resize: function () {
      this.renderer.resize();
    },

    redraw: function () {
      this.renderer.redraw();
    },

    select: function (vertex) {
      this.renderer.select(vertex);
    },

    setPosition: function (vertex, x, y) {
      this.renderer.setPosition(vertex, x, y);
    }

  });

  return VisualGraph;

}());
