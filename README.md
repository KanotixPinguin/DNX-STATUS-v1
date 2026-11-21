# DNX STATUS v1

Browserbasierte Statusanzeige für eine vorhandene OpenWebRX+-Installation.

## Hinweis

Rein privates, unabhängiges Hobbyprojekt. Kein Projekt, Produkt oder offizielles
Plugin von OpenWebRX oder OpenWebRX+. Keine Verbindung, Beauftragung,
Unterstützung, Prüfung oder Empfehlung durch deren Entwickler oder
Rechteinhaber. Nutzung, Änderung und Weitergabe vollständig auf eigene Gefahr.
Soweit gesetzlich zulässig keine Haftung. Vorher Backups erstellen und zuerst
auf einem Testsystem prüfen.

## Installation

```bash
chmod +x install.sh
sudo ./install.sh
```

## Entfernen

```bash
sudo ./uninstall.sh
```

Der Installer sichert `receiver/init.js` vor jeder Änderung.

## DNX Status AN/AUS

Version 1.1.0 ergänzt den Schalter `DNX Status: On/Off`. Er wird neben `Gelb Hover` und `Gruen Tuning` angezeigt. Falls das Linien-Tool nicht installiert ist, erzeugt das Statuspaket selbst eine passende Schalterzeile im Receiver. Der sichtbare Zustand wird im Browser gespeichert.

## Farbige Aktivzustände

Status blau, 3D Tool violett, noVNC/Foto dunkelblau und Remote VIEW türkis. Verborgene/inaktive Tools werden grau angezeigt. Der Zustand wird regelmäßig anhand des tatsächlich sichtbaren Fensters geprüft.
