const DiagnosticTest = require('../models/DiagnosticTest');

// @desc    Get diagnostic tests with search and filter
// @route   GET /api/tests
// @access  Public
const getTests = async (req, res) => {
  try {
    const { search, category, sortBy, sortOrder } = req.query;

    let query = { isActive: true };

    if (req.user && req.user.role === 'ADMIN') {
      delete query.isActive; // Admin can view inactive tests too
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sort = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const tests = await DiagnosticTest.find(query).sort(sort);
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching diagnostic tests' });
  }
};

// @desc    Get diagnostic test by ID
// @route   GET /api/tests/:id
// @access  Public
const getTestById = async (req, res) => {
  try {
    const test = await DiagnosticTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Diagnostic test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching test details' });
  }
};

// @desc    Create diagnostic test (Admin)
// @route   POST /api/tests
// @access  Private (ADMIN)
const createTest = async (req, res) => {
  try {
    const { name, category, description, price, sampleType, preparation, reportTime } = req.body;

    const test = await DiagnosticTest.create({
      name,
      category,
      description,
      price,
      sampleType,
      preparation,
      reportTime
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating diagnostic test' });
  }
};

// @desc    Update diagnostic test (Admin)
// @route   PUT /api/tests/:id
// @access  Private (ADMIN)
const updateTest = async (req, res) => {
  try {
    const test = await DiagnosticTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Diagnostic test not found' });
    }

    test.name = req.body.name || test.name;
    test.category = req.body.category || test.category;
    test.description = req.body.description || test.description;
    test.price = req.body.price !== undefined ? req.body.price : test.price;
    test.sampleType = req.body.sampleType || test.sampleType;
    test.preparation = req.body.preparation || test.preparation;
    test.reportTime = req.body.reportTime || test.reportTime;
    if (req.body.isActive !== undefined) test.isActive = req.body.isActive;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating diagnostic test' });
  }
};

// @desc    Delete diagnostic test (Admin)
// @route   DELETE /api/tests/:id
// @access  Private (ADMIN)
const deleteTest = async (req, res) => {
  try {
    const test = await DiagnosticTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Diagnostic test not found' });
    }

    test.isActive = false;
    await test.save();
    res.json({ message: 'Diagnostic test deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting diagnostic test' });
  }
};

module.exports = {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest
};
