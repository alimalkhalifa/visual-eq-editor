class Component {
  constructor(owner) {
    this.owner = owner
    this.enabled = true
  }

  update(delta) {
    return
  }

  setEnable(flag) {
    this.enabled = flag
  }
}