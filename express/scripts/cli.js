import path from "path";
import dotenv from "dotenv";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, "..", ".env");

dotenv.config({
    path: directory,
});

import commandLineArgs from "command-line-args";
import { createEnvironment } from "../utils/environment.js";
import { app } from "../app.js";

/**
 * Parse CLI arguments
 * 
 * Command structure [arguments] [flags & options]
 * Arguments: Sequential values.
 *      Example: node script1.js arg1 arg2 arg3
 * Flags: true if sent, false if ommited.  
 *      Truthy example: script2.js --flagSent 
 *      Falsy example: script.js 
 * 
 * Options: Parsed by command-line-args 
 *      Examples: --param1 one --param2=two
 * 
 * Outputs combined key value pairs of all
 * 
 * Example Command 
 * $ node scripts/create-account.js one two three five ten --four  --six=seven --eight nine
 * 
 * Example Config for Above Command 
    const args = parseArgs({
        args: ['one-half', 'one', 'one-and-one-half', 'two-and-one-half', 'five'],
        options: [
            { name: 'six', type: String },
            { name: 'eight', type: String }
        ],
        flags: ['four'],
    });
 */

const parseArgs = ({ options, flags, args }) => {
    flags = flags || [];
    args = args || [];

    let input = [...process.argv].slice(2);

    const matchedArgs = {};
    if (args.length) {
        input = input.reduce((acc, item, index) => {
            if (typeof args[index] !== "undefined") {
                matchedArgs[args[index]] = item;
                return acc;
            }

            acc.push(item);
            return acc;
        }, []);
    }

    const matchedFlags = {};
    if (flags) {
        flags.forEach((flag) => {
            matchedFlags[flag] = false;
        });
        input = input.reduce((acc, item) => {
            const isOptionType = item.indexOf("--") === 0;
            if (flags && isOptionType) {
                var flag = item.slice(2).toLowerCase();
                if (flags.indexOf(flag) > -1) {
                    matchedFlags[flag] = true;
                    return acc;
                }
            }

            acc.push(item);
            return acc;
        }, []);
    }

    const matchedOptions = commandLineArgs(options, {
        argv: input,
        partial: true,
    });

    const missingOptions = options.reduce((acc, obj) => {
        if (obj.required && typeof matchedOptions[obj.name] === "undefined") {
            acc.push(obj.name);
        }
        return acc;
    }, []);

    if (missingOptions.length) {
        throw new Error(
            "Parse args missing required options: " + missingOptions.join(", ")
        );
    }

    return {
        ...matchedOptions,
        ...matchedFlags,
        ...matchedArgs,
    };
};

await createEnvironment({
    PORT: process.env.PORT,
    ENV: process.env.ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
});

export { app, parseArgs };
