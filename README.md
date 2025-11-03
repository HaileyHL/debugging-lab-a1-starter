Competitive hot-seat platform game by mcalus3. Play now! https://mcalus3.github.io/color-wars-web

**ColorWars** is my first attempt to fulfill my dreams about being a game developer. I have made my [first prototype in C#][cw], but soon after i have rewritten it in typescript for the web. The idea was to make graphically simple, but competitive browser game that anyone and anywhere would be able to play with friends.

The game rules are simple - try to paint as much territory as possible until timer ends, but watch out, because enemies can cut off your tail while you are painting!

## Gameplay

**ColorWars** can be played by up to 8 players. To enable more players, switch off "AI controlled" button in given player settings. The game has dynamic settings, so you can change every aspect of the game during the match. The aim of the game is to have more territory than other players when game ends. You can die by hitting edge of the screen, or when someone cuts your tail. When the death penalty is set to infinite or you don't have any territory left, you are eliminated from the game.
**The game supports touchscreen control, so you can try it on your mobile device!**

![gameplay](https://github.com/mcalus3/color-wars-web/blob/master/resources/gameplay.gif)

## CSE 110 - Bug Description

### Prerequisite
- Install [VSCode](https://code.visualstudio.com/)
- Install the following extensions in VSCode:
  - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  - (Optional, but saves you from manually cloning the repo) [GitHub Classroom](https://marketplace.visualstudio.com/items?itemName=GitHub.classroom)


### To run:
1. Click the "Open in VSCode" code at the top of this repo, if you have the extension "GitHub Classroom" installed. Skip to 3.
2. If not, manually clone this repository using `git`.
3. Open the cloned local repository using VSCode
4. You should see a pop-up in the lower right corner prompting you to "reopen in dev container". Click that.
   - If you do not see the pop-up. Press "Ctrl/Command+Shift+P" and type "Dev Container: Reopen in Container" and select that option.
5. Wait for the container to build, which will automatically set up the required dependencies for the project.
6. When the build finishes, run `npm start` to start the dev server. GLHF : )

### Task description:
As shown in the video above, there are multiple players that compete in covering more space in there colors by making quadrilateral shapes. There is a bar that represents the proportion of the canvas the players have covered. However, this bar is currently not presenting the proportions correctly. Your task is to identify the code relevant to the bug, and attempt to find a fix.


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
