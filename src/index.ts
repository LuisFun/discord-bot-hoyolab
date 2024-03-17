import { DiscordHono } from 'discord-hono'
import * as res from './response'

type Env = {
  Bindings: {
    DISCORD_APPLICATION_ID: string
    //DISCORD_TOKEN: string
  }
}

const app = new DiscordHono<Env>()
  .command('url', async c => {
    const url = new URL(c.values.url.toString())
    const locale = (c.values.locale || c.interaction.locale).toString()
    switch (url.host) {
      case 'www.hoyolab.com': {
        const basePath = url.pathname.split('/')[1]
        switch (basePath) {
          case 'article': {
            try {
              return await res.article(c, url, locale)
            } catch (e) {
              return c.res(e + '\n' + url.href)
            }
          }
          default: {
            return c.res('Unsupported URL\n' + url.href)
          }
        }
      }
      default: {
        return c.res('Unsupported URL\n' + url.href)
      }
    }
  })
  .command('invite', c =>
    c.resEphemeral({
      content: `https://discord.com/api/oauth2/authorize?client_id=${c.env.DISCORD_APPLICATION_ID}&permissions=0&scope=bot`,
    }),
  )
  .component('delete', c => c.resRepost())

export default app
