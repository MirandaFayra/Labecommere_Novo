import { Request, Response } from "express"
import { db } from "../../database/connection"
import { TProducts } from "../../types/types"

export const createNewProduct = async(req:Request,res:Response)=>{
    try {
        const {id,name,price,description,image_url} =req.body
        
        const newProduct :TProducts ={
            id,
            name,
            price,
            description,
            image_url
        }

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

        await db ("products").insert(newProduct)

        res.status(200).send("Produto cadastrado com sucesso")
        
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
}