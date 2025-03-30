import {useLocation} from "react-router-dom";



export const useGetCurrentPage = () => {
   const location = useLocation();
   console.log("c'est la page : ",location.pathname);
 return{currentPage: location.pathname};

};

