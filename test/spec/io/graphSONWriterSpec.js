'use strict';

describe('GraphSONWriter', function () {

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


    var writer = new GraphSONWriter();

    var graphSON = writer.write(graph, ['age', 'surname'], ['property1']);

    expect(graphSON).toEqual(
      {
        'vertices': [
          {
            'id': 1,
            'label': 'vertex',
            'inE': {
              'knows': [{
                'id': 3,
                'outV': 3,
                'properties': {
                  'property4': 'something'
                }
              }]
            },
            'outE': {
              'knows': [{
                'id': 1,
                'inV': 2,
                'properties': {
                  'property2': 'something'
                }
              }]
            },
            'properties': {
              '_elementType': [{
                'id': 0,
                'value': 'query-result-vertex'
              }],
              '_queryVertexReference': [{
                'id': 1,
                'value': 'P1'
              }],
              'entityType': [{
                'id': 2,
                'value': 'Person'
              }],
              'firstName': [{
                'id': 3,
                'value': 'John'
              }],
              'gender': [{
                'id': 4,
                'value': 'male'
              }],
              '_beginX': [{
                'id': 5,
                'value': 547
              }],
              '_beginY': [{
                'id': 6,
                'value': 238
              }]
            }
          },
          {
            'id': 2,
            'label': 'vertex',
            'inE': {
              'knows': [{
                'id': 1,
                'outV': 1,
                'properties': {
                  'property2': 'something'
                }
              }]
            },
            'outE': {
              'friends': [{
                'id': 2,
                'inV': 3,
                'properties': {
                  'property3': 'something'
                }
              }]
            },
            'properties': {
              '_elementType': [{
                'id': 7,
                'value': 'query-result-vertex'
              }],
              '_queryVertexReference': [{
                'id': 8,
                'value': 'F1'
              }],
              'entityType': [{
                'id': 9,
                'value': 'Flight'
              }],
              '_beginX': [{
                'id': 10,
                'value': 305
              }],
              '_beginY': [{
                'id': 11,
                'value': 365
              }]
            }
          },
          {
            'id': 3,
            'label': 'vertex',
            'inE': {
              'friends': [{
                'id': 2,
                'outV': 2,
                'properties': {
                  'property3': 'something'
                }
              }]
            },
            'outE': {
              'knows': [{
                'id': 3,
                'inV': 1,
                'properties': {
                  'property4': 'something'
                }
              }]
            },
            'properties': {
              '_elementType': [{
                'id': 12,
                'value': 'query-result-vertex'
              }],
              '_queryVertexReference': [{
                'id': 13,
                'value': 'P2'
              }],
              'entityType': [{
                'id': 14,
                'value': 'Person'
              }],
              '_beginX': [{
                'id': 15,
                'value': 310
              }],
              '_beginY': [{
                'id': 16,
                'value': 283
              }],
              'nestedObject': [{
                'id': 17,
                'value': {
                  'a': 1,
                  'b': {
                    'c': 2,
                    'd': 'string',
                    'e': [{
                      'f': 'array'
                    }]
                  }
                }
              }]
            }
          },
          {
            'id': 4,
            'label': 'vertex',
            'properties': {
              '_elementType': [{
                'id': 18,
                'value': 'query-result-vertex'
              }],
              '_queryVertexReference': [{
                'id': 19,
                'value': 'P3'
              }],
              'entityType': [{
                'id': 20,
                'value': 'Person'
              }],
              'firstName': [{
                'id': 21,
                'value': 'John'
              }],
              'gender': [{
                'id': 22,
                'value': 'male'
              }],
              '_beginX': [{
                'id': 23,
                'value': 390
              }],
              '_beginY': [{
                'id': 24,
                'value': 320
              }]
            }
          }
        ]
      });
  });
});
