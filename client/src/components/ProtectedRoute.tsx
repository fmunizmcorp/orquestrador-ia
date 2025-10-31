import { Outlet } from 'react-router-dom';

// Sistema sem autenticação - apenas renderiza o conteúdo
export default function ProtectedRoute() {
  return <Outlet />;
}
