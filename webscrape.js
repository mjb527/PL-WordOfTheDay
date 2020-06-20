// request modules
const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
  uri: `https://www.polishpod101.com/polish-phrases/`,
  transform: function (body) {
    return cheerio.load(body);
  }
};

let wotd_data = {};

rp(options)
    .then(function (data) {
      const $ = cheerio.load(data._root.children[1].children);

      // rows of Polish and English translation
      const pRows = $('.r101-wotd-widget__word');
      const eRows = $('.r101-wotd-widget__english');

      const word = formatText(pRows[0].children[0].data);
      const translation = formatText(eRows[0].children[0].data);
      const partOfSpeech = formatText($('.r101-wotd-widget__class').text().trim());

      const examples = [];

      console.log(`${word} - ${translation} - ${partOfSpeech}`);

      for(let i = 1; i < pRows.length; i++) {
        // get the text, capitalize first letter
        let polish = formatText(pRows[i].children[0].data);
        let english = formatText(eRows[i].children[0].data)

        examples.push({"polish" : polish,
         "english" : english});
        console.log(examples[i-1].polish + ' - ' + examples[i-1].english);
      }

      wotd_data.word = word;
      wotd_data.translation = translation;
      wotd_data.partOfSpeech = partOfSpeech;
      wotd_data.examples = examples;

    })
    .catch(function (err) {
      console.log(err);
      // TODO write error to page instead of the word of the day stuff
      return;
        // REQUEST FAILED: ERROR OF SOME KIND
    });

function formatText(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
