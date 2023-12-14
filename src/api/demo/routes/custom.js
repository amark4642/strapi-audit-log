module.exports = {
    routes: [
        {
            method: "GET",
            path: "/custom",
            handler: "demo.customAction",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
}