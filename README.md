# My Wallet

An easy to use financial manager. Track your revenues and expenses to learn how you spend your money and know all the time how much you have.

Try it out now at https://api-my-wallet-lb.herokuapp.com/

## About

This is an API for a web application with which lots of people can manage their own expenses and revenues. Below are the implemented features:

- Sign Up
- Login
- List all financial events for a user
- Add expense
- Add revenue

By using this app any user can learn how they've been using their money and always keep track of your balance.

## Technologies
The following tools and frameworks were used in the construction of the project:<br>
  
  ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)&nbsp;
  ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)&nbsp;
  ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)&nbsp;
  ![PostgresSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)&nbsp;
  ![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)&nbsp;
  
## How to run

1. Clone this repository
```bash
git clone https://github.com/liviambrasil/my-wallet-back-end
```
2. Clone the front-end repository at https://github.com/liviambrasil/my-wallet-front-end
3. Follow instructions to run front-end at https://github.com/liviambrasil/my-back-front-end
4. Create a Database using the ``dump.sql`` file inside the ``database`` folder by following these steps:
    - 4.1 Open your terminal. **Important: the terminal must be opened in the same path as the ``dump.sql`` file is located.**
    - 4.2 Access PostgreSQL using the command ``sudo su postgres`` and enter your password when prompted.
    - 4.3 Next, type ``psql postgres`` and hit enter.
    - 4.4 Create a database by typing ``CREATE DATABASE mywallet;`` and hitting enter.
    - 4.5 Type ``\q`` and hit enter.
    - 4.6 Finally, type ```psql mywallet < dump.sql``` and hit enter. Your database should be ready after this step.
5. Set the environment variables by following these steps:
    - 5.1 Create a ``.env`` file in the folder root
    - 5.2 Copy the content of the ``.env.example`` into it
    - 5.3 Set the ``DATABASE_URL`` in this format: "postgres://user:password@host:port/mywallet"
    - 5.4 Set the ``PORT`` for 4000
6. In your terminal, go back to the root folder and install the dependencies
```bash
npm i
```
7. Also in the root folder, run the back-end with
```bash
npm start
```
8. Your server should be running now.
9. After that, you can optionally test the project following these steps:
    - 9.1 Open your terminal.
    - 9.2 Access PostgreSQL using the command ``sudo su postgres`` and enter your password when prompted.
    - 9.3 Next, type ``psql postgres`` and hit enter.
    - 9.4 Create a test database by typing ``CREATE DATABASE mywallet_test TEMPLATE mywallet;`` and hitting enter. Your database test should be ready after this step.
    - 9.5 Set the enviroment variable following the step 5 again, with the following changes:
      - 9.5.1 The file must be called ``.env.test``
      - 9.5.2 The ``DATABASE_URL`` must be in this format: "postgres://user:password@host:port/mywallet_test"

10. In your terminal, go to the root folder and run the tests with:
```bash
npm run test
```
