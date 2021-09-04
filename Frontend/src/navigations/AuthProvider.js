import React, {useState, createContext} from 'react' 

export const UserContext = createContext(null) 

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    return (
        <UserContext.Provider value = {{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default AuthProvider