// TODO: Add validation
let getModulesRunner = modules => route =>
  modules.reduce((route, mod) => mod(route), route)

let init = (getNavigation, modules = []) => {
  let runModules = getModulesRunner(modules)
  return getNavigation(runModules)
}

export default init