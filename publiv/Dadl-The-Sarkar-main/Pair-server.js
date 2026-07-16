const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Serve pair.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/pair', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

// Simple pair endpoint
app.post('/pair', (req, res) => {
    const number = req.body.number || 'Not provided';
    res.json({
        success: true,
        sessionId: "PAIR_" + Date.now(),
        message: `Pairing initiated for ${number}`
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

console.log('🚀 NAVEED-MD Pair Server Started!');
