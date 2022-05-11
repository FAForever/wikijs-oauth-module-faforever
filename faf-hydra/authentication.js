const OidcStrategy = require('passport-openidconnect')
const request = require('request')

module.exports = {
  init (passport, conf) {
    passport.use(conf.key,
      new OidcStrategy({
        issuer: conf.oauthBaseUrl + '/',
        tokenURL: conf.oauthBaseUrl + '/oauth2/token',
        authorizationURL: conf.oauthBaseUrl + '/oauth2/auth',
        userInfoURL: conf.oauthBaseUrl + '/userinfo?schema=openid',
        clientID: conf.clientId,
        clientSecret: conf.clientSecret,
        callbackURL: conf.callbackURL,
        scope: ['openid', 'public_profile'],
        passReqToCallback: true
      },
      function (req, iss, sub, profile, jwtClaims, accessToken, refreshToken, params, cb) {
        const providerKey = req.params.strategy
        request.get(
          {
            url: conf.apiUrl + '/me',
            headers: {'Authorization': 'Bearer ' + accessToken}
          },
          function (e, r, body) {
            if (r.statusCode !== 200) {
              console.log('Auth failure: ' + r.statusCode)

              return cb(null)
            }
            let user = JSON.parse(body)
            let accountPromise = WIKI.models.users.processProfile({providerKey: providerKey, profile: {id: user.data.attributes.userId, email: user.data.attributes.userName + "@faforever.com", displayName: user.data.attributes.userName}})
            accountPromise.then(account => {cb(null, account)})
          }
        )
      }
      )
    )
  },
  logout (conf) {
    if (!conf.logoutURL) {
      return '/'
    } else {
      return conf.logoutURL
    }
  }
}
