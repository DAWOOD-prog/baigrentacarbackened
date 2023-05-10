const asyncErrorCatch = require("../middleware/asyncErrorHandlers");
const bookingModel = require("../models/booking");
const fs = require('fs');
const ErrorHandler = require("../utils/errorHandler");
const vehicleModel = require("../models/vehicle");
const driverModel = require("../models/driver");
const invoiceModel = require("../models/invoice");

exports.registerBooking = asyncErrorCatch(async (req, res, next) => {

    const bookingData = {
        customer: req.customer._id,
        vehicle: req.body.vehicle,
        pickUpDate: req.body.pickUpDate,
        bookingUnit:req.body.bookingUnit,
        partiallyAmountPaidRequired: req.body.partiallyAmountPaidRequired,
        totalAmountPayable: req.body.totalAmountPayable,
        perDayBookingVehicleRate: req.body.perDayBookingVehicleRate,
        overTimePerHour: req.body.overTimePerHour,
        pickUpLocation: {
            latitude: req.body.Platitude,
            longitude: req.body.Plongitude,
            address: req.body.Paddress,
        },
        pickUpTime: req.body.pickUpTime,
        additionalPickUpDescription: req.body.additionalPickUpDescription,
        dropOffDate: req.body.dropOffDate,
        dropOffLocation: {
            latitude: req.body.Dlatitude,
            longitude: req.body.Dlongitude,
            address: req.body.Daddress,
        },
        dropOffTime: req.body.dropOffTime,
        additionalDropOffDescription: req.body.additionalDropOffDescription,
        noOfDays: req.body.noOfDays,
        isWithDriver: req.body.isWithDriver,
        customerLiscence: (req?.files?.userLiscence && req.files?.userLiscence[0]?.path),
        customerIdCard: req.files?.userCnic[0]?.path,
    }
    console.log("bookingData", bookingData)
    bookingModel.create(bookingData, (err, result) => {
        if (err) {
            if (req?.files?.userLiscence) {
                fs.unlinkSync(req.files?.userLiscence[0]?.path);
            }
            if (req?.files?.userCnic) {
                fs.unlinkSync(req.files?.userCnic[0]?.path);
            }


            return next(new ErrorHandler(400, `${err?.message}`))
        }
        res.status(201).json({ success: true, msg: "customer booking has been registered", result })
        // vehicleModel.findByIdAndUpdate({_id:req.body.vehicle},{$set:{status:"booked"}},(err,result)=>{
        //     if(err){
        //         return next(new ErrorHandler(400,err.message))
        //     }
        //     res.status(201).json({success:true,msg:"customer booking has been registered",result})
        // })

    })
})

exports.updateBookings = asyncErrorCatch(async (req, res, next) => {
    const bookingData = (req.file === undefined) ? {
        customer: req.body.customer,
        vehicle: req.body.vehicle,
        pickUpDate: req.body.pickUpDate,
        pickUpLocation: {
            latitude: req.body.Platitude,
            longitude: req.body.Plongitude,
            address: req.body.Paddress,
        },
        pickUpTime: req.body.pickUpTime,
        additionalPickUpDescription: req.body.additionalPickUpDescription,
        dropOffDate: req.body.dropOffDate,
        dropOffLocation: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            address: req.body.address,
        },
        dropOffTime: req.body.dropOffTime,
        additionalDropOffDescription: req.body.additionalDropOffDescription,
        noOfDays: req.body.noOfDays,
        status: req.body.status
    } : {
        customer: req.body.customer,
        vehicle: req.body.vehicle,
        pickUpDate: req.body.pickUpDate,
        pickUpLocation: {
            latitude: req.body.Platitude,
            longitude: req.body.Plongitude,
            address: req.body.Paddress,
        },
        pickUpTime: req.body.pickUpTime,
        additionalPickUpDescription: req.body.additionalPickUpDescription,
        dropOffDate: req.body.dropOffDate,
        dropOffLocation: {
            latitude: req.body.Dlatitude,
            longitude: req.body.Dlongitude,
            address: req.body.Daddress,
        },
        dropOffTime: req.body.dropOffTime,
        additionalDropOffDescription: req.body.additionalDropOffDescription,
        customerLiscence: req.file.path,
        noOfDays: req.body.noOfDays,
        status: req.body.status

    }
    bookingModel.findByIdAndUpdate(req.params.id, bookingData, (err, result) => {
        if (err) {
            if (req.file !== undefined) {
                fs.unlinkSync(req.file.path, (err) => {
                    if (err) {
                        throw err;
                    }
                })
            }
            return next(err)
        }
        if (req.file !== undefined) {
            fs.unlinkSync(result.customerLiscence, (err) => {
                if (err) {
                    throw err;
                }
            })
        }
        return res.status(200).json({ success: true, msg: "record updated" })
    })
})

