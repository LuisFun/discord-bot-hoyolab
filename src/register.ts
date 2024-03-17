import dotenv from 'dotenv'
import process from 'node:process'
import { Command, Option, register } from 'discord-hono'

dotenv.config({ path: '.dev.vars' })

const commands = [
  new Command('url', 'URL Embed').options(
    new Option('url', 'Paste URL').required(),
    new Option('locale', 'Article Locale').choices(
      { name: 'en-US', value: 'en-us' },
      { name: 'ja-JP', value: 'ja-jp' },
      { name: 'ko-KR', value: 'ko-kr' },
      { name: 'zh-CN', value: 'zh-cn' },
      { name: 'zh-TW', value: 'zh-tw' },
      { name: 'id-ID', value: 'id-id' },
      { name: 'th-TH', value: 'th-th' },
      { name: 'de-DE', value: 'de-de' },
      { name: 'fr-FR', value: 'fr-fr' },
      { name: 'es-ES', value: 'es-es' },
      { name: 'pt-PT', value: 'pt-pt' },
      { name: 'vi-VN', value: 'vi-vn' },
      { name: 'it-IT', value: 'it-it' },
      { name: 'ru-RU', value: 'ru-ru' },
      { name: 'tr-TR', value: 'tr-tr' },
    ),
  ),
  new Command('invite', 'Invite URL'),
]

await register(
  commands,
  process.env.DISCORD_APPLICATION_ID,
  process.env.DISCORD_TOKEN,
  //process.env.DISCORD_TEST_GUILD_ID,
)
