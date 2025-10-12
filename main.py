import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
TOKEN = os.getenv("DISCORD_TOKEN")

# Bot setup
intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents, help_command=None)

@bot.event
async def on_ready():
    print(f"🧠 Logged in as {bot.user.name}")
    print("Gregory House is online and diagnosing...")

# Load extensions
initial_extensions = ["cogs.pharmacy"]

async def load_extensions():
    for ext in initial_extensions:
        try:
            await bot.load_extension(ext)
            print(f"✅ Loaded {ext}")
        except Exception as e:
            print(f"❌ Failed to load {ext}: {e}")

async def main():
    async with bot:
        await load_extensions()
        await bot.start(TOKEN)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
