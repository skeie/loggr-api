const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt,
} = require('graphql');

const userType = require('../users/userQL');
const UserService = require('../users/userService');
const userService = new UserService();

const highscoreType = require('../highscore/highscoreQL');
const HighscoreService = require('../highscore/highscoreService');
const highscoreService = new HighscoreService();

const imageType = require('../images/imageQL');
const ImageService = require('../images/imageService');
const imageService = new ImageService();

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The father of all data',
    fields: {
        updateWeeklyTraning: {
            type: GraphQLInt,
            args: {
                weeklyTraining: {
                    type: GraphQLInt,
                    description:
                        'number of times a user should train wihtin a week',
                },
            },
            resolve: (_, args, { user }) =>
                userService.updateUser(user.id, args),
        },
    },
});

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
        unseenImage: {
            type: imageType,
            resolve: (parentValue, args, request) =>
                imageService.getUnSeenImage(request),
        },
    },
});

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation,
});

module.exports = schema;