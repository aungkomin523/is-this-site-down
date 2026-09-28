import { checkWebsite } from "./checker.js";
import { validateUrl } from "./url-validator.js";

export const handler = async (event) => {
    try {
        // Lambda Function URL sends the request body as a string
        const body =
            typeof event.body === "string"
                ? JSON.parse(event.body)
                : event.body || {};

        const { url } = body;

        if (!url) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "URL is required"
                })
            };
        }

        // Authenticate main API
        const workerSecret = event.headers?.["x-worker-secret"];

        if (workerSecret !== process.env.WORKER_SECRET) {
            return {
                statusCode: 401,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "Unauthorized"
                })
            };
        }

        // SSRF protection
        const validatedUrl = await validateUrl(url);

        // Check target website
        const result = await checkWebsite(
            validatedUrl.toString()
        );

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                region: process.env.REGION,
                url: validatedUrl.toString(),
                ...result
            })
        };

    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};