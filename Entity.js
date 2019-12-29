class Entity {
  constructor () {
    this._object = new THREE.Object3D()
    this._components = []
    this.enabled = true
    this._subscriptions = []
  }

  get object() {
    return this._object
  }

  set object(value) {
    scene.entitiesGroup.remove(this._object)
    this._object = value
    scene.entitiesGroup.add(this._object)
  }

  copyPosition (vector) {
    return this.object.position.copy(vector)
  }

  setPosition (x, y, z) {
    return this.object.position.set(x, y, z)
  }

  addPosition (x, y, z) {
    return this.object.position.add(new THREE.Vector3(x, y, z))
  }

  setPositionVector (vector) {
    return this.object.position.copy(vector)
  }

  addPositionVector (vector) {
    return this.object.position.add(vector)
  }

  lookAtVector (vector) {
    this.object.lookAt(vector)
  }

  lookAt (x, y, z) {
    this.object.lookAt(new THREE.Vector3(x, y, z))
  }

  update (delta) {
    for (let component of this._components) {
      if (component.enabled) component.update(delta)
    }
  }

  setRotation (x, y, z) {
    return this.object.quaternion.copy(new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'ZXY')))
  }

  rotateWorldY (angle) {
    console.log('rot')
    this._object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), angle)
  }

  addComponent (component) {
    this._components.push(component)
  }

  removeComponent (component) {
    let index = this._components.indexOf(component)
    if (index !== -1 ) this._components.splice(index)
  }

  setEnable(flag) {
    this.enabled = flag
  }

  subscribe(name) {
    if (this._subscriptions.indexOf(name) !== -1) return
    this._subscriptions.push(name)
    events.subscribeChannel(name, this)
  }

  unsubscribe(name) {
    let index = this._subscriptions.indexOf(name)
    if (index !== -1) {
      this._subscriptions.splice(index)
      events.unsubscribeChannel(name, this)
    }
  }

  onEvent(message) {
    console.log(message)
  }
}
