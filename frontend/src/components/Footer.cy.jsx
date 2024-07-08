import React from 'react'
import Footer from './Footer'

describe('<Footer />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Footer />)
    cy.contains('Air brb 2023 copy©️🥳')
  })
})
