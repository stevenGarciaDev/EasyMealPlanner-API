function adminTokenAuth(req, res, next) {
    try {
        if (req.user.isAdmin) {
            next();
        } else {
            throw "Error";
        }
    } catch (ex) {
        res.status(400).send('Invalid admin token.');
    }
}

module.exports = adminTokenAuth;