
############# IN PROGRESS ###############

# -*- coding: utf-8 -*-
from collections import Counter
import json
import os
import subprocess
from pymongo import MongoClient
import time
from datetime import datetime
from bson import json_util
from bson.json_util import dumps

MONGODB_HOST = 'localhost'
MONGODB_PORT = 12345
DBS_NAME = 'ceres_db'
COLLECTION_NAME = 'devicestream'

def getKey(item):
  return item[0]

#@app.route("/ceres_db/devicestream_light")
def ceres_project_light():
  connection = MongoClient()
  collection = connection[DBS_NAME][COLLECTION_NAME]
  projects = collection.find({"name": "dataStream"}).sort("{$natural:-1}").limit(5000)
  json_light = []
  for project in projects:
    published_at = datetime.strptime(project["published_at"], '%Y-%m-%dT%H:%M:%S.%fZ')
    json_light.append([time.mktime(published_at.timetuple()) * 1000,int(project["data"].split(";")[0])])
  json_light = json.dumps(sorted(json_light, key=getKey), default=json_util.default)
  connection.close()
  return json_light



		
class PipeAnomaly(object):

	def __init__(self, name):
		""" Initiate pipe name.
		
		Error if pipe doesn't exist
		
		"""
		print name
		print Pipe.objects.distinct(name)
		self.pipe = Pipe.objects.get(name=name)
		self.name = self.pipe.name
		
	
	def _get_jobs_by_pipe(self):
		pipe_jobs = PipeJob.objects.filter(pipe=self.pipe, scraper__is_active=True)
		jobs_per_date = [
			pipe_job.created_at.strftime('%Y-%m-%d')
			for pipe_job in pipe_jobs
		]
		return dict(Counter(jobs_per_date))
	
	def generate_json(self):
		data = self._get_jobs_by_pipe()
		
		if not data:
			print "Empty json"
		
		with open("data_anomaly.json", "wb") as outfile:
			json.dump(data, outfile)

	def pipe_anomaly_detection(self):
		self.generate_json()
		print "json generated"
		current_path = os.path.dirname(os.path.abspath(__file__))
		process = subprocess.call("Rscript --vanilla %s/anomaly_detection_with_json_2.r" % current_path, shell=True)
		print process
		with open('res_anomaly.json') as res_anomaly:
			res = json.load(res_anomaly)
		os.remove('res_anomaly.json')
		print res
		return res
