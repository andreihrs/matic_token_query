const axios = require("axios");

axios
  .get(
    "https://api.covalenthq.com/v1/137/tokens/0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6/token_holders/?&key=ckey_1995beb2419b40f0a4f24d49b6f"
  )
  .then((response) => console.log(response.data.data));

// "Accept: application/json" )
