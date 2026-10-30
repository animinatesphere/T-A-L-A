const fs = require('fs').promises;
const path = require('path');

const submissionsPath = path.join(__dirname, '..', 'data', 'test-submissions.json');
let writeQueue = Promise.resolve();

const readLocalTestSubmissions = async () => {
  try {
    const contents = await fs.readFile(submissionsPath, 'utf8');
    const submissions = JSON.parse(contents);
    if (!Array.isArray(submissions)) {
      throw new Error('Local test submissions data must be a JSON array.');
    }
    return submissions;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const saveLocalTestSubmission = async (submission) => {
  const save = async () => {
    const submissions = await readLocalTestSubmissions();
    submissions.unshift(submission);
    await fs.mkdir(path.dirname(submissionsPath), { recursive: true });
    const temporaryPath = `${submissionsPath}.${process.pid}.tmp`;
    await fs.writeFile(temporaryPath, `${JSON.stringify(submissions, null, 2)}\n`);
    await fs.rename(temporaryPath, submissionsPath);
    return submission;
  };

  const operation = writeQueue.then(save);
  writeQueue = operation.catch(() => {});
  return operation;
};

module.exports = { readLocalTestSubmissions, saveLocalTestSubmission };
