const express = require('express');
const path = require('path');
const fs = require('fs-extra');

function initWebsite(app) {
    app.use(express.static(path.join(__dirname, '../public')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/aman.html'));
    });

    app.get('/aman', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/aman.html'));
    });

    app.get('/pair', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/aman.html'));
    });

    app.get('/pairing', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/aman.html'));
    });

    console.log('Website routes initialized');
}

function initPairCodeAPI(app, sessions, createBotSession) {
    app.get("/code", async (req, res) => {
        const number = req.query.number;
        if (!number) {
            return res.status(400).send({ error: "Number parameter required" });
        }
        try {
            const result = await createBotSession(number);
            res.json({ success: true, code: result });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
}

module.exports = {
    initWebsite,
    initPairCodeAPI
};