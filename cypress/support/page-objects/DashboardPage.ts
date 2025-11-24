import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  visit(): this {
    cy.visit("/dashboard");
    return this;
  }

  verifyPageLoaded(): this {
    return this.verifyPageTitle("Dashboard");
  }
}