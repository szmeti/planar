/* global Renderer: true */
var Renderer = (function () {

  function Renderer(graph, instanceSettings) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.container = instanceSettings.container;
    this.navigatorContainer = instanceSettings.navigatorContainer;
    this.engine = instanceSettings.engine;
    this.initialized = false;
    this.settings = instanceSettings;
    this.vertices = [];
    this.verticesById = {};
    this.edges = [];
    this.edgesById = {};
    var Layout = this.settings.layouts[this.settings.defaultLayout];
    this.layout = new Layout(this.settings.animationDuration, this.settings.easing);
  }

  function addVertex(vertex, renderer) {
    var uiVertex = {id: vertex.getId(), vertex: vertex};
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
    graph.on('vertexAdded', function (event, vertex) {
      addVertex(vertex, renderer);
    });

    graph.on('edgeAdded', function (event, edge) {
      addEdge(edge, renderer);
    });

    graph.on('vertexRemoved', function (event, vertex) {
      removeVertex(vertex, renderer);
    });

    graph.on('edgeRemoved', function (event, edge) {
      removeEdge(edge, renderer);
    });

    graph.on('vertexClicked', function (event, vertex) {
      this.renderer.selectedVertex = vertex;
    });

    graph.on('vertexDragStart', function (event, vertex) {
      vertex.uiElement.remove();
      this.renderer.selectedVertex = vertex;
    });
  }

  utils.mixin(Renderer.prototype, {

    render: function (steps) {
      if (!this.initialized) {
        this.init();
      }

      if (this.timer) {
        return;
      }

      this.timer = new Timer(this.onAnimationFrame, this);
      this.timer.start();
    },

    onAnimationFrame: function () {
      var running = this.layout.step(this.vertices, this.edges, this.settings.width, this.settings.height, this.selectedVertex);
      this.renderFrame();
      return running;
    },

    renderFrame: function () {
      this.engine.beforeRender(this.vertices, this.edges);

      var self = this;
      // TODO update this to use this.vertices
      this.graph.forEachVertex(function (vertex) {
        self.engine.renderVertex(vertex);
      });
    },

    init: function () {
      setUpEventHandlers(this.graph, this);
      this.engine.init(this.settings, this.graph);

      var self = this;

      this.graph.forEachVertex(function (vertex) {
        if (!self.verticesById[vertex.getId()]) {
          addVertex(vertex, self);
        }
        self.engine.initVertex(vertex);
      });

      this.graph.forEachEdge(function (edge) {
        if (!self.edgesById[edge.getId()]) {
          addEdge(edge, self);
        }
      });

      this.initialized = true;
    },

    saveAsImage: function () {
      this.engine.saveAsImage();
    },

    changeLayout: function (layout) {
      for (var i = 0; i < this.vertices.length; i++) {
        var uiVertex = this.vertices[i];
        uiVertex.started = false;
        uiVertex.finished = false;
        uiVertex.endX = undefined;
        uiVertex.endY = undefined;
      }
      var Layout = this.settings.layouts[layout];
      this.layout = new Layout(this.settings.animationDuration, this.settings.easing);
      // TODO: find another solution for zoom out when layout changed
      this.graph.trigger('graphZoomOut');
    },

    stop: function () {
      this.timer.stop();
    }

  });

  return Renderer;

}());