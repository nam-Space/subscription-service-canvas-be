const express = require('express')
const authenticatedRequest = require('../middleware/auth-middleware')
const { getSubscription } = require('../controllers/subscription-controller')
const { createOrder, capturePayment } = require('../controllers/payment-controller')


const router = express.Router()

router.use(authenticatedRequest)

router.get('/', getSubscription)
router.post('/create-order', createOrder)
router.post('/capture-order', capturePayment)

module.exports = router