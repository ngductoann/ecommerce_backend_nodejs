const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage
    discount_value: { type: Number, required: true }, // 10.000, 10
    discount_max_value: { type: Number, required: true }, // 10.000, 10
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true }, // date to start the discount
    discount_end_date: { type: Date, required: true }, // date to end the discount
    discount_max_uses: { type: Number, require: true }, // max uses of the discount
    discount_uses_count: { type: Number, require: true }, // count of how many times the discount has been used
    discount_users_used: { type: Array, default: [] }, // array of users who have used the discount
    discount_max_uses_per_user: { type: Number, require: true }, // max uses of the discount per user
    discount_min_order_value: { type: Number, require: true }, // min order value to apply discount
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      require: true,
    }, // shop id

    discount_is_active: { type: Boolean, default: true }, // is the discount active
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    }, // all or specific products
    discount_product_ids: { type: Array, default: [] }, // array of product ids (products that the discount applies to)
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

module.exports = model(DOCUMENT_NAME, discountSchema);
