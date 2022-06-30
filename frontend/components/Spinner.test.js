// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

test('sanity', () => {
  expect(true).toBe(true)
})

test('Spinner renders if prop is true', () => {
  render(<Spinner on={true}/>);
  const spinnerText = screen.getByText(/please wait.../i);
  expect(spinnerText).toBeInTheDocument;
  })

  test('Spinner does not renders if prop is false', () => {
    render(<Spinner on={false}/>);
    const spinnerText = screen.queryByText(/please wait.../i);
    expect(spinnerText).not.toBeInTheDocument;
    })