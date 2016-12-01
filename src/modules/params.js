let transformRoute = route => route.replace(/^\/|\/$/g, '').split('/')

let parseRouteChunk = chunk => {
  let matchedParam = /^:(.*)$/.exec(chunk)

  if (matchedParam) {
    return { name: matchedParam[1] }
  }

  return chunk
}

let paramsParser = ({ fallbackType, routes }) => {
  let pathnames = Object.keys(routes)
  let routesList = pathnames.reduce((routesList, pathname) => {
    let type = routes[pathname]
    let route = transformRoute(pathname).map(parseRouteChunk)

    return routesList.concat({ type, route })
  }, [])
  
  return (route) => {
    let { location } = route
    let transformedRoute = transformRoute(location.pathname)
    let filteredRoutes = routes.filter(({ route }) => (
      transformRoute.length === route.length &&
      route.every((chunk, index) => {
        let isParam = typeof chunk === 'object'
        let equalChunks = chunk === transformedRoute[index]
        return isParam || equalChunks
      })
    ))

    if (filteredRoutes.length > 0) {
      let validRoute = filteredRoutes[0]
      let params = validRoute.router.reduce((params, chunk, index) => {
        if (typeof chunk === 'object' && chunk.name) {
          params[chunk.name] = transformRoute[index]
        }

        return params
      }, {})

      return Object.assign({
        type: validRoute.type,
        params
      }, route)
    }

    return Object.assign({
      type: fallbackType,
      params: {}
    }, route)
  }
}

export default paramsParser