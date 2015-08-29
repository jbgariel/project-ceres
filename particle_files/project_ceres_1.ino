// -----------------------------------------
// Project Ceres #1
// -----------------------------------------

int photoresistor = A0;
int photovalue;
int thermistor = D3;
int thermvalue;

char light[42];
char temp[42];

void setup() {

}

void loop() {

  photovalue = analogRead(photoresistor);
  thermvalue = analogRead(thermistor);

  sprintf(data, "%d;%d", photovalue, thermvalue);

  Spark.publish("datastream", data, 300, PRIVATE);
  delay(5000);
}
