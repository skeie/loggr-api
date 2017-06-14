const {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
} = require('graphql');

const Service = require('./userService');
const service = new Service();

const userType = new GraphQLObjectType({
    name: 'Users',
    description: 'Get all users',
    fields: {
        id: {
            type: GraphQLID,
            description: 'unique user id',
        },
        name: {
            type: GraphQLString,
            description: 'users name',
        },
        image: {
            type: GraphQLString,
            description: 'users image',
        },
        weeklyTraining: {
            type: GraphQLInt,
            description: 'number of trainings each week',
        },
        streak: {
            type: GraphQLInt,
            description: 'user current streak',
        },
        email: {
            type: GraphQLString,
            description: 'users email',
        },
    },
});

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Users',
    fields: {
        users: {
            type: new GraphQLList(userType),
            resolve: service.getAllUsers,
        },
        user: {
            type: userType,
            resolve: service.getAllUserz,
        },
    },
});

const schema = new GraphQLSchema({
    query: queryType,
});

module.exports = schema;
