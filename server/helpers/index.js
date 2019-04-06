
const errorMessage = (res, error, status = 500) => {
    const err = (typeof error === 'string') ? { message: error } : error;
    
    return res.status(status).json({
        ok: false,
        err
    })
};

const successMessage = (res, name, data, message, token, cant) => {
    let object = {
        ok:true,
        message,
        [name]: data
    };
    if(token) {
        object.token = token;

    } else if(cant) {
        object.cant = cant;
    }

    return res.json(object);
}

module.exports = {
    errorMessage,
    successMessage
}