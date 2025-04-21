import{useCallback} from 'react';
import {useNavigate} from "react-router-dom";

/*interface IRedirection{
    currentPage:string;
}*/

//Cette fonction peut remplacer le setCurrentPage
export const useRedirection = () => {

    const navigate = useNavigate();
    const redirectTo = useCallback((currentPage:string)=>{
        navigate(currentPage)
    },[navigate]);
return {redirectTo}
};

