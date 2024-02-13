const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("./../../config/config.json");
const model = require("./../model/gemini-pro.js");
const embeds = require("./../../config/embeds.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask-pyroquanta")
    .setDescription("Ask questions to PyroQuanta.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Prompt For Gemini")
        .setRequired(true),
    ),
  async execute(interaction, client) {
    const prompt = interaction.options.getString("prompt");

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const embed = new EmbedBuilder()
        .setColor(embeds.color)
        .setTitle(`**PyroQuanta**`)
        .setDescription(`${text}`)
        .setFooter({ text: `Powered by Google's Gemini AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply(
        "Your request is rejected, please be civil and friendly",
      );
    }
  },
};
