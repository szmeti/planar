'use strict';

describe('GridLayout', function () {
  var now;
  var actualScale;
  var gridLayout;

  beforeEach(function () {
    gridLayout = new GridLayout(1000, Easing.expoInOut);
    now = 0;
    Tween.dateNow = function () {
      return now;
    };

    LayoutUtils.setScale = function (scale) {
      actualScale = scale;
    };
  });

  it('should calculate location of 4 vertices', function () {
    var graph = new Graph();
    var v1 = graph.addVertex();
    v1 = {id: v1.id, vertex: v1, x: 10, y: 10};
    var v2 = graph.addVertex();
    v2 = {id: v2.id, vertex: v2, x: 10, y: 10};
    var v3 = graph.addVertex();
    v3 = {id: v3.id, vertex: v3, x: 10, y: 10};
    var v4 = graph.addVertex();
    v4 = {id: v4.id, vertex: v4, x: 10, y: 10};
    var vertices = [v1, v2, v3, v4];

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(10);
    expect(v1.y).toEqual(10);
    expect(v1.endX).toEqual(180);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(10);
    expect(v2.y).toEqual(10);
    expect(v2.endX).toEqual(505);
    expect(v2.endY).toEqual(75);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(10);
    expect(v3.y).toEqual(10);
    expect(v3.endX).toEqual(830);
    expect(v3.endY).toEqual(75);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(v4.x).toEqual(10);
    expect(v4.y).toEqual(10);
    expect(v4.endX).toEqual(180);
    expect(v4.endY).toEqual(452.5);
    expect(v4.started).toEqual(true);
    expect(v4.finished).toBeUndefined();

    expect(gridLayout.running).toEqual(true);

    now = 500;

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.9167, 4);

    expect(v1.x).toEqual(95);
    expect(v1.y).toEqual(42.5);
    expect(v1.endX).toEqual(180);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(257.5);
    expect(v2.y).toEqual(42.5);
    expect(v2.endX).toEqual(505);
    expect(v2.endY).toEqual(75);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(420);
    expect(v3.y).toEqual(42.5);
    expect(v3.endX).toEqual(830);
    expect(v3.endY).toEqual(75);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(v4.x).toEqual(95);
    expect(v4.y).toEqual(231.25);
    expect(v4.endX).toEqual(180);
    expect(v4.endY).toEqual(452.5);
    expect(v4.started).toEqual(true);
    expect(v4.finished).toBeUndefined();

    expect(gridLayout.running).toEqual(true);

    now = 1000;

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.8333, 4);

    expect(v1.x).toEqual(180);
    expect(v1.y).toEqual(75);
    expect(v1.endX).toEqual(180);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(505);
    expect(v2.y).toEqual(75);
    expect(v2.endX).toEqual(505);
    expect(v2.endY).toEqual(75);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toEqual(830);
    expect(v3.y).toEqual(75);
    expect(v3.endX).toEqual(830);
    expect(v3.endY).toEqual(75);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(v4.x).toEqual(180);
    expect(v4.y).toEqual(452.5);
    expect(v4.endX).toEqual(180);
    expect(v4.endY).toEqual(452.5);
    expect(v4.started).toEqual(true);
    expect(v4.finished).toEqual(true);

    expect(gridLayout.running).toEqual(false);

    now = 2000;

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.8333, 4);

    expect(v1.x).toEqual(180);
    expect(v1.y).toEqual(75);
    expect(v1.endX).toEqual(180);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(505);
    expect(v2.y).toEqual(75);
    expect(v2.endX).toEqual(505);
    expect(v2.endY).toEqual(75);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toEqual(830);
    expect(v3.y).toEqual(75);
    expect(v3.endX).toEqual(830);
    expect(v3.endY).toEqual(75);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(v4.x).toEqual(180);
    expect(v4.y).toEqual(452.5);
    expect(v4.endX).toEqual(180);
    expect(v4.endY).toEqual(452.5);
    expect(v4.started).toEqual(true);
    expect(v4.finished).toEqual(true);

    expect(gridLayout.running).toEqual(false);
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

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toEqual(1);

    expect(v1.x).toEqual(210);
    expect(v1.y).toEqual(75);
    expect(v1.endX).toEqual(210);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(210);
    expect(v2.y).toEqual(75);
    expect(v2.endX).toEqual(435);
    expect(v2.endY).toBeCloseTo(351.6667, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(210);
    expect(v3.y).toEqual(75);
    expect(v3.endX).toEqual(885);
    expect(v3.endY).toBeCloseTo(628.3333, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(gridLayout.running).toEqual(true);

    now = 500;

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.8571, 4);

    expect(v1.x).toEqual(210);
    expect(v1.y).toEqual(75);
    expect(v1.endX).toEqual(210);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toBeUndefined();

    expect(v2.x).toEqual(322.5);
    expect(v2.y).toBeCloseTo(213.3333, 4);
    expect(v2.endX).toEqual(435);
    expect(v2.endY).toBeCloseTo(351.6667, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toBeUndefined();

    expect(v3.x).toEqual(547.5);
    expect(v3.y).toBeCloseTo(351.6667, 4);
    expect(v3.endX).toEqual(885);
    expect(v3.endY).toBeCloseTo(628.3333, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toBeUndefined();

    expect(gridLayout.running).toEqual(true);

    now = 1000;

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.7143, 4);

    expect(v1.x).toEqual(210);
    expect(v1.y).toEqual(75);
    expect(v1.endX).toEqual(210);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(435);
    expect(v2.y).toBeCloseTo(351.6667, 4);
    expect(v2.endX).toEqual(435);
    expect(v2.endY).toBeCloseTo(351.6667, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toEqual(885);
    expect(v3.y).toBeCloseTo(628.3333, 4);
    expect(v3.endX).toEqual(885);
    expect(v3.endY).toBeCloseTo(628.3333, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(gridLayout.running).toEqual(false);

    now = 1500;

    gridLayout.step(vertices, null, 900, 680);

    expect(actualScale).toBeCloseTo(0.7143, 4);

    expect(v1.x).toEqual(210);
    expect(v1.y).toEqual(75);
    expect(v1.endX).toEqual(210);
    expect(v1.endY).toEqual(75);
    expect(v1.started).toEqual(true);
    expect(v1.finished).toEqual(true);

    expect(v2.x).toEqual(435);
    expect(v2.y).toBeCloseTo(351.6667, 4);
    expect(v2.endX).toEqual(435);
    expect(v2.endY).toBeCloseTo(351.6667, 4);
    expect(v2.started).toEqual(true);
    expect(v2.finished).toEqual(true);

    expect(v3.x).toEqual(885);
    expect(v3.y).toBeCloseTo(628.3333, 4);
    expect(v3.endX).toEqual(885);
    expect(v3.endY).toBeCloseTo(628.3333, 4);
    expect(v3.started).toEqual(true);
    expect(v3.finished).toEqual(true);

    expect(gridLayout.running).toEqual(false);
  });
});
