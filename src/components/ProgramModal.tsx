import { X, Users, Calendar, Clock } from 'lucide-react';
import { Session } from '../types';

interface ProgramModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session;
}

export function ProgramModal({ isOpen, onClose, session }: ProgramModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{session.type}</h2>
                    {session.theme && (
                        <p className="text-lg text-indigo-600 font-medium">{session.theme}</p>
                    )}
                    {session.subType && (
                        <p className="text-gray-600">{session.subType}</p>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm">
                            {new Date(session.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm">2 heures</div>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm">
                            {session.participants.length} / {session.availableSpots} participants
                        </div>
                    </div>
                </div>

                {session.description && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{session.description}</p>
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {session.type === 'Talk' ? 'Panélistes' : 'Animateur'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {session.animateurs.map((animateur) => (
                            <div key={animateur.id} className="flex items-center space-x-4">
                                <img
                                    src={`${animateur.photo}?w=80&h=80&fit=crop`}
                                    alt={animateur.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium">{animateur.name}</p>
                                    <p className="text-sm text-gray-600">{animateur.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}