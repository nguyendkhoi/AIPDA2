import {X} from "lucide-react";
import {ParticipationType, Session} from "../types.ts";
import {ParticipantRegistrationForm} from "./forms/ParticipantRegistrationForm.tsx";
import {AnimatorProposalForm} from "./forms/AnimatorProposalForm.tsx";


interface ReservationModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: (data: { message: string; programType?: string; subType?: string }) => void;
    session?: Session;
    participationType?: ParticipationType;
}


//Le modal s'active lorsque selectedSession && participationType
const ReservationModal = (
    {
      isOpen,
      onClose,
      onSubmit,
      session,
      participationType
    }: ReservationModalProps) => {
    if (!isOpen) return null;

    // @ts-ignore
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {participationType === 'Participant' ? (
                        <ParticipantRegistrationForm
                            session={session}
                            onSubmit={onSubmit}
                            onClose={onClose}
                        />
                    ) : (
                        <AnimatorProposalForm
                            session={session}
                            onSubmit={onSubmit}
                            onClose={onClose}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ReservationModal;