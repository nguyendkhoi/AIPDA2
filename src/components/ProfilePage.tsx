import {Award, Calendar, Edit2, Loader2, LogOut, User} from "lucide-react";
import {ParticipationType} from "../types.ts";
import {useEffect, useState} from "react";
import {supabase} from "../lib/supabase.ts";

//j'ai ajouter null pour laisser passer sinon il n'y  a pas null
interface ProfilePageProps {
    user: { id: string; name: string; email: string } | null;
    participationType: ParticipationType;
    onLogout?: () => void;
}



//'page profile si currentPage === \'profile\' && user && participationType '
const ProfilePage = ({ user, participationType, onLogout }: ProfilePageProps) => {
console.log('user is ',user);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || 'Avatar');
    const [bio, setBio] = useState('');
    const [expertise, setExpertise] = useState<string[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [proposals, setProposals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);



    useEffect(() => {
        fetchUserData();
    }, [user.id]);

    const fetchUserData = async () => {
        console.log("Fetching user data");
        try {
            setIsLoading(true);
            setError(null);

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            if (profile) {
                setName(profile.name);
                setBio(profile.bio || '');
                setExpertise(profile.expertise || []);
            }

            if (participationType === 'Participant') {
                const { data: regs, error: regsError } = await supabase
                    .from('registrations')
                    .select(`
                        *,
                        programs (
                          id,
                          type,
                          title,
                          description,
                          session_date,
                          status
                        )
                      `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (regsError) throw regsError;
                setRegistrations(regs || []);
            } else {
                const { data: props, error: propsError } = await supabase
                    .from('program_proposals')
                    .select('*')
                    .eq('animator_id', user.id)
                    .order('created_at', { ascending: false });

                if (propsError) throw propsError;
                setProposals(props || []);
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            setError(null);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    name,
                    bio,
                    expertise: expertise.filter(e => e.trim() !== '')
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setIsEditing(false);
            await fetchUserData();
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Erreur lors de la mise à jour du profil');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmé';
            case 'pending':
                return 'En attente';
            case 'cancelled':
                return 'Annulé';
            case 'approved':
                return 'Approuvé';
            case 'rejected':
                return 'Refusé';
            default:
                return status;
        }
    };

   //si chargement de donnée
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="text-gray-600">Chargement du profil...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen pt-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* En-tête du profil */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{name}</h1>
                                    <p className="text-indigo-100">{user.email}</p>
                                    <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-indigo-500/50 text-sm">
                  {participationType}
                </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition"
                                        title="Modifier le profil"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition"
                                        title="Se déconnecter"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contenu du profil */}
                        <div className="p-6">
                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Biographie
                                        </label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Parlez-nous de vous..."
                                        />
                                    </div>

                                    {/* Expertise (separated by commas) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Expertise (séparées par des virgules)
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {expertise.map((exp, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                                >
                        {exp}
                      </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={expertise.join(', ')}
                                            onChange={(e) => setExpertise(e.target.value.split(',').map(s => s.trim()))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Ex: UX Design, UI Design, Design System"
                                        />
                                    </div>


                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Enregistrement...
                                                </>
                                            ) : (
                                                'Enregistrer les modifications'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                            disabled={isSaving}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    {/* Informations du profil */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                                            <User className="w-5 h-5 mr-2 text-indigo-600" />
                                            À propos
                                        </h2>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-600 mb-4">
                                                {bio || 'Aucune biographie renseignée'}
                                            </p>
                                            {expertise.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {expertise.map((exp, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                                        >
                                                        {exp}
                                                      </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    {/* Activités */}
                                    <section>
                                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                                            {participationType === 'Participant' ? (
                                                <>
                                                    <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                                                    Mes inscriptions
                                                </>
                                            ) : (
                                                <>
                                                    <Award className="w-5 h-5 mr-2 text-indigo-600" />
                                                    Mes propositions
                                                </>
                                            )}
                                        </h2>

                                        <div className="space-y-4">
                                            {participationType === 'Participant' ? (
                                                registrations.length > 0 ? (
                                                    registrations.map((reg) => (
                                                        <div
                                                            key={reg.id}
                                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-semibold text-lg">
                                                                        {reg.programs.title}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-600">
                                                                        {formatDate(reg.programs.session_date)}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-2">
                                                                        {reg.programs.type}
                                                                    </p>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(reg.status)}`}>
                                {getStatusText(reg.status)}
                              </span>
                                                            </div>
                                                            {reg.message && (
                                                                <p className="mt-3 text-gray-600 text-sm border-t pt-3">
                                                                    {reg.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-500 py-8">
                                                        Vous n'avez pas encore d'inscriptions
                                                    </p>
                                                )
                                            ) : (
                                                proposals.length > 0 ? (
                                                    proposals.map((prop) => (
                                                        <div
                                                            key={prop.id}
                                                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="font-semibold text-lg">{prop.title}</h3>
                                                                    <p className="text-sm text-gray-600">
                                                                        Proposé le {formatDate(prop.created_at)}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 mt-2">
                                                                        {prop.type} {prop.subtype && `- ${prop.subtype}`}
                                                                    </p>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(prop.status)}`}>
                                {getStatusText(prop.status)}
                              </span>
                                                            </div>
                                                            <p className="mt-3 text-gray-600 border-t pt-3">
                                                                {prop.description}
                                                            </p>
                                                            {prop.preferred_dates && prop.preferred_dates.length > 0 && (
                                                                <div className="mt-3 text-sm text-gray-500">
                                                                    <strong>Dates souhaitées :</strong>
                                                                    <ul className="list-disc list-inside mt-1">
                                                                        {prop.preferred_dates.map((date: string, index: number) => (
                                                                            <li key={index}>{formatDate(date)}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-center text-gray-500 py-8">
                                                        Vous n'avez pas encore de propositions
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;