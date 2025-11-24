import { DashboardPage } from "../support/page-objects/DashboardPage";
import { PIMPage, EmployeeData } from "../support/page-objects/PIMPage";
import { AdminPage } from "../support/page-objects/AdminPage";
import { commonSelectors } from "../support/selectors";
import { generateEmployeeId, generateRandomName, generateRandomUsername } from "../support/utils";

describe("Performing CRUD operations", () => {
  const employeeData: EmployeeData = {
    firstName: generateRandomName("Test"),
    middleName: generateRandomName("1"),
    lastName: generateRandomName("2"),
    employeeId: generateEmployeeId(),
  };

  const username = generateRandomUsername();
  const fullName = `${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`;

  // Page object instances
  const dashboardPage = new DashboardPage();
  const pimPage = new PIMPage();
  const adminPage = new AdminPage();

  before(() => {
    // Setup API intercepts
    cy.intercept("POST", "**/api/v2/pim/employees").as("createEmployee");
    cy.intercept("GET", "**/api/v2/pim/employees*").as("getEmployees");
    cy.intercept("GET", "**/api/v2/pim/employees/*/personal-details").as("getPersonalDetails");
    cy.intercept("DELETE", "**/api/v2/pim/employees*").as("deleteEmployee");
    cy.intercept("GET", "**/api/v2/admin/users*").as("getSystemUsers");
    cy.intercept("POST", "**/api/v2/admin/users*").as("createSystemUser");
    cy.intercept("DELETE", "**/api/v2/admin/users*").as("deleteSystemUser");
    cy.intercept("GET", "**/auth/logout").as("logout");
  });

  it("should complete full CRUD workflow for employee and system user", () => {
    // Step 1: Verify Dashboard
    cy.log("Step 1: Verify the Dashboard page is loaded");
    dashboardPage.verifyPageLoaded();

    // Step 2-3: Navigate to PIM and verify
    cy.log("Step 2: Navigate to PIM section");
    dashboardPage.navigateToSidebarOption("PIM");

    cy.log("Step 3: Verify the PIM page is loaded");
    pimPage.verifyPageLoaded();
    cy.wait("@getEmployees").its("response.statusCode").should("be.within", 200, 299);

    // Step 4-7: Create employee
    cy.log("Step 4-5: Open Add Employee form");
    pimPage.clickAddButton().verifyFormIsOpen();

    cy.log("Step 6: Fill employee details");
    pimPage.fillForm(employeeData);

    cy.log("Step 7: Save employee");
    pimPage.clickSaveButton();

    cy.wait("@createEmployee").its("response.statusCode").should("be.within", 200, 299);
    cy.wait("@getEmployees").its("response.statusCode").should("be.within", 200, 299);
    cy.wait("@getPersonalDetails").its("response.statusCode").should("be.within", 200, 299);

    // Step 8-11: Search and verify employee
    cy.log("Step 8: Navigate to Employee List");
    pimPage.clickEmployeeListButton();
    cy.wait("@getEmployees").its("response.statusCode").should("eq", 200);

    cy.log("Step 9-10: Search for created employee");
    pimPage.verifyFilterIsVisible().searchUsingEmployeeId(employeeData.employeeId);
    cy.wait("@getEmployees").its("response.statusCode").should("be.within", 200, 299);

    cy.log("Step 11: Verify employee is listed");
    pimPage.verifyEmployeeIsListed(employeeData);

    // Step 12-13: Navigate to Admin
    cy.log("Step 12: Navigate to Admin section");
    pimPage.navigateToSidebarOption("Admin");
    cy.wait("@getSystemUsers").its("response.statusCode").should("eq", 200);

    cy.log("Step 13: Verify Admin page is loaded");
    adminPage.verifyPageLoaded();

    // Step 14-17: Create system user
    cy.log("Step 14-15: Open Add User form");
    adminPage.clickAddButton().verifyFormIsOpen();

    cy.log("Step 16: Fill system user details");
    adminPage.fillForm({
      role: "Admin",
      employeeName: fullName,
      status: "Enabled",
      username: username,
      password: "Test@123",
      confirmPassword: "Test@123",
    });

    cy.log("Step 17: Save system user");
    adminPage.clickSaveButton();

    cy.wait("@createSystemUser").its("response.statusCode").should("be.within", 200, 299);
    cy.wait("@getSystemUsers").its("response.statusCode").should("be.within", 200, 299);

    // Step 18-19: Search and verify system user
    cy.log("Step 18: Search for created system user");
    adminPage.searchUsingUsernameWithFilter(username, "Admin", fullName, "Enabled");
    cy.wait("@getSystemUsers").its("response.statusCode").should("eq", 200);

    cy.log("Step 19: Verify system user is listed");
    adminPage.verifySystemUserIsListed(username);

    // Step 20-21: Delete system user
    cy.log("Step 20: Delete system user");
    adminPage.deleteSystemUser(username);
    cy.wait("@deleteSystemUser").its("response.statusCode").should("be.within", 200, 299);

    cy.log("Step 21: Reset filters");
    adminPage.clickResetButton();
    cy.wait("@getSystemUsers").its("response.statusCode").should("be.within", 200, 299);

    // Step 22-24: Delete employee
    cy.log("Step 22: Navigate back to PIM");
    adminPage.navigateToSidebarOption("PIM");
    cy.wait("@getEmployees").its("response.statusCode").should("be.within", 200, 299);

    cy.log("Step 23-24: Delete employee");
    pimPage.verifyFilterIsVisible().deleteEmployee(employeeData.employeeId);
    cy.wait("@deleteEmployee").its("response.statusCode").should("be.within", 200, 299);
    cy.wait("@getEmployees").its("response.statusCode").should("be.within", 200, 299);

    // Step 25: Logout
    cy.log("Step 25: Logout");
    cy.get(commonSelectors.topbar.userDropdown).should("be.visible").click();
    cy.get(commonSelectors.topbar.optionsInUserDropdown)
      .contains("Logout")
      .should("be.visible")
      .click();
    cy.wait("@logout").its("response.statusCode").should("eq", 302);
  });
});
