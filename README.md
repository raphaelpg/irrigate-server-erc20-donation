## Irrigate donation web app server  

Purpose:  
* Safely handle the registration and authentication of users  
* Deliver the database content to the client allowing CRUD operations  

Structure:  
* The app.ts file contains the main app and configuration of express, the server.ts file starts the app.  

* The project is structured with a router, controllers and services. Routes, controllers and services are divided into three categories, the users, the associations and the messages (handling messages from the contact form).  

* There are three middlewares, one for handleling the authentication, one to check the parameters of the http request received and an API rate limiter to avoid messages spamming and Ddos attacks.  

* The functions folder contains the token functions, the encryption functions and also the functions to connect to the MongoDB Atlas. The purpose here is to use dependency injection so it will be easy to change the external libraries in the future.   

* Then the mock and the tests folders are for tests.    


## Tests  

The routes are tested with Jest and Supertest with following coverage:  

93.28% Statements 333/357  
90% Branches 54/60  
96% Functions 72/75  
92.55% Lines 298/322  

You may increase the limits of the limiter middlewares in order to let the tests to be run properly.  


## Built With  

* [Node.js](https://nodejs.org/en/docs/) - Node.js is designed to build scalable network applications - v10.16.3  
* [Express](https://expressjs.com/en/4x/api.html) - Fast, unopinionated, minimalist web framework for Node.js - v4.16.4  
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - MongoDB Atlas is the global cloud database service for modern applications.  
* [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html) - By understanding JavaScript, TypeScript saves you time catching errors and providing fixes before you run code. - v4.2.3  
* [JWT](https://github.com/auth0/node-jsonwebtoken) - JSON Web Token (JWT) is a compact, URL-safe means of representing
   claims to be transferred between two parties. - v8.5.1  
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords. - v5.0.1  
* [Jest](https://jestjs.io/) - Jest is a delightful JavaScript Testing Framework with a focus on simplicity. - v26.6.3  
* [Supertest](https://github.com/visionmedia/supertest#readme) - Used to test the API routes. - v6.1.3  
* [PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) - Daemon process manager that will help you manage and keep your application online. - v4.5.5  
* [Rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) - Counts and limits number of actions by key and protects from DDoS and brute force attacks at any scale. - v2.2.1  


## Authors

* **Raphael Pinto Gregorio** - https://github.com/raphaelpg/


## License

[MIT](LICENSE)