"use strict";

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/sandbox");

const db = mongoose.connection;

db.on("error", err => {
  console.error("connection error:", err);
});

db.once("open", () => {
  console.log("db connection successful");
  // all database communication goes here

  const Schema = mongoose.Schema;
  const AnimalSchema = new Schema({
    type: { type: String, default: "goldfish" },
    color: { type: String, default: "golden" },
    size: { type: String, default: "small" },
    mass: { type: Number, default: 0.007 },
    name: { type: String, default: "Angela" }
  });

  const Animal = mongoose.model("Animal", AnimalSchema);

  const elephant = new Animal({
    type: "elephant",
    color: "gray",
    size: "big",
    mass: 6000,
    name: "Lawrence"
  });

  const animal = new Animal(); // goldfish

  const whale = new Animal({
    type: "whale",
    size: "bid",
    mass: 190500,
    name: "Fig"
  });

  Animal.remove({}, () => {
    elephant.save(err => {
      if (err) console.error("save failed.", err);
      animal.save(err => {
        if (err) console.error("save failed.", err);
        whale.save(err => {
          if (err) console.error("save failed.", err);
          Animal.find({ size: "big" }, (err, animals) => {
            animals.forEach(animal => {
              console.log(
                animal.name + " the " + animal.color + " " + animal.type
              );
            });

            db.close(() => {
              console.log("db connection closed");
            });
          });
        });
      });
    });
  });
});
