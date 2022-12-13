module.exports = {
  type: 'postgres',
  host: process.env.PGSQL_HOST,
  port: process.env.PGSQL_PORT || 2002,
  username: process.env.PGSQL_USER || 'mamimomo',
  password: process.env.PGSQL_ROOT_PASSWORD || 'password',
  database: process.env.PGSQl_DATABASE_NAME || 'mamimomo',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'prod',
  seeds: ['dist/**/database/seeds/**/*.seed.js'],
  factories: ['dist/**/database/factories/**/*.factory.js'],
  cli: {
    migrationsDir: 'migration',
  },
  migrations: ['dist/migration/*.js'],
};
