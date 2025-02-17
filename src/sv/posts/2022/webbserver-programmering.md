---
title: Webbserver-programmering
emphasis: 1
date: 2022-05-16
update: 2025-02-17
tags: ['webbserver', 'node', 'wsl', 'sql']
templateEngineOverride: njk, md
category: resurser
summary: Istället för att dela upp det jag skriver på flera olika webbplatser (kursböcker) har jag bestämt mig för att samla det här. Det här är alltså en introduktionspost till det du behöver för att kunna arbeta med kursen webbserverprogrammering (i min regi).
---

För kursen Webbserverprogrammering 1 på gymnasienivå har jag valt tekniken, eller stacken, Node, Mysql och WSL. Jag anser att den är relevant och bra plattform att utgå ifrån. Den här stacken har även fördelen att använda javascript backend, för då använder vi samma programmeringsspråk som för frontend. Hosting, som sista pusselbit, gör vi med molntjänster.

Det här är en introduktion till de olika delarna du behöver förbereda för att kunna arbeta med kursen. Här hittar du installationsinstruktioner, länkar och exempel.

## Windows Subsystem for Linux

WSL låter oss köra Linux under Windows. Det är i min mening helt fantastiskt och med det slipper vi dual-boot och massa annan ondska. Det är enkelt och smidigt (värdeord, relativt i sammanhanget, för alternativen är mer komplexa) och ger dig tillgång till bash i en terminal under Windows. Det här är nästa steg om du tidigare kört [Git-Bash](https://git-scm.com/downloads), du kommer känna igen dig men nu har du en faktiskt Linux installation under windows. Med WSL2 går det även att köra grafiska program om du så önskar.

Att kunna åtminstone lite bash och kunna arbeta i terminalen är viktigt för att arbeta med kod anser jag. Det ger en ökad förståelse för datorns struktur, kommandon och funktion. Med WSL kan du välja vilken [Linux dist](https://en.wikipedia.org/wiki/Linux_distribution) du vill köra, men till att börja med rekommenderar jag Ubuntu (finns i Microsoft store). Leta efter Long term support (LTS) versionen. 

**Innan du kör igång så se till att du har kört windows update, startat om och repeterat detta ett antal gånger.**

* [Installera WSL](https://docs.microsoft.com/en-us/windows/wsl/install)

När du installerar WSL/Ubuntu så var noga när du skapar en användare, glöm inte bort att sätta ett lösenord (som du kommer ihåg). 

Du kan nu med fördel även passa på att installera Windows terminal, som är ett mycket trevligare alternativ än windows standard-terminal.

* [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/install)

När installationen är slutförd så behöver du uppdatera din dist (tänk windows update), kör du Ubuntu så använder du följande kommandon i terminalen.

```bash
sudo apt update
sudo apt upgrade
```

I bash kan du sedan skapa en code mapp där du kan spara dina projekt.

```bash
cd
mkdir code
cd code
ls -la
```

{% image "./src/images/Screenshot 2022-05-16 115024.png", "Skärmdump av WSL", "Skärmdump av WSL" %}

### Några användbara bash kommandon

| Kommando | Beskrivning |
| --- | --- |
| ```sudo KOMMANDO``` | Kör kommando som superuser |
| ```ls``` | Listar innehållet i en mapp, ```-la``` för att se allt |
| ```cd MAPP``` | Går till en annan mapp, enbart cd tar dig till din /home mapp |
| ```mkdir MAPP``` | Skapar en ny mapp |
| ```touch FIL``` | Skapar en fil |
| ```rm FIL/MAPP``` | Tar bort en fil, ska du ta bort en mapp med filer lägg till ```-rf```, recursive force |
| ```cp FIL DEST``` | Kopierar en fil till angiven destination |
| ```mv FIL DEST``` | Flyttar en fil till angiven destination |
| ```cat FIL``` | Läser en fil och skriver ut den |
| ```history``` | Listar historik, du kan seadan köra kommandot från historiken med !nummer |

## Nodejs

[Node](https://nodejs.org/en/) är en javascript runtime byggd på Chrome V8s javascript motor. Med ramverket [Express](https://expressjs.com/) blir Node den webbserver (för utveckling) vi använder. Tillsammans med Node så kommer vi att använda oss av [Node packet manager (npm)](https://www.npmjs.com/). NPM är en populär pakethanterare för javascript-utveckling och ett viktigt verktyg att känna till och kunna använda, det gäller både front och back-end.

För att installera och köra Node samt NPM så använder vi oss utan Node Version Manager(nvm).

* [Installera NVM och Node](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm)

## MySQL

För att arbeta med databas så använder vi [MySQL](https://www.mysql.com/). SQL är ett språk för relationsdatabaser, MySQL är en hanterare för detta. Vi använder SQL som databasspråk för att det är en välanvänd standard och det blir din introduktion till databaser och hur de fungerar. Vi kör MySQL för att det är en av de vanligaste databashanterarna.

MySQL körs med en server på din eller en annan dator. Du kan sedan använda en klient för att koppla upp dig till databasservern. För att installera MySQL server och klient kör.

```bash
sudo apt install mysql-server mysql-client
```

WSL startar inte alltid upp MySQL servern korrekt när det startas, för att starta om/upp servern använder du följande kommando. Om det inte fungerar, testa att starta om din dator och prova sedan igen.

```bash
sudo service mysql restart
```

Med servern igång kan du skapa en databasanvändare för den. Detta måste göras som superuser (säkerhet). För att skapa en användare behöver du koppla upp dig till databasservern från användaren root, för att göra det kör du kommandot som [sudo](https://sv.wikipedia.org/wiki/Sudo).

```bash
sudo mysql -u root
```

{% image "./src/images/Screenshot 2022-05-16 115805.png", "Skärmdump av MySQL-klienten", "Skärmdump av MySQL-klienten. Notera att trots varningen så är restarten av servern [  OK  ], vid fel så står det inte OK." %}

Väl inne i MySQL klienten så behöver du skapa en användare. Kör du följande kommando för att skapa en user med alla rättigheter, det är en fungerande lösning för lokal utveckling, men inte att rekommendera i en produktionsmiljö. Kom ihåg att byta ut `username` och `password`.

```sql
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

Vi kommer senare att gå igenom vad dessa kommandon faktiskt gör i SQL.

När du skapat användaren så avsluta med `exit`. Du kan nu ansluta till databasen igen med din skapade användare.

```bash
mysql -u USERNAME -p
```

Väl inne i klienten så kan du prova att skapa en databas för kursen. Om det fungerar så svara klienten med ```QUERY OK```. Du kan sedan välja att visa en lista över dina databaser på servern med kommandot ```SHOW```.

```sql
CREATE DATABASE webbserver;
SHOW databases;
```

## Visual studio code

Från bash under WSL så kan du starta Visual studio code från den aktuella mappen, jag rekommenderar att du gör det för att hela tiden vara i ditt projekts folder. För att starta VSCode i den aktuella mappen skriver du `code .`. Det här är även viktigt för att det startar Visual studio codes remote till ditt VSCode (första gången så installerar den ett tillägg innan det startar). Du kan se att du är uppkopplad till WSL i nedre vänstra hörnet av VSCode.

{% image "./src/images/Screenshot 2025-02-17 165426.png", "WSL connect" %}

Om det strular så kan du också dubbelkolla att du har installerat VScodes extension för WSL, du hittar den på [Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl).

## Avslutning

Förhoppningsvis har all installation gått bra och du har nu en fungerande utvecklarmiljö. Om något har strulat så hoppas jag att du har läst felmeddelanden, upprepat och läst texterna för att hitta vad du har missat.

Fortsättning följer.

