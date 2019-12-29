class Events {
  constructor() {
    this._channels = []
  }

  createChannel (name) {
    if (this._channels.find(value => value.name === name)) return
    this._channels.push(new EventChannel(name))
  }

  subscribeChannel (name, entity) {
    let channel = this._channels.find(value => value.name === name)
    if (!channel) return
    channel.subscribe(entity)
  }

  unsubscribeChannel (name, entity) {
    let channel = this._channels.find(value => value.name === name)
    if (!channel) return
    channel.unsubscribe(entity)
  }

  broadcast(name, message) {
    let channel = this._channels.find(value => value.name === name)
    if (!channel) return
    channel.broadcast(message)
  }
}

const events = new Events()