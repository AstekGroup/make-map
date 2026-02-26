import { Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-3 px-4 z-20">
      <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Liens */}
        <div className="flex items-center gap-4">
          <a
            href="https://semaine-ia.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-accent-coral transition-colors"
          >
            semaine-ia.fr
          </a>
          <span className="text-white/30">|</span>
          <a
            href="https://www.linkedin.com/company/mednum/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm hover:text-accent-coral transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
          <a
            href="mailto:contact@lamednum.coop"
            className="flex items-center gap-1.5 text-sm hover:text-accent-coral transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Contact</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-1.5 text-sm text-white/70">
          <span>Fait avec</span>
          <Heart className="w-3.5 h-3.5 text-accent-coral fill-accent-coral" />
          <span>par</span>
          <a
            href="https://lamednum.coop"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-accent-coral transition-colors"
          >
            La Mednum
          </a>
          <span className="text-white/50">• 2026</span>
        </div>
      </div>
    </footer>
  );
}
