// import React, {useCallback, useEffect, useState} from 'react';
// import {Edition, Workshop} from "../types.ts";
// import {Calendar, Edit2, PlusCircle, Trash2, Users} from "lucide-react";
// import {useAuth} from "./contextApi/AuthContext.tsx";

// //L'update est a voir apres
// //Le probleme que l'on pourras regler c'est le fais d'afficher les donnée au moment ou il sont ajoute
// const ProgramsDashboard = () => {
//     const [workshops, setWorkshops] = useState<Workshop[]>([]);
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [selectedEdition, setSelectedEdition] = useState<Edition>('Juin 2025');
//     const editions: Edition[] = ['Avril 2025', 'Juin 2025', 'Août 2025'];
//     const programs = ['Webinaire', 'Atelier', 'Talk'];
//     const themes = ['Design Thinking', 'Agilité', 'Innovation', 'Leadership', 'Communication'];
//     // const {user}=useAuth()

//     // const getWorkshops = useCallback(async () => {
//     //     try {
//     //         const { data, error } = await supabase.from('program_proposals').select('*');
//     //         if (error) throw error;

//     //         if (data) {
//     //             const formattedWorkshops: Workshop[] = data.map((proposal) => ({
//     //                 id: proposal.id,
//     //                 animatorId: proposal.animator_id,
//     //                 edition: proposal.campaign_month,
//     //                 program: proposal.type,
//     //                 theme: proposal.subtype,
//     //                 title: proposal.title,
//     //                 description: proposal.description,
//     //                 preferredDates: proposal.preferred_dates || [], // Vérifier si c'est bien un tableau
//     //                 date: proposal.session_date,
//     //                 weekNumber: proposal.week_number,
//     //                 maxParticipants: proposal.max_participants,
//     //                 status: proposal.status,
//     //                 createdAt: proposal.created_at,
//     //                 updatedAt: proposal.updated_at,
//     //             }));
//     //             setWorkshops(formattedWorkshops);
//     //         }
//     //     }catch (e) {
//     //         console.error("Erreur lors de la récupération des programmes :", error);
//     //     }

//     // }, [])

//     // useEffect(() => {
//     //     getWorkshops()
//     // },[getWorkshops])

//     // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     //     e.preventDefault();
//     //     const formData = new FormData(e.currentTarget);

//     //     const newWorkshop = {
//     //         animator_id: user.id,
//     //         type: formData.get('program') as string,
//     //         subtype: formData.get('theme') as string,
//     //         title: formData.get('program') as string,
//     //         description: '',
//     //         preferred_dates: [formData.get('date')], // Tableau attendu par Supabase
//     //         status: 'pending', // statut par défaut
//     //         campaign_month: formData.get('edition') as string,
//     //         week_number: Number(formData.get('weekNumber')), // Converti en nombre
//     //         session_date: formData.get('date') as string,
//     //         max_participants: Number(formData.get('maxParticipants')), // Converti en nombre
//     //         created_at: new Date().toISOString(),
//     //         updated_at: new Date().toISOString(),
//     //     };

//     //     const {error } = await supabase
//     //         .from('program_proposals')
//     //         .insert(newWorkshop);

//     //     if (error) {
//     //         console.error('Erreur lors de l’ajout du programme:', error.message);
//     //     } else {
//     //         alert('program créer ')
//     //         getWorkshops();
//     //         setIsFormOpen(false);

//     //         }

//     //     }
//     // ;

//     // const deleteWorkshop = async (id: string) => {
//     //     const { error } = await supabase.from('program_proposals').delete().eq('id', id);

//     //     if (error) {
//     //         console.error('Erreur lors de la suppression:', error.message);
//     //     } else {
//     //         getWorkshops(); // 🔥 Rafraîchir après suppression
//     //     }
//     // };

// console.log('selection is ',workshops)
//     return (
//         <div className="bg-gray-50 pt-28 ">
//             {/* Header */}
//             <div className="bg-white shadow">
//                 <div className="max-w-7xl mx-auto px-4 py-6 ">
//                     <h1 className="text-3xl font-bold text-gray-900">Tableau de bord des programmes</h1>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 py-6 mt-16">
//                 {/* Edition Filter */}
//                 <div className="flex space-x-4 mb-6">
//                     {editions.map((edition) => (
//                         <button
//                             key={edition}
//                             onClick={() => setSelectedEdition(edition)}
//                             className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
//                                 selectedEdition === edition
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-white text-gray-700 hover:bg-gray-50'
//                             }`}
//                         >
//                             <Calendar className="w-5 h-5" />
//                             <span>{edition}</span>
//                         </button>
//                     ))}
//                 </div>

//                 {/* Add Workshop Button */}
//                 <button
//                     onClick={() => setIsFormOpen(true)}
//                     className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
//                 >
//                     <PlusCircle className="w-5 h-5" />
//                     <span>Ajouter un programme</span>
//                 </button>

//                 {/* Workshops List */}
//                 <div className="bg-white shadow rounded-lg overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thème</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                         {workshops
//                             .filter(workshop => workshop.edition === selectedEdition)
//                             .map((workshop) => (
//                              <>
//                                 <tr key={workshop.id}>
//                                     <td className="px-6 py-4 whitespace-nowrap">{workshop.program}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{workshop.date}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{workshop.theme}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex items-center">
//                                             <Users className="w-5 h-5 text-gray-400 mr-2" />
//                                             <span>{workshop.maxParticipants}</span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         <div className="flex space-x-2">
//                                             <button className="text-blue-600 hover:text-blue-800">
//                                                 <Edit2 className="w-5 h-5" />
//                                             </button>
//                                             <button
//                                                 onClick={()=>deleteWorkshop(workshop.id)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 <Trash2  className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                                 </>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Add Workshop Modal */}
//                 {isFormOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
//                             <h2 className="text-2xl font-bold mb-6">Ajouter un programme</h2>
//                             <form onSubmit={(e)=>handleSubmit(e)} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Édition</label>
//                                     <select name="edition" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
//                                         {editions.map(edition => (
//                                             <option key={edition} value={edition}>{edition}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Programme</label>
//                                     <select name="program" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
//                                         {programs.map(program => (
//                                             <option key={program} value={program}>{program}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Date</label>
//                                     <input
//                                         type="date"
//                                         name="date"
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Thème</label>
//                                     <select name="theme" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
//                                         {themes.map(theme => (
//                                             <option key={theme} value={theme}>{theme}</option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Numéro de semaine</label>
//                                     <input
//                                         type="number"
//                                         name="weekNumber"
//                                         defaultValue={4}
//                                         min={1}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Nombre maximum de participants</label>
//                                     <input
//                                         type="number"
//                                         name="maxParticipants"
//                                         defaultValue={100}
//                                         min={1}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 <div className="flex justify-end space-x-4 mt-6">
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsFormOpen(false)}
//                                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                                     >
//                                         Annuler
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                                     >
//                                         Créer le programme
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </div>
//     )};

// export default ProgramsDashboard;
