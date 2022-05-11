# wikijs-oauth-module-faforever
This is a module to allow for oauth login using the faf hydra oauth provider

To use this with a wikijs installation you must add the faf-hydra folder to the /server/modules/authentication folder
Once added to the mentioned folder a new strategy named FAF Ory Hydra Login becomes available. Enable this strategy and create
and oauth client in hydra with the proper redirect_uri to use it for single sign on.

This plugin works by retrieving an access token from hydra and then using it to query the api and get the user info.
This user info is then used to either populate or update the user in the wiki. Users are uniquely mapped to the api through their
player ids. So even when username or email address changes occur the wiki information will be updated accordingly on login.

