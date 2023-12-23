const opentelemetry = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { KafkaJsInstrumentation } = require('opentelemetry-instrumentation-kafkajs');
const { Resource } = require('@opentelemetry/resources')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL)

const sdk = new opentelemetry.NodeSDK({
  // traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
  traceExporter: new CollectorTraceExporter({
    url: 'http://otel-collector:4318/v1/trace'
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new KafkaJsInstrumentation(),
  ],
})


sdk.start()
