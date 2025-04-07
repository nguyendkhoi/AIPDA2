import React from "react";
import {Loader2, X} from "lucide-react";
//import {useRedirection} from "./Hooks/useRedirection.tsx";


interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; email: string; password: string }) => void;
    error: string | null;
    isLoading: boolean;
}

const SignupModal = ({ isOpen, onClose, onSubmit, error, isLoading }: SignupModalProps) => {

    //const {redirectTo} = useRedirection()


    if (!isOpen) return null;
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        onSubmit({
            name:formData.get('name') as string,
            email:formData.get('email') as string,
            password:formData.get('password') as string,

        })
        //redirectTo("programs")
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Rejoignez la communauté AIPDA
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 font-medium mb-1">Une erreur est survenue</p>
                            <p className="text-red-600 text-sm">
                                {error === 'User already registered' || error.includes('already exists')
                                    ? 'Un compte existe déjà avec cet email. Veuillez vous connecter.'
                                    : error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Votre nom"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength={6}
                                disabled={isLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Minimum 6 caractères
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Inscription en cours...
                                </>
                            ) : (
                                "S'inscrire"
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Déjà un compte ?{' '}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                    disabled={isLoading}
                                >
                                    Se connecter
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignupModal;