// // src/pages/AdminLogin.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { login, clearError } from "../features/auth/authSlice";
// import Alert from "../components/common/Alert";

// function AdminLogin() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, isAuthenticated, user } = useSelector(
//     (state) => state.auth
//   );

//   useEffect(() => {
//     // Redirect if already logged in and is admin
//     if (isAuthenticated) {
//       if (user && (user.role === "admin" || user.role === "admitty_manager")) {
//         navigate("/admin-dashboard");
//       } else {
//         // If logged in but not admin, show error
//         setFormErrors({
//           general: "You don't have permission to access the admin area",
//         });
//       }
//     }

//     // Clear errors when component unmounts
//     return () => {
//       dispatch(clearError());
//     };
//   }, [isAuthenticated, navigate, dispatch, user]);

//   const validateForm = () => {
//     const errors = {};

//     if (!formData.email) {
//       errors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       dispatch(login(formData));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <div className="bg-white p-8 rounded-lg shadow-md border border-reddit-border">
//         <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
//         <p className="text-gray-600 text-sm mb-6 text-center">
//           Login to access the Admitty Manager dashboard
//         </p>

//         {error && <Alert type="error" message={error} />}
//         {formErrors.general && (
//           <Alert type="error" message={formErrors.general} />
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className={`input ${formErrors.email ? "border-red-500" : ""}`}
//               value={formData.email}
//               onChange={handleChange}
//               disabled={loading}
//             />
//             {formErrors.email && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
//             )}
//           </div>

//           <div className="mb-6">
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className={`input ${formErrors.password ? "border-red-500" : ""}`}
//               value={formData.password}
//               onChange={handleChange}
//               disabled={loading}
//             />
//             {formErrors.password && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-full"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Administrator Login"}
//           </button>
//         </form>

//         <div className="mt-4 text-center text-sm">
//           <p className="text-gray-600">
//             Return to{" "}
//             <a href="/login" className="text-reddit-orange hover:underline">
//               regular login
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLogin;

// src/pages/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/auth/authSlice";
import Alert from "../components/common/Alert";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Redirect if already logged in and is admin
    if (isAuthenticated) {
      if (user && (user.role === "admin" || user.role === "admitty_manager")) {
        navigate("/admin-dashboard");
      } else {
        // If logged in but not admin, show error
        setFormErrors({
          general: "You don't have permission to access the admin area",
        });
      }
    }

    // Clear errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch, user]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(login(formData));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Login to access the Admitty Manager dashboard
        </p>

        {error && <Alert type="error" message={error} />}
        {formErrors.general && (
          <Alert type="error" message={formErrors.general} />
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.email ? "border-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.password ? "border-red-500" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Administrator Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Return to{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              regular login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
