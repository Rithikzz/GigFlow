import http from 'http';
import { getConfig } from './config/env.js';
import { startApp } from './app.js';

async function bootstrap(): Promise<void> {
  const config = getConfig();

  try {
    const app = await startApp();

    const server = http.createServer(app);

    server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      console.error('Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

bootstrap();
