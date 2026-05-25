import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import { IconButton, Button, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DnsIcon from '@mui/icons-material/Dns';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';

const customTheme = createTheme({
    palette: {
        primary: {
            main: '#6366f1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#06b6d4',
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
        fontFamily: '"Plus Jakarta Sans", "Inter", "sans-serif"',
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
                    padding: '8px 20px',
                    boxShadow: 'none',
                },
            },
        },
    },
});

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Retrieve History',
                    text: 'Could not load your meeting history logs. Please check your network and try again.',
                    confirmButtonColor: '#6366f1',
                });
            }
        }
        fetchHistory();
    }, [getHistoryOfUser]);

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <ThemeProvider theme={customTheme}>
            <div className="historyPageContainer">
                
                {/* Header Banner */}
                <div className="historyHeader">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <IconButton 
                            onClick={() => routeTo("/home")}
                            sx={{ 
                                background: '#ffffff', 
                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    background: 'rgba(99, 102, 241, 0.05)',
                                    color: '#6366f1',
                                    borderColor: 'rgba(99, 102, 241, 0.2)'
                                }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>
                            Meeting History
                        </Typography>
                    </div>

                    <Button 
                        variant="outlined" 
                        startIcon={<HomeIcon />}
                        onClick={() => routeTo("/home")}
                        sx={{
                            borderColor: '#e2e8f0',
                            color: '#475569',
                            '&:hover': {
                                borderColor: '#6366f1',
                                color: '#6366f1',
                                background: 'rgba(99, 102, 241, 0.04)'
                            }
                        }}
                    >
                        Back to Home
                    </Button>
                </div>

                {/* Grid List */}
                {meetings.length !== 0 ? (
                    <div className="historyGrid">
                        {meetings.map((meeting, index) => (
                            <div className="historyCard" key={index}>
                                {/* Meeting Code row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: 2 }}>
                                    <Box sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        borderRadius: '8px', 
                                        bgcolor: 'rgba(99, 102, 241, 0.1)', 
                                        color: '#6366f1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <DnsIcon fontSize="small" />
                                    </Box>
                                    <div>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Meeting Code</Typography>
                                        <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 700 }}>
                                            {meeting.meetingCode}
                                        </Typography>
                                    </div>
                                </Box>

                                {/* Meeting Date row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Box sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        borderRadius: '8px', 
                                        bgcolor: 'rgba(6, 182, 212, 0.1)', 
                                        color: '#06b6d4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CalendarMonthIcon fontSize="small" />
                                    </Box>
                                    <div>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Date Joined</Typography>
                                        <Typography variant="body1" sx={{ color: '#475569', fontWeight: 600 }}>
                                            {formatDate(meeting.date)}
                                        </Typography>
                                    </div>
                                </Box>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="noHistoryMessage">
                        <Box sx={{ 
                            width: 64, 
                            height: 64, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(99, 102, 241, 0.06)', 
                            color: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1
                        }}>
                            <HourglassEmptyIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                            No previous meetings found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2, maxWidth: '300px' }}>
                            You haven't joined any video sessions yet. Start your first session now!
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => routeTo("/home")}
                            sx={{ boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}
                        >
                            Start a Meeting
                        </Button>
                    </div>
                )}
            </div>
        </ThemeProvider>
    )
}
