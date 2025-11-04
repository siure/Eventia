import express from "express"
const router = express.Router()

const events = [
    { id: 1, name: "GP Sao Paulo", avaliableTicket: 3000, ticketCost: 150 },
    { id: 2, name: "GP Las Vegas", avaliableTicket: 1000, ticketCost: 300 }

];

router.get("/api/events", (req, res) => res.status(200).json(events));

router.post("/api/events", (req, res) => {
    const { name, avaliableTicket, ticketCost } = req.body;
    if (!name || !avaliableTicket || !ticketCost) { 
        return res.status(400).json({ error: " Missing required fields " });
    }
    const newEvent = {id: events.length +1 ,name, avaliableTicket, ticketCost};
    events.push(newEvent);
    res.status(201).json(newEvent);
});

export default router;