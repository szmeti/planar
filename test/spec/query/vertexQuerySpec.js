'use strict';

describe('VertexQuery', function () {

  var a, b, c;
  var aFriendB, aFriendC, aHateC, cHateA, cHateB;
  var graph;

  beforeEach(function () {
    graph = new Graph();
    a = graph.addVertex(null);
    b = graph.addVertex(null);
    c = graph.addVertex(null);
    aFriendB = graph.addEdge(null, a, b, 'friend');
    aFriendC = graph.addEdge(null, a, c, 'friend');
    aHateC = graph.addEdge(null, a, c, 'hate');
    cHateA = graph.addEdge(null, c, a, 'hate');
    cHateB = graph.addEdge(null, c, b, 'hate');
    aFriendB.setProperty('amount', 1.0);
    aFriendB.setProperty('date', 10);
    aFriendC.setProperty('amount', 0.5);
    aHateC.setProperty('amount', 1.0);
    cHateA.setProperty('amount', 1.0);
    cHateB.setProperty('amount', 0.4);
  });

  it('should execute basic query', function () {
    var edges = a.query().labels('friend').hasNot('date').edges();
    expect(edges.length).toBe(1);
    expect(edges[0].getProperty('amount')).toBe(0.5);
  });

  it('should execute direction query', function () {
    var edges = a.query().direction(OUT).edges();
    expect(edges.length).toBe(3);
    expect(edges).toContain(aFriendB);
    expect(edges).toContain(aFriendC);
    expect(edges).toContain(aHateC);

    var vertices = a.query().direction(OUT).vertices();
    expect(vertices.length).toBe(3);
    expect(vertices).toContain(b);
    expect(vertices).toContain(c);
    expect(a.query().direction(OUT).count()).toBe(3);
  });

  it('should execute labels query', function () {
    var results = a.query().direction(OUT).labels('hate', 'friend').edges();
    expect(results.length).toBe(3);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    expect(results).toContain(aHateC);
    results = a.query().direction(OUT).labels('hate', 'friend').vertices();
    expect(results.length).toBe(3);
    expect(results).toContain(b);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('hate', 'friend').count()).toBe(3);

    results = a.query().direction(OUT).labels('friend').edges();
    expect(results.length).toBe(2);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').vertices();
    expect(results.length).toBe(2);
    expect(results).toContain(b);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('friend').count(), 2);

    results = a.query().direction(BOTH).labels('friend', 'hate').edges();
    expect(results.length).toBe(4);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    expect(results).toContain(aHateC);
    expect(results).toContain(cHateA);
    results = a.query().direction(BOTH).labels('friend', 'hate').vertices();
    expect(results.length).toBe(4);
    expect(results).toContain(b);
    expect(results).toContain(c);
    expect(results).not.toContain(a);
    expect(a.query().direction(BOTH).labels('friend', 'hate').count(), 4);
  });

  it('should execute has query', function () {
    var results = a.query().direction(OUT).labels('friend').has('amount', 1.0).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendB);
    results = a.query().direction(OUT).labels('friend').has('amount', 1.0).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(b);
    expect(a.query().direction(OUT).labels('friend').has('amount', 1.0).count(), 1);

    results = a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0).count(), 1);

    results = a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0).edges();
    expect(results.length).toBe(2);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0).vertices();
    expect(results.length).toBe(2);
    expect(results).toContain(b);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0).count(), 2);

    results = a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0).count(), 1);

    results = a.query().direction(OUT).labels('friend').has('amount', 0.5).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').has('amount', 0.5).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);

    results = a.query().direction(IN).labels('hate', 'friend').has('amount', Compare.GREATER_THAN, 0.5).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(cHateA);
    results = a.query().direction(IN).labels('hate', 'friend').has('amount', Compare.GREATER_THAN, 0.5).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);
    expect(a.query().direction(IN).labels('friend', 'hate').has('amount', Compare.GREATER_THAN, 0.5).count(), 1);

    results = a.query().direction(IN).labels('hate').has('amount', Compare.GREATER_THAN, 1.0).edges();
    expect(results.length).toBe(0);
    results = a.query().direction(IN).labels('hate').has('amount', Compare.GREATER_THAN, 1.0).vertices();
    expect(results.length).toBe(0);
    expect(a.query().direction(IN).labels('hate').has('amount', Compare.GREATER_THAN, 1.0).count(), 0);

    results = a.query().direction(IN).labels('hate').has('amount', Compare.GREATER_THAN_EQUAL, 1.0).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(cHateA);
    results = a.query().direction(IN).labels('hate').has('amount', Compare.GREATER_THAN_EQUAL, 1.0).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);
    expect(a.query().direction(IN).labels('hate').has('amount', Compare.GREATER_THAN_EQUAL, 1.0).count(), 1);

    results = a.query().direction(OUT).has('amount').edges();
    expect(results.length).toBe(3);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    expect(results).toContain(aHateC);

    results = a.query().direction(OUT).hasNot('amount').vertices();
    expect(results.length).toBe(0);
    results = a.query().direction(OUT).hasNot('date').edges();
    expect(results.length).toBe(2);
    expect(results).toContain(aFriendC);
    expect(results).toContain(aHateC);
    results = a.query().direction(OUT).hasNot('date').vertices();
    expect(results.length).toBe(2);
    expect(results[0]).toBe(c);
    expect(results[0]).toBe(c);

    results = a.query().direction(OUT).has('amount', Contains.NOT_IN, [2.3, 5.6, 234]).edges();
    expect(results.length).toBe(3);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    expect(results).toContain(aHateC);

    var amountPredicate = {
      isVisible: function (vertex, propertyKey) {
        return propertyKey !== 'amount';
      }
    };
    graph.addEdgePropertyFilter('amountPredicate', amountPredicate);

    results = a.query().direction(OUT).labels('friend').has('amount', 1.0).edges();
    expect(results.length).toBe(0);
    results = a.query().direction(OUT).labels('friend').has('amount', 1.0).vertices();
    expect(results.length).toBe(0);
    expect(a.query().direction(OUT).labels('friend').has('amount', 1.0).count(), 0);

    results = a.query().direction(OUT).labels('friend').has('amount', 1.0, null, ['amountPredicate']).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendB);
    results = a.query().direction(OUT).labels('friend').has('amount', 1.0, null, ['amountPredicate']).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(b);
    expect(a.query().direction(OUT).labels('friend').has('amount', 1.0, null, ['amountPredicate']).count(), 1);

    results = a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0).edges();
    expect(results.length).toBe(2);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0).vertices();
    expect(results.length).toBe(2);
    expect(results).toContain(b);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0).count(), 2);

    results = a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0, ['amountPredicate']).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0, ['amountPredicate']).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('friend').has('amount', Compare.NOT_EQUAL, 1.0, ['amountPredicate']).count(), 1);

    results = a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0).edges();
    expect(results.length).toBe(0);
    results = a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0).vertices();
    expect(results.length).toBe(0);
    expect(a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0).count(), 0);

    results = a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0, ['amountPredicate']).edges();
    expect(results.length).toBe(2);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0, ['amountPredicate']).vertices();
    expect(results.length).toBe(2);
    expect(results).toContain(b);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).labels('friend').has('amount', Compare.LESS_THAN_EQUAL, 1.0, ['amountPredicate']).count(), 2);

    results = a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0).edges();
    expect(results.length).toBe(0);
    results = a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0).vertices();
    expect(results.length).toBe(0);
    expect(a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0).count(), 0);

    results = a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0, ['amountPredicate']).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendC);
    results = a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0, ['amountPredicate']).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(c);
    expect(a.query().direction(OUT).has('amount', Compare.LESS_THAN, 1.0, ['amountPredicate']).count(), 1);

    results = a.query().direction(OUT).has('amount').edges();
    expect(results.length).toBe(0);

    results = a.query().direction(OUT).has('amount', null, null, ['amountPredicate']).edges();
    expect(results.length).toBe(3);
    expect(results).toContain(aFriendB);
    expect(results).toContain(aFriendC);
    expect(results).toContain(aHateC);

    results = a.query().direction(OUT).hasNot('amount').vertices();
    expect(results.length).toBe(3);
    expect(results).toContain(b);
    expect(results).toContain(c);

    var cCount = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i] === c) {
        cCount++;
      }
    }

    expect(cCount).toBe(2);

    graph.removeAllEdgePropertyFilters();
  });

  it('should execute contains queries', function () {
    var result = a.query().direction(OUT).has('amount', 1.0).edges();
    expect(result.length).toBe(2);
    expect(result).toContain(aFriendB);
    expect(result).toContain(aHateC);

    result = a.query().direction(OUT).has('amount', Contains.IN, [1.0, 0.5]).edges();
    expect(result.length).toBe(3);
    expect(result).toContain(aFriendB);
    expect(result).toContain(aFriendC);
    expect(result).toContain(aHateC);

    result = a.query().direction(OUT).has('amount', Contains.IN, [1.0, 0.5, 'marko', 13, 'a', 32.13]).edges();
    expect(result.length).toBe(3);
    expect(result).toContain(aFriendB);
    expect(result).toContain(aFriendC);
    expect(result).toContain(aHateC);

    result = a.query().direction(OUT).has('amount', Contains.IN, [1.0, 0.5, 'marko', 13, 'a', 32.13]).vertices();
    expect(result.length).toBe(3);
    expect(result).toContain(b);
    expect(result).toContain(c);
  });

  it('should execute interval queries', function () {
    var results = a.query().direction(OUT).interval('date', 5, 10).edges();
    expect(results.length).toBe(0);
    results = a.query().direction(OUT).interval('date', 5, 10).vertices();
    expect(results.length).toBe(0);
    expect(a.query().direction(OUT).interval('date', 5, 10).count(), 0);

    results = a.query().direction(OUT).interval('date', 5, 11).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendB);
    results = a.query().direction(OUT).interval('date', 5, 11).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(b);
    expect(a.query().direction(OUT).interval('date', 5, 11).count(), 1);

    results = a.query().direction(OUT).labels('friend').interval('date', 5, 11).edges();
    expect(results.length).toBe(1);
    expect(results).toContain(aFriendB);
    results = a.query().direction(OUT).labels('friend').interval('date', 5, 11).vertices();
    expect(results.length).toBe(1);
    expect(results).toContain(b);
    expect(a.query().direction(OUT).labels('friend').interval('date', 5, 11).count(), 1);
  });

  it('should execute limit queries', function () {
    var results = a.query().direction(OUT).labels('friend', 'hate').limit(2).edges();
    expect(results.length).toBe(2);
    expect(utils.indexOf(aFriendB, results) > -1 || utils.indexOf(aHateC, results) > -1 || utils.indexOf(aFriendC, results) > -1).toBeTruthy();
    results = a.query().direction(OUT).labels('friend', 'hate').limit(2).vertices();
    expect(results.length).toBe(2);
    expect(utils.indexOf(b, results) > -1 || utils.indexOf(c, results) > -1).toBeTruthy();
    expect(results).not.toContain(a);
    expect(a.query().labels('friend', 'hate').limit(2).count(), 2);

    results = a.query().direction(OUT).labels('friend').limit(0).edges();
    expect(results.length).toBe(0);
    results = a.query().direction(OUT).labels('friend').limit(0).vertices();
    expect(results.length).toBe(0);
    expect(a.query().direction(OUT).labels('friend').limit(0).count(), 0);
  });

});