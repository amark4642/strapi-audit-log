module.exports = {
    routes: [
        {
            method: "GET",
            path: "/hello",
            handler: "school.customAction",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};