import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './Home.css';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Home = () => {
    const { username, logout } = useAuth();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [error, setError] = useState(null);
    const [listSharings, setListSharings] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const subscribeRef = useRef(false); 
    const subscriptionRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleInputChange = (event) => {
        setUrl(event.target.value);
    };

    useEffect(() => {
        // Get list sharing from backend api
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/sharings');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setListSharings(response.data);
                }                
            } catch (error) {
                setError('Error fetching messages');
            }
        };      
        fetchMessages();

        // Connect to WebSocket server
        const socket = new SockJS('http://localhost:8080/ws');
        const stomp = new Client({
            webSocketFactory: () => socket
        });
    
        stomp.onConnect = () => {
            console.log('Connected to WebSocket');
            setStompClient(stomp);
        
            // Subscribe to topic '/topic/public' to receive new messages
            if (!subscribeRef.current) {
                subscriptionRef.current = stomp.subscribe('/topic/public', (message) => {
                    const newSharing = JSON.parse(message.body);
                    setListSharings((prevSharings) => [...prevSharings, newSharing]);
                    alert(`New sharing from ${newSharing.username}: ${newSharing.title}`);
                });
                subscribeRef.current = true;
            }           
        };
    
        stomp.activate();
    
        return () => {
            if (stomp.connected) stomp.deactivate();
            if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Extract video ID from URL
            const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
            
            const apiKey = "AIzaSyAcIwwUqQhzkv6uWapExcDBPS3zJai6bM0";

            // Make request to YouTube Data API
            const response = await axios.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + apiKey);
            
            // Extract title from response
            const title = response.data.items[0].snippet.title;     

            // Send message to server via WebSocket
            if (stompClient && title.trim() !== '') {
                stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify({ username: username, title: title, url: url })
                });
                setUrl('');
            }
        } catch (error) {
            setError('Please enter corect url or check your network connection');
        }
    };

    return (
        <div>
            <div className="header">
                <div className="icon">👤</div>
                <div className="app-name">Youtube Sharing App</div>
                <div className="welcome-text">Welcome, {username}!</div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="body">
                <div className="body-section">
                    {error && <div className="error">{error}</div>}
                    <label >Youtube URL:</label>
                    <input type="text" value={url} onChange={handleInputChange}/>
                    <button className="sharing-btn" onClick={handleSubmit}>Sharing</button>
                </div>

                <div className="body-section">
                    <div className="data-row">
                        <div className="title">Youtube Title</div>
                        <div className="username">Sharing Person</div>
                        <div className="url">Youtube URL</div>
                    </div>
                    
                    {listSharings.map((item, index) => (
                    <div className="data-row" key={index}>
                        <div className="title">{item.title}</div>
                        <div className="username">{item.username}</div>
                        <div className="url">{item.url}</div>
                    </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Home;
