import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import { useAuth } from '../Providers/AuthenticationProvider';
import createAxiosInstance from '../utils/axiosInstance';

// Mock dependencies
jest.mock('../Providers/AuthenticationProvider');
jest.mock('../utils/axiosInstance');
jest.mock('react-router', () => ({
  useNavigate: () => jest.fn()
}));

// Mock the Form component
jest.mock('../Components/Form', () => {
  return function MockForm({ fields, customHandleSubmit }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      // Mock form data - you can customize this based on your test scenarios
      const mockFormData = {
        username: 'testuser',
        password: 'testpass',
        email: 'test@example.com',
        name: 'Test School',
        contact_number: '1234567890',
        school_acronym: 'TS',
        cambridge_certified: true,
        module: 1
      };
      
      // Mock setIsSubmitting and setError functions
      const mockSetIsSubmitting = jest.fn();
      const mockSetError = jest.fn();
      
      customHandleSubmit(e, mockFormData, mockSetIsSubmitting, mockSetError);
    };

    return (
      <form onSubmit={handleSubmit} data-testid="auth-form">
        <button type="submit">Submit</button>
      </form>
    );
  };
});

// Mock axios instance
const mockAxiosInstance = {
  get: jest.fn()
};

createAxiosInstance.mockReturnValue(mockAxiosInstance);

describe('AuthLayout Authentication Error Display', () => {
  const mockAuthenticationAction = jest.fn();
  const mockAuthContext = {
    authenticationAction: mockAuthenticationAction,
    authenticationError: null
  };

  beforeEach(() => {
    useAuth.mockReturnValue(mockAuthContext);
    mockAxiosInstance.get.mockResolvedValue({
      data: [
        { id: 1, name: 'Module 1' },
        { id: 2, name: 'Module 2' }
      ]
    });
    jest.clearAllMocks();
  });

  const renderAuthLayout = () => {
    return render(
      <BrowserRouter>
        <AuthLayout />
      </BrowserRouter>
    );
  };

  describe('Login Form Error Display', () => {
    test('displays authentication error when login fails', async () => {
      // Mock authentication action to simulate failure
      mockAuthenticationAction.mockRejectedValue(new Error('Login failed'));
      
      // Mock context to return error after action
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'Invalid credentials'
      });

      renderAuthLayout();

      // Wait for modules to load
      await waitFor(() => {
        expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
      });

      // Submit the form
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    test('displays network error when API call fails', async () => {
      mockAuthenticationAction.mockRejectedValue(new Error('Network error'));
      
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'Network error occurred'
      });

      renderAuthLayout();

      await waitFor(() => {
        expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error occurred')).toBeInTheDocument();
      });
    });

    test('displays server validation error', async () => {
      mockAuthenticationAction.mockRejectedValue(new Error('Validation failed'));
      
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'Username and password are required'
      });

      renderAuthLayout();

      await waitFor(() => {
        expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Username and password are required')).toBeInTheDocument();
      });
    });
  });

  describe('School Registration Form Error Display', () => {
    test('displays error when school registration fails', async () => {
      mockAuthenticationAction.mockRejectedValue(new Error('Registration failed'));
      
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'School with this email already exists'
      });

      renderAuthLayout();

      // Wait for modules to load
      await waitFor(() => {
        expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
      });

      // Switch to registration form
      const toggleButton = screen.getByText('Create School');
      fireEvent.click(toggleButton);

      // Submit the form
      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('School with this email already exists')).toBeInTheDocument();
      });
    });

    test('displays validation error for missing required fields', async () => {
      mockAuthenticationAction.mockRejectedValue(new Error('Validation error'));
      
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'All fields are required'
      });

      renderAuthLayout();

      await waitFor(() => {
        expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
      });

      // Switch to registration form
      const toggleButton = screen.getByText('Create School');
      fireEvent.click(toggleButton);

      const submitButton = screen.getByText('Submit');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('All fields are required')).toBeInTheDocument();
      });
    });
  });

  describe('Module Loading Error Display', () => {
    test('displays error when module loading fails', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Failed to load modules'));

      renderAuthLayout();

      await waitFor(() => {
        expect(screen.getByText('Failed to load module options.')).toBeInTheDocument();
      });
    });

    test('shows loading state while fetching modules', () => {
      // Make the API call hang
      mockAxiosInstance.get.mockImplementation(() => new Promise(() => {}));

      renderAuthLayout();

      expect(screen.getByText('Loading module options...')).toBeInTheDocument();
    });
  });

  describe('Form State Toggle', () => {
    test('error persists when switching between login and registration', async () => {
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'Some error occurred'
      });

      renderAuthLayout();

      await waitFor(() => {
        expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
      });

      // Error should be displayed
      expect(screen.getByText('Some error occurred')).toBeInTheDocument();

      // Switch forms
      const toggleButton = screen.getByText('Create School');
      fireEvent.click(toggleButton);

      // Error should still be displayed
      expect(screen.getByText('Some error occurred')).toBeInTheDocument();
    });
  });

  describe('Error Clearing', () => {
    test('error is cleared on successful submission', async () => {
      // First render with error
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: 'Previous error'
      });

      const { rerender } = renderAuthLayout();

      await waitFor(() => {
        expect(screen.getByText('Previous error')).toBeInTheDocument();
      });

      // Mock successful authentication
      mockAuthenticationAction.mockResolvedValue({ success: true });
      
      // Update context to clear error
      useAuth.mockReturnValue({
        ...mockAuthContext,
        authenticationError: null
      });

      rerender(
        <BrowserRouter>
          <AuthLayout />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByText('Previous error')).not.toBeInTheDocument();
      });
    });
  });
});

// Helper function to create a more realistic test scenario
export const createAuthLayoutTestScenario = (errorMessage, formType = 'login') => {
  const mockAuthenticationAction = jest.fn().mockRejectedValue(new Error('Mock error'));
  
  useAuth.mockReturnValue({
    authenticationAction: mockAuthenticationAction,
    authenticationError: errorMessage
  });

  mockAxiosInstance.get.mockResolvedValue({
    data: [{ id: 1, name: 'Test Module' }]
  });

  return {
    renderComponent: () => render(
      <BrowserRouter>
        <AuthLayout />
      </BrowserRouter>
    ),
    mockAuthenticationAction,
    formType
  };
};

// Example usage test
describe('Real-world Error Scenarios', () => {
  test('handles 401 unauthorized error', async () => {
    const { renderComponent } = createAuthLayoutTestScenario('Unauthorized access');
    
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Unauthorized access')).toBeInTheDocument();
    });
  });

  test('handles 500 server error', async () => {
    const { renderComponent } = createAuthLayoutTestScenario('Internal server error');
    
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('Loading module options...')).not.toBeInTheDocument();
    });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Internal server error')).toBeInTheDocument();
    });
  });
});