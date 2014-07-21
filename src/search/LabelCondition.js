/* global LabelCondition: true */
var LabelCondition = (function () {

  function LabelCondition() {
    this.labels = utils.convertVarArgs(arguments);
  }

  utils.mixin(LabelCondition.prototype, {

    matches: function (element) {
      for (var i = 0; i < this.labels.length; i++) {
        if (this.labels[i] === element.getLabel()) {
          return true;
        }
      }
      return false;
    }

  });

  return LabelCondition;

}());
