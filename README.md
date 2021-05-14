# Where's My Stuff?
Where's My Stuff? Voice controlled Inventory Application
Capstone project for group 24

Where's My Stuff is an web-based inventory application that also contains voice handling for updating item quantities or asking for part locations.

Features:
- Create new parts and containers
- Store parts in containers and update their quantity
- Edit / modify part names and container details
- Voice Commands:
  - Ask where specific parts are
  - Asking for parts inside a container
  - Updating part quantity in a container
  - Increment/Decrement part quantity in a container


## Installation and local development

To run this app locally, you'll need to have React installed.  Follow the steps to get it downloaded on [Windows](https://makandracards.com/reactjs-quick/52419-install-reactjs-windows) or [Mac](https://medium.com/@arunkrsoam/install-react-js-on-mac-7cffe8bda2ac).  

You will also need to install Nodejs for access to the `npm` commands. This can be downloaded [Here](https://www.npmjs.com/get-npm).

After you've completed that, run `npm install` to install dependencies and then run `npm start` to bring up the app.  Saving changes should refresh the app automatically.


### Database Setup

MySQL workbench is useful in executing queries and managing the database.

When initializing the database, I had to select 'Use Legacy Password Encryption' to get it to work.

To setup the database, download [mysql server](https://dev.mysql.com/downloads/mysql/) and create a new server and import the Schema.sql file for the database setup.

For test data, import and run the sampleData sql file to execute the query.

The sql files to run for setting up the database are located inside `/api/Database`

### Setting up local configuration variables

For storing secret passwords and configurations, we will be storing them in a .env file.  Create a .env file in the root directory of the project.  Copy over the variables from the .env.example and replace them with your local configuration settings.

### Backend Server Setup

The backend is an Express run Node server.

To run the server, navigate into the api directory with `cd api`.

From there run `npm install` to get all necessary dependencies

Run `npm run dev` to start the development server, which will automatically refresh your changes after they get saved.

Run `npm start` to start the server, which will be hosted at localhost:9000 or the port speciified in the .env file.

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
