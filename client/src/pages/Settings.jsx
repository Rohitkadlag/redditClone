// // src/pages/Settings.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import Alert from "../components/common/Alert";
// import Loading from "../components/common/Loading";
// import { getCurrentUser } from "../features/auth/authSlice";
// import api from "../services/api";

// function Settings() {
//   const { user, loading: authLoading } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     bio: "",
//     avatar: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [formErrors, setFormErrors] = useState({});
//   const [passwordErrors, setPasswordErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Populate form with current user data
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         bio: user.bio || "",
//         avatar: user.avatar || "",
//       });
//     }
//   }, [user]);

//   // Handle profile form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle password form input changes
//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData({ ...passwordData, [name]: value });
//   };

//   // Validate profile form
//   const validateProfileForm = () => {
//     const errors = {};

//     if (formData.bio.length > 200) {
//       errors.bio = "Bio cannot exceed 200 characters";
//     }

//     // Add more validation as needed

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Validate password form
//   const validatePasswordForm = () => {
//     const errors = {};

//     if (!passwordData.currentPassword) {
//       errors.currentPassword = "Current password is required";
//     }

//     if (!passwordData.newPassword) {
//       errors.newPassword = "New password is required";
//     } else if (passwordData.newPassword.length < 6) {
//       errors.newPassword = "Password must be at least 6 characters";
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }

//     setPasswordErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // Handle profile update submission
//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateProfileForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const response = await api.put("/users/profile", formData);

//       // Update user in redux state
//       dispatch(getCurrentUser());

//       setSuccessMessage("Profile updated successfully");
//       setIsLoading(false);
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message || "Failed to update profile"
//       );
//       setIsLoading(false);
//     }
//   };

//   // Handle password update submission
//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();

//     if (!validatePasswordForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       await api.put("/auth/password", passwordData);

//       setSuccessMessage("Password updated successfully");
//       setPasswordData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setIsLoading(false);
//     } catch (error) {
//       setErrorMessage(
//         error.response?.data?.message || "Failed to update password"
//       );
//       setIsLoading(false);
//     }
//   };

//   // Handle account deletion
//   const handleDeleteAccount = async () => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete your account? This action cannot be undone."
//       )
//     ) {
//       try {
//         await api.delete("/users/account");
//         // Log out and redirect to home
//         // This would typically be handled by your logout function
//         localStorage.removeItem("token");
//         navigate("/");
//         window.location.reload();
//       } catch (error) {
//         setErrorMessage(
//           error.response?.data?.message || "Failed to delete account"
//         );
//       }
//     }
//   };

//   if (authLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-8 px-4">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">
//         Account Settings
//       </h1>

//       {errorMessage && <Alert type="error" message={errorMessage} />}
//       {successMessage && <Alert type="success" message={successMessage} />}

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

//         <form onSubmit={handleProfileSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Username
//             </label>
//             <input
//               type="text"
//               className="input bg-gray-100"
//               value={user?.username || ""}
//               disabled
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Username cannot be changed
//             </p>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               className="input bg-gray-100"
//               value={user?.email || ""}
//               disabled
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Email cannot be changed
//             </p>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Bio
//             </label>
//             <textarea
//               name="bio"
//               rows="3"
//               className={`input ${formErrors.bio ? "border-red-500" : ""}`}
//               value={formData.bio}
//               onChange={handleChange}
//               placeholder="Tell us about yourself"
//             ></textarea>
//             {formErrors.bio && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.bio}</p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.bio.length}/200 characters
//             </p>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Avatar URL
//             </label>
//             <input
//               type="text"
//               name="avatar"
//               className={`input ${formErrors.avatar ? "border-red-500" : ""}`}
//               value={formData.avatar}
//               onChange={handleChange}
//               placeholder="https://example.com/avatar.jpg"
//             />
//             {formErrors.avatar && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.avatar}</p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               Enter a URL to an image for your profile
//             </p>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isLoading}
//             >
//               {isLoading ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Change Password</h2>

