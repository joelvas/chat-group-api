const { v4: uuidv4 } = require('uuid')

class Message {
  constructor() {
    this.uuid = uuidv4()
    this.text = ''
  }
}

class Channel {
  constructor({ name, description, password = null }) {
    this.uuid = uuidv4()
    this.name = name
    this.description = description
    this.password = password
    this.members = {}
    this.created_at = String(Date.now)
  }

  get toJson() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      last4: this.last4
    }
  }


}

module.exports = Channel