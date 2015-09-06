import path from "path"
import fs from "fs"
import toml from "toml"

process.env.NODE_ENV = process.env.NODE_ENV || "development"

let configName = process.env.NODE_ENV

if (process.env.NODE_ENV === "development") {
  configName = "dev"
} else if (process.env.NODE_ENV === "production") {
  configName = "prod"
}

const config = toml.parse(fs.readFileSync(path.resolve("conf/" + configName + ".toml"), "utf8"))

export default config
