-- Створення таблиці користувачів
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(50) CHECK (user_type IN ('admin', 'customer')) NOT NULL DEFAULT 'customer',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці категорій
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Створення таблиці виробників
CREATE TABLE manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(100),
    contact_info TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    manufacturer_id INT REFERENCES manufacturers(id) ON DELETE SET NULL,
    scale VARCHAR(20),
    material VARCHAR(50),
    release_year INT,
    image_urls TEXT[],
    detailed_description TEXT
);
-- Створення таблиці відгуків
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці корзини
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Створення таблиці елементів корзини
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0)
);

-- Створення таблиці замовлень
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('processing', 'shipped', 'delivered')) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Створення таблиці елементів замовлення
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL
);

-- Створення таблиці способів оплати
--CREATE TABLE payment_methods (
--    id SERIAL PRIMARY KEY,
 --   name VARCHAR(100) UNIQUE NOT NULL
--);

CREATE TABLE order_info (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_method VARCHAR(100) NOT NULL
);

-- Створення таблиці доставки
CREATE TABLE shipping (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    shipping_service VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    shipping_status VARCHAR(50) CHECK (shipping_status IN ('pending', 'in transit', 'delivered')) NOT NULL
);

-- Вставка категорій
INSERT INTO categories (name, description)
VALUES
('Фігурки', 'Колекційні фігурки персонажів з фільмів та мультсеріалів'),
('Моделі', 'Моделі техніки, транспорту та будівель'),
('М''які іграшки', 'М''які іграшки для дітей та дорослих'),
('Раритети', 'Іграшки, які вже не виробляються'),
('Конструктори', 'Конструктори для дітей та дорослих'),
('Іграшки для колекціонерів', 'Ексклюзивні іграшки для колекціонування'),
('Вітражні іграшки', 'Ручно виготовлені іграшки в стилі вітражу'),
('Пазли', 'Колекційні пазли з унікальними зображеннями'),
('Мініатюри', 'Мініатюрні копії реальних об''єктів і персонажів'),
('Іграшки з аніме', 'Колекційні іграшки, пов’язані з аніме'),
('Іграшки для дорослих', 'Колекційні предмети для дорослих колекціонерів'),
('Іграшки з супергероями', 'Колекційні фігурки та іграшки супергероїв'),
('Винищувачі', 'Моделі військової техніки та винищувачів'),
('Іграшки з культових серіалів', 'Колекційні іграшки з популярних телевізійних серіалів'),
('Іграшки з фентезі', 'Колекційні фігурки з фентезі тематики'),
('Роботи', 'Іграшки роботи та моделі роботів'),
('Іграшки з казок', 'Колекційні іграшки з персонажами казок'),
('Технічні іграшки', 'Іграшки, що імітують роботу техніки та механізмів'),
('Симулятори', 'Моделі іграшок, що імітують реальні процеси і об''єкти'),
('Ретро-іграшки', 'Колекційні іграшки з минулого століття');


-- Вставка виробників
INSERT INTO manufacturers (name, country, contact_info)
VALUES
('Funko', 'США', 'contact@funko.com'),
('Hasbro', 'США', 'contact@hasbro.com'),
('LEGO', 'Данія', 'contact@lego.com'),
('Mattel', 'США', 'contact@mattel.com'),
('Bandai', 'Японія', 'contact@bandai.com'),
('NECA', 'США', 'contact@neca.com'),
('Hot Toys', 'Гонконг', 'contact@hottoys.com.hk'),
('McFarlane Toys', 'США', 'contact@mcfarlane.com'),
('Takara Tomy', 'Японія', 'contact@takaratomy.com'),
('Playmates Toys', 'США', 'contact@playmatestoys.com'),
('Diamond Select Toys', 'США', 'contact@diamondselecttoys.com'),
('Jakks Pacific', 'США', 'contact@jakks.com'),
('Kotobukiya', 'Японія', 'contact@kotobukiya.co.jp'),
('Mattel Creations', 'США', 'contact@mattelcreations.com'),
('Super7', 'США', 'contact@super7.com'),
('Good Smile Company', 'Японія', 'contact@goodsmilecompany.com'),
('Banpresto', 'Японія', 'contact@banpresto.com'),
('Revoltech', 'Японія', 'contact@revoltech.com'),
('Sideshow Collectibles', 'США', 'contact@sideshow.com');


