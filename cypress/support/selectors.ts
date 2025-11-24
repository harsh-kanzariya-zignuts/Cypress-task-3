export const commonSelectors = {
  sidebar: {
    searchbox: "input[placeholder='Search']",
    allOptions: ".oxd-main-menu-item-wrapper",
    closeButton: ".oxd-main-menu-button",
  },
  topbar: {
    title: ".oxd-topbar-header-breadcrumb-module",
    userDropdown: ".oxd-userdropdown-tab",
    optionsInUserDropdown: ".oxd-userdropdown-link",
    navOptions: ".oxd-topbar-body-nav-tab",
  },
  form: {
    container: ".oxd-form",
    inputField: ".oxd-input",
    dropdownButton: ".oxd-select-text",
    dropdownOptions: ".oxd-select-dropdown",
    autocompleteInput: "input[placeholder='Type for hints...']",
    autocompleteOptions: ".oxd-autocomplete-option",
    passwordInput: "input[type='password']",
    submitButton: "[type='submit']",
    resetButton: "[type='reset']",
    cancelButton: "[type='button']",
  },
  table: {
    container: ".oxd-table",
    body: ".oxd-table-body",
    rows: ".oxd-table-row",
    cells: ".oxd-table-cell",
    deleteButton: ".oxd-table-cell-actions .oxd-icon-button",
  },
  popup: {
    dialog: ".orangehrm-dialog-popup",
    buttons: "[type='button']",
  },
  header: {
    container: ".orangehrm-header-container",
    addButton: ".orangehrm-header-container .oxd-button",
    title: ".orangehrm-main-title",
    filterTitle: ".oxd-table-filter-header-title",
  },
};