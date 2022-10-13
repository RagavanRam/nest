import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.USERNAME,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: +process.env.PORT,
  synchronize: true,
  entities: ['dist/src/**/*.entity{.ts.js}'],
  autoLoadEntities: true,
};
