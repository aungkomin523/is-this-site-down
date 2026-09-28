import { performance } from "node:perf_hooks";

export async function checkWebsite(url) {
    const start = performance.now();

    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(10000)
        });

        return {
            status: response.ok ? "UP" : "DOWN",
            httpStatus: response.status,
            responseTime: Math.round(performance.now() - start)
        };

    } catch (error) {
        return {
            status:
                error.name === "TimeoutError"
                    ? "TIMEOUT"
                    : "ERROR",

            error: error.code || error.message,

            responseTime: Math.round(performance.now() - start)
        };
    }
}