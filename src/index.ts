import express, { Request, Response } from 'express'
import cors from 'cors'
import {db} from './database/connection'

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
        const result = await db.select("*").from('users');
        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if(req.statusCode === 200){
            res.status(500).send("Desculpe, mas parece que ocorreu um erro interno. Por favor, tente novamente mais tarde")
        }

        //Tratamento apenas de erros reais
        if(error instanceof Error) {
            res.send(error.message)
        }else{
            res.send("Erro inesperado")
        }     
    }
})

//------------- CREATE USER --------------

app.post("/users",async(req:Request,res:Response)=>{
    try {
        const {id,name,email,password} =req.body
        
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'name' inválido, deve ser string")
        }

        if(typeof email !== "string"){
            res.status(400)
            throw new Error("'email' inválido, deve ser string")
        }

        if(typeof password !== "string"){
            res.status(400)
            throw new Error("'password' inválido, deve ser string")
        }

        if (id.length < 1 || name.length < 1 ||email.length < 1||password.length < 1) {
            res.status(400)
            throw new Error("'id', 'name', 'email', 'password' devem possuir no mínimo 1 caractere")
        }

        const newUser ={
            id,
            name,
            email,
            password
        }

        await db ("users").insert (newUser)

        res.status(200).send("Banda cadastrada com sucesso")
        
    } catch (error) {
        
    }
})

//------------- CREATE PRODUCT ------------

// ------------ GET ALL PRODUCTS ------------

//------------ EDIT PRODUCT BY ID -----------

//------------ CREATE PRODUCT --------------

//------------ DELETE PURCHASE BY ID ----------


//------------- VERIFICANDO O SERVIDOR --------
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})
