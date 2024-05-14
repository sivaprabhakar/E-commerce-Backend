import express from 'express'
import stripePayment from '../controller/Payment.js';

const router = express.Router()

router.post('/create-payment',stripePayment )

export default router;