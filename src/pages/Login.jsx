import React, { useState } from "react";
import axios from "axios";
import qs from 'qs'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

   const handleSubmit = async (e) => {
     e.preventDefault();

     const formData = {
       grant_type: "",
       username: email,
       password: password,
       scope: "",
       client_id: "",
       client_secret: "",
     };

     try {
       const response = await axios.post(
         "http://127.0.0.1:8000/workmateai/user/login",
         qs.stringify(formData),
         {
           headers: {
             "Content-Type": "application/x-www-form-urlencoded",
             Accept: "application/json",
           },
         }
       );
       console.log(response.data); // Handle success (e.g., save token, redirect)
     } catch (error) {
       console.log(error);
       setError(error.response?.data?.message || "Login failed");
     }
   };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center bg-slate-800">
      <div className="bg-slate-600 w-[400px] h-[500px] flex flex-col items-center justify-center p-4 rounded-lg">
        <h2 className="text-white text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">
              User name
            </label>
            <input
              type="text"
              id="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
