import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { EventsListPage } from './pages/EventsListPage';
import { EventDetailPage } from './pages/EventDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/carte',
    element: <MapPage />,
  },
  {
    path: '/evenements',
    element: <EventsListPage />,
  },
  {
    path: '/evenement/:id',
    element: <EventDetailPage />,
  },
]);
