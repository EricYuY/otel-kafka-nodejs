'use strict'
// require('./tracer')(`iot-poc-consumer-cluster-${process.env.CLUSTER}`)

const initMessageHandler = require('./lib/message-handler')

;(async () => {
  await initMessageHandler()
})()
