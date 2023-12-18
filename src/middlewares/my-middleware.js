
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
    if (path.includes("content-manager")) {
        if (method.toLowerCase() === "delete") {
            return "content delete";
        }
        if (method.toLowerCase() === "post" && path.includes("bulkDelete")) {
            return "content bulk delete";
        }
        if (method.toLowerCase() === "post" && path.includes("bulkUnpublish")) {
            return "content bulk unpublish";
        }
        if (method.toLowerCase() === "post" && path.includes("unpublish")) {
            return "content unpublish";
        }
        if (method.toLowerCase() === "post" && path.includes("bulkPublish")) {
            return "content bulk publish";
        }
        if (method.toLowerCase() === "post" && path.includes("publish")) {
            return "content publish";
        }
        if (method.toLowerCase() === "get") {
            return "content View";
        }
        if (method.toLowerCase() === "post") {
            return "content create";
        }
        if (method.toLowerCase() === "put") {
            return "content update";
        }
    }


    // getting collection alteration data (add,update,delete collection)
    if (path.includes("content-type-builder")) {
        if (method.toLowerCase() === "put") {
            return "collection structure update";
        }
        if (method.toLowerCase() === "post") {
            return "collection creation";
        }
        if (method.toLowerCase() === "delete") {
            return "collection delete";
        }
    }

    if (method.toLowerCase() === "post" && path.includes("register")) {
        return "User Register";
    }
    if (method.toLowerCase() === "post" && path.includes("local")) {
        return "User log in";
    }

    return "Other Activities"
};


const getCollectionName = (route, params, method, content, request) => {

    if (route?.includes("content-type-builder")) {
        if (method?.toLowerCase() === "post") {
            return request?.contentType?.singularName;
        }
        if (method?.toLowerCase() === "delete") {
            return params?.uid?.split("::")[1]?.split(".")[0];
        }
        else {
            return params?.uid?.split("::")[1]?.split(".")[0];
        }
    }
    return params?.model?.split("::")[1]?.split(".")[0];
}



module.exports = (config, { strapi }) => {
    return async (context, next) => {
        await next();
        try {
            let token = context?.request?.header?.authorization?.replace("Bearer ", "");

            // if (!token) { return; }

            // // ignoring GET api calls
            // if (token && context.request.method === "GET") { return; }



            // if (token && !user?.email) { return; }


            if (context?.request?.method !== "GET" && token && context?.state?.user?.email && context?.response) {

                const user = context.state.user;

                const entry = {
                    contentType: getContentType(context._matchedRoute),
                    action: getActionType(context.request.method, context._matchedRoute),
                    statusCode: context.response.status,
                    author: {
                        id: user?.id,
                        email: user?.email,
                        name: `${user?.firstname} ${user?.lastname}`,
                        ip: context.request.ip,
                    },
                    method: context.request.method,
                    route: context._matchedRoute,
                    params: context.params,
                    request: context.request.body,
                    content: context.response.body,
                    collectionName: getCollectionName(context._matchedRoute, context.params, context.request.method, context.response.body, context.request.body),
                    adminEmail: user?.email,
                    adminName: `${user?.firstname} ${user?.lastname}`,
                    publishedAt: new Date()
                };

                // await strapi.entityService.create('api::audit-log.audit-log', {
                //     data: entry
                // })
                await strapi.query('api::audit-log.audit-log').create({
                    data: entry
                })
            }
        } catch (error) {
            console.log('error from custom middleware=', error)
        }
    };
};
