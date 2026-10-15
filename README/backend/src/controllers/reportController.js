const Report = require('../models/Report');
const TestBooking = require('../models/TestBooking');
const Notification = require('../models/Notification');

// @desc    Get patient's reports
// @route   GET /api/reports/my
// @access  Private (PATIENT)
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user._id })
      .populate({
        path: 'testBookingId',
        populate: { path: 'testId' }
      })
      .sort({ reportDate: -1, createdAt: -1 });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching reports' });
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('patientId', 'name email phone gender dateOfBirth address')
      .populate({
        path: 'testBookingId',
        populate: { path: 'testId' }
      });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (
      req.user.role === 'PATIENT' &&
      report.patientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this report' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching report' });
  }
};

// @desc    Create/Generate lab report (Admin/Lab)
// @route   POST /api/reports
// @access  Private (ADMIN)
const createReport = async (req, res) => {
  try {
    const { patientId, testBookingId, testName, reportData, interpretation, status, generatedBy } = req.body;

    const report = await Report.create({
      patientId,
      testBookingId,
      testName,
      reportData: reportData || [
        { parameter: 'Hemoglobin', result: '13.8', unit: 'g/dL', referenceRange: '12.0 - 16.0', status: 'Normal' },
        { parameter: 'Total Leucocyte Count (TLC)', result: '7,200', unit: '/cumm', referenceRange: '4,000 - 11,000', status: 'Normal' },
        { parameter: 'Platelet Count', result: '250,000', unit: '/cumm', referenceRange: '150,000 - 450,000', status: 'Normal' }
      ],
      interpretation: interpretation || 'Sample analyzed under certified laboratory standards for academic demonstration.',
      status: status || 'AVAILABLE',
      generatedBy: generatedBy || 'HealthTrack Diagnostic Pathology Lab'
    });

    if (testBookingId) {
      await TestBooking.findByIdAndUpdate(testBookingId, { status: 'COMPLETED' });
    }

    if (report.status === 'AVAILABLE') {
      await Notification.create({
        userId: patientId,
        title: 'Diagnostic Report Available',
        message: `Your report for ${testName} is now ready for viewing and download.`,
        type: 'REPORT'
      });
    }

    res.status(201).json({ success: true, message: 'Lab report created', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error generating report' });
  }
};

// @desc    Update report status or data (Admin)
// @route   PUT /api/reports/:id
// @access  Private (ADMIN)
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    let finalStatus = req.body.status || report.status;
    if (typeof finalStatus === 'string') {
      const upper = finalStatus.toUpperCase();
      if (['PROCESSING', 'GENERATED', 'AVAILABLE'].includes(upper)) {
        finalStatus = upper;
      }
    }

    report.status = finalStatus;
    if (req.body.reportData) report.reportData = req.body.reportData;
    if (req.body.interpretation) report.interpretation = req.body.interpretation;
    if (req.body.generatedBy) report.generatedBy = req.body.generatedBy;

    await report.save();

    if (report.status === 'AVAILABLE' || report.status === 'Available') {
      await Notification.create({
        userId: report.patientId,
        title: 'Diagnostic Report Ready',
        message: `Your report for ${report.testName} is now available in your patient portal.`,
        type: 'REPORT'
      });
    }

    res.json({ success: true, message: 'Report updated', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating report' });
  }
};

module.exports = {
  getMyReports,
  getReportById,
  createReport,
  updateReport
};
