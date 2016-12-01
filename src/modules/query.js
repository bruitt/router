import qs from 'querystring'

let queryParser = () => (route) => {
  let { location } = route
  let queryStr = location.search.replace(/^\?/, '')
  let query = qs(queryStr) || {}

  return Object.assign({ query }, route)
}

export default queryParser