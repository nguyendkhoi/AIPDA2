
//'la page est la si et seulement si le user est connecter la page ou il vient c la ou ya les ateliers '

import {useAuth} from "./contextApi/AuthContext.tsx";
import {useCallback, useEffect, useState} from "react";
import {supabase} from "../lib/supabase.ts";
import {ProgramCard} from "./ProgramsCard.tsx";

const ProgramsPage = () => {
    //const {currentPage}=useGetCurrentPage()
const {user,setIsSignupModalOpen,setSelectedSession,setSelectedProgramForView} = useAuth()
    const [workshops, setWorkshops] = useState<any>([]);
    const [selectedCampaign, setSelectedCampaign] = useState(0);

    const getWorkshops = useCallback(async () => {
        const { data, error } = await supabase.from('program_proposals').select('*');
        if (error) console.error("Erreur lors de la récupération des programmes :", error.message);
        else setWorkshops(data || []);
    }, []);

    useEffect(() => {
        getWorkshops();
    }, [getWorkshops]);

    // Transformer les données en structure exploitable par la page
    const campaigns = workshops.reduce((acc, workshop) => {
        const month = workshop.campaign_month || 'Inconnu';
        const weekNumber = workshop.week_number || 1;
        if (!acc[month]) acc[month] = { month, weeks: [] };
        let week = acc[month].weeks.find(w => w.weekNumber === weekNumber);
        if (!week) {
            week = { weekNumber, sessions: [] };
            acc[month].weeks.push(week);
        }
        week.sessions.push({
            date: new Date(workshop.session_date),
            type: workshop.type,
            theme: workshop.subtype,
            availableSpots: workshop.max_participants,
            participants: [],
            animateurs: [{
                id: workshop.animator_id,
                name: `Animateur ${workshop.animator_id}`,
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' // Image par défaut
            }],
            description: workshop.description
        });
        return acc;
    }, {});

    const campaignArray = Object.values(campaigns);
console.log("campaingn",campaignArray);
    return (
        <div className="pt-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => setSelectedCampaign(0)}
                            className="text-indigo-600 hover:text-indigo-700 transition"
                        >
                            Retour à l'accueil
                        </button>
                    </div>

                    <div className="flex space-x-4 mb-8 overflow-x-auto">
                        {campaignArray.map((campaign, index) => (
                            <button
                                key={campaign.month}
                                onClick={() => setSelectedCampaign(index)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                                    selectedCampaign === index ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {campaign.month}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-12">
                        {campaignArray[selectedCampaign]?.weeks.map((week) => (
                            <div key={week.weekNumber}>
                                <h3 className="text-xl font-semibold mb-6">
                                    Semaine {week.weekNumber}
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {week.sessions.map((session) => (
                                        <ProgramCard
                                            key={session.date.toISOString()}
                                            session={session}
                                            onReserve={() => {
                                                if (!user) {
                                                    setIsSignupModalOpen(true);
                                                } else {
                                                    setSelectedSession(session);
                                                }
                                            }}
                                            onView={() => setSelectedProgramForView(session)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramsPage;