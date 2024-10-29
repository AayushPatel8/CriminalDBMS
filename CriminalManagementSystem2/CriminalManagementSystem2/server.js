const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'CriminalDataManagement'
});

connection.connect(error => {
    if (error) throw error;
    console.log('Successfully connected to the database.');
});

// Route to get crime types
app.get('/crime-types', (req, res) => {
    const query = 'SELECT DISTINCT CrimeType FROM Criminals;';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching crime types:', error);
            return res.status(500).send('Error fetching crime types');
        }
        res.json(results);
    });
});

// Route to get criminals by crime type
app.get('/criminals/:crimeType', (req, res) => {
    const { crimeType } = req.params;
    const query = `
    SELECT Criminals.*, Cases.CrimeLocation, Cases.Status, Officers.FirstName AS OfficerName, Evidence.Description AS Evidence
    FROM Criminals
    JOIN Cases ON Criminals.CriminalID = Cases.CaseID
    JOIN CaseOfficers ON Cases.CaseID = CaseOfficers.CaseID
    JOIN Officers ON CaseOfficers.OfficerID = Officers.OfficerID
    JOIN Evidence ON Cases.CaseID = Evidence.CaseID
    WHERE Criminals.CrimeType = ?;
  `;
    connection.query(query, [crimeType], (error, results) => {
        if (error) {
            console.error('Error fetching criminals:', error);
            return res.status(500).send('Error fetching criminals');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

// Add this to server.js

// Serve the officer details page
app.get('/officer-details', (req, res) => {
    res.sendFile('officerDetails.html', { root: __dirname + '/public' });
});

// Route to get list of officers
app.get('/officers', (req, res) => {
    const query = `
        SELECT DISTINCT Officers.OfficerID, Officers.FirstName, Officers.LastName
        FROM Officers
        JOIN CaseOfficers ON Officers.OfficerID = CaseOfficers.OfficerID;
    `;
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching officers:', error);
            return res.status(500).send('Error fetching officers');
        }
        res.json(results);
    });
});

// Route to get details for a specific officer
app.get('/officer-details/:officerID', (req, res) => {
    const { officerID } = req.params;
    const query = `
        SELECT CaseOfficers.CaseID, CaseOfficers.OfficerID, Officers.Ranki, CaseOfficers.Role, Criminals.Alias AS CriminalName, Criminals.CrimeType, Cases.Status
        FROM CaseOfficers
        JOIN Officers ON CaseOfficers.OfficerID = Officers.OfficerID
        JOIN Cases ON CaseOfficers.CaseID = Cases.CaseID
        JOIN Criminals ON Cases.CaseID = Criminals.CriminalID
        WHERE CaseOfficers.OfficerID = ?;
    `;
    connection.query(query, [officerID], (error, results) => {
        if (error) {
            console.error('Error fetching officer details:', error);
            return res.status(500).send('Error fetching officer details');
        }
        res.json(results[0]); // Assuming one result per officer for simplicity
    });
});

// Add this to server.js

// Serve the Case and Evidence page
app.get('/case-and-evidence', (req, res) => {
    res.sendFile('caseAndEvidence.html', { root: __dirname + '/public' });
});

// Example endpoint for fetching case details by crime type
app.get('/case-details/:crimeType', (req, res) => {
    const { crimeType } = req.params;
    // SQL query to fetch case details based on crimeType
    const query = `
        SELECT Cases.CaseID, Cases.CaseNumber, Cases.CrimeDate, Cases.CrimeLocation, Cases.Status
        FROM Cases
        JOIN Criminals ON Cases.CaseID = Criminals.CriminalID
        WHERE Criminals.CrimeType = ?;
    `;
    connection.query(query, [crimeType], (error, results) => {
        if (error) {
            console.error('Error fetching case details:', error);
            return res.status(500).send('Error fetching case details');
        }
        res.json(results);
    });
});

// Example endpoint for fetching evidence details by crime type
app.get('/evidence-details/:crimeType', (req, res) => {
    const { crimeType } = req.params;
    // SQL query to fetch evidence details based on crimeType
    const query = `
        SELECT Evidence.EvidenceID, Evidence.Description, Evidence.EvidenceType, Evidence.DateCollected
        FROM Evidence
        JOIN Cases ON Evidence.CaseID = Cases.CaseID
        JOIN Criminals ON Cases.CaseID = Criminals.CriminalID
        WHERE Criminals.CrimeType = ?;
    `;
    connection.query(query, [crimeType], (error, results) => {
        if (error) {
            console.error('Error fetching evidence details:', error);
            return res.status(500).send('Error fetching evidence details');
        }
        res.json(results);
    });
});

app.use(express.static('public'));