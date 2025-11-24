/// <reference types="cypress" />

import { login } from "./login";

/**
 * Custom command to login to the application
 * @example cy.login()
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to perform login
       * Uses credentials from environment variables
       */
      login(): Chainable<void>;
      
      /**
       * Custom command to logout
       */
      logout(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", login);

Cypress.Commands.add("logout", () => {
  cy.get(".oxd-userdropdown-tab").should("be.visible").click();
  cy.get(".oxd-userdropdown-link")
    .contains("Logout")
    .should("be.visible")
    .click();
  cy.url().should("include", "/auth/login");
});