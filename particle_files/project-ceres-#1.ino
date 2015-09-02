#include "neopixel/neopixel.h"
#include "clickButton/clickButton.h"

SYSTEM_MODE(AUTOMATIC);

// -----------------------------------------
// Project Ceres #2
// -----------------------------------------

// Sensors
int photoresistor = A0;
int photovalue;
int thermistor = D3;
int thermvalue;
int motorState = LOW;
int motorPin = D1;

// Neopixel ring 
#define PIXEL_PIN D4
#define PIXEL_COUNT 16
#define PIXEL_TYPE WS2812B

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

// the Button
const int buttonPin = D2;
ClickButton button1(buttonPin, LOW, CLICKBTN_PULLUP);

long interval = 2000;  
long previousMillis = 0;  

// Data stream
char data[42];

void setup() {
    
    // Setup for button & motor
    pinMode(buttonPin, INPUT_PULLUP); 
    pinMode(motorPin, OUTPUT);
    
    // Setup for the ring
    strip.begin();
    strip.show();
    
    // Setup for the button
    button1.debounceTime   = 20;   // Debounce timer in ms
    button1.multiclickTime = 250;  // Time limit for multi clicks
    button1.longClickTime  = 1000; // time until "held-down clicks" register
    
    // Wait for input to start Ceres
    while (button1.clicks == 0) {
        button1.Update();
    }
    
    // Ring rainbow to start Ceres
    rainbowCycle(10);
    colorWipe(strip.Color(0, 0, 0), 1);

}

void loop() {
    
    button1.Update(); // Update button state
    unsigned long currentMillis = millis();
    
    if (button1.clicks == 1) { // Simple click
        
        if (motorState == LOW) {
            colorWipe(strip.Color(255, 0, 0), 50);
            colorWipe(strip.Color(0, 0, 0), 50);
            colorWipe(strip.Color(255, 0, 0), 50);
            motorState = HIGH;
        } else {
            motorState = LOW;
            colorWipe(strip.Color(0, 0, 0), 1);
        }
            
        digitalWrite(motorPin, motorState);
    }
    
    if (button1.clicks == 2) { //double click
        rainbow(20);
        colorWipe(strip.Color(0, 0, 0), 1);
    }
    
    if(currentMillis - previousMillis > interval) { // Publish data every X seconds
        previousMillis = currentMillis;   

        photovalue = analogRead(photoresistor);
        thermvalue = analogRead(thermistor);

        sprintf(data, "%d;%d;%d", photovalue, thermvalue, motorState);

        Spark.publish("datastream", data, 300, PRIVATE);
    }
    
    if (button1.clicks == -1) { // Sleep if long click
        rainbowflash(80, 7);
        System.reset();
    }
}


// Ring functions
void rainbow(uint8_t wait) {
  uint16_t i, j;
  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbowCycle(uint8_t wait) {
  uint16_t i, j;
  for(j=0; j<256; j++) { // 1 cycle of all colors on wheel
    for(i=0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbowflash(uint8_t wait, uint8_t nflash) {
  uint16_t k;    
    for(k=0; k< nflash; k++) {
        rainbowflash1(wait);
        colorWipe(strip.Color(0, 0, 0), 1);
        delay(wait);
    }    
}

void rainbowflash1(uint8_t wait) {
  uint16_t i;
    for(i=0; i< strip.numPixels(); i++) {
        strip.setPixelColor(i, Wheel(i * 256 / strip.numPixels()));
    }
    strip.show();
    delay(wait);
}

void colorAll(uint32_t c, uint8_t wait) {
  uint16_t i;
  for(i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
  }
  strip.show();
  delay(wait);
}

void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}
