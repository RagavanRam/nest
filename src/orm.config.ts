import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: '',
  host: '127.0.0.1',
  password: '',
  database: 'back_end',
  port: 5432,
  synchronize: true,
  entities: ['dist/src/**/*.entity{.ts.js}'],
  autoLoadEntities: true,
};
