import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { MeterProvider } from '@opentelemetry/metrics'
import { NodeTracerProvider } from '@opentelemetry/node'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { SimpleSpanProcessor } from '@opentelemetry/tracing'
import opentelemetry from '@opentelemetry/api'

const tracer = (serviceName: string) => {
	const provider = new NodeTracerProvider({
		plugins: {
			grpc: {
				enabled: true,
				path: '@opentelemetry/plugin-grpc'
			}
		}
	})

	const exporter = new JaegerExporter({
		serviceName
	})

	const meterProvider = new MeterProvider({
		// The Prometheus exporter runs an HTTP server which
		// the Prometheus backend scrapes to collect metrics.
		exporter: new PrometheusExporter({ startServer: true }),
		interval: 1000
	})

	provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

	/**
	 * Registering the provider with the API allows it to be discovered
	 * and used by instrumentation libraries. The OpenTelemetry API provides
	 * methods to set global SDK implementations, but the default SDK provides
	 * a convenience method named `register` which registers same defaults
	 * for you.
	 *
	 * By default the NodeTracerProvider uses Trace Context for propagation
	 * and AsyncHooksScopeManager for context management. To learn about
	 * customizing this behavior, see API Registration Options below.
	 */
	provider.register()

	/**
	 * Registering the provider with the API allows it to be discovered
	 * and used by instrumentation libraries.
	 */
	opentelemetry.metrics.setGlobalMeterProvider(meterProvider)

	return opentelemetry.trace.getTracer('service:gateway')
}

export default tracer
