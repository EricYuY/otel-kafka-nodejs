'use strict'
// require('./tracer')(`consumer-cluster-${process.env.CLUSTER}`)

const initMessageHandler = require('./lib/message-handler')

;(async () => {
  await initMessageHandler()
})()
