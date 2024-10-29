// public/officerDetails.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("clicked");
    fetchOfficers();
});

function fetchOfficers() {
    fetch('/officers')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('officersList');
        list.innerHTML = ''; // Clear existing list
        data.forEach(officer => {
            const li = document.createElement('li');
            li.textContent = officer.FirstName + ' ' + officer.LastName;
            li.style.cursor = 'pointer';
            li.onclick = () => showOfficerDetails(officer.OfficerID);
            list.appendChild(li);
        });
    });
}

function showOfficerDetails(officerID) {
    fetch(`/officer-details/${officerID}`)
    .then(response => response.json())
    .then(data => {
        const detailsDiv = document.getElementById('officerDetails');
        detailsDiv.innerHTML = `
            <p>CaseID: ${data.CaseID}</p>
            <p>OfficerID: ${data.OfficerID}</p>
            <p>Rank: ${data.Ranki}</p>
            <p>Role: ${data.Role}</p>
            <p>Criminal Name: ${data.CriminalName}</p>
            <p>CrimeType: ${data.CrimeType}</p>
            <p>Status: ${data.Status}</p>
        `;
    });
}