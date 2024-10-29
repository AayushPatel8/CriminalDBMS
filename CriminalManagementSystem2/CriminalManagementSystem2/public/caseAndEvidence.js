document.addEventListener('DOMContentLoaded', function() {
    // Fetch and populate crime types on page load
    fetchCrimeTypes();
});

function fetchCrimeTypes() {
    // Fetch crime types for both cases and evidence
    fetch('/crime-types')
    .then(response => response.json())
    .then(data => {
        const caseSelect = document.getElementById('caseCrimeTypeSelect');
        const evidenceSelect = document.getElementById('evidenceCrimeTypeSelect');
        // Populate crime type options for cases
        data.forEach(item => {
            const optionForCase = document.createElement('option');
            optionForCase.value = item.CrimeType;
            optionForCase.textContent = item.CrimeType;
            caseSelect.appendChild(optionForCase);
        });
        // Populate crime type options for evidence
        data.forEach(item => {
            const optionForEvidence = document.createElement('option');
            optionForEvidence.value = item.CrimeType;
            optionForEvidence.textContent = item.CrimeType;
            evidenceSelect.appendChild(optionForEvidence);
        });
    });
}

// Event listener for case crime type selection
document.getElementById('caseCrimeTypeSelect').addEventListener('change', function() {
    fetchCaseDetails(this.value);
});

// Event listener for evidence crime type selection
document.getElementById('evidenceCrimeTypeSelect').addEventListener('change', function() {
    fetchEvidenceDetails(this.value);
});

function fetchCaseDetails(crimeType) {
    fetch(`/case-details/${crimeType}`)
    .then(response => response.json())
    .then(data => {
        const caseDetailsDiv = document.getElementById('caseDetails');
        caseDetailsDiv.innerHTML = ''; // Clear existing details
        data.forEach(caseItem => {
            const p = document.createElement('p');
            p.textContent = `Case Number: ${caseItem.CaseNumber}, Location: ${caseItem.CrimeLocation}, Status: ${caseItem.Status}`;
            caseDetailsDiv.appendChild(p);
        });
    })
    .catch((error) => {
        console.error('Error fetching case details:', error);
    });
}

function fetchEvidenceDetails(crimeType) {
    fetch(`/evidence-details/${crimeType}`)
    .then(response => response.json())
    .then(data => {
        const evidenceDetailsDiv = document.getElementById('evidenceDetails');
        evidenceDetailsDiv.innerHTML = ''; // Clear existing details
        data.forEach(evidenceItem => {
            const p = document.createElement('p');
            p.textContent = `Evidence Type: ${evidenceItem.EvidenceType}, Description: ${evidenceItem.Description}, Collected On: ${evidenceItem.DateCollected}`;
            evidenceDetailsDiv.appendChild(p);
        });
    })
    .catch((error) => {
        console.error('Error fetching evidence details:', error);
    });
}