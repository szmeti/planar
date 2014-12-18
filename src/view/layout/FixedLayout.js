/* global FixedLayout: true */
var FixedLayout = (function () {

  function FixedLayout() {
    this.name = 'fixed';
  }

  utils.mixin(FixedLayout.prototype, {

    step: function () {
      return false;
    }

  });

  return FixedLayout;

}());