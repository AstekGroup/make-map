import { Event } from '@/types/event';
import { Badge } from '@/components/UI';
import { Calendar, Clock, MapPin, User, ExternalLink, Mail } from 'lucide-react';

interface EventPopupProps {
  event: Event;
  onClose: () => void;
}

export function EventPopup({ event, onClose }: EventPopupProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  return (
    <div className="bg-white rounded-card shadow-popup w-80 max-w-[90vw] animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 text-white">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge type={event.type} size="sm" />
            <h3 className="font-rubik font-semibold text-lg mt-2 leading-tight">
              {event.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 -mr-1 -mt-1 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Date et heure */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4 text-accent-coral" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock className="w-4 h-4 text-accent-coral" />
            <span>{event.time}</span>
          </div>
        </div>
        
        {/* Badge semaine IA */}
        {event.isDuringWeek && (
          <div className="inline-flex items-center gap-1.5 bg-accent-coral/10 text-accent-coral px-2.5 py-1 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse-soft" />
            Pendant la Semaine de l'IA
          </div>
        )}
        
        {/* Lieu */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-accent-coral mt-0.5 flex-shrink-0" />
          <div className="text-text-secondary">
            <p>{event.address}</p>
            <p className="font-medium text-text-primary">{event.postalCode} {event.city}</p>
          </div>
        </div>
        
        {/* Organisateur */}
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-accent-coral" />
          <span className="text-text-secondary">{event.organizer}</span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-3">
          {event.description}
        </p>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              S'inscrire
            </a>
          )}
          {event.organizerContact && (
            <a
              href={`mailto:${event.organizerContact}`}
              className="btn-secondary text-sm flex items-center justify-center gap-2 px-3"
              title="Contacter l'organisateur"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
