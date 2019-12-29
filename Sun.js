class Sun extends Light {
  constructor (r, g, b, intensity) {
    super()
    this.object = new THREE.DirectionalLight(new THREE.Color(r, g, b), intensity)
    this.setPosition(-1, 0, 1)
  }
}
