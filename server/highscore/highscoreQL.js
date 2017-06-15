const {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
} = require('graphql');

const highscoreType = new GraphQLObjectType({
    name: 'highscore',
    fields: {
        userid: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString,
        },
        image: {
            type: GraphQLString,
        },
        highscore: {
            type: GraphQLInt,
        },
    },
});

const highscoreQL = new GraphQLObjectType({
    name: 'highscores',
    description: `Every users highscore`,
    fields: {
        position: {
            type: GraphQLString,
            description: `User's current position`,
        },
        highscore: {
            type: GraphQLInt,
            description: `User's current highscore`,
        },
        highscores: {
            type: new GraphQLList(highscoreType),
            description: 'top list of highscore',
        },
    },
});

module.exports = highscoreQL;
