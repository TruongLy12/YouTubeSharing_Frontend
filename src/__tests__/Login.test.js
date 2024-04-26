import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '..components/AuthContext';
import Login from '..components/Login';

// Mock axios post method
jest.mock('axios');

describe('Login component', () => {
    test('renders login form and submits successfully', async () => {    
        // Mock successful response from axios
        axios.post.mockResolvedValue({ status: 200 });

        const { getByText, getByPlaceholderText } = render(
            <MemoryRouter>
                <AuthProvider>
                <Login />
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.submit(getByText('Login'));

        // Expect axios post method to be called with correct arguments
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'https://bold-astrix-formyownpersonal.koyeb.app/api/auth/login',
                { username: 'test@example.com', password: 'password123' },
                { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
            );
        });
    });

    test('displays error message when login fails', async () => {
        // Mock failed response from axios
        axios.post.mockRejectedValue(new Error('Invalid credentials'));

        const { getByText, getByPlaceholderText, findByText } = render(
            <MemoryRouter>
                <AuthProvider>
                <Login />
                </AuthProvider>
            </MemoryRouter>
        );

        fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.submit(getByText('Login'));

        // Expect error message to be displayed
        expect(await findByText('Error: Invalid credentials')).toBeInTheDocument();
    });
});
