import ora from "ora";
import inquirer from "inquirer";
import fs from "fs";
import clear from "clear";
import axios from "axios";

import FormData from "form-data";

clear();
console.log("Please enter in the route to the file you wish to upload!");
upload();

function upload() {
  inquirer
    .prompt([
      {
        name: "route (filepath)",
        type: "input",
      },
      {
        name: "fixed name (leave blank if none)",
        type: "input",
      },
    ])
    .then(async (answer) => {
      let response = answer["route (filepath)"].trim();
      let fixed =
        answer["fixed name (leave blank if none)"].trim() === ""
          ? null
          : answer["fixed name (leave blank if none)"].trim();
      try {
        if (!fs.readFileSync(response)) {
          console.log("Sorry but there is not file in that location!");
          return setTimeout(() => {
            upload();
          }, 500);
        }
      } catch {
        console.log("Sorry but there is not file in that location!");
        return setTimeout(() => {
          upload();
        }, 500);
      }
      clear();

      let file = fs.readFileSync(response);

      const form = new FormData();
      form.append(
        "file",
        file,
        `${
          fixed ? `${fixed.split(".")[0]}` : response.split(".").slice(-2)[0]
        }.${response.split(".").slice(-1)}`
      );

      const spinner = ora("Uploading file...").start();
      spinner.color = "yellow";

      return axios
        .post(
          `http://0.0.0.0:3000/api/upload?emoji=false&fixed=${
            fixed ? "true" : "false"
          }`,
          form,
          {
            headers: { ...form.getHeaders() },
          }
        )
        .then((res) => {
          spinner.stopAndPersist({
            symbol: "✅",
            text: `Successfully uploaded @ ${res.data.data}`,
          });
        })
        .catch((err) => {
          spinner.stopAndPersist({
            symbol: "❌",
            text: `An error occurred while uploading file.\n${err}\n\n`,
          });
          console.error(err);
        });
    });
}
