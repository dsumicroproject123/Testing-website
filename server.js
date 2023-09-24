const express = require('express');
const bodyParser = require('body-parser');
const { generateServerAttestationOptions, verifyAuthenticatorAttestationResponse, generateServerAssertionOptions, verifyAuthenticatorAssertionResponse } = require('webauthn.io/server');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory database (not suitable for production)
const users = {};

app.post('/register', async (req, res) => {
    const { username, displayName } = req.body;

    // Generate challenge
    const challenge = await generateServerAttestationOptions(username, displayName);

    // Store challenge along with user data (in-memory, replace with a database)
    users[username] = { displayName, challenge };

    // Return registration options to the client
    res.json(challenge);
});

app.post('/verify-registration', async (req, res) => {
    try {
        // Verify registration data using webauthn.io library
        await verifyAuthenticatorAttestationResponse(req.body);

        // Perform additional verification and store public key securely (not shown here)
        // ...

        res.json({ success: true });
    } catch (error) {
        console.error('Registration verification error:', error);
        res.status(400).json({ error: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    const { loginUsername } = req.body;

    const user = users[loginUsername];
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Generate challenge
    const challenge = await generateServerAssertionOptions(loginUsername);

    // Store challenge for login verification
    user.challenge = challenge;

    // Return login options to the client
    res.json(challenge);
});

app.post('/verify-login', async (req, res) => {
    try {
        const user = users[req.body.username];
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Verify login data using webauthn.io library
        await verifyAuthenticatorAssertionResponse(req.body, user.challenge);

        // Perform additional verification (not shown here)
        // ...

        res.json({ success: true });
    } catch (error) {
        alert('Login verification error:', error);
        res.status(400).json({ error: 'Login failed' });
    }
});

app.listen(port, () => {
    alert(`Server is listening at http://localhost:${port}`);
});
