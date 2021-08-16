This project represents the last part of my training as a junior web developer. I created the frontend and the backend (fullstack)

Instructions
Prerequisite:
* install, configure and run mysql (development)

Backend: (/backend)
* go to backend directory
* create a folder called 'images' : mkdir images
* npm install -g sequelize sequelize-cli
* install all depedencies : npm install
* configure the credentials in a .env file in /backend (cf. dotenv):
    - RANDOM_TOKEN_SECRET=secret_for_token_generation
    - EMAIL_KEY_SECRET=secret_for_email_encryption
    - COOKIE_KEY_SECRET=secret_for_cookie_encryption
    - DB_USER=username_of_the_db
    - DB_HOST=address_of_the_host
    - DB_PASSWORD=password_to_access_the_database
    - DB_DEVELOPMENT_NAME=database_development_name
    - DB_TEST_NAME=database_test_name
    - DB_PRODUCTION_NAME=database_production_name
    - PORT=7000
* create the tables     : sequelize db:create
* Migrate the tables    : sequelize db:migrate
* Populate the tables with fake data : npx sequelize-cli db:seed:all
    - users informations : in the seeders forlder (...-demo-users.js)
* start the server      : nodemon server ( or node server)

Frontend: (/frontend)
* go to frontend directory : cd frontend
* install all depedencies : npm install
* start the project : npm start
* if your browser doesn't open itself, go to http://localhost:3000/

Development in progress ...