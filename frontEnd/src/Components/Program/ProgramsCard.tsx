import { Users, ChevronRight } from "lucide-react";
import { Session } from "../../types/programs";
import { formatDate } from "../../utils/D_formatters";

interface ProgramCardProps {
  session: Session;
  onReserve: () => void;
  onView: () => void;
}

export function ProgramCard({ session, onReserve, onView }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-sm text-gray-600 mb-2">
        {formatDate(session.date)}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-1">
        {session.type}
      </h3>
      {session.theme && (
        <p className="text-indigo-600 font-medium mb-2">{session.theme}</p>
      )}

      {/* Animateurs */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {session.type === "Talk" ? "Panélistes" : "Animateur"}
        </h4>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <img
              src={`${session.animateur.photo}?w=40&h=40&fit=crop`}
              alt={session.animateur.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{session.animateur.name}</p>
              <p className="text-xs text-gray-500">{session.animateur.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Users className="h-4 w-4 mr-1" />
        <span>
          {session.current_participant_count} / {session.availableSpots}{" "}
          participants
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onReserve()}
          disabled={session.current_participant_count >= session.availableSpots}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Réserver
        </button>
        <button
          onClick={onView}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <span className="mr-1">Voir</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
