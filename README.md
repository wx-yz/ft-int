# Integrating Jack Henry banking APIs with Choreo
Creating a proxy API for Jack Henry banking APIs. Blog post for this repo can be found here https://medium.com/@chintanaw/integrating-apps-and-services-with-jack-henry-banking-apis-7da61ad8e832

Sequnce diagram for the message exchange

![image](https://user-images.githubusercontent.com/57770159/236637300-11ea3fa6-326b-4295-a3da-10b19db11e23.png)

The flow and the user experience looks like below



https://user-images.githubusercontent.com/57770159/236638340-fae142ec-6a15-49e0-aa5d-b1a9d17b3ef4.mp4



## Generate accounts and tokens with jackhenry.dev

Go to https://jackhenry.dev/, sign up and follow the instructions for generating tokens. Then enroll a user in Garden

## Mediation policy for handling authentication

1. Under `JHAuhtPolicy` folder you can find the mediation policy
2. Follow the prerequisites in this guide, generate a token and copy that to `~/.ballerina/Settings.toml`
3. Use Ballerina [2201.3.1](https://ballerina.io/downloads/swan-lake-release-notes/swan-lake-2201.3.1) to build and push the mediation policy

## Create proxy API in Choreo

1. Use the OpenAPI spec here - https://jackhenry.dev/open-api-docs/consumer-api/api-reference/v0/accounts/details/
2. Follow this guide for creating a REST API proxy in Choreo - https://wso2.com/choreo/docs/develop/components/api-proxy/
3. Publish the API
4. Go to Devportal and subscribe to the API then generate an access token
5. Copy the access token the app under `jh-app` and run it

