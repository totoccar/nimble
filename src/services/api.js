const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net';

export const getCandidateByEmail = async (email) => {
    const response = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
};

export const getJobsList = async () => {
    const response = await fetch(`${BASE_URL}/api/jobs/get-list`);

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
};

export const applyToJob = async ({ uuid, jobId, candidateId, repoUrl }) => {
    const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid,
            jobId,
            candidateId,
            repoUrl,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
};
