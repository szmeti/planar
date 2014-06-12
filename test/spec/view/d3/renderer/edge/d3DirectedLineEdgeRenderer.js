'use strict';

describe('d3DirectedLineEdgeRenderer', function () {

  var a, b;
  var e1, e2, e3, e4, e5;
  var graph;

  beforeEach(function () {
    graph = new Graph();
    a = graph.addVertex(null);
    b = graph.addVertex(null);

    e1 = graph.addEdge(null, a, b, 'knows');
    e2 = graph.addEdge(null, a, b, 'other1');
    e3 = graph.addEdge(null, b, a, 'other2');
    e4 = graph.addEdge(null, a, b, 'other3');
    e5 = graph.addEdge(null, b, a, 'other4');
  });

  it('check edge properties if b vertex is on the left side of a', function () {
    initUiVertex(a, 100, 100, 50, 50);
    initUiVertex(b, 800, 100, 50, 50);

    var calculator = new DirectedLineEdgeCalculator(e1);
    var e1Proprties = calculator.calculate();
    checkRadius(e1Proprties, 357, 110);
    checkStartPoint(e1Proprties, 125, 100);
    checkEndPoint(e1Proprties, 775, 100);
    checkSweepFlag(e1Proprties, 1);
    checkXAxisRotation(e1Proprties, 0);
    checkLabelPosition(e1Proprties, 450, 37);

    calculator = new DirectedLineEdgeCalculator(e2);
    var e2Proprties = calculator.calculate();
    checkRadius(e2Proprties, 357, 55);
    checkStartPoint(e2Proprties, 125, 100);
    checkEndPoint(e2Proprties, 775, 100);
    checkSweepFlag(e2Proprties, 1);
    checkXAxisRotation(e2Proprties, 0);
    checkLabelPosition(e2Proprties, 450, 68);

    calculator = new DirectedLineEdgeCalculator(e3);
    var e3Proprties = calculator.calculate();
    checkRadius(e3Proprties, 357, 0);
    checkStartPoint(e3Proprties, 775, 100);
    checkEndPoint(e3Proprties, 125, 100);
    checkSweepFlag(e3Proprties, 1);
    checkXAxisRotation(e3Proprties, 0);
    checkLabelPosition(e3Proprties, 450, 100);

    calculator = new DirectedLineEdgeCalculator(e4);
    var e4Proprties = calculator.calculate();
    checkRadius(e4Proprties, 357, 55);
    checkStartPoint(e4Proprties, 125, 100);
    checkEndPoint(e4Proprties, 775, 100);
    checkSweepFlag(e4Proprties,0);
    checkXAxisRotation(e4Proprties, 0);
    checkLabelPosition(e4Proprties, 450, 131);

    calculator = new DirectedLineEdgeCalculator(e5);
    var e5Proprties = calculator.calculate();
    checkRadius(e5Proprties, 357, 110);
    checkStartPoint(e5Proprties, 775, 100);
    checkEndPoint(e5Proprties, 125, 100);
    checkSweepFlag(e5Proprties, 1);
    checkXAxisRotation(e5Proprties, 0);
    checkLabelPosition(e5Proprties, 450, 162);
  });

  it('check edge properties if b vertex is at the bottom of a', function () {
    initUiVertex(a, 100, 100, 50, 50);
    initUiVertex(b, 100, 500, 50, 50);

    var calculator = new DirectedLineEdgeCalculator(e1);
    var e1Proprties = calculator.calculate();
    checkRadius(e1Proprties, 192, 142);
    checkStartPoint(e1Proprties, 100, 125);
    checkEndPoint(e1Proprties, 100, 475);
    checkSweepFlag(e1Proprties, 1);
    checkXAxisRotation(e1Proprties, 90);
    checkLabelPosition(e1Proprties, 181, 300);

    calculator = new DirectedLineEdgeCalculator(e2);
    var e2Proprties = calculator.calculate();
    checkRadius(e2Proprties, 192, 71);
    checkStartPoint(e2Proprties, 100, 125);
    checkEndPoint(e2Proprties, 100, 475);
    checkSweepFlag(e2Proprties, 1);
    checkXAxisRotation(e2Proprties, 90);
    checkLabelPosition(e2Proprties, 140, 300);

    calculator = new DirectedLineEdgeCalculator(e3);
    var e3Proprties = calculator.calculate();
    checkRadius(e3Proprties, 192, 0);
    checkStartPoint(e3Proprties, 100, 475);
    checkEndPoint(e3Proprties, 100, 125);
    checkSweepFlag(e3Proprties, 1);
    checkXAxisRotation(e3Proprties, -90);
    checkLabelPosition(e3Proprties, 100, 300);

    calculator = new DirectedLineEdgeCalculator(e4);
    var e4Proprties = calculator.calculate();
    checkRadius(e4Proprties, 192, 71);
    checkStartPoint(e4Proprties, 100, 125);
    checkEndPoint(e4Proprties, 100, 475);
    checkSweepFlag(e4Proprties,0);
    checkXAxisRotation(e4Proprties, 90);
    checkLabelPosition(e4Proprties, 59, 300);

    calculator = new DirectedLineEdgeCalculator(e5);
    var e5Proprties = calculator.calculate();
    checkRadius(e5Proprties, 192, 142);
    checkStartPoint(e5Proprties, 100, 475);
    checkEndPoint(e5Proprties, 100, 125);
    checkSweepFlag(e5Proprties, 1);
    checkXAxisRotation(e5Proprties, -90);
    checkLabelPosition(e5Proprties, 18, 300);
  });

  it('check edge properties if b vertex is at the top of a', function () {
    initUiVertex(a, 100, 100, 50, 50);
    initUiVertex(b, 100, -500, 50, 50);

    var calculator = new DirectedLineEdgeCalculator(e1);
    var e1Proprties = calculator.calculate();
    checkRadius(e1Proprties, 302, 110);
    checkStartPoint(e1Proprties, 100, 75);
    checkEndPoint(e1Proprties, 100, -475);
    checkSweepFlag(e1Proprties, 1);
    checkXAxisRotation(e1Proprties, -90);
    checkLabelPosition(e1Proprties, 37, -200);

    calculator = new DirectedLineEdgeCalculator(e2);
    var e2Proprties = calculator.calculate();
    checkRadius(e2Proprties, 302, 55);
    checkStartPoint(e2Proprties, 100, 75);
    checkEndPoint(e2Proprties, 100, -475);
    checkSweepFlag(e2Proprties, 1);
    checkXAxisRotation(e2Proprties, -90);
    checkLabelPosition(e2Proprties, 68, -200);

    calculator = new DirectedLineEdgeCalculator(e3);
    var e3Proprties = calculator.calculate();
    checkRadius(e3Proprties, 302, 0);
    checkStartPoint(e3Proprties, 100, -475);
    checkEndPoint(e3Proprties, 100, 75);
    checkSweepFlag(e3Proprties, 1);
    checkXAxisRotation(e3Proprties, 90);
    checkLabelPosition(e3Proprties, 100, -200);

    calculator = new DirectedLineEdgeCalculator(e4);
    var e4Proprties = calculator.calculate();
    checkRadius(e4Proprties, 302, 55);
    checkStartPoint(e4Proprties, 100, 75);
    checkEndPoint(e4Proprties, 100, -475);
    checkSweepFlag(e4Proprties,0);
    checkXAxisRotation(e4Proprties, -90);
    checkLabelPosition(e4Proprties, 131, -200);

    calculator = new DirectedLineEdgeCalculator(e5);
    var e5Proprties = calculator.calculate();
    checkRadius(e5Proprties, 302, 110);
    checkStartPoint(e5Proprties, 100, -475);
    checkEndPoint(e5Proprties, 100, 75);
    checkSweepFlag(e5Proprties, 1);
    checkXAxisRotation(e5Proprties, 90);
    checkLabelPosition(e5Proprties, 162, -200);
  });

  it('check edge properties if b vertex is on the right side of a', function () {
    initUiVertex(a, 100, 100, 50, 50);
    initUiVertex(b, -800, 100, 50, 50);

    var calculator = new DirectedLineEdgeCalculator(e1);
    var e1Proprties = calculator.calculate();
    checkRadius(e1Proprties, 467, 110);
    checkStartPoint(e1Proprties, 75, 100);
    checkEndPoint(e1Proprties, -775, 100);
    checkSweepFlag(e1Proprties, 1);
    checkXAxisRotation(e1Proprties, 0);
    checkLabelPosition(e1Proprties, -350, 162);

    calculator = new DirectedLineEdgeCalculator(e2);
    var e2Proprties = calculator.calculate();
    checkRadius(e2Proprties, 467, 55);
    checkStartPoint(e2Proprties, 75, 100);
    checkEndPoint(e2Proprties, -775, 100);
    checkSweepFlag(e2Proprties, 1);
    checkXAxisRotation(e2Proprties, 0);
    checkLabelPosition(e2Proprties, -350, 131);

    calculator = new DirectedLineEdgeCalculator(e3);
    var e3Proprties = calculator.calculate();
    checkRadius(e3Proprties, 467, 0);
    checkStartPoint(e3Proprties, -775, 100);
    checkEndPoint(e3Proprties, 75, 100);
    checkSweepFlag(e3Proprties, 1);
    checkXAxisRotation(e3Proprties, 0);
    checkLabelPosition(e3Proprties, -350, 100);

    calculator = new DirectedLineEdgeCalculator(e4);
    var e4Proprties = calculator.calculate();
    checkRadius(e4Proprties, 467, 55);
    checkStartPoint(e4Proprties, 75, 100);
    checkEndPoint(e4Proprties, -775, 100);
    checkSweepFlag(e4Proprties, 0);
    checkXAxisRotation(e4Proprties, 0);
    checkLabelPosition(e4Proprties, -350, 68);

    calculator = new DirectedLineEdgeCalculator(e5);
    var e5Proprties = calculator.calculate();
    checkRadius(e5Proprties, 467, 110);
    checkStartPoint(e5Proprties, -775, 100);
    checkEndPoint(e5Proprties, 75, 100);
    checkSweepFlag(e5Proprties, 1);
    checkXAxisRotation(e5Proprties, 0);
    checkLabelPosition(e5Proprties, -350, 37);
  });

  var checkStartPoint = function(properties, x,y) {
    expect(Math.floor(properties.startPoint.x)).toBe(x);
    expect(Math.floor(properties.startPoint.y)).toBe(y);
  };

  var checkEndPoint = function(properties, x,y) {
    expect(Math.floor(properties.endPoint.x)).toBe(x);
    expect(Math.floor(properties.endPoint.y)).toBe(y);
  };

  var checkLabelPosition = function(properties, x,y) {
    expect(Math.floor(properties.labelPosition.x)).toBe(x);
    expect(Math.floor(properties.labelPosition.y)).toBe(y);
  };

  var checkRadius = function(properties, x,y) {
    expect(Math.floor(properties.radiusX)).toBe(x);
    expect(Math.floor(properties.radiusY)).toBe(y);
  };

  var checkSweepFlag = function(properties, sweep) {
    expect(properties.sweepFlag).toBe(sweep);
  };

  var checkXAxisRotation = function(properties, rotation) {
    expect(properties.xAxisRotation).toBe(rotation);
  };

  var initUiVertex = function(vertex, x, y, width, height) {
    vertex.x = x;
    vertex.y = y;
    vertex.uiElement = [
      [
        {
          getBBox : function() {
            return {
              width : width,
              height : height
            };
          }
        }
      ]
    ];
    vertex.g = [
      [
        {
          getBBox : function() {
            return {
              width : width,
              height : height
            };
          }
        }
      ]
    ];
    vertex.vertex = {
      getEdges : function(direction) {
        return vertex.getEdges(direction);
      }
    };

  };

});