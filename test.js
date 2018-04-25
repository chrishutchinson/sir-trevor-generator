(function() {
  // Initialise the block
  var block = new SirTrevorBlock("Cardname", "cardname");

  // Setup all attributes, icons, properties and components
  block
    .setProperty('nonDeletable')
    .setIcon("fa-pencil")
    .setComponent("text", {
      label: "Text",
      type: "text",
      placeholder: "",
      default: "",
      class: ""
    });

  // Build our block
  block.buildBlock();

  // Add the block to Sir Trevor
  SirTrevor.Blocks.Cardname = block.block;

  // Initialise the block
  var block = new SirTrevorBlock("Otherblock", "otherblock");

  // Setup all attributes, icons, properties and components
  block
    .setIcon("fa-pencil")
    .setComponent("text", {
      label: "Text",
      type: "text",
      placeholder: "",
      default: "",
      class: ""
    });

  // Build our block
  block.buildBlock();

  // Add the block to Sir Trevor
  SirTrevor.Blocks.Otherblock = block.block;

  var editor = new SirTrevor.Editor({
    el: $(".js-st-instance"),
    blockTypes: ["Cardname", "Otherblock"]
  });
})();
