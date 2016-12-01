let getBrowserHistoryNavigation = (history) => runModules => {
  runModules({ location: history.location })
  return history.listen((location) => runModules({ location }))
}

export default getBrowserHistoryNavigation