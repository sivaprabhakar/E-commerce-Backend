import stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey);


const stripePayment = async (req, res) => {
   

    try {
       const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: req.body.amount,
            currency: 'usd',
            description: "Sample payment",
            metadata: { integration_check: "accept_payment"},
            shipping: req.body.shipping
        });

        res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
};


export default stripePayment;
