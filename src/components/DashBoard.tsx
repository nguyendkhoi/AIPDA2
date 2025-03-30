import {ParticipationType, Session} from "../types.ts";
import {Calendar, CheckCircle, Clock, Users} from "lucide-react";


interface DashboardProps {
    participationType?: ParticipationType;
    sessions: Session[];
    userName?: string;
}


//'la page a meme si et seulement si le user et le showDashboard est visible '
const DashBoard = ({ participationType, sessions, userName }: DashboardProps) => {

    const currentDate = new Date(); // Calculer une seule fois la date actuelle

    const upcomingSessions = sessions
        .filter(session => new Date(session.date) > currentDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pastSessions = sessions
        .filter(session => new Date(session.date) <= currentDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-8">
                {/*C'est ini quand va instaurer le faire que l'animateur va créer le truc */}


                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Tableau de bord {participationType === 'Animateur' ? 'Animateur' : 'Participant'}
                    </h2>
                    <p className="text-gray-600">
                        Bienvenue, {userName}
                    </p>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-indigo-50 rounded-lg p-6">
                        <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Sessions à venir</h3>
                        </div>
                        <p className="text-3xl font-bold text-indigo-600">{upcomingSessions.length}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Sessions passées</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{pastSessions.length}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center mb-2">
                            <Clock className="h-5 w-5 text-purple-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Heures totales</h3>
                        </div>
                        <p className="text-3xl font-bold text-purple-600">
                            {(upcomingSessions.length + pastSessions.length) * 2}h
                        </p>
                    </div>
                </div>

                {/* Sessions à venir */}
                <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Sessions à venir</h3>
                    <div className="space-y-4">
                        {upcomingSessions.length > 0 ? (
                            upcomingSessions.map((session) => (
                                <div
                                    key={session.date.toISOString()}
                                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">{session.type}</p>
                                        {session.subType && (
                                            <p className="text-sm text-gray-600">{session.subType}</p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">{formatDate(session.date)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            {session.participants.length}/{session.availableSpots}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">
                                Aucune session à venir
                            </p>
                        )}
                    </div>
                </div>

                {/* Sessions passées */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Historique des sessions</h3>
                    <div className="space-y-4">
                        {pastSessions.length > 0 ? (
                            pastSessions.map((session) => (
                                <div
                                    key={session.date.toISOString()}
                                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">{session.type}</p>
                                        {session.subType && (
                                            <p className="text-sm text-gray-600">{session.subType}</p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">{formatDate(session.date)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">
                                Aucune session passée
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoard;