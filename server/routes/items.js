var express = require("express");
var router = express.Router();
const Joi = require("joi");
const cors = require("cors");

const itemsDB = [
  { id: 1, name: "item1", description: "printer", count: 10 },
  { id: 2, name: "item2", description: "keyboard", count: 30 },
  { id: 3, name: "item3", description: "screen", count: 15 },
];



var whitelist = ["http://localhost:4200","http://localhost:3000"];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

router.use(cors(corsOptionsDelegate ));

// Get inventory list of items
router.get("/items", function (req, res, next) {
  res.json(itemsDB);
});

// Get item by id
router.get("/items/:id",cors(corsOptionsDelegate), (req, res) => {
  const item = itemsDB.find((i) => i.id === parseInt(req.params.id));
  if (!item)
    return res.status(404).send("The item with the given ID was not found");
  res.send(item);
});

// Add item to inventory list
router.post("/items", cors(corsOptionsDelegate), (req, res) => {
  const { error } = validateItem(req.body); //result.error
  if (error) return res.status(400).send(error.details[0].message);

  const item = {
    id: itemsDB.length + 1,
    name: req.body.name,
    description: req.body.description,
    count: req.body.count,
  };
  itemsDB.push(item);
  res.send(item);
});

// Update item by id
router.put("/items/:id", cors(corsOptionsDelegate), (req, res) => {
  // Look up the item
  // If not existing, return 404
  const item = itemsDB.find((i) => i.id === parseInt(req.params.id));
  if (!item)
    return res.status(404).send("The item with the given ID was not found");

  // Validate
  // If invalid, return 400 error message -Bad Request
  const { error } = validateItem(req.body); //result.error
  if (error) return res.status(400).send(error.details[0].message);

  // Update item
  item.name = req.body.name;
  item.description = req.body.description;
  item.count = req.body.count;
  // Return the updated item
  res.send(item);
});

// Delete item by id
router.delete("/items/:id", cors(corsOptionsDelegate),(req, res) => {
  // Look up the item
  // Not existing, return 404
  const item = itemsDB.find((i) => i.id === parseInt(req.params.id));
  if (!item)
    return res.status(404).send("The item with the given ID was not found");
  // Delete
  const index = itemsDB.indexOf(item);
  itemsDB.splice(index, 1);

  // Return the same item
  res.send(item);
});

// Withdraw item from inventory by id and specific amount
router.put("/items/withdraw/:id/:count", cors(corsOptionsDelegate),(req, res) => {
  // Look up the item
  // If not existing, return 404
  const item = itemsDB.find((i) => i.id === parseInt(req.params.id));
  if (!item)
    return res.status(404).send("The item with the given ID was not found");

  var countParams = parseInt(req.params.count);
  var countItem = parseInt(item.count);

  // Validate given amount to withdraw
  if (0 < countParams && countParams <= countItem) {
    // Update item count
    item.count -= countParams;
    res.send(item);
  } else {
    // If given amount to withdraw is invalid, return 400 error message -Bad Request
    return res
      .status(400)
      .send(
        "The given amount to withdraw must be positive and less than item's current count."
      );
  }
});

// Deposit item from inventory by id and specific amount
router.put("/items/deposit/:id/:count", cors(corsOptionsDelegate),(req, res) => {
  // Look up the item
  // If not existing, return 404
  const item = itemsDB.find((i) => i.id === parseInt(req.params.id));
  if (!item)
    return res.status(404).send("The item with the given ID was not found");

  var countParams = parseInt(req.params.count);
  var countItem = parseInt(item.count);

  // Validate given amount to deposit
  if (0 < countParams && countParams <= 100) {
    // Update item count
    item.count = countItem + countParams;
    res.send(item);
  } else {
    // If given amount to deposit is invalid, return 400 error message -Bad Request
    return res
      .status(400)
      .send("The given amount to deposit must be positive and less than 100.");
  }
});

// Validate item's attributes
function validateItem(item) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().required(),
    count: Joi.number().positive().required(),
  });
  const result = schema.validate(item);
  return result;
}

module.exports = router;
