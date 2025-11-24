import AboutUs from "../components/Aboutus"
import { Footer } from "../features/footer/Footer"
import { Navbar } from "../features/navigation/components/Navbar"

export const AboutUsPage =()=>{
    return (
        <>
        <Navbar />
        <div >
        <AboutUs/>
        </div>
        <Footer />
        </>
    )
}