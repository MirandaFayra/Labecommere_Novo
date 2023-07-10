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

        res.status(200).send("Pessoa usuária cadastrada com sucesso")
        
    } catch (error) {
        console.log(error)

        if(req.statusCode === 200){
            res.status(500).send("Desculpe, mas parece que ocorreu um erro interno. Por favor, tente novamente mais tarde")
        }

        if(error instanceof Error) {
            res.send(error.message)
        }else{
            res.send("Erro inesperado")
        }   
    }
})

//------------- CREATE PRODUCT ------------

app.post("/products",async(req:Request,res:Response)=>{
    try {
        const {id,name,price,description,image_url} =req.body
        
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'name' inválido, deve ser string")
        }

        if(typeof price !== "number"){
            res.status(400)
            throw new Error("'price' inválido, deve ser um número")
        }

        if(typeof description !== "string"){
            res.status(400)
            throw new Error("'description' inválido, deve ser string")
        }

        if(typeof image_url !== "string"){
            res.status(400)
            throw new Error("'image_url' inválido, deve ser string")
        }

        if (id.length < 1 || name.length < 1 ||description.length < 1||image_url.length < 1) {
            res.status(400)
            throw new Error("'id', 'name', 'description', 'image_url' devem possuir no mínimo 1 caractere")
        }

        const newProduct ={
            id,
            name,
            price,
            description,
            image_url
        }

        await db ("products").insert(newProduct)

        res.status(200).send("Pessoa usuária cadastrada com sucesso")
        
    } catch (error) {
        console.log(error)

        if(req.statusCode === 200){
            res.status(500).send("Desculpe, mas parece que ocorreu um erro interno. Por favor, tente novamente mais tarde")
        }

        if(error instanceof Error) {
            res.send(error.message)
        }else{
            res.send("Erro inesperado")
        }   
    }
})
// ------------ GET ALL PRODUCTS ------------

app.get('/products',async (req: Request, res: Response)=> {
    try {
        const result = await db.select("*").from('products');
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

//------------ EDIT PRODUCT BY ID -----------

//------------ CREATE PURCHASE --------------

app.post("/purchases",async(req:Request,res:Response)=>{
    try {
        const {id,buyer,total_price} =req.body
        
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("'id' inválido, deve ser string")
        }

        if(typeof buyer !== "string"){
            res.status(400)
            throw new Error("'buyer' inválido, deve ser string")
        }

        if(typeof total_price !== "number"){
            res.status(400)
            throw new Error("'total_price' inválido, deve ser um número")
        }

        
        if (id.length < 1 || buyer.length < 1) {
            res.status(400)
            throw new Error("'id', 'buyer', devem possuir no mínimo 1 caractere")
        }

        if(total_price <1){
            res.status(400)
            throw new Error("'total_price', devem ser maior que 1")
        }

        const newPurchase ={
            id,
            buyer,
            total_price 
        }

        await db ("purchases").insert(newPurchase)

        res.status(200).send("Compra cadastrada com sucesso")
        
    } catch (error) {
        console.log(error)

        if(req.statusCode === 200){
            res.status(500).send("Desculpe, mas parece que ocorreu um erro interno. Por favor, tente novamente mais tarde")
        }

        if(error instanceof Error) {
            res.send(error.message)
        }else{
            res.send("Erro inesperado")
        }   
    }
})

//------------ DELETE PURCHASE BY ID ----------


//------------- VERIFICANDO O SERVIDOR --------
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})
