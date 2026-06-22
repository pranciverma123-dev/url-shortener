import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const res = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
        }),
      });

      if (res.ok) {
        alert("Signup Successful");
        navigate("/Dash");
      } else {
        alert(await res.text());
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-4 relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full -bottom-40 -right-40"></div>

      <div className="relative w-full max-w-md">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(99,102,241,0.3)]">

          <div className="text-center mb-8">
            <div className="text-5xl mb-3"></div>

            <h1 className="text-4xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-slate-400 mt-2">
              Advanced URL Management Platform
            </p>
          </div>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-3 rounded-xl focus:border-indigo-500 outline-none"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-3 rounded-xl focus:border-indigo-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-3 rounded-xl focus:border-indigo-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700 text-white px-4 py-3 rounded-xl focus:border-indigo-500 outline-none"
            />

            <button
              onClick={signup}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 transition duration-300"
            >
              Create Account
            </button>
          </div>

          <div className="text-center mt-6 text-slate-400">
            Already have an account?

            <span
              onClick={() => navigate("/login")}
              className="ml-2 text-indigo-400 cursor-pointer hover:text-indigo-300"
            >
              Login
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Signup;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Signup() {
//   const navigate = useNavigate();

//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const signup = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/user/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           firstname,
//           lastname,
//           email,
//           password
//         })
//       });

//       if (res.ok) {
//         alert("Signup Successful");
//         navigate("/Dash");
//       } else {
//         alert(await res.text());
//       }

//     } 
//     catch (err) {
//       console.log(err);
//       alert("Server Error");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <h2>Create Account</h2>

//         <input
//           placeholder="First Name"
//           onChange={(e) => setFirstname(e.target.value)}
//         />

//         <input
//           placeholder="Last Name"
//           onChange={(e) => setLastname(e.target.value)}
//         />

//         <input
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={signup}>
//           Signup
//         </button>

//         <p>
//           Already have an account?
//           <span
//             style={{ color: "skyblue", cursor: "pointer" }}
//             onClick={() => navigate("/login")}
//           >
//             {" "}Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;