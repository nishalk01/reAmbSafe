# reAmbSafe

##### This is a WebPage made to report and monitor the ambulance location to hospital client in case of emergency.

The webPage has 3 total client in total 
* Ambulance client. :ambulance:
* Anonymous user client. :busts_in_silhouette:
* Hospital client.  :hospital:

### Description

Let's say there is a emergency at a location reported by  anonymous user client.The User reporting must fill in a valid phone Number and send that to particular ambulance client by selecting ambulance client from the list
The ambulance client recieves a notification in real time via sockets with user PhoneNumber and location.The ambulance client can then accept that notification and he is redirected to a Page with waypoints on a map.<br/>
The anonymous user client will recieve the ambulance location in realtime,Once the ambulance client reaches the location sent by anonymous user he can now view the location of ambulance in realtime.On reaching the location ambulance client can now choose to send patient form,On submission automatically nearest hospital from database is choosen.<br/>
A waypoint is shown to nearest hospital and this hospital client recieves the notification and can view ambulance location in realtime.

Both Ambulance and hospital client are authenticated using OTP authentication.
