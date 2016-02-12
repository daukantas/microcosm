![Microcososm](http://f.cl.ly/items/36051G3A2M443z3v3U3b/microcososm.svg)
---

A variant of [Flux](https://facebook.github.io/flux/) with
central, isolated state.

[![Circle CI](https://circleci.com/gh/vigetlabs/microcosm.svg?style=svg)](https://circleci.com/gh/vigetlabs/microcosm)

---

## Table of Contents

1. [Documentation](docs)
2. [Overview](#overview)
3. [Opinions](#opinions)
4. [What is it trying to solve?](#what-is-it-trying-to-solve)

## Overview

Microcosm is a variant of [Flux](https://facebook.github.io/flux/)
that makes it easier to control and modify state in a pure,
centralized way. It thinks of stores and actions as stateless
collections of pure functions, keeping all data encapsulated in a
specific instance of Microcosm.

This design seeks to achieve a reasonable trade off between the
simplicity of singletons and the privacy of class instances.

### Actions

Actions are simple functions. They are called within the context of
Microcosm, taking the value they return and using it as the parameters
for processing within Stores.

```javascript
let addPlanet = function (params) {
  return params
}

app.push(addPlanet, params)
```

When an action is pushed, it is placed into a historical record of all
actions that have occurred.

### Stores

Stores hold no state; instead they are responsible for writing state
to the repository owned by a Microcosm instance.

This allows stores to be simple collections of pure functions that
transform old data into new data. The `register` hook tells Microcosm
what actions a store should respond to:

```javascript
let Planets = {
  register() {
    return {
      [addPlanet] : this.add
    }
  },
  add(planets, props) {
    return planets.concat(props)
  }
}
```

### Launching an app

Once stores have been added to a Microcosm, it is ready to begin work.

```javascript
let app = new Microcosm()

// All state is contained in `app`, but transformed with `Planets`
app.addStore(Planets, 'planets')

// Start tells a Microcosm to begin tracking state and register any
// installed plugins
app.start()
```

From there, an app's state can be sent down your React component tree:

``` javascript
React.render(<SolarSystem app={ app } planets={ app.state.planets } />, document.body)
```

## Opinions

1. Action CONSTANTS are automatically generated by assigning
   each Action function a unique `toString` signature under the hood.
3. Actions dispatch parameters by returning a value or a promise (only
   dispatching when it is resolved)
3. Actions handle all asynchronous operations. Stores are
   synchronous.
4. Stores do not contain data, they _transform_ it.

## What is it trying to solve?

1. State isolation. Requests to render applications server-side should
   be as stateless as possible. Client-side libraries (such as
   [Colonel Kurtz](https://github.com/vigetlabs/colonel-kurtz)) need easy
   containment from other instances on the page.
2. Singletons are simple, but make it easy to accidentally share
   state. Microcosm keeps data in one place, operating on it
   statelessly in other entities.
3. Easy extension of core API and layering of features out of the
   framework's scope.

## Inspiration

- [Worlds](http://www.vpri.org/pdf/rn2008001_worlds.pdf)
- [Om](https://github.com/omcljs/om)
- [Elm Language](https://elm-lang.org)
- [Flummox](https://github.com/acdlite/flummox)
- [But the world is mutable](http://www.lispcast.com/the-world-is-mutable)
- [Event Sourcing Pattern](http://martinfowler.com/eaaDev/EventSourcing.html)
- [Apache Kafka](http://kafka.apache.org/)

***

<a href="http://code.viget.com">
  <img src="http://code.viget.com/github-banner.png" alt="Code At Viget">
</a>

Visit [code.viget.com](http://code.viget.com) to see more projects from [Viget.](https://viget.com)
