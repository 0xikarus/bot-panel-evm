import { spawn, fork } from 'child_process';
import { dirname } from 'path';


import process from "process"
console.log("running in", dirname("/"));

/***************************************
                Setup
***************************************/
function run_script(command, args, onData = (data) => false, doLogs = false) {
    console.log("Starting Process.");

    let child = undefined;
    let isPending = false;
    let scriptOutput = "";
    function kill() {
        if (child != undefined) {
            child.kill('SIGINT');
        } else {
            console.log("no child process to kill");
        }
    }
    function pending() {
        return isPending;
    }

    const promise = new Promise(function (resolve, reject) {
        child = spawn(command, [...args]);
        console.log(child)
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            isPending = true;
            data = data.toString();
            console.log(">" + data);
            scriptOutput += data;
            onData(data);
        });
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', function (data) {
            data = data.toString();
            scriptOutput += data;
            onData(data);
        });
        child.on('close', function (code) {
            console.log("close", code);
            isPending = false;
            return resolve([code, scriptOutput]);
        });

        child.on('message', (m) => {
            console.log('PARENT got message:', m);
        });
    });

    return [promise, pending, kill, child]
};

export default run_script;