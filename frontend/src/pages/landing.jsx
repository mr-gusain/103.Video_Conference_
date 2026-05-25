import React from 'react';
import "../App.css";
import { Link, useNavigate } from 'react-router-dom';
import VideoCallIcon from '@mui/icons-material/VideoCall';
// import logo from '../logo.jpeg';
export default function LandingPage() {


    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <VideoCallIcon fontSize="large" sx={{ color: '#6366f1' }} />

                    <h2 style={{ margin: 0 }}>BHAGIDARI</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => {
                        router("/aljk23")
                    }}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                    <div onClick={() => {
                        router("/auth")

                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>


            <div className="landingMainContainer">
                <div>
                    <h1><span>Connect</span> with your loved Ones</h1>

                    <p>Cover a distance by Apna Video Call</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>

                    <img src="/logo3.png" alt="Bhagidari Logo" />

                </div>
            </div>



        </div>
    )
}
