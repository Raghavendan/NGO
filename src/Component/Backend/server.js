require('dotenv').config(); // To load environment variables from .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cashfree credentials and API URL from environment variables
const CASHFREE_APP_ID = '782140d8b1a7a2fb092273c3c0041287';
const CASHFREE_SECRET_KEY = 'cfsk_ma_prod_25b3fa01fc656d87ebeb0ff92d3d2a9f_a0e6bb08';
const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg/orders';

// Endpoint to create a Cashfree order
app.post('/create-order', async (req, res) => {
    const { order_id, order_amount, customer_email, customer_phone } = req.body;

    try {
        const orderResponse = await axios.post(CASHFREE_API_URL, {
            order_id,
            order_amount,
            order_currency: "INR",
            customer_details: {
                customer_id: order_id,
                customer_email,
                customer_phone
            },
            version: '2022-09-01' // Add the version parameter here
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': CASHFREE_APP_ID,
                'x-client-secret': CASHFREE_SECRET_KEY
            }
        });

        const { order_token } = orderResponse.data;
        res.json({ order_token });
    } catch (error) {
        console.error('Error creating order:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error creating order', details: error.response?.data || error.message });
    }
});



// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
