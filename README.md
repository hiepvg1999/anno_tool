# annotate_tool_for_KIE

Prerequisites

Before you continue, ensure you meet the following requirements:

* You have installed Python.
* You are installed NodeJS.

Install:

Server Flask:

* create environment: python3 -m venv /path/to/new/virtual/environment
* source env/bin/activate
* pip install -r requirements.txt
* download weight file (https://drive.google.com/uc?id=13327Y1tz1ohsm5YZMyXVMPIOjoOA0OaA)
* create folder model and put weight file into this folder

Server NodeJS:

* npm install -g serve

Run:

Server Flask:

* Linux: export FLASK_APP=app
* Windows: set FLASK_APP=app
Then run: flask run

Server NodeJS:

* serve -l 8000

How to use:

* create a box
* choose box's type 
* automaticly generate Vietnamese contents by press alt+P
