import { commonSelectors } from "./selectors";
import { setValue } from "./utils";

export interface LoginCredentials {
  username: string;
  password: string;
}

export class LoginPage {
  private readonly selectors = {
    title: ".orangehrm-login-title",
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: ".orangehrm-login-button",
  };

  visit(): this {
    cy.visit("/");
    return this;
  }

  verifyPageLoaded(): this {
    cy.contains(this.selectors.title, "Login").should("be.visible");
    return this;
  }

  fillCredentials(credentials: LoginCredentials): this {
    setValue(this.selectors.usernameInput, credentials.username);
    setValue(this.selectors.passwordInput, credentials.password);
    return this;
  }

  clickLoginButton(): this {
    cy.get(this.selectors.loginButton).should("be.visible").click();
    return this;
  }

  login(credentials: LoginCredentials): void {
    this.visit().verifyPageLoaded().fillCredentials(credentials).clickLoginButton();
  }
}

/**
 * Login function for use in commands
 */
export function login(): void {
  const username: string = Cypress.env("USERNAME") || "Admin";
  const password: string = Cypress.env("PASSWORD") || "admin123";

  if (!username || !password) {
    throw new Error("USERNAME and PASSWORD environment variables must be set");
  }

  const loginPage = new LoginPage();
  loginPage.login({ username, password });

  // Wait for dashboard to load after login
  cy.contains(commonSelectors.topbar.title, "Dashboard", { timeout: 10000 }).should("be.visible");
}
