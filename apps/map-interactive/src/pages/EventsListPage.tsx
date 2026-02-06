import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { EventType } from '@/types/event';
import { useEvents } from '@/hooks';
import { EventListView, EventFiltersBar } from '@/components/Events';
import { Loader2, Home, Map } from 'lucide-react';

export function EventsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialModality = searchParams.get('modality') as any;
  
  const {
    events,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    toggleRegion,
    toggleType,
    stats,
  } = useEvents();

  // Initialisation de la modalité depuis l'URL si présente
  useEffect(() => {
    if (initialModality && ['presentiel', 'distanciel', 'all'].includes(initialModality)) {
      updateFilters({ modality: initialModality });
    }
  }, []); // Exécuté une seule fois au montage

  const isOnlineMode = filters.modality === 'distanciel';
  const pageTitle = isOnlineMode ? 'Les événements en ligne' : 'Assister aux événements';

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface-beige">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent-coral mx-auto animate-spin" />
          <p className="mt-4 font-rubik font-semibold text-primary text-lg">
            Chargement des événements...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface-beige">
        <div className="text-center max-w-md p-8">
          <p className="text-text-secondary mb-6">{error.message}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-beige overflow-hidden">
      {/* Header unifié */}
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Retour à l'accueil"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-rubik font-semibold text-lg">{pageTitle}</h1>
            <p className="text-sm text-white/70">
              {stats.filtered} événements trouvés
            </p>
          </div>
        </div>
        
        {/* Bouton vers la carte - visible uniquement en mode présentiel */}
        {!isOnlineMode && (
          <button
            onClick={() => navigate('/carte')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: '#f66376', color: 'white' }}
          >
            <Map className="w-4 h-4" />
            Voir sur la carte
          </button>
        )}
      </div>
      
      {/* Filters bar with integrated Search and Modality Switcher */}
      <EventFiltersBar
        filters={filters}
        onUpdateFilters={updateFilters}
        onToggleRegion={toggleRegion}
        onToggleType={(type) => toggleType(type as EventType)}
        onResetFilters={resetFilters}
      />
      
      {/* Event list grid with pagination */}
      <div className="flex-1 overflow-hidden">
        <EventListView events={events} />
      </div>
    </div>
  );
}
