const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const multer = require("multer");
const axios = require("axios").default;

// MODELOS
//const imgModel = require("./model");
const Legajo = require("./models/legajo");

const fs = require("fs");
const path = require("path");
const favicon = require("serve-favicon");
const { type } = require("os");
require("dotenv/config");

const dbUrl = process.env.MONGO_URL;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// axios
//   .get("https://swapi.dev/api/people/1/")
//   .then((res) => {
//     console.log("RESPONSE: ", res);
//   })
//   .catch((e) => {
//     console.log("ERROR! ", e);
//   });

// DESCOMENTAR CUANDO ESTE EL SERVICIO UP
/* axios
  .get(process.env.LECTOR_PDF417)
  .then((res) => {
    //console.log("RESPONSE: ", res);
    console.log("RESPONSE: ", res.status);
  })
  .catch((e) => {
    console.log("ERROR! ", e);
  }); */

//const getLegajo = Legajo.findById("63963ee009d8e1b752660cbf");

// DESCOMENTAR CUANDO ESTE EL SERVICIO UP
/* Legajo.findById("639656e800082d66b19933ff", function (err, docs) {
  if (err) {
    console.log(err);
  } else {
    // docs.imagenDNI.forEach((element) => {
    //   console.log(element.contentType);
    // });
    //const imagBase64 = docs.imagenDNI[0].data.toString("base64");
    const imagBase64 = docs.fotoFrenteDNI.data.toString("base64");

    axios
      .post(process.env.LECTOR_PDF417, {
        contents: imagBase64,
      })
      .then(function (response) {
        // console.log(response);
        console.log("Status: " + response.status);
        console.log("CampoResult: " + response.data.result);
        console.log("BooleanoSuccess: " + response.data.sucess);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}); */

/* const validarIdentidad = async (docID) => {
  Legajo.findById(docID, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      // docs.imagenDNI.forEach((element) => {
      //   console.log(element.contentType);
      // });
      //const imagBase64 = docs.imagenDNI[0].data.toString("base64");
      const imagBase64 = docs.fotoFrenteDNI.data.toString("base64");

      axios
        .post(process.env.LECTOR_PDF417, {
          contents: imagBase64,
        })
        .then(function (response) {
          // console.log(response);
          console.log("Status: " + response.status);
          console.log("CampoResult: " + response.data.result);
          console.log("BooleanoSuccess: " + response.data.sucess);
          console.log(docID);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
}; */

const getPos = (str, caracterBusqueda, ocurrencia) => {
  return str.split(caracterBusqueda, ocurrencia).join(caracterBusqueda).length;
};

const compararDNI = (lecturaPDF417, nroDocumentoTramite) => {
  const dniExtraido = lecturaPDF417.substring(
    getPos(lecturaPDF417, "@", 4) + 1,
    getPos(lecturaPDF417, "@", 5)
  );

  if (nroDocumentoTramite == dniExtraido) {
    return true;
  } else {
    return false;
  }
};

//const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/legajo", async (req, res) => {
  const legajos = await Legajo.find({});
  res.render("legajo/index", { legajos });
});

app.get("/legajo/nuevo", (req, res) => {
  res.render("legajo/nuevo");
});

app.post("/legajo/nuevo", async (req, res) => {
  const legajoBody = {
    nroLegajo: req.body.legajo.nroLegajo,
    nombre: req.body.legajo.nombre,
    apellido: req.body.legajo.apellido,
    nroDocumento: req.body.legajo.nroDocumento,
    email: req.body.legajo.email,
  };
  const legajo = new Legajo(legajoBody);
  await legajo.save();

  res.redirect("/legajo");
});

/* app.post(
  "/legajo/nuevo",
  upload.single("legajo[imagenDNI]"),
  async (req, res) => {
    const legajoBody = {
      nroLegajo: req.body.legajo.nroLegajo,
      nombre: req.body.legajo.nombre,
      apellido: req.body.legajo.apellido,
      nroDocumento: req.body.legajo.nroDocumento,
      email: req.body.legajo.email,
      fotoFrenteDNI: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };
    const legajo = new Legajo(legajoBody);
    await legajo.save();

    // Logica para borrar la imagen local
    const dirBorrarImg = path.join(__dirname + "/uploads/" + req.file.filename);
    fs.unlink(dirBorrarImg, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    res.redirect("/legajo");
  }
); */

app.get("/legajo/:id/validar", async (req, res) => {
  const legajo = await Legajo.findById(req.params.id);
  //console.log(legajo);
  res.render("legajo/validar", { legajo });
});

app.post(
  "/legajo/:id/validar",
  upload.single("legajo[imagenDNI]"),
  async (req, res) => {
    const { id } = req.params;
    const legajoBody = {
      fotoFrenteDNI: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };
    Legajo.findByIdAndUpdate(id, legajoBody);

    // Logica para borrar la imagen local
    const dirBorrarImg = path.join(__dirname + "/uploads/" + req.file.filename);
    fs.unlink(dirBorrarImg, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    res.redirect("/legajo");
  }
);

app.get("/legajo/:id/fotofrente", async (req, res) => {
  const legajo = await Legajo.findById(req.params.id);
  res.render("legajo/fotofrente", { legajo });
});

app.post(
  "/legajo/:id/fotofrente",
  upload.single("legajo[imagenDNI]"),
  async (req, res) => {
    const { id } = req.params;
    const legajoBody = {
      lecturaPDF417: "",
      esValidado: false,
      fotoFrenteDNI: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
    };

    const imagBase64 = legajoBody.fotoFrenteDNI.data.toString("base64");

    const response = await axios
      .post(process.env.LECTOR_PDF417, {
        contents: imagBase64,
      })
      .then(function (response) {
        legajoBody.lecturaPDF417 = response.data.result;
      })
      .catch(function (error) {
        console.log(error);
      });

    let legajo = await Legajo.findByIdAndUpdate(id, legajoBody);

    if (compararDNI(legajoBody.lecturaPDF417, legajo.nroDocumento)) {
      legajoBody.esValidado = true;
    } else {
      legajoBody.esValidado = false;
    }

    legajo = await Legajo.findByIdAndUpdate(id, legajoBody);

    // Logica para borrar la imagen local
    const dirBorrarImg = path.join(__dirname + "/uploads/" + req.file.filename);
    fs.unlink(dirBorrarImg, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.redirect(`/legajo/${legajo._id}/validar`);
  }
);

app.get("/legajo/:id/firma", async (req, res) => {
  const legajo = await Legajo.findById(req.params.id);
  res.render("legajo/firma", { legajo });
});

app.post("/legajo/:id/firma", async (req, res) => {
  const { id } = req.params;
  const legajoBody = {
    firmaImagen: req.body.legajo.base64,
    esFirmado: true,
  };
  const legajo = await Legajo.findByIdAndUpdate(id, legajoBody);

  res.redirect(`/legajo/${legajo._id}/validar`);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
