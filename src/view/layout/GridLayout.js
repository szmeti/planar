/* global GridLayout: true */
var GridLayout = (function () {

  function GridLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
  }

  var calculateScale = function (width, height, rows, cols) {
    var widthScale = cols === 1 ? 1 : (width / ((cols - 1) * (width / (cols - 1) + NODE_WIDTH)));
    var heightScale = rows === 1 ? 1 : (height / ((rows - 1) * (height / (rows - 1) + NODE_WIDTH)));

    var scale = Math.min(widthScale, heightScale);
    return  scale > 1 ? 1 : scale;
  };

  utils.mixin(GridLayout.prototype, {

    step: function (vertices, edges, width, height) {
      var finishedVertices = vertices.length;

      if (this.running) {
        finishedVertices = 0;

        var numberOfVertices = vertices.length;

        var rows = Math.floor(Math.sqrt(numberOfVertices));
        var cols = (rows === 0) ? 0 : Math.floor(numberOfVertices/rows) + 1;

        var h = height - NODE_WIDTH;
        var w = width - (2 * NODE_WIDTH);

        var scale = calculateScale(w, h, rows, cols);

        var bx = (2 * NODE_WIDTH) / scale;
        var by = NODE_WIDTH;

        LayoutUtils.setScale(scale);

        for (var i = 0; i < vertices.length; i++) {
          var uiVertex = vertices[i];
          if(uiVertex.started) {
            this.tween.runFrame(uiVertex);
            if(uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            GridLayout.setBeginPoint(uiVertex, bx, by);
            uiVertex.endX = bx + w * ((i % cols) / (cols)) + (i % cols) * NODE_WIDTH;
            uiVertex.endY = by + h * (Math.floor(i / cols) / (rows)) + Math.floor(i / cols) * NODE_WIDTH;
            this.tween.start(uiVertex);
          }
        }
      }

      if (this.running && finishedVertices === vertices.length && vertices.length > 0) {
        vertices[0].vertex.getGraph().trigger('graphUpdated');
      }

      this.running = finishedVertices < vertices.length;
      return this.running;
    }

  });

  GridLayout.setBeginPoint = function (uiVertex, bx, by) {
    if(utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = bx;
      uiVertex.beginY = by;
      uiVertex.x = bx;
      uiVertex.y = by;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return GridLayout;
}());
