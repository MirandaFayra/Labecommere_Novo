import express, { Request, Response } from 'express'
import cors from 'cors'
import {db} from './database/connection'
import { creatNewUser } from './endpoints/users/createNewUser'
import { getAllUsers } from './endpoints/users/getAllUsers'

const app = express()

app.use(express.json())
app.use(cors())

//------------- USERS ------------

app.get("/users",getAllUsers)
app.post("/users",creatNewUser)

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

//-------------- GET ALL PRODUCTS FUN 1 E FUN 2 ------------------

app.get("/products",async (req:Request, res:Response) => {
    try {
        const name = req.query.name;
        //const productsResult = await db.select("*").from("products");
        //const productsFilteredByName = await db.select("*").from("products").where("name", "LIKE", `%${name}%`);
        //const productsFilteredByName = await db.raw(
            //`SELECT * FROM products 
            //WHERE name LIKE '%${name}%'`)

           // const productsResult = await db.select("*").from("products");

            //const productsFiltred = productsResult.filter(product => product.name === name)


        /*if(name){
            const productsFilteredByName = await db.select("*").from("products").where("name", "LIKE", `%${name}%`);
            console.log("cai aqui")
            res.status(200).send(productsFilteredByName)

        }else{
            const productsResult = await db.select("*").from("products");
            res.status(200).send(productsResult)
        }*/
        if (name === undefined) {
            const productsResult = await db.select("*").from("products");
            res.status(200).send(productsResult)
        }else{
            const productsFilteredByName = await db("products").where("name", "LIKE", `%${name}%`)
            res.status(200).send(productsFilteredByName)
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
