'use strict';

describe('Graph', function () {

  it('should be empty on construction', function () {
    var graph = new Graph();
    expect(graph.getVertices().length).toBe(0);
    expect(graph.getEdges().length).toBe(0);
  });

  it('should get edges and vertices by key-value', function () {
    var graph = new Graph();

    var v1 = graph.addVertex();
    v1.setProperty('name', 'marko');
    v1.setProperty('location', 'everywhere');
    var v2 = graph.addVertex();
    v2.setProperty('name', 'stephen');
    v2.setProperty('location', 'everywhere');

    expect(graph.getVertices('location', 'everywhere').length).toBe(2);
    expect(graph.getVertices('name', 'marko').length).toBe(1);
    expect(graph.getVertices('name', 'stephen').length).toBe(1);
    expect(graph.getVertices('name', 'marko')).toContain(v1);
    expect(graph.getVertices('name', 'stephen')).toContain(v2);

    var e1 = graph.addEdge(null, graph.addVertex(), graph.addVertex(), 'knows');
    e1.setProperty('name', 'marko');
    e1.setProperty('location', 'everywhere');
    var e2 = graph.addEdge(null, graph.addVertex(), graph.addVertex(), 'knows');
    e2.setProperty('name', 'stephen');
    e2.setProperty('location', 'everywhere');

    expect(graph.getEdges('location', 'everywhere').length).toBe(2);
    expect(graph.getEdges('name', 'marko').length).toBe(1);
    expect(graph.getEdges('name', 'stephen').length).toBe(1);
    expect(graph.getEdges('name', 'marko')).toContain(e1);
    expect(graph.getEdges('name', 'stephen')).toContain(e2);
  });

  it('should add vertices and edges', function () {
    var graph = new Graph();

    var a = graph.addVertex();
    var b = graph.addVertex();
    var edge = graph.addEdge(null, a, b, 'knows');

    expect(graph.getEdges().length).toBe(1);
    expect(graph.getVertices().length).toBe(2);

    graph.removeVertex(a);

    expect(graph.getEdges().length).toBe(0);
    expect(graph.getVertices().length).toBe(1);

    graph.removeEdge(edge);

    expect(graph.getEdges().length).toBe(0);
    expect(graph.getVertices().length).toBe(1);
  });

  it('should remove vertices and edges', function () {
    var graph = new Graph();

    var v = graph.addVertex();
    var u = graph.addVertex();
    var e = graph.addEdge(null, v, u, 'knows');

    expect(graph.getEdges().length).toBe(1);
    expect(graph.getVertices().length).toBe(2);

    expect(v.getEdges(OUT)[0].getVertex(IN)).toBe(u);
    expect(u.getEdges(IN)[0].getVertex(OUT)).toBe(v);
    expect(v.getEdges(OUT)[0]).toBe(e);
    expect(u.getEdges(IN)[0]).toBe(e);

    graph.removeVertex(v);

    expect(graph.getEdges().length).toBe(0);
    expect(graph.getVertices().length).toBe(1);
  });

  it('should remove edges', function () {
    var graph = new Graph();
    var vertexCount = 100;
    var edgeCount = 200;
    var vertices = [];
    var edges = [];

    for (var i = 0; i < vertexCount; i++) {
      vertices.push(graph.addVertex());
    }

    for (i = 0; i < edgeCount; i++) {
      var a = vertices[Math.floor(Math.random() * vertexCount)];
      var b = vertices[Math.floor(Math.random() * vertexCount)];
      if (a !== b) {
        edges.push(graph.addEdge(null, a, b, 'edge'));
      }
    }

    edgeCount = edges.length;
    for (i = 0; i < edgeCount; i++) {
      var edge = edges[i];
      graph.removeEdge(edge);
      expect(graph.getEdges().length).toBe(edgeCount - i - 1);
      expect(graph.getVertices().length).toBe(vertexCount);
    }
  });

  it('should remove vertices', function () {
    var graph = new Graph();
    var vertexCount = 500;
    var vertices = [];
    var edges = [];

    for (var i = 0; i < vertexCount; i++) {
      vertices.push(graph.addVertex());
    }

    for (i = 0; i < vertexCount; i = i + 2) {
      var a = vertices[i];
      var b = vertices[i + 1];
      edges.push(graph.addEdge(null, a, b, 'edge'));
    }

    for (i = 0; i < vertexCount; i++) {
      var v = vertices[i];

      if (Math.random() < 0.5) {
        graph.removeVertex(v);
      } else {
        v.remove();
      }

      if ((i + 2) % 2 === 0) {
        expect(graph.getEdges().length).toBe(edges.length - ((i + 2) / 2));
      }

      expect(graph.getVertices().length).toBe(vertexCount - i - 1);
    }
  });

  it('should connect vertices', function () {
    var graph = new Graph();

    var a = graph.addVertex('1');
    var b = graph.addVertex('2');
    var c = graph.addVertex('3');
    var d = graph.addVertex('4');

    graph.addEdge(null, a, b, 'knows');
    graph.addEdge(null, b, c, 'knows');
    graph.addEdge(null, c, d, 'knows');
    graph.addEdge(null, d, a, 'knows');

    expect(graph.getEdges().length).toBe(4);
    expect(graph.getVertices().length).toBe(4);

    for (var i = 0; i < graph.getVertices().length; i++) {
      var v = graph.getVertices()[i];
      expect(v.getEdges(OUT).length).toBe(1);
      expect(v.getEdges(IN).length).toBe(1);
    }

    for (i = 0; i < graph.getEdges().length; i++) {
      var e = graph.getEdges()[i];
      expect(e.getLabel()).toEqual('knows');
    }

    a = graph.getVertex('1');
    b = graph.getVertex('2');
    c = graph.getVertex('3');
    d = graph.getVertex('4');

    expect(a.getEdges(OUT).length).toBe(1);
    expect(a.getEdges(IN).length).toBe(1);
    expect(b.getEdges(OUT).length).toBe(1);
    expect(b.getEdges(IN).length).toBe(1);
    expect(c.getEdges(OUT).length).toBe(1);
    expect(c.getEdges(IN).length).toBe(1);
    expect(d.getEdges(OUT).length).toBe(1);
    expect(d.getEdges(IN).length).toBe(1);

    i = graph.addEdge(null, a, b, 'hates');

    expect(a.getEdges(OUT).length).toBe(2);
    expect(a.getEdges(IN).length).toBe(1);
    expect(b.getEdges(OUT).length).toBe(1);
    expect(b.getEdges(IN).length).toBe(2);
    expect(c.getEdges(OUT).length).toBe(1);
    expect(c.getEdges(IN).length).toBe(1);
    expect(d.getEdges(OUT).length).toBe(1);
    expect(d.getEdges(IN).length).toBe(1);

    expect(i.getLabel()).toEqual('hates');
    expect(i.getVertex(IN).getId()).toEqual('2');
    expect(i.getVertex(OUT).getId()).toEqual('1');
  });

  it('should return edges by labels', function () {
    var graph = new Graph();

    var a = graph.addVertex();
    var b = graph.addVertex();
    var c = graph.addVertex();

    var aFriendB = graph.addEdge(null, a, b, 'friend');
    var aFriendC = graph.addEdge(null, a, c, 'friend');
    var aHateC = graph.addEdge(null, a, c, 'hate');
    var cHateA = graph.addEdge(null, c, a, 'hate');
    var cHateB = graph.addEdge(null, c, b, 'hate');

    expect(a.getEdges(OUT).length).toBe(3);
    expect(a.getEdges(OUT)).toContain(aFriendB);
    expect(a.getEdges(OUT)).toContain(aFriendC);
    expect(a.getEdges(OUT)).toContain(aHateC);

    expect(a.getEdges(OUT, 'friend').length).toBe(2);
    expect(a.getEdges(OUT, 'friend')).toContain(aFriendB);
    expect(a.getEdges(OUT, 'friend')).toContain(aFriendC);

    expect(a.getEdges(OUT, 'hate').length).toBe(1);
    expect(a.getEdges(OUT, 'hate')).toContain(aHateC);

    expect(a.getEdges(IN, 'hate').length).toBe(1);
    expect(a.getEdges(IN, 'hate')).toContain(cHateA);

    expect(a.getEdges(IN, 'friend').length).toBe(0);

    expect(b.getEdges(IN, 'hate').length).toBe(1);
    expect(b.getEdges(IN, 'hate')).toContain(cHateB);

    expect(b.getEdges(IN, 'friend').length).toBe(1);
    expect(b.getEdges(IN, 'friend')).toContain(aFriendB);
  });

  it('should return edges by labels 2', function () {
    var graph = new Graph();

    var a = graph.addVertex();
    var b = graph.addVertex();
    var c = graph.addVertex();

    var aFriendB = graph.addEdge(null, a, b, 'friend');
    var aFriendC = graph.addEdge(null, a, c, 'friend');
    var aHateC = graph.addEdge(null, a, c, 'hate');
    var cHateA = graph.addEdge(null, c, a, 'hate');
    var cHateB = graph.addEdge(null, c, b, 'hate');

    expect(a.getEdges(OUT, 'friend', 'hate').length).toBe(3);
    expect(a.getEdges(OUT, 'friend', 'hate')).toContain(aFriendB);
    expect(a.getEdges(OUT, 'friend', 'hate')).toContain(aFriendC);
    expect(a.getEdges(OUT, 'friend', 'hate')).toContain(aHateC);

    expect(a.getEdges(IN, 'friend', 'hate').length).toBe(1);
    expect(a.getEdges(IN, 'friend', 'hate')).toContain(cHateA);

    expect(b.getEdges(IN, 'friend', 'hate').length).toBe(2);
    expect(b.getEdges(IN, 'friend', 'hate')).toContain(aFriendB);
    expect(b.getEdges(IN, 'friend', 'hate')).toContain(cHateB);

    expect(b.getEdges(IN, 'blah', 'blah2', 'blah3').length).toBe(0);
  });

  it('tree connectivity', function () {
    var graph = new Graph();

    var branchSize = 11;
    var start = graph.addVertex(null);
    for (var i = 0; i < branchSize; i++) {
      var a = graph.addVertex(null);
      graph.addEdge(null, start, a, 'test1');
      for (var j = 0; j < branchSize; j++) {
        var b = graph.addVertex(null);
        graph.addEdge(null, a, b, 'test2');
        for (var k = 0; k < branchSize; k++) {
          var c = graph.addVertex(null);
          graph.addEdge(null, b, c, 'test3');
        }
      }
    }

    expect(start.getEdges(IN).length).toBe(0);
    var edges1 = start.getEdges(OUT);
    expect(edges1.length).toBe(branchSize);

    for (var e in edges1) {
      expect(edges1[e].getLabel()).toEqual('test1');
      expect(edges1[e].getVertex(IN).getEdges(OUT).length).toBe(branchSize);
      expect(edges1[e].getVertex(IN).getEdges(IN).length).toBe(1);
      var edges2 = edges1[e].getVertex(IN).getEdges(OUT);
      for (var f in edges2) {
        expect(edges2[f].getLabel()).toEqual('test2');
        expect(edges2[f].getVertex(IN).getEdges(OUT).length).toBe(branchSize);
        expect(edges2[f].getVertex(IN).getEdges(IN).length).toBe(1);
        var edges3 = edges2[f].getVertex(IN).getEdges(OUT);
        for (var g in edges3) {
          expect(edges3[g].getLabel()).toEqual('test3');
          expect(edges3[g].getVertex(IN).getEdges(OUT).length).toBe(0);
          expect(edges3[g].getVertex(IN).getEdges(IN).length).toBe(1);
        }
      }
    }

    var totalVertices = 0;
    for (i = 0; i < 4; i++) {
      totalVertices = totalVertices + Math.pow(branchSize, i);
    }
    expect(graph.getVertices().length).toBe(totalVertices);
    expect(graph.getEdges().length).toBe(totalVertices - 1);
  });

  it('should iterate vertices', function () {
    var graph = new Graph();

    var a = graph.addVertex('1');
    var b = graph.addVertex('2');
    var c = graph.addVertex('3');
    var d = graph.addVertex('4');

    var vertices = [];
    graph.forEachVertex(function (vertex) {
      vertices.push(vertex);
    });

    expect(vertices.length).toBe(4);
    expect(vertices).toContain(a);
    expect(vertices).toContain(b);
    expect(vertices).toContain(c);
    expect(vertices).toContain(d);

    vertices = [];
    graph.forEachVertex(function () {
      return true;
    });

    expect(vertices.length).toBe(0);
  });

  it('should iterate vertices', function () {
    var graph = new Graph();

    var a = graph.addVertex('1');
    var b = graph.addVertex('2');
    var c = graph.addVertex('3');
    var d = graph.addVertex('4');

    var e1 = graph.addEdge(null, a, b, 'knows');
    var e2 = graph.addEdge(null, b, c, 'knows');
    var e3 = graph.addEdge(null, c, d, 'knows');
    var e4 = graph.addEdge(null, d, a, 'knows');

    var edges = [];
    graph.forEachEdge(function (edge) {
      edges.push(edge);
    });

    expect(edges.length).toBe(4);
    expect(edges).toContain(e1);
    expect(edges).toContain(e2);
    expect(edges).toContain(e3);
    expect(edges).toContain(e4);

    edges = [];
    graph.forEachEdge(function () {
      return true;
    });

    expect(edges.length).toBe(0);
  });

  it('should handle indices', function () {
    var graph = new Graph();
    var index = graph.createIndex('basic', Vertex);
    expect(index.getIndexName()).toEqual('basic');
    expect(graph.getIndex('basic', Vertex)).toBe(index);
    expect(graph.getIndex('invalid', Vertex)).toBeNull();
    expect(graph.getIndices().length).toBe(1);
    expect(graph.getIndices()[0]).toBe(index);

    try {
      graph.getIndex('basic', Edge);
      this.fail('Should not allow index retrieval if the type is incorrect');
    } catch (e) {
      expect(e.message).toEqual('Invalid index type');
    }

    try {
      graph.createIndex('basic', Vertex);
      this.fail('Should not allow duplicate indices');
    } catch (e) {
      expect(e.message).toEqual('Index already exists');
    }

    var index2 = graph.createIndex('basic2', Vertex);
    expect(index2.getIndexName()).toEqual('basic2');
    expect(graph.getIndex('basic', Vertex)).toBe(index);
    expect(graph.getIndex('basic2', Vertex)).toBe(index2);
    expect(graph.getIndices().length).toBe(2);
    expect(graph.getIndices()).toContain(index);
    expect(graph.getIndices()).toContain(index2);

    graph.dropIndex('basic2');
    expect(graph.getIndex('basic', Vertex)).toBe(index);
    expect(graph.getIndices().length).toBe(1);
    expect(graph.getIndices()[0]).toBe(index);
    graph.dropIndex('basic');
    expect(graph.getIndices().length).toBe(0);
  });

  it('should send events', function () {
    var graph = new Graph();

    var createdVertexIds = [];
    var createdEdgeIds = [];
    var removedVertexIds = [];
    var removedEdgeIds = [];

    graph.off('vertexAdded');

    graph.on('vertexAdded', function (event, vertex) {
      createdVertexIds.push(vertex.getId());
    });

    graph.on('edgeAdded', function (event, edge) {
      createdEdgeIds.push(edge.getId());
    });

    graph.on('vertexRemoved', function (event, vertex) {
      removedVertexIds.push(vertex.getId());
    });

    graph.on('edgeRemoved', function (event, edge) {
      removedEdgeIds.push(edge.getId());
    });

    var a = graph.addVertex();
    var b = graph.addVertex();
    var c = graph.addVertex();

    var edge1 = graph.addEdge(null, a, b, 'knows');
    var edge2 = graph.addEdge(null, b, a, 'knows');
    var edge3 = graph.addEdge(null, c, a, 'knows');

    expect(createdVertexIds.length).toBe(3);
    expect(createdVertexIds).toContain(a.getId());
    expect(createdVertexIds).toContain(b.getId());
    expect(createdVertexIds).toContain(c.getId());

    expect(createdEdgeIds.length).toBe(3);
    expect(createdEdgeIds).toContain(edge1.getId());
    expect(createdEdgeIds).toContain(edge2.getId());
    expect(createdEdgeIds).toContain(edge3.getId());

    graph.removeVertex(c);

    expect(removedVertexIds.length).toBe(1);
    expect(removedVertexIds).toContain(c.getId());

    expect(removedEdgeIds.length).toBe(1);
    expect(removedEdgeIds).toContain(edge3.getId());

    graph.removeEdge(edge2);

    expect(removedVertexIds.length).toBe(1);
    expect(removedVertexIds).toContain(c.getId());

    expect(removedEdgeIds.length).toBe(2);
    expect(removedEdgeIds).toContain(edge2.getId());
    expect(removedEdgeIds).toContain(edge3.getId());

    graph.removeVertex(a);

    expect(removedVertexIds.length).toBe(2);
    expect(removedVertexIds).toContain(a.getId());
    expect(removedVertexIds).toContain(c.getId());

    expect(removedEdgeIds.length).toBe(3);
    expect(removedEdgeIds).toContain(edge1.getId());
    expect(removedEdgeIds).toContain(edge2.getId());
    expect(removedEdgeIds).toContain(edge3.getId());

    graph.off('vertexAdded');

    graph.addVertex();
    expect(createdVertexIds.length).toBe(3);
  });

});