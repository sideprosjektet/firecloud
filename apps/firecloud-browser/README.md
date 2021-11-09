# The browser

* Should prevent SoF-apps to navigate outside their domains.
* Should load a setup over which apps that should be load at which
scenario.
  
## oauth2 implementation in Sof-launcher
Probably best to use the implementation from the official smart on
fhir launcher. 
https://github.com/smart-on-fhir/smart-launcher/blob/6de4ea52d0ae7721d0bc66b90fee9d7d51bbce04/src/AuthorizeHandler.js

* Should be written as a library and propperly tested. Could be released
