import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) {
        navigate("/Dash");
      } else {
        alert("Login Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      
      {/* Background Effects */}
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">
          Welcome Back 👋
        </h1>

        <p className="text-slate-400 text-center mt-2 mb-8">
          Login to manage your shortened URLs
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition"
          />

          <button
            onClick={login}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg"
          >
            Login
          </button>

        </div>

        <div className="mt-5 text-center">
          <span
            onClick={() => navigate("/reset-password")}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            Forgot Password?
          </span>
        </div>

        <div className="mt-4 text-center text-slate-400">
          Don't have an account?
          <span
            onClick={() => navigate("/")}
            className="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
          >
            Signup
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;