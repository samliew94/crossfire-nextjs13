# CROSSFIRE

Crossfire is a social-deduction, hidden-role game for 5 to 10 players. In each of the two
different game types (Crossfire Mode and Sniper Mode), some players will try to shoot
the VIP, some will try to protect the VIP, and others have their own agendas for victory.

Game Design by Emerson Matsuuchi. Published by [Plaid Hat Games](https://www.plaidhatgames.com/board-games/crossfire/)

## Installation with Docker

1. Download this project.
2. CMD/Powershell into the downloaded folder.
3. run `docker build -t crossfire` (one-time only).
4. run `docker run -p80:3000 --rm -e NEXTAUTH_URL=http://192.168.1.103 crossfire`
   (replace '192.168.1.103' with your ipv4 address found at `ipconfig`).  
    **IF YOU GIVE THE WRONG IPV4 ADDRESS, SIGN IN WILL FAIL.**
5. Have all players navigate to your ipv4 address in their preferred browser e.g `http://192.168.1.103`.

## Roles

Note that only the basic roles are available namely:

1. VIP
2. AGENT
3. ASSASSIN
4. DECOY
5. RED DECOY
6. BLUE DECOY
7. BOMBER (replaced BYSTANDER cause it's kinda meh)

## Screenshots:

![ScreenShot](/screenshots/1.png)
![ScreenShot](/screenshots/2.png)
![ScreenShot](/screenshots/3.png)
![ScreenShot](/screenshots/4.png)
![ScreenShot](/screenshots/5.png)
![ScreenShot](/screenshots/6.png)
![ScreenShot](/screenshots/7.png)
![ScreenShot](/screenshots/8.png)

## Contact Me

For business inquiries or just general feedback, kindly email me at mlmsamliew@gmail.com

## Buy me a Cup of Coffee

If you like my work, consider buying me a cup of coffee by clicking [here](https://www.buymeacoffee.com/samliew94)
