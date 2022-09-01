require("dotenv").config();
import { loadFilesSync } from "@graphql-tools/load-files";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";

import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import path from "path";

import { connectDB } from "./db";
import * as models from "./models";
import { verifyToken } from "./utils/jwt";
import routes from "./routes";

const typeFiles = loadFilesSync(path.join(__dirname, "./types"));
const resolverFiles = loadFilesSync(path.join(__dirname, "./resolvers"));

const typeDefs = mergeTypeDefs(typeFiles);
const resolvers = mergeResolvers(resolverFiles);

AdminJS.registerAdapter(AdminJSMongoose);

async function startApolloServer(typeDefs, resolvers) {
  const db = await connectDB();
  const app = express();

  if (process.env.NODE_ENV !== "production") {
    const adminJs = new AdminJS({
      databases: [db],
      rootPath: "/admin",
    });
    const router = AdminJSExpress.buildRouter(adminJs);

    app.use(routes);
    app.use(adminJs.options.rootPath, router);
  }

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault({ embed: true })
        : ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: ({ req }) => {
      const { userId } = req.headers.token
        ? verifyToken(req.headers.token)
        : { userId: null };
      return { models, userId };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
