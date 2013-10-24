/*
 * cylon-sphero
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Adaptor, Commands, Driver, Sphero, Spheron,
    __slice = [].slice;

  module.exports = {
    adaptor: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Adaptor.Sphero, args, function(){});
    },
    driver: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Driver.Sphero, args, function(){});
    },
    register: function(robot) {
      console.log("Registering Sphero adaptor for " + robot.name);
      robot.registerAdaptor('cylon-sphero', 'sphero');
      console.log("Registering Sphero driver for " + robot.name);
      return robot.registerDriver('cylon-sphero', 'sphero');
    }
  };

  Spheron = require('spheron');

  Commands = ['roll', 'setRGB'];

  Adaptor = {
    Sphero: Sphero = (function() {
      function Sphero(opts) {
        this.self = this;
        this.connection = opts.connection;
        this.name = opts.name;
        this.sphero = Spheron.sphero();
      }

      Sphero.prototype.commands = function() {
        return Commands;
      };

      Sphero.prototype.connect = function(connection) {
        this.connection = connection;
        console.log("Connecting to Sphero '" + this.name + "'...");
        this.sphero.on('open', function() {
          return this.connection.emit('connect', this.self);
        });
        this.sphero.on('close', function() {
          return this.connection.emit('disconnect', this.self);
        });
        this.sphero.on('error', function() {
          return this.connection.emit('error', this.self);
        });
        this.sphero.on('data', function(data) {
          return this.connection.emit('update', this.self, data);
        });
        this.sphero.on('message', function(data) {
          return this.connection.emit('message', this.self, data);
        });
        this.sphero.on('notification', function(data) {
          return this.connection.emit('notification', this.self, data);
        });
        this.sphero.open(this.connection.port.toString());
        return this.self;
      };

      Sphero.prototype.disconnect = function() {
        console.log("Disconnecting from Sphero '" + this.name + "'...");
        return this.sphero.close;
      };

      Sphero.prototype.roll = function(speed, heading, state) {
        return this.sphero.roll(speed, heading, state);
      };

      Sphero.prototype.setRGB = function(color, persist) {
        return this.sphero.roll(color, persist);
      };

      return Sphero;

    })()
  };

  Driver = {
    Sphero: Sphero = (function() {
      function Sphero(opts) {
        this.device = opts.device;
        this.connection = this.device.connection;
      }

      Sphero.prototype.commands = function() {
        return Commands;
      };

      Sphero.prototype.start = function() {
        Logger.info("started");
        this.connection.on('message', function(data) {
          return this.device.emit('message', this.self, data);
        });
        return this.connection.on('notification', function(data) {
          return this.device.emit('notification', this.self, data);
        });
      };

      Sphero.prototype.roll = function(speed, heading, state) {
        if (state == null) {
          state = 1;
        }
        return this.connection.roll(speed, heading, state);
      };

      Sphero.prototype.setRGB = function(color, persist) {
        return this.connection.roll(color, persist);
      };

      return Sphero;

    })()
  };

}).call(this);
