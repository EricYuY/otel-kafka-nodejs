// const tracer = require('./tracer')('iot-poc-client')
// const api = require('@opentelemetry/api')
const sleep = require('./lib/sleep')
const axios = require('axios').default

;(async () => {
  while (true) {
    await doRequest()
    const waitTime = Math.round(Math.random()*Math.PI*10)
    console.log(`Waiting ${waitTime}s for next request`)
    await sleep(waitTime * 1000)
  }
})()

async function doRequest() {
  // const span = tracer.startSpan('client.doRequest()', {
  //   kind: api.SpanKind.CLIENT,
  // })

  // api.context.with(api.trace.setSpan(api.ROOT_CONTEXT, span), async () => {
    try {
      const res = await axios.post(
        `http://api:3000/dataup/${process.env.CLUSTER}`,
        {
          key: require('os').hostname(),
          data: {
            value: Math.random(),
          }
        }
      );
      // span.setStatus({ code: api.SpanStatusCode.OK });
      console.log(res.statusText);
    } catch (e) {
      console.log(`Data generation failed: ${e}`);
      // span.setStatus({ code: api.SpanStatusCode.ERROR, message: e.message });
    }
    // span.end();
  // })
}
