import { cyan } from "@mui/material/colors";

describe("happy path", () => {
  // -------------------register part start-------------------------------
  it("Should navigate to the home screen successfully", () => {
    cy.visit("localhost:3000");
    cy.url().should("include", "localhost:3000");
  });
  it("should navigate to the login page", () => {
    cy.get('a[id="register"]').click();
    cy.url().should("include", "localhost:3000/register");
  });
  it("should input the register form, and click register button", () => {
    cy.get('input[id="register-name"]').focus().type("jeff");
    cy.get('input[id="register-email"]').focus().type("jeffk@gmail.com");
    cy.get('input[id="register-password"]').focus().type("123456");
    cy.get('input[id="register-conpassword"]').focus().type("123456");
    cy.get('button[id="register-button"]').click();
    cy.url().should("include", "localhost:3000/dashboard");
  });
  // -------------------register part finish-------------------------------

  // -------------------navigate Host part start-------------------------------
  it("should navigate to the Host screen successfully", () => {
    cy.visit("localhost:3000/dashboard");
    cy.get('button[id="go-to-host-button"]').click();
    cy.url().should("include", "localhost:3000/Host");
  });
  // -------------------navigate Host part end-------------------------------

  // -------------------add listing part start-------------------------------
  it("Should click the Add a listing button and complete the form", () => {
    cy.get('button[id="add-a-list-button"]').click();
    cy.get('input[id="title"]')
      .focus()
      .type("UNSW students village Kensington6");
    cy.get('input[id="address"]').focus().type("Kensington campus");
    cy.get('input[id="price"]').focus().type("200");
    cy.get('input[id="upload-image-input"]').attachFile("unsw.jpg");
    cy.get('input[id="property-type-input"').focus().type("Apartment");
    cy.get('select[id="Num-of-bathroom-select"]').select("1");
    cy.get('button[id="add-bedroom-button"').click();
    cy.get('input[id="number-of-beds-input0"').focus().type("2");
    cy.get('input[id="other-properties-input0"').focus().type("TV and AC");
    cy.get('input[id="propertyAmenities-input"').focus().type("swimming pools");
    cy.get('button[id="host-submit-button"').click();
    cy.get('button[id="close-button"').click();
  });
  // -------------------add listing part end-------------------------------

  //  -------------------publish and unpublish listing part start------------
  it("Should publish a listing successfully.", () => {
    cy.get('button[id="add-avail-date-button0"]').click();
    cy.get('button[id="add-avail-range-button"]').click();
    cy.get('input[id="startDate"]').type("2023-11-01");
    cy.get('input[id="endDate"]').type("2023-11-30");
    cy.get('button[id="submit-date-button"]').click();
    cy.get('button[id="close-date-button"]').click();
  });
  it("Should unpublish a listing successfully.", () => {
    cy.get('button[id="unpublish-button0"]').click();
  });
  //  -------------------publish and unpublish listing part end------------

  //   -------------------add another published listing start-------------------
  it("Should use search box to find a published.", () => {
    cy.get('button[id="add-a-list-button"]').click();
    cy.get('input[id="title"]')
      .focus()
      .type("UNSW students apartment Kensington");
    cy.get('input[id="address"]').focus().type("Kensington campus");
    cy.get('input[id="price"]').focus().type("400");
    cy.get('input[id="upload-image-input"]').attachFile("unsw.jpg");
    cy.get('input[id="property-type-input"').focus().type("Apartment");
    cy.get('select[id="Num-of-bathroom-select"]').select("2");
    cy.get('button[id="add-bedroom-button"').click();
    cy.get('input[id="number-of-beds-input0"').focus().type("2");
    cy.get('input[id="other-properties-input0"').focus().type("desk");
    cy.get('input[id="propertyAmenities-input"').focus().type("public kitchen");
    cy.get('button[id="submit-button"').click();
    cy.get('button[id="close-button"').click();
  });
  it("Should publish a listing successfully.", () => {
    cy.get('button[id="add-avail-date-button-UNSW students village Kensington"]').click();
    cy.get('button[id="add-avail-range-button"]').click();
    cy.get('input[id="startDate"]').type("2023-11-01");
    cy.get('input[id="endDate"]').type("2023-11-30");
    cy.get('button[id="submit-date-button"]').click();
    cy.get('button[id="close-date-button"]').click();
  });
  //   -------------------add another published listing end-------------------

  //   -------------------make booking start-------------------
  it("Should navigate to the landing page screen successfully", () => {
    cy.get('a[id="homepage"]').click();
    cy.url().should("include", "localhost:3000/");
  });
  it("Should use address and title search to find the listing.", () => {
    cy.get('button[id="search-button"]').click();
    cy.get('input[id="outlined-basic"]').focus().type("unsw");
    cy.get('button[id="search-title-button"]').click();
    cy.get('p[id="address0"]').click();
    cy.get('input[value="11/08/2023"]').type("11").type("01").type("2023");
    cy.get('input[value="11/09/2023"]').type("11").type("15").type("2023");
    cy.get('button[id="submit-button"]').click();
  });
  //   -------------------make booking end-------------------

  //   -------------------login test start-------------------
  it("Should log out successfully", () => {
    cy.get('a[id="logout"]').click();
    cy.url().should("include", "localhost:3000/login");
  });
  it("Should login successfully.", () => {
    cy.get('input[id="login-email"]').focus().type("jeff@gmail.com");
    cy.get('input[type="password"]').focus().type("123456");
    cy.get('button[type="button"]').click();
    cy.url().should("include", "localhost:3000/dashboard");
  });
  //   -------------------login test end-------------------
});
