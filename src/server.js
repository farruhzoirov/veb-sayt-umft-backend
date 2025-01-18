require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swagger = require("./swagger");
const cors = require("cors");
const app = express();

const routersList = require("./routers.js");

const config = require("./config/config.js");

const errorMiddleware = require("./middlewares/errors.middleware");

class Server {
  constructor() {
    this.useMiddleWares();
    this.addRoutes();
    this.listenServer().then();
  }

  useMiddleWares() {
    app.use("/uploads", express.static("uploads"));
    app.use(
        cors({
          origin: "*",
          methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          allowedHeaders: "Content-Type, Authorization",
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
  }

  addRoutes() {
    app.use(routersList);
    app.use(errorMiddleware);
    swagger(app);
  }

  async listenServer() {
    const server = async () => {
      try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("Database Connected");
        const httpServer = app.listen(config.APP_PORT, () => {
          console.log(`Server ${config.APP_PORT} is running...`);
        });

        const shutdown = () => {
          console.log("Shutting down gracefully...");
          httpServer.close(() => {
            console.log("Server closed. Exiting...");
            process.exit(0);
          });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
      } catch (e) {
        console.log(e);
      }
    };
    await server();
  }
}

new Server();
