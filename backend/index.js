const express = require('express')
const {userRoute, getLoggedInUserEmail} = require('./routes/userRouter')
const allUsersRoute = require('./routes/allusersRouter')
const meetingRoute = require('./routes/meetingRouter')
const {calendarLinkRoute} = require('./routes/calendarLinkRouter')
// const connection = require('./db')
const cors = require('cors')
const mongoose = require('mongoose')
const auth = require('./middlewares/Authenticator')
const eventRoute = require('./routes/eventRouter')
const bodyParser = require("body-parser")
const port = process.env.port
const path = require('path');


const authController = require('./routes/authController');
const calendarController = require('./routes/calendarController');


// --------------------------
const paypal = require('paypal-rest-sdk');
// --------------------------


require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const axios = require('axios');


const connection = mongoose.connect('mongodb+srv://neha:phadtare@cluster0.rw33h7h.mongodb.net/meetingScheduler?retryWrites=true&w=majority')

console.log(connection)


//Routes

//user login and account creation
app.use('/user', userRoute)
//Auth AuthMiddleware
// app.use(auth)
//get all users
app.use('/allUsersRoute', allUsersRoute)
app.use('/event', eventRoute)
app.use('/meeting', meetingRoute)
app.use('/calendarLink', calendarLinkRoute)
// -----------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// -----------------------------------------------

app.post('/token', authController.exchangeCodeForToken);

app.get('/calendar-events', async (req, res) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const userEmail = req.query.userEmail;
        const calendarEvents = await calendarController.fetchCalendarEvents(accessToken, userEmail);
        res.json(calendarEvents);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// -----------------------------------------------

// paypal.configure({
//     'mode': 'sandbox', // Change to 'live' for production
//     'client_id': 'AZsaNffjf9hEGau0IjsCzLgdoIXwryQw1bfcIBheOj9KQTXH3yU2gmYjdpG2yzZWtT-v49SqwIj1bLpm',
//     'client_secret': 'EHBMQv5fPw6KNAYhojLdYQeWjSbN3awN2No9ZCnwcHYnTDGRqS9fpryNjAMENX1YUJvY-5yacZqxTyrV',
//     'api': {
//       'host': 'api.sandbox.paypal.com',
//       'port': '',
//       'client_id': 'AZsaNffjf9hEGau0IjsCzLgdoIXwryQw1bfcIBheOj9KQTXH3yU2gmYjdpG2yzZWtT-v49SqwIj1bLpm',
//       'client_secret': 'EHBMQv5fPw6KNAYhojLdYQeWjSbN3awN2No9ZCnwcHYnTDGRqS9fpryNjAMENX1YUJvY-5yacZqxTyrV'
//     }
//   });
  
//   let paypalAccessToken = null;
  
//   app.post('/paypal/integrate', (req, res) => {
//     console.log("integrate paypal called ");

//     paypal.generateToken((error, token) => {
//       if (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         console.log("token ", token);
//         paypalAccessToken = token;
//         res.json({ message: 'PayPal account integrated successfully' });
//       }
//     });
//   });
  
//   app.post('/paypal/payment', (req, res) => {
//     console.log("make payment called ");
//     console.log("paypalAccessToken ", paypalAccessToken);
//     console.log(!paypalAccessToken);

//     if (!paypalAccessToken) {
//       console.log("PayPal account not integrated.");
//       res.status(400).json({ error: 'PayPal account not integrated' });
//       return;
//     }
  
//     // Use paypalAccessToken to make payment
//     const paymentData = {
//       intent: 'sale',
//       payer: {
//         payment_method: 'paypal'
//       },
//       redirect_urls: {
//         return_url: 'http://localhost:4200/success',
//         cancel_url: 'http://localhost:4200/customise'
//       },
//       transactions: [{
//         item_list: {
//           items: [{
//             name: 'Item Name',
//             sku: 'SKU',
//             price: '10.00',
//             currency: 'USD',
//             quantity: 1
//           }]
//         },
//         amount: {
//           total: '10.00',
//           currency: 'USD'
//         },
//         description: 'Description of the payment'
//       }]
//     };

//     console.log("payment data ", paymentData);
  
//     const requestOptions = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${paypalAccessToken}`
//       }
//     };

//     console.log("requestOptions ", requestOptions);
  
//     // Make PayPal payment
//     paypal.payment.create(paymentData, requestOptions, (error, payment) => {
//         console.log("reached payment create ");
//         if (error) {
//         console.error("error in paymet creation",error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         console.log("payment links", payment.links);
//         for (let i = 0; i < payment.links.length; i++) {
//           if (payment.links[i].rel === 'approval_url') {
//             console.log('approval url ', payment.links[i].href);
//             res.json({ approvalUrl: payment.links[i].href });
//             return;
//           }
//         }
//         res.status(500).json({ error: 'Approval URL not found' });
//       }
//     });
//   }); 

// -----------------------------------------------
app.listen(3000, async()=>{
    try{
        await connection
        console.log("Connected to mongodb Atlas");
    }
    catch(err){
        console.log(err);
        console.log("Couldn't connect to Mongo Atlas");
    }
    console.log('App listening at port 3000');
})

