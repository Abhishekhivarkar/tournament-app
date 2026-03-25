import { createContext } from "react";

export const useAdminDashboardContext = createContext()

export const useAdminDashboardProvider = ({children}) =>{
    
    return(
        <useAdminDashboardContext.Provider>
            {children}
        </useAdminDashboardContext.Provider>
    )
}