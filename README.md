Competitive hot-seat platform game by mcalus3. Play now! https://mcalus3.github.io/color-wars-web

**ColorWars** is my first attempt to fulfill my dreams about being a game developer. I have made my [first prototype in C#][cw], but soon after i have rewritten it in typescript for the web. The idea was to make graphically simple, but competitive browser game that anyone and anywhere would be able to play with friends.

The game rules are simple - try to paint as much territory as possible until timer ends, but watch out, because enemies can cut off your tail while you are painting!

## Gameplay

**ColorWars** can be played by up to 8 players. The game has dynamic settings, so you can change every aspect of the game during the match. The aim of the game is to have more territory than other players when game ends. You can die by hitting edge of the screen, or when someone cuts your tail. When the death penalty is set to infinite or you don't have any territory left, you are eliminated from the game.

![gameplay](https://github.com/mcalus3/color-wars-web/blob/master/resources/gameplay.gif)

### To play:
You are the green user (top left corner) on the screen. You can play by pressing WASD on the keyboard to move up, left, down, or right, respectively.

## CSE 110 - Bug Description

### To run:

1. Wait until you see a message in the terminal along the lines of "Welcome to Codespaces! You are on a custom image defined in your devcontainer.json file."
2. When the build finishes, run `npm start` to start the dev server. You should see the web app opening!
3. If you see a TypeError page upon opening the web app, you can ignore it by closing the page. You should still be able to play the game and debug the issue.

### Task description:
As shown in the video above, there are multiple players that compete in covering more space in there colors by making quadrilateral shapes. There is a bar that represents the proportion of the canvas the players have covered. However, this bar is currently not presenting the proportions correctly. Your task is to identify the code relevant to the bug, and attempt to find a fix.

Hint: the bug should be a **logic error** in one of the core **TypeScript** files.

### To submit:
Run the following commands line by line to commit and push all your changes (or use the sidebar):
```
$ git add .
$ git commit
$ git push
```


## Libriaries and dependencies

**ColorWars** is based on [Model-View-Update pattern][elm], it uses [Redux] library for state management and [React] + [Konva] libraries for view (and [react-bootstrap] for ui controls). The project is written in typescript and bootstrapped by [Typescript-React-Starter][trs].
Thanks to all authors of these libraries for making Color Wars possible!

## Contributing

**ColorWars** was created for entertainment and it's still under developement. If you would like to contribute, feel free to open issue, fork, submit pull request, or contact me for backlog with nearest planned features. You can also follow my dev blog if you would like to see comments made during development of this game: https://mcalusblog.wordpress.com/

[cw]: https://github.com/mcalus3/ColorWars
[trs]: https://github.com/Microsoft/TypeScript-React-Starter
[trs]: https://github.com/Microsoft/TypeScript-React-Starter
[elm]: https://guide.elm-lang.org/architecture/
[Redux]: https://github.com/reactjs/redux
[React]: https://github.com/facebook/react
[Konva]: https://github.com/konvajs/konva
[react-bootstrap]: https://github.com/react-bootstrap/react-bootstrap
