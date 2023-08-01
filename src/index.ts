import express, { Request, Response } from 'express'
import cors from 'cors'
import {db} from './database/connection'
import { creatNewUser } from './endpoints/users/createNewUser'
import { getAllUsers } from './endpoints/users/getAllUsers'
import { createNewProduct } from './endpoints/products/createNewProduct'
import { getAllProducts } from './endpoints/products/getAllProducts'

const app = express()

app.use(express.json())
app.use(cors())

//------------- USERS ------------
app.get("/users",getAllUsers)
app.post("/users",creatNewUser)

//-------------PRODUCTS ------------
app.get("/products",getAllProducts)
app.post("/products",createNewProduct)

//------------ EDIT PRODUCT BY ID -----------
app.put("/products/:id",async(req:Request,res:Response)=>{
    try {
        const idToEdit = req.params.id
        const {newId,newName,newPrice,newDescription,newImageUrl} = req.body
    
        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        if (newPrice !== undefined) {

            if (typeof newPrice !== "number") {
                res.status(400)
                throw new Error("'price' deve ser number")
            }

            if (newPrice < 0) {
                res.status(400)
                throw new Error("'price' deve ser maior que 0")
            }
        }

        if (newDescription !== undefined) {

            if (typeof newDescription !== "string") {
                res.status(400)
                throw new Error("'description' deve ser number")
            }

            if (newDescription.length < 1) {
                res.status(400)
                throw new Error("'newDescription' deve possuir no mínimo 1 caractere")
            }
        }

        if (newImageUrl !== undefined) {

            if (typeof newImageUrl !== "string") {
                res.status(400)
                throw new Error("'ImageUrl' deve ser number")
            }

            if (newImageUrl.length < 1) {
                res.status(400)
                throw new Error("'ImageUrl' deve possuir no mínimo 1 caractere")
            }
        }

        const [purchase] = await db("products").where({id:idToEdit})
        
        if(purchase){
            await db("products").where({ id: idToEdit }).update({
                id: newId || purchase.id,
                name: newName || purchase.name,
                price: newPrice || purchase.price,
                description: newDescription || purchase.description,
                image_url: newImageUrl || purchase.image_url
            });
                
        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send("Atualização de products realizada com sucesso!")
        
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

//--------------DELETE PURCHASE BY ID --------------

app.delete("/purchases/:id",async(req:Request,res:Response)=>{
    try {
        const idToDelete = req.params.id
        const [ purchase ] = await db.select("*").from("purchases").where({ id: idToDelete })

        if (!purchase) {
            res.status(404)
            throw new Error("'id' não encontrada")
        }
        await db.delete().from("purchases").where({ id: idToDelete })
       res.status(200).send("Pedido cancelado com sucesso")
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

//------------ GET PURCHASE BY ID -----------
app.get("/purchases/:id",async(req:Request,res:Response)=>{
    try {
        const idToSearch = req.params.id
        

        const [purchase] = await db("purchases").where({id:idToSearch})
        
        if(purchase){
            const result = await db.select("*").from("purchases")
            res.status(200).send(result)
        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }        
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

//--------- VERIFICANDO O FUNCIONAMENTO ----------
app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

//------------- VERIFICANDO O SERVIDOR --------
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})
