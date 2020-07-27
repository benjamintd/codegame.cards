# codenames.cards

<p align="center">
    <img src="https://github.com/benjamintd/codenames.cards/raw/master/public/icon-192.png" width="192" alt="Codenames - icon by freepik" />
</p>

## An online version of the Codenames tabletop game

Install and run:

```
$ yarn
$ yarn dev
```

This project requires a Firebase database. See `.env.sample` for the required environment variables.

## Creating a firebase real-time database

- Create a Firebase account if you do not have one.
- Head to the firebase console: https://console.firebase.google.com/, and add a new project. Select web-based when prompted.
- Once the project is created, create a Real-Time Database (there should be an option to do so on the main project page)
- In order to get the environment variables to put in a `.env` file, go to the project settings and scroll down to "Your Applications". You should see some integration code there. Copy the configuration values and paste them into a .env file:

<img width="622" alt="Screen Shot 2020-07-27 at 11 50 12 AM" src="https://user-images.githubusercontent.com/11202803/88528837-741eb100-cfff-11ea-9092-4e47cd282734.png">
