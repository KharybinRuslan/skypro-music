Skypro.Music API, written on ExpressJs with MongoDB.
API для музыкального плеера, позволяет получает разные плейлисты с музыкой и управлять избранными треками пользователя.

How to run
Api задеплоено на домене webdev-music-003b5b991590.herokuapp.com

Create .env file under src directory.
PORT = 7500
JWT_SECRET = <key>
JWT_REFRESH_SECRET = <key>
Run docker
docker-compose up
Примеры запросов:
Пользователи
Описание запроса	Пример
Зарегистрироваться	POST - /user/signup/
Войти	POST - /user/login/
Получить ключ	POST - /user/token/
Обновить ключ	POST - /user/token/refresh/
Подробно
Зарегистрироваться
Адрес: https://webdev-music-003b5b991590.herokuapp.com/user/signup/

Метод: POST

Создает нового пользователя в системе. В теле запроса принимает объект пользователя в формате JSON. Обязательные поля для нового пользвателя email, password и username.

Пример запроса:

fetch("https://webdev-music-003b5b991590.herokuapp.com/user/signup/", {
  method: "POST",
  body: JSON.stringify({
    email: "test@test.ru",
    password: "test@test.ru",
    username: "Testtest",
  }),
  headers: {
    // API требует обязательного указания заголовка content-type, так апи понимает что мы посылаем ему json строчку в теле запроса
    "content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
201 ответ
Пользователь успешно зарегистрирован, в теле ответа будет объект со статусом регистрации и данными пользователя:

{
    "message": "Пользователь был успешно создан!",
    "result": {
        "username": "Testtest",
        "email": "test@test.ru",
        "_id": 61
    },
    "success": true
}
403 ответ
Не получилось зарегистрировать пользователя с указанными данными, в теле ответа будет указана причина:

{
    "message": "Введенный Email уже занят."
}
500 ответ
Сервер сломался

Войти
Адрес: https://webdev-music-003b5b991590.herokuapp.com/user/login/

Метод: POST

Возвращает данные пользователя по почте и паролю. В теле запроса принимает объект пользователя в формате JSON, обязательные поля email и password. Пример запроса:

fetch("https://webdev-music-003b5b991590.herokuapp.com/user/login/", {
  method: "POST",
  body: JSON.stringify({
    email: "test@test.ru",
    password: "test@test.ru",
  }),
  headers: {
    // API требует обязательного указания заголовка content-type, так апи понимает что мы посылаем ему json строчку в теле запроса
    "content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
200 ответ
Пользователь успешно авторизован, в теле ответа будет объект авторизованного пользователя:

{
    "email": "test@test.ru",
    "username": "Testtest",
    "_id": 61
}
400 ответ
Запрос составлен некорректно, например не передан пароль, в теле ответа будет расшифровка проблем, такой же как в 400 ответе при регистрации.

401 ответ
Запрос составлен корректно, но не получилось авторизовать пользователя, в теле ответа будет объект с причиной:

{ "message": "Пользователь с таким email или паролем не найден" }
500 ответ
Сервер сломался

Получить токен
Адрес: https://webdev-music-003b5b991590.herokuapp.com/user/token/

Метод: POST

Эндпоинт создает Access и Refresh JWT токены для пользователя по email и паролю.

Access токен нужен для того чтобы делать авторизованные запросы в апи (например запрос на добавление в "избранные треки"). Access токеном можно пользоваться 200 секунд, потом он "протухает".

Refresh токен не протухает со временем, но может протухнуть если пользователь сменит пароль или нажмет кнопку "выйти на всех устройствах".

Новых Access токен можно получить двумя способами

(рекомендуемый) Сделать запрос на эндпоинт "Обновить токен", для этого потребуется Refresh токен
(нерекомендуемый из-за плохого UX и проблем с безопасностью) Сделать повторный запрос на этот эндпоинт, для этого потребуется логин и пароль пользователя
Пример запроса:

fetch("https://webdev-music-003b5b991590.herokuapp.com/user/token/", {
  method: "POST",
  body: JSON.stringify({
    email: "gleb@fokin.ru",
    password: "gleb@fokin.ru",
  }),
  headers: {
    // API требует обязательного указания заголовка content-type, так апи понимает что мы посылаем ему json строчку в теле запроса
    "content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
200 ответ
Логин и пароль верные, сервер возвращает пару access и refresh токенов:

{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTA0NjUzMSwiaWF0IjoxNjkwOTYwMTMxLCJqdGkiOiI2YTFhODg4Zjg5NjY0NjgyYTBmYWYyNjk4ZjZiNjViZSIsInVzZXJfaWQiOjc5Mn0.idHYiVKZqSxPCpNIvYpFgEs6nRTJ3FuPS60RAKV8XC8",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkwOTYwNDMxLCJpYXQiOjE2OTA5NjAxMzEsImp0aSI6ImE4NDAwZjRkNWUzMTQ4NGJiMzE4YzUzMjE3Y2NhNWZmIiwidXNlcl9pZCI6NzkyfQ.SfvLYWbz72DQqWK7SyF4Yx9Zxx8hGsNxHEcwOU0RTk4"
}
400, 401 и 500 ответы
Такие же как в эндпоинте "Войти"

Обновить токен
Адрес: https://webdev-music-003b5b991590.herokuapp.com/user/token/refresh/

Метод: POST

Принимает refresh токен, возвращает "живой" acces токен.

Пример запроса:

fetch("https://webdev-music-003b5b991590.herokuapp.com/user/token/refresh/", {
  method: "POST",
  body: JSON.stringify({
    refresh:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTA0NjUzMSwiaWF0IjoxNjkwOTYwMTMxLCJqdGkiOiI2YTFhODg4Zjg5NjY0NjgyYTBmYWYyNjk4ZjZiNjViZSIsInVzZXJfaWQiOjc5Mn0.idHYiVKZqSxPCpNIvYpFgEs6nRTJ3FuPS60RAKV8XC8",
  }),
  headers: {
    // API требует обязательного указания заголовка content-type, так апи понимает что мы посылаем ему json строчку в теле запроса
    "content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
200 ответ
Refresh токен валидный, возвращает новый access токен

{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkwOTcwNzcwLCJpYXQiOjE2OTA5NjAxMzEsImp0aSI6IjcxZjMyZjc5ZGRiMjRhNDE4MGQ5OGVjZTgzMWRkMmYyIiwidXNlcl9pZCI6NzkyfQ.E9SdHw1Aui5HkBIWmO_H0Ibv1-MOgqElLy-BCRiYrrU"
}
401 ответ
Refresh токен невалидный, возвращает объект с ошибкой

{
  "detail": "Токен недействителен или просрочен",
  "code": "token_not_valid"
}
400 ответ
В теле запроса не передан refresh токен

500 ответ
Сервер сломался

Треки
Описание запроса	Пример
Получить все треки	GET - /catalog/track/all/
Получить трек по id	GET - /catalog/track/<id>/
Просмотреть избранное *	GET - /catalog/track/favorite/all/
Добавить трек в избранное по id *	POST - /catalog/track/<id>/favorite/
Удалить трек из избранного по id *	DELETE - /catalog/track/<id>/favorite/
Создать подборкy *	POST - /catalog/selection
Просмотреть подборки	GET - /catalog/selection/all
Просмотреть подборку по id	GET - /catalog/selection/<id>/
Запросы отмеченные * требуют авторизацию.

Подробнее про запросы с авторизацией
Некоторые API эндпоинты закрыты авторизацией.

Чтобы сделать авторизованный запрос, нужно передать в заголовке "Authorization" access токен пользователя.

Если не передать токен или передать "протухший" токен, то такие эндпоинты будут отвечать 401 кодом ответа.

Пример запроса с авторизацией:

// Сюда нужно подставить актуальный access токен
const access =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkwOTcxMjcxLCJpYXQiOjE2OTA5NjAxMzEsImp0aSI6ImE4YzQ5NDNmOWNmNTRlZjI5NmFmNTMyOWUwODM4YWQ5IiwidXNlcl9pZCI6NzkyfQ.5n8YHTjsgAnYnc4gioyV1wPnxM2D16PS6c9kNhC-JoE";

fetch("https://webdev-music-003b5b991590.herokuapp.com/catalog/track/favorite/all/", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${access}`,
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));