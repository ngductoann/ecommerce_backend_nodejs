"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
} = require("../models/repositories/product.repo");

// define factory class to crate product
class ProductFactory {
  /*
    type: "Closthing",
    payload
  */

  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();

    // switch (type) {
    //   case "Electronics":
    //     return new Electronic(payload).createProduct();
    //   case "Clothing":
    //     return new Clothing(payload).createProduct();
    //   default:
    //     throw new BadRequestError(`Invalid product type ${type}`);
    // }
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT

  // QUERY //
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
  // END QUERY //
}

// define base product class
/*
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: String,
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
*/
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestError("Failed to create clothing product");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

// define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Failed to create electronic product");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

// define sub-class for different product types Electronic
class Furniture extends Product {
  async createProduct() {
    const newFuniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFuniture)
      throw new BadRequestError("Failed to create furniture product");

    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct) throw new BadRequestError("Failed to create product");

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
