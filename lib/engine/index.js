
var grunt = require('grunt');

var EngineFactory = function() {
  'use strict';

  var engine = null;
  var engineName = '';
  var extensions = require('./extensions');

  var functionExists = function(fn) {
    var getType = {};
    return fn && getType.toString.call(fn) === '[object Function]';
  };

  var tryRequireEngine = function(eng) {
    try {
      engine = require('assemble-' + eng);
    } catch(ex1) {
      try {
        engine = require(eng);
      } catch(ex2) {
        grunt.log.writeln('Error loading engine: ' + eng);
        grunt.log.writeln(ex2);
      }
    }
  };

  var load = function(eng) {
    engineName = eng;
    tryRequireEngine(eng);
    if(!engine) {
      return false;
    }
    return this;
  };

  var init = function(options) {
    if(functionExists(engine.init)) {
      engine.init(options);
    }
  };

  var compile = function(src, options, callback) {
    if(!functionExists(engine.compile)) {
      grunt.log.writeln(engineName + ' does not support compile.');
      callback(engineName + ' does not support compile.', null);
    }
    engine.compile(src, options, callback);
  };

  var render = function(tmpl, options, callback) {
    if(!functionExists(engine.render)) {
      grunt.log.writeln(engineName + ' does not support render.');
      callback(engineName + ' does not support render.', null);
    }
    engine.render(tmpl, options, callback);
  };
  // Helpers, filters etc. depending on template engine
  var registerFunctions = function() {
    if(functionExists(engine.registerFunctions)) {
      engine.registerFunctions();
    }
  };

  var registerPartial = function(filename, content) {
    if(functionExists(engine.registerPartial)) {
      engine.registerPartial(filename, content);
    }
  };

  return {
    load: load,
    init: init,
    compile: compile,
    render: render,
    registerFunctions: registerFunctions,
    registerPartial: registerPartial,
    extensions: extensions,
    engine: engine
  };

};

module.exports = exports = new EngineFactory();
