const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
  // name: String,
  // desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const LegajoSchema = new Schema({
  nroLegajo: { type: String, required: true },
  creado: { type: Date, default: Date.now() },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  nroDocumento: { type: Number, required: true },
  email: { type: String, required: true },
  estado: { type: String, default: "inicial" },
  esValidado: { type: Boolean, default: false },
  esFirmado: { type: Boolean, default: false },
  lecturaPDF417: { type: String },
  //imagenDNI: [ImageSchema],
  /*   imagenDNI: [
    {
      data: Buffer,
      contentType: String,
    },
  ], */
  fotoFrenteDNI: {
    data: Buffer,
    contentType: String,
  },
  firmaImagen: { type: String },
});

// const BookSchema = new Schema({
//   title: { type: String, required: true },
//   author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
//   summary: { type: String, required: true },
//   isbn: { type: String, required: true },
//   genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
// });

// // Virtual for book's URL
// BookSchema.virtual("url").get(function () {
//   // We don't use an arrow function as we'll need the this object
//   return `/catalog/book/${this._id}`;
// });

// Export model
module.exports = mongoose.model("Legajo", LegajoSchema);
