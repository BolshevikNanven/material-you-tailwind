'use client'

import React, { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
    theme: Theme
    setTheme: (t: Theme) => void
}>({ theme: 'light', setTheme: () => {} })

export const useTheme = () => {
    const ctx = useContext(ThemeContext)

    return [ctx.theme, ctx.setTheme]
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light')

    const _ = (t: Theme) => {
        if (t === 'light') {
            setTheme('light')
            document.body.classList.remove('dark')
        } else {
            setTheme('dark')
            document.body.classList.add('dark')
        }
    }

    return <ThemeContext.Provider value={{ theme: theme, setTheme: _ }}>{children}</ThemeContext.Provider>
}
