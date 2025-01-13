const ClothingItems = require("../models/clothingItems");
const errors = require("../utils/errors");

// GET /items - Returns all clothing items
const getAllClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      errors.DEFAULT.send({ message: "Error fetching clothing items", err });
    });
};

// POST /items - Creates a new item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, likeItem, dislikeItem } = req.body;

  ClothingItems.create({ name, weather, imageUrl, likeItem, dislikeItem })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      errors.DEFAULT.send({ message: err.message });
    });
};

// DELETE /items/:itemId - Deletes an item by _id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      console.error(err);
      errors.DEFAULT.send({ message: "Error deleting clothing item", err });
    });
};

// Update items
const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  console.log(itemId, imageUrl);
  ClothingItems.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      errors.DEFAULT.send({ message: "Error updating clothing item", err });
    });
};

const likeItem = (req, res, next) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // Add user ID if not already in the array
    { new: true } // Return the updated document
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return errors.NOT_FOUND.send({ message: "Item not found" });
      } else {
        return res.status(200).send(updatedItem);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        errors.BAD_REQUEST.send({ message: "Invalid item ID" });
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return errors.NOT_FOUND.send({ message: "Item not found" });
      }
      res.status(200).send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        errors.BAD_REQUEST.send({ message: "Invalid item ID" });
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllClothingItems,
  createClothingItem,
  deleteClothingItem,
  updateClothingItem,
  likeItem,
  dislikeItem,
};
