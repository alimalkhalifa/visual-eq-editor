class Renderer {
  constructor (parentElementId) {
    this._renderer = new THREE.WebGLRenderer()
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.outputEncoding = THREE.sRGBEncoding
    this._renderer.gammaFactor = 2.2
    this._camera = null

    if (parentElementId) {
      this._parentElement = document.getElementById(parentElementId)
      this._parentElement.appendChild(this._renderer.domElement)
    } else {
      document.body.appendChild(this._renderer.domElement)
    }
  }

  render () {
    if (scene && scene.camera) { this._renderer.render(scene.scene, camera.object) }
  }

  setCamera (camera) {
    this._camera = camera
  }

  setScene (scene) {
    this._scene = scene
  }

  get domElement() {
    return this._renderer.domElement
  }
}
