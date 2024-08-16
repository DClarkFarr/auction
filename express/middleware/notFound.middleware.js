const notFound = (callback) => (_req, res) => {
    res.status(404);
    callback(res);
};

export default notFound;
