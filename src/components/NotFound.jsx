import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="game-header">
        <h2>Página no encontrada</h2>
      </div>
      <p>Lo sentimos, la ruta solicitada no existe.</p>
      <div className="menu-actions">
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
        <button className="btn-secondary" onClick={() => navigate('/practice')}>Ir a práctica</button>
      </div>
    </div>
  );
}
