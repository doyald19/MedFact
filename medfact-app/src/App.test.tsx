import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders MedFact heading', () => {
  render(<App />);
  const headingElements = screen.getAllByText(/MedFact/i);
  expect(headingElements.length).toBeGreaterThan(0);
  expect(headingElements[0]).toBeInTheDocument();
});

test('renders symptom input placeholder', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter symptoms, disease, or health issue/i);
  expect(inputElement).toBeInTheDocument();
});

test('renders home page navigation links', () => {
  render(<App />);
  // Check for navigation elements
  const homeLinks = screen.getAllByText(/Home/i);
  expect(homeLinks.length).toBeGreaterThan(0);
});

test('renders login and signup buttons', () => {
  render(<App />);
  const loginButtons = screen.getAllByText(/Login/i);
  const signupButtons = screen.getAllByText(/Sign Up/i);
  expect(loginButtons.length).toBeGreaterThan(0);
  expect(signupButtons.length).toBeGreaterThan(0);
});

test('renders search form with submit button', () => {
  render(<App />);
  const submitButton = screen.getByRole('button', { name: /Start Health Analysis/i });
  expect(submitButton).toBeInTheDocument();
});

test('renders footer with copyright', () => {
  render(<App />);
  const copyrightText = screen.getByText(/© 2024 MedFact/i);
  expect(copyrightText).toBeInTheDocument();
});