-- Вставка товарів
INSERT INTO products (name, description, price, stock_quantity, category_id, manufacturer_id, scale, material, release_year)
VALUES
('Funko Pop! Spider-Man', 'Колекційна фігурка Спайдермена в стилі Funko Pop!', 39.99, 100, 1, 1, 'Стандарт', 'Пластик', 2022),
('LEGO Star Wars X-Wing', 'Модель космічного корабля X-Wing з серії LEGO Star Wars', 149.99, 50, 2, 3, 'Масштаб 1:20', 'Пластик', 2021),
('Маттел Barbie', 'Колекційна лялька Барбі в вінтажному стилі', 69.99, 30, 3, 4, 'Стандарт', 'Пластик', 1990),
('Funko Pop! Darth Vader', 'Колекційна фігурка Дарта Вейдера з серії Funko Pop!', 49.99, 80, 1, 1, 'Стандарт', 'Пластик', 2023),
('LEGO Technic Ferrari', 'Модель автомобіля Ferrari з серії LEGO Technic', 199.99, 40, 2, 3, 'Масштаб 1:8', 'Пластик', 2020),
('Bandai Gundam RX-78', 'Модель гандема RX-78 з серії Bandai', 99.99, 60, 1, 5, 'Масштаб 1:144', 'Пластик', 2022),
('Hot Toys Iron Man', 'Фігурка Залізної Людини від Hot Toys, з високим рівнем деталізації', 249.99, 35, 1, 7, 'Стандарт', 'Пластик, Метал', 2021),
('McFarlane Toys The Walking Dead', 'Фігурка персонажа з серіалу The Walking Dead', 59.99, 45, 6, 8, 'Стандарт', 'Пластик', 2022),
('NECA Terminator', 'Колекційна фігурка Термінатора з фільму', 79.99, 70, 1, 6, 'Стандарт', 'Пластик', 2023),
('Takara Tomy Transformers', 'Модель Трансформера від Takara Tomy', 129.99, 25, 1, 9, 'Масштаб 1:12', 'Пластик, Метал', 2021),
('Playmates Toys Teenage Mutant Ninja Turtles', 'Фігурка Черепашки Ніндзя від Playmates', 39.99, 100, 10, 10, 'Стандарт', 'Пластик', 2022),
('Diamond Select Toys Marvel', 'Фігурка супергероя Marvel від Diamond Select Toys', 89.99, 80, 1, 11, 'Стандарт', 'Пластик', 2023),
('Kotobukiya Star Wars', 'Модель персонажа Star Wars від Kotobukiya', 99.99, 50, 5, 12, 'Масштаб 1:8', 'Пластик', 2021),
('Mattel Creations He-Man', 'Фігурка героя He-Man від Mattel Creations', 79.99, 40, 1, 13, 'Стандарт', 'Пластик', 2022),
('Super7 Masters of the Universe', 'Колекційна фігурка Masters of the Universe', 119.99, 60, 1, 13, 'Стандарт', 'Пластик', 2023),
('Good Smile Company Nendoroid', 'Колекційна фігурка Nendoroid', 89.99, 50, 1, 15, 'Стандарт', 'Пластик', 2021),
('Banpresto Dragon Ball', 'Фігурка персонажа з Dragon Ball від Banpresto', 69.99, 90, 10, 16, 'Стандарт', 'Пластик', 2022),
('Revoltech EVA', 'Модель EVA з аніме Neon Genesis Evangelion від Revoltech', 149.99, 30, 1, 17, 'Масштаб 1:10', 'Пластик', 2023),
('Sideshow Collectibles Darth Vader', 'Колекційна фігурка Дарта Вейдера від Sideshow', 349.99, 20, 1, 18, 'Стандарт', 'Пластик, Метал', 2022),
('Mattel Jurassic Park', 'Фігурка динозавра з серії Jurassic Park від Mattel', 99.99, 60, 3, 4, 'Стандарт', 'Пластик', 2023);
---------------
update products set image_urls = '{"1.jpg","1_1.jpg"}' where id = 1;
update products set image_urls = '{"2.jpg","2_1.jpg","2_2.jpg"}' where id = 2;
update products set image_urls = '{"3.jpg","3_1.jpg"}' where id = 3;
update products set image_urls = '{"4.jpg","4_1.jpg"}' where id = 4;
update products set image_urls = '{"5.jpg","5_1.jpg"}' where id = 5;
update products set image_urls = '{"6.jpg","6_1.jpg"}' where id = 6;
update products set image_urls = '{"7.jpg","7_1.jpg"}' where id = 7;
update products set image_urls = '{"8.jpg","8_1.jpg"}' where id = 8;
update products set image_urls = '{"9.jpg","9_1.jpg"}' where id = 9;
update products set image_urls = '{"10.jpg","1_1.jpg"}' where id = 10;
update products set image_urls = '{"11.jpg","1_1.jpg"}' where id = 11;
update products set image_urls = '{"12.jpg","1_1.jpg"}' where id = 12;
update products set image_urls = '{"13.jpg","1_1.jpg"}' where id = 13;
update products set image_urls = '{"14.jpg","1_1.jpg"}' where id = 14;
update products set image_urls = '{"15.jpg","1_1.jpg"}' where id = 15;
update products set image_urls = '{"16.jpg","1_1.jpg"}' where id = 16;
update products set image_urls = '{"17.jpg","1_1.jpg"}' where id = 17;
update products set image_urls = '{"18.jpg","1_1.jpg"}' where id = 18;
update products set image_urls = '{"19.jpg","1_1.jpg"}' where id = 19;
update products set image_urls = '{"20.jpg","1_1.jpg"}' where id = 20;

