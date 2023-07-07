import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

//--------- VERIFICANDO O FUNCIONAMENTO ----------
app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

//------------- GET  ALL  USERS ------------

app.get('/users',async (req: Request, res: Response)=> {
    try {
        const result = await 
        
    } catch (error) {
        
    }
})

//------------- CREATE USER --------------

//------------- CREATE PRODUCT ------------

// ------------ GET ALL PRODUCTS ------------

//------------ EDIT PRODUCT BY ID -----------

//------------ CREATE PRODUCT --------------

//------------ DELETE PURCHASE BY ID ----------


//------------- VERIFICANDO O SERVIDOR --------
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})
