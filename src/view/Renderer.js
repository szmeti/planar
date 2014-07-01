/* global Renderer: true */
var Renderer = (function () {

  function Renderer(graph, container, navigatorContainer, engine, instanceSettings) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.container = container;
    this.navigatorContainer = navigatorContainer;
    this.engine = utils.isUndefined(engine) ? settings.engine : engine;
    this.width = instanceSettings.width;
    this.height = instanceSettings.height;
    this.initialized = false;
    this.layout = instanceSettings.layout;
    this.vertices = [];
    this.verticesById = {};
    this.edges = [];
    this.edgesById = {};
  }

  function setUpEventHandlers(graph, renderer) {
    graph.on('vertexAdded', function (event, vertex) {
      var uiVertex = {id: vertex.getId(), vertex: vertex};
      renderer.vertices.push(uiVertex);
      renderer.verticesById[uiVertex.id] = uiVertex;
    });

    graph.on('edgeAdded', function (event, edge) {
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

    graph.on('vertexRemoved', function (event, vertex) {
      var uiVertex = renderer.verticesById[vertex.getId()];
      utils.remove(uiVertex, renderer.vertices);
      delete renderer.verticesById[uiVertex.id];
    });

    graph.on('edgeRemoved', function (event, edge) {
      var uiEdge = renderer.edgesById[edge.getId()];
      utils.remove(uiEdge, renderer.edges);
      delete renderer.edgesById[uiEdge.id];
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
      var running = this.layout.step(this.vertices, this.edges, this.width, this.height);
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
      this.engine.init(this.container, this.navigatorContainer, this.width, this.height, this.graph);
      var self = this;
      this.graph.forEachVertex(function (vertex) {
        self.engine.initVertex(vertex);
      });
      this.initialized = true;
    }

  });

  return Renderer;

}());