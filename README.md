# ZeroFrame
A web based application to upload files to your Raspberry Pi Zero used as an USB mass storage.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First thing is to add board support to your board manager. Inside the Arduino IDE, click on "Preferences". Under "Additional Boards Manager URLs, add : 

```
http://arduino.esp8266.com/stable/package_esp8266com_index.json
```

Next, by going to "Boards Manager" you should be able to add "esp8266" by ESP8266 Community.

After that, you want to install three libraries : 
```
ArduinoJson by Benoit Blanchon
MD_MAX72XX by majicDesigns
MD_Parola by majicDesigns
```


### Installing

There's only one thing that you need to do in order for the libraries to work.
Inside ```Arduino > libraries > MD_MAX72XX > src > MD_MAX72xx.h```, you need to choose the right hardware your display is using.

Put a 1 to the corresponding line.

Example :
For FC-16 based display :
```
#define	USE_FC16_HW	1
```


## Authors

* **Victor MEUNIER** - *CryptoDisplay* - [MrEliptik](https://github.com/MrEliptik)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

