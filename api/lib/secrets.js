
module.exports = class Secrets {
  static get(id) {
    console.log(`Secrets.get() id: ${id}`)
    return Math.random().toString()
  }

  static set(id, value) {
    console.log(`Secrets.set() id: ${id}, value: ${value}`)
  }
}
