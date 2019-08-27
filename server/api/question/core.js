const mongo = require('./mongo');
const conf = require('./config');

/**
 * gets a question with a certain id
 * @typedef {Object} GetOptions
 * @prop {number} maxAnswers
 * @param {string} id
 * @param {GetOptions} options
 * @returns {mongo.Question} 
 */
async function get(id, options) {
  let q = mongo.model.findById(id);
  q.populate('answers');

  let maxAnswers = conf.maxAnswers;
  if(typeof options === 'object' && options !== null) {
    if(typeof options.maxAnswers === 'number')
      maxAnswers = options.maxAnswers;
  }

  /**@type {mongo.Question} */
  let question = await q.exec();

  if(maxAnswers > 1) {
    if(question.answers.length > maxAnswers) {
      let selectedAnswers = [];
      let correctAnswers = question.answers
      .filter(answ => answ.correct);
  
      for(let i = 0; i < Math.trunc(Math.random() * maxAnswers); i++) {
        let index = Math.trunc(Math.random() * correctAnswers.length);
        let answ = correctAnswers[index];
        selectedAnswers.push(answ);
        correctAnswers.splice(index, 1);
      }
  
      if(selectedAnswers.length < maxAnswers) {
        let restAmount = maxAnswers - selectedAnswers.length;

        let wrongAnswers = question.answers
        .filter(answ => !answ.correct);

        for(let i = 0; i < restAmount; i++) {
          let index = Math.trunc(Math.random() * wrongAnswers.length);
          let answ = wrongAnswers[index];
          selectedAnswers.push(answ);
          correctAnswers.splice(index, 1);
        }
      }
      question.selectedAnswers = selectedAnswers;
    }
  };

  return question;
}

module.exports.get = get;