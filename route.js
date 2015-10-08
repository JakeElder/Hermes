'use strict';

const EventEmitter = require('events');
const url = require('url');
const _ = require('lodash');

const proxy = require('http-proxy').createServer({
  xfwd: true,
  secure: true
});

class Route {
  constructor(data) {
    Object.assign(this, EventEmitter.prototype);
    this.pattern = new RegExp(data.pattern);
    this.methods = data.methods;
    this.target = data.target;
  }

  accepts(method) {
    return this.methods.indexOf(method) !== -1;
  }

  get middleware() {
    return this._controller || (this._controller = Route.controller.bind(this));
  }

  static controller(req, res, next) {
    if (!this.accepts(req.method)) { return next(); }
    const target = Route.injectCapturedPatterns(
      this.pattern,
      req.originalUrl,
      _.clone(this.target)
    );
    this.emit('proxy', req.method, req.originalUrl, target);
    proxy.web(req, res, {
      target: target,
      headers: { host: this.target.host }
    });
  }

  static injectCapturedPatterns(pattern, matchedPath, target) {
    const matches = matchedPath.match(pattern);
    if (matches) {
       target.pathname = target.pathname.replace(/\$(\d+)/g, m => matches[m[1]]);
    }
    return url.format(target);
  }

  static get all() {
    return require('./routes').map(data => new Route(data));
  }
}

module.exports = Route;
