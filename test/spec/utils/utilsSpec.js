'use strict';

describe('utils', function () {

  it('should deep mixin objects', function () {
    var source = {
      a: null,
      b: 'newB',
      c: 'newC',
      d: {
        e: null,
        f: 'newF',
        g: 'newG'
      },
      j: {
        k: 'newK'
      }
    };

    var target = {
      a: 'oldA',
      b: 'oldB',
      d: {
        e: 'oldE',
        f: 'newF'
      },
      h: {
        i: 'oldI'
      }
    };

    var expected = {
      a: null,
      b: 'newB',
      c: 'newC',
      d: {
        e: null,
        f: 'newF',
        g: 'newG'
      },
      h: {
        i: 'oldI'
      },
      j: {
        k: 'newK'
      }
    };

    utils.deepMixin(target, source);

    expect(target).toEqual(expected);
  });

});