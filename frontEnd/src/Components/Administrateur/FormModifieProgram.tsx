import React, { useState, FormEvent } from "react";
import { DetailedWorkshop } from "../../types/programs";
import { Calendar, Clock, Save, Users } from "lucide-react";
import { updateProgramme } from "../../api/programs";
import { useAuth } from "../../Context/AuthContext";
interface FormProps {
  modifiedProgram: DetailedWorkshop;
  onCancel: (selectedProgram: DetailedWorkshop | null) => void;
  onUpdate: () => void;
}
export const FormModifieProgram: React.FC<FormProps> = ({
  modifiedProgram,
  onCancel,
  onUpdate,
}) => {
  const { setAlertInfo } = useAuth();
  const [status, setStatus] = useState(modifiedProgram.status);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status == modifiedProgram.status) {
      setAlertInfo({
        message: "Il conserve le même statut avec ce programme.",
        type: "warning",
      });
      return;
    }

    try {
      console.log("submit data : ", status);
      const isUpdated = await updateProgramme(modifiedProgram.id, {
        status: status,
      });

      if (isUpdated) {
        setAlertInfo({ message: "Mise à jour avec succès", type: "success" });
        onUpdate();
        onCancel(null);
      } else {
        setAlertInfo({
          message: "Échec de la mise à jour du programme",
          type: "error",
        });
      }
    } catch (error: any) {
      setAlertInfo({
        message:
          error.response?.data?.detail ||
          error.message ||
          "Une erreur est survenue lors de la modification.",
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {modifiedProgram.name}
        </h2>
        {modifiedProgram.theme && (
          <p className="text-lg text-indigo-600 font-medium">
            {modifiedProgram.theme}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <div className="text-sm">
            Commence le :
            {new Date(modifiedProgram.creation_date).toLocaleDateString(
              "fr-FR",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              }
            )}
          </div>
        </div>
        <div className="flex items-center">
          <p>Status:</p>
          <select
            name="status"
            value={status}
            onChange={handleStatusChange}
            className="w-full ml-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          >
            <option value="cancelled">Annulé</option>
            <option value="in_progress">En attente</option>
            <option value="confirmed">Confirmé</option>
          </select>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <div className="text-sm">2 heures</div>
        </div>
        <div className="flex items-center">
          <Users className="h-5 w-5 text-gray-400 mr-2" />
          <div className="text-sm">
            {String(modifiedProgram.current_participant_count)} /{" "}
            {String(modifiedProgram.nb_participants_max)} participants
          </div>
        </div>
      </div>

      {modifiedProgram.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{modifiedProgram.description}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {modifiedProgram.name === "Talk" ? "Panélistes" : "Animateur"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={`${modifiedProgram.animateur.photo}?w=80&h=80&fit=crop`}
              alt={modifiedProgram.animateur.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{modifiedProgram.animateur.name}</p>
              <p className="text-sm text-gray-600">
                {modifiedProgram.animateur.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="w-20 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition font-semibold mr-4"
        >
          <Save className="h-5 w-5 inline" />
        </button>
        <button
          onClick={() => onCancel(null)}
          className="w-20 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Fermer
        </button>
      </div>
    </form>
  );
};
