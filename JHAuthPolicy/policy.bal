import ballerina/http;
import choreo/mediation;
import ballerina/mime;
import ballerina/log;

string tokenEndpoint = "https://digital.garden-fi.com";

// A mediation policy for talking to JackHendry.dev auth flow and generate an access token
@mediation:RequestFlow
public function policyNameIn(mediation:Context ctx, http:Request req, string consumerSecret)
                                returns http:Response|false|error|() {
    log:printInfo("Inside mediation policy get JH Token: ");

    // Extracting request params. Sent from the app
    string clientId = req.getQueryParamValue("client_id") ?: "";
    log:printInfo("Client ID: " + clientId);

    string authCode = req.getQueryParamValue("code") ?: "";
    log:printInfo("Auth Code: " + authCode);

    string redirectUri = req.getQueryParamValue("redirect_uri") ?: "";
    log:printInfo("Redirect URI: " + redirectUri);

    string codeVerifier = req.getQueryParamValue("code_verifier") ?: "";
    log:printInfo("Code Verifier: " + codeVerifier);

    // string consumerSecret = req.getQueryParamValue("consumerSecret") ?: "";
    // string consumerSecret = check ctx.get("consumerSecret").cloneWithType(string);
    log:printInfo("Consumer Secret: " + consumerSecret);

    string tokenPayload = "client_id=" + clientId +
        "&grant_type=authorization_code" +
        "&code=" + authCode +
        "&redirect_uri=" + redirectUri +
        "&code_verifier=" + codeVerifier +
        "&client_secret=" + consumerSecret +
        "&redirect_uri=" + redirectUri +
        "&code_verifier=" + codeVerifier;

    http:Client tokenClient = check new(tokenEndpoint);
    http:Request tokenReq = new;
    tokenReq.setHeader("Content-Type", mime:APPLICATION_FORM_URLENCODED);
    tokenReq.setPayload(tokenPayload);
    json|http:ClientError tokenRes =  tokenClient->post("/a/consumer/api/v0/oidc/token", tokenReq);
    if (tokenRes is http:ClientError) {
        log:printError("Error while getting token: " + tokenRes.toString());
        log:printInfo("URL used: " + tokenEndpoint + "/a/consumer/api/v0/oidc/token");
        log:printInfo("Payload used: " + tokenPayload);
        return tokenRes;
    }

    log:printInfo("Token Response: " + tokenRes.toString());

    string accessToken = check tokenRes.access_token;
    req.addHeader("Authorization", "Bearer " + accessToken);

    return ();
}
