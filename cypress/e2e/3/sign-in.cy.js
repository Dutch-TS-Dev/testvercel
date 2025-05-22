/// <reference types="cypress" />

describe("sign in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("log in with password", () => {
    cy.intercept("POST", "http://localhost:3000/api/auth/session").as(
      "loginRequest"
    );

    cy.get(".ion-ios-navicon").click();
    cy.get('a[href="#register"]').click();
    cy.get("input#register-email").click().type("oscar.vanvelsen@gmail.com");
    cy.get("input#register-password").click().type("222222");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest").then((interception) => {
      const body = interception.response.body;

      // Assert top-level properties
      expect(body).to.have.property("user");
      expect(body).to.have.property("expires");

      // Assert nested user properties
      expect(body.user).to.include.all.keys(
        "name",
        "email",
        "image",
        "id",
        "emailVerified"
      );

      // You can also check specific values if needed
      expect(body.user.emailVerified).to.be.true;
      expect(body.user.name).to.be.a("string");
      expect(body.user.id).to.match(/^[a-zA-Z0-9]+$/); // Example format check
    });
  });
});
