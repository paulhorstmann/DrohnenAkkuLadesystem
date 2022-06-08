# divera 24/7 ⇆ Shelly - Akku Lade Automatisierung

## Installtion & Setup

### 1. Raspberry Pi einrichten

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
Kopier in die Datei folgeden Inhalt:
```HCL
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="NETZWERK-NAME"
    psk="NETZWERK-PASSWORD"
}
```
Editiere die Platzhalter NETZWERK-NAME & NETZWERK-PASSWORD zu den dem entsprechenden Werten um

🠚 Starte den Raspberry Pi

---
#### Mit SSH verbinden

Es gibt viele Möglichkeiten sich mit ssh auf den Raspberry Pi zu verbinden.
Im Folgenden verwende ich den Standart Windows 11 SSH-Client über CMD

Eine gute Alternative ist aber [Putty](https://www.putty.org/)

``` Console
C:\Users\Benutzer\Desktop> ssh pi@raspberrypi
```

Hilfe dazu findest du hier: [digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server-de](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server-de)

Gib als Standartpasswort: "raspberry" ein um dich einzuloggen

---
### 2. Standart Passwort ändern
Ändere das Standart Passwort um unautorisierte Logins zu verhindern
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

### 5. Node JS instaltion über Node Version Manager 
Um NVM zu installieren, folge dieser Installationsanleitung:
https://github.com/nvm-sh/nvm#install--update-script

Über prüfe die Installation von NVM mit folgendem Befehl
```Console
pi@raspberrypi:~ $ nvm -v
0.39.1 
```

Über nvm kann jetzt die letzte LTS Version von Node JS installiert werden.

```Console
pi@raspberrypi:~ $ nvm install node --lts
```

Nach der Installation sollte nocheimal überprüft werden ob Node auf dem System richtig funktioniert und [NPM](https://www.npmjs.com/) upgedatet werden
```Console
pi@raspberrypi:~ $ node -v
v16.14.0
pi@raspberrypi:~ $ npm i npm - g
...
pi@raspberrypi:~ $ npm -v
8.5.1
```
