// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory, globalName) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root[globalName] = factory();
    }
}(this, function () {

    "use strict";

    var events = {},

    event_exists = function(event_name) {
        return !!events[event_name];
    },

    for_all_subscribers = function(event_name, fn) {
        if (event_exists(event_name)) {
            //make a copy of all subscribers for iteration
            //because event handlers can also modify it
            //by calling unbind
            var handlers = events[event_name].slice();
            for (var i=0; i<handlers.length; i++) {
                fn(handlers[i], handlers, i);
            }
        }
    },

    create_if_none = function(event_name, cfg) {
        event_exists(event_name) || (events[event_name] = []);
        cfg && cfg.sticky && (events[event_name].sticky = true);
        cfg && cfg.data && (events[event_name].data = cfg.data);
    },

    dispatch_event = function(event_name, cfg) {
        cfg && cfg.sticky && create_if_none(event_name, cfg);
        for_all_subscribers(event_name,
        function(subscriber) {
          trigger(event_name, subscriber, (cfg && cfg.data));
        });
    },

    bind = function(event_name, fn) {
        create_if_none(event_name)
        events[event_name].push(fn);
        //if event is sticky it will be dispatch every time object subscribes to this
        events[event_name].sticky && trigger(event_name, fn, events[event_name].data);
    },

    bindAll = function(events, listener) {

    },

    trigger = function(event_name, fn, args) {
        var apply_args = [{type:event_name}].concat(args);
        fn.apply(this, apply_args);
    },

    unbind = function(event_name, obj) {
        for_all_subscribers(event_name,
            function(subscriber, all_subscribers, index) {
                if (subscriber === obj) {
                    //no need to check if events[event_name]
                    //exists, it will if the code gets here
                    events[event_name].splice(index,1);
                }
            }
        );
    },

    unbindAll = function(event_name) {
        delete events[event_name];
    };

    return {
        publish: dispatch_event,
        subscribe: bind,
        on: bind,
        onAll: bindAll,
        unsubscribe: unbind,
        unsubscribeAll: unbindAll,
        //peek into events
        __events__:  events
    };

}, "E"));
