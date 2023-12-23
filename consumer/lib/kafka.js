
const {
  Kafka: KafkaJS,
  logLevel: KafkaLogLevel,
  CompressionTypes,
  CompressionCodecs,
} = require('kafkajs')
const SnappyCodec = require('kafkajs-snappy')
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec

module.exports = class Kafka {
  static _kafka
  static kafka() {
    if (!this._kafka) {
      this._kafka = new KafkaJS({
        logLevel: KafkaLogLevel.INFO,
        clientId: `host-${require('os').hostname()}`,
        brokers: ['kafka:9092']
      })
    }
    return this._kafka
  }

  static async initConsumer () {
    const kafkaConsumer = this.kafka().consumer({
      groupId: `test-consumer-e-${process.env.CLUSTER}`,
    })

    await kafkaConsumer.connect()
    return kafkaConsumer
  }

  static async initProducer () {
    const kafkaProducer = this.kafka().producer()

    /* $lab:coverage:off$ */
    kafkaProducer.on(kafkaProducer.events.CONNECT, () => {
      console.info('Kafka Producer Connected')
      Kafka._producerConnected = true
    })
    kafkaProducer.on(kafkaProducer.events.DISCONNECT, () => {
      console.info('Kafka Producer Disconnected')
      Kafka._producerConnected = false
    })
    /* $lab:coverage:on$ */

    await kafkaProducer.connect()
    return kafkaProducer
  }
}
