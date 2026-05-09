import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../services/authConfig.js";

export default function SignIn() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center max-w-md mx-auto px-4 text-center">
      <div className="flex flex-col bg-white rounded-lg shadow-lg p-8 w-full bg-gradient-to-br from-blue-100 to-blue-200">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido a EduTech!</h2>
        <p className="mb-2 text-gray-600 text-justify">
          Para acceder a la plataforma, por favor inicia sesión con tu cuenta de Microsoft.{" "}
          <strong className="font-bold text-gray-900">
            No se permiten cuentas con el dominio de la universidad.
          </strong>
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center px-4 gap-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="w-5 h-5">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          Iniciar sesión con Microsoft
        </button>
      </div>
    </div>
  );
}
