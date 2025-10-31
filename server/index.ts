import express, { type Request, type Response } from "express"
import cors from "cors"
import {PrismaClient} from "./generated/prisma/index.js"

const prisma = new PrismaClient()

const app = express()


app.use(cors())
app.use(express.json()) 
const port = Number(process.env.PORT) || 5000

app.post('/experience', async (req: Request, res: Response) => {
    try {
        const { imageUrl, title, city, description, about, price } = req.body
        
        if (!imageUrl || !title || !city || !description || !about || !price) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }
        const experience = await prisma.experience.create({
            data: {
                imageUrl,
                title,
                city,
                description,
                about,
                price: parseInt(price)
            }
        })
        return res.status(201).json({
            message: "Experience created successfully",
            data: experience
        })
    } catch (error) {
        console.error('Error creating experience:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.get('/experience', async (req: Request, res: Response) => {
    try {
        const experiences = await prisma.experience.findMany({
            include: {
                slot: true
            }
        })
        return res.status(200).json({
            message: "Experiences fetched successfully",
            exp: experiences
        })
    } catch (error) {
        console.error('Error fetching experiences:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.get('/experience/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if(!id){
            return res.status(403).json({
                message : "all fields required"
            })
        }
        const experience = await prisma.experience.findUnique({
            where: { id },
            include: {
                slot: true,
                bookings: true
            }
        })

        if (!experience) {
            return res.status(404).json({
                message: "Experience not found"
            })
        }
        return res.status(200).json({
            message: "Experience fetched successfully",
            exp: experience
        })
    } catch (error) {
        console.error('Error fetching experience:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.post('/slot', async (req: Request, res: Response) => {
    try {
        const { experienceId, date, time, capacity, bookedCount } = req.body

        if (!experienceId || !date || !time || !capacity) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }

        const slot = await prisma.slot.create({
            data: {
                experienceId,
                date: new Date(date),
                time: new Date(time),
                capacity: parseInt(capacity),
                bookedCount: parseInt(bookedCount) || 0
            }
        })
        return res.status(201).json({
            message: "Slot created successfully",
            data: slot
        })
    } catch (error) {
        console.error('Error creating slot:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.get('/slot', async (req: Request, res: Response) => {
    try {
        const { experienceId } = req.query

        const slots = await prisma.slot.findMany({
            where: experienceId ? { experienceId: experienceId as string } : {},
            include: {
                experience: true
            }
        })
        return res.status(200).json({
            message: "Slots fetched successfully",
            data: slots
        })
    } catch (error) {
        console.error('Error fetching slots:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.post('/booking', async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, experienceId, name, Email, slotId, promoCode, quantity } = req.body

        if (!startDate || !endDate || !experienceId || !name || !Email || !slotId || !quantity) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }
        const experience = await prisma.experience.findUnique({
            where: { id: experienceId }
        })
        if (!experience) {
            return res.status(404).json({
                message: "Experience not found"
            })
        }
        const slot = await prisma.slot.findUnique({
            where: { id: slotId }
        })
        if (!slot) {
            return res.status(404).json({
                message: "Slot not found"
            })
        }

        if (slot.bookedCount + parseInt(quantity)>slot.capacity) {
            return res.status(400).json({
                message: "Not enough slots available"
            })
        }

        let totalPrice = experience.price * parseInt(quantity)

        if (promoCode) {
            const promo = await prisma.promoCode.findUnique({
                where: { code: promoCode }
            })

            if (promo && (!promo.expiresAt || new Date(promo.expiresAt) > new Date())) {
                if (promo.type === 'percentage') {
                    totalPrice = totalPrice - (totalPrice * promo.value / 100)
                } else if (promo.type === 'fixed') {
                    totalPrice = totalPrice - promo.value
                }
            }
        }

        const booking = await prisma.booking.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                experienceId,
                name,
                Email,
                slotId,
                promoCode,
                quantity: parseInt(quantity),
                TotalPrice: Math.max(0, totalPrice)
            }
        })

        await prisma.slot.update({
            where: { id: slotId },
            data: {
                bookedCount: {
                    increment: parseInt(quantity)
                }
            }
        })

        return res.status(201).json({
            message: "Booking created successfully",
            data: booking
        })
    } catch (error) {
        console.error('Error creating booking:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.post('/promo', async (req: Request, res: Response) => {
    try {
        const { code, type, value, expiresAt } = req.body

        if (!code || !type || !value) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }

        if (type !== 'percentage' && type !== 'fixed') {
            return res.status(400).json({
                message: "Type must be 'percentage' or 'fixed'"
            })
        }
        const promoCode = await prisma.promoCode.create({
            data: {
                code,
                type,
                value: parseInt(value),
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        })

        return res.status(201).json({
            message: "Promo code created successfully",
            data: promoCode
        })
    } catch (error) {
        console.error('Error creating promo code:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.post('/promo/validate', async (req: Request, res: Response) => {
    try {
        const { code } = req.body
        if (!code) {
            return res.status(400).json({
                message: "Promo code is required"
            })
        }
        const promoCode = await prisma.promoCode.findUnique({
            where: { code }
        })

        if (!promoCode) {
            return res.status(404).json({
                message: "Invalid promo code",
                valid: false
            })
        }
        if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
            return res.status(400).json({
                message: "Promo code has expired",
                valid: false
            })
        }
        return res.status(200).json({
            message: "Promo code is valid",
            valid: true,
            data: promoCode
        })
    } catch (error) {
        console.error('Error validating promo code:', error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.listen(port, '0.0.0.0', () => {
    console.log("server is running on port", port)
})