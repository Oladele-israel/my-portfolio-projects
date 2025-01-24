import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const navigate = useNavigate();
  return (
    <GoogleLogin
      onSuccess={(response) => {
        console.log("Login Success:", response);

        // Send the credential to the backend for verification
        fetch("http://localhost:5000/user/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("Backend response:", data);
            if (data.message === "User registered successfully") {
              // Handle successful registration (e.g., redirect to dashboard)
              navigate("/dashboard");

              console.log("User data:", data.user);
            } else {
              console.error("Error:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error sending credential to backend:", error);
          });
      }}
      onError={() => {
        console.log("Login Failed");
      }}
      useOneTap // Enable One Tap Sign-In
      theme="filled_blue" // Customize the theme
      size="large" // Customize the size
      shape="pill" // Customize the shape
      text="signin_with" // Customize the text
    />
  );
};

export default GoogleSignIn;
