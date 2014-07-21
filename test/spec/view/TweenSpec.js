'use strict';

describe('Tween', function () {

  it('should calculate current points', function () {
    var now = 0;
    var tween = new Tween(1000, Easing.expoInOut);
    var actualScale = 0;

    Tween.dateNow = function () {
      return now;
    };

    LayoutUtils.getScale = function () {
      return 1;
    };

    LayoutUtils.setScale = function (scale) {
      actualScale = scale;
    };

    var vertex = {
      beginX: 10,
      beginY: 30,
      endX: 20,
      endY: 1030
    };

    tween.start(vertex, 0.5);

    expect(actualScale).toEqual(1);
    expect(vertex.x).toEqual(10);
    expect(vertex.y).toEqual(30);
    expect(vertex.finished).toBeUndefined();
    now = 50;

    tween.runFrame(vertex, 0.5);

    expect(actualScale).toBeCloseTo(0.9995, 4);
    expect(vertex.x).toBeCloseTo(10.0098, 4);
    expect(vertex.y).toBeCloseTo(30.9766, 4);
    expect(vertex.finished).toBeUndefined();
    now = 500;

    tween.runFrame(vertex, 0.5);

    expect(actualScale).toEqual(0.75);
    expect(vertex.x).toEqual(15);
    expect(vertex.y).toEqual(530);
    expect(vertex.finished).toBeUndefined();
    now = 600;

    tween.runFrame(vertex, 0.5);

    expect(actualScale).toEqual(0.5625);
    expect(vertex.x).toEqual(18.75);
    expect(vertex.y).toEqual(905);
    expect(vertex.finished).toBeUndefined();
    now = 1000;

    tween.runFrame(vertex, 0.5);

    expect(actualScale).toEqual(0.5);
    expect(vertex.x).toEqual(20);
    expect(vertex.y).toEqual(1030);
    expect(vertex.finished).toEqual(true);
  });
});