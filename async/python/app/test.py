import sys
import asyncio
from app import __version__
from aiohttp import ClientSession


async def fetch(url, session):
    async with session.get(url) as response:
        return await response.read()


async def run():
    requests = []
    url = f"http://localhost:{sys.argv[1]}"

    async with ClientSession() as session:
        for i in range(10):
            request = asyncio.ensure_future(fetch(url, session))
            requests.append(request)

        responses = await asyncio.gather(*requests)
        print(responses)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(run())
    loop.run_until_complete(future)
