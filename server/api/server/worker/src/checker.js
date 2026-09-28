const {performance} = require('node:perf_hooks');
require('dotenv').config()

async function checkWebsite(url) {
    const start = performance.now();

    try {
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            signal: AbortSignal.timeout(10000)
        });

        const responseTime = Math.round(performance.now() - start);

        return {
            status: response.ok ? 'UP' : 'DOWN',
            httpStatus: response.status,
            responseTime
        }
    } catch (error) {
        const responseTime = Math.round(performance.now() - start);

        if (error.name === "TimeoutError") {
            return {
                status: "TIMEOUT",
                responseTime,
            };
        }

        return {
            status: "ERROR",
            error: error.code || error.message,
            responseTime,
        };
    }
}

module.exports = {
    checkWebsite
}