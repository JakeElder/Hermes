'use strict';

require('should');

const request = require('supertest');
const nock = require('nock');
const Hermes = require('hermes');
const SimpleRouteSupplier = require('route-suppliers/simple-route-supplier');

describe('Known routes', () => {
  const routeSupplier = new SimpleRouteSupplier({
    routeData: [{
      name: 'Test route',
      methods: ['GET'],
      pattern: '/test',
      target: {
        protocol: 'http',
        host: 'example.com',
        pathname: '/'
      }
    }]
  });

  it('should invoke a request to the target', (done) => {
    const hermes = new Hermes(routeSupplier, 0);
    const proxyRequest = nock('http://example.com').get('/').reply(200, 'OK');
    request(hermes.app)
      .get('/test')
      .end(() => {
        proxyRequest.isDone().should.eql(true);
        done();
      });
  });
  
  it('should return the response from the target', (done) => {
    const hermes = new Hermes(routeSupplier, 0);
    nock('http://example.com').get('/').reply(200, 'Some response');
    request(hermes.app)
      .get('/test')
      .expect(200, 'Some response', done);
  });
});
