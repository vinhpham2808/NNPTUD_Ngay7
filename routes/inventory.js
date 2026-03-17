var express = require('express');
var router = express.Router();
let inventoryModel = require('../schemas/inventory');

// Get all inventory
router.get('/', async function (req, res, next) {
  try {
    let result = await inventoryModel.find().populate('product');
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get inventory by ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await inventoryModel.findById(id).populate('product');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Inventory NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Add stock
router.post('/add_stock', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;
    if (!product || quantity == null || quantity <= 0) {
      return res.status(400).send({ message: "Invalid product or quantity" });
    }
    
    let result = await inventoryModel.findOneAndUpdate(
      { product: product },
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );
    
    if (!result) return res.status(404).send({ message: "Inventory for this product NOT FOUND" });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Remove stock
router.post('/remove_stock', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;
    if (!product || quantity == null || quantity <= 0) {
      return res.status(400).send({ message: "Invalid product or quantity" });
    }
    
    // We can use $inc with a negative value. Mongoose validation (min: 0) requires runValidators: true
    let result = await inventoryModel.findOneAndUpdate(
      { product: product },
      { $inc: { stock: -quantity } },
      { new: true, runValidators: true }
    );
    
    if (!result) return res.status(404).send({ message: "Inventory for this product NOT FOUND" });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Reservation
router.post('/reservation', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;
    if (!product || quantity == null || quantity <= 0) {
      return res.status(400).send({ message: "Invalid product or quantity" });
    }
    
    let result = await inventoryModel.findOneAndUpdate(
      { product: product },
      { $inc: { stock: -quantity, reserved: quantity } },
      { new: true, runValidators: true }
    );
    
    if (!result) return res.status(404).send({ message: "Inventory for this product NOT FOUND" });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Sold
router.post('/sold', async function (req, res, next) {
  try {
    let { product, quantity } = req.body;
    if (!product || quantity == null || quantity <= 0) {
      return res.status(400).send({ message: "Invalid product or quantity" });
    }
    
    let result = await inventoryModel.findOneAndUpdate(
      { product: product },
      { $inc: { reserved: -quantity, soldCount: quantity } },
      { new: true, runValidators: true }
    );
    
    if (!result) return res.status(404).send({ message: "Inventory for this product NOT FOUND" });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
