
  
## Description  
  
App running with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.  
  
## Installation  
  
```bash  
$ yarn
```  
  
## Running the app  
  
  Start container :
  ```bash
  docker-compose up -d
  ```
  then :
```bash  
# development  
$ yarn start  
  
# watch mode  
$ yarn start:dev  
  
# production mode  
$ yarn start:prod  
```  
  
## Migration

  Mamimomo database is create on the first docker-compose execution. You do not need to create db.
  
  To start with a good database you can run this :
  ```bash
  yarn typeorm migration:run
  ```

  If you need to generate a new migration after entity change you can run :
  ````bash
yarn typeorm migration:generate -n <migration-name>
  ````

If you need to revert the last migration :
```bash
yarn typeorm migration:revert
```
  You can check what does this command in your package.json. 
  You can discover more command with ```yarn typeorm ```
  
  ⚠️ You need to build ts to js before the migration.
    ```
    yarn build
    ```️
then you can run ```yarn migration:run```
## Seed
After migration you can create some fake data to start developing :
```bash
yarn seed:run
```
⚠️ You need to build ts to js before the seed.
If you need to write some seeders :

The idea was that the seeds should be isolated and run one use case like createAdminUserWithPets.seed.ts. With that we do not need any ordering.

## Connection and JWT
Authentication system works with JWT. We using passport.js to handle authentication. 
- [x] Request control is handle by passport jwt strategy. 
- [x] Simple connection is handle by passport localstrategy. (provide jwt with email and password) 
## Test  
  
```bash  
# unit tests  
$ npm run test  
  
# e2e tests  
$ npm run test:e2e  
  
# test coverage  
$ npm run test:cov  
```  

## Swagger
Find swagger-ui on http://localhost:8080/api/ 
  
## Support  
  
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).  
