/* global NodeLinkTreeLayout: true */
var NodeLinkTreeLayout = (function () {

  function NodeLinkTreeLayout(duration, easing) {
    this.running = true;
    this.tween = new Tween(duration, easing);
    this.maxX = 0;
    this.maxY = 0;
    this.maxDepth = 0;
  }

  NodeLinkTreeLayout.SIBLING_NODE_DISTANCE = 5;
  NodeLinkTreeLayout.SUBTREE_DISTANCE = 25;
  NodeLinkTreeLayout.DEPTH_DISTANCE = 125;
  NodeLinkTreeLayout.PADDING = 75;

  var buildSpanningTree = function (uiVertex, uiVertices) {
    var queue = [];
    var visit = [];

    queue.push(uiVertex);
    visit.push(uiVertex.id);

    while(queue.length > 0) {
      var parent = queue[0];
      queue.splice(0, 1);
      parent.children = [];
      var parentEdges = parent.vertex.getEdges(BOTH);

      for(var i = 0; i < parentEdges.length; i++) {
        var edge = parentEdges[i];
        var child = uiVertices[edge.getInVertex().id === parent.id ? edge.getOutVertex().id : edge.getInVertex().id];

        if (visit.indexOf(child.id) === -1) {
          queue.push(child);
          visit.push(child.id);
          parent.children.push(child);
          child.parent = parent;
        }
      }
    }
  };

  var firstWalk = function (uiVertex, number, depth) {
    uiVertex.number = number;
    uiVertex.depth = depth;
    var leftSibling;
    if (uiVertex.children.length === 0) {
      leftSibling = getLeftSibling(uiVertex);
      if (utils.isUndefined(leftSibling)) {
        uiVertex.prelim = 0;
      } else {
        uiVertex.prelim = leftSibling.prelim + distance(leftSibling, uiVertex, true);
      }
    } else {
      var leftMostChild = uiVertex.children[0];
      var rightMostChild = uiVertex.children[uiVertex.children.length - 1];
      var defaultAncestor = leftMostChild;

      for(var i = 0; i < uiVertex.children.length; i++) {
        var child = uiVertex.children[i];
        firstWalk(child, i, depth + 1);
        defaultAncestor = apportion(child, defaultAncestor);
      }

      executeShifts(uiVertex);

      var midpoint = 0.5 * (leftMostChild.prelim + rightMostChild.prelim);
      leftSibling = getLeftSibling(uiVertex);

      if (!utils.isUndefined(leftSibling)) {
        uiVertex.prelim = leftSibling.prelim + distance(leftSibling, uiVertex, true);
        uiVertex.mod = uiVertex.prelim - midpoint;
      } else {
        uiVertex.prelim = midpoint;
      }
    }
  };

  var apportion = function (uiVertex, defaultAncestor) {
    var leftSibling = getLeftSibling(uiVertex);
    if (!utils.isUndefined(leftSibling)) {
      var vip = uiVertex;
      var vop = uiVertex;
      var vin = leftSibling;
      var von = uiVertex.parent.children[0];

      var sip = vip.mod;
      var sin = vin.mod;
      var sop = vop.mod;
      var son = von.mod;

      var nr = nextRight(vin);
      var nl = nextLeft(vip);
      while (!utils.isUndefined(nr) && !utils.isUndefined(nl)) {
        vin = nr;
        vip = nl;
        von = nextLeft(von);
        vop = nextRight(vop);

        vop.ancestor = uiVertex;

        var shift = (vin.prelim + sin) - (vip.prelim + sip) + distance(vin, vip, false);

        if (shift > 0) {
          moveSubtree(ancestor(vin, uiVertex, defaultAncestor), uiVertex, shift);
          sip =  sip + shift;
          sop = sop + shift;
        }

        sin += vin.mod;
        sip += vip.mod;
        son += von.mod;
        sop += vop.mod;

        nr = nextRight(vin);
        nl = nextLeft(vip);
      }

      if (!utils.isUndefined(nr) && utils.isUndefined(nextRight(vop))) {
        vop.thread = nr;
        vop.mod += sin - sop;
      }

      if(!utils.isUndefined(nl) && utils.isUndefined(nextLeft(von))) {
        von.thread = nl;
        von.mod += sip - son;
        defaultAncestor = uiVertex;
      }
    }
    return defaultAncestor;
  };

  var nextLeft = function (uiVertex) {
    if (uiVertex.children.length > 0) {
      return uiVertex.children[0];
    } else {
      return uiVertex.thread;
    }
  };

  var nextRight = function (uiVertex) {
    if (uiVertex.children.length > 0) {
      return uiVertex.children[uiVertex.children.length - 1];
    } else {
      return uiVertex.thread;
    }
  };

  var moveSubtree = function (wn, wp, shift) {
    var subtrees = wp.number - wn.number;
    wp.change -= shift / subtrees;
    wp.shift += shift;
    wn.change += shift / subtrees;
    wp.prelim += shift;
    wp.mod += shift;
  };

  var ancestor = function (vin, v, defaultAncestor) {
    if (vin.ancestor.parent === v.parent) {
      return vin.ancestor;
    } else {
      return defaultAncestor;
    }
  };

  var executeShifts = function (uiVertex) {
    var shift = 0;
    var change = 0;

    for(var i = uiVertex.children.length - 1; i >= 0; i--) {
      var child = uiVertex.children[i];
      child.prelim += shift;
      child.mod += shift;
      change += child.change;
      shift += child.shift + change;
    }
  };

  var getLeftSibling = function (uiVertex) {
    if (!utils.isUndefined(uiVertex.parent)) {
      for (var i = 0; i < uiVertex.parent.children.length; i++) {
        var sibling = uiVertex.parent.children[i];

        if(i > 0 && sibling.id === uiVertex.id) {
          return uiVertex.parent.children[i - 1];
        }
      }
    }

    return undefined;
  };

  var distance = function (left, right, siblings) {
    return (siblings ? NodeLinkTreeLayout.SIBLING_NODE_DISTANCE : NodeLinkTreeLayout.SUBTREE_DISTANCE) + NODE_WIDTH;
  };

  var secondWalk = function secondWalk(uiVertex, m, self, width, leftMostX) {
    var defaultX = (width / 2) + uiVertex.prelim + m;

    if (defaultX < leftMostX) {
      leftMostX = defaultX;
    }

    for(var i = 0; i < uiVertex.children.length; i++) {
      leftMostX = secondWalk(uiVertex.children[i], m + uiVertex.mod, self, width, leftMostX);
    }

    uiVertex.endX = (width / 2) + uiVertex.prelim + m + (NodeLinkTreeLayout.PADDING - leftMostX);
    uiVertex.endY = uiVertex.depth * NodeLinkTreeLayout.DEPTH_DISTANCE + NodeLinkTreeLayout.PADDING;

    if (uiVertex.endX > self.maxX) {
      self.maxX = uiVertex.endX;
    }

    if (uiVertex.endY > self.maxY) {
      self.maxY = uiVertex.endY;
    }

    if (uiVertex.depth > self.maxDepth) {
      self.maxDepth = uiVertex.depth;
    }

    return leftMostX;
  };

  var calculateScale = function (self, width, height) {
    var scale = Math.min((width - NodeLinkTreeLayout.PADDING) / self.maxX, (height - NodeLinkTreeLayout.PADDING) / self.maxY);

    return scale > 1 ? 1 : scale;
  };

  utils.mixin(NodeLinkTreeLayout.prototype, {

    step: function (vertices, edges, width, height, selectedVertex) {
      var finishedVertices = vertices.length;
      if (this.running) {
        finishedVertices = 0;
        var uiVertices = {};
        for (var i = 0; i < vertices.length; i++) {
          var uiVertex = vertices[i];

          if (uiVertex.started) {
            this.tween.runFrame(uiVertex, this.scale);
            if (uiVertex.finished) {
              finishedVertices++;
            }
          } else {
            uiVertex.mod = 0;
            uiVertex.prelim = 0;
            uiVertex.shift = 0;
            uiVertex.change = 0;
            uiVertex.thread = undefined;
            uiVertex.ancestor = uiVertex;
            uiVertex.number = -1;
            uiVertices[uiVertex.id] = uiVertex;
          }
        }

        var root = utils.isUndefined(selectedVertex) ? vertices[0] : selectedVertex;

        if (!root.started) {
          var self = this;
          var firstDepth = 0;

          buildSpanningTree(root, uiVertices);
          firstWalk(root, 0, firstDepth);
          secondWalk(root, - root.prelim, self, width, NodeLinkTreeLayout.PADDING);

          var existVertexWithoutEndPoint = true;

          while (existVertexWithoutEndPoint) {
            existVertexWithoutEndPoint = false;
            for (i = 0; i < vertices.length; i++) {
              if(utils.isUndefined(vertices[i].endX) || utils.isUndefined(vertices[i].endY)) {
                root = vertices[i];
                existVertexWithoutEndPoint = true;
                break;
              }
            }

            if(existVertexWithoutEndPoint) {
              buildSpanningTree(root, uiVertices);
              firstDepth = self.maxDepth + 1;
              firstWalk(root, 0, firstDepth);
              secondWalk(root, - root.prelim, self, width, NodeLinkTreeLayout.PADDING);
            }
          }

          this.scale = calculateScale(self, width, height);

          for (i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            NodeLinkTreeLayout.setBeginPoint(vertex, root);
            this.tween.start(vertex, this.scale);
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

  NodeLinkTreeLayout.setBeginPoint = function (uiVertex, root) {
    if(utils.isUndefined(uiVertex.x) || utils.isUndefined(uiVertex.y)) {
      uiVertex.beginX = root.endX;
      uiVertex.beginY = root.endY;
      uiVertex.x = root.endX;
      uiVertex.y = root.endY;
    } else {
      uiVertex.beginX = uiVertex.x;
      uiVertex.beginY = uiVertex.y;
    }
  };

  return NodeLinkTreeLayout;
}());
