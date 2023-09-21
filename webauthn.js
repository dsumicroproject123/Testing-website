// Check if WebAuthn is supported
if (window.PublicKeyCredential) {
    const registerBtn = document.getElementById("registerBtn");
    const authenticateBtn = document.getElementById("authenticateBtn");

    registerBtn.addEventListener("click", registerFingerprint);
    authenticateBtn.addEventListener("click", authenticateWithFingerprint);

    async function registerFingerprint() {
        try {
            // Request a new credential (usually a fingerprint)
            const credential = await navigator.credentials.create({
                publicKey: {
                    // Configure your registration options here
                    challenge: new Uint8Array(32),
                    rp: { name: "Fingerprint Authentication" },
                    user: { id: new Uint8Array(16), name: "user@example.com", displayName: "User" },
                    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                    authenticatorSelection: { userVerification: "required", requireResidentKey: false },
                    attestation: "direct",
                    timeout: 60000,
                },
            });

            // Send the credential data to your server for registration
            // Example: sendToServer(credential);
        } catch (error) {
            console.error("Fingerprint registration error:", error);
        }
    }

    async function authenticateWithFingerprint() {
        try {
            // Request an authentication challenge
            const credential = await navigator.credentials.get({
                publicKey: {
                    // Configure your authentication options here
                    challenge: new Uint8Array(32),
                    timeout: 60000,
                    userVerification: "required",
                },
            });

            // Send the credential data to your server for authentication
            // Example: sendToServer(credential);
        } catch (error) {
            console.error("Fingerprint authentication error:", error);
        }
    }
} else {
    // Fallback to another authentication method
    alert("WebAuthn is not supported on this device.");
}
