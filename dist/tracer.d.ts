import { Tracer } from '@opentelemetry/api';
declare const tracer: (serviceName: string) => Tracer;
export default tracer;
