/* global EventEmitter: true */
var EventEmitter = (function () {

  return {

    on: function (eventType, callback) {
      utils.checkExists('Event', eventType);
      utils.checkExists('Callback', callback);

      this.eventCallbacks = this.eventCallbacks || {};
      this.eventCallbacks[eventType] = this.eventCallbacks[eventType] || [];
      this.eventCallbacks[eventType].push(callback);
    },

    off: function (eventType) {
      utils.checkExists('Event', eventType);

      if (!this.eventCallbacks) {
        return;
      }

      delete this.eventCallbacks[eventType];
    },

    trigger: function (eventType) {
      utils.checkExists('Event', eventType);

      var callbacks, args, cancelled;

      if (!this.eventCallbacks || !this.eventCallbacks[eventType]) {
        return;
      }

      args = [].slice.call(arguments, 1);
      callbacks = this.eventCallbacks[eventType];

      for (var i = 0; !cancelled && i < callbacks.length; i++) {
        cancelled = callbacks[i].apply(this, [eventType].concat(args)) === false;
      }
    }

  };

}());
