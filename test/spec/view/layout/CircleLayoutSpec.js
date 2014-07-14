'use strict';

describe('CircleLayout', function () {
  var now;
  var actualScale;
  var circleLayout;

  beforeEach(function () {
    circleLayout = new CircleLayout(1000, Easing.expoInOut);
    now = 0;
    Tween.dateNow = function () {
      return now;
    };

    LayoutUtils.setScale = function (scale) {
      actualScale = scale;
    };
  });

  it('should calculate location of 3 vertices', function () {
    var graph = new Graph();
    var v1 = graph.addVertex();
    v1 = {id: v1.id, vertex: v1, x: 10, y: 10};
    var v2 = graph.addVertex();
    v2 = {id: v2.id, vertex: v2, x: 10, y: 10};
    var v3 = graph.addVertex();
    v3 = {id: v3.id, vertex: v3, x: 10, y: 10};
    var vertices = [v1, v2, v3];

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(10);
    expect(v1.y).toEqual(10);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(10);
    expect(v2.y).toEqual(10);
    expect(v2.endX).toEqual(400);
    expect(v2.endY).toBeCloseTo(426.6025, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(10);
    expect(v3.y).toEqual(10);
    expect(v3.endX).toBeCloseTo(400, 4);
    expect(v3.endY).toBeCloseTo(253.3975, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(circleLayout.running).toEqual(true);

    now = 500;

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(280);
    expect(v1.y).toEqual(175);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(205);
    expect(v2.y).toBeCloseTo(218.3013, 4);
    expect(v2.endX).toEqual(400);
    expect(v2.endY).toBeCloseTo(426.6025, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toBeCloseTo(205, 4);
    expect(v3.y).toBeCloseTo(131.6987, 4);
    expect(v3.endX).toBeCloseTo(400, 4);
    expect(v3.endY).toBeCloseTo(253.3975, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(circleLayout.running).toEqual(true);

    now = 1000;

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(550);
    expect(v1.y).toEqual(340);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(400);
    expect(v2.y).toBeCloseTo(426.6025, 4);
    expect(v2.endX).toEqual(400);
    expect(v2.endY).toBeCloseTo(426.6025, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toBeCloseTo(400, 4);
    expect(v3.y).toBeCloseTo(253.3975, 4);
    expect(v3.endX).toBeCloseTo(400, 4);
    expect(v3.endY).toBeCloseTo(253.3975, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(circleLayout.running).toEqual(false);

    now = 2000;

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(550);
    expect(v1.y).toEqual(340);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(400);
    expect(v2.y).toBeCloseTo(426.6025, 4);
    expect(v2.endX).toEqual(400);
    expect(v2.endY).toBeCloseTo(426.6025, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toBeCloseTo(400, 4);
    expect(v3.y).toBeCloseTo(253.3975, 4);
    expect(v3.endX).toBeCloseTo(400, 4);
    expect(v3.endY).toBeCloseTo(253.3975, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(circleLayout.running).toEqual(false);
  });

  it('should calculate location of 14 vertices', function () {
    var graph = new Graph();
    var vertices = [];

    for (var i = 0; i < 14; i++) {
      var v = graph.addVertex();
      vertices[i] = {id: v.id, vertex: v};
    }
    var v1 = vertices[0];
    var v2 = vertices[6];
    var v3 = vertices[13];

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9971, 4);

    expect(v1.x).toBeCloseTo(451.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(717.3235, 4);
    expect(v1.endY).toEqual(341);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toBeCloseTo(451.3235, 4);
    expect(v2.y).toEqual(341);
    expect(v2.endX).toBeCloseTo(211.6658, 4);
    expect(v2.endY).toBeCloseTo(456.4131, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toBeCloseTo(451.3235, 4);
    expect(v3.y).toEqual(341);
    expect(v3.endX).toBeCloseTo(690.9812, 4);
    expect(v3.endY).toBeCloseTo(225.5869, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(circleLayout.running).toEqual(true);

    now = 500;

    circleLayout.step(vertices, null, 900, 680);


    expect(actualScale).toBeCloseTo(0.9971, 4);

    expect(v1.x).toBeCloseTo(584.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(717.3235, 4);
    expect(v1.endY).toEqual(341);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toBeCloseTo(331.4947, 4);
    expect(v2.y).toBeCloseTo(398.7065, 4);
    expect(v2.endX).toBeCloseTo(211.6658, 4);
    expect(v2.endY).toBeCloseTo(456.4131, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toBeCloseTo(571.1524, 4);
    expect(v3.y).toBeCloseTo(283.2935, 4);
    expect(v3.endX).toBeCloseTo(690.9812, 4);
    expect(v3.endY).toBeCloseTo(225.5869, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(circleLayout.running).toEqual(true);

    now = 1000;

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9971, 4);

    expect(v1.x).toBeCloseTo(717.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(717.3235, 4);
    expect(v1.endY).toEqual(341);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toBeCloseTo(211.6658, 4);
    expect(v2.y).toBeCloseTo(456.4131, 4);
    expect(v2.endX).toBeCloseTo(211.6658, 4);
    expect(v2.endY).toBeCloseTo(456.4131, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toBeCloseTo(690.9812, 4);
    expect(v3.y).toBeCloseTo(225.5869, 4);
    expect(v3.endX).toBeCloseTo(690.9812, 4);
    expect(v3.endY).toBeCloseTo(225.5869, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(circleLayout.running).toEqual(false);

    now = 1500;

    circleLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9971, 4);

    expect(v1.x).toBeCloseTo(717.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(717.3235, 4);
    expect(v1.endY).toEqual(341);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toBeCloseTo(211.6658, 4);
    expect(v2.y).toBeCloseTo(456.4131, 4);
    expect(v2.endX).toBeCloseTo(211.6658, 4);
    expect(v2.endY).toBeCloseTo(456.4131, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toBeCloseTo(690.9812, 4);
    expect(v3.y).toBeCloseTo(225.5869, 4);
    expect(v3.endX).toBeCloseTo(690.9812, 4);
    expect(v3.endY).toBeCloseTo(225.5869, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(circleLayout.running).toEqual(false);
  });
});
