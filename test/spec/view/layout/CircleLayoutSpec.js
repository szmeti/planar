'use strict';

describe('CircleLayout', function () {
  var now;
  var actualScale;
  var circleLayout;

  beforeEach(function () {
    circleLayout = new CircleLayout();
    now = 0;
    Tween.dateNow = function () {
      return now;
    };

    CircleLayout.setBeginPoint = function (vertex) {
      vertex.beginX = 10;
      vertex.beginY = 10;
    };
    CircleLayout.setScale = function (scale) {
      actualScale = scale;
    };
  });

  it('should calculate location of 3 vertices', function () {
    var graph = new Graph();
    var v1 = graph.addVertex();
    v1 = {id: v1.id, vertex: v1};
    var v2 = graph.addVertex();
    v2 = {id: v2.id, vertex: v2};
    var v3 = graph.addVertex();
    v3 = {id: v3.id, vertex: v3};
    var vertices = [v1, v2, v3];

    runs(function () {
      circleLayout.step(vertices, null, 900, 680, new Easing().expoinout, ANIMATION_DURATION);
    });

    waits(50);

    runs(function () {
      expect(actualScale).toEqual(1);

      expect(v1.x).toEqual(10);
      expect(v1.y).toEqual(10);
      expect(v1.endX).toEqual(507);
      expect(v1.endY).toEqual(340);
      expect(v1.started).toEqual(true);
      expect(v1.finished).toBeUndefined();

      expect(v2.x).toEqual(10);
      expect(v2.y).toEqual(10);
      expect(v2.endX).toEqual(421.5);
      expect(v2.endY).toEqual(389.363448015713);
      expect(v2.started).toEqual(true);
      expect(v2.finished).toBeUndefined();

      expect(v3.x).toEqual(10);
      expect(v3.y).toEqual(10);
      expect(v3.endX).toEqual(421.49999999999994);
      expect(v3.endY).toEqual(290.636551984287);
      expect(v3.started).toEqual(true);
      expect(v3.finished).toBeUndefined();

      expect(circleLayout.running).toEqual(true);

      now = 500;
    });

    waits(50);

    runs(function () {
      circleLayout.step(vertices, null, 900, 680, new Easing().expoinout, ANIMATION_DURATION);
    });

    waits(50);

    runs(function () {
      expect(actualScale).toEqual(1);

      expect(v1.x).toEqual(258.5);
      expect(v1.y).toEqual(175);
      expect(v1.endX).toEqual(507);
      expect(v1.endY).toEqual(340);
      expect(v1.started).toEqual(true);
      expect(v1.finished).toBeUndefined();

      expect(v2.x).toEqual(215.75);
      expect(v2.y).toEqual(199.6817240078565);
      expect(v2.endX).toEqual(421.5);
      expect(v2.endY).toEqual(389.363448015713);
      expect(v2.started).toEqual(true);
      expect(v2.finished).toBeUndefined();

      expect(v3.x).toEqual(215.74999999999997);
      expect(v3.y).toEqual(150.3182759921435);
      expect(v3.endX).toEqual(421.49999999999994);
      expect(v3.endY).toEqual(290.636551984287);
      expect(v3.started).toEqual(true);
      expect(v3.finished).toBeUndefined();

      expect(circleLayout.running).toEqual(true);

      now = 1000;
    });

    waits(50);

    runs(function () {
      circleLayout.step(vertices, null, 900, 680, new Easing().expoinout, ANIMATION_DURATION);
    });

    waits(50);

    runs(function () {
      expect(actualScale).toEqual(1);

      expect(v1.x).toEqual(507);
      expect(v1.y).toEqual(340);
      expect(v1.endX).toEqual(507);
      expect(v1.endY).toEqual(340);
      expect(v1.started).toEqual(true);
      expect(v1.finished).toEqual(true);

      expect(v2.x).toEqual(421.5);
      expect(v2.y).toEqual(389.363448015713);
      expect(v2.endX).toEqual(421.5);
      expect(v2.endY).toEqual(389.363448015713);
      expect(v2.started).toEqual(true);
      expect(v2.finished).toEqual(true);

      expect(v3.x).toEqual(421.49999999999994);
      expect(v3.y).toEqual(290.636551984287);
      expect(v3.endX).toEqual(421.49999999999994);
      expect(v3.endY).toEqual(290.636551984287);
      expect(v3.started).toEqual(true);
      expect(v3.finished).toEqual(true);

      expect(circleLayout.running).toEqual(false);

    });
  });

  it('should calculate location of 14 vertices', function () {
    var graph = new Graph();
    var vertices = [];

    for(var i = 0; i < 14; i++) {
      var v = graph.addVertex();
      vertices[i] = {id: v.id, vertex: v};
    }
    var v1 = vertices[0];
    var v2 = vertices[6];
    var v3 = vertices[13];

    runs(function () {
      circleLayout.step(vertices, null, 900, 680, new Easing().expoinout, ANIMATION_DURATION);
    });

    waits(50);

    runs(function () {
      expect(actualScale).toEqual(0.9970674486803519);

      expect(v1.x).toEqual(10);
      expect(v1.y).toEqual(10);
      expect(v1.endX).toEqual(717.3235294117646);
      expect(v1.endY).toEqual(341);
      expect(v1.started).toEqual(true);
      expect(v1.finished).toBeUndefined();

      expect(v2.x).toEqual(10);
      expect(v2.y).toEqual(10);
      expect(v2.endX).toEqual(211.66581054972144);
      expect(v2.endY).toEqual(456.41307460527037);
      expect(v2.started).toEqual(true);
      expect(v2.finished).toBeUndefined();

      expect(v3.x).toEqual(10);
      expect(v3.y).toEqual(10);
      expect(v3.endX).toEqual(690.981248273808);
      expect(v3.endY).toEqual(225.5869253947298);
      expect(v3.started).toEqual(true);
      expect(v3.finished).toBeUndefined();

      expect(circleLayout.running).toEqual(true);

      now = 500;
    });

    waits(50);

    runs(function () {
      circleLayout.step(vertices, null, 900, 680, new Easing().expoinout, ANIMATION_DURATION);
    });

    waits(50);

    runs(function () {
      expect(actualScale).toEqual(0.9970674486803519);

      expect(v1.x).toEqual(363.6617647058823);
      expect(v1.y).toEqual(175.5);
      expect(v1.endX).toEqual(717.3235294117646);
      expect(v1.endY).toEqual(341);
      expect(v1.started).toEqual(true);
      expect(v1.finished).toBeUndefined();

      expect(v2.x).toEqual(110.83290527486072);
      expect(v2.y).toEqual(233.20653730263518);
      expect(v2.endX).toEqual(211.66581054972144);
      expect(v2.endY).toEqual(456.41307460527037);
      expect(v2.started).toEqual(true);
      expect(v2.finished).toBeUndefined();

      expect(v3.x).toEqual(350.490624136904);
      expect(v3.y).toEqual(117.7934626973649);
      expect(v3.endX).toEqual(690.981248273808);
      expect(v3.endY).toEqual(225.5869253947298);
      expect(v3.started).toEqual(true);
      expect(v3.finished).toBeUndefined();

      expect(circleLayout.running).toEqual(true);

      now = 1000;
    });

    waits(50);

    runs(function () {
      circleLayout.step(vertices, null, 900, 680, new Easing().expoinout, ANIMATION_DURATION);
    });

    waits(50);

    runs(function () {
      expect(actualScale).toEqual(0.9970674486803519);

      expect(v1.x).toEqual(717.3235294117646);
      expect(v1.y).toEqual(341);
      expect(v1.endX).toEqual(717.3235294117646);
      expect(v1.endY).toEqual(341);
      expect(v1.started).toEqual(true);
      expect(v1.finished).toEqual(true);

      expect(v2.x).toEqual(211.66581054972144);
      expect(v2.y).toEqual(456.41307460527037);
      expect(v2.endX).toEqual(211.66581054972144);
      expect(v2.endY).toEqual(456.41307460527037);
      expect(v2.started).toEqual(true);
      expect(v2.finished).toEqual(true);

      expect(v3.x).toEqual(690.981248273808);
      expect(v3.y).toEqual(225.5869253947298);
      expect(v3.endX).toEqual(690.981248273808);
      expect(v3.endY).toEqual(225.5869253947298);
      expect(v3.started).toEqual(true);
      expect(v3.finished).toEqual(true);

      expect(circleLayout.running).toEqual(false);

    });
  });
});
