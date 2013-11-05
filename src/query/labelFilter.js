/* global LabelFilter: true */
var LabelFilter = (function () {

  function LabelFilter() {
    this.labels = utils.convertVarArgs(arguments);
  }

  utils.mixin(LabelFilter.prototype, {

    matches: function (element) {
      for (var i = 0; i < this.labels.length; i++) {
        if (this.labels[i] === element.getLabel()) {
          return true;
        }
      }
      return false;
    }

  });

  return LabelFilter;

}());