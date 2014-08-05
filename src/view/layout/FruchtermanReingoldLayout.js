/* global FruchtermanReingoldLayout: true */
var FruchtermanReingoldLayout = (function () {

  function FruchtermanReingoldLayout(duration, easing) {
    this.running = true;
    this.started = false;
    this.maxIteration = 700;
    this.tween = new Tween(duration, easing);
    this.name = 'fruchtermanReingold';
  }

  var EPSILON = 0.000001;
  var ALPHA = 1;
  var padding = 15;

  var init = function (vertices, width, height, self) {
    var vertexCount = vertices.length;
    self.temp = width / 10;
    self.forceConstant = 1.2 * Math.sqrt(height * width / vertexCount);
    var scaleW = ALPHA * width / 2;
    var scaleH = ALPHA * height / 2;

    for (var i = 0; i < vertices.length; i++) {
      var uiVertex = vertices[i];

      FruchtermanReingoldLayout.setBeginPoint(uiVertex, width, height);

      uiVertex.endX = (width / 2) + utils.randomDouble(0, 42) * scaleW;
      uiVertex.endY = (height / 2) + utils.randomDouble(0, 42) * scaleH;
    }

  };

  var calcRepulsion = function (vertices, UiVertex, self) {
    UiVertex.disp = [0, 0];

    for (var i = 0; i < vertices.length; i++) {
      var uiVertex2 = vertices[i];

      if (UiVertex.id !== uiVertex2.id) {
        var xDelta = UiVertex.endX - uiVertex2.endX;
        var yDelta = UiVertex.endY - uiVertex2.endY;

        var deltaLength = Math.max(EPSILON, Math.sqrt(xDelta * xDelta + yDelta * yDelta));

        var force = (self.forceConstant * self.forceConstant) / deltaLength;

        UiVertex.disp[0] += (xDelta / deltaLength) * force;
        UiVertex.disp[1] += (yDelta / deltaLength) * force;
      }
    }
  };

  var calcAttraction = function (edge, self) {
    var uiVertex1 = edge.inVertex;
    var uiVertex2 = edge.outVertex;

    var xDelta = uiVertex1.endX - uiVertex2.endX;
    var yDelta = uiVertex1.endY - uiVertex2.endY;

    var deltaLength = Math.max(EPSILON, Math.sqrt(xDelta * xDelta + yDelta * yDelta));
    var force = (deltaLength * deltaLength) / self.forceConstant;

    var xDisp = (xDelta / deltaLength) * force;
    var yDisp = (yDelta / deltaLength) * force;

    uiVertex1.disp[0] -= xDisp;
    uiVertex1.disp[1] -= yDisp;

    uiVertex2.disp[0] += xDisp;
    uiVertex2.disp[1] += yDisp;
  };

  var calcPositions = function (uiVertex, width, height, self) {
    var deltaLength = Math.max(EPSILON, Math.sqrt(uiVertex.disp[0] * uiVertex.disp[0] + uiVertex.disp[1] * uiVertex.disp[1]));

    var xDisp = uiVertex.disp[0] / deltaLength * Math.min(deltaLength, self.temp);

    var yDisp = uiVertex.disp[1] / deltaLength * Math.min(deltaLength, self.temp);

    uiVertex.endX += xDisp;
    uiVertex.endY += yDisp;

    var borderWidth = width / 50.0;
    var x = uiVertex.endX;
    if (x < 2 * NODE_WIDTH + borderWidth) {
      x = 2 * NODE_WIDTH + borderWidth + Math.random() * borderWidth * 2.0;
    } else if (x > (width - borderWidth)) {
      x = width - borderWidth - Math.random() * borderWidth * 2.0;
    }

    var y = uiVertex.endY;
    if (y < NODE_WIDTH + borderWidth) {
      y = NODE_WIDTH + borderWidth + Math.random() * borderWidth * 2.0;
    } else if (y > (height - borderWidth)) {
      y = height - borderWidth - Math.random() * borderWidth * 2.0;
    }

    uiVertex.endX = x;
    uiVertex.endX = Math.max(uiVertex.endX, NODE_WIDTH / 2 + padding);
    uiVertex.endX = Math.min(uiVertex.endX, width - NODE_WIDTH / 2 - padding);
    uiVertex.endY = y;
    uiVertex.endY = Math.max(uiVertex.endY, NODE_WIDTH / 2 + padding);
    uiVertex.endY = Math.min(uiVertex.endY, height - NODE_WIDTH / 2 - padding);
  };

  var cool = function (self, currentIteration) {
    self.temp *= (1.0 - currentIteration / self.maxIteration);
  };

  var calculateScale = function (width, height, minWidth, minHeight) {
    var scale;
    if (width > height) {
      scale =  width / minWidth;
    } else {
      scale = height / minHeight;
    }

    return scale > 1 ? 1 : scale;
  };

  utils.mixin(FruchtermanReingoldLayout.prototype, {

    step: function (vertices, edges, width, height) {
      var finishedVertices = vertices.length;
      var w = vertices.length * (NODE_WIDTH / 1.5);
      w = Math.max(w, width);
      var h = w * (height / width);
      var scale = calculateScale(width, height, w, h);

      if (this.running) {
        var i;
        var uiVertex;
        if (!this.started) {
          init(vertices, w, h, this);

          for (i = 0; i < this.maxIteration; i++) {

            for (var j = 0; j < vertices.length; j++) {
              uiVertex = vertices[j];
              calcRepulsion(vertices, uiVertex, this);
            }

            for (j = 0; j < edges.length; j++) {
              var edge = edges[j];
              calcAttraction(edge, this);
            }

            for (j = 0; j < vertices.length; j++) {
              uiVertex = vertices[j];
              calcPositions(uiVertex, w, h, this);
            }

            cool(this, i);
          }

          this.started = true;
        }


        finishedVertices = 0;
        for (i = 0; i < vertices.length; i++) {
          uiVertex = vertices[i];
          if (uiVertex.started) {
            this.tween.runFrame(uiVertex, scale);
            if(uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            this.tween.start(uiVertex, scale);
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

  FruchtermanReingoldLayout.setBeginPoint = function (uiVertex, width, height) {
    if(utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = width / 2;
      uiVertex.beginY = height / 2;
      uiVertex.x = uiVertex.beginX;
      uiVertex.y = uiVertex.beginY;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return FruchtermanReingoldLayout;

}());