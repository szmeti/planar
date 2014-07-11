'use strict';

describe('Tween', function () {

  it('should calculate current points', function () {
    var now = 0;
    var tween = new Tween(ANIMATION_DURATION, new Easing().expoinout);
    Tween.dateNow = function () {
      return now;
    };

    var vertex = {
      beginX: 10,
      beginY: 30,
      endX: 20,
      endY: 1030
    };

    runs(function () {
      tween.start(vertex);
    });

    waits(50);

    runs(function () {
      expect(vertex.x).toEqual(10);
      expect(vertex.y).toEqual(30);
      now = 50;
    });

    waits(50);

    runs(function () {
      expect(vertex.x).toEqual(10.009765625);
      expect(vertex.y).toEqual(30.9765625);
      now = 500;
    });

    waits(50);

    runs(function () {
      expect(vertex.x).toEqual(15);
      expect(vertex.y).toEqual(530);
      now = 600;
    });

    waits(50);

    runs(function () {
      expect(vertex.x).toEqual(18.75);
      expect(vertex.y).toEqual(905);
      now = 1000;
    });

    waits(50);

    runs(function () {
      expect(vertex.x).toEqual(20);
      expect(vertex.y).toEqual(1030);
    });

  });
});