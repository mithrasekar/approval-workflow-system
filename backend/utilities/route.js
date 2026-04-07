const express = require('express');
const globalRouter = express.Router();

class RouteBuilder {
    static withOutSecurity() {
        return new RouteBuilder();
    }
    
    noAuth() {
        return this;
    }
    
    post(path, handler) {
        globalRouter.post(path, async (req, res) => {
            try {
                const resultObj = await handler(req, res);
                if (resultObj && typeof resultObj.send === 'function') {
                    resultObj.send(res);
                } else if (resultObj && resultObj.status !== undefined) {
                    res.status(resultObj.statusCode || 200).json(resultObj);
                }
            } catch (err) {
                res.status(500).json({ status: false, message: "Internal Server Error", error: err.toString() });
            }
        });
        return this;
    }

    get(path, handler) {
        globalRouter.get(path, async (req, res) => {
            try {
                const resultObj = await handler(req, res);
                if (resultObj && typeof resultObj.send === 'function') {
                    resultObj.send(res);
                } else if (resultObj && resultObj.status !== undefined) {
                    res.status(resultObj.statusCode || 200).json(resultObj);
                }
            } catch (err) {
                res.status(500).json({ status: false, message: "Internal Server Error", error: err.toString() });
            }
        });
        return this;
    }

    bind() {
        return globalRouter;
    }
}

RouteBuilder.globalRouter = globalRouter;
module.exports = RouteBuilder;
