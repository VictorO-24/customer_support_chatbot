import { ThemeProvider } from "@/components/ThemeProvider"

export default function login({children}){
    return(
        <ThemeProvider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}