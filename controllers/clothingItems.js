const { ClothingItems } = require("../models/clothingItems");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET /items - Returns all clothing items
const getAllClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({
        message: "Error fetching clothing items",
        err,
      });
    });
};

// POST /items - Creates a new item
const createClothingItem = (req, res) => {
  console.log(req.user._id); // Access the hardcoded user ID

  const { name, weather, imageUrl } = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error creating item", err });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Error creating item", err });
      }
      return res.status(SERVER_ERROR).send({ message: "Error from item", err });
    });
};

// DELETE /items/:itemId - Deletes an item by _id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
    .catch((err) => {
      console.error(err);
      /* if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error deleting item", err });
      } else */
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error deleting item", err });
      }
      return res
        .status(NOT_FOUND)
        .send({ message: "Error deleting item", err });
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
      return res.status(SERVER_ERROR).send({
        message: "Error updating clothing item",
        err,
      });
    });
};

const likeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // Add user ID if not already in the array
    { new: true } // Return the updated document
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return next(err);
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
