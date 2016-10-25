# electron-squirrel-boilerplate
A minimal integration of Squirrel.Windows in Electron

**WORK IN PROGRESS**
This is an extraction of the squirrel integration from a larger project. It is still in process of cleanup, as such I would not recommend using it yet.

- - - -
## Quickstart
1. ```npm install```
1. ```npm start``` to run on Windows 
    1. ```npm run osx``` to run on OSX


- - - -
If you are building a Windows desktop application using [electron](http://electron.atom.io/), then [Squirrel.Windows](https://github.com/Squirrel/Squirrel.Windows) is the widely cited go-to framework, to handle the installationa nd update flow for you.
Electron's [AutoUpdater](http://electron.atom.io/docs/api/auto-updater/) is the built-in interface to squirrel. However there are still some challenges left for you to handle (and some caveats to consider), if you want to leverage squirrel in your app.

I was building an electron application in a work-related project and we ended up using squirrel as well. While working on that, I found the documentation numerous, but rather incomplete or confusing. In order to spare others (and my future-self :D ) from the same the trouble, I created this boilerplate, to showcase a barebones integration and possible solutions to some of the challenges faced.

I hope it can be of use to someone out there.

- - - -
## What to consider, when using Squirrel

... 