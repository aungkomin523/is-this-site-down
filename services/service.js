class Service {

    static async checkFromAllRegions(targetUrl) {
        const workers = [
            {
                region: "london",
                url: process.env.LONDON_WORKER_URL,
                secret_key: process.env.LONDON_WORKER_SECRET_KEY
            },
            // {
            //     region: "new-york",
            //     url: process.env.NEW_YORK_WORKER_URL,
            //     secret_key: process.env.NEW_YORK_WORKER_SECRET_KEY
            // },
            // {
            //     region: "singapore",
            //     url: process.env.SINGAPORE_WORKER_URL,
            //     secret_key: process.env.SINGAPORE_WORKER_SECRET_KEY
            // },
        ]

        const results = await Promise.all(
            workers.map(async worker => {
                const response = await fetch(worker.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Worker-Key": worker.secret_key,
                    },
                    body: JSON.stringify({
                        url: targetUrl,
                    }),
                })
                return response.json();
            }));

        return results;

    }
}

module.exports = Service;