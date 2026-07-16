const express = require('express');
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PAIR_PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve pair.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

// Pair endpoint
app.post('/pair', async (req, res) => {
    try {
        const { number } = req.body;
        
        if (!number) {
            return res.json({ success: false, message: 'Number is required' });
        }

        const cleanNumber = number.replace(/[^0-9]/g, '');
        
        const sessionDir = path.join(__dirname, 'tmp/session_' + cleanNumber);
        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: false,
            browser: ['NAVEED-MD', 'Chrome', '120.0.0.0'],
        });

        sock.ev.on('creds.update', saveCreds);

        const sessionId = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Pairing timeout'));
            }, 60000);

            sock.ev.on('connection.update', async (update) => {
                const { connection, pairingCode } = update;

                if (pairingCode) {
                    clearTimeout(timeout);
                    resolve(pairingCode);
                    return;
                }

                if (connection === 'open') {
                    clearTimeout(timeout);
                    const sessionId = Buffer.from(
                        JSON.stringify(state.creds)
                    ).toString('base64');
                    resolve(sessionId);
                    return;
                }

                if (connection === 'close') {
                    clearTimeout(timeout);
                    reject(new Error('Connection closed'));
                }
            });
        });

        res.json({
            success: true,
            sessionId: sessionId,
            message: 'Pairing successful!'
        });

    } catch (error) {
        console.error('Pair error:', error);
        res.json({
            success: false,
            message: error.message || 'Pairing failed'
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Pair server running on port ${PORT}`);
});
