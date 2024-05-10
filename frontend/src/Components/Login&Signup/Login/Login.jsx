import React, { useState } from 'react'
import './Login.css'
import { redirect, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import axios from 'axios'

import { IoChevronBack } from "react-icons/io5";


const Login = () => {
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const navigate = useNavigate();
    const data = {
        "user" : {
            email : email,
            password : password
        }
    }
    const handleLogin =  () =>{
        axios.post(`${process.env.REACT_APP_API_URL}/users/sign_in` , data).then((res) =>{
            // console.log(res)
            const token = res.headers.authorization
            const user = JSON.stringify(res.data.status.data)
            localStorage.setItem("Token" , token)
            localStorage.setItem("User" , user)
            toast.success(res.data.status.message)
            // console.log(user);
            setTimeout(()=>{
                navigate("/products")
            },[1000])
        }).catch((err) => {
            toast.error(err.message)
        })
    }
    return (
        <div className='login_page_main_div'>
            <div className="top_heading_for_back_buttton_login_page">
                <span onClick={()=> navigate("/")}><IoChevronBack /> Back</span>
            </div>
            <div className="lower_div_for_form_for_api_user">
                <div className="top_headin_for_the_user_api">
                    <h1>
                        Login Here!
                    </h1>
                </div>
                <div className="lower_div_inner_form_div_for_api_user">
                        <div className="form-floating mb-3">
                            <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control" id="floatingInput" placeholder="name@example.com" />
                            <label for="floatingInput">Email address</label>
                        </div>
                    <div className="form-floating">
                        <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control" id="floatingPassword" placeholder="Password" />
                        <label for="floatingPassword">Password</label>
                    </div>
                    <button className='action_button_for_user_api_form' onClick={handleLogin}>Login</button>
                </div>
                <div className="click_here_to_jump_div_user_api" onClick={() => navigate("/signup")}>
                    Click here to create an account.
                </div>
            </div>
        </div>
    )
}

export default Login