const { ClothingItems } = require("../models/clothingItems");
const errors = require("../utils/errors");

// GET /items - Returns all clothing items
const getAllClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return errors.DEFAULT.send({
        message: "Error fetching clothing items",
        err,
      });
    });
};

// POST /items - Creates a new item
// const createClothingItem = (req, res) => {
//   const { name, weather, imageUrl, likeItem, dislikeItem } = req.body;

//   // Add the owner field from the authenticated user
//   const owner = req.user._id;

//   ClothingItems.create({
//     name,
//     weather,
//     imageUrl,
//     likeItem,
//     dislikeItem,
//     owner,
//   })
//     .then((item) => {
//       console.log(item);
//       res.send({ data: item });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res
//           .status(400)
//           .json({ message: "Error creating item", error: err.message });
//       }
//       return res
//         .status(500)
//         .json({ message: "Error creating item", error: err.message });
//     });
// };

const createClothingItem = (req, res) => {
  // console.log(req);
  // console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  ClothingItems.create({ name, weather, imageUrl, owner: req.user._Id })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from createClothingItem", err });
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
      return errors.DEFAULT.send({
        message: "Error deleting clothing item",
        err,
      });
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
      return errors.DEFAULT.send({
        message: "Error updating clothing item",
        err,
      });
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
        return res.status(400).send({ message: "Invalid item ID" });
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
        return errors.BAD_REQUEST.send({ message: "Invalid item ID" });
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
