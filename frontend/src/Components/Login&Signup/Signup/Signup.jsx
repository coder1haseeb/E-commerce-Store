import React, {useState} from 'react'
import './Signup.css'

import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import axios from 'axios'

import { IoChevronBack } from "react-icons/io5";


const Signup = () => {
    const [name , setName] = useState("")
    const [username , setUserName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [password_confirmation , setPasswordConfirmation] = useState("")
    const [image , setImage] = useState()
    const navigate = useNavigate();

    const formData = new FormData()
    formData.append('user[name]' , name)
    formData.append('user[username]' , username)
    formData.append('user[email]' , email)
    formData.append('user[password]' , password)
    formData.append('user[password_confirmation]' , password_confirmation)
    formData.append('user[role]' , "user")
    // formData.append('user[image]' , image)

    // const data = {
    //     "user" : {
    //         name : name,
    //         username : username,
    //         email : email,
    //         password : password,
    //         password_confirmation : password_confirmation, 
    //         role : "user"
    //     }
    // }    
    const handleLogin =  () =>{
        axios.post(`${process.env.REACT_APP_API_URL}/users/` , formData).then((res) =>{
            // console.log(res)
            const token = res.headers.authorization
            const user = JSON.stringify(res.data.status.data)
            localStorage.setItem("Token" , token)
            localStorage.setItem("User" , user)
            toast.success(res.data.status.message)
            setTimeout(() => {
                navigate("/products")
            }, 1000);
        }).catch((err) => {
            toast.error(err.message)
            console.log(err);
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
                    Create Account !
                </h1>
            </div>
            <div className="lower_div_inner_form_div_for_api_user">
                <div className="form-floating mb-3">
                    <input type="email" value={name} onChange={(e) => {setName(e.target.value)}} className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label for="floatingInput">Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" value={username} onChange={(e) => {setUserName(e.target.value)}} className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label for="floatingInput">Username</label>
                </div>
                {/* <div className="form-floating mb-3">
                    <input type="file" value={image} onChange={(e) => {setImage(e.target.value)}} className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label for="floatingInput">Image</label>
                </div> */}
                <div className="form-floating mb-3">
                    <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} className="form-control" id="floatingInput" placeholder="name@example.com" />
                    <label for="floatingInput">Email address</label>
                </div>
                <div className="form-floating" style={{marginBottom : "1rem"}}>
                    <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} className="form-control" id="floatingPassword" placeholder="Password" />
                    <label for="floatingPassword">Password (Atleat 6 digits)</label>
                </div>
                <div className="form-floating">
                    <input type="password" value={password_confirmation} onChange={(e) => {setPasswordConfirmation(e.target.value)}} className="form-control" id="floatingPassword" placeholder="Password" />
                    <label for="floatingPassword">Password Confirmation</label>
                </div>
                <button className='action_button_for_user_api_form' onClick={handleLogin}>Sign Up</button>
            </div>
            <div className="click_here_to_jump_div_user_api" onClick={() => navigate("/login")}>
                Already member? Login instead.
            </div>
        </div>
    </div>
  )
}

export default Signup