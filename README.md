# Начало

## Краткое описание приложения

На базе пакета nodejs express создан веб-сервер с REST API для работы с бд
Используются пакеты nodejs express, sequelize ORM, jsonwebtoken для авторизации

## Подготовка

Это бекенд часть кода для работы с демо версией интернет-магазина, для установки фронт части нужно скачать
репозиторий для фронтовой части урл:

1. Для работы требуется установить пакетный менеджер npm:

 https://nodejs.org/ru/download/

2. Рекомендуется установить менеджер Node Version Manager:

 https://github.com/coreybutler/nvm-windows/releases 

скачать файл nvm-setup.exe и установить требуемую версию командой:

nvm install 14.15.0

Работа была проверена на версии node v14.15.0

3. Для работы с базой данных и программой phpmyadmin используется Docker

Установить Docker для Windows:

https://docs.docker.com/desktop/install/windows-install/

## Запуск приложения

1. Склонируйте репозиторий и выполните установку зависимостей:

```
> npm install
```

2. Логины и пароли для входа на phpmyadmin находятся в файле:

docker-mysql.yaml

Запустить докер и в корневой части проекта выполнить команду:

```
> docker-compose -f docker-mysql.yaml up -d
```

3. Запустите приложение:

```
> npm start
```

4. Логин и пароль для входа на админку приложения для редактирования заказов

Логин: peter
Пароль: peter


