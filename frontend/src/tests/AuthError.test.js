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

describe('Form Component Error Handling', () => {
    it('displays error message when school creation fails', async () => {
        // Mock customHandleSubmit that simulates an error
    const mockCustomHandleSubmit = vi.fn().mockImplementation(async (e, formData, setIsSubmitting, setError) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        // Simulate error from backend
        setError('School with this email already exists');
        setIsSubmitting(false);
      });
  
      render(
        <Form 
          fields={mockSchoolFormFields}
          customHandleSubmit={mockCustomHandleSubmit}
        />
      );

    })
    
})