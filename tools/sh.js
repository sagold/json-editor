const { exec } = require('child_process');

/**
 * Executes a shell command
 * @param  {String} command     - shell command to execute
 * @param  {String} directory   - directory of command execution
 * @return {Promise} resolves {String} stdout or rejects with the error
 */
module.exports = async function sh(command, directory = process.cwd()) {
    return new Promise((resolve, reject) => {
        exec(
            command,
            { cwd: directory, env: Object.assign(process.env, { LC_ALL: 'C' }) },
            function (error, stdout, stderr) {
                if (error) {
                    reject({ error: error, message: error.message, stdout: stdout, stderr: stderr });
                } else {
                    resolve(stdout);
                }
            }
        );
    });
};
