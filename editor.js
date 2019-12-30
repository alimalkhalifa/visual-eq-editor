/* global requestAnimationFrame */

const renderer = new Renderer()
scene.renderer = renderer

const camera = new Camera()
camera.setPosition(45, 45, 45)
camera.lookAt(0, 0, 0)
scene.setCamera(camera)

scene.setAmbientLight(1, 1, 1, 0.8)

const sun = new Sun(1.0, 1.0, 0.8, 2)
scene.addEntity(sun)

const terrain = new Terrain("crushbone")
scene.addEntity(terrain)

function animate () {
  requestAnimationFrame(animate)

  scene.update()
  renderer.render()
}

animate()