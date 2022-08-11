import * as GraphQL from 'graphql';

export const State = new GraphQL.GraphQLObjectType({
  name: 'State',
  fields: {
    nome: { type: GraphQL.GraphQLString },
    sobrenome: { type: GraphQL.GraphQLString }
  }
});