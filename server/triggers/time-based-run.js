import axios from "axios";
import process from "process"

const callbackHost = process.argv[2];
const unique_id = process.argv[3];


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
(async () => {
    try {
        console.log("RUNNING!!")

        // insert arbitrary code here

        await sleep(2000);
        console.log("ping")

        await axios.post(`http://${callbackHost}/internal/${unique_id}`);

        process.exit(1);
    } catch (f) {
        console.log(f)

    } finally {
        console.log("end")
        process.exit(1);
    }
})();