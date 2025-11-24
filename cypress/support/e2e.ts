/**
 * Global configuration and setup for e2e tests
 */

// Import commands
import "./commands";


beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();

  // Perform login
  cy.login();
});

/**
 * Handle uncaught exceptions
 */
Cypress.on("uncaught:exception", (err, runnable) => {
  // Ignore script errors that don't affect test execution
  if (err.message.includes("Script error.")) {
    return false;
  }

  // Ignore cross-origin errors
  if (err.message.includes("cross-origin")) {
    return false;
  }

  // Return false to prevent Cypress from failing the test
  // Return true to fail the test
  return false;
});

/**
 * Global configuration
 */
Cypress.on("window:before:load", (win) => {
  // Stub console methods to reduce noise in test output (optional)
  // win.console.warn = cy.stub();
  // win.console.error = cy.stub();
});
