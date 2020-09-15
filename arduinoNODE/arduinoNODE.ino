/**
 * 프젝트 : 아두이노와 node js 연동
 * 파일 : iot_01
 * Edit by Callor
 * Date : 2016. 11. 12
 */
 
 
//#define LED_01 11
//#define LED_02 12
//#define LED_03 13
//#define LED_NUM 3

#include <LiquidCrystal.h>
LiquidCrystal lcd(4, 6, 10, 11, 12, 13);

//unsigned int ledArray[] = { LED_01,LED_02, LED_03 } ;
 
 
void setup() {
  Serial.begin(9600);
  lcd.begin(16, 2);
    
  for(int i = 0 ; i < LED_NUM ; i++) {
    pinMode(ledArray[i], OUTPUT) ;
  }

  pinMode(LED_BUILTIN, OUTPUT);
}
 
void loop() {
  lcd.setCursor(0,1);
  if(Serial.available()) {
    char c = Serial.read();
    Serial.write(c);
    if(c == 'O') {
      for(int i = 0 ; i < LED_NUM ; i++) {
        digitalWrite(ledArray[i], HIGH) ;
      }
      lcd.print("A");
      return;
    }else if(c == 'X') {
      for(int i = 0 ; i < LED_NUM ; i++) {
        digitalWrite(ledArray[i], LOW) ;
    }
        return;
    }
    int ledNum = c - '1';
    digitalWrite(ledArray[ledNum],!digitalRead(ledArray[ledNum])) ;
  }
}
