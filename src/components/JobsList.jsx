import { useState, useEffect } from 'react';
import { getJobsList } from '../services/api';
import './JobsList.css';

function JobsList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            {jobs.length === 0 ? (
                <p className="no-jobs">No hay posiciones disponibles</p>
            ) : (
                <ul className="jobs-grid">
                    {jobs.map((job) => (
                        <li key={job.id} className="job-card">
                            <span className="job-title">{job.title}</span>
                            <span className="job-id">ID: {job.id}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default JobsList;
