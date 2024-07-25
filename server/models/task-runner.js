import run_script from "../libs/run-script.js";
import dotenv from 'dotenv';
dotenv.config();
import SparkMD5 from "spark-md5";

import AccountHandler from "./accounts.js"

const callbackHost = "localhost:" + process.env.PORT;

const timeSinceStart = Date.now();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Task {
    constructor(task) {
        this.id = task.id;
        this.name = task.name;
        this.trigger = task.trigger;
        this.module = task.module;

        this.triggerRunning = false;



        this.proc = null;
        this.kill = undefined;
        this.uniqueId = undefined;

        this.addresses = [];
        this.triggerLogs = [];


        this.moduleLogs = [];
        this.moduleData = [];

        this.killModule = undefined;

        if (task.running) {
            this.run();
        }
    }
    _onTriggerData(data) {
        console.log("data->", data);
        this.triggerLogs.push(data);
    }
    _resetTrigger() {
        if (this.moduleRunning) return;
        this.proc = null;
        this.kill = undefined;
        this.uniqueId = undefined;
    }
    get moduleRunning() {
        let running = false
        for (let index = 0; index < Object.keys(this.moduleData).length; index++) {
            const moduleInstance = this.moduleData[index];
            if (moduleInstance.pending() == true) {
                running = true;
                break;
            }
        }
        return running;
    }
    get running() {
        return (this.triggerRunning || this.moduleRunning);
    }


    _triggerExit() {
        console.log("exit called from script");
        //this._resetTrigger();
        this.triggerRunning = false;

        this.proc = null;
        this.kill = undefined;
    }

    _onModuleData(data) {
        console.log("module data->", data);
        this.moduleLogs.push(data);
    }
    _onModuleExit(id) {
        console.log("module exit called from script", id);
    }
    runModule(args) {
        console.log("run module per address");
        if (this.moduleRunning) return console.log("already running?");


        for (let index = 0; index < this.addresses.length; index++) {
            const address = this.addresses[index];
            const privateKey = AccountHandler.getPrivateKey(address);
            const [promise, pending, kill, child] = run_script("node", ["./modules/" + this.module, privateKey], (data) => this._onModuleData(data));
            this.moduleData[index] = {
                child: child,
                promise: promise,
                kill: kill,
                pending: pending
            }
            promise.then(() => this._onModuleExit(index));
        }
    }

    addAddress(address) {
        this.addresses.push(address);
    }
    removeAddress(address) {
        this.addresses = this.addresses.filter(item => item !== address);
    }

    async run() {
        if (this.heartbeat != undefined || this.proc != null) return;
        console.log("running task trigger script ", this.trigger, "taskid", this.id, "callbackHost", callbackHost, "running", this.running);
        const uniqueId = SparkMD5.hash("ID " + (this.id + Date.now() - timeSinceStart));
        this.uniqueId = uniqueId;
        const [promise, pending, kill, child] = run_script("node", ["./triggers/" + this.trigger, callbackHost, uniqueId], (data) => this._onTriggerData(data));
        
        promise.then(result => this._triggerExit());
        await sleep(1000);
        console.log("promise", promise);
        if (pending() == true && this.running == false) {
            this.triggerRunning = true;
            this.proc = promise;
            this.killTrigger = kill;

        }

    }
    async enable() {
        return await this.run();
    }

    disable() {
        if (this.triggerRunning == true && this.killTrigger !== undefined) {
            this.killTrigger();
        }
        if (this.moduleRunning == true) {
            for (let index = 0; index < Object.keys(this.moduleData).length; index++) {
                const moduleInstance = this.moduleData[index];
                moduleInstance.kill();
            }
        }
    }

}


class TaskRunner {
    constructor() {
        this.tasks = [];
        this.activeTasks = [];
    }
    getTasks() {
        return this.tasks;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    generateId() {
        let id = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const length = 8;
        for (let i = 0; i < length; i++) {
            id += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return id;
    }

    newId() {
        let id = this.generateId();
        while (this.tasks.find(task => task.id === id)) {
            id = this.generateId();
        }
        return id;
    }
    runTaskScript(task) {
        console.log("run task script", task);
    }

    addTask(_task) {
        console.log("add task", _task);
        const id = this.newId();

        const task = new Task({
            id: id,
            name: _task.name,
            trigger: _task.trigger,
            module: _task.module,
            running: false
        });

        console.log("id", id);
        this.tasks.push(task);

        return task;
    }

    run() {
        this.tasks.forEach(task => {
            task.run();
        });
    }

    async enableTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            await task.enable();
        }
    }

    async disableTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            await task.disable();
        }
    }

    getTaskByTriggerId(uniqueId) {
        return this.tasks.find(task => task.uniqueId === uniqueId);
    };

    _validateTasks(tasks) {
        if (!Array.isArray(tasks)) {
            return [];
        }
        let _tasks = tasks.map(task => {
            if (!task.name || !task.trigger || !task.module) {
                return undefined;
            }

            if (task.addresses && Array.isArray(task.addresses)) {
                for (let index = 0; index < task.addresses.length; index++) {
                    const address = task.addresses[index];
                    if (AccountHandler.accountExists(address) == false) {
                        task.removeAddress(address);
                    }
                }
            }
            task.addresses = task.addresses.map(address => {
                if (AccountHandler.accountExists(address) == false) {
                    return undefined;
                }
                return address;
            }).filter(address => address !== undefined);

            return task;
        }).filter(task => task !== undefined);

        return _tasks;
    }
}

export default new TaskRunner();