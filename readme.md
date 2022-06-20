# AkkuLadeAutomatisierung - divera 24/7 🚨 ⇆ Shelly⚡

## Installtion & Setup

### 1. Raspberry Pi einrichten

> [ ℹ️ ] 
> >
> In der folgenden Anleitung ist alles was in Spitzenklammer gekennzeichnet ist variabel und sollte mit den Werten ausgetaucht werden die zu der Beschreibung in den Klammer passen
---

#### Raspberry Pi Lite installieren

Um den Raspberry Pi Lite zu installieren, installiere zunächst Raspberry Pi Imager.

Raspberry Pi Imager Downloadlink: [raspberrypi.com/software](raspberrypi.com/software)

Wähle im Raspberry Pi Imager unter dem Menupunkt, "Raspbery PI OS (other)", Raspberry PI OS (64 bit) aus und folge den weitern Anweisungen

Hilfe dazu findest du hier:
[raspberrypi.com/documentation/computers/getting-started.html](https://www.raspberrypi.com/documentation/computers/getting-started.html)

---
#### Aktiviere SSH auf deinem Raspberry Pi.

Erstelle eine leere Datei in dem Stammorder der SD Karte mit dem Namen `SSH`

Hilfe dazu findest du hier:
[raspberrypi.com/documentation/computers/remote-access.html#set-up-your-local-network](https://www.raspberrypi.com/documentation/computers/remote-access.html#set-up-your-local-network)

Beachte die Notiz zu Headless OS 

---
#### WLAN einrichten

Erstelle eine Datei in dem Stammorder der SD Karte mit dem Namen `wpa_supplicant.conf`.
Kopiere in die Datei folgeden Inhalt:
```HCL
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="<NETZWERK-NAME>"
    psk="<NETZWERK-PASSWORD>"
}
```
Editiere die Platzhalter NETZWERK-NAME & NETZWERK-PASSWORD zu den dem entsprechenden Werten um

🠚 Starte den Raspberry Pi

---
#### Mit SSH verbinden

Es gibt viele Möglichkeiten sich mit ssh auf den Raspberry Pi zu verbinden.
Im Folgenden verwende ich den Standard Windows 11 SSH-Client über CMD

Eine gute Alternative ist aber [Putty](https://www.putty.org/)

``` Console
C:\Users\Benutzer\Desktop> ssh pi@raspberrypi
```

Hilfe dazu findest du hier: [digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server-de](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server-de)

Gib als Standardpasswort: `raspberry` ein um dich einzuloggen

---
### 2. Standard Passwort ändern
Ändere das Standard Passwort um unautorisierte Logins zu verhindern
```Console
pi@raspberrypi:~ $ sudo passwd pi
New password:<Neues Passwort>
Retype new password:<Neues Passwort>
```


### 3. Zeitzone aktualisieren 
Lasse dir die verschieden Zeitzonen ausgeben und lege mit `sudo timedatectl set-timezone <Zeitzone>` die Zeitzone fest

```Console
pi@raspberrypi:~ $ timedatectl list-timezones | grep Europe
Europe/Amsterdam
Europe/Andorra
Europe/Astrakhan
Europe/Athens
Europe/Belgrade
Europe/Berlin
...

pi@raspberrypi:~ $ sudo timedatectl set-timezone Europe/Berlin
```

Mit NTP Synchronisieren
```Console
pi@raspberrypi:~ $ sudo timedatectl set-ntp true
```

### 4. GIT installieren
Installiere Git und überprüfe die funktionsweise
```Console
pi@raspberrypi:~ $ sudo apt-get update
...
pi@raspberrypi:~ $ sudo apt-get install git
...
pi@raspberrypi:~ $ git --version
git version 2.30.2
```

### 5. Node JS installation über Node Version Manager 
Um NVM zu installieren, folge dieser Installationsanleitung:
https://github.com/nvm-sh/nvm#install--update-script

Überprüfe die Installation von NVM mit folgendem Befehl
```Console
pi@raspberrypi:~ $ nvm -v
0.39.1 
```

Über nvm kann jetzt die letzte LTS Version von Node JS installiert werden.

```Console
pi@raspberrypi:~ $ nvm install node --lts
```
Wenn du hierzu Hilfe brauchst, sieh dir dieses Video bis 1:40 an: https://youtu.be/DZPUO2DcE0g

Nach der Installation sollte nocheimal überprüft werden ob Node auf dem System richtig funktioniert und [NPM](https://www.npmjs.com/) upgedatet werden
```Console
pi@raspberrypi:~ $ node -v
v16.14.0
pi@raspberrypi:~ $ npm i npm - g
...
pi@raspberrypi:~ $ npm -v
8.5.1
```

### 6. Richte den Shelly ein
1. Stecke den Shelly Plug in die Steckdose oder verbinde sie anderwaltig mit dem Stromnetz
2. Verbinde dich mit dem Wlan, das darauffolgend aufgebaut wird
3. Öffne das Shelly Webinterface über http://192.168.33.1 oder über den Hostname: http://<wlan_name_shelly>
4. Erstelle für den Shelly ein Benutzername und ein Passwort für das Webinterface
5. Verbinde den Shelly mit deinem WLAN unter dem Menupunkt Internet als Wlan-Client
6. Verbinde dich nun mit deinem WLAN und rufe entweder http://<wlan_name_shelly> auf oder verbindedich über die neue IP des Shellys

Ein nützliches Tool um die IP ohne Rooterzugriff herraus zu finden ist AngryIPScann

### 7. Broker installieren und konfigurieren
Wenn du noch kein Git auf deinem RaspberryPi istalliert hast:

```Console
pi@raspberrypi:~ $ sudo apt update
pi@raspberrypi:~ $ sudo apt install git
```

Clone dieses Github Repository:

```Console
pi@raspberrypi:~ $ git clone https://github.com/paulhorstmann/DrohnenAkkuLadesystem.git
...
pi@raspberrypi:~ $ cd DrohnenAkkuLadesystem
pi@raspberrypi:~/DrohnenAkkuLadesystem $ npm install
```

Kopiere `./config/_config.json` zu `./config/config.json`  und öffne die Datei Nano

```Console
pi@raspberrypi:~/DrohnenAkkuLadesystem $ cp ./config/_config.json ./config/config.json 
pi@raspberrypi:~/DrohnenAkkuLadesystem $ nano ./config/config.json 
```

```JSON
{
    "Shellys": {
        "<shelly_name>": {
            "ip": "<shelly_ip>",
            "hostname": "<shelly_hostname>",
            "username": "<shelly_username>",
            "password": "<shelly password>"
        }
    },
    "DiveraJobs": {
        "<job_name>": {
            "groups": [],
            "shelly": "<shelly_name>",
            "job": {
                "timer": "<zeit_in_ms_nummer>"
            }
        }
    },
    "diveraCallFrequence": "*/30 * * * * *"
}
```



### 8. Richte deinen Raspberry Pi als Access Point ein
Da Probleme beim Verbinden des Shellies mit ungesicherten Wlan-Netzen auftreten könnten. Rate ich dazu den Raspberry Pi als Accesspoint zu konfigurieren.

Hier zu it folgende Aleitung Hilfreich:

Verbinde anschießen den Shelly mit dem vom Raspberry Pi aufgebauten Wlan.

### 7. Deploying mit PM2
Installiere PM2
```Console
pi@raspberrypi:~/DrohnenAkkuLadesystem $ npm install pm2 -g 
```

Setze den Startpunkt und den Name fest
```Console
pi@raspberrypi:~/DrohnenAkkuLadesystem $ pm2 start app.js --name DroLaSy
pi@raspberrypi:~/DrohnenAkkuLadesystem $ pm2 status DroLaSy
pi@raspberrypi:~/DrohnenAkkuLadesystem $ pm2 logs
```

Setze PM2 in den Startup Prozess
```Console
pi@raspberrypi:~/DrohnenAkkuLadesystem $ sudo pm2 startup
pi@raspberrypi:~/DrohnenAkkuLadesystem $ sudo pm2 save
```