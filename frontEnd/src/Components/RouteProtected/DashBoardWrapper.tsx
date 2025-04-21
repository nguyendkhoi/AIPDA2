import DashBoard from "../components/DashBoard.tsx";
import {useAuth} from "../components/contextApi/AuthContext.tsx";

const DashBoardWrapper = () => {
    const { user, participationType, userSessions } = useAuth();
    return (
        <div className="pt-20 px-4">
            <div className="max-w-7xl mx-auto">
                <DashBoard
                    participationType={participationType || 'Participant'}
                    sessions={userSessions}
                    userName={user?.name || ''}
                />
            </div>
        </div>
    );
};

export default DashBoardWrapper;