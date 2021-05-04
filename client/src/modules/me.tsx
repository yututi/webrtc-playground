import { createContext, useState, useContext } from "react"

type MeState = {
    name: string
    setName: (name: string) => void
}

const MeContext = createContext<MeState>({
    name: "",
    setName: () => { }
})

export const MeProvider: React.FC = ({ children }) => {

    const [name, setName] = useState("GUEST")

    return <MeContext.Provider value={{ name, setName }}> {children} </MeContext.Provider>
}

export const useMeContext = () => {
    return useContext(MeContext)
}