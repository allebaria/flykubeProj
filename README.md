# Node js simple API Rest

## Brief

Node js API Rest with three models: Users, Products and Invoices. Using its endpoints, one can create, delete or get instances of them. For the get endpoints, it is possible to retreive all instances of one model (get Users) as well as a specified one by id (get User with id = 1).

Initialization command lines:

 * `npm start`--> Run the server.
 * `npm run dev` --> Run the server in development mode.
 * `npm test` --> Execute tests and view results in terminal.

The endpoints that have been created are the following:

  ### Health
  
  * `get localhost:8080/api/health`--> Check if server is 'UP'.

  ### Users

  * `get localhost:8080/api/v1/users`--> Retreive all users
  
  * `get localhost:8080/api/v1/users/:id`--> Retreive user with a specified id
  
  * `post localhost:8080/api/v1/users`--> Create a new user
  
     |   Parameter   | Required |  Type  |  Description  |
     | ------------- | ------------- | ------------- | ------------- |
     | name | Yes |  String  |  User's name  |  
     | email | Yes |  String  |  User's email (must be unique)  |  
     | gender | Yes |  String  |  User's gender. Must be 'female' or 'male'  |  
     | age | Yes |  Integer  |  User's age  |
     
  * `delete localhost:8080/api/v1/users/:id`--> Delete user with a specified id
  
  ### Products
  
  * `get localhost:8080/api/v1/products`--> Retreive all products
  
  * `get localhost:8080/api/v1/products/:id`--> Retreive product with a specified id
  
  * `post localhost:8080/api/v1/products`--> Create a new product
  
     |   Parameter   | Required |  Type  |  Description  |
     | ------------- | ------------- | ------------- | ------------- |
     | name | Yes |  String  |  Product's name  |  
     | category | Yes |  String  |  Product's category  |  
     | price | Yes |  Float  |  Product's price  |  
     | description | Yes |  Text  |  Prouct's description  |
     
  * `delete localhost:8080/api/v1/products/:id`--> Delete product with a specified id
  
  ### Invoices
    
  * `get localhost:8080/api/v1/invoices/:id`--> Retreive invoice with a specified id
  
  * `post localhost:8080/api/v1/invoices`--> Create a new invoice
  
     |   Parameter   | Required |  Type  |  Description  |
     | ------------- | ------------- | ------------- | ------------- |
     | user_id | Yes |  String  |  Id corresponding to the user that has carried out the purchase  |  
     | product_id | Yes |  String  |  Id corresponding to the product that has been purchased  |  
     
  * `delete localhost:8080/api/v1/invoices/:id`--> Delete invoice with a specified id
  
## Requirements

It is required to provide some process environtment variables. They must be stablished in a file named config.env inside `/src/api/config`folder. It must contain the following variables:

```
PORT = 8080
ENV = development

DB_HOST_DEV =
DB_USER_DEV =
DB_PASSWORD_DEV =
DB_NAME_DEV =
DB_DIALECT_DEV = postgres

DB_HOST_PROD =
DB_USER_PROD =
DB_PASSWORD_PROD =
DB_NAME_PROD =
DB_DIALECT_PROD = postgres
```
Production env variables are not mandatory. Instead, it is recommended to only fill dev variables when checking the API behavior. A postgres database with the models corresponding schema must be created and fill the environment variables according to it (host, user, password and name).

To avoid creating new tables, primarey keys and foreign keys, you can import the example schema provided inside the utils folder into your postgres db. 

## Design Pattern

This software is created using an MVC design pattern. Besides, it has been implemented with a versioning strategy in order to create a more scalable software. Therefore, each version will contain its own models and controllers. Folder structure is hence like to the one below: 

```
.
├── src
│    ├── api                        # Main api files (routes, controllers, models, versions...)                       
│        ├── routes                 # Main api routes
│             ├── index.js          # Gathers versions' base routes and defines health endpoint                    
│        ├── services               # Service files (third party APIs, microservices etc.)
│        ├── v1                     # Version one folder
│            ├── controllers        # Version one controllers
│            ├── models             # Version one models
│            ├── routes             # Version one routes
│                 ├── index.js      # Defines the routes for version one and assignes each one to a controller function
│        ├── health.ts              # API health 'controller'
│        └── ...                    # Other version folders and/or further considerations
│     ├── config                    # Configuration files
│         └── ...                   # Sequelize database config, config.env (env variables)...
│     ├── app.ts                    # Main app file that initializes de server
│     └── ...                       # Further considerations
├── test                            # Test files
└── ...                             # Node modules, gitignore, nodemon.js etc.
```

Furthermore, the API is prepared to be written in type script for better readability and scalability. 

## Dependencies and technologies used

Although dependencies can be seen in the package.json file, below one can finde the most remarkables:

 * `express`: Routes and server for node js.
 * `express-validator`: Validate endpoints parameters (query or body params).
 * `sequelize`: Javascript ORM to ease the MVC architecure development.
 * `dotenv`: Load all the environment variables inside the config.env file.
 * `mocha`, `chai`, `chai-http`and `sinon`: JS test libraries.
 * `typescript`, `tslint`, `ts-node`: Typescript libraries.
 * `nodemon`: Reload server when saving modified changes in development environment.
 * Others... (check package.json)
 
