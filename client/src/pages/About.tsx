import Layout from "@/components/Layout";
import { Leaf, Shield, Users, Map } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border/40 py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">About Pest Search</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A comprehensive resource for identifying and managing invasive species in Aotearoa.
          </p>
        </div>
      </div>

      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Why it matters</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Invasive pests pose a significant threat to Aotearoa's unique biodiversity, economy, and cultural values. They can outcompete native species, damage crops, and alter entire ecosystems.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Correct identification is the first step in effective pest management. This database provides the tools you need to recognize these species and understand how they are managed in our region.
            </p>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-muted shadow-xl rotate-2 hover:rotate-0 transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-32 h-32 text-primary opacity-20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Biosecurity</h3>
            <p className="text-muted-foreground">
              Learn about the Regional Pest Management Plan and how different species are categorized and managed.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary-foreground mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Community Action</h3>
            <p className="text-muted-foreground">
              Discover how community groups and individuals play a crucial role in controlling widespread pests.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent-foreground mb-6">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Regional Focus</h3>
            <p className="text-muted-foreground">
              Information specifically tailored to the Aotearoa environment and local ecosystems.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 md:p-16 text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Need more information?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            For detailed advice on pest control methods or to report a pest sighting, visit the Mauri Compass website.
          </p>
          <a href="https://www.ecan.govt.nz/biosecurity" target="_blank" rel="noopener noreferrer" className="inline-block">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-colors">
              Visit Mauri Compass
            </button>
          </a>
        </div>
      </div>
    </Layout>
  );
}
