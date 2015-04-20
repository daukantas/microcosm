/**
 * Microcosm
 * An isomorphic flux implementation. The strength of Microcosm
 * is that each application is its own fully encapsulated world.
 */

import Diode   from 'diode'
import Foliage from 'foliage'
import Plugin  from './Plugin'
import Store   from './Store'
import install from './install'
import remap   from './remap'

export default class Microcosm extends Foliage {

  constructor() {
    super()

    Diode.decorate(this)

    this._stores  = {}
    this._plugins = []
  }

  push(signal, ...params) {
    const request = signal(...params)

    // Actions some times return promises. When this happens, wait for
    // them to resolve before moving on
    if (request instanceof Promise) {
      return request.then(body => this.dispatch(signal, body))
    }

    return this._root.dispatch(signal, request)
  }

  prepare(fn, ...buffer) {
    return this.push.bind(this, fn, ...buffer)
  }

  replace(data) {
    this.commit(this.deserialize(data))
    this.emit()
  }

  dispatch(action, body) {
    let dirty = false

    for (var key in this._stores) {
      let actor = this._stores[key][action]

      if (actor) {
        actor(this.refine(key), body)
        dirty = true
      }
    }

    if (dirty) {
      this.emit()
    }

    return body
  }

  addPlugin(plugin, options) {
    Plugin.validate(plugin)

    this._plugins.push([ plugin, options ])
  }

  addStore(key, store) {
    // Make sure life cycle methods are included and then
    // add the validated stores to the list of known entities
    this._stores[key] = { ...Store, ...store }
  }

  serialize() {
    return remap(this._stores, (store, key) => store.serialize(this.get(key)))
  }

  deserialize(data={}) {
    return remap(this._stores, (store, key) => store.deserialize(data[key]))
  }

  toJSON() {
    return this.serialize()
  }

  start(...next) {
    // Start by producing the initial state
    this.commit(remap(this._stores, store => store.getInitialState()))

    // Queue plugins and then notify that installation has finished
    install(this._plugins, this, function() {
      next.forEach(callback => callback())
    })
  }

}
