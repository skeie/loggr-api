const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLSchema,
    graphQLObject,
} = require('graphql');

const userType = require('../users/userQL');
const UserService = require('../users/userService');
const userService = new UserService();

const highscoreType = require('../highscore/highscoreQL');
const HighscoreService = require('../highscore/highscoreService');
const highscoreService = new HighscoreService();

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    description: 'the mother of all queries',
    fields: {
        users: {
            type: new GraphQLList(userType),
            resolve: userService.getAllUsers,
        },
        user: {
            type: userType,
            resolve: userService.getAllUserz,
        },
        highscore: {
            type: highscoreType,
            resolve: (parentValue, args, request) =>
                highscoreService.getAll(request),
        },
    },
});

const schema = new GraphQLSchema({
    query: rootQuery,
});

module.exports = schema;
