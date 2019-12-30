class Scene {
  constructor () {
    this.scene = new THREE.Scene()
    this.renderer = null

    this._entities = []
    this._entitiesGroup = new THREE.Group()
    this._entitiesGroup.name = 'Entities'
    this.scene.add(this._entitiesGroup)
    this.camera = null

    this._ambientLight = null

    this.clock = new THREE.Clock(true)

    this.raycaster = new THREE.Raycaster()
    this._mouse = new THREE.Vector2()
    this.screenCenterWorldPoint = null

    this.mouseOver = null
    this.mouseOverIntersect = null

    events.createChannel("mousebutton")
    events.createChannel("mouseover")
    events.createChannel("mousemove")
    events.createChannel("mousewheel")
    events.createChannel("key")

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseWheel = this.onMouseWheel.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)

    addEventListener("mousemove", this.onMouseMove)
    addEventListener("mousedown", this.onMouseDown)
    addEventListener("mouseup", this.onMouseUp)
    addEventListener("mousewheel", this.onMouseWheel)
    addEventListener("keydown", this.onKeyDown)
    addEventListener("keyup", this.onKeyUp)
  }

  get entitiesGroup () {
    return this._entitiesGroup
  }

  addEntity (entity) {
    this._entities.push(entity)
    this._entitiesGroup.add(entity.object)
  }

  update () {
    const delta = this.clock.getDelta()

    this.raycaster.setFromCamera( this._mouse, this.camera.object )
    let intersects = this.raycaster.intersectObjects( this.scene.children, true )
    if (intersects.length > 0) {
      let object = intersects[0].object
      let entity = this.findEntityByObject(object)
      if (entity) {
        let broadcastMouseOver = false
        if (this.mouseOver !== entity) broadcastMouseOver = true
        this.mouseOver = entity
        this.mouseOverIntersect = intersects[0]
        if (broadcastMouseOver) events.broadcast("mouseover", { entity: this.mouseOver, intersect: this.mouseOverIntersect })
      }
    } else if (this.mouseOver !== null) {
      this.mouseOver = null
      this.mouseOverIntersect = null
      events.broadcast("mouseover", { entity: this.mouseOver, intersect: this.mouseOverIntersect })
    }

    this.raycaster.setFromCamera( new THREE.Vector2(0, 0), this.camera.object )
    intersects = this.raycaster.intersectObjects( this.scene.children, true )
    if (intersects.length > 0) {
      this.screenCenterWorldPoint = intersects[0].point
    } else {
      this.screenCenterWorldPoint = null
    }

    for (const entity of this._entities) {
      if (entity.enabled) entity.update(delta)
    }
  }

  setAmbientLight (r, g, b, intensity) {
    if (this._ambientLight) this._entitiesGroup.remove(this._ambientLight)
    this._ambientLight = new THREE.AmbientLight(new THREE.Color(r, g, b), intensity)
    this._entitiesGroup.add(this._ambientLight)
  }

  setCamera (entity) {
    this.camera = entity
    this.addEntity(entity)
  }

  onMouseMove ({ target, clientX, clientY, movementX, mozMovementX, webkitMovementX, movementY, mozMovementY, webkitMovementY }) {
    this._mouse.x = (clientX / window.innerWidth) * 2 - 1
    this._mouse.y = - (clientY / window.innerHeight) * 2 + 1
    let message = {
      target,
      clientX,
      clientY,
      x: this._mouse.x,
      y: this._mouse.y,
      movementX: movementX || mozMovementX || webkitMovementX,
      movementY: movementY || mozMovementY || webkitMovementY,
      ...(this.mouseOver ? { entity: this.mouseOver } : {}),
      ...(this.mouseOverIntersect ? { intersect: this.mouseOverIntersect } : {}),
      ...(this.screenCenterWorldPoint ? { screenCenter: this.screenCenterWorldPoint } : {})
    }
    events.broadcast("mousemove", message)
  }

  onMouseDown (event) {
    event.preventDefault()
    let {target, clientX, clientY, button} = event
    let message = {
      down: true,
      button,
      target,
      clientX,
      clientY,
      x: this._mouse.x,
      y: this._mouse.y,
      ...(this.mouseOver ? { entity: this.mouseOver } : {}),
      ...(this.mouseOverIntersect ? { intersect: this.mouseOverIntersect } : {}),
      ...(this.screenCenterWorldPoint ? { screenCenter: this.screenCenterWorldPoint } : {})
    }
    events.broadcast('mousebutton', message)
  }

  onMouseUp (event) {
    event.preventDefault()
    let {target, clientX, clientY, button} = event
    let message = {
      down: false,
      button,
      target,
      clientX,
      clientY,
      x: this._mouse.x,
      y: this._mouse.y,
      ...(this.mouseOver ? { entity: this.mouseOver } : {}),
      ...(this.mouseOverIntersect ? { intersect: this.mouseOverIntersect } : {})
    }
    events.broadcast('mousebutton', message)
  }

  onMouseWheel (event) {
    event.preventDefault()
    let { wheelDeltaY } = event
    let message = {
      down: wheelDeltaY < 0
    }
    events.broadcast('mousewheel', message)
  }

  onKeyDown (event) {
    //event.preventDefault()
    let { code, target } = event
    let message = {
      down: true,
      code,
      target
    }
    events.broadcast("key", message)
  }

  onKeyUp (event) {
    //event.preventDefault()
    let { code, target } = event
    let message = {
      down: false,
      code,
      target
    }
    events.broadcast("key", message)
  }

  findEntityByObject (object) {
    for (let entity of this._entities) {
      if (entity.object === object) return entity
    }
    return null
  }
}

const scene = new Scene()
