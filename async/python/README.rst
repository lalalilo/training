# Goal of this demo

Explain the difference between processes, threads and asyncio in Python

# Run demos

## Run flask + gunicorn with multi processing

`poetry run gunicorn --workers 4 app.flask:app`

`poetry run python -m app.test 8000`

## Run flask + gunicorn with multi threading

`poetry run gunicorn --threads 6 app.flask:app`

`poetry run python -m app.test 8000`

## Run aiohttp server

`poetry run python -m aiohttp.web -H localhost -P 8080 app.aiohttp:init_func`

`poetry run python -m app.test 8080`

`curl localhost:8080/blocking`

# Update the code

## Run the flask app in dev mode

`poetry run flask run`

`poetry install`
