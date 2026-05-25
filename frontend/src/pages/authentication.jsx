import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Define an ultra-premium, modern custom theme
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
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 800,
            letterSpacing: '-1px',
            color: '#0f172a',
        },
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
                        backgroundColor: '#f8fafc',
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
                    '& .MuiInputLabel-root': {
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: 500,
                        '&.Mui-focused': {
                            color: '#6366f1',
                        }
                    }
                },
            },
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
                setPassword("");
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created',
                    text: result || 'Your account has been registered successfully. You can now login!',
                    confirmButtonColor: '#6366f1',
                });
            }
        } catch (err) {
            console.log(err);
            let message = (err.response?.data?.message) || "Something went wrong. Please check your connection and try again.";
            setError(message);
            Swal.fire({
                icon: 'error',
                title: 'Authentication Failed',
                text: message,
                confirmButtonColor: '#6366f1',
            });
        }
    };

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={customTheme}>
            <Grid container component="main" sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', position: 'relative' }}>
                <CssBaseline />

                {/* Floating Back Button */}
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{
                        position: 'absolute',
                        top: 24,
                        left: 24,
                        zIndex: 50,
                        background: '#ffffff',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.06)',
                            color: '#6366f1',
                            borderColor: 'rgba(99, 102, 241, 0.25)',
                            transform: 'translateX(-2px)',
                        },
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>

                
                {/* Brand Side Panel with unique modern light vector layout */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        position: 'relative',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 6,
                        overflow: 'hidden',
                        borderRight: '1px solid rgba(226, 232, 240, 0.8)',
                    }}
                >
                    {/* Glowing decorative nodes */}
                    <Box sx={{
                        position: 'absolute',
                        top: '15%',
                        left: '10%',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: '15%',
                        right: '10%',
                        width: '350px',
                        height: '350px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }} />

                    {/* Vector floating mockup card */}
                    <Box
                        sx={{
                            zIndex: 10,
                            maxWidth: '480px',
                            textAlign: 'left',
                            background: 'rgba(255, 255, 255, 0.65)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            borderRadius: '32px',
                            padding: '3rem',
                            boxShadow: '0 30px 60px -15px rgba(99, 102, 241, 0.08)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 40px 80px -15px rgba(99, 102, 241, 0.12)',
                            }
                        }}
                    >
                        <Typography variant="h3" sx={{ 
                            fontWeight: 900, 
                            mb: 2, 
                            lineHeight: 1.15,
                            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1.5px'
                        }}>
                            Apna Video Call
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.15rem', mb: 4, lineHeight: 1.6, fontWeight: 500 }}>
                            Experience high definition video calls and interactive instant messaging with zero boundary limitations. Connect dynamically.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366f1' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>HD Video</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#06b6d4' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>Real-time Chat</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>Secure Connection</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Form Card Container */}
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    borderLeft: '1px solid rgba(226, 232, 240, 0.3)',
                    p: 4
                }}>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '400px',
                            background: '#ffffff',
                            borderRadius: '28px',
                            padding: '2.5rem',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ 
                            m: 1, 
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', 
                            color: '#6366f1',
                            width: 52,
                            height: 52
                        }}>
                            <LockOutlinedIcon sx={{ fontSize: 24 }} />
                        </Avatar>

                        {/* Beautiful Pill Switch Tab */}
                        <Box sx={{ 
                            display: 'flex', 
                            background: '#f1f5f9', 
                            p: '5px', 
                            borderRadius: '14px', 
                            width: '100%', 
                            my: 3,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Sliding Highlight Background */}
                            <Box sx={{
                                position: 'absolute',
                                top: '5px',
                                bottom: '5px',
                                left: '5px',
                                width: 'calc(50% - 5px)',
                                borderRadius: '10px',
                                background: '#ffffff',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: formState === 0 ? 'translateX(0)' : 'translateX(100%)',
                                zIndex: 1,
                            }} />

                            <Button 
                                fullWidth 
                                onClick={() => { setFormState(0) }}
                                sx={{ 
                                    py: 1.2, 
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    background: 'transparent',
                                    color: formState === 0 ? '#6366f1' : '#64748b',
                                    transition: 'color 0.35s ease',
                                    zIndex: 2,
                                    '&:hover': {
                                        background: 'transparent',
                                        transform: 'none',
                                    }
                                }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                fullWidth 
                                onClick={() => { setFormState(1) }}
                                sx={{ 
                                    py: 1.2, 
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    background: 'transparent',
                                    color: formState === 1 ? '#6366f1' : '#64748b',
                                    transition: 'color 0.35s ease',
                                    zIndex: 2,
                                    '&:hover': {
                                        background: 'transparent',
                                        transform: 'none',
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ width: '100%' }}>
                            {/* Smooth Slide & Fade for Full Name field */}
                            <Box sx={{
                                maxHeight: formState === 1 ? '100px' : '0px',
                                opacity: formState === 1 ? 1 : 0,
                                transform: formState === 1 ? 'translateY(0)' : 'translateY(-10px)',
                                overflow: 'hidden',
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                mb: formState === 1 ? 1 : 0,
                            }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Box>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && <Typography sx={{ color: '#ef4444', fontSize: '0.85rem', mt: 1.5, fontWeight: 600 }}>{error}</Typography>}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 1, py: 1.4, fontSize: '1rem' }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
            />
        </ThemeProvider>
    );
}