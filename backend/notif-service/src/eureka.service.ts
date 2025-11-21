import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment
const { Eureka } = require('eureka-js-client');

@Injectable()
export class EurekaService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  onModuleInit() {
    const APP_NAME = process.env.APP_NAME || 'nestjs-sample';
    const HOSTNAME = process.env.HOSTNAME || 'localhost';
    const PORT = parseInt(process.env.PORT || '3000', 10);

    // match Spring behavior: vipAddress = app name
    const VIP = APP_NAME;

    const EUREKA_HOST = process.env.EUREKA_HOST || '127.0.0.1';
    const EUREKA_PORT = parseInt(process.env.EUREKA_PORT || '8761', 10);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    this.client = new Eureka({
      instance: {
        app: APP_NAME,
        vipAddress: VIP,
        hostName: HOSTNAME,
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://${HOSTNAME}:${PORT}/info`,
        port: {
          $: PORT,
          '@enabled': true,
        },
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn',
        },
      },
      eureka: {
        host: EUREKA_HOST,
        port: EUREKA_PORT,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    this.client.start((error: any) => {
      if (error) console.error('Eureka registration failed:', error);
      else
        console.log(
          'Registered with Eureka server at',
          `${EUREKA_HOST}:${EUREKA_PORT}`,
        );
    });
  }

  onModuleDestroy() {
    if (this.client) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        this.client.stop();
        console.log('Unregistered from Eureka');
      } catch (err) {
        console.error('Error stopping Eureka client', err);
      }
    }
  }
}
