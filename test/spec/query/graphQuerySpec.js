'use strict';

describe('GraphQuery', function () {

  it('should execute query for vertices', function () {
    var graph = new Graph();
    var vertex = graph.addVertex(null);
    vertex.setProperty('name', 'marko');
    vertex.setProperty('age', 33);
    vertex = graph.addVertex(null);
    vertex.setProperty('name', 'matthias');
    vertex.setProperty('age', 28);
    graph.addVertex(null);

    var vertices = graph.query().vertices();
    expect(vertices.length).toBe(3);
    expect(vertices.length).toBe(3);
    var names = [];
    for (var idx in vertices) {
      names.push(vertices[idx].getProperty('name'));
    }
    expect(names.length).toBe(3);
    expect(names).toContain('marko');
    expect(names).toContain(null);
    expect(names).toContain('matthias');

    expect(graph.query().limit(0).vertices().length).toBe(0);
    expect(graph.query().limit(1).vertices().length).toBe(1);
    expect(graph.query().limit(2).vertices().length).toBe(2);
    expect(graph.query().limit(3).vertices().length).toBe(3);
    expect(graph.query().limit(4).vertices().length).toBe(3);

    vertices = graph.query().has('name', 'marko').vertices();
    expect(vertices.length).toBe(1);
    expect(vertices[0].getProperty('name'), 'marko');

    vertices = graph.query().has('age', Compare.GREATER_THAN_EQUAL, 29).vertices();
    expect(vertices.length).toBe(1);
    expect(vertices[0].getProperty('name'), 'marko');
    expect(vertices[0].getProperty('age'), 33);

    vertices = graph.query().has('age', Compare.GREATER_THAN_EQUAL, 28).vertices();
    expect(vertices.length).toBe(2);
    names = [];
    for (idx in vertices) {
      names.push(vertices[idx].getProperty('name'));
    }
    expect(names.length).toBe(2);
    expect(names).toContain('marko');
    expect(names).toContain('matthias');

    vertices = graph.query().interval('age', 28, 33).vertices();
    expect(vertices.length).toBe(1);
    expect(vertices[0].getProperty('name'), 'matthias');

    expect(graph.query().hasNot('age').vertices().length).toBe(1);
    expect(graph.query().has('age', 28).has('name', 'matthias').vertices().length).toBe(1);
    expect(graph.query().has('age', 28).has('name', 'matthias').has('name', 'matthias').vertices().length).toBe(1);
    expect(graph.query().interval('age', 28, 32).has('name', 'marko').vertices().length).toBe(0);
  });

  it('should execute query for vertices', function () {
    var graph = new Graph();

    var marko = graph.addVertex(null);
    marko.setProperty('name', 'marko');
    var matthias = graph.addVertex(null);
    matthias.setProperty('name', 'matthias');
    var stephen = graph.addVertex(null);
    stephen.setProperty('name', 'stephen');

    var edge = marko.addEdge('knows', stephen);
    edge.setProperty('type', 'tinkerpop');
    edge.setProperty('weight', 1.0);
    edge = marko.addEdge('knows', matthias);
    edge.setProperty('type', 'aurelius');

    expect(graph.query().edges().length).toBe(2);
    expect(graph.query().limit(0).edges().length).toBe(0);
    expect(graph.query().limit(1).edges().length).toBe(1);
    expect(graph.query().limit(2).edges().length).toBe(2);
    expect(graph.query().limit(3).edges().length).toBe(2);

    expect(graph.query().has('type', 'tinkerpop').has('type', 'tinkerpop').edges().length).toBe(1);
    expect(graph.query().has('type', 'tinkerpop').edges()[0].getProperty('weight'), 1.0);
    expect(graph.query().has('type', 'aurelius').edges().length).toBe(1);
    expect(graph.query().has('type', 'aurelius').edges()[0].getPropertyKeys().length).toBe(1);
    expect(graph.query().hasNot('weight').edges().length).toBe(1);
    expect(graph.query().hasNot('weight').edges()[0].getProperty('type'), 'aurelius');

    expect(graph.query().has('weight', 1.0).edges().length).toBe(1);
    expect(graph.query().has('weight', 1.0).edges()[0].getProperty('type'), 'tinkerpop');
    expect(graph.query().has('weight', 1.0).has('type', 'tinkerpop').edges().length).toBe(1);
    expect(graph.query().has('weight', 1.0).has('type', 'tinkerpop').edges()[0].getProperty('type'), 'tinkerpop');
    expect(graph.query().has('weight', 1.0).has('type', 'aurelius').edges().length).toBe(0);

    expect(graph.query().interval('weight', 0.0, 1.1).edges()[0].getProperty('type'), 'tinkerpop');
    expect(graph.query().interval('weight', 0.0, 1.0).edges().length).toBe(0);
  });
  
  it('should execute has queries', function () {
    var graph = new Graph();

    var marko = graph.addVertex(null);
    marko.setProperty('name', 'marko');
    var matthias = graph.addVertex(null);
    matthias.setProperty('name', 'matthias');
    var stephen = graph.addVertex(null);
    stephen.setProperty('name', 'stephen');

    var edge = marko.addEdge('knows', stephen);
    edge.setProperty('type', 'tinkerpop');
    edge.setProperty('weight', 1.0);
    edge = marko.addEdge('knows', matthias);
    edge.setProperty('type', 'aurelius');

    expect(graph.query().has('type', Contains.IN, ['tinkerpop', 'aurelius']).edges().length).toBe(2);
    expect(graph.query().has('type', Contains.IN, ['tinkerpop', 'aurelius']).has('type', 'tinkerpop').edges().length).toBe(1);
    expect(graph.query().has('type', Contains.IN, ['tinkerpop', 'aurelius']).has('type', 'tinkerpop').has('type', 'aurelius').edges().length).toBe(0);
    expect(graph.query().has('weight').edges()[0].getProperty('type'), 'tinkerpop');
    expect(graph.query().has('weight').edges()[0].getProperty('weight'), 1.0);
    expect(graph.query().hasNot('weight').edges()[0].getProperty('type'), 'aurelius');
    expect(graph.query().hasNot('weight').edges()[0].getProperty('weight')).toBeNull();

    var result = graph.query().has('name', Contains.IN, ['marko', 'stephen']).vertices();
    expect(result.length).toBe(2);
    expect(result).toContain(marko);
    expect(result).toContain(stephen);
    result = graph.query().has('name', Contains.IN, ['marko', 'stephen', 'matthias', 'josh', 'peter']).vertices();
    expect(result.length).toBe(3);
    expect(result).toContain(marko);
    expect(result).toContain(stephen);
    expect(result).toContain(matthias);
    result = graph.query().has('name').vertices();
    expect(result.length).toBe(3);
    expect(result).toContain(marko);
    expect(result).toContain(stephen);
    expect(result).toContain(matthias);
    result = graph.query().hasNot('name').vertices();
    expect(result.length).toBe(0);
    result = graph.query().hasNot('blah').vertices();
    expect(result.length).toBe(3);
    expect(result).toContain(marko);
    expect(result).toContain(stephen);
    expect(result).toContain(matthias);
    result = graph.query().has('name', Contains.NOT_IN, ['bill', 'sam']).vertices();
    expect(result.length).toBe(3);
    expect(result).toContain(marko);
    expect(result).toContain(stephen);
    expect(result).toContain(matthias);
    result = graph.query().has('name', Contains.IN, ['bill', 'matthias', 'stephen', 'marko']).vertices();
    expect(result.length).toBe(3);
    expect(result).toContain(marko);
    expect(result).toContain(stephen);
    expect(result).toContain(matthias);
  });

});