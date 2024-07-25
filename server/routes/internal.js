import express from 'express';
import taskRunner from "../models/task-runner.js";

const router = express.Router();

router.post('/:uniqueId', (req, res) => {
    if (req.hostname !== "localhost") return res.json({ status: "error", message: "invalid hostname" });
    console.log("req.params", req.params);
    const { uniqueId } = req.params;
    const { args } = req.body;
    console.log("uniqueId", uniqueId);
    console.log("args", args);

    const task = taskRunner.getTaskByTriggerId(uniqueId);
    console.log("task", task);
    if (task) {
        console.log("trigger successful");
        task.runModule(args || []);

        return res.json({
            status: "success"
        });
    };

    res.json({
        status: "weird"
    });
});

export default router;
