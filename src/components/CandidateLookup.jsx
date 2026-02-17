import { useState } from 'react';
import { getCandidateByEmail } from '../services/api';
import './CandidateLookup.css';

function CandidateLookup({ onCandidateFound }) {
    const [email, setEmail] = useState('');
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Por favor ingresa un email');
            return;
        }

        setLoading(true);
        setError(null);
        setCandidate(null);
        setNotFound(false);

        try {
            const data = await getCandidateByEmail(email);
            if (!data || Object.keys(data).length === 0) {
                setNotFound(true);
                onCandidateFound?.(null);
            } else {
                setCandidate(data);
                onCandidateFound?.(data);
            }
        } catch (err) {
            if (err.message.includes('404')) {
                setNotFound(true);
            } else {
                setError(err.message || 'Error al buscar candidato');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="candidate-lookup">
            <h1>Búsqueda de Candidato</h1>

            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu email"
                    className="email-input"
                />
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {notFound && (
                <div className="not-found-message">
                    Ese candidato no se encuentra registrado
                </div>
            )}

            {candidate && (
                <div className="candidate-card">
                    <h2>Datos del Candidato</h2>
                    <div className="candidate-info">
                        <div className="info-row">
                            <span className="label">Nombre:</span>
                            <span className="value">{candidate.firstName} {candidate.lastName}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{candidate.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">UUID:</span>
                            <span className="value uuid">{candidate.uuid}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Candidate ID:</span>
                            <span className="value">{candidate.candidateId}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Application ID:</span>
                            <span className="value">{candidate.applicationId}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CandidateLookup;
