const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
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
  fotoFrenteDNI: {
    data: Buffer,
    contentType: String,
  },
  documentoFirmar: {
    data: Buffer,
    contentType: String,
  },
  firmaImagen: { type: String },
});

// Export model
module.exports = mongoose.model("Legajo", LegajoSchema);
