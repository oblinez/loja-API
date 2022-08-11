import * as GraphQL from 'graphql';
import { State } from "../types/state.types";
import { StateController } from "../controllers/state.controller";

export function stateQueries() {
  const stateController = new StateController();

  return {
    productCatalog: {
      type: new GraphQL.GraphQLObjectType({
        name: 'getStateByCountryId',
        fields: {
          state: { type: GraphQL.GraphQLBoolean },
          msg: { type: GraphQL.GraphQLString },
          response: { type: GraphQL.GraphQLList(State) }
        },
      }),
      resolve: stateController.getStateByCountryId.bind(stateController)
    }
  }
}
