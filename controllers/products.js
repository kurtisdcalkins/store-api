const Product = require("../models/product");

// This is just for testing purposes with static values
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price");
  res.status(200).json({ products, nbHits: products.length });
};

// The actual contoller: it includes filter for all of the products' keys
const getAllProducts = async (req, res) => {
  // Destructure the query
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  //   Set the queryObject to an empty object
  const queryObject = {};
  //   If one of the queries is 'featured', assigns the key, value pair to the queryObject
  if (featured) {
    queryObject.featured = featured === true ? true : false;
  }
  //   If one of the queries is 'company', assigns the key, value pair to the queryObject
  if (company) {
    queryObject.company = company;
  }
  //   If one of the queries is 'name', assigns the key, value pair to the queryObject
  if (name) {
    // the regex matches any string value, not necessarily the exact match of the name. '$options: "i"' allows case insensitivity
    queryObject.name = { $regex: name, $options: "i" };
  }
  // This sets up the numeric filters for the rating and price
  if (numericFilters) {
    // Object to map the user-friendly simbles to the operators in MongoDB/Mongoose
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    // Use regex to match the user-friendly operators to the operators in Mongoose
    const regEx = /\b(<|>|<=|>=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      //   The '-' will be used for the .split() method
      (match) => `-${operatorMap[match]}-`
    );
    // Setup the only two numeric options
    const options = ["price", "rating"];
    // Split the numeric filters on the ',' (if both price and rating are used to filter)
    filters = filters.split(",").forEach((item) => {
      // Destructure the split along the '-' to split by the filter name, the operator, and the value
      const [field, operator, value] = item.split("-");
      //   Assigns the queryObject the key of field to an object with key, value pairs of the operator: value
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  //   console.log(queryObject);
  // Assign the result to the filtered Product based on the qeuryObject
  let result = Product.find(queryObject);
  //   Sort
  if (sort) {
    // Create an array of the sort options
    const sortList = sort.split(",").join(" ");
    // Re-assign the result to the result sorted by the sortlist
    result = result.sort(sortList);
  } else {
    // If there is no sort, the default sort is by the 'createdAt' value
    result = result.sort("createdAt");
  }
  //   If you only want to show certain fields (values) of the product, this is what does that
  if (fields) {
    // Split the fields on the ',', and then selects only those fileds from the results
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  //   For pagination
  // Sets the page number based on if the user input a different page. Default is page 1
  const page = Number(req.query.page) || 1;
  //   Sets a 'limit' value for how many items will be shown on each page. Default is 10
  const limit = Number(req.query.limit) || 10;
  //   Sets a 'skip' value based on the page and limit values. Essentially, skipping the 'limit' values for each successive page number
  const skip = (page - 1) * limit;
  //   Implement the skip and limit onto the results
  result = result.skip(skip).limit(limit);
  //   Async action to await the results
  const products = await result;
  //   Sends the status and the number of hits and the products after all of the filtering
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
