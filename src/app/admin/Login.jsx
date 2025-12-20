import React, { useState } from "react";
import InputField from "../../components/ui/form/Input";
import Button from "../../components/ui/Button";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loginMutation] = useLoginMutation();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const errors = {
      email: "",
      password: "",
    };
    if (!userData.email) {
      errors.email = "Email is required";
    }

    if (!userData.password) {
      errors.password = "Password is required";
    }
    setError(errors);
    return Object.values(errors).some((error) => error);
  };

  const handleLogin = async () => {
    if (validate()) return;
    try {
      const response = await loginMutation(userData).unwrap();
      if (response.statusCode === 200) {
        toast.success("Login successful");
        sessionStorage.setItem("token", response.data.accessToken);
        navigate("/ed/admin/home");
      }
    } catch (error) {
      if (error.status === 401) {
        toast.error("Invalid credentials");
      }
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="min-w-96 mx-auto shadow-lg space-y-5 bg-white rounded-md p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <InputField
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          error={error.email}
        />
        <InputField
          type="password"
          placeholder="Password"
          name="password"
          id="password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          error={error.password}
        />
        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
