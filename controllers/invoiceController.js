const asyncErrorCatch = require("../middleware/asyncErrorHandlers");
const driverModel = require("../models/driver");
const ErrorHandler = require("../utils/errorHandler");
const fs = require('fs')
const isObjectPropertyEmpty = require("../utils/checkObjectProperties");
const invoiceModel = require("../models/invoice");
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const path = require('path');
const Handlebars = require('handlebars');
const bookingModel = require("../models/booking");

function generateInvoicePDF(invoiceData, res) {
    const doc = new PDFDocument();
    
    // Add content to the PDF document using the invoice data
    doc.text(`Invoice Number:232323`, 50, 50);
    doc.text(`Customer Name: Dawoodd`, 50, 70);
    doc.text(`Invoice Date: 24-04-2023`, 50, 90);
    // Add more content as needed
    
    // Generate the PDF document and send it to the client side
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=122.pdf`);
    doc.pipe(res);
    doc.end();
  } 
  


  

  



  function dateFormat(date) {
    const month = date.getMonth();
    const day = date.getDate();
    const monthString = month >= 10 ? month : `0${month}`;
    const dayString = day >= 10 ? day : `0${day}`;
    return `${date.getFullYear()}-${monthString}-${dayString}`;
}
exports.getSingleInvoiceDetailWithPDF = asyncErrorCatch(async (req, res, next) => {
    const invoice = await invoiceModel.findOne({ _id: req.params.id, isDeleted: false }).populate({ path: "bookingId", populate: ("customer vehicle") })
  
    if (!invoice) {
      return next(new ErrorHandler(404, "No Invoice Found"))
    }
  
    try {
      const html = fs.readFileSync(path.join(__dirname, '..', 'InvoiceTemplate', 'example2', 'invoice.html'), 'utf8');
  
      // define the data to be used for populating the template
      const data = {
        customerName: `${invoice?.bookingId?.customer?.name?.firstName} ${invoice?.bookingId?.customer?.name?.lastName}`,
        customerAddress: invoice?.bookingId?.customer?.address,
        customerEmail: invoice?.bookingId?.customer?.email,
        invoiceID: invoice?._id,
        bookingUnit:invoice?.bookingId?.bookingUnit,
        invoiceDate: `${dateFormat(new Date(invoice?.createdAt))}`,
        vehicleName: invoice?.bookingId?.vehicle?.name,
        noOfDays: invoice?.bookingId?.noOfDays,
        bookingAmount: invoice?.bookingId?.perDayBookingVehicleRate,
        totalBookingAmount: invoice?.totalAmountPayable,
        subTotal: invoice?.totalAmountPayable,
        tax: invoice?.tax,
        overtimeCharges: invoice?.overTimeCharges,
        accedentalCharges: invoice?.accidentalCharges,
        pendingAmountToPaid: invoice?.pendingAmountToPaid,
        grandTotal: invoice?.total
      };
  
      // compile the template into a function using Handlebars
      const template = Handlebars.compile(html);
  
      // render the template with the data to create the HTML
      const renderedHtml = template(data);
  
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
  
      // Set the HTML content and load the CSS file
      await page.setContent(renderedHtml);
      await page.addStyleTag({ path: path.join(__dirname, '..', 'InvoiceTemplate', 'example2', 'style.css') });
  
      // Generate the PDF
      const pdfBuffer = await page.pdf({ format: 'A4' });
  
      await browser.close();
  
      // send the generated PDF as a response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice.pdf`);
      res.send(pdfBuffer);
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

exports.getSingleInvoiceDetail = asyncErrorCatch(async (req, res, next) => {
    const invoice = await invoiceModel.findOne({ _id: req.params.id,isDeleted:false }).populate({ path: "bookingId", populate: ("customer vehicle") })
    if (!invoice) {
        return next(new ErrorHandler(404, "No Invoice Found"))
    }
    res.status(200).json({ success: true, invoice })
})

exports.getSingleInvoiceDetailWithBooking = asyncErrorCatch(async (req, res, next) => {
    const invoice = await invoiceModel.findOne({ bookingId: req.params.id,isDeleted:false }).populate({ path: "bookingId", populate: ("customer vehicle") })
   console.log("jere",invoice);
    if (invoice) {
        res.status(200).json({ success: true, invoice ,msg:"Invoice Already Created",invoiceFound:true})
    }else{
        const booking=await bookingModel.findOne({_id:req.params.id,isDeleted:false}).populate({path:"customer vehicle"})
        if(booking){
            res.status(200).json({ success: true, invoice:booking ,invoiceFound:false})
        }else{
            return next(new ErrorHandler(404,"No Booking Found"))
        }
    }
    // res.status(200).json({ success: true, invoice })
})

