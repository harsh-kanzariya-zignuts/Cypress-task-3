import { commonSelectors } from "../selectors";

export abstract class BasePage {
  protected readonly commonSelectors = commonSelectors;

  /**
   * Navigate to sidebar option
   */
  navigateToSidebarOption(optionName: string): this {
    cy.contains(this.commonSelectors.sidebar.allOptions, optionName).should("be.visible").click();
    return this;
  }

  /**
   * Click add button in header
   */
  clickAddButton(): this {
    cy.get(this.commonSelectors.header.addButton).should("be.visible").click();
    return this;
  }

  /**
   * Click save button in form
   */
  clickSaveButton(): this {
    cy.get(this.commonSelectors.form.submitButton).should("be.visible").click();
    return this;
  }

  /**
   * Click reset button in form
   */
  clickResetButton(): this {
    cy.get(this.commonSelectors.form.resetButton).should("be.visible").click();
    return this;
  }

  /**
   * Select dropdown option by text
   */
  selectDropdownOption(dropdownIndex: number, optionText: string): void {
    cy.get(this.commonSelectors.form.dropdownButton).eq(dropdownIndex).click();
    cy.contains(this.commonSelectors.form.dropdownOptions, optionText).click();
  }

  /**
   * Select autocomplete option
   */
  selectAutocompleteOption(inputValue: string): void {
    cy.get(this.commonSelectors.form.autocompleteInput).type(inputValue);
    cy.contains(this.commonSelectors.form.autocompleteOptions, inputValue).click();
  }

  /**
   * Confirm deletion in popup
   */
  confirmDeletion(): void {
    cy.get(this.commonSelectors.popup.dialog)
      .should("be.visible")
      .within(() => {
        cy.get(this.commonSelectors.popup.buttons)
          .contains("Yes, Delete")
          .should("be.visible")
          .click();
      });
  }

  /**
   * Verify page is loaded by checking title
   */
  protected verifyPageTitle(expectedTitle: string): this {
    cy.contains(this.commonSelectors.topbar.title, expectedTitle).should("be.visible");
    return this;
  }

  /**
   * Verify form is open
   */
  protected verifyFormTitle(expectedTitle: string): this {
    cy.get(this.commonSelectors.form.container).should("be.visible");
    cy.contains(this.commonSelectors.header.title, expectedTitle).should("be.visible");
    return this;
  }
}
