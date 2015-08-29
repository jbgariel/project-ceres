// -----------------------------------------
// Project Ceres #1
// -----------------------------------------

int photoresistor = A0;
int photovalue;
int thermistor = D3;
int thermvalue;
int button = D2;
int ledPin = D7;
int ledState = LOW;
int motorState = 0;
int motorPin = D0;

long interval = 2000;
long previousMillis = 0;

char data[42];

void setup() {
    pinMode(button, INPUT_PULLUP);
    pinMode(ledPin, OUTPUT);
    pinMode(motorPin, OUTPUT);
}

void loop() {

    if (digitalRead(button) == LOW) {

        if (ledState == LOW) {
            ledState = HIGH;
            motorState = 800;
        } else {
            ledState = LOW;
            motorState = 0;
        }

        digitalWrite(ledPin, ledState);
        digitalWrite(motorPin, ledState);
        delay(200); // Sample time is too short so the led goes on and off if we dont add the delay, 200ms seems to work fine
    }

    unsigned long currentMillis = millis();

    if(currentMillis - previousMillis > interval) { // Publish data every X seconds
        previousMillis = currentMillis;

        photovalue = analogRead(photoresistor);
        thermvalue = analogRead(thermistor);

        sprintf(data, "%d;%d;%d", photovalue, thermvalue, ledState);

        Spark.publish("datastream", data, 300, PRIVATE);
    }

}
