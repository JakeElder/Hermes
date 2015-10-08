module.exports = {
  Server: require('./hermes'),
  Route: require('./route'),
  FileSystemRouteSupplier: require('./route-suppliers/file-system-route-supplier'),
  SimpleRouteSupplier: require('./route-suppliers/simple-route-supplier')
};
