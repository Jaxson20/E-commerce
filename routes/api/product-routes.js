const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Get all products (including associated Category and Tag data)
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category }, // Include associated Category
        { model: Tag }, // Include associated Tag
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product by ID (including associated Category and Tag data)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category }, // Include associated Category
        { model: Tag }, // Include associated Tag
      ],
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    // Include logic to handle updating associated tags (ProductTag relationships)
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = req.body.tagIds.map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));

      await ProductTag.destroy({ where: { product_id: req.params.id } });
      await ProductTag.bulkCreate(productTags);
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

