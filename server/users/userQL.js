const {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
} = require('graphql');

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

module.exports = userType;
