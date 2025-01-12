const ClothingItem = require("../models/clothingItems");

// GET /items - Returns all clothing items
const getAllClothingItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching clothing items", error });
    });
};

// POST /items - Creates a new item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    // .orFail()
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .json({ message: "Error creating item", error: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(400)
          .json({ message: "Error creating item", error: err.message });
      }
      return res
        .status(500)
        .json({ message: "Error creating clothing item", error: err.message });
    });
};

// DELETE /items/:itemId - Deletes an item by _id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error deleting clothing item", error });
    });
};

// Update items
const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  console.log(itemId, imageURL);
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).sent({ data: item }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error updating clothing item", error });
    });
};

module.exports = {
  getAllClothingItems,
  createClothingItem,
  deleteClothingItem,
  updateClothingItem,
};
