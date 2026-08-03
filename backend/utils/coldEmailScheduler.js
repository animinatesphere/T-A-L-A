const { processColdEmailSends, detectReplies } = require("./coldEmailEngine");

let coldEmailTick = 0;

function startColdEmailEngine() {
  const tick = async () => {
    try {
      await processColdEmailSends();
    } catch (e) {
      console.error("Cold email send error:", e.message);
    }

    coldEmailTick++;
    if (coldEmailTick % 5 === 0) {
      try {
        await detectReplies();
      } catch (e) {
        console.error("Reply detection error:", e.message);
      }
    }
  };
  tick();
  setInterval(tick, 2 * 60 * 1000);
}

module.exports = { startColdEmailEngine };
