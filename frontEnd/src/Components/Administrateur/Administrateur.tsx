import React, { useState, useCallback, useEffect } from "react";
import { fetchDetailedProgram } from "../../api/programs";
import { DetailedWorkshop } from "../../types/programs";
import { FormModifieProgram } from "./FormModifieProgram";

const Administrateur: React.FC = () => {
  const [workshops, setWorkshops] = useState<DetailedWorkshop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modifiedProgram, setModifiedProgram] =
    useState<DetailedWorkshop | null>(null);

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching programs...");
      const data = await fetchDetailedProgram();
      setWorkshops(data || []);
    } catch (err: any) {
      console.error("Error fetching programs:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors du chargement des programmes."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const sortedWorkshops = workshops.reduce<{
    [key: string]: DetailedWorkshop[];
  }>((acc, workshop) => {
    if (workshop.status) {
      const status = String(workshop.status);
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(workshop);
    }
    return acc;
  }, {});

  console.log("Sorted Workshops:", sortedWorkshops);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Chargement des programmes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Administration des Programmes
        </h1>

        {Object.keys(sortedWorkshops).length === 0 && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
            <p className="text-gray-500 text-lg">
              Aucun programme trouvé ou catégorisé.
            </p>
          </div>
        )}

        {Object.entries(sortedWorkshops).map(([statusKey, workshopList]) => (
          <div
            key={statusKey}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 capitalize">
                {statusKey.toLowerCase().replace("_", " ")} (
                {workshopList.length})
              </h2>
            </div>

            {workshopList.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-2 px-2">
                {workshopList.map((workshop) => (
                  <div
                    key={workshop.id || workshop.name}
                    className="flex-shrink-0 w-80 md:w-96 bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-1 truncate"
                      title={workshop.name}
                    >
                      {workshop.name}
                    </h3>
                    {workshop.theme && (
                      <p className="text-indigo-600 font-medium mb-3 text-sm">
                        Thème: {workshop.theme}
                      </p>
                    )}

                    {/* Animateur */}
                    {workshop.animateur ? (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                          Animé par :
                        </p>
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              workshop.animateur.photo
                                ? `${workshop.animateur.photo}?w=48&h=48&fit=crop`
                                : "https://via.placeholder.com/48"
                            }
                            alt={workshop.animateur.name || "Animateur inconnu"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {workshop.animateur.name || "N/A"}
                            </p>
                            {workshop.animateur.role && (
                              <p className="text-xs text-gray-500">
                                {workshop.animateur.role}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-3 pt-3 border-t border-gray-200">
                        Aucun animateur assigné.
                      </p>
                    )}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md"
                        onClick={() => setModifiedProgram(workshop)}
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Aucun atelier dans la catégorie "{statusKey}".
              </p>
            )}
          </div>
        ))}
      </div>
      {modifiedProgram && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <FormModifieProgram
              modifiedProgram={modifiedProgram}
              onCancel={() => setModifiedProgram(null)}
              onUpdate={() => fetchPrograms()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrateur;
