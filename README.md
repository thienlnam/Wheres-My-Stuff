# Capstone Inventory App

[![GitHub Super-Linter](https://github.com/<OWNER>/<REPOSITORY>/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

Where's My Stuff? Voice controlled Inventory Application
Capstone project for group 24


## Installation and local development

To run this app locally, you'll need to have React installed.  Follow the steps to get it downloaded on [Windows](https://makandracards.com/reactjs-quick/52419-install-reactjs-windows) or [Mac](https://medium.com/@arunkrsoam/install-react-js-on-mac-7cffe8bda2ac).  

After you've completed that, run `npm install` to install dependencies and then run `npm start` to bring up the app.  Saving changes should refresh the app automatically.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).


## Database Setup

MySQL workbench is useful in executing queries and managing the database.

To setup the database, download [mysql server](https://dev.mysql.com/downloads/mysql/) and create a new server and import the Schema.sql file for the database setup.

For test data, import and run the sampleData sql file to execute the query.


## Backend Server Setup

The backend is an Express run Node server.

To run the server, navigate into the api directory with `cd api`.

From there run `npm install` to get all necessary dependencies

Run `npm start` to start the server, which will be hosted at localhost:9000.