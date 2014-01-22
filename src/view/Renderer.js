/* global Renderer: true */
var Renderer = (function () {

  function Renderer(graph, container, engine) {
    utils.checkExists('Graph', graph);

    this.graph = graph;
    this.container = container;
    this.engine = utils.isUndefined(engine) ? settings.engine : engine;
    this.width = settings.width;
    this.height = settings.height;
    this.initialized = false;
  }

  utils.mixin(Renderer.prototype, {

    render: function () {
      if (!this.initialized) {
        this.init();
      }

      var self = this;
      this.graph.forEachVertex(function(vertex) {
        self.engine.renderVertex(vertex);
      });
    },

    init: function () {
      this.engine.init(this.container, this.width, this.height);
      var self = this;
      this.graph.forEachVertex(function(vertex) {
        self.engine.initVertex(vertex);
      });
      this.initialized = true;
    }

  });

  return Renderer;

}());