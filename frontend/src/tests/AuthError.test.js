import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Form from '../Components/Form';

const mockSchoolFormFields = [
    { 
      name: 'name', 
      type: 'text', 
      label: 'School Name', 
      placeholder: 'Enter school name',
      required: true 
    },
    { 
      name: 'email', 
      type: 'email', 
      label: 'Email', 
      placeholder: 'Enter email',
      required: true 
    },
    { 
      name: 'username', 
      type: 'text', 
      label: 'Username', 
      placeholder: 'Enter username',
      required: true 
    },
    { 
      name: 'password', 
      type: 'password', 
      label: 'Password', 
      placeholder: 'Enter password',
      required: true 
    },
    {
      name: 'module',
      type: 'select',
      label: 'Module',
      options: [
        { value: '1', label: 'Mathematics' },
        { value: '2', label: 'Science' }
      ],
      required: true
    }
  ];

describe('Form Component Tests', () => {
  it('renders the login form', () => {
    render(<Form fields={mockSchoolFormFields} customHandleSubmit={vi.fn()} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/submit/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});