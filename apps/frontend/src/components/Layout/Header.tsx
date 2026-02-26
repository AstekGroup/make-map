import { ExternalLink, Mail } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-white py-3 px-4 shadow-lg z-20">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-4">
          <a
            href="https://semaine-ia.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col">
              <span className="font-rubik font-bold text-lg sm:text-xl leading-none">
                SEMAINE
              </span>
              <span className="font-rubik font-bold text-accent-coral text-xl sm:text-2xl leading-none">
                DE L'IA
              </span>
              <span className="font-rubik font-bold text-sm sm:text-base leading-none">
                POUR TOUS
              </span>
            </div>
          </a>
          
          <div className="hidden sm:block h-10 w-px bg-white/20" />
          
          <div className="hidden sm:block">
            <span className="text-sm text-white/80">Carte interactive</span>
            <p className="font-semibold text-lg leading-tight">1500 événements</p>
          </div>
        </div>

        {/* Date */}
        <div className="hidden md:flex items-center gap-6">
          <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-sm text-white/80">Du</span>
            <p className="font-rubik font-bold text-lg">18 au 24 mai 2026</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://semaine-ia.fr/contactez-nous/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2"
            title="Contactez-nous"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Contact</span>
          </a>
          <a
            href="https://semaine-ia.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 rounded-lg bg-accent-coral hover:bg-accent-coral-dark transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <span className="hidden sm:inline">Visiter le site</span>
            <span className="sm:hidden">Site</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
