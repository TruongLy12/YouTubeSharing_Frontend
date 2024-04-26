import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from '..components/Register';

// Mock axios post method
jest.mock('axios');

describe('Register component', () => {
    test('registers user successfully', async () => {
        // Mock successful response from axios
        axios.post.mockResolvedValue({ status: 201 });

        const { getByText, getByPlaceholderText, queryByText } = render(<Register />);

        fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.submit(getByText('Register'));

        // Expect axios post method to be called with correct arguments
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith (
                'https://bold-astrix-formyownpersonal.koyeb.app/api/auth/register',
                { username: 'test@example.com', password: 'password123' },
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
            );
        });

        // Expect registration success message to be displayed
        expect(queryByText('Registration successful!')).toBeInTheDocument();
        expect(queryByText('Click')).toBeInTheDocument();
    });

    test('displays error message when registration fails', async () => {
        // Mock failed response from axios
        axios.post.mockRejectedValue(new Error('Username already exists'));

        const { getByText, getByPlaceholderText, findByText } = render(<Register />);

        // Fill in the form
        fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.submit(getByText('Register'));

        // Expect error message to be displayed
        expect(await findByText('Error: Username already exists')).toBeInTheDocument();
    });
});
