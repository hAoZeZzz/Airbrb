import React from 'react'
import Login from './Login'
import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>

  return mount(wrapped, mountOptions)
})
describe('<Login />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Login />)
  });
  it('type detail', () => {
    cy.mount(<Login />)
    cy.get('input[id="login-email"]').focus().type('haoze@gmail.com')
    cy.get('input[id="mui-2"]').focus().type('123456')
  })
})
