import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokensAndLogin } from "./authSlice";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

export default function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {

    const handleCallback = async () => {
        const toastId = toast.loading("Verifying your email...",{
        position: 'bottom-right',})
      try {

        // get the things from  the links 
        const params = new URLSearchParams(location.search);
        const access = params.get("access");
        const refresh = params.get("refresh");

        // if refresh and access then sent the request to nackend with access token and if successful then redirected to the home page and logged in automatically 
        if (access && refresh) {
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);
          try {
            const response = await api.get("/auth/me/", {
              headers: {
                Authorization: `Bearer ${access}`,
                "Content-Type":"applications/json"
              },
            });

            const user = response.data;
            localStorage.setItem("user", JSON.stringify(user));

            dispatch(setTokensAndLogin({ access, refresh, user }));

            toast.update(toastId, {
              render: "Email verified successfully! Welcome! 🎉",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              closeOnClick: true,
            })

            navigate("/home");
          } catch (userFetchError) {
            console.error("Failed to fetch user data:", userFetchError);

            dispatch(setTokensAndLogin({ access, refresh }));

            toast.update(toastId, {
              render: "Login successful! 🎉",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              closeOnClick: true,
            })

            navigate("/home");
          }
        } else {
          console.log("Missing access or refresh token in URL");
          toast.update(toastId, {
            render: "Invalid verification link",
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
          })
          navigate("/login");
        }
      } catch (error) {
        console.log("Auth callback error:", error)

         toast.update(toastId, {
          render: "Authentication failed. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeOnClick: true,
        })
        navigate("/login");
      }
    };

    handleCallback();
  }, [location, dispatch, navigate]);

  return <Loader />;
}


// tldr: auth call back :-receiving and processing authentication tokens after an external verification process, leaving the user in a logged-out state even after they've successfully verified their email.