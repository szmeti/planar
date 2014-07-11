'use strict';

describe('Tween', function () {

  it('should calculate current points', function () {
    var now = 0;
    var tween = new Tween(1000, Easing.expoInOut);
    Tween.dateNow = function () {
      return now;
    };

    var vertex = {
      beginX: 10,
      beginY: 30,
      endX: 20,
      endY: 1030
    };

    tween.start(vertex);

    expect(vertex.x).toEqual(10);
    expect(vertex.y).toEqual(30);
    expect(vertex.finished).toBeUndefined();
    now = 50;

    tween._runFrame(vertex);

    expect(vertex.x).toBeCloseTo(10.0098, 4);
    expect(vertex.y).toBeCloseTo(30.9766, 4);
    expect(vertex.finished).toBeUndefined();
    now = 500;

    tween._runFrame(vertex);

    expect(vertex.x).toEqual(15);
    expect(vertex.y).toEqual(530);
    expect(vertex.finished).toBeUndefined();
    now = 600;

    tween._runFrame(vertex);

    expect(vertex.x).toEqual(18.75);
    expect(vertex.y).toEqual(905);
    expect(vertex.finished).toBeUndefined();
    now = 1000;

    tween._runFrame(vertex);

    expect(vertex.x).toEqual(20);
    expect(vertex.y).toEqual(1030);
    expect(vertex.finished).toEqual(true);
  });
});