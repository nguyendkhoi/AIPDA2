import React from 'react';
import {Session} from "../../types.ts";
import {supabase} from "../../lib/supabase.ts";
import {useRedirection} from "../Hooks/useRedirection.tsx";

interface ParticipantRegistrationFormProps {
    session?: Session;
    onSubmit?: (data: { message: string }) => void;
    onClose?: () => void;
}

export  const ParticipantRegistrationForm = ({
 session,
 onSubmit,
 onClose
}: ParticipantRegistrationFormProps) => {

    const {redirectTo}=useRedirection()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const message = formData.get('message') as string;
        console.log("session id is ", session?.id);


        try {
            const { data: profile } = await supabase.auth.getUser();

            if (!profile.user) {
                throw new Error('User not authenticated');
            }

            const { error } = await supabase
                .from('registrations')
                .insert({
                    program_id: session?.id,
                    user_id: profile.user.id,
                    message,
                    status: 'confirmed'
                });

            if (error) throw error;

            if(onSubmit) onSubmit({ message });

        } catch (error) {
            console.error('Error registering for session:', error);
            // Gérer l'erreur (afficher un message à l'utilisateur)
        }
    };

    if(!session || !onClose)
    {
        redirectTo('/')
        return;
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Inscription à la session : {session.type}
                </h3>
                <p className="text-gray-600 mb-4">
                    {new Date(session.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                    })}
                </p>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (optionnel)
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Un message pour les organisateurs..."
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                    Confirmer l'inscription
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
};

