/**
 * Wait for PM2 server to be ready before running tests
 */
export async function waitForServer(url: string, timeout = 30000): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) {
        console.log(`✅ Server ready at ${url}`);
        return;
      }
    } catch (error) {
      // Server not ready yet, wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error(`Server not ready after ${timeout}ms`);
}

export async function checkWebSocketServer(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(url.replace('http', 'ws') + '/ws');
      
      ws.onopen = () => {
        console.log(`✅ WebSocket server ready`);
        ws.close();
        resolve(true);
      };
      
      ws.onerror = () => {
        resolve(false);
      };
      
      setTimeout(() => {
        ws.close();
        resolve(false);
      }, 5000);
    } catch {
      resolve(false);
    }
  });
}
