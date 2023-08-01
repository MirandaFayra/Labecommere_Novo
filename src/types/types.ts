export type TUser ={
    id:string,
    name:string,
    email:string,
    password:string, 
}

export type TProducts ={
    id:string,
    name:string,
    price:string,
    description:string,
    imageUrl:string
}

export type TPurchases ={
    id:string,
    buyer:string,
    total_price:number
}