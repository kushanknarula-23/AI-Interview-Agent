import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ImCross } from "react-icons/im";
import Auth from '../pages/Auth';
function Authmodel({ onClose }) {
    const { userData } = useSelector((state) => state.user)
    useEffect(() => {
        if (userData) {
            onClose()
        }
    }, [onClose, userData])
    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md py-4'>
            <div className='relative'>
                <button
                    onClick={onClose}
                    className='absolute top-8 right-10 md:text-black text-white'>
                    <ImCross />
                </button>
                <Auth/>
            </div>
        </div>
    )
}

export default Authmodel