-- Вставка користувачів
INSERT INTO users (name, email, password_hash, phone, user_type)
VALUES
('Іван Петренко', 'ivan.petrenko@example.com', 'hash12345', '380501234567', 'admin'),
('Оксана Іваненко', 'oksana.ivanenko@example.com', 'hash54321', NULL, 'customer'),
('Петро Сидоренко', 'petro.sydorenko@example.com', 'hash67890', '380931112233', 'customer'),
('Марина Коваль', 'marina.koval@example.com', 'hash09876', NULL, 'customer');

-- Вставка відгуків
INSERT INTO reviews (user_id, product_id, rating, review_text)
VALUES
(1, 1, 5, 'Чудова фігурка, дуже детальна!'),
(2, 3, 4, 'Барбі виглядає класно, але ціна трохи висока'),
(1, 2, 5, 'LEGO Star Wars - найкраща модель! Дуже задоволений покупкою'),
(3, 4, 5, 'Фігурка Дарт Вейдера просто шикарна! Рекомендую всім'),
(1, 5, 5, 'Модель Ferrari від LEGO — це шедевр!'),
(2, 6, 5, 'Гандем від Bandai — чудова якість!');

-- Вставка замовлень
--INSERT INTO orders (user_id, order_date, status, total_price, payment_method_id)
--VALUES
--(1, '2025-02-14 10:30:00', 'processing', 469.95, 1),
--(2, '2025-02-14 11:00:00', 'shipped', 479.96, 2),
--(3, '2025-02-13 16:45:00', 'delivered', 619.98, 3);

-- Вставка замовлень
INSERT INTO orders (user_id, order_date, status, total_price)
VALUES
(1, '2025-02-14 10:30:00', 'processing', 469.95),
(2, '2025-02-14 11:00:00', 'shipped', 479.96),
(3, '2025-02-13 16:45:00', 'delivered', 619.98);

-- Вставка елементів замовлень
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
(1, 1, 2, 39.99),
(1, 2, 1, 149.99),
(2, 3, 1, 69.99),
(3, 4, 1, 49.99),
(2, 5, 1, 199.99);

-- Вставка доставки
INSERT INTO shipping (order_id, shipping_service, tracking_number, shipping_status)
VALUES
(1, 'Nova Poshta', 'NP1234567890', 'pending'),
(2, 'Ukrposhta', 'UP987654321', 'in transit'),
(3, 'DHL', 'DHL00123456789', 'delivered');


UPDATE products
SET detailed_description = 'Funko Pop! Spider-Man: Ця фігурка має величезну голову у стилі Funko Pop!, що робить її впізнаваною. Яскраві кольори костюма Людини-Павука і ретельна деталізація маски та павутиння підкреслюють її якісне виготовлення. Висота близько 10 см дозволяє легко помістити її на будь-яку полицю або робочий стіл.'
WHERE id = 1;

UPDATE products
SET detailed_description = 'LEGO Star Wars X-Wing: Цей набір включає в себе понад 700 деталей, які дозволяють відтворити X-Wing з максимальною точністю. Модель має рухливі крила, кабіну, де можна посадити мініфігурку пілота, і навіть R2-D2. Чудовий вибір для фанатів «Зоряних війн» усіх вікових категорій.'
WHERE id = 2;

UPDATE products
SET detailed_description = 'Маттел Barbie: Вінтажна лялька Барбі представлена в розкішній коробці з прозорим віконцем, що робить її відмінним подарунком. Вбрання ляльки стилізоване під 1960-ті роки, включаючи класичну зачіску та аксесуари, такі як сумочка і сонцезахисні окуляри.'
WHERE id = 3;

UPDATE products
SET detailed_description = 'Funko Pop! Darth Vader: Фігурка Дарта Вейдера має характерні риси, такі як шолом з дихальними отворами та чорний плащ. Висота фігурки близько 10 см робить її ідеальним доповненням до будь-якої колекції.'
WHERE id = 4;

