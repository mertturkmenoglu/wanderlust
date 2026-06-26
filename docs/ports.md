# Ports

Ports used by the Wanderlust:

| Port 	| Service    				| Description   					|
| -----	| ----------------- | ----------------------- |
| 1025 	| Mailpit						| SMTP server   					|
| 3000 	| Web 							| Web UI        					|
| 3001 	| Web HMR 					| Web HMR  								|
| 3002 	| Wiop							| WIOP Service 						|
| 3003 	| Admin 						| Admin Web UI						|
| 4000 	| Email 						| Email service 					|
| 3006 	| Typesense  				| Dashboard     					|
| 5000 	| API        				| HTTP server   					|
| 5001 	| Notifications    	| Notifications server		|
| 5005 	| Chat 							| Chat server   					|
| 5432 	| PostgreSQL 				| Database      					|
| 6379 	| Redis      				| Redis         					|
| 7333 	| SeaweedFS					| WebDAV									|
| 8025 	| Mailpit    				| Web UI        					|
| 8333 	| SeaweedFS 				| S3 Endpoint							|
| 8108 	| Typesense  				| Search engine 					|
| 8888 	| SeaweedFS 				| Filer UI 								|
| 9333 	| SeaweedFS 				| Master UI 							|
| 9340 	| SeaweedFS					| Volume Server 					|
| 23646 | SeaweedFS 				| Admin UI 								|

In development environment, ports are hardcoded. We expect these ports to be available.

Please make sure nothing else uses these ports before you start the services.
