import type { CommandContext } from 'discord-hono'
import { localeFind } from './utils'

const maxNum = 140

type APIJson = {
  message: string
  data: {
    post: {
      post: {
        subject: string
        desc: string
        multi_language_info: {
          lang_subject: Record<string, string>
        } | null
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

export const article = async (c: CommandContext, u: URL, locale: string) => {
  const id = u.pathname.split('/').slice(-1)[0]
  const api = await fetch('https://bbs-api-os.hoyolab.com/community/post/wapi/getPostFull?post_id=' + id)
  const json = (await api.json()) as APIJson
  if (json.message !== 'OK') throw new Error('fetch Error')
  const imageUrl = json.data.post.image_list[0].url || ''
  const postLocale = localeFind(Object.keys(json.data.post.post.multi_language_info?.lang_subject || {}), locale)
  const lang_subject = postLocale ? json.data.post.post.multi_language_info?.lang_subject[postLocale] : undefined
  const title = lang_subject
    ? lang_subject.slice(0, maxNum) + (lang_subject.slice(maxNum, maxNum + 1) ? '...' : '')
    : json.data.post.post.subject.slice(0, maxNum) +
      (json.data.post.post.subject.slice(maxNum, maxNum + 1) ? '...' : '')
  const url = u.origin + u.pathname
  return c.res({
    embeds: [
      {
        author: { name: json.data.post.user.nickname, icon_url: json.data.post.user.avatar_url },
        title,
        url,
        description:
          json.data.post.post.desc.slice(0, maxNum) +
          (json.data.post.post.desc.slice(maxNum, maxNum + 1) ? '\n...' : ''),
        image: { url: imageUrl },
        color: 0x556de5,
      },
      ...json.data.post.image_list.slice(1, 4)?.map(image => ({
        url,
        image: { url: image.url },
      })),
    ],
  })
}
