import React, { FC } from "react"
import Footer from "./Footer"
import Header from "./Header"

const Home: FC = () => {
    return (
        <div className="w-full">
            <header className="w-full h-70px">
                <Header />
            </header>
            <main className="w-full">
                <div className="bg-gray-100 h-300px flex flex-col justify-center items-center">
                    Hero
                </div>
            </main>
            <footer className="w-full">
                <Footer />
            </footer>
        </div>
    )
}

export default Home