exports.getAllInvoices = asyncErrorCatch(async (req, res, next) => {
    const invoices = await invoiceModel.find({ isDeleted:false}).populate({ path: "bookingId", populate: ("customer vehicle") })
    if (invoices?.length===0) {
        return next(new ErrorHandler(404, "No Invoice Found"))
    }
    res.status(200).json({ success: true, invoices })
})

exports.deleteInvoice=asyncErrorCatch(async(req,res,next)=>{
    const invoice=await invoiceModel.findByIdAndUpdate({_id:req.params.id,isDeleted:false},{$set:{isDeleted:true}});
    if(invoice){
        return res.status(200).json({success:true,msg:"invoice removed"})
    }
    return next(new ErrorHandler(400,"invoice not found"))
})

exports.createInvoice = asyncErrorCatch(async (req, res, next) => {
    const {
        accidentalCharges, tax, partiallyPaidAmount, total, pendingAmountToPaid, cashFromUser, cashBackToUser,paymentStatus
    } = req.body
    const updatedData={
        accidentalCharges, tax, partiallyPaidAmount, total, pendingAmountToPaid, cashFromUser, cashBackToUser,paymentStatus
    }
    invoiceModel.findByIdAndUpdate({_id:req.params.id},updatedData,(err,result)=>{
        if(err){
            return next(err)
        }else{
            res.status(200).json({success:true,msg:"invoice created"})
        }
    })
})

exports.registerDriver = asyncErrorCatch(async (req, res, next) => {
    console.log("vcsdf");
    if (!req?.files?.driverProfile) {
        return next(new ErrorHandler(400, "Please select your driver profile"))
    }
    if (!req?.files?.driverLiscence) {
        return next(new ErrorHandler(400, "Please select your driver liscence"))
    }
    const driver = await driverModel.findOne({ email: req?.body?.email })
    if (driver) {
        return next(new ErrorHandler(400, "Driver already registered on this email"))
    }
    console.log(req.body, "body");
    console.log(req?.files, "files");
    const driverData = {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        cnic: req.body.cnic,
        address: {
            house: req.body.house,
            street: req.body.street,
            sector: req.body.sector,
        },
        driverProfile: req?.files?.driverProfile[0]?.path,
        drivingLiscence: req?.files?.driverLiscence[0]?.path,
    }

    driverModel.create(driverData, (err, result) => {
        if (err) {
            fs.unlinkSync(req?.files?.driverProfile[0]?.path);
            fs.unlinkSync(req?.files?.driverLiscence[0]?.path);
            return next(new ErrorHandler(400, err.message));
        }
        return res.status(201).json({ success: true, msg: "driver registered", result })
    });
})

exports.updateDriver = asyncErrorCatch(async (req, res, next) => {
    const driver = await driverModel.findById(req?.params?.id);
    if (!driver) {
        return next(new ErrorHandler(404, "Driver Not Found"))
    }
    const driverData = {
        name: req.body.name,
        number: req.body.number,
        cnic: req.body.cnic,
        address: {
            house: req.body.house,
            street: req.body.street,
            sector: req.body.sector,
        },
        status: req.body.status,

    }
    if (req?.files?.driverLiscence) {
        driverData.drivingLiscence = req?.files?.driverLiscence[0]?.path
    }
    if (req?.files?.driverProfile) {
        driverData.driverProfile = req?.files?.driverProfile[0]?.path
    }
    const newData = await isObjectPropertyEmpty(driverData, driver)

    const updatedDriver = await driverModel.findByIdAndUpdate(req.params.id, newData, { runValidators: true })
    if (!updatedDriver) {
        if (req?.files?.driverLiscence) {
            fs.unlinkSync(req?.files?.driverLiscence[0]?.path)
        }
        if (req?.files?.driverProfile) {
            fs.unlinkSync(req?.files?.driverProfile[0]?.path)
        }
        return next(new ErrorHandler(400, "driver not updated"))
    } else {

        if (req?.files?.driverLiscence) {
            fs.unlinkSync(updatedDriver?.drivingLiscence)
        }
        if (req?.files?.driverProfile) {
            fs.unlinkSync(updatedDriver?.driverProfile)
        }
        res.status(200).json({ success: true, msg: "driver updated" })
    }
})
exports.getAllDrivers = asyncErrorCatch(async (req, res, next) => {
    const drivers = await driverModel.find({ isDeleted: false });
    return res.status(200).json({ success: true, drivers })
})
exports.getSingleDriverDetail = asyncErrorCatch(async (req, res, next) => {
    const driver = await driverModel.findById(req.params.id);
    if (!driver) {
        return next(new ErrorHandler(400, "driver not found"))
    }
    return res.status(200).json({ success: true, driver })
})
exports.deleteDriver = asyncErrorCatch(async (req, res, next) => {
    const driver = await driverModel.findByIdAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true } });
    if (driver) {
        return res.status(200).json({ success: true, msg: "driver removed" })
    }
    return next(new ErrorHandler(400, "driver not found"))
})