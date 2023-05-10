# Menu API

---

Node.js API used to manage menu.

<!-- table of contents -->
- [Menu API](#menu-api)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Getting up and running](#getting-up-and-running)
      - [Clone and install](#clone-and-install)
      - [Environment variables](#environment-variables)
      - [Build](#build)
      - [Run](#run)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Contributing](#contributing)
    - [Built with](#built-with)
    - [Code style](#code-style)
    - [License](#license)

## Getting started

### Prerequisites

Things you need for menu API to work:

- [Node.js (18.x, 19.x) and npm](https://nodejs.org/)
- [Postgres database](https://www.postgresql.org/)
- Sqlite database (_only for testing_)

### Getting up and running

#### Clone and install

This application is written in Node.js and is known to work in 18.x and 19.x versions. Other versions and distributions might probably run but are not guaranteed to work.

Firstly, clone the repo:

```sh
git clone git@github.com:eatn-dev/eatn_menu_api.git
```

After that, `cd` into the directory and install the dependencies:

```sh
npm install
```

#### Environment variables

This application uses a Postgres database as it's main source of persistence. It connects to the database using `DB_URI` environment variable. Because this application in ran in the context of Docker container, this is set up in docker-compose.yml file in the parent repository.

```yml
# snippet of parent docker-compose.yml
menu:
    container_name: menu_api
    build: ./menu
    ports:
        - "5000:5000"
    volumes:
        - ./menu:/usr/src/app
        - /usr/src/app/node_modules
    depends_on:
        - menu_db
    restart: always
    environment:
        DB_URI: "postgresql://root:eatn@menu_db:5432/menu"

menu_db:
    container_name: menu_db
    image: postgres
    volumes:
        - ./db_volumes/menu/:/var/lib/postgresql/data
    restart: always
    environment:
        POSTGRES_USER: root
        POSTGRES_PASSWORD: eatn
        POSTGRES_DB: menu
```

If you want to run this API on your system, you need to setup `DB_URI` variable yourself.

```sh
export DB_URI="postgresql://root:your_secret_password@localhost:5432/your_database"
```

#### Build

If you are running this inside a Docker container, next step would be to build the image.

```sh
docker compose build --no-cache
```

#### Run

For development, run the following command:

```sh
npm run start
```

This will start the development server with automatic reloading using [nodemon](https://www.npmjs.com/package/nodemon).

&nbsp;

If running in production, run the following command:

```sh
npm run prodStart
```

This will run the server in production mode without the hot reloading enabled.

## Usage

This API does not have swagger enabled, but we provided an [Insomnia](https://insomnia.rest/) collection of all sample requests [here](./.github/readme/Insomnia-All_2023-05-10.json).

## Testing

Unit tests are a big part of software development so we made sure there are unit tests in place. To run them, `DB_URI` environment variable must be set first. See [here](#environment-variables).

We encourage running tests using in-memory Sqlite database. That way mock data is erased the moment tests are done, filesystem stays clean and test performace is not taking a toll.

To setup in-memory Sqlite database, run the following command:

```sh
export DB_URI="sqlite::memory:"
```

After that, run the following command in the same terminal:

```sh
npm run test
```

## Contributing

If you find a bug or want to request a feature, don't hesistate to go to [issue](https://github.com/eatn-dev/eatn_menu_api/issues) page and open a ticket!

### Built with

- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express](https://expressjs.com/) - micro web-framework
- [Sequelize](https://sequelize.org/docs/v6/getting-started/) - SQL ORM

### Code style

We use [eslint](https://eslint.org/) to enforce a coding style, so please follow it.

### License

This project is licensed under GNU AGPL v3. See the [LICESNSE](./LICENSE) for details.
