describe("happy happy path", () => {
  it("Should navigate to the home screen successfully", () => {
    cy.visit("localhost:3000");
    cy.url().should("include", "localhost:3000/");
  });
  it("should navigate to the login page", () => {
    cy.get('a[id="login"]').click();
    cy.url().should("include", "localhost:3000/login");
  });
  it("Should login successfully and move to edit page.", () => {
    cy.get('input[id="login-email"]').focus().type("jeff@gmail.com");
    cy.get('input[type="password"]').focus().type("123456");
    cy.get('button[type="button"]').click();
    cy.url().should("include", "localhost:3000/dashboard");
    cy.get('button[id="go-to-host-button"]').click();
    cy.get('button[id="edit-button"]').click();
  });
  it("Should change the proprety detail and submit again.", () => {
    cy.get('input[id="title"]').focus().clear().type("east village apartment");
    cy.get('input[id="address"]').focus().clear().type("Kensington campus");
    cy.get('input[id="price"]').focus().clear().type("200");
    cy.get('input[id="upload-image-input"]').attachFile("unsw.jpg");
    cy.get('input[id="property-type-input"').clear().focus().type("Apartment");
    cy.get('select[id="Num-of-bathroom-select"]').select("4");
    cy.get('button[id="add-bedroom-button"').click();
    cy.get('input[id="number-of-beds-input0"').focus().clear().type("3");
    cy.get('input[id="other-properties-input0"').focus().clear().type("chair");
    cy.get('input[id="propertyAmenities-input"').focus().clear().type("GYM");
    cy.get('button[id="host-submit-button"').click();
    cy.get('button[id="close-button"').click();
  });
  it("Should publish a listing successfully.", () => {
    cy.get('button[id="add-avail-date-button-east village apartment"]').click();
    cy.get('button[id="add-avail-range-button"]').click();
    cy.get('input[id="startDate"]').type("2023-11-01");
    cy.get('input[id="endDate"]').type("2023-11-30");
    cy.get('button[id="submit-date-button"]').click();
    cy.get('button[id="close-date-button"]').click();
  });
  it("Should log out successfully", () => {
    cy.get('a[id="logout"]').click();
    cy.url().should("include", "localhost:3000/login");
  });
  it("Should login successfully and move to edit page.", () => {
    cy.get('input[id="login-email"]').focus().type("jeff1@gmail.com");
    cy.get('input[type="password"]').focus().type("123456");
    cy.get('button[type="button"]').click();
    cy.url().should("include", "localhost:3000/dashboard");
  });
  it("Should navigate to the landing page screen successfully", () => {
    cy.get('a[id="homepage"]').click();
    cy.url().should("include", "localhost:3000/");
  });
  it("Should use address and title search to find the listing.", () => {
    cy.get('button[id="search-button"]').click();
    cy.get('input[id="outlined-basic"]').focus().type("apartment");
    cy.get('button[id="search-title-button"]').click();
    cy.get('p[id="address0"]').click();
    cy.get('input[value="11/08/2023"]').type("11").type("01").type("2023");
    cy.get('input[value="11/09/2023"]').type("11").type("15").type("2023");
    cy.get('button[id="submit-button"]').click();
  });
  it("Should navigate to the booking request management", () => {
    cy.get('a[id="dashboard"]').click();
    cy.get('button[id="Booking-request-management"]').click();
    cy.url().should("include", "http://localhost:3000/BookingManagement");
  });
  it("Should log out successfully", () => {
    cy.get('a[id="logout"]').click();
    cy.url().should("include", "localhost:3000/login");
  });
  it("Should login successfully and move to the booking request management.", () => {
    cy.get('input[id="login-email"]').focus().type("jeff@gmail.com");
    cy.get('input[type="password"]').focus().type("123456");
    cy.get('button[type="button"]').click();
    cy.get('button[id="Booking-request-management"]').click();
    cy.wait(2000);
  });
  it("Should accept the booking.", () => {
    cy.get('button[id="accept_0"]').click();
  });
  it("Should log out successfully", () => {
    cy.get('a[id="logout"]').click();
    cy.url().should("include", "localhost:3000/login");
  });
  it("Should login count 2 successfully and move to the booking request management.", () => {
    cy.get('input[id="login-email"]').focus().type("jeff1@gmail.com");
    cy.get('input[type="password"]').focus().type("123456");
    cy.get('button[type="button"]').click();
    cy.get('button[id="Booking-request-management"]').click();
    cy.get('button[id="delete-0"]').click();
  });
});
