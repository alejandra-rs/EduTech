import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectUniversity from "../components/degree-selection/SelectUniversity";
import { TwitchConnectButton } from "../components/TwitchConnectButton";
import SuccessToast from "../components/SuccessToast";
import {
  connectTwitch,
  getTwitchStatus,
  disconnectTwitch,
} from "../services/connections-streaming";
import { useCurrentUser } from "../services/useCurrentUser";
import { deleteUserAccount } from "../services/connections-students";

export default function ProfilePage() {
  const { userData: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [twitchData, setTwitchData] = useState<{
    connected: boolean;
    login: string | null;
  }>({
    connected: false,
    login: null,
  });
  const [isEditingCareer, setIsEditingCareer] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) return;

    getTwitchStatus(currentUser.id)
      .then((status) => {
        setTwitchData({
          connected: status.connected,
          login: status.connected ? status.login : null,
        });
      })
      .catch((err) => console.error("Error fetching Twitch status:", err));
  }, [currentUser?.id]);

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccount(currentUser!.id);
      console.log("Cuenta eliminada correctamente");
      setShowToast(true);
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err);
      setIsDeleting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona tus estudios, conexiones y los ajustes de tu cuenta.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Mis Estudios
              </h2>
            </div>
            {!isEditingCareer && (
              <button
                onClick={() => setIsEditingCareer(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Cambiar carrera
              </button>
            )}
          </div>

          <div className="p-6 bg-gray-50/50">
            {isEditingCareer ? (
              <div className="flex flex-col items-center animate-in fade-in duration-300">
                <SelectUniversity
                  userId={currentUser.id}
                  title="Actualiza tus estudios"
                  usuarioAceptado={() => setIsEditingCareer(false)}
                />
                <button
                  onClick={() => setIsEditingCareer(false)}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-800 underline"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                Tus estudios ya están configurados. Si cambias de grado o
                universidad, actualízalos aquí para ver las asignaturas
                correctas.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Conexiones
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Vincula tus cuentas para emitir tus sesiones de estudio.
          </p>

          <TwitchConnectButton
            userId={currentUser.id}
            twitchData={twitchData}
            setTwitchData={setTwitchData}
            connectTwitch={connectTwitch}
            variant="profile"
          />
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-1">
            Eliminar la cuenta
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor,
            asegúrate de estar seguro.
          </p>

          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="px-5 py-2.5 text-sm font-bold text-red-600 border-2 border-red-200 hover:border-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            {isDeleting ? "Eliminando..." : "Eliminar mi cuenta"}{" "}
          </button>
        </section>
      </div>
      {showToast && (
        <SuccessToast
          message="Cuenta eliminada correctamente. Redirigiendo..."
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
