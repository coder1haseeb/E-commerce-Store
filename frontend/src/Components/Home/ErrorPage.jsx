import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigate = useNavigate()
  return (
    <div>
        <div style={{textAlign: "center", fontSize : "2rem", fontWeight: "bold" , marginTop : "12rem" , }}>Unauthorized User. This is for only Admins.</div>
        <button 
            style = {
                    {
                        position : "relative" , 
                        left : "50%" , 
                        transform : "translate(-50%)" , 
                        top : "2rem"
                    }
                }
                className='btn btn-danger'
                onClick={()=>{
                    navigate("/")
                }}
        >
            Return
        </button>
    </div>
  )
}

export default ErrorPage