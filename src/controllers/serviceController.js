const Service = require('../models/Service');

// CREATE Service
exports.createService = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/${req.file.path.replace(/\\/g, '/')}`;

    const service = new Service({
      image: imageUrl,
      title: req.body.title,
      description: req.body.description
    });

    const savedService = await service.save();
    res.status(201).json({ success: true, data: savedService });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Service BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Service
exports.updateService = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description
    };

    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      updateData.image = `${protocol}://${host}/${req.file.path.replace(/\\/g, '/')}`;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({ success: true, data: updatedService });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE Service
exports.deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
