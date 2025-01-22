import { Injectable } from '@nestjs/common';
import { CustomConfigService } from './config';

@Injectable()
export class AppService {
  constructor(private readonly config: CustomConfigService) {}
  getHello(): string {
    const config = this.config;
    const returnConfig = {
      port: config.port,
      host: config.host,
      databaseUri: config.databaseUri,
      jwtSecret: config.jwtSecret,
      jwtExpiresIn: config.jwtExpiresIn,
      email: config.email,
      emailPassword: config.emailPassword,
      hashSalt: config.hashSalt,
    };

    if (config.isDevelopment) {
      return JSON.stringify(returnConfig);
    }

    return 'Hello World!';
  }
}