UPDATE products
SET detailed_description = 'LEGO Technic Ferrari: Масштаб 1:8 дозволяє детально передати конструкцію Ferrari, включаючи рухливі елементи, такі як підвіска, кермо і двигун V12. Набір складається з понад 1600 деталей і є справжнім викликом для будівельників.'
WHERE id = 5;

UPDATE products
SET detailed_description = 'Bandai Gundam RX-78: Ця модель гундему має високу деталізацію і складається з багатьох дрібних частин, що дозволяють змінювати пози фігурки. Висота в зібраному стані близько 13 см. Відмінно підходить як для новачків, так і для досвідчених колекціонерів.'
WHERE id = 6;

UPDATE products
SET detailed_description = 'Hot Toys Iron Man: Фігурка Залізної Людини має високу деталізацію, включаючи металевий корпус, LED-підсвітку у очах та на грудях. Висота фігурки близько 30 см, і вона постачається з набором змінних рук та зброї.'
WHERE id = 7;

UPDATE products
SET detailed_description = 'McFarlane Toys The Walking Dead: Фігурка одного з головних героїв серіалу має висоту близько 15 см. Вона оснащена рухливими суглобами, що дозволяють змінювати пози для відтворення епічних сцен.'
WHERE id = 8;

UPDATE products
SET detailed_description = 'NECA Terminator: Колекційна фігурка Термінатора має висоту близько 18 см. Вона виконана з деталізацією, що включає різні рівні пошкоджень та металеві частини. Фігурка має додаткові аксесуари, такі як змінні голови та зброя.'
WHERE id = 9;

UPDATE products
SET detailed_description = 'Takara Tomy Transformers: Ця модель трансформера може змінювати форму з робота на автомобіль і навпаки. Масштаб 1:12 і включення металевих деталей роблять її надійною та довговічною.'
WHERE id = 10;

UPDATE products
SET detailed_description = 'Playmates Toys Teenage Mutant Ninja Turtles: Фігурки черепашок-ніндзя мають високу деталізацію і включають змінні руки та зброю. Кожна фігурка висотою близько 12 см і виконана з високоякісного пластику.'
WHERE id = 11;

UPDATE products
SET detailed_description = 'Diamond Select Toys Marvel: Ця фігурка супергероя має висоту близько 18 см і включає рухливі частини. Вона виготовлена з якісного пластику і постачається з підставкою для демонстрації.'
WHERE id = 12;

UPDATE products
SET detailed_description = 'Kotobukiya Star Wars: Модель персонажа з «Зоряних війн» від Kotobukiya має висоту близько 22 см. Виготовлена з преміального пластику з високою деталізацією костюма та обличчя.'
WHERE id = 13;

UPDATE products
SET detailed_description = 'Mattel Creations He-Man: Фігурка He-Man має висоту близько 18 см і включає змінні зброї та аксесуари. Вона виконана з високоякісного пластику і має рухливі частини.'
WHERE id = 14;

UPDATE products
SET detailed_description = 'Super7 Masters of the Universe: Фігурки з цієї серії мають автентичний вигляд і висоту близько 18 см. Вони включають різні аксесуари та змінні частини, що робить їх унікальними для колекціонерів.'
WHERE id = 15;

UPDATE products
SET detailed_description = 'Good Smile Company Nendoroid: Колекційні фігурки Nendoroid мають висоту близько 10 см і включають велику кількість змінних частин та аксесуарів. Вони виготовлені з високоякісного пластику.'
WHERE id = 16;

UPDATE products
SET detailed_description = 'Banpresto Dragon Ball: Фігурка персонажа з «Dragon Ball» має висоту близько 15 см і виконана у динамічній позі. Вона має яскраві кольори та деталізацію, яка підкреслює характер персонажа.'
WHERE id = 17;

UPDATE products
SET detailed_description = 'Revoltech EVA: Модель EVA з «Neon Genesis Evangelion» має висоту близько 20 см і включає рухливі частини та додаткові аксесуари. Вона виготовлена з високоякісного пластику.'
WHERE id = 18;

UPDATE products
SET detailed_description = 'Sideshow Collectibles Darth Vader: Ця преміальна фігурка Дарта Вейдера має висоту близько 30 см і виготовлена з пластику та металу. Вона має високий рівень деталізації та рухливі частини.'
WHERE id = 19;

UPDATE products
SET detailed_description = 'Mattel Jurassic Park: Фігурка динозавра з «Jurassic Park» має висоту близько 25 см і включає рухливі суглоби. Вона виготовлена з високоякісного пластику і має реалістичний вигляд.'
WHERE id = 20;
