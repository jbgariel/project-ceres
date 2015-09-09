from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 12345
DBS_NAME = 'ceres_db'
COLLECTION_NAME = 'devicestream'

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ceres_db/devicestream")
def ceres_project():
	connection = MongoClient()
	collection = connection[DBS_NAME][COLLECTION_NAME]
	projects = collection.find({"name": "dataStream"}).sort("{$natural:-1}").limit(50)
	json_projects = []
	for project in projects:
		json_projects.append(project)
	json_projects = json.dumps(json_projects, default=json_util.default)
	connection.close()
	return json_projects

@app.route("/ceres_db/devicestream_watering")
def ceres_project_watering():
	connection = MongoClient()
	collection = connection[DBS_NAME][COLLECTION_NAME]
	projects = collection.find({"name": "pumpManual"}).sort("{$natural:-1}").limit(10)
	json_projects_watering = []
	for project in projects:
		json_projects_watering.append(project)
	json_projects_watering = json.dumps(json_projects_watering, default=json_util.default)
	connection.close()
	return json_projects_watering  
	
if __name__ == "__main__":
    app.run(host='vps192645.ovh.net', port=80, debug=True)
