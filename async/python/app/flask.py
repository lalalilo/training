import time
from flask import Flask

app = Flask(__name__)
counter = 0


@app.route("/")
def hello_world():
    global counter
    counter += 1
    print(f"test {counter}")
    time.sleep(10)
    return "Hello Lalilo!"
