import React     from 'react'
import DOM       from 'react-dom'
import Presenter from '../../../src/addons/presenter'
import Debugger  from 'microcosm-debugger'
import Todos     from './todos'
import routes    from './routes'

import { Router, browserHistory } from 'react-router'

const repo = new Todos({ maxHistory: Infinity })

// Install the debugger
Debugger(repo)

// Render
DOM.render((
  <Presenter repo={ repo }>
    <Router history={ browserHistory } routes={ routes } />
  </Presenter>
), document.getElementById('app'))
