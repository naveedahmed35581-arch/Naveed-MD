const express = require('express');
const router = express.Router();
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');

// Session storage
const sessions = {};

router.post('/', async (req, res) => {
    try {
        const { number } = req.body;
        
        if (!number) {
            return res.json({ success: false, message: 'Number is required' });
        }

        const cleanNumber = number.replace(/[^0-9]/g, '');
        
        const sessionDir = path.join(__dirname, '../tmp/session_' + cleanNumber);
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
                    
                    sessions[cleanNumber] = sessionId;
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

module.exports = router;
