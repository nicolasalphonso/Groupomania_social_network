This project represents the last part of my training as a junior web developer. I created the frontend and the backend (fullstack)

Instructions
Backend: (/backend)
* install, configure and run mysql
* install all depedencies : npm install
* configure the credentials in a .env file in /backend (cf. dotenv):
    - RANDOM_TOKEN_SECRET : secret for token generation
    - EMAIL_KEY_SECRET : secret for email encryption
    - COOKIE_KEY_SECRET : secret for cookie encryption
    - DB_USER : username of the db
    - DB_HOST : address of the host
    - DB_PASSWORD : password to access the database
    - DB_DEVELOPMENT_NAME : database development name
    - DB_TEST_NAME : database test name
    - DB_PRODUCTION_NAME : database production name
* create the tables     : sequelize db:create
* Migrate the tables    : sequelize db:migrate
* Populate the tables with fake data : npx sequelize-cli db:seed:all
    - users informations : in the seeders forlder (...-demo-users.js)
* start the server      : nodemon server ( or node server)

Frontend: (/frontend)
* install all depedencies : npm install
* start the project : npm start
* if your browser doesn't open itself, go to http://localhost:3000/

Development in progress ...