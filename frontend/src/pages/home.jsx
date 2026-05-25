import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Box, Typography } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ShieldIcon from '@mui/icons-material/Shield';
import MessageIcon from '@mui/icons-material/Message';
import { AuthContext } from '../contexts/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';

// Premium custom theme matching the authentication brand theme
const customTheme = createTheme({
    palette: {
        primary: {
            main: '#6366f1', // Indigo
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#06b6d4', // Cyan
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    padding: '10px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
                        transform: 'translateY(-1px)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    }
                }
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: '#e2e8f0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#6366f1',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
    },
});

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Meeting Code Required',
                text: 'Please enter a valid meeting code to join the session.',
                confirmButtonColor: '#6366f1',
            });
            return;
        }
        try {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Join Call',
                text: 'Something went wrong while saving your meeting history. Please try again.',
                confirmButtonColor: '#6366f1',
            });
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            {/* Top Navigation Bar */}
            <div className="navBar">
                <div>
                    <h2>Apna Video Call</h2>
                </div>

                <div className="navButtonsContainer">
                    <div className="navLinkItem" onClick={() => navigate("/history")}>
                        <IconButton size="small" sx={{ color: '#6366f1' }}>
                            <RestoreIcon fontSize="small" />
                        </IconButton>
                        <p>History</p>
                    </div>

                    <Button 
                        className="logoutButton"
                        variant="outlined"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="meetContainer">
                
                {/* Left Section: Create/Join and Features */}
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        {/* Interactive Start/Join Card */}
                        <div className="formActionCard">
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                Start or Join a Call
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: "12px", width: '100%' }}>
                                <TextField 
                                    fullWidth
                                    size="small"
                                    onChange={e => setMeetingCode(e.target.value)} 
                                    placeholder="Enter Meeting Code"
                                    id="outlined-basic" 
                                    variant="outlined" 
                                    value={meetingCode}
                                />
                                <Button 
                                    onClick={handleJoinVideoCall} 
                                    variant='contained'
                                    disabled={!meetingCode.trim()}
                                    sx={{ minWidth: '100px' }}
                                >
                                    Join
                                </Button>
                            </Box>
                        </div>

                        {/* Mini Features List */}
                        <div className="featuresGrid">
                            <div className="featureCard">
                                <div className="featureIconWrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                    <VideoCallIcon fontSize="small" />
                                </div>
                                <h4>HD Calling</h4>
                                <p>Crystal clear high-fidelity video streams with automated bandwidth throttling.</p>
                            </div>

                            <div className="featureCard">
                                <div className="featureIconWrapper" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                                    <MessageIcon fontSize="small" />
                                </div>
                                <h4>Instant Chat</h4>
                                <p>Message peers inside active video lobbies instantly without interruptions.</p>
                            </div>

                            <div className="featureCard">
                                <div className="featureIconWrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                    <ShieldIcon fontSize="small" />
                                </div>
                                <h4>Secure Rooms</h4>
                                <p>Rest assured with point-to-point secure sessions that protect privacy.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Logo mockups */}
                <div className='rightPanel'>
                    <div className="rightPanelWrapper">
                        <img srcSet='/logo3.png' alt="Apna Video Call Logo" />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default withAuth(HomeComponent)