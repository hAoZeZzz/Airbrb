import React from 'react'
import Register from './Register'
import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>

  return mount(wrapped, mountOptions)
})
describe('<Register />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Register />)
    cy.get('button').contains('Register')
  })
})
