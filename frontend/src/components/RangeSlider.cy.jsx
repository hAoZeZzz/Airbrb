import React from 'react'
import RangeSlider from './RangeSlider'

describe('<RangeSlider />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RangeSlider min={0} max={100}/>)
    cy.get('[data-index="5"]').should('have.text', '100+')
    cy.get('[data-index="4"]').should('have.text', '80')
  })
})
