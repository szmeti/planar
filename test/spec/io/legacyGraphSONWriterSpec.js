'use strict';

describe('LegacyGraphSONWriter', function () {

  it('should create graphSON from graph', function () {
    var graph = new Graph();

    var v1 = graph.addVertex(1);
    v1.setProperty(PROP_TYPE, 'query-result-vertex');
    v1.setProperty('_queryVertexReference', 'P1');
    v1.setProperty('entityType', 'Person');
    v1.setProperty('age', 19);
    v1.setProperty('firstName', 'John');
    v1.setProperty('surname', 'Smith');
    v1.setProperty('gender', 'male');
    v1.setProperty('_beginX', 547);
    v1.setProperty('_beginY', 238);

    var v2 = graph.addVertex(2);
    v2.setProperty(PROP_TYPE, 'query-result-vertex');
    v2.setProperty('_queryVertexReference', 'F1');
    v2.setProperty('entityType', 'Flight');
    v2.setProperty('_beginX', 305);
    v2.setProperty('_beginY', 365);

    var v3 = graph.addVertex(3);
    v3.setProperty(PROP_TYPE, 'query-result-vertex');
    v3.setProperty('_queryVertexReference', 'P2');
    v3.setProperty('entityType', 'Person');
    v3.setProperty('age', 10);
    v3.setProperty('_beginX', 310);
    v3.setProperty('_beginY', 283);
    v3.setProperty('nestedObject', {
      a: 1,
      b: {
        c: 2,
        d: 'string',
        e: [
          {
            f: 'array'
          }
        ]
      }
    });

    var v4 = graph.addVertex(4);
    v4.setProperty(PROP_TYPE, 'query-result-vertex');
    v4.setProperty('_queryVertexReference', 'P3');
    v4.setProperty('entityType', 'Person');
    v4.setProperty('age', 44);
    v4.setProperty('firstName', 'John');
    v4.setProperty('surname', 'Smith');
    v4.setProperty('gender', 'male');
    v4.setProperty('_beginX', 390);
    v4.setProperty('_beginY', 320);

    var e1 = graph.addEdge(1, v1, v2, 'knows');
    e1.setProperty('property1', 'something');
    e1.setProperty('property2', 'something');

    var e2 = graph.addEdge(2, v2, v3, 'friends');
    e2.setProperty('property1', 'something');
    e2.setProperty('property3', 'something');

    var e3 = graph.addEdge(3, v3, v1, 'knows');
    e3.setProperty('property4', 'something');


    var writer = new LegacyGraphSONWriter();

    var graphSON = writer.write(graph, ['age', 'surname'], ['property1'], 'NORMAL');

    expect(graphSON).toEqual({
      mode: 'NORMAL',
      vertices: [
        {
          _id: 1,
          _elementType: 'query-result-vertex',
          _queryVertexReference: 'P1',
          entityType: 'Person',
          firstName: 'John',
          gender: 'male',
          _beginX: 547,
          _beginY: 238
        },
        {
          _id: 2,
          _elementType: 'query-result-vertex',
          _queryVertexReference: 'F1',
          entityType: 'Flight',
          _beginX: 305,
          _beginY: 365
        },
        {
          _id: 3,
          _elementType: 'query-result-vertex',
          _queryVertexReference: 'P2',
          entityType: 'Person',
          _beginX: 310,
          _beginY: 283,
          nestedObject: {
            a: 1,
            b: {
              c: 2,
              d: 'string',
              e: [
                {
                  f: 'array'
                }
              ]
            }
          }
        },
        {
          _id: 4,
          _elementType: 'query-result-vertex',
          _queryVertexReference: 'P3',
          entityType: 'Person',
          firstName: 'John',
          gender: 'male',
          _beginX: 390,
          _beginY: 320
        }
      ],
      edges: [
        {
          _id: 1,
          _label: 'knows',
          _inV: 2,
          _outV: 1,
          property2: 'something'
        },
        {
          _id: 2,
          _label: 'friends',
          _inV: 3,
          _outV: 2,
          property3: 'something'
        },
        {
          _id: 3,
          _label: 'knows',
          _inV: 1,
          _outV: 3,
          property4: 'something'
        }
      ]
    });
  });

});
