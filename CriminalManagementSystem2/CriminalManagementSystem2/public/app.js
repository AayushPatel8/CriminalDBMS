document.addEventListener('DOMContentLoaded', function() {
    fetchCrimeTypes();
});

function fetchCrimeTypes() {
    fetch('/crime-types')
    .then(handleResponse)
    .then(data => {
        const select = document.getElementById('crimeTypeSelect');
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = option.textContent = item.CrimeType;
            select.appendChild(option);
        });
        select.addEventListener('change', function() {
            fetchCriminals(this.value);
        });
    })
    .catch(handleError);
}

function fetchCriminals(crimeType) {
    fetch(`/criminals/${crimeType}`)
    .then(handleResponse)
    .then(data => {
        const list = document.getElementById('criminalsList');
        list.innerHTML = ''; // Clear existing list
        data.forEach(criminal => {
            const li = document.createElement('li');
            li.textContent = criminal.Alias;
            li.classList.add('cursor-pointer', 'hover:text-blue-500', 'transition', 'duration-300', 'ease-in-out');
            li.addEventListener('click', () => showCriminalDetails(criminal));
            list.appendChild(li);
        });
    })
    .catch(handleError);
}

function showCriminalDetails(criminal) {
    const detailsDiv = document.getElementById('criminalDetails');
    detailsDiv.innerHTML = `
        <div class="bg-white shadow-md rounded-md p-4">
            <p class="text-lg font-semibold">Name: ${criminal.Alias}</p>
            <p class="text-gray-700">Age: ${calculateAge(criminal.DOB)}</p>
            <p class="text-gray-700">Crime: ${criminal.CrimeType}</p>
            <p class="text-gray-700">Crime Location: ${criminal.CrimeLocation}</p>
            <p class="text-gray-700">Status: ${criminal.Status}</p>
            <p class="text-gray-700">Officer: ${criminal.OfficerName}</p>
            <p class="text-gray-700">Evidence: ${criminal.Evidence}</p>
        </div>
    `;
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

function handleError(error) {
    console.error('Error:', error);
    // Display error message to the user, if needed
}

function calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    console.log(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
