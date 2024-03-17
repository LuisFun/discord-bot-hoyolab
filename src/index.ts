import { DiscordHono } from 'discord-hono'

type Env = {
  Bindings: {
    DISCORD_APPLICATION_ID: string
    //DISCORD_TOKEN: string
  }
}

type APIJson = {
  message: string
  data: {
    post: {
      post: {
        subject: string
        desc: string
      }
      user: {
        nickname: string
        avatar_url: string
      }
      image_list: {
        url: string
      }[]
    }
  }
}

const app = new DiscordHono<Env>()
  .command('url', async c => {
    const url = c.values.url.toString()
    const id = new URL(url).pathname.split('/').slice(-1)[0]
    try {
      const res = await fetch('https://bbs-api-os.hoyolab.com/community/post/wapi/getPostFull?post_id=' + id)
      const json = (await res.json()) as APIJson
      if (json.message !== 'OK') throw new Error('fetch Error')
      const imageUrl = json.data.post.image_list[0].url || ''
      return c.res({
        embeds: [
          {
            title: json.data.post.post.subject,
            url,
            description: json.data.post.post.desc,
            image: { url: imageUrl },
          },
        ],
      })
    } catch (e) {
      return c.res(e + '\n' + url)
    }
  })
  .command('invite', c =>
    c.resEphemeral({
      content: `https://discord.com/api/oauth2/authorize?client_id=${c.env.DISCORD_APPLICATION_ID}&permissions=0&scope=bot`,
    }),
  )

export default app
