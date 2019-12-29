class Terrain extends Entity {
  constructor(zonename) {
    super()
    let loader = new THREE.GLTFLoader()
    loader.load(
      `graphics/${zonename}/${zonename}.glb`,
      gltf => {
        this.object = (gltf.scene)
        this.setRotation(0, Math.PI / 2, Math.PI / 2)
      }
    )
  }
}