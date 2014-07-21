'use strict';

describe('WheelLayout', function () {
  var now;
  var actualScale;
  var wheelLayout;

  beforeEach(function () {
    wheelLayout = new WheelLayout(1000, Easing.expoInOut);
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

    wheelLayout.step(vertices, null, 900, 680, v2);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(10);
    expect(v1.y).toEqual(10);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(10);
    expect(v2.y).toEqual(10);
    expect(v2.endX).toEqual(450);
    expect(v2.endY).toEqual(340);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(10);
    expect(v3.y).toEqual(10);
    expect(v3.endX).toEqual(350);
    expect(v3.endY).toEqual(340);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(wheelLayout.running).toEqual(true);

    now = 500;

    wheelLayout.step(vertices, null, 900, 680, v2);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(280);
    expect(v1.y).toEqual(175);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(230);
    expect(v2.y).toEqual(175);
    expect(v2.endX).toEqual(450);
    expect(v2.endY).toEqual(340);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(180);
    expect(v3.y).toEqual(175);
    expect(v3.endX).toEqual(350);
    expect(v3.endY).toEqual(340);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(wheelLayout.running).toEqual(true);

    now = 1000;

    wheelLayout.step(vertices, null, 900, 680, v2);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(550);
    expect(v1.y).toEqual(340);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(450);
    expect(v2.y).toEqual(340);
    expect(v2.endX).toEqual(450);
    expect(v2.endY).toEqual(340);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toEqual(350);
    expect(v3.y).toEqual(340);
    expect(v3.endX).toEqual(350);
    expect(v3.endY).toEqual(340);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(wheelLayout.running).toEqual(false);

    now = 2000;

    wheelLayout.step(vertices, null, 900, 680, v2);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(550);
    expect(v1.y).toEqual(340);
    expect(v1.endX).toEqual(550);
    expect(v1.endY).toEqual(340);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(450);
    expect(v2.y).toEqual(340);
    expect(v2.endX).toEqual(450);
    expect(v2.endY).toEqual(340);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toEqual(350);
    expect(v3.y).toEqual(340);
    expect(v3.endX).toEqual(350);
    expect(v3.endY).toEqual(340);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(wheelLayout.running).toEqual(false);
  });

  it('should calculate location of 15 vertices', function () {
    var graph = new Graph();
    var vertices = [];

    for (var i = 0; i < 15; i++) {
      var v = graph.addVertex();
      vertices[i] = {id: v.id, vertex: v};
    }
    var v1 = vertices[0];
    var v2 = vertices[7];
    var v3 = vertices[14];

    wheelLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toBeCloseTo(451.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(451.3235, 4);
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

    expect(wheelLayout.running).toEqual(true);

    now = 500;

    wheelLayout.step(vertices, null, 900, 680);


    expect(actualScale).toBeCloseTo(0.9985, 4);

    expect(v1.x).toBeCloseTo(451.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(451.3235, 4);
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

    expect(wheelLayout.running).toEqual(true);

    now = 1000;

    wheelLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9971, 4);

    expect(v1.x).toBeCloseTo(451.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(451.3235, 4);
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

    expect(wheelLayout.running).toEqual(false);

    now = 1500;

    wheelLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9971, 4);

    expect(v1.x).toBeCloseTo(451.3235, 4);
    expect(v1.y).toEqual(341);
    expect(v1.endX).toBeCloseTo(451.3235, 4);
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

    expect(wheelLayout.running).toEqual(false);
  });
});
