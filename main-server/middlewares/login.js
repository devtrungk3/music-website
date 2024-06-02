const loginValidation = (req, res, next) => {
    const { username , password } = req.body;
    
    const errors = [];
    
    /**
     * check missing data
     */
    if (!username) errors.push({ field: 'username', message: 'missing data' });
    if (!password) errors.push({ field: 'password', message: 'missing data' });
    /**
     * check data length
     */
    if (username && (username.length < 5 || username.length > 255)) {
        errors.push({ field: 'username', message: 'username must be between 5 - 255 characters' });
    }
    if (password && (password.length < 5 || password.length > 255)) {
        errors.push({ field: 'password', message: 'password must be between 5 -255 characters' });
    }
    /**
     * check data format
     */
    if (!/^[a-zA-Z][a-zA-Z0-9/]+$/.test(username)) {
        errors.push({ field: 'username', message: 'username must follow specified format a-z, A-Z, 0-9' });
    }
    if (!/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/.test(password)) {
        errors.push({ field: 'password', message: 'password must follow specified format a-z, A-Z, 0-9, !@#$%^&*()_+=-.' });
    }
    if (errors.length != 0) return res.status(400).json(errors);
    next();
}

module.exports = { loginValidation };