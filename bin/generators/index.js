module.exports = function (plop) {
  plop.setGenerator("templates", {
    description: "What component are you creating?",
    prompts: [
      {
        type: "list",
        name: "type",
        choices: ["graphql_model"],
      },
      {
        type: "input",
        name: "name",
        message: "What is the name of the model?",
      },
    ],
    actions: (data) => {
      const modelActions = [
        {
          type: "add",
          path: "../../models/{{camelCase name}}.js",
          templateFile: "./templates/Model.hbs",
        },
        {
          type: "add",
          path: "../../types/{{camelCase name}}.gql",
          templateFile: "./templates/Type.hbs",
        },
        {
          type: "add",
          path: "../../resolvers/{{camelCase name}}.js",
          templateFile: "./templates/Resolver.hbs",
        },
        {
          type: "append",
          template:
            'export {default as {{properCase name}} } from "./{{camelCase name}}"',
          pattern: /\/\* ======= generated-imports ================ \*\//,
          path: "../../models/index.js",
        },
      ];

      return data.type === "graphql_model" ? modelActions : [];
    },
  });
};
