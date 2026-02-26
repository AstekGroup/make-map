import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink, Mail, Globe, Video, Building, Accessibility, Tag } from 'lucide-react';
import { useEvents } from '@/hooks';
import { 
  EVENT_TYPE_LABELS, 
  EVENT_FORMAT_LABELS, 
  TARGET_AUDIENCE_LABELS, 
  MODALITY_LABELS 
} from '@/types/event';
import { Loader2 } from 'lucide-react';
import { TYPE_ICONS } from '@/components/Map/EventMarker';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allEvents, loading, error } = useEvents();
  
  const event = allEvents.find(e => e.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-beige flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent-coral mx-auto animate-spin" />
          <p className="mt-4 font-rubik font-semibold text-primary text-lg">
            Chargement de l'événement...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-beige flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <p className="text-text-secondary mb-6">{error.message}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-surface-beige flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h2 className="font-rubik font-semibold text-primary text-xl mb-4">
            Événement non trouvé
          </h2>
          <p className="text-text-secondary mb-6">
            L'événement que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedEndDate = event.endDate
    ? new Date(event.endDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const Icon = TYPE_ICONS[event.type];

  const isComplete = event.capacity && event.registeredCount && event.registeredCount >= event.capacity;

  return (
    <div className="min-h-screen bg-surface-beige overflow-y-auto">
      {/* Hero Image */}
      {event.imageUrl ? (
        <div className="relative h-64 md:h-80 bg-primary">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white/90 text-primary px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      ) : (
        <div className="bg-primary py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-popup overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-primary/10">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{ backgroundColor: '#ffeed0', color: '#003082' }}
              >
                <Icon className="w-4 h-4" />
                {EVENT_TYPE_LABELS[event.type]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                {event.modality === 'distanciel' ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <Building className="w-4 h-4" />
                )}
                {MODALITY_LABELS[event.modality]}
              </span>
              {event.isDuringWeek && (
                <span className="inline-flex items-center gap-1.5 bg-accent-coral/10 text-accent-coral px-3 py-1.5 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse" />
                  Pendant la Semaine de l'IA
                </span>
              )}
              {isComplete && (
                <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-sm font-bold uppercase">
                  <Tag className="w-4 h-4" />
                  Complet
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-rubik text-2xl md:text-3xl font-bold text-primary mb-2">
              {event.title}
            </h1>

            {/* Organizer */}
            <p className="text-text-secondary">
              Organisé par <span className="font-medium text-primary">{event.organizer}</span>
            </p>
          </div>

          {/* Date & Location side by side */}
          <div className="p-6 md:p-8 border-b border-primary/10 bg-surface-beige/30">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-accent-coral" />
                </div>
                <div>
                  <h3 className="font-rubik font-semibold text-sm text-primary/70 uppercase tracking-wide mb-1">
                    Date et horaires
                  </h3>
                  <p className="font-medium text-primary capitalize">{formattedDate}</p>
                  {formattedEndDate && formattedEndDate !== formattedDate && (
                    <p className="text-text-secondary text-sm capitalize">au {formattedEndDate}</p>
                  )}
                  <p className="text-text-secondary flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                    {event.endTime && ` - ${event.endTime}`}
                  </p>
                </div>
              </div>

              {/* Location / Online */}
              {event.modality === 'presentiel' ? (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-coral" />
                  </div>
                  <div>
                    <h3 className="font-rubik font-semibold text-sm text-primary/70 uppercase tracking-wide mb-1">
                      Lieu
                    </h3>
                    {event.venueName && (
                      <p className="font-medium text-primary">{event.venueName}</p>
                    )}
                    <p className="text-text-secondary">{event.address}</p>
                    <p className="text-text-secondary font-medium">
                      {event.postalCode} {event.city}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-magenta/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-accent-magenta" />
                  </div>
                  <div>
                    <h3 className="font-rubik font-semibold text-sm text-primary/70 uppercase tracking-wide mb-1">
                      Accès
                    </h3>
                    <p className="font-medium text-primary">Événement en ligne</p>
                    {event.videoConferenceUrl && (
                      <a
                        href={event.videoConferenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-magenta hover:underline flex items-center gap-1 mt-1"
                      >
                        <Globe className="w-4 h-4" />
                        Accéder à l'événement
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Accessibility */}
          {event.accessibilityInfo && (
            <div className="p-6 md:p-8 border-b border-primary/10 bg-accent-coral/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Accessibility className="w-5 h-5 text-accent-coral" />
                </div>
                <div>
                  <h3 className="font-rubik font-semibold text-sm text-primary/70 uppercase tracking-wide mb-1">
                    Accessibilité
                  </h3>
                  <p className="text-primary">{event.accessibilityInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Format & Public (above description) */}
          <div className="p-6 md:p-8 border-b border-primary/10 grid md:grid-cols-2 gap-6">
            {/* Format */}
            <div>
              <h3 className="font-rubik font-semibold text-sm text-primary/70 uppercase tracking-wide mb-2">
                Format
              </h3>
              <p className="text-primary font-medium">
                {EVENT_FORMAT_LABELS[event.format]}
              </p>
            </div>

            {/* Public cible */}
            <div>
              <h3 className="font-rubik font-semibold text-sm text-primary/70 uppercase tracking-wide mb-2">
                Public cible
              </h3>
              <div className="flex flex-wrap gap-1">
                {event.targetAudience.map((audience) => (
                  <span
                    key={audience}
                    className="text-sm bg-primary/5 text-primary px-2 py-1 rounded"
                  >
                    {TARGET_AUDIENCE_LABELS[audience]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 md:p-8 border-b border-primary/10">
            <h2 className="font-rubik font-semibold text-lg text-primary mb-3">
              Description
            </h2>
            <p className="text-text-secondary whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Contact */}
          <div className="p-6 md:p-8 border-b border-primary/10">
            <h2 className="font-rubik font-semibold text-lg text-primary mb-4">
              Contact
            </h2>
            <div className="space-y-3">
              {event.contactEmail && (
                <a
                  href={`mailto:${event.contactEmail}`}
                  className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 text-accent-coral" />
                  {event.contactEmail}
                </a>
              )}
              {event.organizerWebsite && (
                <a
                  href={event.organizerWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5 text-accent-coral" />
                  Site web de l'organisateur
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 md:p-8 bg-surface-beige/30">
            <div className="flex flex-col sm:flex-row gap-4">
              {isComplete ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-lg font-bold text-sm uppercase">
                  <Tag className="w-5 h-5" />
                  Événement complet
                </div>
              ) : event.registrationUrl ? (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  S'inscrire à l'événement
                </a>
              ) : null}
              {event.organizerContact && (
                <a
                  href={`mailto:${event.organizerContact}`}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Contacter l'organisateur
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-12" />
    </div>
  );
}
