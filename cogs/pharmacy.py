import json
import discord
from discord.ext import commands

class Pharmacy(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        with open("data/questions.json", "r", encoding="utf-8") as f:
            self.questions = json.load(f)

    @commands.command(name="ask")
    async def ask_question(self, ctx, *, query: str):
        """Ask a pharmacology question"""
        for q in self.questions:
            if query.lower() in q["question"].lower():
                embed = discord.Embed(
                    title=q["question"],
                    description=f"💊 **Answer:** {q['answer']}\n🩺 **When to Give & Effect:** {q['explanation']}",
                    color=discord.Color.blue()
                )
                await ctx.send(embed=embed)
                return
        await ctx.send("House: *That’s not in my textbook. Try another question.*")

async def setup(bot):
    await bot.add_cog(Pharmacy(bot))
