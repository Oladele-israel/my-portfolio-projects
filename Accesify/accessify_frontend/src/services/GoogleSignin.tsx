import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (response) => {
        console.log("Login Success:", response);

        try {
          // Send the Google ID token to the backend
          const res = await axios.post(
            "http://localhost:5000/auth/google/token",
            { credential: response.credential },
            { withCredentials: true }
          );

          console.log("Backend response:", res.data);

          if (res.data.message === "User authenticated successfully") {
            // Redirect to the dashboard or home page
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error sending credential to backend:", error);
        }
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
