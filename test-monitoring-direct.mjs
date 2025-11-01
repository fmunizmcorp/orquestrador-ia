import { systemMonitorService } from './dist/server/services/systemMonitorService.js';

console.log('Testing systemMonitorService...');
console.log('Type:', typeof systemMonitorService);
console.log('Methods:', Object.keys(systemMonitorService));

try {
  const metrics = await systemMonitorService.getMetrics();
  console.log('Metrics:', JSON.stringify(metrics, null, 2));
} catch (error) {
  console.error('ERROR:', error);
}
