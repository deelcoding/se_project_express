const router = require("express").Router();

const {
  getAllClothingItems,
  createClothingItem,
  deleteClothingItem,
  updateClothingItem,
} = require("../controllers/clothingItems");

// GET /items - Returns all clothing items
router.get("/", getAllClothingItems);

// POST /items - Creates a new clothing item
router.post("/", createClothingItem);

// DELETE /items/:itemId - Deletes an item by _id
router.delete("/:itemId", deleteClothingItem);

// UPDATE /items/:itemId - Updates an item by _id
router.put("/:itemId", updateClothingItem);

// Handling non-existent resources
router.use((req, res) => {
  res.status(500).json({ message: "Requested resource not found" });
});

module.exports = router;