exports.deleteBooking = asyncErrorCatch(async (req, res, next) => {
    bookingModel.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            return next(new ErrorHandler(400, "record not found"))
        }
        fs.unlinkSync(result.customerLiscence, (err) => {
            if (err) {
                throw err;
            }
        })
        return res.status(200).json({ success: true, msg: "record deleted" })
    })
})

exports.getAllBookings = asyncErrorCatch(async (req, res, next) => {
    const bookings = await bookingModel.find({isDeleted:false}).populate(["customer", "vehicle"]);
    res.status(200).json({ success: true, bookings })
})

exports.getSingleBookingDetail = asyncErrorCatch(async (req, res, next) => {
    const booking = await bookingModel.findById(req.params.id).populate(["customer", "vehicle"]);
    if (!booking) {
        return next(new ErrorHandler(404, "record not found"))
    }
    res.status(200).json({ success: true, booking })
})

exports.updateBookingStatus = asyncErrorCatch(async (req, res, next) => {

    if (!req.body.status) {
        return next(new ErrorHandler(400, "please enter booking status"))
    }
    if (!req.params.id) {
        return next(new ErrorHandler(400, "please enter booking  ID"))
    }

    if (req.body.isWithDriver === true) {
        if (req.body.status === "completed") {
            bookingModel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status, driver: req.body.driver, onDateCustomerReturned: req.body.onDateCustomerReturned } }, { new: true }, (err, result) => {
                if (err) {
                    return next(err)
                } else {
                    if (req.body.status === "confirmed") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: false, status: "booked" } }, (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {
                                driverModel.findByIdAndUpdate({ _id: result?.driver }, { $set: { isAvailable: false } }, async (err, driverResult) => {
                                    if (err) {
                                        return next(err)
                                    } else {
                                        const InvoiceData = {
                                            bookingId: result?._id,
                                            totalAmountPayable: result?.totalAmountPayable,
                                        }
                                        const esistingInvoice = await invoiceModel.findOne({ bookingId: result?._id });
                                        if (esistingInvoice) {
                                            return res.status(200).json({ success: true, msg: "Booking status updated", invoice: esistingInvoice?._id })
                                        } else {
                                            invoiceModel.create(InvoiceData, (err, result) => {
                                                if (err) {
                                                    return next(err)
                                                } else {
                                                    return res.status(200).json({ success: true, msg: "Booking status updated", invoice: result?._id })
                                                }

                                            })
                                        }

                                    }
                                })
                            }
                        })
                    } else if (req.body.status === "completed") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: true, status: "available" } }, (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {
                                driverModel.findByIdAndUpdate({ _id: result?.driver }, { $set: { isAvailable: true } }, async (err, driverResult) => {
                                    if (err) {
                                        return next(err)
                                    } else {
                                        if (req.body.status === "completed") {
                                            console.log("grr");
                                            const InvoiceData = {
                                                bookingId: result?._id,
                                                totalAmountPayable: result?.totalAmountPayable,
                                            }

                                            var date1 = new Date(result?.dropOffDate);
                                            var date2 = new Date(result?.onDateCustomerReturned);

                                            var Difference_In_Time = date2.getTime() - date1.getTime();

                                            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                                            let overtime = 0
                                            if (Difference_In_Days >= 1) {
                                                overtime = Difference_In_Days * result?.perDayBookingVehicleRate
                                            } else {
                                                overtime = Difference_In_Days * result?.overTimePerHour
                                            } 

                                            InvoiceData.overTimeCharges = overtime.toFixed(2);

                                            invoiceModel.findOneAndUpdate({ bookingId: result?._id }, { $set: { overTimeCharges: overtime } }, { new: true }, (err, invResult) => {
                                                if (err) {
                                                    return next(err)
                                                } else {
                                                    return res.status(200).json({ success: true, msg: "Booking status updated", invoice: invResult?._id })
                                                }
                                            });

                                        } else {
                                            return res.status(200).json({ success: true, msg: "Booking status updated" })
                                        }
                                    }
                                })
                            }
                        })
                    }

                }


            })
        } else {
            bookingModel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status, driver: req.body.driver } }, { new: true }, (err, result) => {
                if (err) {
                    return next(err)
                } else {
                    if (req.body.status === "confirmed") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: false, status: "booked" } }, (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {
                                driverModel.findByIdAndUpdate({ _id: result?.driver }, { $set: { isAvailable: false } }, async (err, driverResult) => {
                                    if (err) {
                                        return next(err)
                                    } else {
                                        const InvoiceData = {
                                            bookingId: result?._id,
                                            totalAmountPayable: result?.totalAmountPayable,
                                        }
                                        const esistingInvoice = await invoiceModel.findOne({ bookingId: result?._id });
                                        if (esistingInvoice) {
                                            return res.status(200).json({ success: true, msg: "Booking status updated", invoice: esistingInvoice?._id })
                                        } else {
                                            invoiceModel.create(InvoiceData, (err, result) => {
                                                if (err) {
                                                    return next(err)
                                                } else {
                                                    return res.status(200).json({ success: true, msg: "Booking status updated", invoice: result?._id })
                                                }

                                            })
                                        }

                                    }
                                })
                            }
                        })
                    } else if (req.body.status === "cancelled") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: true, status: "available" } }, (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {
                                if (result?.driver) {
                                    driverModel.findByIdAndUpdate({ _id: result?.driver }, { $set: { isAvailable: true } }, async (err, driverResult) => {
                                        if (err) {
                                            return next(err)
                                        } else {
                                            return res.status(200).json({ success: true, msg: "Booking status updated" })
                                        }
                                    })
                                } else {
                                    return res.status(200).json({ success: true, msg: "Booking status updated" })
                                }
                            }
                        })
                    } else {
                        return res.status(200).json({ success: true, msg: "Booking status updated" })
                    }

                }


            })
        }


    } else if (req.body.isWithDriver === false) {
        if (req.body.status === "completed") {
            bookingModel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status, onDateCustomerReturned: req.body.onDateCustomerReturned } }, { new: true }, (err, result) => {
                if (err) {
                    return next(err)
                } else {
                    if (req.body.status === "completed") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: true, status: "available" } }, async (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {
                                if (req.body.status === "completed") {
                                    const InvoiceData = {
                                        bookingId: result?._id,
                                        totalAmountPayable: result?.totalAmountPayable,
                                    }

                                    var date1 = new Date(result?.dropOffDate);
                                    var date2 = new Date(result?.onDateCustomerReturned);

                                    var Difference_In_Time = date2.getTime() - date1.getTime();

                                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                                    let overtime = 0
                                    if (Difference_In_Days >= 1) {
                                        overtime = Difference_In_Days * result?.perDayBookingVehicleRate
                                    } else {
                                        overtime = Difference_In_Days * result?.overTimePerHour
                                    }

                                    InvoiceData.overTimeCharges = overtime.toFixed(2);

                                    invoiceModel.findOneAndUpdate({ bookingId: result?._id }, { $set: { overTimeCharges: overtime } }, { new: true }, (err, invResult) => {
                                        if (err) {
                                            return next(err)
                                        } else {
                                            return res.status(200).json({ success: true, msg: "Booking status updated", invoice: invResult?._id })
                                        }
                                    });
                                } else {
                                    return res.status(200).json({ success: true, msg: "Booking status updated" })
                                }
                            }
                        })
                    }

                }

                // console.log(result);
                // return res.status(200).json({ success: true, msg: "status updated" })
            })
        } else {
            bookingModel.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }, (err, result) => {
                if (err) {
                    return next(err)
                } else {
                    if (req.body.status === "cancelled") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: true, status: "available" } }, async (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {

                                return res.status(200).json({ success: true, msg: "Booking status updated" })

                            }
                        })
                    } else if (req.body.status === "confirmed") {
                        vehicleModel.findByIdAndUpdate({ _id: result?.vehicle }, { $set: { isAvailable: false, status: "booked" } }, async (err, vehicleResult) => {
                            if (err) {
                                return next(err)
                            } else {

                                const InvoiceData = {
                                    bookingId: result?._id,
                                    totalAmountPayable: result?.totalAmountPayable,
                                }

                                const esistingInvoice = await invoiceModel.findOne({ bookingId: result?._id });
                                if (esistingInvoice) {
                                    return res.status(200).json({ success: true, msg: "Booking status updated", invoice: esistingInvoice?._id })
                                } else {
                                    invoiceModel.create(InvoiceData, (err, result) => {
                                        if (err) {
                                            return next(err)
                                        } else {
                                            return res.status(200).json({ success: true, msg: "Booking status updated", invoice: result?._id })
                                        }

                                    })
                                }

                            }
                        })
                    } else {
                        return res.status(200).json({ success: true, msg: "Booking status updated" })
                    }

                }

                // console.log(result);
                // return res.status(200).json({ success: true, msg: "status updated" })
            })
        }

    }

})
exports.confirmedBooking = asyncErrorCatch(async (req, res, next) => {

})