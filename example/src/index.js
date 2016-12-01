import { createElement as h, Component, PropTypes, Children } from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import initRouter from 'router'
import browserHistory from 'router/navigation/browserHistory'
import params from 'router/modules/params'
import reaction from 'router/modules/reaction'

let history = createHistory()




let Container = ({ title, children }) =>
  h('div', {},
    h('h1', {}, title),
    children)

let HomePage = () =>
  h(Container, { title: 'Welcome home' },
    h(Link, { href: '/users' }, 'Users >'))

let UsersPage = ({ list = [] }) =>
  h(Container, { title: 'List of users' },
    h(Link, { href: '/' }, '< Home'),
    list.map(({ id }) =>
      h('div', { key: id },
        h(Link, { href: `/users/${id}` }, id))))

let UserPage = ({ params }) =>
  h(Container, { title: `User ${params.id}`},
    h(Link, { href: '/users' }, '< Users'))

let NotFoundPage = () =>
  h(Container, { title: 'Not found' })




class Link extends Component {
  constructor(props) {
    super()
    this.onClick = e => {
      e.preventDefault()
      history.push(this.props.href)
    }
  }

  render() {
    let props = Object.assign({ onClick: this.onClick }, this.props)
    return h('a', props, this.props.children)
  }
}

class Page extends Component {
  static contextTypes = {
    currentRoute: PropTypes.object
  }

  render() {
    let { currentRoute } = this.context
    let contextType = currentRoute.type
    let pageType = this.props.type
    let Component = this.props.component

    if (contextType === pageType) {
      return h(Component, Object.assign({}, this.props, currentRoute))
    }

    return null
  }
}

class Router extends Component {
  static childContextTypes = {
    currentRoute: PropTypes.object
  }

  constructor() {
    super()
    this.state = {
      route: null
    }
  }

  componentDidMount() {
    let { history, routes } = this.props
    this.unlisten = initRouter(browserHistory(history), [
      params({
        fallbackType: 'not-found',
        routes
      }),
      reaction(route => this.setState({ route }))
    ])
  }

  componentWillUnmount() {
    this.unlisten()
  }

  getChildContext() {
    return {
      currentRoute: this.state.route
    }
  }

  render() {
    return this.state.route && Children.only(this.props.children)
  }
}




let routes = {
  '/': 'home',
  '/users': 'users',
  '/users/:id': 'user'
}

let usersList = [
  { id: 'john' },
  { id: 'james' },
  { id: 'sam' }
]

let app =
  h(Router, { history, routes },
    h('div', {},
      h(Page, { type: 'home', component: HomePage }),
      h(Page, { type: 'users', component: UsersPage, list: usersList }),
      h(Page, { type: 'user', component: UserPage }),
      h(Page, { type: 'not-found', component: NotFoundPage })))

render(app, document.getElementById('app'))