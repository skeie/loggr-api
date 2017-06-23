const {
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
} = require('graphql');

const unSeenImageType = new GraphQLObjectType({
    name: 'UnSeenImages',
    description: 'unSeen images user needs to approve or not',
    fields: {
        url: {
            type: GraphQLString,
            description: 'url of the image',
        },
        image: {
            type: GraphQLString,
            description: `user's image`,
        },
        id: {
            type: GraphQLString,
            description: 'image id',
        },
    },
});

const imageType = new GraphQLObjectType({
    name: 'TrainingImages',
    description: 'Picture users have taken of traning',
    fields: {
        numberOfImages: {
            type: GraphQLInt,
            description: 'Number of approved exercises this week',
        },
        images: {
            type: new GraphQLList(unSeenImageType),
            description: 'number of images to approve',
        },
    },
});

module.exports = imageType;
