#Izzmo's Turntable.fm Auto Awesomer
![Izzmo's AutoAwesome](http://www.pinnacleofdestruction.net/tt/images/aa-small.png)

This script allows you to enjoy turntable.fm music without getting paranoid about voting for every song, which you should be doing! Instead, forget the hassle and turn this on to have the songs you listen to get voted awesome automatically!

If you do not like a song, simply go back to the turntable.fm room tab and click lame, and the counter will not resume until the next song!

## Features

* Automatically votes awesome for every song you listen to in your turntable.fm room.
* Allows for song laming. If you don't like a song, this script isn't like others. It will see that you lame'd a song and wait till the next song to start awesomering again.
* Never go AFK! This script will keep you active in the room; so if you are working while DJ'ing, you can be sure you will never get booted for being AFK.
* No more idle boot! If you have ever sat in a room too long (usually around 2-3 hours) without voting, you will get booted back to the lobby for being AFK. No more! This script resets your idle timer

## Download

In order to use the AutoAwesomer, please visit our website at http://izzmo.com/tt/ for instructions on how to add it to your bookmarks bar and get it up and running.

## Changelog

### November 15th, 2012
* Fixed bug not allowing someone to vote in a big room if they were not in the main section.

### November 14th, 2012
* Updated the code for the new Turntable.fm interface.
* Some of the API calls and variables were changed slightly.
* Moved the Awesome Arc to the new location of the interface (now smaller as well).

### August 7th, 2012
* Updated CodePlex link to Github repository page.
* The time it takes to awesome a song now happens in a quarter-length of the song time or less instead of half the length of the song.
* We have officially moved to Github and all files are now _open sourced_!
* When you awesome the song by some other means, wether from the CLI in [TTEnhanced](http://github.com/izzmo/TTEnhanced) or another UI, it should not see that action and put the vote bar to full.
* If you are out of the tab and the song is auto-awesome'd, or awesome'd in any other way, the arc will be at full (180 degrees) when you have re-focused the page instead of continuing.

### March 26th, 2012
Fixed a bug not allowing the auto-awesome to start.

### March 22nd, 2012
Fixed a bug that would not cause the script to load due to my interface extension running.

### February 17th, 2012
Extended the time to check for interface changes (when changing rooms) so the AA interface comes back up.

### February 13th, 2012
Added in some extra validation to make sure the awesome arc was not going passed 180 degrees.

### February 12th, 2012
* Room Switching is now supported. If you move to another room on turntable, the AutoAwesome will stay intact!
* If you are DJ'ing and currently playing a song, the AA will no longer try to awesome that song.

### February 11th, 2012
* Fixed bug where AutoAwesome would not start. Please email me or chat with me if this is still happening to you!
* Added a awesome arc. This is much like a counter, but graphical instead of raw numbers. When it reaches the other side of the vote meter, it awesomes the song.
* Added visual feedback. If you awesome the song before the countdown is up, it will stop and turn green; or if you lame it at any point, it will stop the countdown and the arc will turn bright red.

### January 23rd, 2012
* Added support for laming a song and canceling the auto awesome for the song. (Support for this was taken out of the beta build but re-added shortly after release).
* Awesome once per song. Now the AutoAwesome only awesomes the song once per song instead of multiple times with the countdown method.
* No more countdown! The simplified interface will hopefully answer some peoples questions the first time they operate the AutoAwesome and wonder what the countdown is.
* Added support so if you click your bookmark multiple times, only the first time will start the bookmark. This prevents you from getting weird countdowns and causing multiple awesomes for each song.

### January 10th, 2012
Fixed a problem with the AFK timer not working.

### December 13th, 2011
Updated some core functions so they do not rely on timers anymore, but more of Turntable's default functionality.

### December 6th, 2011
* Movable! You can now move the button wherever you would like on the screen. Note: In Firefox, it is a little buggy. To move it, you must select the part of the circle that is not a link (hand cursor) or else when you stop moving it, it will close it.
* The timer button (green circle) now shows in top left corner.
* Bug Fix: Some users were experiencing a "callback reference" error.

### December 5th, 2011
Better lame support. When you lame a song with the AA script running, it will not suspend the timer and resume upon the next song so a song you lame stays lamed.