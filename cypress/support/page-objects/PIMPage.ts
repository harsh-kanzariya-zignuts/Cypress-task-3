import { BasePage } from "./BasePage";
import { setValue } from "../utils";

export interface EmployeeData {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export class PIMPage extends BasePage {
  private readonly selectors = {
    addImageButton: "input[type='file']",
    firstName: "input[name='firstName']",
    middleName: "input[name='middleName']",
    lastName: "input[name='lastName']",
    employeeId: ".oxd-grid-2 .oxd-input",
  };

  visit(): this {
    cy.visit("/pim/viewEmployeeList");
    return this;
  }

  verifyPageLoaded(): this {
    return this.verifyPageTitle("PIM");
  }

  verifyFormIsOpen(): this {
    return this.verifyFormTitle("Add Employee");
  }

  fillForm(data: EmployeeData): this {
    cy.get(this.commonSelectors.form.container)
      .should("be.visible")
      .within(() => {
        cy.get(this.selectors.addImageButton).selectFile("cypress/fixtures/picture.jpg", {
          force: true,
        });
        setValue(this.selectors.firstName, data.firstName);
        setValue(this.selectors.middleName, data.middleName);
        setValue(this.selectors.lastName, data.lastName);
        setValue(this.selectors.employeeId, data.employeeId);
      });
    return this;
  }

  clickEmployeeListButton(): this {
    cy.contains(this.commonSelectors.topbar.navOptions, "Employee List")
      .should("be.visible")
      .click();
    return this;
  }

  verifyFilterIsVisible(): this {
    cy.get(this.commonSelectors.form.container).should("be.visible");
    return this;
  }

  searchUsingEmployeeId(id: string): this {
    cy.get(this.commonSelectors.form.container)
      .should("be.visible")
      .within(() => {
        setValue(this.commonSelectors.form.inputField, id);
        cy.get(this.commonSelectors.form.submitButton).should("be.visible").click();
      });
    return this;
  }

  verifyEmployeeIsListed(data: EmployeeData): this {
    cy.get(this.commonSelectors.table.body)
      .should("be.visible")
      .within(() => {
        cy.get(this.commonSelectors.table.rows).should("be.visible").contains(data.employeeId);
      });
    return this;
  }

  deleteEmployee(id: string): this {
    cy.log("Searching the employee to be deleted");
    this.searchUsingEmployeeId(id);

    cy.log("Deleting the employee");
    cy.get(this.commonSelectors.table.body)
      .should("be.visible")
      .within(() => {
        cy.get(this.commonSelectors.table.rows)
          .should("be.visible")
          .contains(id)
          .parents(this.commonSelectors.table.rows)
          .find(this.commonSelectors.table.deleteButton)
          .last()
          .click();
      });

    cy.log("Confirming deletion");
    this.confirmDeletion();
    return this;
  }
}
