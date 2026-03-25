import { createContext, useState, useEffect } from "react"
import { getMe } from "./services/auth.api.js"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const getAndSetUser = async () => {

      try {

        const data = await getMe()

        if (data && data.data) {
          setUser(data.data)
        }

      } catch (error) {
        console.log("GET ME ERROR:", error)
      } finally {
        setLoading(false)
      }

    }

    getAndSetUser()

  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )

}