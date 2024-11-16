import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthService from "./AuthService";
import ApiClient from "./services/ApiClient";

function useApiInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    ApiClient.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          AuthService.logoutUser();
          navigate("/login", {
            state: { message: "Vaše relace vypršela. Přihlaste se znovu." },
          });
        }
        return Promise.reject(error);
      }
    );
  }, [navigate]);
}

export default useApiInterceptor;
