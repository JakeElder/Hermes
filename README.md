Hermes
======
End point aggregation server. useful for providing a single url for all of your
micro service endpoints.

Usage
-----
`npm install --save hermes-server`

```javascript
'use strict';

const Hermes = require('hermes-server');
const routeSupplier = new Hermes.FileSystemRouteSupplier({
  filePath: './node_modules/hermes-server/routes.example.json'
});
const hermes = new Hermes.Server(routeSupplier, 3000);

hermes.on('listening', (port) => {
  console.log(`Hermes started on port ${port}`);
});

hermes.on('proxy', (method, path, target) => {
  console.log(`${method} ${path} => ${target}`);
});
```

Route Suppliers
---------------
In order to know where to proxy traffic, Hermes needs to be provided with a
set of routes. This is achieved by instantiating a RouteSupplier.

### Default Route Suppliers
Hermes comes with two route suppliers, `Hermes.SimpleRouteSupplier` and
`Hermes.FileSystemRouteSupplier`

#### SimpleRouteSupplier
Provides routes based on an object passed on instantiation
```javascript
const routeSupplier = new Hermes.SimpleRouteSupplier({
  routeData: [{
    'name': 'Test route',
    'methods': ['GET'],
    'pattern': '/test',
    'target': {
      'protocol': 'http',
      'host': 'example.com',
      'pathname': '/'
    }
  }]
});
routeSupplier.getRoutes().then(routes => { console.log(routes) });
```

#### FileSystemRouteSupplier
Reads routes from a JSON file, the path of which is passed to the constructor
```javascript
const routeSupplier = new Hermes.FileSystemRouteSupplier({
  filePath: './node_modules/hermes-server/routes.example.json'
});
routeSupplier.getRoutes().then(routes => { console.log(routes) });
```

### Custom Route Suppliers
To allow custom generation/retrieval of routes, it is possible to create your
own RouteSupplier
```javascript
const Q = require('q');
const Route = require('Hermes').Route;

class MyRouteSupplier extends Hermes.RouteSupplier {
  constructor(options) {
    super(options);
  }

  getRoutes() {
    return Q.promise((resolve) => {
      fetchRoutesFromSomeService().then((routes) => {
          resolve(routes.map(data => new Route(data)));
      });
    });
  }
}
```

Route Format
------------
Routes should be defined as below
```javascript
[{
  // A unique identifier for the route
  "id": "Test route",
  // Which methods should be proxied
  "methods": ["GET", "POST", "PUT", "DELETE"],
  // The hermes path that should be requested in order to have it proxied to
  // the target. Supports RegEx's
  // IE
  // http://your-hermes-instance.com/test => http://example.com/
  // http://your-hermes-instance.com/test/thing => http://example.com/thing
  "pattern": "/test(.*)",
  // The target that the request should be proxied to. Accepts all values that
  // url.format accepts https://nodejs.org/api/url.html#url_url_format_urlobj
  "target": {
    "protocol": "http",
    "host": "example.com",
    "pathname": "/$1"
  }
}]
```
