const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description:
        "Production Ready URL Management Platform",
    },

    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec =
  swaggerJsDoc(options);

module.exports = swaggerSpec;