import express from 'express';
import fs, { stat } from 'fs';
import path from 'path';
import TaskRunner from '../models/task-runner.js';
import AccountHandler from "../models/accounts.js";
const router = express.Router();

router.post('/create-task', async (req, res) => {
    try {
        const { name, trigger, module, running } = req.body;

        const task = TaskRunner.addTask({
            name,
            trigger,
            module,
            running
        });

        return res.json({
            status: "success",
            task: {
                id: task.id,
                name: task.name,
                trigger: task.trigger,
                module: task.module,
                running: task.running,
                addresses: task.addresses
            }
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error creating task"
        });
    }
});


router.get('/get-all-module', async (req, res) => {
    try {

        const files = fs.readdirSync("./modules/");

        console.log("module files", files);

        return res.json({
            status: "success",
            files: files
        });

    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error populating modules"
        });
    }
});

router.get('/get-all-trigger', async (req, res) => {
    try {

        const files = fs.readdirSync("./triggers/");

        console.log("trigger files", files);

        return res.json({
            status: "success",
            files: files
        });

    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error populating files"
        });
    }
});


router.get('/list', async (req, res) => {
    try {


        const tasks = TaskRunner._validateTasks(TaskRunner.getTasks());
        console.log("tasks", tasks);

        return res.json({
            status: "success",
            tasks: tasks.map(task => ({
                id: task.id,
                name: task.name,
                trigger: task.trigger,
                module: task.module,
                running: task.running,
                addresses: task.addresses
            }))
        });

        // Rest of the code...
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error generating task"
        });
    }
});

router.post('/ping', async (req, res) => {
    console.log("req.body", req.body);

    try {
        return res.json({
            pong: true
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: false,
            token: "",
            reason: "Error"
        });
    }
});


(async () => {
    setTimeout(() => {

        if (TaskRunner.tasks.length == 0) {
            const task = TaskRunner.addTask(
                {
                    name: "aggregateETH",
                    trigger: "time-based-run.js",
                    module: "aggregate-eth.js",
                    running: false,
                }
            )

            task.addAddress(AccountHandler.getAllAddresses()[0]);
        }

    }, 2000);


})();

router.get('/id/:taskId/module', async (req, res) => {
    try {
        const task = TaskRunner.getTaskById(req.params.taskId);
        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }
        const fileName = task.module;
        const fileContent = fs.readFileSync(`./modules/${fileName.replace("./modules/", "")}`, 'utf-8');

        return res.json({
            status: "success",
            code: fileContent
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error retrieving file content"
        });
    }
});
router.get('/id/:taskId/trigger', async (req, res) => {
    try {
        const task = TaskRunner.getTaskById(req.params.taskId);
        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }
        const fileName = task.trigger;
        const fileContent = fs.readFileSync(`./triggers/${fileName.replace("./triggers/", "")}`, 'utf-8');

        return res.json({
            status: "success",
            code: fileContent
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error retrieving file content"
        });
    }
});


router.post('/id/:id/add-addresses-to-task', async (req, res) => {
    try {
        const taskId = req.params.id;
        const addresses = req.body.addresses;

        const task = TaskRunner.getTaskById(taskId);

        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }
        for (let index = 0; index < addresses.length; index++) {
            const address = addresses[index];
            if (!task.addresses.includes(address)) {
                task.addAddress(address);
            }
        }

        return res.json({
            status: "success",
            message: "Address added to task"
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error adding address to task"
        });
    }
});

router.post('/id/:id/remove-address-from-task', async (req, res) => {
    try {
        const taskId = req.params.id;
        const address = req.body.address;
        console.log("address", address);
        console.log("taskId", taskId);
        const task = TaskRunner.getTaskById(taskId);
        console.log("task", task);
        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }

        task.removeAddress(address);

        return res.json({
            status: "success",
            message: "Address deleted from task"
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error deleting address from task"
        });
    }
});

router.get('/id/:id/get', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = TaskRunner.getTaskById(taskId);

        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }

        return res.json({
            status: "success",
            task: {
                id: task.id,
                name: task.name,
                trigger: task.trigger,
                module: task.module,
                running: task.running,
                addresses: task.addresses
            }
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error retrieving task"
        });
    }
});

router.get("/id/:id/get-trigger-logs", async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = TaskRunner.getTaskById(taskId);
        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }

        return res.json({
            status: "success",
            logs: [...task.triggerLogs]
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error retrieving logs"
        });
    }
});
router.get("/id/:id/get-module-logs", async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = TaskRunner.getTaskById(taskId);
        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }

        return res.json({
            status: "success",
            logs: [...task.moduleLogs]
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error retrieving logs"
        });
    }
});

router.post('/id/:id/enable', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = TaskRunner.getTaskById(taskId);

        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }

        await task.enable();

        return res.json({
            status: "success",
            message: "Task enabled"
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error enabling task"
        });
    }
});

router.post('/id/:id/disable', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = TaskRunner.getTaskById(taskId);

        if (!task) {
            return res.json({
                status: "error",
                reason: "Task not found"
            });
        }

        await task.disable();

        return res.json({
            status: "success",
            message: "Task disabled"
        });
    } catch (error) {
        console.log("error", error);
        return res.json({
            status: "error",
            reason: "Error disabling task"
        });
    }
});


export default router;
