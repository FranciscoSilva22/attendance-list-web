import axios from "axios";

const api = axios.create({
    baseURL: "https://attendance-list-api.onrender.com",
});

api.interceptors.response.use(
  response => response,
  error => {
    if(error.status == 401) {
        localStorage.clear();
        window.location.reload();
    }

    // Rejeitar o erro para continuar o fluxo do catch
    return Promise.reject(error);
  }
);

export default api;