import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Calendar, ArrowRight, Clock, Users } from 'lucide-react';
import { useEvents } from '@/hooks';
import { Event, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '@/types/event';
import { TYPE_ICONS } from '@/components/Map/EventMarker';
import { Loader2 } from 'lucide-react';

function MiniEventCard({ event }: { event: Event }) {
  const Icon = TYPE_ICONS[event.type];
  const typeColor = EVENT_TYPE_COLORS[event.type];
  const formattedDate = new Date(event.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <Link
      to={`/evenement/${event.id}`}
      className="bg-white rounded-xl shadow-card hover:shadow-popup transition-all group overflow-hidden"
    >
      {event.imageUrl ? (
        <div className="relative h-28 overflow-hidden">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: '#ffeed0', color: '#003082' }}>
              <Icon className="w-2.5 h-2.5" />
              {EVENT_TYPE_LABELS[event.type]}
            </span>
            {event.isDuringWeek && (
              <span className="inline-flex items-center gap-1 bg-accent-coral text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                Semaine IA
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center relative" style={{ backgroundColor: `${typeColor}10` }}>
          <Icon className="w-6 h-6" style={{ color: typeColor }} />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-rubik font-semibold text-primary text-sm line-clamp-2 mb-1.5 group-hover:text-accent-magenta transition-colors">
          {event.title}
        </h3>
        <div className="space-y-1 text-xs text-text-secondary">
          <p className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-accent-coral flex-shrink-0" />
            <span>{formattedDate}</span>
            <Clock className="w-3 h-3 text-accent-coral flex-shrink-0 ml-auto" />
            <span>{event.time}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-accent-coral flex-shrink-0" />
            <span className="truncate">{event.organizer}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export function HomePage() {
  const { allEvents, loading } = useEvents();

  const presentielEvents = useMemo(() =>
    allEvents
      .filter(e => e.modality === 'presentiel')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6),
    [allEvents]
  );

  const distancielEvents = useMemo(() =>
    allEvents
      .filter(e => e.modality === 'distanciel')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6),
    [allEvents]
  );

  return (
    <div className="min-h-screen bg-surface-beige overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-rubik text-4xl md:text-5xl font-bold mb-4">
            Semaine de l'IA pour Tous
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            18 - 24 mai 2026
          </p>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mt-4">
            Découvrez plus de 1500 événements gratuits partout en France pour comprendre,
            expérimenter et démystifier l'intelligence artificielle.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* Section Événements en présentiel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-coral/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-coral" />
              </div>
              <div>
                <h2 className="font-rubik font-bold text-xl text-primary">Événements en présentiel</h2>
                <p className="text-text-secondary text-sm">Partout en France</p>
              </div>
            </div>
            <Link
              to="/carte"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              Voir les événements
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent-coral animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {presentielEvents.map(event => (
                <MiniEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Section Événements en ligne */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-magenta/10 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-accent-magenta" />
              </div>
              <div>
                <h2 className="font-rubik font-bold text-xl text-primary">Événements en ligne</h2>
                <p className="text-text-secondary text-sm">Accessibles de partout</p>
              </div>
            </div>
            <Link
              to="/evenements?modality=distanciel"
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              Voir les événements en ligne
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-accent-magenta animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {distancielEvents.map(event => (
                <MiniEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Info Section */}
        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h3 className="font-rubik font-semibold text-xl text-primary mb-3">
            La Semaine de l'IA pour Tous, c'est quoi ?
          </h3>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Du 18 au 24 mai 2026, partout en France, des centaines de structures
            de médiation numérique se mobilisent pour proposer des événements gratuits
            et accessibles à tous. L'objectif : permettre à chacun de comprendre
            l'intelligence artificielle, ses usages et ses enjeux.
          </p>
        </div>
      </div>
    </div>
  );
}
