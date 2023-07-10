-- Active: 1688754793886@@127.0.0.1@3306

-------- CRIAR A TABELA DE USUÁRIO -----------

CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-------- LER A TABELA DE USUÁRIO ------------
SELECT * FROM users;

-------- POPULANDO TABELA USUÁRIO -----------

INSERT INTO users (id, name, email, password, created_at)
VALUES
  ('c001', 'Fulana', 'fulana@email.com', '123456', 'hoje'),
  ('c002', 'Fulano', 'fulano@email.com', '123456', 'hoje'),
  ('c003', 'Sicrana', 'sicrana@email.com', '123456', 'hoje');


-------- CRIANDO A TABELA DE  PRODUTOS -------
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-------- LER A TABELA DE PRODUTOS -----------

SELECT * FROM products; 

-------- POPULANDO TABELA PRODUTOS ----------

INSERT INTO products (id, name, price, description, image_url)
VALUES
  ('p001', 'mouse', 100, 'esrdxfcghvbj', 'image'),
  ('p002', 'teclado', 300, 'dsfcgjkn', 'image'),
  ('p003', 'PC', 400, 'fdcghvbjn', 'image'),
  ('p004', 'mouse gamer', 700, 'esrdxfcghvbj', 'image'),
  ('p005', 'teclado gamer', 900, 'dsfcgjkn', 'image'),
  ('p006', 'PC gamer', 1000, 'fdcghvbjn', 'image')
;

-------- CRIANDO A TABELA DE  COMPRAS -------

CREATE TABLE IF NOT EXISTS purchases(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

-------- LER A TABELA DE COMPRAS ------------

SELECT * FROM purchases;

-------- POPULANDO TABELA COMPRAS -----------

INSERT INTO purchases(id, buyer,total_price)
VALUES ('P001','c001',300),
       ('P002','c003',400),
       ('P003','c002',500);

-------- SELECIONANDO PURCHASE -------

SELECT * FROM purchases;

-------- CRIANDO A TABELA DE  RELAÇÃO -------

CREATE TABLE IF NOT EXISTS purchases_products(
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE 
	ON DELETE CASCADE
);


-------- LER A TABELA DE RELAÇÃO ------------

SELECT  * FROM purchases_products;

-------- POPULANDO TABELA RELAÇÃO -----------

INSERT INTO purchases_products(purchase_id, product_id, quantity)
VALUES ('P001','p001',2),
       ('P002','p002',3),
       ('P003','p003',4)
;

-------- QUERY PARA PESQUISAR OS NOMES DAS PESSOAS COMPRADORAS -----------

SELECT purchases.buyer AS purchase_id,users.id AS buyer_id,users.name AS buyer_name,users.email AS buyer_email, purchases.total_price AS total_price,purchases.created_at
FROM purchases JOIN users ON purchases.buyer = users.id;

-------- QUERY PARA PESQUISAR AS RELAÇÕES DAS COMPRAS -----------

SELECT * FROM purchases
INNER JOIN purchases_products
ON purchases_products.purchase_id = purchases.id
LEFT JOIN products
ON purchases_products.product_id = products.id;

