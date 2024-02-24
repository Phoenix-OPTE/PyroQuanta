const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("./../../config/config.json");
const model = require("./../model/gemini-pro.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("letter-writer")
    .setDescription("Write letter for you")
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("person to letter, eg. sir, headmaster")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("subject")
        .setDescription("subject of letter, eg. leave application")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("details")
        .setDescription("explain some details, eg. i want leaves for vacation")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("your name, eg. Pheonix")
        .setRequired(true),
    ),

  async execute(interaction, client) {
    const to = interaction.options.getString("to");
    const subject = interaction.options.getString("subject");
    const details = interaction.options.getString("details");
    const from = interaction.options.getString("from");

    try {
      const result = await model.generateContent(
        `write a simple letter using following information: to ${to}, subject: ${subject}, details: "${details}" from: ${from}`,
      );
      const response = await result.response;
      const text = response.text();

      const embed = new EmbedBuilder()
        .setTitle(`**AI Letter Writer**`)
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
