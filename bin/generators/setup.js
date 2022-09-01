module.exports = function (plop) {
  plop.setGenerator("templates", {
    description: "What component are you creating?",
    prompts: [
      {
        type: "input",
        name: "mongoUrl",
        message: "What is the name of the model?",
        default: "mongodb://localhost:27017",
      },
      {
        type: "input",
        name: "dbName",
        message: "What do your want to name your database?",
        default: "api-dev",
      },
      {
        type: "input",
        name: "secret",
        message: "Enter an encryption secret...",
        default: "some-secure-string",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./.env",
        templateFile: "./templates/Env.hbs",
      },
    ],
  });
};
