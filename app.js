const express=require('express');
const cookieParser=require('cookie-parser')
const app=express();
const errorHandleMiddleware=require('./middleware/error')
const customerRoutes=require('./routes/customerRoutes');
const adminRoutes=require('./routes/adminRoutes');
const vehicleRoutes=require('./routes/vehicleRoutes')
const driverRoutes=require('./routes/driverRoutes')
const bookingRoutes=require('./routes/bookingRoutes')
const faqsRoutes=require('./routes/faqsRoutes')
const invoiceRoutes=require('./routes/invoiceRoutes')

const cors = require('cors')
app.use(cors({credentials: true,origin: 'http://localhost:3000'}));
app.use("/resources/images/vehicles",express.static('resources/images/vehicles'))
app.use("/resources/images/driver",express.static('resources/images/driver'))
app.use("/resources/images/booking/liscense",express.static('resources/images/booking/liscense'))

app.use("/resources/images/booking/cnic",express.static('resources/images/booking/cnic'))

// json body parser middleware
app.use(express.json());


//cookie parser
app.use(cookieParser())

app.use(express.urlencoded({extended:true}))
//routes
app.use('/api/customer/auth',customerRoutes);
app.use('/api/customer',customerRoutes)

app.use('/api/admin/auth',adminRoutes)
app.use('/api/admin',adminRoutes)

app.use('/api/vehicle',vehicleRoutes)

app.use('/api/driver',driverRoutes)

app.use('/api/booking',bookingRoutes)


app.use('/api/faqs',faqsRoutes)
app.use('/api/invoice',invoiceRoutes)
// custom error handling middleware
app.use(errorHandleMiddleware)




// const moment = require('moment');
// // current date and time
// const m = moment();
// //default moment date and time timezone(local mode)
// console.log(m);
// //using a format
// console.log(m.format('LL'));
// console.log(m.format('LT'));
// console.log(m.format('L'));

// console.log(m.format('dddd, MMMM Do YYYY, h:mm:ss a'));
// //UTC date and time mode
// console.log(m.utc());
// console.log(m.utc().format());

module.exports=app;