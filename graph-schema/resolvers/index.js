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

export function create_customer(args, context, graphql) {
    let new_customer = args.new_customer;

    let contact_mechanism_insert = context.db.one("insert into contact_mechanism ( end_point, contact_mechanism_type_id) values( $1, $2) returning id", [new_customer.email, context.contact_mechanism_types.get("Email Address")]);

    let party_insert = context.db.one("insert into party (first_name, last_name, name, party_type_id) values( $1, $2, $3, $4) returning id", [new_customer.party.first_name, new_customer.party.last_name, new_customer.party.name, new_customer.party.party_type_id]);

    return Promise.all([party_insert, contact_mechanism_insert])
        .then(([party, contact_mechanism]) => {
            let party_contact_mechanism_insert = context.db.one("insert into party_contact_mechanism(party_id, contact_mechanism_id) values ( $1, $2 ) returning id", [party.id, contact_mechanism.id]);

            let party_role_insert = context.db.one("insert into party_role (party_id, party_role_type_id) values( $1, $2) returning id", [party.id, context.party_role_types.get("Customer")]);

            return Promise.all([party_contact_mechanism_insert,
                    party_role_insert
                ])
                .then(([party_contact_mechanism, party_role]) =>
                    Promise.all([party_contact_mechanism,
                        party_role,
                        context.db.one("insert into party_relationship( from_party_role_id, to_party_role_id, party_relationship_type_id, party_relationship_status_type_id) values( $1, $2, $3, $4) returning id", [
                            new_customer.internal_organization_id,
                            party_role.id,
                            context.party_relationship_types.get("Customer Relationship"),
                            context.party_relationship_status_types.get(new_customer.relationship_status)
                        ])
                    ]))
                .then(([party_contact_mechanism, party_role, party_relationship]) => ({
                    party_id: party.id,
                    contact_mechanism_id: contact_mechanism.id,
                    party_role_id: party_role.id,
                    party_contact_mechanism_id: party_contact_mechanism.id,
                    party_relationship_id: party_relationship.id
                }));
        });
}
