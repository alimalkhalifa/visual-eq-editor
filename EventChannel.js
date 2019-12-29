class EventChannel {
  constructor(name) {
    this.name = name
    this._members = []
  }

  broadcast (message) {
    for (let entity of this._members) {
      entity.onEvent(this.name, message)
    }
  }

  subscribe (entity) {
    if (this._members.indexOf(entity) !== -1) return
    this._members.push(entity)
  }

  unsubscribe (entity) {
    let index = this._members.indexOf(entity)
    if (index !== -1) this._members.splice(index)
  }
}