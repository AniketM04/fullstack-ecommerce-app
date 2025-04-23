export default {

  oidc: {
    clientId: 'token',
    issuer: 'okta-developer.com',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes:['openid', 'profile', 'email']
  }

}
