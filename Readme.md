Realtime Pictionary

[Trello Progress](https://trello.com/b/1auyg9oy/picit)

##ToDo
- [X] Add Iron router (routing engine)
- [X] Create folder structure
- [X] Research dynamic templates
- [X] How to trigger view from lobby to game- set the mongo game to "started" from "waiting"
- [X] Added underscore
- [X] Added server method to create mongo game entry
- [X] Added link for using the Mongo Shell with meteor (R&D)
- [X] Game button creates a new round  
- [X] Implement canvas
- [X] Canvas is reactive
- [X] Figure out how to detect a second user has connected
- [X] Creating roles for different users
- [ ] Add front-end framework
- [ ] Button to open two windows for single player
- [ ] Load word list from file on server
- [ ] Assign word to drawer when their turn starts
- [X] Test if a guessed word exists in the wordlist
- [ ] Update guesser as they guess if they type in valid words
- [ ] Create timer for turn



##Future features
- [ ] Sharing links
- [ ]


##Current App Flow-
User navigates to '/' and is served the home template.  There they can create a new game, which redirects them to their respective game template at '/:gameID', which defaults to the gameLobby template.  From there, we need to create a timer/listener that waits for another user to connect.  Once the user connects, we use Dynamic templates to switch out the template depending on what role the user has, either drawer or guesser.  This avoids us having to create multiple routes for drawers/guessers, and worrying about security of a guesser going to a drawing route and vice versa.

Possible way of deciding user auth- game itself has a mongodb entry.  when the first person navigates to that page, their session token is saved in that game's "drawer" field.  the hook will check that field to see if its populated, and if it is, then the other users will be set as guessers.  IF we had users create demo accounts and log in, they wouldn't be able to play from the same computer bc meteor will persist their logged in status to all connections stemming from their IP address.
