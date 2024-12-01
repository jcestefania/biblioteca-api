const express = require("express");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('dotenv').config();

const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Esquema y modelo de libro
const libroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  precio: { type: Number },
  url: { type: String },
});

const Libro = mongoose.model("Libro", libroSchema);

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Biblioteca API",
      version: "1.0.0",
      description: "API para gestionar una biblioteca de libros",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./app.js"], // Archivo donde están los comentarios de Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *         - isbn
 *       properties:
 *         titulo:
 *           type: string
 *           description: El título del libro
 *         autor:
 *           type: string
 *           description: El autor del libro
 *         isbn:
 *           type: string
 *           description: El ISBN único del libro
 *         precio:
 *           type: number
 *           description: El precio del libro
 *         url:
 *           type: string
 *           description: URL del libro
 *       example:
 *         titulo: "El Principito"
 *         autor: "Antoine de Saint-Exupéry"
 *         isbn: "123456789"
 *         precio: 19.99
 *         url: "https://example.com/principito"
 */

/**
 * @swagger
 * /biblioteca:
 *   post:
 *     summary: Agrega un nuevo libro a la biblioteca
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       201:
 *         description: Libro agregado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 */
app.post("/biblioteca", async (req, res) => {
  try {
    const newLibro = new Libro(req.body);
    const savedLibro = await newLibro.save();
    res.status(201).json(savedLibro);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar el libro", error });
  }
});

/**
 * @swagger
 * /biblioteca:
 *   get:
 *     summary: Obtiene todos los libros de la biblioteca
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
app.get("/biblioteca", async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los libros", error });
  }
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   get:
 *     summary: Obtiene un libro por su ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: El ISBN del libro
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: El libro no fue encontrado
 */
app.get("/biblioteca/:isbn", async (req, res) => {
  try {
    const libro = await Libro.findOne({ isbn: req.params.isbn });
    if (!libro) return res.status(404).send("No se ha encontrado el libro.");
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el libro", error });
  }
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   put:
 *     summary: Actualiza un libro por su ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: El ISBN del libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: El libro no fue encontrado
 */
app.put("/biblioteca/:isbn", async (req, res) => {
  try {
    const updatedLibro = await Libro.findOneAndUpdate({ isbn: req.params.isbn }, req.body, { new: true });
    if (!updatedLibro) return res.status(404).send("No se ha encontrado el libro.");
    res.json(updatedLibro);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el libro", error });
  }
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   delete:
 *     summary: Elimina un libro por su ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: El ISBN del libro
 *     responses:
 *       200:
 *         description: Libro eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: El libro no fue encontrado
 */
app.delete("/biblioteca/:isbn", async (req, res) => {
  try {
    const deletedLibro = await Libro.findOneAndDelete({ isbn: req.params.isbn });
    if (!deletedLibro) return res.status(404).send("El libro no fue encontrado.");
    res.json(deletedLibro);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el libro", error });
  }
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
