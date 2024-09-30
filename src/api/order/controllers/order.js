'use strict';
const jwt = require('jsonwebtoken');
//@ts-ignore
const stripe = require("stripe")(process.env.STRIPE_KEY
)
/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::order.order');
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
    async create(ctx) {
        //@ts-ignore
        const { products, userToken } = ctx.request.body

        const decoded = jwt.verify(userToken, process.env.JWT_SECRET)
        // @ts-ignore
        const userId = decoded.id || decoded.sub

        try {
            const lineItems = await Promise.all(
                products.map(async (product) => {
                    const item = await strapi
                        .service("api::product.product")
                        .findOne(product.id)

                    return {
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name: item.productName
                            },
                            unit_amount: Math.round(item.price * 100)
                        },
                        quantity: item.stock >= product.attributes.quantity && product.attributes.quantity
                    }
                })
            );
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                success_url: process.env.CLIENT_URL + "/es/success",
                cancel_url: process.env.CLIENT_URL + "/es/cart",
                line_items: lineItems
            });
            
            await strapi.service("api::order.order").create({ data: { products, stripeid: userId + "-" + Date.now(), users: userId } });

            return { stripeSession: session }

        } catch (error) {
            ctx.response.status = 500
            return error
        }
    }
}))
