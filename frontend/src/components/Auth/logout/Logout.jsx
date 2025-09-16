import React from 'react'
import './Logout.css'
import { useDispatch } from 'react-redux'
import { logout } from '../../../features/AuthSlice';
import { useNavigate } from 'react-router-dom';


function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            let result = await dispatch(logout())
            console.log('Result : ',result);
            
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            }
        }
        catch (error) {
            console.log('Error while dispatchin logout :',error);
        }
    }

    return (
        <button className='btn_logout' onClick={() => handleLogout()}>
            Logout
        </button>
    )
}

export default Logout
