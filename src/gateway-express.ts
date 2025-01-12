/* Copyright © 2021 Richard Rodger, MIT License. */

function gateway_express(this: any, options: any) {
  const seneca: any = this
  const gateway = seneca.export('gateway/handler')
  const parseJSON = seneca.export('gateway/parseJSON')


  seneca.act('sys:gateway,add:hook,hook:delegate', {
    action: (delegate: any, _json: any, ctx: any) => {
      ctx.req.seneca$ = delegate
    }
  })


  async function handler(req: any, res: any, next: any) {
    let body = req.body
    let json = 'string' === typeof (body) ? parseJSON(body) : body
    if (json.error$) {
      return res.status(400).send(json)
    }
    else {
      let out: any = await gateway(json, { req, res })
      if (out.done$) {
        return next()
      }
      else {
        res.send(out)
      }
    }
  }


  return {
    name: 'gateway-express',
    exports: {
      handler
    }
  }
}


// Default options.
gateway_express.defaults = {
}


export default gateway_express

if ('undefined' !== typeof (module)) {
  module.exports = gateway_express
}
