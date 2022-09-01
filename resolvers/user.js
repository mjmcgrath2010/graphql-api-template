import { ApolloError } from "apollo-server-express";

const UserResolver = {
  Mutation: {
    addUser: async (_, { payload }, { models }) => {
      try {
        const user = await models.User.create(payload);
        const token = await user.validPassword(payload.password);
        return token;
      } catch (e) {
        return e;
      }
    },
    login: async (_, { payload: { email, password } }, { models }) => {
      try {
        const user = await models.User.findOne({ email });
        const token = await user.validPassword(password);

        return token ? token : new ApolloError("Invalid credentials.");
      } catch (e) {
        return new ApolloError("Whoops, something went wrong.");
      }
    },
  },
  Query: {
    getUsers: async (_, __, { models, userId }) =>
      await models.User.find({ _id: userId }),
    me: async (_, __, { models, userId }) =>
      await models.User.findOne({ _id: userId }),
  },
};

export default UserResolver;
