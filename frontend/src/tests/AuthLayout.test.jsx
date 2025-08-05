// __tests__/AuthLayout.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import AuthLayout from '../Authentication/AuthLayout';
import AuthProvider from '../Providers/AuthenticationProvider';
import AxiosAPIError from '../Providers/AxiosAPIError';

// Mock axios and createAxiosInstance
const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn()
    }
  },
  defaults: {
    headers: {},
    withCredentials: true
  }
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    post: vi.fn()
  }
}));

vi.mock('../utils/axiosInstance', () => ({
  default: vi.fn(() => mockAxiosInstance)
}));

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('react-router', () => ({
    ...vi.importActual('react-router'),
    useNavigate: () => vi.fn(), // 👈 Fake navigate
}));

describe('AuthLayout login failure', () => {
  it('shows "Invalid User Credentials" on login error', async () => {
    // Arrange: mock axios.post to simulate login failure
    mockAxiosInstance.post.mockRejectedValueOnce(
      new AxiosAPIError('API Error', ['Invalid User Credentials'])
    );

    // Mock the get request for modules
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: []
    });

    // Render AuthLayout inside AuthProvider
    render(
        <AuthProvider>
            <AuthLayout />
        </AuthProvider>
    );

    // Wait for the component to load (modules to be fetched)
    await waitFor(() => {
      expect(mockAxiosInstance.get).toHaveBeenCalled();
    });

    // Act: fill in the login form fields
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' }
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Debug: Check if the post method was called
    await waitFor(() => {
      expect(mockAxiosInstance.post).toHaveBeenCalled();
    }, { timeout: 5000 });

    // Debug: Log what was called
    console.log('Post calls:', mockAxiosInstance.post.mock.calls);
    console.log('Get calls:', mockAxiosInstance.get.mock.calls);

    // Assert: error message appears
    await waitFor(() => {
      expect(screen.getByText(/invalid user credentials/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Optional: check that it's in the `.error` div
    const error = screen.getByText(/invalid user credentials/i);
    expect(error.closest('.error')).toBeInTheDocument();
  });
});
