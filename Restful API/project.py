# -*- coding: utf-8 -*-
"""
Created on Fri Jun 19 10:13:54 2020

@author: Admin
"""

def f(x,y):
    return (0.580550*float(x)-0.079497*float(y)+18.978586964168283)

from scipy import stats
import matplotlib.pyplot as plt
from pandas.io.json import json_normalize
import pandas as pd
from firebase import firebase
import json 
from flask import Flask, jsonify, request
from datetime import datetime
from dateutil import tz

firebase=firebase.FirebaseApplication('https://flask-weather-ef89d.firebaseio.com/')
from_zone = tz.gettz('UTC')
to_zone = tz.gettz('Asia/Ho_Chi_Minh')

app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    resultJsonTemperature=firebase.get('/DHT11/Temperature', None)
    resultJsonTime=firebase.get('/DHT11/Time', None)
    temperature=[]
    for key, value in resultJsonTemperature.items():
        temperature.append(float(value))
    times=[]
    for key, value in resultJsonTime.items():
        times.append(float(value))
    position = int(len(temperature) - 1)
    temp = temperature[position]
    position = int(len(times) - 1)
    time = times[position]
    timestamp = int(time)
    utc = datetime.utcfromtimestamp(timestamp)
    utc = utc.replace(tzinfo=from_zone)
    vietnam = utc.astimezone(to_zone)
    val = vietnam.strftime("%H:%M:%S")
    return jsonify({'timeupdate': val, 'current': temp})

@app.route('/iot', methods=['GET'])
def getNextFromCurrent():
    #code here
    resultJsonTemperature=firebase.get('/DHT11/Temperature',None)
    resultJsonHumidity=firebase.get('/DHT11/Humidity',None)
    temperature=[]
    for key, value in resultJsonTemperature.items():
        temperature.append(float(value))
    humidity=[]
    for key, value in resultJsonHumidity.items():
        humidity.append(value)
    position = int(len(temperature) - 1)
    current_temp = temperature[position]
    position = int(len(humidity) - 1)
    humi = humidity[position]
    next_temp = f(current_temp, humi)
    #
    return jsonify({'current': current_temp, 'next': next_temp})

@app.route('/iot/predict', methods=['GET'])
def getNext():
    temp = float(request.args.get('temp', None))
    humid  = float(request.args.get('humid', None))
    next_temp = f(temp, humid)
    return jsonify({'next': next_temp})

if __name__ == '__main__':
    app.run()

