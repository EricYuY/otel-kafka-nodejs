
const {
  Kafka: KafkaJS,
  logLevel: KafkaLogLevel,
  CompressionTypes,
  CompressionCodecs,
} = require('kafkajs')
const SnappyCodec = require('kafkajs-snappy')
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec

module.exports = class Kafka {
  static _producerConnected = false

  static async initProducer () {
    const kafka = new KafkaJS({
      logLevel: KafkaLogLevel.INFO,
      clientId: `host-${require('os').hostname()}`,
      brokers: ['kafka:9092'],
    })
    const kafkaProducer = kafka.producer()

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
    
    // const admin = kafka.admin()
    // await admin.connect()
    // await admin.createTopics({
    //   waitForLeaders: true,
    //   topics: [
    //     { topic: 'iot-splunk-apm-poc-a-in' },
    //     { topic: 'iot-splunk-apm-poc-a-out' }        
    //   ],
    // })    
    // console.log('Done creating topics')
    
    return kafkaProducer
  }
}
