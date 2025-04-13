import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req,res) => {
    res.render("index", {drinks: null });
});
app.get("/search", async(req, res) => {
    const {type, value} = req.query;

    let apiUrl = "";
    switch(type) {
        case "name":
            apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${value}`;
            break;
        case "ingredient":
            apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${value}`;
            break;
        case "first-letter":
            apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${value}`;
            break;
        case "random":
            apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
            break;
        case "id":
            apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${value}`;
            break;
        default:
            return res.status(400).send("Filtru necunoscut!");
    }
    try {
        const result = await axios.get(apiUrl);
        res.render("index.ejs",{drinks: result.data.drinks});
    } catch (error) {
        console.log("Eroare la API:", error.message);
        res.status(500).send("Eroare la interogarea API-ului!");
    }
});

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});