import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from '..components/Home';
import { AuthProvider } from '..components/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Mock axios get method
jest.mock('axios');

describe('Home component', () => {
    test('renders home page and submits successfully', async () => {
        // Mock successful response from axios for fetching messages
        axios.get.mockResolvedValue({ data: [{ title: 'Test Title', username: 'Test User', url: 'https://localhost/test' }] });

        const { getByText, getByPlaceholderText } = render(
            <MemoryRouter>
                <AuthProvider>
                <Home />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(getByText('Welcome, Test User!')).toBeInTheDocument();
        expect(getByPlaceholderText('Youtube URL:')).toBeInTheDocument();

        fireEvent.change(getByPlaceholderText('Youtube URL:'), { target: { value: 'https://www.youtube.com/watch?v=lE6RYpe9IT0' } });

        // Mock successful response from axios for submitting
        axios.get.mockResolvedValueOnce({ data: { items: [{ snippet: { title: 'Test Title' } }] } });

        fireEvent.click(getByText('Sharing'));
        const apiKey = "AIzaSyAcIwwUqQhzkv6uWapExcDBPS3zJai6bM0";
        const videoId = "lE6RYpe9IT0";

        // Expect axios get method to be called with correct arguments
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + apiKey);
        });

        // Expect sharing details to be displayed
        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Test User')).toBeInTheDocument();
        expect(getByText('https://localhost/test')).toBeInTheDocument();
    });

    test('displays error message when sharing fails', async () => {
        // Mock failed response from axios for fetching messages
        axios.get.mockRejectedValue(new Error('Error fetching messages'));

        const { getByText } = render(
            <MemoryRouter>
                <AuthProvider>
                <Home />
                </AuthProvider>
            </MemoryRouter>
        );

        // Expect error message to be displayed
        expect(getByText('Error fetching messages')).toBeInTheDocument();
    });
});
