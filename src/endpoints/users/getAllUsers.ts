import { Request, Response } from "express"
import { db } from "../../database/connection"


export const getAllUsers = async (req: Request, res: Response)=> {
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
}