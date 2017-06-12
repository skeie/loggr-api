const {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
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
            description: 'users name'
        }
    },
});

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'Users',
    fields: {
        user: {
            type: userType,
            resolve: () =>
                new Promise(resolve => {
                    console.log('hit?');
                    resolve({
                        id: '1337',
                        name: 'lol'
                    });
                }),
        },
    },
});

const schema = new GraphQLSchema({
    query: queryType,
});

module.exports = schema;
