from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import time
from datetime import datetime
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 12345
DBS_NAME = 'ceres_db'
COLLECTION_NAME = 'devicestream'

def getKey(item):
  return item[0]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ceres_db/devicestream_light")
def ceres_project_light():
  connection = MongoClient()
  collection = connection[DBS_NAME][COLLECTION_NAME]
  projects = collection.find({"name": "dataStream"}).sort("{$natural:1}").limit(2000)
  json_light = []
  for project in projects:
    published_at = datetime.strptime(project["published_at"], '%Y-%m-%dT%H:%M:%S.%fZ')
    json_light.append([time.mktime(published_at.timetuple()) * 1000,int(project["data"].split(";")[0])])
  json_light = json.dumps(sorted(json_light, key=getKey), default=json_util.default)
  connection.close()
  return json_light

@app.route("/ceres_db/devicestream_temp")
def ceres_project_temp():
  connection = MongoClient()
  collection = connection[DBS_NAME][COLLECTION_NAME]
  projects = collection.find({"name": "dataStream"}).sort("{$natural:1}").limit(2000)
  json_temp = []
  for project in projects:
    published_at = datetime.strptime(project["published_at"], '%Y-%m-%dT%H:%M:%S.%fZ')
    json_temp.append([time.mktime(published_at.timetuple()) * 1000,int(project["data"].split(";")[1])])
  json_temp = json.dumps(sorted(json_temp, key=getKey), default=json_util.default)
  connection.close()
  return json_temp

@app.route("/ceres_db/devicestream_mois")
def ceres_project_mois():
  connection = MongoClient()
  collection = connection[DBS_NAME][COLLECTION_NAME]
  projects = collection.find({"name": "dataStream"}).sort("{$natural:1}").limit(2000)
  json_mois = []
  for project in projects:
    published_at = datetime.strptime(project["published_at"], '%Y-%m-%dT%H:%M:%S.%fZ')
    json_mois.append([time.mktime(published_at.timetuple()) * 1000,int(project["data"].split(";")[2])])
  json_mois = json.dumps(sorted(json_mois, key=getKey), default=json_util.default)
  connection.close()
  return json_mois
    
@app.route("/ceres_db/devicestream_watering")
def ceres_project_watering():
	connection = MongoClient()
	collection = connection[DBS_NAME][COLLECTION_NAME]
	projects = collection.find({"name": "pumpManual"}).sort("{$natural:1}").limit(10)
	json_watering = []
	for project in projects:
		json_watering.append(project)
	json_watering = json.dumps(json_watering, default=json_util.default)
	connection.close()
	return json_watering  
	
if __name__ == "__main__":
    app.run(host='vps192645.ovh.net', port=80, debug=True)
