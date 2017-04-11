import moment from "moment";
import Promise from 'bluebird';

export function party_types(args, context, graphql) {
    return context.db.any("select id, description from party_type");
}

export function party_role_types(args, context, graphql) {
    return context.party_types.entries.map(e => ({
        id: e.value,
        description: e.key
    }))
}

export function create_visitor(args, context, graphql) {
    let new_visitor = args.new_visitor;
    let party_query = context.db.one("insert into party (first_name, last_name, name, party_type_id) values( $1, $2, $3, $4) returning id", [new_visitor.first_name, new_visitor.last_name, new_visitor.name, new_visitor.party_type_id]);

    let contact_mechanism_query = context.db.one("insert into contact_mechanism ( end_point, contact_mechanism_type_id) values( $1, $2) returning id", [new_visitor.email, context.contact_mechanism_types.get("Email Address")]);

    return Promise.join(party_query, contact_mechanism_query, (party_id, contact_mechanism_id) =>
            context.db.one("insert into party_contact_mechanism (party_id, contact_mechanism_id) values ($1, $2 ) returning id", [party_id.id, contact_mechanism_id.id])
            .then(party_contact_mechanism_id => context.db.one("insert into party_role( party_role_type_id, party_id) values($1, $2) returning id", [context.party_role_types.get("Visitor"), party_id.id]))
          .then(visitor_role_id => ({party_id: party_id.id, visitor_role_id: visitor_role_id.id})));


}
