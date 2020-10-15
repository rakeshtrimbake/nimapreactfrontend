import React, { useState } from "react";
import "./Signup.css";
import axios from "./../axios";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
} from "@material-ui/core";
import {useHistory} from 'react-router-dom';

function Signup() {
  const history = useHistory();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [isLogin,setIsLogin] = useState(false);
  const [state,dispatch] = useState('');


  const userAdd = async (e) => {
    e.preventDefault();
   
    if(!email || !password ){
    return alert("Please fill all the fields");
    
    }
    const user = await axios.post('/signup',{
      email,
      password
    });
    if(user.data.error) return alert(user.data.error.message);
    dispatch({
      type:"ADD_USER",
      user:user.data
    }
    )
     localStorage.setItem('jwtAuthTokenSecret',user.data.token);
    setEmail('');
    setPassword('');
    history.push('/home')  
  }

  const login = async (e) => {
    e.preventDefault();
    if(!email || !password ){
     return alert("Please fill all the fields");
      
    }
    const user = await axios.post('/login',{
      email,
      password
    });

    if(user.data.error) return alert(user.data.error.message);

    localStorage.setItem('jwtAuthTokenSecret',user.data.token);
    setEmail('');
    setPassword('');
    history.push('/home')  
  }

  return (
    <div className="signup">
      <div className="signup__text">
        <span>User {isLogin ? "Login" :"Registration"}</span>
      </div>
      <form className="signup__form">
        <FormControl className="signup__input">
          <InputLabel>Email Address</InputLabel>
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormHelperText id="my-helper-text">
            We'll never share your email.
          </FormHelperText>
        </FormControl>
        <FormControl className="signup__input">
          <InputLabel>Password</InputLabel>
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        {
          isLogin ? <Button
          className="signup__submit"
          type="submit"
          variant="contained"
          color="primary"
          onClick={login}
        >
         LOGIN 
        </Button>
        :
        <Button
          className="signup__submit"
          type="submit"
          variant="contained"
          color="primary"
          onClick={userAdd}
        >
         SIGNUP 
        </Button>
}
      </form>
      <div className="signup__footer">
        Are you already register? <span style={{cursor:"pointer"}} onClick={() => setIsLogin(true)}>login here</span> 
      </div>
      
    </div>
  )
}

export default Signup
