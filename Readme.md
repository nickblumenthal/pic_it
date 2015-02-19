Realtime Pictionary

##ToDo
- [X] Add Iron router (routing engine)
- [X] Create folder structure
- [X] Research dynamic templates
- [X] How to trigger view from lobby to game- set the mongo game to "started" from "waiting"
- [ ] Implement canvas
- [ ] Figure out how to detect a second user has connected
- [ ] Add front-end framework
- [ ] Figure out db schema
- [ ] Button to open two windows for single player



##Future features
- [ ] Sharing links
- [ ] 


Current App Flow- 
- User navigates to '/' and is served the home template.  There they can create a new game, which redirects them to their respective game template at '/:gameID', which defaults to the gameLobby template.  From there, we need to create a timer/listener that waits for another user to connect.  Once the user connects, we use Dynamic templates to switch out the template depending on what role the user has, either drawer or guesser.  This avoids us having to create multiple routes for drawers/guessers, and worrying about security of a guesser going to a drawing route and vice versa.