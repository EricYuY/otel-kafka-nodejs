// const api = require('@opentelemetry/api')
const Hapi = require('@hapi/hapi')
const Secrets = require('./secrets')
const Kafka = require('./kafka')


const init = async () => {
  const kafkaProducer = await Kafka.initProducer()


  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0'
  })

  server.route({
    method: 'GET',
    path: '/secrets/{id}',
    handler: (request, h) => {

      const secretValue = Secrets.get(request.params.id)
      return JSON.stringify({
        status: 'OK',
        secret: {
          id: request.params.id,
          value: secretValue,
        }

      })
    }
  })

  server.route({
    method: 'GET',
    path: '/status',
    handler: (request, h) => {
      return JSON.stringify({status: 'OK'})
    }
  })

  server.route({
    method: 'POST',
    path: '/dataup/{cluster}',
    handler: async (request, h) => {
      // const currentSpan = api.trace.getSpan(api.context.active())
      // currentSpan.setAttribute('workflow.name', `dataup-cluster-${request.params.cluster}`)

      const topic = `topico-${request.params.cluster}-entrada`
      console.log('Sending message to topic:', topic)
      await kafkaProducer.send({
        topic,
        messages: [{
          key: request.payload.key,
          value: JSON.stringify(request.payload.data),
        }],
      })

      return JSON.stringify({
        status: 'OK',
        topic: request.params.cluster,
        key: request.payload.key,
        data: request.payload.data,
      })
    }
  })

  server.ext('onRequest', (request, h) => {
    // const currentSpan = api.trace.getSpan(api.context.active());
    // const { traceId } = currentSpan.spanContext();
    // console.log({ traceId })
    // console.log(`Splunk APN trace: https://app.us1.signalfx.com/#/apm/traces/${traceId}`);

    return h.continue
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}

module.exports = init
