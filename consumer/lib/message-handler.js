const Kafka = require('./kafka')
const MongoClient = require('mongodb').MongoClient;


const init = async () => {
  const kafkaConsumer = await Kafka.initConsumer()
  const kafkaProducer = await Kafka.initProducer()

  const mongo = await MongoClient.connect('mongodb://root:example@mongo:27017', { useNewUrlParser: true })

  const mongoDb = mongo.db(`${process.env.MONGO_INITDB_DATABASE}`)
  const collectionClusterA = mongoDb.collection(`cluster-${process.env.CLUSTER}`)

  const topic = `iot-splunk-apm-poc-${process.env.CLUSTER}-in`
  console.log({ topic })
  kafkaConsumer.subscribe({
    topic,
    fromBeginning: false,
  })

  kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({topic})
      const messageKey = message.key.toString()
      const messageValue = JSON.parse(message.value.toString())
      console.log({
        message: messageValue,
      })

      console.log('Inserting in Mongo ...')
      const mongoDoc = await collectionClusterA.insertOne({
        key: messageKey,
        data: messageValue,
      })
      console.log(`Inserting in Mongo ... Done! insertedCount: ${mongoDoc.insertedCount}`)

      console.log('Sending message to OUT topic')
      await kafkaProducer.send({
        topic: topic.replace('-in', '-out'),
        messages: [{
          key: messageKey,
          value: JSON.stringify(messageValue),
        }],
      })

    },
  })
}

module.exports = init
