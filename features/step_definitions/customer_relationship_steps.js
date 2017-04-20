import moment from "moment";
import gql from 'graphql-tag';
import 'isomorphic-fetch';
var {
    defineSupportCode
} = require('cucumber');

defineSupportCode(function({
    Given,
    When,
    Then
}) {
    Given("an organziation name of {stringInDoubleQuotes}", function(organization_name) {
        return this.db.one("insert into party (name, party_type_id) values ($1, $2) returning id", [organization_name, this.party_type_id("Organization")])
            .then(data => this.organization.id = data.id)
    });

    Given('the organization has a role of {stringInDoubleQuotes}', function(role) {
        return this.db.one("insert into party_role ( party_role_type_id, party_id) values ($1, $2) returning id", [this.party_role_type(role), this.organization.id])
            .then(data => this.organization.roles.push({
                id: data.id,
                description: role
            }));
    });

    Given('I have provided a first name as {stringInDoubleQuotes}', function(first_name, callback) {
        this.person.first_name = first_name;
        callback();
    });

    Given('I have provided a last name as {stringInDoubleQuotes}', function(last_name, callback) {
        this.person.last_name = last_name;
        callback();
    });
    Given('I have provided an email {stringInDoubleQuotes}', function(email, callback) {
        this.person.email_address = email;
        callback();
    });
    Given('I have provided a relationship status of {stringInDoubleQuotes}', function(relationship_status, callback) {
        this.relationship.status.description = relationship_status
        callback();
    });

    When('I create the customer', function() {
        return this.client.mutate({
            mutation: gql `mutation create_customer($new_customer: NewCustomer!) {
                            create_customer(new_customer: $new_customer) {
                              party_id
                              contact_mechanism_id
                              party_role_id
                              party_contact_mechanism_id
                              party_relationship_id
                            }
                          }`,
            variables: {
                "new_customer": {
                    "party": {
                        "first_name": "Chester",
                        "last_name": "Tester",
                        "party_type_id": "1d92f862-4020-4b0e-9464-fad1b79ff357"
                    },
                    "email": {
                        "email_address": "chester@tester.com"
                    },
                    "internal_organization_id": this.organization.roles.find( r => r.description === 'Internal Organization').id,
                    "relationship_status": "Customers"
                }
            }
        })
        .then(result => this.result.data = result.data);
    });
    Then('the person data will be in the database', function(callback) {
        expect(this.result.data).to.be.ok;
        expect(this.result.data.create_customer).to.be.ok;
        expect(this.result.data.create_customer.party_id).to.be.ok;
        expect(this.result.data.create_customer.contact_mechanism_id).to.be.ok;
        expect(this.result.data.create_customer.party_relationship_id).to.be.ok;
        callback();
    });

    Then('the person will have a customer relationship with the internal organization', function(callback) {
        this.db.one(`select
            	( select description
                 from party_relationship_type
                 where pr.party_relationship_type_id = party_relationship_type.id) as relationship_type,
            	( select party.name
                 	from party, party_role
                 	where pr.from_party_role_id = party_role.id
                	and party_role.party_id = party.id) as from_role,
            	( select party.last_name
                 	from party, party_role
                 	where pr.to_party_role_id = party_role.id
                	and party_role.party_id = party.id) as to_role,
            	pr.from_date,
            	pr.thru_date,
            	pr.comment
            from
            	party_relationship as pr
            order by
            	relationship_type,
            	pr.from_date,
            	pr.thru_date`)
              .then(data => {
                expect( data.relationship_type).to.be.equal("Customer Relationship");
                expect( data.from_role).to.be.equal("Acme Inc.");
                expect( data.to_role).to.be.equal("Tester");
                expect( data.from_date).to.be.ok;
                expect( data.thru_date).to.not.be.ok;
                expect(data.comment).to.not.be.ok;
                callback();
              })
              .catch( response => callback(response));
    });

});
