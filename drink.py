#Libraries
import RPi.GPIO as GPIO
import time, sys
 
GPIO.setmode(GPIO.BCM)

FLOW_SENSOR = 25

GPIO.setmode(GPIO.BCM)
GPIO.setup(FLOW_SENSOR, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(22, GPIO.OUT)
 
#set GPIO Pins
GPIO_TRIGGER = 18
GPIO_ECHO = 24
 
#set GPIO direction (IN / OUT)
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)
 
def distance():
    # set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)
 
    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
 
    StartTime = time.time()
    StopTime = time.time()
 
    # save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()
 
    # save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()
 
    # time difference between start and arrival
    TimeElapsed = StopTime - StartTime
    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    distance = (TimeElapsed * 34300) / 2
 
    return distance

def run_dispenser():
    cap = 0
    while cap < 20:
        print (f" not Event detected 22: {GPIO.event_detected(22)}")
        if GPIO.event_detected(22) == GPIO.HIGH:
            cap = cap +1
            print ("Obroty " % cap)

 
if __name__ == '__main__':
    count = 0
    GPIO.output(22, GPIO.LOW)
    try:
        while True:
            dist = distance()
            if dist < 5 and dist > 1:
                print("Silnik wlaczony")
                GPIO.output(22, GPIO.HIGH)
                time.sleep(5)
                GPIO.output(22, GPIO.LOW)
                print("Silnik wylaczony")
                break
    GPIO.cleanup()
    except KeyboardInterrupt:
        GPIO.cleanup()