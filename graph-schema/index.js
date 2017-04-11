import {
    buildSchema
} from 'graphql';

import {
    create_visitor,
    party_types,
    party_role_types
} from "./resolvers";

var schema = buildSchema(`
  type PartyType {
    id: ID!,
    description: String!
  }

  type PartyRoleType {
    id: ID!,
    description: String!
  }

  type PartyRole {
    id: ID!,
    from_date: String!,
    thru_date: String,
    party_role: String
  }

  type ContactMechanism {
    id: ID!,
    from_date: String,
    thru_date: String,
    do_not_solicit_indicator: Boolean,
    comment: String,
    end_point: String,
    contact_mechanism_type: String
  }

  type PartyVisitor {
    party_id: String!,
    visitor_role_id: String!
  }

  input NewVisitor {
      first_name: String,
      last_name: String,
      name: String,
      email: String!,
      party_type_id: String!
  }

type Mutation {
  create_visitor( new_visitor: NewVisitor!) : PartyVisitor
}

type Query {
    party_types: [PartyType]
    party_role_types : [PartyRoleType]
  }
`);

var root = {
    create_visitor,
    party_types,
    party_role_types
};

export {
    schema,
    root
};
