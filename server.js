var express = require('express');
import jwt from "jsonwebtoken";
import graphqlHttp from "express-graphql";

import config from "./config";
import db from "./database";
import {
    schema,
    root
} from "./graph-schema";

const app = express();
let party_role_types = new Map();
let contact_mechanism_types = new Map();

db.any("select id, description from party_role_type")
  .then( list => list.forEach( l => party_role_types.set (l.description, l.id)));

db.any("select id, description from contact_mechanism_type")
  .then( list => list.forEach( l => contact_mechanism_types.set (l.description, l.id)));


app.use('/', graphqlHttp((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: config.graphql.graphiql,
    context: {
      contact_mechanism_types,
      db,
      party_role_types,
      req
    }
})));

app.listen(config.server.port, () => console.log('%s listening at %s', config.server.name, config.server.url));
