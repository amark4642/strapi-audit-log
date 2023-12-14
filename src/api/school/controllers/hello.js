'use strict';

/**
 * school controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::school.school', () => ({
    async index(ctx, next) {
        ctx.body = "hello world"
    }
}));