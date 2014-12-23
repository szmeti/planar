/* global Renderer: true */
var Renderer = (function () {

  function Renderer(graph, instanceSettings) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.container = instanceSettings.container;
    this.navigatorContainer = instanceSettings.navigatorContainer;
    this.engine = instanceSettings.engine;
    this.settings = instanceSettings;
    this.layoutId = this.settings.defaultLayout;
    reset(this);
    setUpEventHandlers(graph, this, this.engine);
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

  function setUpEventHandlers(graph, renderer, engine) {
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
      renderer.selectedVertex = vertex;
    });

    graph.on('vertexDragStart', function (event, vertex) {
      engine.moveVertexToFront(vertex.uiElement);
      renderer.selectedVertex = vertex;
    });

    graph.on('propertyUpdated', function (event, element, key, newValue, oldValue) {
      if (utils.isOfType(element, Vertex)) {
        engine.vertexPropertyUpdated(renderer.verticesById[element.getId()], key, newValue, oldValue);
      } else {
        engine.edgePropertyUpdated(renderer.edgesById[element.getId()], key, newValue, oldValue);
      }
    });

    graph.on('propertyRemoved', function (event, element, key, oldValue) {
      if (utils.isOfType(element, Vertex)) {
        engine.vertexPropertyRemoved(renderer.verticesById[element.getId()], key, oldValue);
      } else {
        engine.edgePropertyRemoved(renderer.edgesById[element.getId()], key, oldValue);
      }
    });

    if (!renderer.settings.width) {
      var timeOfLastResizeEvent;
      var timeout = false;
      var delta = 200;

      window.addEventListener('resize', function () {
        timeOfLastResizeEvent = new Date();
        if (timeout === false) {
          timeout = true;
          setTimeout(checkIfResizeEnded, delta);
        }
      });

      var checkIfResizeEnded = function () {
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
        message: 'Cannot find graph container'
      };
    }

    return container.offsetWidth;
  }

  utils.mixin(Renderer.prototype, {

    render: function () {
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
      if (!this.settings.width) {
        this.settings.width = determineContainerWidth(this.settings.container);
      }

      this.engine.init(this.settings, this.graph, this);

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
      this.layoutId = layout;
      var Layout = this.settings.layouts[layout];
      this.layout = new Layout(this.settings.animationDuration, this.settings.easing);
      // TODO: find another solution for zoom out when layout changed
      this.graph.trigger('graphZoomOut');
    },

    stop: function () {
      if (this.timer) {
        this.timer.stop();
        this.timer = null;
      }
      this.engine.stop();
    },

    resize: function () {
      resize(this);
    },

    setPosition: function (vertex, x, y) {
      utils.checkExists(x, 'x coordinate must be specified');
      utils.checkExists(y, 'y coordinate must be specified');

      var uiVertex = this.verticesById[vertex.getId()];
      if (uiVertex) {
        uiVertex.x = x;
        uiVertex.y = y;
      }
    },

    select: function (vertex) {
      var uiVertex = this.verticesById[vertex.getId()];
      if (uiVertex) {
        this.selectedVertex = uiVertex;
      }
    }

  });

  return Renderer;

}());