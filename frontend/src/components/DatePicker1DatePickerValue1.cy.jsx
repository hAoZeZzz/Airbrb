import React from 'react'
import DatePickerValue1 from './DatePicker1'

describe('<DatePickerValue1 />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DatePickerValue1 dateRange={['2023-11-08', '2023-11-15']}/>)
    cy.get('input[type="date"]').should('have.value', '2023-11-08')
  })
})
