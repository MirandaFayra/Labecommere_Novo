import { Request, Response } from "express"
import { db } from "../../database/connection"

export const getAllProducts = async (req:Request, res:Response) => {
    try {
        const name = req.query.name
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
}