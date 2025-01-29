
#include <SoftwareSerial.h>

SoftwareSerial myConnection(10, 11);
void setup() {
  // put your setup code here, to run once:
  myConnection.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
  myConnection.println("Test Transmissiom String. ");
  delay(600);
}
