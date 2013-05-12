(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("app", function(exports, require, module) {
  var Commuter, GlobalView;

  GlobalView = require('views/global-view').GlobalView;

  Commuter = (function() {
    var domDef,
      _this = this;

    function Commuter() {}

    domDef = $.Deferred();

    Commuter.domReady = domDef.promise();

    _.defer(function() {
      Commuter.views = {
        global: new GlobalView(Commuter)
      };
      return $(function() {
        domDef.resolve();
        return Commuter.$body = $(document.body);
      });
    });

    return Commuter;

  }).call(this);

  module.exports = function() {
    return window.app = new Commuter;
  };
  
});
window.require.register("views/base-view", function(exports, require, module) {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      _ref = BaseView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseView.prototype.template = function(data) {
      return require("views/templates/" + this.templateName)(data);
    };

    BaseView.prototype.render = function(data) {
      this.$el.html(this.template(data));
      return this;
    };

    return BaseView;

  })(Backbone.View);
  
});
window.require.register("views/global-view", function(exports, require, module) {
  var BaseView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('views/base-view').BaseView;

  exports.GlobalView = (function(_super) {
    __extends(GlobalView, _super);

    function GlobalView() {
      this.render = __bind(this.render, this);    _ref = GlobalView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    GlobalView.prototype.el = '#content';

    GlobalView.prototype.templateName = 'global';

    GlobalView.prototype.initialize = function(app) {
      return $.when(app.domReady).then(this.render);
    };

    GlobalView.prototype.render = function() {
      this.$el.html(this.template());
      return this;
    };

    return GlobalView;

  })(BaseView);
  
});
window.require.register("views/templates/global", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="wrapper"><div id="logo"><img src="/static/images/aharonbus.svg"/></div></div>');
  }
  return buf.join("");
  };
});