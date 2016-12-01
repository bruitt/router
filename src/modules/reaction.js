let reaction = reactionFn => route => {
  reactionFn(route)
  return route
}

export default reaction