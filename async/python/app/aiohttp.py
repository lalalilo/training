import asyncio
import logging
import time

from aiohttp import web

counter = 0


async def handle(request):
    global counter
    counter += 1
    logging.debug(f"Request {counter}")
    await asyncio.sleep(2)
    return web.Response(text="Hello Lalilo!")


async def load_blocking(request):
    global counter
    counter += 1
    logging.debug(f"Request {counter}")
    time.sleep(10)
    return web.Response(text="Hello Lalilo!")


def init_func(argv):
    app = web.Application()
    app = web.Application()
    app.add_routes([web.get("/", handle), web.get("/blocking", load_blocking)])
    return app
