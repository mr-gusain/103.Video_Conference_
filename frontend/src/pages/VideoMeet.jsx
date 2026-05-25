import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Box, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from 'sweetalert2';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

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
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
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

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Media Access Denied',
                text: 'We were unable to access your video or audio inputs. Please grant microphone and camera permissions in your browser bar.',
                confirmButtonColor: '#6366f1',
            });
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
        // getUserMedia();
    }
    let handleAudio = () => {
        setAudio(!audio)
        // getUserMedia();
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        if (!username.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Username Required',
                text: 'Please enter a display name to enter the call session.',
                confirmButtonColor: '#6366f1',
            });
            return;
        }
        setAskForUsername(false);
        getMedia();
    };


    return (
        <ThemeProvider theme={customTheme}>
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

                {askForUsername === true ?

                    /* Beautiful two-column entrance Lobby screen */
                    <div style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(6, 182, 212, 0.04) 100%)',
                    }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                            gap: { xs: '2rem', md: '3.5rem' },
                            maxWidth: '960px',
                            width: '100%',
                            background: '#ffffff',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '32px',
                            boxShadow: '0 30px 60px -15px rgba(99, 102, 241, 0.08)',
                            padding: { xs: '2rem', md: '3rem' },
                            alignItems: 'center'
                        }}>
                            {/* Left Side: Camera Preview */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, letterSpacing: '-0.5px' }}>
                                    Lobby Camera Preview
                                </Typography>
                                
                                <Box sx={{ 
                                    position: 'relative', 
                                    width: '100%', 
                                    aspectRatio: '16/9', 
                                    border: '1px solid rgba(226, 232, 240, 0.6)',
                                    borderRadius: '20px', 
                                    overflow: 'hidden', 
                                    background: '#0f172a',
                                    boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <video 
                                        ref={localVideoref} 
                                        autoPlay 
                                        muted 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 12,
                                        left: 12,
                                        bgcolor: 'rgba(15, 23, 42, 0.75)',
                                        color: '#ffffff',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        Self View
                                    </Box>
                                </Box>
                            </Box>

                            {/* Right Side: Setup Username & Connect */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                                <div>
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-1.2px', mb: 1, lineHeight: 1.2 }}>
                                        Join Meeting Room
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, lineHeight: 1.5 }}>
                                        Enter your display name to present to peers in the call.
                                    </Typography>
                                </div>

                                <TextField 
                                    fullWidth 
                                    id="username-lobby" 
                                    label="Username" 
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)} 
                                    variant="outlined" 
                                    autoFocus
                                    placeholder="e.g. John Doe"
                                    inputProps={{ style: { fontWeight: 600 } }}
                                />

                                <Button 
                                    fullWidth
                                    variant="contained" 
                                    onClick={connect}
                                    disabled={!username.trim()}
                                    sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700, boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)' }}
                                >
                                    Enter Room Lobby
                                </Button>
                            </Box>
                        </Box>
                    </div> :


                    /* Sleek Light active video meeting conference layout */
                    <div className={styles.meetVideoContainer}>

                        {showModal ? (
                            <div className={styles.chatRoom}>
                                <div className={styles.chatContainer}>
                                    <h1>Room Chat</h1>

                                    {/* Scrollable message displays */}
                                    <div className={styles.chattingDisplay}>
                                        {messages.length !== 0 ? messages.map((item, index) => {
                                            const isSelf = item.sender === username;
                                            return (
                                                <div 
                                                    className={`${styles.messageBubble} ${isSelf ? styles.messageSelf : styles.messageOther}`} 
                                                    key={index}
                                                >
                                                    <div className={styles.messageBubbleSender}>{item.sender}</div>
                                                    <div className={styles.messageBubbleText}>{item.data}</div>
                                                </div>
                                            )
                                        }) : (
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, gap: 1 }}>
                                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>No Messages Yet</Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Be the first to say hello!</Typography>
                                            </Box>
                                        )}
                                    </div>

                                    {/* Action message textfields */}
                                    <div className={styles.chattingArea}>
                                        <TextField 
                                            fullWidth
                                            size="small"
                                            value={message} 
                                            onChange={(e) => setMessage(e.target.value)} 
                                            placeholder="Type a message..."
                                            variant="outlined" 
                                        />
                                        <Button 
                                            variant='contained' 
                                            onClick={sendMessage}
                                            disabled={!message.trim()}
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : <></>}


                        {/* Floating bottom Apple-style dock bar */}
                        <div className={styles.buttonContainers}>
                            <IconButton 
                                onClick={handleVideo} 
                                sx={{ color: video === true ? "#6366f1" : "#64748b", bgcolor: video === true ? "rgba(99, 102, 241, 0.08)" : "transparent" }}
                            >
                                {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                            </IconButton>
                            
                            <IconButton 
                                onClick={handleEndCall} 
                                sx={{ 
                                    color: "#ef4444", 
                                    bgcolor: "rgba(239, 68, 68, 0.08)",
                                    border: "1px solid rgba(239, 68, 68, 0.15)",
                                    '&:hover': { bgcolor: "rgba(239, 68, 68, 0.15)" }
                                }}
                            >
                                <CallEndIcon />
                            </IconButton>

                            <IconButton 
                                onClick={handleAudio} 
                                sx={{ color: audio === true ? "#6366f1" : "#64748b", bgcolor: audio === true ? "rgba(99, 102, 241, 0.08)" : "transparent" }}
                            >
                                {audio === true ? <MicIcon /> : <MicOffIcon />}
                            </IconButton>

                            {screenAvailable === true ? (
                                <IconButton 
                                    onClick={handleScreen} 
                                    sx={{ color: screen === true ? "#06b6d4" : "#64748b", bgcolor: screen === true ? "rgba(6, 182, 212, 0.08)" : "transparent" }}
                                >
                                    {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                </IconButton>
                            ) : <></>}

                            <Badge badgeContent={newMessages} max={99} color='error'>
                                <IconButton 
                                    onClick={() => setModal(!showModal)} 
                                    sx={{ color: showModal ? "#6366f1" : "#64748b", bgcolor: showModal ? "rgba(99, 102, 241, 0.08)" : "transparent" }}
                                >
                                    <ChatIcon />
                                </IconButton>
                            </Badge>
                        </div>


                        {/* Local Video floating picture-in-picture stream */}
                        <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                        {/* Video grids for remote call participants */}
                        <div className={styles.conferenceView}>
                            {videos.map((video) => (
                                <div key={video.socketId}>
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                    />
                                    {/* Premium glass name badge for remote video feed */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 12,
                                        left: 12,
                                        bgcolor: 'rgba(15, 23, 42, 0.65)',
                                        color: '#ffffff',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        backdropFilter: 'blur(4px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        pointerEvents: 'none'
                                    }}>
                                        Peer Connection
                                    </Box>
                                </div>
                            ))}
                        </div>

                    </div>

                }

            </div>
        </ThemeProvider>
    )
}
