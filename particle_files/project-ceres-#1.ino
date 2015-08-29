// load clickButton lib for double and long click
#include "clickButton/clickButton.h"

// -----------------------------------------
// Project Ceres #1
// -----------------------------------------

int photoresistor = A0;
int photovalue;
int thermistor = D3;
int thermvalue;
int ledPin = D7;
int ledState = LOW;
int motorState = 0;
int motorPin = D0;


// the Button
const int buttonPin = D2;
ClickButton button1(buttonPin, LOW, CLICKBTN_PULLUP);


long interval = 2000;
long previousMillis = 0;

char data[42];

void setup() {
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(ledPin, OUTPUT);
    pinMode(motorPin, OUTPUT);

    // Setup for the button
    button1.debounceTime   = 20;   // Debounce timer in ms
    button1.multiclickTime = 250;  // Time limit for multi clicks
    button1.longClickTime  = 1000; // time until "held-down clicks" register

    while (button1.clicks == 0) {
        button1.Update();
    }
}

void loop() {

    button1.Update(); // Update button state
    unsigned long currentMillis = millis();

    if (button1.clicks == 1) { // Simple click

        if (ledState == LOW) {
            ledState = HIGH;
            motorState = 800;
        } else {
            ledState = LOW;
            motorState = 0;
        }

        digitalWrite(ledPin, ledState);
        digitalWrite(motorPin, ledState);
    }

    if (button1.clicks == 2) { //double click

        digitalWrite(ledPin, HIGH);
        delay(200);
        digitalWrite(ledPin, LOW);
        delay(200);
        digitalWrite(ledPin, HIGH);
        delay(200);
        digitalWrite(ledPin, LOW);
        delay(200);
        digitalWrite(ledPin, HIGH);
        delay(200);
        digitalWrite(ledPin, LOW);

        ledState = LOW;
    }

    if(currentMillis - previousMillis > interval) { // Publish data every X seconds
        previousMillis = currentMillis;

        photovalue = analogRead(photoresistor);
        thermvalue = analogRead(thermistor);

        sprintf(data, "%d;%d;%d", photovalue, thermvalue, ledState);

        Spark.publish("datastream", data, 300, PRIVATE);
    }

    if (button1.clicks == -1) { // Sleep if long click
        System.reset();
    }
}
