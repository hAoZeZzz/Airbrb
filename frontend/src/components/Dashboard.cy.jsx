import React from 'react'
import Dashboard from './Dashboard'
import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>

  return mount(wrapped, mountOptions)
})
describe('<Dashboard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Dashboard />)
    cy.get('button[id="go-to-host-button"]')
  })
})