//         <form onSubmit={handlePasswordSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Current Password
//             </label>
//             <input
//               type="password"
//               name="currentPassword"
//               className={`input ${
//                 passwordErrors.currentPassword ? "border-red-500" : ""
//               }`}
//               value={passwordData.currentPassword}
//               onChange={handlePasswordChange}
//             />
//             {passwordErrors.currentPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {passwordErrors.currentPassword}
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>
//             <input
//               type="password"
//               name="newPassword"
//               className={`input ${
//                 passwordErrors.newPassword ? "border-red-500" : ""
//               }`}
//               value={passwordData.newPassword}
//               onChange={handlePasswordChange}
//             />
//             {passwordErrors.newPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {passwordErrors.newPassword}
//               </p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm New Password
//             </label>
//             <input
//               type="password"
//               name="confirmPassword"
//               className={`input ${
//                 passwordErrors.confirmPassword ? "border-red-500" : ""
//               }`}
//               value={passwordData.confirmPassword}
//               onChange={handlePasswordChange}
//             />
//             {passwordErrors.confirmPassword && (
//               <p className="text-red-500 text-xs mt-1">
//                 {passwordErrors.confirmPassword}
//               </p>
//             )}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Password"}
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>

//         <div className="border border-red-200 rounded-md p-4 bg-red-50">
//           <h3 className="text-lg font-medium text-red-800 mb-2">
//             Delete Account
//           </h3>
//           <p className="text-sm text-red-600 mb-4">
//             Once you delete your account, there is no going back. Please be
//             certain.
//           </p>
//           <button
//             type="button"
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//             onClick={handleDeleteAccount}
//           >
//             Delete Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Settings;

// src/pages/Settings.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";
import { getCurrentUser } from "../features/auth/authSlice";
import api from "../services/api";

function Settings() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    bio: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        avatar: user.avatar || "",
      });

      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  // Handle profile form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if file is an image
      if (!file.type.match("image.*")) {
        setFormErrors({
          ...formErrors,
          avatar: "Please select an image file (JPEG, PNG, etc.)",
        });
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          avatar: "Image size should be less than 5MB",
        });
        return;
      }

      setUploadedFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setFormErrors({
        ...formErrors,
        avatar: null,
      });
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};

    if (formData.bio.length > 200) {
      errors.bio = "Bio cannot exceed 200 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let updatedData = { ...formData };

      // If we have a file to upload, handle that first
      if (uploadedFile) {
        const formDataFile = new FormData();
        formDataFile.append("avatar", uploadedFile);

        const uploadResponse = await api.post(
          "/users/avatar-upload",
          formDataFile,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Get the avatar URL from response and update form data
        updatedData.avatar = uploadResponse.data.avatarUrl;
      }

      // Now update the user profile with all data
      const response = await api.put("/users/profile", updatedData);

      // Update user in redux state
      dispatch(getCurrentUser());

      setSuccessMessage("Profile updated successfully");
      setIsLoading(false);

      // Clear the uploaded file state
      setUploadedFile(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile"
      );
      setIsLoading(false);
    }
  };

  // Handle password update submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.put("/auth/password", passwordData);

      setSuccessMessage("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update password"
      );
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await api.delete("/users/account");
        // Log out and redirect to home
        // This would typically be handled by your logout function
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to delete account"
        );
      }
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h1>

      {errorMessage && <Alert type="error" message={errorMessage} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <form onSubmit={handleProfileSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Picture
            </label>

            <div className="flex items-center">
              {/* Avatar preview */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-6 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Visible upload button */}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Avatar
                </button>

                {uploadedFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {uploadedFile.name}
                  </p>
                )}

                {formErrors.avatar && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.avatar}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size: 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="input bg-gray-100"
              value={user?.username || ""}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Username cannot be changed
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="input bg-gray-100"
              value={user?.email || ""}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows="3"
              className={`input ${formErrors.bio ? "border-red-500" : ""}`}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            ></textarea>
            {formErrors.bio && (
              <p className="text-red-500 text-xs mt-1">{formErrors.bio}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/200 characters
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              className={`input ${
                passwordErrors.currentPassword ? "border-red-500" : ""
              }`}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              className={`input ${
                passwordErrors.newPassword ? "border-red-500" : ""
              }`}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`input ${
                passwordErrors.confirmPassword ? "border-red-500" : ""
              }`}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>

        <div className="border border-red-200 rounded-md p-4 bg-red-50">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Delete Account
          </h3>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
