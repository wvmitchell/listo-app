import { createContext, useContext, useState, useEffect } from "react"
import { getToken, logout } from "@/utils/auth"
import type { User } from "@/utils/types"

interface AuthContextType {
  token: string | null
  isLoading: boolean
  setToken: (token: string) => void
  handleLogout: () => void
  user: User
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  setToken: () => {},
  handleLogout: () => {},
  user: { email: "", picture: "" },
})

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const storedToken = getToken()
    if (storedToken) {
      setToken(storedToken)
      setUser(parseUser(storedToken))
      setIsLoading(false)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setToken(null)
  }

  const parseUser = (token: string): void => {
    if (!token) return
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(""),
    )
    return JSON.parse(jsonPayload)
  }

  return (
    <AuthContext.Provider
      value={{ token, setToken, isLoading, handleLogout, user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
