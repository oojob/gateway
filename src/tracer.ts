import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { NodeTracerProvider } from '@opentelemetry/node'
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

	provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
	provider.register()

	return opentelemetry.trace.getTracer('service:gateway')
}

export default tracer
