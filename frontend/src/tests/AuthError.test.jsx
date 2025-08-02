import { render, screen } from '@testing-library/react';
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

describe('Basic Test', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});

describe('Form Component Test', () => {
  it('should render form with minimal props', () => {
    const mockFields = [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true
      }
    ];

    render(
      <Form 
        fields={mockFields}
        endpoint="/test"
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders all fields and the submit button', () => {
    render(
      <Form 
        fields={mockSchoolFormFields}
        endpoint="/test-endpoint"
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/school name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/module/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});
