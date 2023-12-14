'use strict';

/**
 * school controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::school.school', (strapi) => ({

    async customAction(ctx) {
        console.log(ctx);
        try {
            ctx.body = "Hello world"
        } catch (error) {
            ctx.body = error;
        }
    },

    // async find(ctx) {
    //     console.log(ctx);
    // }
}
));
