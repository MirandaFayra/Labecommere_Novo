import { Request, Response } from "express"
import { db } from "../../database/connection"

export const creatNewUser = async(req:Request,res:Response)=>{
    try {
        const {id,name,email,password} =req.body
        
        const newUser ={
            id,
            name,
            email,
            password
        }

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
}
