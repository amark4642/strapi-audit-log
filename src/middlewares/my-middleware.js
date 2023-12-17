
const getContentType = (path) => {
    if (path.includes("service-request")) {
        return "Service Request";
    }
    if (path.includes("register")) {
        return "Account Registration";
    }
    if (path.includes("local")) {
        return "Account Login";
    }
    if (path.includes("service")) {
        return "Service";
    }
    if (path.includes("content-types") || path.includes("content-manager")) {
        return "Admin";
    }
    return "Others"
};

const getActionType = (method, path) => {
    if (method.toLowerCase() === "post" && path.includes("service-request")) {
        return "Created Service Request";
    }
    if (method.toLowerCase() === "delete" && path.includes("content-manager")) {
        return "Admin content delete";
    }
    if (method.toLowerCase() === "post" && path.includes("content-manager") && path.includes("bulkDelete")) {
        return "Admin content bulk delete";
    }
    if (method.toLowerCase() === "post" && path.includes("content-manager") && path.includes("bulkUnpublish")) {
        return "Admin content bulk unpublish";
    }
    if (method.toLowerCase() === "post" && path.includes("content-manager") && path.includes("unpublish")) {
        return "Admin content unpublish";
    }
    if (method.toLowerCase() === "post" && path.includes("content-manager") && path.includes("bulkPublish")) {
        return "Admin content bulk publish";
    }
    if (method.toLowerCase() === "post" && path.includes("content-manager") && path.includes("publish")) {
        return "Admin content publish";
    }
    if (method.toLowerCase() === "get" && path.includes("content-manager")) {
        return "Admin content View";
    }
    if (method.toLowerCase() === "post" && path.includes("content-manager")) {
        return "Admin content create";
    }
    if (method.toLowerCase() === "put" && path.includes("content-manager")) {
        return "Admin content update";
    }
    if (method.toLowerCase() === "put" && path.includes("content-type-builder")) {
        return "Collection structure update";
    }
    if (method.toLowerCase() === "post" && path.includes("register")) {
        return "User Register";
    }
    if (method.toLowerCase() === "post" && path.includes("local")) {
        return "User log in";
    }

    return "Other Activities"
};




module.exports = (config, { strapi }) => {
    return async (context, next) => {
        await next();
        try {
            let token = context?.request?.header?.authorization?.replace("Bearer ", "");

            if (!token) { return; }

            // ignoring GET api calls
            if (token && context.request.method === "GET") { return; }


            const user = context.state.user;

            const entry = {
                contentType: getContentType(context._matchedRoute),
                action: getActionType(context.request.method, context._matchedRoute),
                statusCode: context.response.status,
                author: {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstname} ${user.lastname}`,
                    ip: context.request.ip,
                },
                method: context.request.method,
                route: context._matchedRoute,
                params: context.params,
                request: context.request.body,
                content: context.response.body,
                collectionName: context.params?.model?.split("::")[1]?.split(".")[0],
                adminEmail: user.email,
                adminName: `${user.firstname} ${user.lastname}`,
                publishedAt: new Date()
            };

            await strapi.entityService.create('api::audit-log.audit-log', {
                data: entry
            })
        } catch (error) {
            console.log(error)
        }
    };
};
