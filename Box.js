class Box extends Entity {
  constructor() {
    super()
    this.object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshLambertMaterial({ color: new THREE.Color(1, 1, 0) }))
  }
}