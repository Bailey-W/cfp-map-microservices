# System Architecture Design
## Overview
CFP-Map is designed using microservice architecture patterns, inspired by the patterns shown [here](https://microservices.io). The overall idea of the microservice architecture is to break a large program down into many subprograms (called microservices) each responsible for its own unique set of tasks.
## Pattern Choices
The design patterns for software designed with microservices in mind can be broken down into several sections. The information in the following sections comes from this [list of patterns](https://microservices.io/patterns/index.html).
### Decomposition
The biggest factor in a microservice architecture is the decomposition of the system into microservices. CFP-Map follows two design patterns to do this successfully: [Decomposition by Subdomain](https://microservices.io/patterns/decomposition/decompose-by-subdomain.html) and [Self-contained Service](https://microservices.io/patterns/decomposition/self-contained-service.html). This results in a loosely-coupled system with high levels of availability.
### Data Management
Using the [Database per Service pattern](https://microservices.io/patterns/data/database-per-service.html), each service will maintain its own data and database, which will allow for a more loosely-coupled system.
### Data Querying
With the choice of maintaining multiple databases comes the need for a smart method of querying those databases. I have chosen the [API Composition pattern](https://microservices.io/patterns/data/api-composition.html) to accomplish this. This pattern involves having one API composer which queries each service and performs in-memory joins when necessary.  
## The Structure
### Frontend:
The frontend will consist of one single React application which serves a responsive front-end to users and allows for account creation and display of conferences by category on a map. With an account, users can save favorite conferences and marked planned attendance to show on their public profile.

### Backend
This is where the magic happens. The backend consists of the true microservice architecture, being broken down into a service per subdomain. Those services include:
- API Composer
- Web Scraping Service
- Geocoding Service
- Store Conference Service
- Fetch Conference Service
- Create User Service
- User Validation Service
- Update User Service
- Fetch User Data Service