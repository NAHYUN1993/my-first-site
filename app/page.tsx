import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProjectsSlider } from "@/components/projects-slider"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProjectsSlider />
      <Contact />
      <Footer />
    </main>
  )
}
