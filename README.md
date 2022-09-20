# Server for a Store App
## John Smilga's (AKA: Coding Addict) course on Node.js and Express.js
- [node-express-course repo](https://github.com/john-smilga/node-express-course)
- [Youtube Video: Node.js Projects](https://www.youtube.com/watch?v=rltfdjcXjmk&list=PLqdjyefATy9tT_XIhljRB8tyfSmTTfQp3&index=1)
- [Youtube Video: Node and Express Tutorial](https://www.youtube.com/watch?v=TNV0_7QRDwY)

## Description
In this course, John Smilga shows how to build servers and apps using Node.js and Express.js.

For the second project, there was no front-end created for this app. Our task was to build a server in Node and Express to route the logic for the site. We also used MongoDB and Mongoose to handle the database for the project.

## Structure
app.js initiates the server on the port after awaiting the connection to the database. It also the combines the routes and middleware.

In the controllers folder, the middleware is defined in products.js for the logic of the app.

In the db folder, Mongoose is used in a function to connect to the database.

In the middleware folder, two .js files contain some widdleware to be used in the app.
- error-handler.js: Contains a function, errorHandlerMiddleware, which defines the error responses based on the input. If the databse _id property is a valid id, but not found in the database, the response is our custom response message from custom-error.js. Else, the response message is a 500 status code error.
- not-found.js: This constains a function, notFound, which sends a 404 error message if the user tries to go to a route that does not exist.

In the models folder, product.js utilizes Mongoose to define the schema for the data added to MongoDB, which contain "name", "price", "featured", "rating', "createdAt", and "company" properties.

In the routes folder, products.js imports the controller functions for each route and assigns them to the HTTP method for the app.
