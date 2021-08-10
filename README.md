# reAmbSafe

##### This is a WebPage made to report and monitor the ambulance location to hospital client in case of emergency.This MERN stack application

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

PageName and description | Preview
------------ | -------------
 <strong>LoginPage</strong>:Uses OTP authentication to verify user only user available in database are able to login. | ![Login](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/loginPage.png)
<strong> Anonymous UserPage</strong>:An anonymous user can report a emergency location and also has to send a valid PhoneNumber | ![ReportPage](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/AnonymousUserMap.png)
<strong>Ambulance Location for Anonymous user client</strong>:Once ambulance client accepts notification realtime location of ambulance is shown here | ![AnonymousUserMap](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/MapShowingAmbulanceLocation.png)
<strong>Ambulance client notification</strong>:It shows notification recieved in realtime,the red color indicates the notification recieved is not handled by any other client and greenish color shows the notification of emergency is taken care.|![Ambulance Client Notification](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/AmbulanceClientNotification.png)
<strong>Form</strong>:This form is highlighted by a button,Once ambulance reaches the location,It also automatically selects a nearest hospital from database | ![Form](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/Form.png)
<strong>Ambulance NavigationPage </strong>: It is page opened once the ambulance client accepts a emergency request shows waypoints to nearest hospital and also emergency location| ![AmbulanceMapPage](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/AmbulanceClientMapPage.png)
<strong>Hospital Client Notification</strong> : This Page recieves notification with form details and real time location from the ambulance client | ![Hospital Client](https://github.com/nishalk01/reAmbSafe/blob/main/screenshots/HospitalCliet.png)

## Few things to notice 
* Twilio is used to send SMS,However in the code OTP is print onto terminal to avoid wasting cost on SMS,However code is available [here](https://github.com/nishalk01/reAmbSafe/blob/main/backend/Helper.js) in Line 42.
* Instead of using watchPosition for demo purpose,I have used waypoints make sure to change it.

##### This Project is made possible with the help of all these opensource projects :heart:,This project is bootstraped using CRA  
* https://www.npmjs.com/package/twilio
* https://github.com/facebook/react
* https://redux.js.org/
* https://github.com/Turfjs/turf
* https://github.com/expressjs/express
* https://github.com/Automattic/mongoose
* https://socket.io/
* https://github.com/PaulLeCam/react-leaflet
