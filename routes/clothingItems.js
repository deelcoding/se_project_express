const router = require("express").Router();

const {
  getAllClothingItems,
  createClothingItem,
  deleteClothingItem,
  updateClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// GET /items - Returns all clothing items
router.get("/", getAllClothingItems);

// POST /items - Creates a new clothing item
router.post("/", createClothingItem);

// DELETE /items/:itemId - Deletes an item by _id
router.delete("/:itemId", deleteClothingItem);

// UPDATE /items/:itemId - Updates an item by _id
router.put("/:itemId", updateClothingItem);

// Add and Delete Likes
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;