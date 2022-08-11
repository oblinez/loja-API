import * as GraphQL from 'graphql';

import { stateQueries } from './routes/state.routes';


export class Routes {

  public getQueries() {
    const queries = new GraphQL.GraphQLObjectType({
      name: 'Query',
      fields: {
        ...stateQueries(),
      }
    })

    return queries
  }

  public getMutations() {
    const mutations = new GraphQL.GraphQLObjectType({
      name: 'Mutation',
      fields: {
      }
    })

    return mutations
  }

  public getRoutes() {
    return new GraphQL.GraphQLSchema({
      query: this.getQueries(),
      //mutation: this.getMutations()
    });
  }
}
