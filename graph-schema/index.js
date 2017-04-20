import {
    buildSchema
} from 'graphql';

import {
    create_customer,
    party_types,
    party_role_types
} from "./resolvers";

var schema = buildSchema(`
  type DynamicType {
    id: ID!,
    description: String!
  }

  type Customer {
    party_id: String!,
    contact_mechanism_id: String!,
    party_role_id: String!,
    party_contact_mechanism_id: String!,
    party_relationship_id: String!,    
  }

  input NewParty {
    first_name: String,
    last_name: String,
    title: String,
    date_of_birth: String,
    comment: String,
    name: String,
    party_type_id: String!
  }

  input NewEmailAddress{
    email_address: String!
  }

  input NewCustomer {
      party: NewParty!,
      email: NewEmailAddress!,
      internal_organization_id: ID!,
      relationship_status: String!
  }


type Mutation {
  create_customer( new_customer: NewCustomer!) : Customer!
}

type Query {
    party_types: [DynamicType]
    party_role_types : [DynamicType]
  }
`);

var root = {
    create_customer,
    party_types,
    party_role_types
};

export {
    schema,
    root
};
