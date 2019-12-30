class Camera extends Entity {
  constructor () {
    super()
    this.object = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
    this._mousedown = -1
    this._mousemove = new THREE.Vector2()
    this._rotation = new THREE.Vector3(Math.PI/4, -Math.PI/4)
    this._screenCenter = null
    this._velocity = 0.05
    this._rotateVelocity = 0.002
    this._wheelVelocity = 2
    this._velocityMod = 1
    this.subscribe('mousebutton')
    this.subscribe('mousewheel')
  }

  update(delta) {
    super.update(delta)

    switch (this._mousedown) {
      case 0: {
        let addVector = new THREE.Vector3(-this._mousemove.x, 0, -this._mousemove.y).multiplyScalar(this._velocity * this._velocityMod).applyAxisAngle(new THREE.Vector3(0, 1, 0), this._rotation.x)
        this.addPositionVector(addVector)
        this._mousemove.set(0, 0)
        break
      }
      case 2: {
        this._rotation.x += this._mousemove.x * this._rotateVelocity
        this._rotation.y += this._mousemove.y * this._rotateVelocity
        if (this._rotation.y > 1.99*Math.PI/4) this._rotation.y = 1.99*Math.PI/4
        else if (this._rotation.y < -1.99*Math.PI/4) this._rotation.y = -1.99*Math.PI/4
        this._rotation.x %= 2 * Math.PI
        let quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._rotation.x).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._rotation.y))
        if (this._screenCenter) {
          let distance = new THREE.Vector3().copy(this._object.position).sub(this._screenCenter).length()
          let vector = new THREE.Vector3(0, 0, distance)
          vector.applyQuaternion(quat)
          vector.add(this._screenCenter)
          this.copyPosition(vector)
          this.lookAtVector(this._screenCenter)
        } else {
          this._object.quaternion.set(quat)
        }
        this._mousemove.set(0, 0)
        break
      }
    } 
  }

  onEvent(name, message) {
    switch (name) {
      case 'mousebutton': {
        if (message.down) {
          this._mousedown = message.button
          if (message.screenCenter) this._screenCenter = message.screenCenter
          else this._screenCenter = null
          scene.renderer.domElement.requestPointerLock()
          this.subscribe("mousemove")
        } else {
          this._mousedown = -1
          this._mousemove.set(0, 0)
          document.exitPointerLock()
          this.unsubscribe("mousemove")
        }
        break
      }
      case 'mousemove': {
        this._mousemove.add(new THREE.Vector2(message.movementX, message.movementY))
        break
      }
      case 'mousewheel': {
        if (this._mousedown == 0) {
          this._velocityMod += message.down ? -1 : 1
          if (this._velocityMod < 1) this._velocityMod = 1
        } else {
          let vector = new THREE.Vector3(0, 0, this._wheelVelocity).applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._rotation.x).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._rotation.y)))
          if (!message.down) vector.negate()
          this.addPositionVector(vector)
          //this.addPosition(0, message.down ? -this._wheelVelocity : this._wheelVelocity, 0)
        }
      }
    }
  }
}
