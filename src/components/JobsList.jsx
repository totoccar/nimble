import { useState, useEffect } from 'react';
import { getJobsList, applyToJob } from '../services/api';
import './JobsList.css';

function JobsList({ candidate }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [repoUrls, setRepoUrls] = useState({});
    const [submitting, setSubmitting] = useState({});
    const [submitStatus, setSubmitStatus] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtrar jobs por búsqueda
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular paginación
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

    // Reset página cuando cambia la búsqueda
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleUrlChange = (jobId, url) => {
        setRepoUrls(prev => ({
            ...prev,
            [jobId]: url
        }));
    };

    const handleSubmit = async (jobId) => {
        if (!candidate) {
            setSubmitStatus(prev => ({
                ...prev,
                [jobId]: { error: 'Primero busca tu candidato por email' }
            }));
            return;
        }

        const repoUrl = repoUrls[jobId] || '';
        if (!repoUrl) {
            setSubmitStatus(prev => ({
                ...prev,
                [jobId]: { error: 'Ingresa la URL de tu repositorio' }
            }));
            return;
        }

        setSubmitting(prev => ({ ...prev, [jobId]: true }));
        setSubmitStatus(prev => ({ ...prev, [jobId]: null }));

        try {
            console.log('=== Candidate data ===');
            console.log('candidate:', candidate);
            console.log('jobId:', jobId);
            console.log('repoUrl:', repoUrl);

            await applyToJob({
                uuid: candidate.uuid,
                jobId: jobId,
                candidateId: candidate.candidateId,
                applicationId: candidate.applicationId,
                repoUrl: repoUrl,
            });
            setSubmitStatus(prev => ({
                ...prev,
                [jobId]: { success: 'Postulación enviada exitosamente!' }
            }));
        } catch (err) {
            setSubmitStatus(prev => ({
                ...prev,
                [jobId]: { error: err.message || 'Error al enviar postulación' }
            }));
        } finally {
            setSubmitting(prev => ({ ...prev, [jobId]: false }));
        }
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobsList();
                setJobs(data);
            } catch (err) {
                setError(err.message || 'Error al obtener posiciones');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="jobs-list">
                <h2>Posiciones Abiertas</h2>
                <div className="loading">Cargando posiciones...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jobs-list">
                <h2>Posiciones Abiertas</h2>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="jobs-list">
            <h2>Posiciones Abiertas</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar posición..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="search-input"
                />
            </div>

            {filteredJobs.length === 0 ? (
                <p className="no-jobs">
                    {searchTerm ? 'No se encontraron posiciones' : 'No hay posiciones disponibles'}
                </p>
            ) : (
                <>
                    <ul className="jobs-grid">
                        {paginatedJobs.map((job) => (
                            <li key={job.id} className="job-card">
                                <div className="job-header">
                                    <span className="job-title">{job.title}</span>
                                    <span className="job-id">ID: {job.id}</span>
                                </div>
                                <div className="job-form">
                                    <input
                                        type="url"
                                        placeholder="URL de tu repositorio de GitHub"
                                        value={repoUrls[job.id] || ''}
                                        onChange={(e) => handleUrlChange(job.id, e.target.value)}
                                        className="repo-input"
                                        disabled={submitting[job.id]}
                                    />
                                    <button
                                        onClick={() => handleSubmit(job.id)}
                                        className="submit-button"
                                        disabled={submitting[job.id]}
                                    >
                                        {submitting[job.id] ? 'Enviando...' : 'Submit'}
                                    </button>
                                </div>
                                {submitStatus[job.id]?.error && (
                                    <div className="job-error">{submitStatus[job.id].error}</div>
                                )}
                                {submitStatus[job.id]?.success && (
                                    <div className="job-success">{submitStatus[job.id].success}</div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                Anterior
                            </button>
                            <span className="pagination-info">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default JobsList;
