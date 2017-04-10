import {
    buildSchema
} from 'graphql';

import moment from "moment";

import database from "../database";

var schema = buildSchema(`
type Query {
    hello: String
  }
`);

var root ={ hello: () => 'Hello world!' };

export {
    schema,
    root
};
