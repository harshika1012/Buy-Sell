
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Dashboard from './Dashboard';
import App from './App';
import { CheckHashedPassword, SendGetRequest, SendPostLoginRequest } from './requests';
import bcrypt from 'bcryptjs';
import './login.css';

function Login() {
  const [DBdata,setDBdata]  = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
  isAuthenticated: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputValue({
      ...inputValue,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (inputValue.email.trim() === '') {
      formErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@(students\.iiit\.ac\.in|research\.iiit\.ac\.in|iiit\.ac\.in)$/.test(inputValue.email)) {
      formErrors.email = 'Email must end with @students.iiit.ac.in or @research.iiit.ac.in';
    }
    
    if (inputValue.password.trim() === '') {
      formErrors.password = 'Password is required';
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };
  const SendToDBGET = async () => {
    try{
      const data = await SendGetRequest('/api/users');
      setDBdata(data);
      CheckForUser(data);
      console.log('Data From DB:',data);
    }catch(error){
      console.log("Error in GET from DB:",error);
    }
  };
  let flagUserExist = 0;
  const CheckForUser = async (data) => {
    let i = 0;
    console.log("Came to CheckForUser");
    console.log("Entered Data:",inputValue.email,inputValue.password);
    const hash = bcrypt.hashSync(inputValue.password, 10);
    for(i = 0 ; i<data.length ; i++){
      console.log("Data[i]:",data[i].Email);
      if(data[i].Email == inputValue.email){
        let isMatch = CheckHashedPassword(inputValue.password, data[i].Password);
        if(isMatch){
          console.log('User Found');
          flagUserExist = 1;
          break;
        }
        else{
          console.log('Password Incorrect');
          flagUserExist = 2;
          break;
        }
      }
    }
    console.log(flagUserExist);
    if(flagUserExist == 1){   // User already exists, Login
      console.log('Login Successful');
      // const userData = { ...data[i] };
      const userData = {
        Email: data[i].Email,
        FirstName: data[i].FirstName,
        LastName: data[i].LastName,
        Contact: data[i].Contact,
        Age: data[i].Age,
        Cart: data[i].Cart,
        Reviews: data[i].Reviews,
        Id : data[i]._id,
        Password : inputValue.password,
      };
      console.log('Data:',userData);
      const response = await SendPostLoginRequest('/api/users/api/login',userData);
      console.log("Response from Backend in login:",response);
      // ProfileGetDetails(userData);
      
      // navigate('/Profile');
      navigate('/Profile', { state: { userData } }); 
    }
    else if(flagUserExist == 2){ // Password Incorrect
      console.log('Password Incorrect');
      setErrorMessage('Password Incorrect');
    }
    else{ // Can't login , so register
      console.log('User not found, Please SignUp');
      setErrorMessage('User not found, Please SignUp');
      await delay(500);
      navigate('/'); 
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (validateForm()) { 
        // SendToDBGET();
    //   alert('Login Successful');
      // console.log(inputValue);
      // navigate('/Dashboard');
      console.log("inputvalue from login:",inputValue); 
      const response =await SendPostLoginRequest(inputValue);
      const token = response.data.token;
      const user = response.data.user;
      console.log("Data from login backend:",token,user);
      // navigate('/Dashboard');
      const userData = {
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Contact: user.Contact,
        Age: user.Age,
        Cart: user.Cart,
        Reviews: user.Reviews,
        Id : user._id,
        Password : user.Password,
      };
      console.log("Data that is going to send to profile:",userData);
      navigate('/Profile');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
    // window.location.href = '/Login'; // Redirect to login page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputValue.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <p>{errors.email}</p>}

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputValue.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errors.password && <p>{errors.password}</p>}
          <br></br><br></br>
          <button type="submit">Submit</button>
        </form><br></br>
        {/* <button className="logout-button">
          <a href="/">Logout</a>
        </button> */}
        <p>Don't have an account? <a href="/">SignUp</a></p><br></br>
      </div>
    </div>
  );
}



export default Login;
