import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const app = express()
const prisma = new PrismaClient();

app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 5000;
// const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`)
})

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes)
})

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send("Fields Required")
    }

    try {
        const note = await prisma.note.create({
            data: {
                title,
                content
            }
        })

        res.send(note)
    } catch (error) {
        res.status(500).send("Something went wrong!")
    }
})

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body
    const id = parseInt(req.params.id)

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number")
    }
    if (!title || !content) {
        return res.status(400).send("Fields Required")
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        })
        res.json(updatedNote)
    } catch (error) {
        res.status(500).send("Something went wrong updating the note!")
    }

})

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number")
    }

    try {
        const deletedNote = await prisma.note.delete({
            where: { id },
        })
        res.status(204).send({ message: "Deletion succesful", deletedNote });
    } catch {
        res.status(500).send("Something went wrong deleting the note")
    }
}) 