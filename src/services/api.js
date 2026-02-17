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

export const applyToJob = async ({ uuid, jobId, candidateId, applicationId, repoUrl }) => {
    const body = {
        uuid,
        jobId,
        candidateId,
        applicationId,
        repoUrl,
    };

    console.log('=== Apply to Job Request ===');
    console.log('URL:', `${BASE_URL}/api/candidate/apply-to-job`);
    console.log('Body:', JSON.stringify(body, null, 2));

    const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return JSON.parse(responseText);
};
