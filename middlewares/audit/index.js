module.exports = (strapi) => {
    return {
        initialize() {
            strapi.app.use(async (ctx, next) => {
                await next();
                //   await strapi.info("Yayy!, audit middleware rocks!")
                console.log("Yayy!, audit middleware rocks!")
            });
        }
    }
};