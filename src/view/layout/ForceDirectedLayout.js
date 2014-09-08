/* global ForceDirectedLayout: true */
var ForceDirectedLayout = (function () {

  function ForceDirectedLayout() {
  }

  utils.mixin(ForceDirectedLayout.prototype, {

    step: function () {

      return true;
    }

  });

  return ForceDirectedLayout;

}());