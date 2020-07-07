export function patchRoutes(routes) {
  // routes[0].unshift({
  //   path: '/foo',
  //   component: require('./routes/foo').default,
  // });
  //console.log("---patchRoutes");
}

export function render(oldRender) {
  //console.log("route");
  oldRender();
  // setTimeout(oldRender, 1000);
}
