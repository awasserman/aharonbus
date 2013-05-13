http = require 'http'
url  = require 'url'

base = 'api.wmata.com'

port = 1234

http.createServer (proxyReq, proxyRes) ->
  
  if proxyReq.method is 'GET'
  
    params = url.parse proxyReq.url, true
    apiUrl = params.path
        
    reqOptions = 
      host : base
      port : 80
      path : params.path
      method : 'GET'
        
    req = http.request reqOptions, (res) ->
      headers = res.headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Headers'] = 'X-Requested-With'
      proxyRes.writeHead 200, headers
    
      res.on 'data', (chunk) ->
        proxyRes.write chunk
      
      res.on 'end', ->
        proxyRes.end()
    
    req.on 'error', (e) ->
      console.log 'problem with request: ' + e.message
      proxyRes.writeHead 503
      proxyRes.write "An error happened!"
      proxyRes.end()
    
    req.end()

.listen port, ->
  console.log "PROXY ONLINE"