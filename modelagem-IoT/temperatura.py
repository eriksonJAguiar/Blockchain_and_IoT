# -*- coding: utf-8 -*-
#! /usr/bin/python

import RPi.GPIO as gpio
import time
import Adafruit_DHT
import requests
from random import randint


def read_containers():
        resp = requests.get('http://10.62.9.23:3000/api/Container')
        j_resp = resp.json()
        
        #for i in range(len(j_resp)):
        #       print(j_resp[i]['containerId'])
        
        val = randint(0,(len(j_resp)-1))
        return j_resp[val]['containerId']

PIN=14

gpio.setwarnings(False)

gpio.setmode(gpio.BCM)

gpio.setup(PIN,gpio.IN)

print('Iniciando a leitura...')

#print(read_containers())

while True:

        payload = {}
        
        umd, temp = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22,PIN)
        
        payload = {
                   "$class": "org.iot.semcomp.icmc.LerStatusContainer",
                   "temperatura": temp,
                   "geoCode": "string",
                   "container": "org.iot.semcomp.icmc.Container#"+str(read_containers()),
                  }     
        
        print(payload)

        requests.post('http://10.62.9.23:3000/api/LerStatusContainer',data=payload)

        time.sleep(20)
