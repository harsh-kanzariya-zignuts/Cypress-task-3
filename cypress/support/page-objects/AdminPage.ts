import { BasePage } from "./BasePage";
import { setValue } from "../utils";

export interface AdminData {
  role: "Admin" | "ESS";
  employeeName: string;
  status: "Enabled" | "Disabled";
  username: string;
  password: string;
  confirmPassword: string;
}

export class AdminPage extends BasePage {
  visit(): this {
    cy.visit("/admin/viewSystemUsers");
    return this;
  }

  verifyPageLoaded(): this {
    return this.verifyPageTitle("Admin");
  }

  verifyFormIsOpen(): this {
    return this.verifyFormTitle("Add User");
  }

  fillForm(data: AdminData): this {
    cy.get(this.commonSelectors.form.container)
      .should("be.visible")
      .within(() => {
        // Select role
        this.selectDropdownOption(0, data.role);

        // Select employee name
        this.selectAutocompleteOption(data.employeeName);

        // Enter username
        cy.get(this.commonSelectors.form.inputField).first().clear().type(data.username);

        // Select status
        this.selectDropdownOption(1, data.status);

        // Enter passwords
        cy.get(this.commonSelectors.form.passwordInput).first().type(data.password);
        cy.get(this.commonSelectors.form.passwordInput).last().type(data.confirmPassword);
      });
    return this;
  }

  /**
   * Override: Admin page uses [type='button'] for reset instead of [type='reset']
   */
  clickResetButton(): this {
    cy.get(this.commonSelectors.form.container)
      .should("be.visible")
      .within(() => {
        cy.get(this.commonSelectors.form.cancelButton)
          .contains("Reset")
          .should("be.visible")
          .click();
      });
    return this;
  }

  searchUsingUsernameWithFilter(
    username: string,
    role: "Admin" | "ESS",
    employeeName: string,
    status: "Enabled" | "Disabled",
  ): this {
    cy.get(this.commonSelectors.form.container)
      .should("be.visible")
      .within(() => {
        // Username input
        setValue(this.commonSelectors.form.inputField, username);

        // User Role dropdown
        this.selectDropdownOption(0, role);

        // Employee Name autocomplete
        this.selectAutocompleteOption(employeeName);

        // Status dropdown
        this.selectDropdownOption(1, status);

        // Search button
        cy.get(this.commonSelectors.form.submitButton).should("be.visible").click();
      });
    return this;
  }

  verifySystemUserIsListed(username: string): this {
    cy.get(this.commonSelectors.table.body)
      .should("be.visible")
      .within(() => {
        cy.get(this.commonSelectors.table.rows)
          .should("be.visible")
          .contains(username)
          .should("be.visible");
      });
    return this;
  }

  deleteSystemUser(username: string): this {
    cy.get(this.commonSelectors.table.body)
      .should("be.visible")
      .within(() => {
        cy.get(this.commonSelectors.table.rows)
          .contains(username)
          .parents(this.commonSelectors.table.rows)
          .find(this.commonSelectors.table.deleteButton)
          .first()
          .click();
      });

    this.confirmDeletion();
    return this;
  }
}
