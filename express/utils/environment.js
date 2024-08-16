import _ from "lodash-es";

class Environment {
    data = {};
    env = {};
    file = "";

    setData(data) {
        this.data = data;
    }
    async loadFromFile(file) {
        this.data = {
            ...this.data,
            ...(await import(file)).default,
        };
    }

    static async create(data = {}, file = "../config/environment.js") {
        const env = new this({});

        return env.loadFromFile(file).then(() => {
            env.applyEnv(data);

            return env;
        });
    }

    async load(data = {}, file = "../config/environment.js") {
        this.setData(data);
        return this.loadFromFile(file).then(() => {
            this.applyEnv(data);

            return this;
        });
    }

    applyEnv(data) {
        var k, v;
        for (k in data) {
            if ((v = data[k]) !== undefined) {
                var setKey = _.replace(k.toLowerCase(), /_/g, ".");
                _.set(this.data, setKey, v);
            }
        }
    }
    all() {
        return { ...this.data };
    }
    get(key) {
        return _.get({ ...this.data }, key);
    }
    set(key, val) {
        _.set(this.data, key, val);
    }
}

let _instance = null;

export function getEnvironment() {
    if (!_instance) {
        _instance = new Environment();
    }
    return _instance;
}
export async function createEnvironment(data) {
    const i = getEnvironment();
    return i.load(data);
}

export function env(...xs) {
    const e = getEnvironment();
    if (xs.length === 0) {
        return e.all();
    } else if (xs.length === 1) {
        return e.get(xs[0]);
    } else if (xs.length === 2) {
        return e.set(xs[0], xs[1]);
    } else {
        throw new Error("App.env(), 3 parameters given");
    }
}
