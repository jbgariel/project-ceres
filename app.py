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
	projects = collection.find({"name": "datastream"}).sort("{$natural:-1}").limit(1000)
    #projects = collection.find(projection=FIELDS, limit=1000)
    #projects = collection.find(projection=FIELDS)
	json_projects = []
	for project in projects:
		json_projects.append(project)
	json_projects = json.dumps(json_projects, default=json_util.default)
	connection.close()
	return json_projects
	
if __name__ == "__main__":
    app.run(host='vps192645.ovh.net',port=5000,debug=True)