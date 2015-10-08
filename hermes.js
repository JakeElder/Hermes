'use strict';

const EventEmitter = require('events');

class Hermes {
  constructor(routeSupplier, port) {
    Object.assign(this, EventEmitter.prototype);
    this.port = (typeof port === 'undefined' ? 3000 : port);
    this.app = require('express')();
    routeSupplier.getRoutes().then(routes => this.start(routes));
  }

  start(routes) {
    this._initStatusRoute();
    this._initProxyRoutes(routes);
    this._init404Route();
    this.server = this.app.listen(this.port, () => {
      this.emit('listening', this.port);
    });
  }

  stop() {
    this.server.close();
  }

  _initStatusRoute() {
    this.app.use('/status', Hermes.statusController);
  }

  _initProxyRoutes(routes) {
    for(let route of routes) {
      this.app.use(route.pattern, route.middleware);
      route.on('proxy', this.emit.bind(this, 'proxy'));
    }
  }

  _init404Route() {
    this.app.use((req, res) => { res.status(404).send('Not found'); });
  }

  static statusController(req, res) {
    res.send({
      status: 'up',
      time: new Date().toISOString()
    });
  }
}

module.exports = Hermes;
