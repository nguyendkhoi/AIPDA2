import React, { useState } from 'react';
import { X, Loader2, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PasswordResetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PasswordResetModal({ isOpen, onClose }: PasswordResetModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                >
                    <X className="h-6 w-6" />
                </button>

                {success ? (
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Email envoyé !
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Si un compte existe avec l'adresse {email}, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                        >
                            Fermer
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={onClose}
                            className="mb-4 text-gray-600 hover:text-gray-800 transition flex items-center"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Retour à la connexion
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Réinitialiser le mot de passe
                        </h2>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    "Envoyer les instructions"
                                )}
                            </button>

                            <p className="text-sm text-gray-600 text-center">
                                Nous vous enverrons un email avec les instructions pour réinitialiser votre mot de passe.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}