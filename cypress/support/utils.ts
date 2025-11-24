export function generateRandomName(prefix: string): string {
    return `${prefix}_${Date.now()}`;
  }
  
  export function generateRandomUsername(): string {
    return `user_${Math.floor(10000 + Math.random() * 90000)}`;
  }
  
  export function generateEmail(): string {
    return `user_${Date.now()}@test.com`;
  }
  
  export function generateEmployeeId(): string {
    return `EMP_${Math.floor(10000 + Math.random() * 90000)}`;
  }
  
  export function setValue(selector: string, value: string | number): void {
    cy.get(selector).clear().type(String(value));
  }